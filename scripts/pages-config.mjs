import fs from 'node:fs';
import yaml from 'js-yaml';
const url = process.env.PAGES_URL;
if(!url) throw new Error('PAGES_URL is required');
const config = yaml.load(fs.readFileSync('quartz.config.yaml','utf8'));
config.configuration.baseUrl = url.replace(/^https?:\/\//,'').replace(/\/$/,'');
fs.writeFileSync('quartz.config.yaml',yaml.dump(config));
