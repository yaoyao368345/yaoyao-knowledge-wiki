import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

// Exercise the production helpers without booting the router or a browser.
const source = readFileSync(new URL('../quartz/components/scripts/spa.inline.ts', import.meta.url), 'utf8');
const start = source.indexOf('let progressTimer:');
const end = source.indexOf('let isNavigating =', start);
assert.ok(start >= 0 && end > start, 'navigation feedback helpers must exist');
const { code } = transformSync(source.slice(start, end), { loader: 'ts', target: 'es2022' });

function fakeClock() {
  let now = 0;
  let nextId = 0;
  const timers = new Map();
  return {
    setTimeout(callback, delay) {
      const id = ++nextId;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
    advance(milliseconds) {
      const target = now + milliseconds;
      while (true) {
        const next = [...timers].filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next) break;
        const [id, timer] = next;
        now = timer.at;
        timers.delete(id);
        timer.callback();
      }
      now = target;
    },
    get pending() { return timers.size; },
  };
}

function helpers({ reducedMotion = false, startViewTransition, animate = () => ({ cancel() {} }) } = {}) {
  const clock = fakeClock();
  const dataset = {};
  const document = {
    documentElement: { dataset },
    querySelector(selector) { return selector === '.center' ? { animate } : null; },
    startViewTransition,
  };
  const context = vm.createContext({
    document,
    window: { matchMedia: () => ({ matches: reducedMotion }) },
    setTimeout: clock.setTimeout,
    clearTimeout: clock.clearTimeout,
  });
  vm.runInContext(`${code}\nglobalThis.feedback = { startLoading, finishLoading, transitionPage };`, context);
  return { ...context.feedback, clock, dataset };
}

test('a new navigation cancels the prior completion timer and eventually clears its own state', () => {
  const feedback = helpers();
  feedback.startLoading();
  assert.equal(feedback.dataset.navigationState, 'loading');
  feedback.finishLoading();
  assert.equal(feedback.clock.pending, 1);
  feedback.clock.advance(150);

  feedback.startLoading();
  assert.equal(feedback.clock.pending, 0);
  feedback.clock.advance(200);
  assert.equal(feedback.dataset.navigationState, 'loading', 'old completion must not hide the next load');

  feedback.finishLoading();
  feedback.clock.advance(299);
  assert.equal(feedback.dataset.navigationState, 'complete');
  feedback.clock.advance(1);
  assert.equal(feedback.dataset.navigationState, undefined);
  assert.equal(feedback.clock.pending, 0);
});

test('reduced motion updates once without invoking either animation API', async () => {
  const feedback = helpers({
    reducedMotion: true,
    startViewTransition() { assert.fail('view transition must respect reduced motion'); },
    animate() { assert.fail('fallback animation must respect reduced motion'); },
  });
  let updates = 0;
  await feedback.transitionPage(async () => { updates++; });
  assert.equal(updates, 1);
});

test('a skipped view-transition animation does not reject or repeat a successful page update', async () => {
  let transitions = 0;
  let updates = 0;
  const feedback = helpers({
    startViewTransition(update) {
      transitions++;
      return {
        ready: Promise.reject(new Error('transition skipped')),
        finished: Promise.reject(new Error('transition interrupted')),
        updateCallbackDone: Promise.resolve().then(update),
      };
    },
    animate() { assert.fail('snapshot navigation must not also play the fallback'); },
  });
  await assert.doesNotReject(feedback.transitionPage(async () => { updates++; }));
  assert.equal(transitions, 1);
  assert.equal(updates, 1);
});

test('without View Transition API the page updates once before fallback, which the next load cancels', async () => {
  let updates = 0;
  let animations = 0;
  let cancellations = 0;
  let updated = false;
  const feedback = helpers({
    animate() {
      assert.equal(updated, true, 'the fallback must run after the asynchronous DOM update');
      animations++;
      return { cancel() { cancellations++; } };
    },
  });
  await feedback.transitionPage(async () => {
    updates++;
    await Promise.resolve();
    updated = true;
  });
  assert.equal(updates, 1);
  assert.equal(animations, 1);
  feedback.startLoading();
  assert.equal(cancellations, 1);
});

test('a real page-update failure remains observable rather than being treated as a skipped animation', async () => {
  const failure = new Error('DOM update failed');
  let updates = 0;
  const feedback = helpers({
    startViewTransition(update) {
      return {
        ready: Promise.reject(new Error('no snapshot')),
        finished: Promise.reject(new Error('no animation')),
        updateCallbackDone: Promise.resolve().then(update),
      };
    },
  });
  await assert.rejects(feedback.transitionPage(async () => { updates++; throw failure; }), error => error === failure);
  assert.equal(updates, 1);
});
