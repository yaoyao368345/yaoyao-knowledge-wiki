# Supervised learning：从输入到输出的映射

> Supervised learning learns a mapping from input **x** to output **y**.

---

这句话是机器学习领域的经典定义句。下面按结构讲解，重点放在 **supervised learning** 和 **learn a mapping from ... to ...** 这两个核心表达上。

---

## 1. 音标

- **supervised**：英 /ˈsuːpəvaɪzd/，美 /ˈsuːpərvaɪzd/
- **learning**：英 /ˈlɜːnɪŋ/，美 /ˈlɜːrnɪŋ/
- **mapping**：英 /ˈmæpɪŋ/，美 /ˈmæpɪŋ/

整句连读：
/ˈsuːpəvaɪzd ˈlɜːnɪŋ lɜːnz ə ˈmæpɪŋ frəm ˈɪnpʊt eks tə ˈaʊtpʊt waɪ/

---

## 2. 核心含义

**监督学习学习的是从输入 x 到输出 y 的一种映射关系。**

即：给模型大量「输入—正确输出」配对样本，让它学会一个函数 f，使得 f(x) ≈ y。

---

## 3. 详细释义

### supervised learning（名词短语）
**监督学习**——机器学习的一类方法，训练数据带有标签（label）。

- *Supervised learning requires labeled data.*
  监督学习需要带标签的数据。
- *Image classification is a typical supervised learning task.*
  图像分类是典型的监督学习任务。

### learn（动词）
此处意为**习得、学会（一种规律/函数）**，不是「学习某门课程」。

- *The model learns a mapping from x to y.*
  模型学会了从 x 到 y 的映射。
- *Neural networks can learn complex patterns.*
  神经网络能学到复杂的模式。

### a mapping（名词）
**映射**——数学/计算机术语，指一种对应关系：每个输入对应一个输出。

- *This mapping is often nonlinear.*
  这种映射通常是非线性的。
- *We approximate the true mapping with a function f.*
  我们用一个函数 f 逼近真实映射。

### from input x to output y（介词短语）
**从输入 x 到输出 y**——描述映射的方向和两端。

- *The function maps from input x to output y.*
  该函数把输入 x 映射到输出 y。

---

## 4. 常见搭配

| 搭配 | 含义 |
|---|---|
| supervised learning | 监督学习 |
| unsupervised learning | 无监督学习 |
| reinforcement learning | 强化学习 |
| learn a mapping from A to B | 学习从 A 到 B 的映射 |
| input/output space | 输入/输出空间 |
| labeled training data | 带标签的训练数据 |

---

## 5. 词源记忆

- **supervise** = super-（在上）+ vis-（看，同 vision）→「在上面看着」→ 监督。
  监督学习 = 有「老师」在旁边给出正确答案（标签）来监督。
- **mapping** 来自 **map**（地图）。地图就是把真实地点「对应」到纸上 → 引申为「映射」。
  记忆：**地图 = 地点到纸面的映射**。
- **learn** 古英语 *leornian*，本义「获得知识/经验」。

---

## 6. 近义辨析

| 词 | 区别 |
|---|---|
| **mapping** | 强调「对应关系」本身，偏数学/抽象 |
| **function** | 强调「函数」，是 mapping 的一种形式化表达 |
| **model** | 强调「模型」，是学到的 mapping 的载体 |
| **transformation** | 强调「变换」，侧重改变而非对应 |

例句对比：
- *The model learns a mapping.*（学到的是一种对应关系）
- *The model is a function f.*（模型本身是一个函数）
- *This is a linear transformation.*（强调变换性质）

---

## 7. 用法提示

1. **学术/技术语境**：这是论文、教材中的标准书面表达，非常正式。
2. **x 和 y 的读法**：口语中读作 "input x" / "output y"，x 读 /eks/，y 读 /waɪ/。
3. **单复数**：learning 作「学习」时不可数；作「学问」时可说 *a learning*（较少见）。
4. **英式 vs 美式**：本句无显著差异，仅 supervised 的美音多卷舌 /r/。
5. **常见变体**：
   - *Supervised learning learns a function f: X → Y.*
   - *Supervised learning aims to learn a mapping from inputs to outputs.*

---

**一句话总结**：这句话用最精炼的方式定义了监督学习——**它学的是一个从输入到输出的映射函数**。记住 mapping = 地图式的对应关系，就抓住了核心。
