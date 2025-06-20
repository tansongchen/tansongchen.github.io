---
title: Monte Carlo 模拟：带你走遍位形空间
date: 2019-07-29
categories: [物理, 化学]
cover: https://images.tansongchen.com/monte-carlo.webp
description: 最近对 Monte Carlo 方法的学习总结
---

# 为什么 Monte Carlo 模拟能获得体系的宏观性质？

## 经典统计力学中的物理量

在经典统计力学的框架中，一个物理量的期望值常常可以写成如下形式：

$$
\langle A\rangle=\int\mathrm dr P(r)A(r)
$$

其中 $r\in\mathbb R^{3N}$ 是 $N$ 粒子系统的位置矢量，$P(r)$ 是系统取这一位形的概率密度，$A(r)$ 是物理量在系统取这一位形时的取值。这样的积分应该如何进行数值计算呢？

显然，对于这种维数很高（$3N$ 维）的积分来说，通常的格点积分方法是不适用的。一个自然的思路似乎是，这样的积分可以用 Monte Carlo 方法计算。例如，在一维的情形下，积分等于许多不同随机点上函数值的平均值：

$$
I=\int_0^1f(x)\mathrm dx\approx\frac1L\sum_{i=1}^Lf(x_i)
$$

然而这样的思路也是行不通的：其原因在于，我们并不知道 $P(r)$ 的具体数值。例如在正则系综中，$P(r)$ 的具体表达式为：

$$
P(\mathbf r)=\frac{e^{-\beta U(\mathbf r)}}{Z}
$$

其中 $Z$ 是正则配分函数，它同样是一个高维的积分，无法知道它的具体数值，从而 $P(r)$ 是不清楚的。

## Metropolis 方法

然而在很多情况下，我们知道 $P(r)$ 的相对数值，也即给定 $r_1,r_2$, $P(r_1):P(r_2)$ 是可以计算的。针对这种情况，1953 年 Metropolis 提出了如下的算法：

我们仍然生成 $L$ 个随机点，但这 $L$ 个随机点并非均匀分布在位形空间内，而是按照 $P(r)$ 分布，也即在 $r_n$ 附近单位体积中的点数 $p_n$ 就约为 $P(r_n)$。这样，如果我们对这些点处的 $A(r)$ 的取值（而非 $P(r)A(r)$）进行平均，即

$$
\frac1L\sum_{i=1}^LA(\mathbf r_i)=\frac1L\sum_{n=1}^Np_nA(\mathbf r_n)\approx\sum_{n=1}^NP(\mathbf r_n)A(\mathbf r_n)
$$

可见后一式子就是标准 Monte Carlo 方法中取 $N$ 个点时对定积分的估计式。而在生成「按照 $P(r)$ 分布」的过程中，实际并不需要知道 $P(r)$ 的绝对数值，而是相对数值。

## Markov 链采样

设体系初始时刻处在 $r_0$ 位置，并通过不断的随机游走达到 $r_1,\cdots,r_s$ 等等位置。如果我们希望体系进行足够多次随机游走之后所经历的位置符合 *P*(**r**) 分布，那么应该如何进行这样的随机游走？首先，我们假设已经通过某种方法获得了一些符合 $P(r)$ 分布的样本，我们此时如果继续随机游走，不应该破坏这样的分布。这就要求从接下来的一个时间段内，某个位置 $r_1$ 流向 $r_2$ 的「概率流」$F$ 的大小应该等于 $r_2$ 流向 $r_1$ 的概率流的大小，也即 $F(1\to 2)=F(2\to 1)$。概率流的大小由三方面决定：

- 对于某个位置 $r$ 来说，它的概率密度 $P(r)$ 越大，它流向其他位置的几率就越大；以下我们将 $P(r_1)$ 简记为 $P(1)$；
- 在我们的模拟程序中生成某种特定移动的概率 $\alpha(1\to2)$；
- 生成移动之后，接受这种移动的概率 $\operatorname{acc}(1\to2)$。

因此，对于每一个 Markov 链上的移动来说，都需要满足如下的条件： $P(1)\alpha(1\to 2)\operatorname{acc}(1\to 2)=P(2)\alpha(2\to 1)\operatorname{acc}(2\to 1)$ 上式是进行任何 Monte Carlo 模拟的基础。如果我们可以按上式设计 $\alpha$ 和 $\operatorname{acc}$ 的具体数值，经过足够多的次数之后，所得到的位置的分布就会无限接近于 $P(r)$，从而可以计算物理量。而为了满足上式，我们只需要计算 $P(1):P(2)$ 是多少，并根据它调整 $\alpha,\operatorname{acc}$，因此避开了直接计算 $P(r)$ 的问题。

## 移动概率矩阵

在很多情况下，$\alpha$ 都是一个对称的矩阵，也即 $\alpha(1\to 2)=\alpha(2\to 1)$。例如，当我们进行一个 $x$ 坐标的随机移动时： $x_2=x_1+\eta$ 其中 $\eta$ 是一个在 $[-\delta,\delta]$ 内均匀分布的实数。此时，$\alpha(1\to 2)$ 有两种可能性：

- $|x_1-x_2|<\delta$：此时它们之间有可能通过一次随机移动互相转化，而这个移动的概率密度是 $1/2\delta$，因此 $\alpha(1\to 2)=\alpha(2\to 1)=1/2\delta$；
- $|x_1-x_2|>\delta$：此时 1 无法到达 2，2 也无法到达 1，所以 $\alpha(1\to 2)=\alpha(2\to 1)=1/2\delta$。


由于实际运用中许多随机移动都具有类似上面的形式，所以接下来如不作特殊说明，都认为 $\alpha(1\to 2)=\alpha(2\to 1)$，那么我们只需要使得 $P(1)\operatorname{acc}(1\to 2)=P(2)\operatorname{acc}(2\to 1)$ 即可。当然，很多情况下有可能使用一个非对称的 $\alpha$ 是更有利的，这个时候我们就需要根据它的具体形式调整相应的接受概率。

## 一个简单的 Monte Carlo 算法

以下我们用伪代码展示 Metropolis 给出的 Monte Carlo 算法：

```fortran
do i = 1, n_random_moves
  call try_to_move()
  r = random_number()
  if (r < min(1, exp(beta*U_new) / exp(beta*U_old))) then
    call accept_move()
  end if
  A_sum = A_sum + A
end do
A_average = A_sum / n_random_moves
```

其中 `try_to_move()` 是进行随机移动的算法，`accept_move()` 是接受移动并更新系统位形的算法，`r` 是 0 到 1 之间的随机数，使得 `r < min(1, exp(beta*U_new) / exp(beta*U_old))` 的概率正好为 `min(1, exp(beta*U_new) / exp(beta*U_old))` 。

# 不同系综中的 Monte Carlo 模拟

## NVE 系综

即微正则系综，$N,V,E$ 为常数。根据统计物理的基本知识，我们知道我们所要达成的分布是：

$$
P(r,p)=\delta(E-E(r,p))
$$

由于 Monte Carlo 不涉及粒子的动量，所以实际上关于位形的分布应该是：

$$
P(\mathbf r)=\begin{cases}
\mathrm{const.}&U(\mathbf r)<E\\
0&U(\mathbf r)>E
\end{cases}
$$

所以我们所要设计的接受概率也非常简单：

$$
\mathrm{acc}(1\to2)=\begin{cases}
1&U(2)<E\\
0&U(2)>E
\end{cases}
$$

## NVT 系综

此时关于位形的分布是 $P(r)=e^{-\beta U(r)}/Z$

假设位形 1 的能量比较低，位形 2 的能量比较高，那么根据 $P(1)\operatorname{acc}(1\to 2)=P(2)\operatorname{acc}(2\to 1)$ 可以推出 $P(1)\operatorname{acc}(1\to 2)=\operatorname{acc}(2\to 1)e^{-\beta U(2)+\beta U(1)}$，其中 $e^{-\beta U(2)+\beta U(1)}$ 是一个小于 1 的数。这样，我们就可以将从能量高向能量低移动的接受概率 $\operatorname{acc}(2\to 1)$ 设为 1，而将从能量低向能量高移动的接受概率 $\operatorname{acc}(1\to 2)$ 设为 $e^{-\beta U(2)+\beta U(1)}$。这两种情形可以统一地写成如下形式：

$$
\operatorname{acc}(1\to 2)=\min\{1,e^{-\beta (U(2)-U(1))}\}
$$

## NPT 系综

此时关于位形和体积的联合概率分布是（从等温等压系综推得）

$P(V,r)=V^Ne^{-\beta pV}e^{-\beta U(r)}$

通过与 NPT 系综类似的推导，可以得到

$$
\operatorname{acc}(1\to 2)=\min\{1,e^{-\beta(U(2)-U(1))-\beta P[V(2)-V(1)]V(2)^N/V(1)^N}\}
$$

# Monte Carlo 模拟的效率

## 效率的衡量标准

以上我们简要介绍了 Monte Carlo 方法的基本步骤：选定分布并设计接受概率使得经过足够多次随机游走之后位形满足给定分布。不过现在我们还有一些实现 Monte Carlo 模拟的细节没有给定。比如：

- 应该一次移动一个粒子，还是多个粒子，还是全部粒子？
- 随机移动的范围怎么选定？
- NPT 系综中，什么时候移动粒子，什么时候移动体积？

显然这些参数应该尽可能地优化使得总体模拟的效率最高。这要求我们首先定义什么是效率。一般来讲，Monte Carlo 方法的均方误差反比于采样数量，即 $\sigma^2\propto 1/N$，而在采样数量一定的情况下，显然系统遍历位形空间的程度越高，误差越小。因此我们可以近似地用所有随机移动的平方和来表征对位形空间的遍历程度，进而评估它的均方误差。因此评价的标准就在于：用最少的 CPU 时间来得到最大的随机移动平方和。

### 一个粒子还是多个粒子？

以正则系综为例，我们可以讨论进行移动后势能的变化。为此进行 Taylor 展开（假设只移动一个方向的坐标）：

$$
U(x+\Delta x)=U(x)+U'(x)\Delta x+\frac12U''(x)\Delta x^2+...
$$

对上式做所有位形空间的平均，再做所有可能的随机移动的平均，则 $\Delta x$ 项将消失，而 $\Delta x^2$ 项平均后成为单次移动的均方位移：

$$
\langle \Delta U\rangle\approx\frac12\langle U''(x)\rangle\langle \Delta x^2\rangle=c\langle\Delta x^2\rangle
$$

一般来讲系统总是处于势能面上比较稳定的点，因此二阶导数应该大于 0。所以我们期望进行随机移动之后势能大体上会上升。当这种上升的程度达到了几个 $kT$ 的时候，$e^{-\beta\Delta U}$ 就已经很小了，这样的移动不太会被接受。因此最大的均方位移应该约为 $kT/c$。

如果同时移动多个粒子，则势能差 $\Delta U$ 中会含有几项均方位移之和。根据勾股定理，不同方向的均方位移之和等于总的均方位移，这说明系统在位形空间中的移动距离和移动单个粒子差不多。

但是，每次移动一个粒子或多个粒子的 CPU 时间消耗是不一样的。每移动一个粒子，就要重新评估与这个粒子相关的势能项，这种评估的计算量是与粒子数成正比的。因此，同时移动多个粒子并不会带来更大的收益，反而消耗了更多的资源，因此一般认为每次移动一个粒子是合适的。

### 随机移动的范围多大？

简便起见，认为位移 $\Delta x$ 在 $[-\delta,\delta]$ 内有均匀分布，此时 $y=\Delta x^2$ 的分布函数是 $y^{-1/2}/2\delta$。那么接受的均方位移将是：

$$
\int_0^{\delta^2}\frac{y^{-1/2}}{2\delta}e^{-\beta cy}\mathrm dy=\frac{\sqrt{\beta c}}{2\delta}\int_0^{\beta c\delta^2}z^{-1/2}e^{-z}\mathrm dz
$$

这是一个关于 $z$ 的不完全 Gamma 函数，虽然我们不能得到它的解析表达式，但显然由于 $e^{-z}$ 的快速衰减以及分母上有 $2\delta$，不是 $\delta$ 越大越好。对于特定的体系，我们常常需要进行测试以得到最优的 $\delta$。一个比较粗略（也没什么道理）的做法是取使得接受概率约为 50% 的 $\delta$，但并不总是这样。

### 移动体积还是位置？

移动体积后，所有粒子的坐标需要重新标度，分子间相互作用也需要重新计算，这大约相当于 $N$ 倍移动一个粒子的计算量。然而它们在遍历位形（广义的）空间上的效果是差不多的。因此我们最好每移动 $N$ 次粒子再移动一次体积。

## 增强抽样简介

### 偏倚采样函数

在某些情况下，即使采用了较优的参数，我们仍然发现物理平均值的收敛速度很慢。然而，我们总是可以通过改变物理量平均值的估计式来取得更好的采样效率。以正则系综为例，将 $P(r)$ 显式地写出来，就是：

$$
\langle A\rangle=\frac{\int \mathrm d\mathbf re^{-\beta U(\mathbf r)}A(\mathbf r)}{\int \mathrm d\mathbf re^{-\beta U(\mathbf r)}}
$$

在某些情况下，以下不幸的事情会发生：那些 $e^{-\beta U}$ 比较显著的位形所对应的 $A(r)$ 都几乎没有贡献，而 $A(r)$ 有贡献的地方 $e^{-\beta U}$ 接近于 0；因此既然我们按 $e^{-\beta U}$ 对相空间采样，我们就无法准确地估计 $A$ 的数值，并产生很大的负偏差（绝对值）。此时我们可以对上式作如下变换：

$$
\begin{aligned}
\langle A\rangle&=\frac{\int \mathrm d\mathbf re^{-\beta U(\mathbf r)}A(\mathbf r)}{\int \mathrm d\mathbf re^{-\beta U(\mathbf r)}}\\
&=\frac{\int \mathrm d\mathbf r\pi(\mathbf r)\left[e^{-\beta U(\mathbf r)}A(\mathbf r)/\pi(\mathbf r)\right]}{\int \mathrm d\mathbf r\pi(\mathbf r)\left[e^{-\beta U(\mathbf r)}/\pi(\mathbf r)\right]}
\end{aligned}
$$

此时我们将由 $\pi(r)$ 而非 $e^{-\beta U(r)}$ 确定的采样密度看作是某种新的系综（$\pi$-系综），那么上式等价于两个新的物理量在 $\pi$-系综下作平均。上述变换若想增强采样的效率，必须满足如下条件：

- 以 $\pi(r)$ 为密度的采样是容易进行的；
- 新物理量 $A_{\pi}(r)=e^{-\beta U}A(r)/\pi(r)$ 比原物理量 $A$ 更快地收敛；
- 物理量 $1_{\pi}(r)=e^{-\beta U}/\pi(r)$ 比原物理量 *A* 更快地收敛。

对上面的第 2、3 点可以进行一些额外的说明。例如，当 $\pi(r)=e^{-\beta U(r)$ 时，变换前后的估计式是完全等价的，因此第 2 点没有达成，这显然是平凡的；当 $\pi(r)=e^{-U(r)} A(r)$ 时，分子是好算了，但是这相当于将全部计算压力转嫁到了分母上……

### 如何确定偏倚采样函数？

一般来讲，给定物理量 $A(r)$ 后可以求它用 Metropolis 算法计算的方差 $\sigma_A^2$。如果 $\sigma_A^2$ 的行为充分良好，那么可以求得它关于采样函数的变分：

$$
\frac{\delta \sigma^2_A}{\delta \pi}=0
$$

解此变分方程就能得到合适的采样函数。作为实例，可以参考 [自由能计算](https://tansongchen.com/free_energy/) 中这种方法的应用。

### 改进后的 Monte Carlo 算法

以下我们用伪代码展示修改采样权重后的 Monte Carlo 算法：

```fortran
do i = 1, n_random_moves
  call try_to_move()
  r = random_number()
  if (r < min(1, pi_new / pi_old)) then
    call accept_move()
  end if
  numerator = numerator + A * exp(-beta * U) / pi
  denominator = denominator + exp(-beta * U) / pi
end do
A_average = numerator / denominator
```

其中，我们省去了标准 Metropolis 算法中需要除以的 $L$（因为分子和分母需要除以的是一样的）。

# Monte Carlo 模拟与分子动力学模拟的对比

Monte Carlo 模拟和分子动力学模拟都能提供我们感兴趣体系的宏观物理量。分子动力学模拟甚至可以得到一些动态性质（如扩散系数等），而这是 Monte Carlo 方法所不能做到的。那么，我们在什么情况下应该使用 Monte Carlo 模拟呢？

要研究这个问题，我们首先要明确 Monte Carlo 模拟涉及的是系统的「系综平均」，而分子动力学模拟涉及的是系统的「时间平均」。因此，Monte Carlo 模拟并不涉及真实的物理过程。这有两个好处：

1. 无需计算受力。对于经典的分子动力学来说，大多数模拟的时间花费在力的计算上。如果体系的力并非完全由两体相互作用（如，Lennard-Jones 流体中的作用势）提供，那么力将尤其难以计算，此时 Monte Carlo 方法将具有明确的优势。
2. 无需考虑体系的真实动力学过程。某些体系的真实动力学过程是不清楚的，例如 Ising 模型中的自旋随机翻转过程。另一些体系的真实动力学过程可以模拟，但同时伴随着较大的势垒，这使得体系用分子动力学方法达到平衡的速度很慢。这样的体系包括两相平衡体系、大分子体系以及硬球体系等等，我们可以简单地将粒子进行「位移」，而不考虑位移具体是怎么发生的，发生时是否要跨越高的势垒等等。
