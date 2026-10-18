# Machine Learning — Week 2

## 1. Multiple Feature

When there are multiple features, represent the features as a vector:

$$
\vec{x}=[x_1,x_2,x_3,\cdots,x_n]
$$

where:

- $x_j$: the $j$-th feature
- $n$: number of features

For the $i$-th training example:

$$
\vec{x}^{(i)}
=
[x_1^{(i)},x_2^{(i)},\cdots,x_n^{(i)}]
$$

$x_j^{(i)}$ means the $j$-th feature of the $i$-th training example.

### Parameters

The weights can also be represented as a vector:

$$
\vec{w}=[w_1,w_2,w_3,\cdots,w_n]
$$

$b$ is a scalar (number).

### Model

$$
f_{\vec{w},b}(\vec{x})
=
\vec{w}\cdot\vec{x}+b
$$

The dot product is:

$$
\vec{w}\cdot\vec{x}
=
w_1x_1+w_2x_2+\cdots+w_nx_n
$$

So:

$$
f_{\vec{w},b}(\vec{x})
=
\sum_{j=1}^{n} w_jx_j+b
$$

This model is called **Multiple Linear Regression**.

> One feature → Linear Regression  
> Multiple features → Multiple Linear Regression


## 2. Linear Regression with Mutiple Variables

**Vectorization** makes code **shorter and faster** by taking advantage of optimized numerical operations and parallel computation.

### 1. Vectorized Model

For multiple linear regression:

$$  
f_{\vec{w},b}(\vec{x}) = \vec{w} \cdot \vec{x} + b  
$$

The dot product is:

$$  
\vec{w} \cdot \vec{x} = \sum_{j=1}^{n} w_j x_j  
$$

**Without vectorization:**

```python
f = 0
for j in range(n):
    f += w[j] * x[j]
f += b
```

**With vectorization:**

```python
f = np.dot(w, x) + b
```

### 2. Why Vectorization?

- **Shorter code:** Replaces explicit loops with vector operations.
    
- **Faster computation:** Uses optimized numerical libraries.
    
- **Parallel processing:** Can take advantage of modern CPU hardware and, with suitable libraries, GPUs.
    

### 3. Vectorized Gradient Descent

Without vectorization:

```python
for j in range(n):
    w[j] = w[j] - alpha * d[j]
```

With vectorization:

```python
w = w - alpha * d
```

Mathematically:

$$  
\vec{w} := \vec{w} - \alpha \vec{d}  
$$

where:

- $\alpha$: Learning rate
    
- $\vec{d}$: Vector of derivatives
    

> **Key idea:** Vectorization replaces element-by-element loops with efficient operations on entire vectors.

## 3. Gradient Descent for Multiple Regression

In multiple linear regression, there are **n weights** and **one bias**. Gradient descent updates all parameters to minimize the cost function.

### 1. Model and Cost Function

**Model:**

$$  
f_{\vec{w},b}(\vec{x})=\vec{w}\cdot\vec{x}+b  
$$

**Cost function:**

$$  
J(\vec{w},b)=\frac{1}{2m}\sum_{i=1}^{m}(f_{\vec{w},b}(\vec{x}^{(i)})-y^{(i)})^2  
$$

where:

- $n$: Number of features
    
- $m$: Number of training examples
    
- $\vec{w}$: Weight vector
    
- $b$: Bias
    

### 2. Gradient Descent

Update each weight $w_j$ and the bias $b$:

$$  
w_j:=w_j-\alpha\frac{\partial J(\vec{w},b)}{\partial w_j}  
$$

$$  
b:=b-\alpha\frac{\partial J(\vec{w},b)}{\partial b}  
$$

**Partial derivatives:**

$$  
\frac{\partial J}{\partial w_j}=\frac{1}{m}\sum_{i=1}^{m}(f_{\vec{w},b}(\vec{x}^{(i)})-y^{(i)})x_j^{(i)}  
$$

$$  
\frac{\partial J}{\partial b}=\frac{1}{m}\sum_{i=1}^{m}(f_{\vec{w},b}(\vec{x}^{(i)})-y^{(i)})  
$$

For $j=1,2,\ldots,n$.

All parameters should be updated **simultaneously** using the gradients calculated from the same parameter values.

### 3. Normal Equation

The **Normal Equation** is another method for finding the optimal parameters of linear regression.

- Does not require iterative gradient descent.
    
- Applies to linear least-squares regression, but not directly to algorithms such as logistic regression or neural networks.
    
- Can be computationally expensive when the number of features is large.
    
- May be used internally by machine learning libraries.
    

> **Key idea:** Gradient descent iteratively updates the weights and bias, while the Normal Equation solves linear least-squares regression without iterative gradient descent.

## 4. Feature Scaling

When features have **very different ranges of values**, gradient descent may converge slowly.

**Feature Scaling** transforms features into comparable ranges, helping gradient descent converge faster.

### 1. Why Feature Scaling?

- Large feature values usually correspond to smaller weights.
    
- Small feature values often correspond to larger weights.
    
- Different scales can make the cost function contours elongated, causing gradient descent to take a zigzag path.
    

After scaling, the cost function contours may become more circular, allowing faster convergence.

### 2. Scaling Methods

**1. Dividing by the Maximum**

$$  
x_{\text{scaled}}=\frac{x}{x_{\max}}  
$$

**2. Mean Normalization**

$$  
x_{\text{scaled}}=\frac{x-\mu}{x_{\max}-x_{\min}}  
$$

**3. Z-score Normalization**

$$  
x_{\text{scaled}}=\frac{x-\mu}{\sigma}  
$$

where:

- $\mu$: Mean (average value)
    
- $\sigma$: Standard deviation
    
- $x_{\max}$: Maximum value
    
- $x_{\min}$: Minimum value
    

### 3. When to Scale?

As a rule of thumb, try to keep features within comparable ranges, roughly around **-1 to +1**.

- Ranges like [-3, 3] or [-0.3, 0.3] are also acceptable.
    
- If a feature has a very large range, such as [-100, 100], consider scaling it.
    
- If a feature has a very small range, such as [-0.001, 0.001], consider scaling it too.
    

### 4. Avoid Data Leakage

**Calculate scaling parameters from the training set only.**

- **Training set:** Calculate the mean, standard deviation, maximum, and minimum.
    
- **Validation/Test set:** Use the same scaling parameters calculated from the training set.
    
- **New data:** Apply the same transformation without recalculating the parameters.
    

This prevents **data leakage** and ensures consistent feature scaling.

> **Key idea:** Fit the scaler on the training set, then use the same scaler to transform all other data.


### 5. Checking Gradient Descent Convergence

Visualize gradient descent using a **Learning Curve**.

- **X-axis:** Number of iterations
    
- **Y-axis:** Cost function $J(\vec{w},b)$
    

If gradient descent works correctly:

- Cost $J$ should decrease after each iteration.
    
- When the curve flattens out, gradient descent has approximately **converged**.
    
- If cost increases, the learning rate may be too large, or there may be a bug in the code.
    

**Automatic Convergence Test:**

If the decrease in cost is smaller than a small threshold $\epsilon$, gradient descent may have converged.

$$  
0 \leq J^{(k)}-J^{(k+1)} < \epsilon  
$$

where $\epsilon$ might be $10^{-3}$.

### 6. Choosing the Learning Rate

The learning rate $\alpha$ controls the step size of gradient descent.

- **Too small:** Slow convergence.
    
- **Too large:** Cost may oscillate or diverge.
    
- **Appropriate:** Cost decreases quickly and consistently.
    

**How to choose $\alpha$:**

1. Start with a very small learning rate to check whether the cost decreases. If it still increases, there may be a bug.
    
2. Try progressively larger learning rates, such as:
    
    $$  
    0.001 \rightarrow 0.003 \rightarrow 0.01 \rightarrow 0.03 \rightarrow 0.1  
    $$
    
3. Plot and compare their learning curves over several iterations.
    
4. Choose a relatively large learning rate that **decreases the cost quickly and consistently**, without oscillation or divergence.


> **Key idea:** Choose a learning rate that balances fast convergence and stability.
> 

![][assets/images/梯度下降三种学习率行为.png]