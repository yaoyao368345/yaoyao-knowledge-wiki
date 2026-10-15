# Machine Learning — Week 1

## 1. What is Machine Learning?

Machine learning gives computers the ability to learn from data without being explicitly programmed for every task.

Two major types of machine learning are:

- **Supervised Learning**
- **Unsupervised Learning**

---

## 2. Supervised and Unsupervised Learning

### 2.1 Supervised Learning

Supervised learning learns a mapping from input $x$ to output $y$.

Each training example contains:

- input $x$
- correct output or label $y$

The algorithm learns from these correct $(x, y)$ pairs and tries to predict $y$ for a new input $x$.

There are two major types of supervised learning:

#### Regression

Regression predicts a **number** from infinitely many possible values.

Examples:

- Predicting a house price
- Predicting temperature

#### Classification

Classification predicts a **category** from a small finite set of possible categories.

Examples:

- Spam or not spam
- Cat or dog
- Benign or malignant tumor

> Regression predicts numbers from many possible values, while classification predicts one of a limited number of categories.

---

### 2.2 Unsupervised Learning

In unsupervised learning, the data contains inputs $x$, but there are no output labels $y$.

The algorithm tries to find patterns or structures in the data by itself.

Common types include:

- **Clustering** — groups similar data points together
- **Anomaly Detection** — finds unusual data or events
- **Dimensionality Reduction** — reduces the amount of data while keeping important information

---

## 3. Linear Regression Model

Linear regression is a supervised learning algorithm used for regression problems.

It fits a straight line to the training data.

For linear regression with one input feature:

$$
f_{w,b}(x) = wx + b
$$

where:

- $x$ — input or **feature**
- $y$ — actual output or **target**
- $\hat{y}$ — prediction
- $w$ — parameter that controls the **slope**
- $b$ — parameter that controls the **y-intercept**
- $f$ — the model

The prediction is:

$$
\hat{y} = f_{w,b}(x)
$$

$y$ is the real target value, while $\hat{y}$ is the value predicted by the model.

### Training Set

The data used to train the model is called the **training set**.

A training example is written as:

$$
(x^{(i)}, y^{(i)})
$$

where $i$ means the i-th training example.

The total number of training examples is written as:

$$
m
$$

For example:

- $x^{(1)}$ → input of the first training example
- $y^{(1)}$ → target of the first training example

The superscript $(i)$ is an **index**, not a power.

---

## 4. Cost Function

The cost function measures how well the model fits the training data.

For one training example, the prediction error is:

$$
f_{w,b}(x^{(i)}) - y^{(i)}
$$

We square the error:

$$
\left(
f_{w,b}(x^{(i)}) - y^{(i)}
\right)^2
$$

Then we calculate the average squared error over the whole training set.

The cost function for linear regression is:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left(
f_{w,b}(x^{(i)}) - y^{(i)}
\right)^2
$$

This is called the **squared error cost function**.

The division by $2$ makes later derivative calculations simpler.

### Goal

We want to choose parameters $w$ and $b$ that make:

$$
J(w,b)
$$

as small as possible.

So the goal of training is:

$$
\min_{w,b} J(w,b)
$$

A smaller cost usually means that the predictions are closer to the real target values.

---

## 5. Gradient Descent

Gradient descent is an algorithm used to minimize the cost function.

It repeatedly updates the parameters $w$ and $b$.

$$
w \leftarrow
w - \alpha
\frac{\partial J(w,b)}{\partial w}
$$

$$
b \leftarrow
b - \alpha
\frac{\partial J(w,b)}{\partial b}
$$

Here, $\leftarrow$ means **assignment or update**.

It means:

> Take the old value and use it to calculate a new value.

The two parameters $w$ and $b$ should be updated **simultaneously**.

---

## 6. Learning Rate

$\alpha$ is called the **learning rate**.

It controls how large each step of gradient descent is.

### If $\alpha$ is too small

Gradient descent takes very small steps.

It can still reach the minimum, but training will be very slow.

### If $\alpha$ is too large

Gradient descent may overshoot the minimum.

The cost may increase instead of decrease, and gradient descent may fail to converge or even diverge.

Therefore, we need to choose an **appropriate learning rate**.

As gradient descent gets closer to a minimum, the derivative becomes smaller, so the update steps also become smaller.

---

## 7. Derivatives

The derivative tells us the slope of the cost function and helps gradient descent decide which direction to move.

For linear regression:

$$
\frac{\partial J(w,b)}{\partial w}
=
\frac{1}{m}
\sum_{i=1}^{m}
\left(
f_{w,b}(x^{(i)}) - y^{(i)}
\right)x^{(i)}
$$

and

$$
\frac{\partial J(w,b)}{\partial b}
=
\frac{1}{m}
\sum_{i=1}^{m}
\left(
f_{w,b}(x^{(i)}) - y^{(i)}
\right)
$$

If the derivative is positive, gradient descent decreases the parameter.

If the derivative is negative, gradient descent increases the parameter.

This moves the parameters toward a minimum of the cost function.

---

## 8. Gradient Descent for Linear Regression

Linear regression uses:

### Model

$$
f_{w,b}(x) = wx + b
$$

### Cost Function

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left(
f_{w,b}(x^{(i)}) - y^{(i)}
\right)^2
$$

### Gradient Descent

$$
w \leftarrow
w - \alpha
\frac{\partial J(w,b)}{\partial w}
$$

$$
b \leftarrow
b - \alpha
\frac{\partial J(w,b)}{\partial b}
$$

Repeat these updates until **convergence**.

Convergence means that $w$ and $b$ no longer change very much after each update.

For linear regression with the squared error cost function, the cost function is **convex**.

A convex cost function has only one global minimum.

Therefore, with an appropriate learning rate, gradient descent can converge to the **global minimum**.

---

## 9. Overall Training Process

The basic process is:

**Training Set**

$$
(x, y)
$$

↓

**Choose a Model**

$$
f_{w,b}(x) = wx + b
$$

↓

**Make Predictions**

$$
\hat{y} = f_{w,b}(x)
$$

↓

**Calculate the Cost**

$$
J(w,b)
$$

↓

**Use Gradient Descent**

Update $w$ and $b$

↓

**Repeat Until Convergence**

↓

**Get Trained Parameters $w$ and $b$**

The final trained model can then use a new input $x$ to make a prediction $\hat{y}$.