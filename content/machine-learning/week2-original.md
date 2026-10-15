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


## 2. Vectorization

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