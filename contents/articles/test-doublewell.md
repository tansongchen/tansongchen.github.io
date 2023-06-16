---
title: 双势阱体系的测试
date: 2019-07-26
tags: [物理, 化学]
cover: https://images.tansongchen.com/double-well.webp
abstract: Jarzynski 等式的后续
---

# 一个简单而不平凡的体系

## 一维双势阱模型

在 [7 月 12 日的文章](https://tansongchen.com/free_energy/) 中，我们讨论了非平衡分子动力学中的 Jarzynski 等式。我们先简单回顾一下 Jarzynski 等式适用的条件：

> 考虑一个经典、恒温的系统，它具有 $N$ 个自由度，可以由相空间坐标 $x=(q,p)$ 描述。
>
>
> 现设系统经历了一个过程并改变了它的 Hamilton 量，则在这个过程中 Hamilton 量可以写作 $H(x,\lambda)$，其中 $\lambda=0$ 对应初态，$\lambda=1$ 对应末态。在这个过程中 $\lambda$ 随时间的变化关系记作 $\lambda(t)$。
>
> 取定初始时刻相空间坐标为 $x(0)$，则系统将沿一条确定的轨迹 $x(t)$ 演化，对体系做的功为：

$$
W[\mathbf x(t)]=\int_{0}^{\tau} \frac{\partial H(\mathbf x,\lambda)}{\partial \lambda} \frac{\mathrm d\lambda(t) }{\mathrm d t} \mathrm d t
$$

现在我们给出一个这样的 Hamilton 量（尽管体系非常简单，它用于几乎所有文献的最初的测试）：

$$
H_\lambda=\frac12p^2+q^4+16(\lambda-1)q^2
$$

除去普通的动能项，剩下的势能项由 $\lambda=0$ 时的一个双势阱 $q^4-16q^2$ 变成 $\lambda=1$ 时的一个单势阱 $q^4$。

![势阱示意图](http://ww3.sinaimg.cn/large/006tNc79ly1g5i1ftdh49j31gz0qowf0.jpg)

给出具体的 Hamilton 量，我们只需要在恒温条件下求解 Hamilton 正则方程并计算相应的功即可。

# 含时 Hamilton 量的二阶辛算法

## 扩展 Hamilton 量和正则方程的构建

在 [7 月 19 日的文章](https://tansongchen.com/symplecticity/) 中，我们总结了在 Hamilton 量不含时的情况下，辛算法的一般构建方式。不过上面的讨论要求我们处理一个 Hamilton 量随标度参量变化，因而也就随时间变化的情况：$H=H(p,q,\lambda (t))$。我们接下来要说明的是：对于 Hamilton 量含时的情况，尽管 Hamilton 量不守恒，但原有的辛算法仍然保持某种部分的（或者说准的）辛性。

先考虑一般的情况，即 $\mathbb R^{2n}$ 上的正则方程：

我们引入虚拟位置 $q_{n+1}=t$ 以将 Hamilton 量表示成不含时间的形式 $H(p_1,\cdots,p_n,q_1,\cdots,q_{n+1}$，以及和它共轭的虚拟动量 $p_{n+1}=-H$，还有扩充的 Hamilton 量 $K=H+p_{n+1}$。原有的正则方程仍然保持其形式：

$$
\begin{aligned}
\dot q_i&=\frac{\partial K}{\partial p_i}\\
\dot p_i&=-\frac{\partial K}{\partial q_i}\\
\end{aligned}
$$

而新加入的变量满足的方程是

$$
\begin{aligned}
\dot q_{n+1}&=\frac{\partial K}{\partial p_{n+1}}=1\\
\dot p_{n+1}&=-\frac{\partial K}{\partial q_{n+1}}\\
\end{aligned}
$$

可见这是自洽的。虽然 $q_{n+1}$ 在数值演化上完全等价于 $t$，但从形式上看 $K$ 只含有 $2n+2$ 个相空间坐标而不含时，从而可以在这个 $R^{2n+2}$ 空间上设计辛算法。

## Nosé-Poincaré 控温的实现

考虑上含时的势能之后（我们将时间记作是 $Q$），Nosé-Poincaré Hamilton 量是：

$$
H=s\left[\frac{p^2}{2ms^2}+V(q,Q)+\ln s+\frac{\pi^2}{2M}-H_0\right]
$$

以及升维之后的 $K=H+P$ 如何设计相应的辛算法？我们回顾此前的分解方式：

$$
\begin{aligned}
H_1&=s\left[\frac{p^2}{2ms^2}+ \ln s-H_{0}\right]\\
H_2&=sV(q)\\
H_3&=\frac{s\pi^2}{2M}
\end{aligned}
$$

我们发现，如果将 $V(q,Q)$ 替换 $V(q)$ 放在 $H_2$ 中，那么 $H_2$ 仍然只含广义位置而不含广义动量，因此仍然可以精确求出时间演化算符；另外如果将 $P$ 加到 $H_1$ 中，那么 $H_1$ 只含广义动量 $p,P$ 和广义位置 $s$，它们互相不共轭，因此也可以精确求出时间演化算符。也即：$K=K_1+K_2+K_3$，其中

$$
\begin{aligned}
K_1&=P+s\left[\frac{p^2}{2s^2}+\ln s-H_{0}\right]\\
K_2&=sV(q,Q)\\
K_3&=\frac{s\pi^2}{2M}
\end{aligned}
$$

对应的辛差分格式仍然适用：$x_{n+1}=e^{\Delta tH_3/2}e^{\Delta tH_2/2}e^{\Delta tH_1}e^{\Delta tH_2/2}e^{\Delta tH_3/2}x_n$，这里 **x** 是 6 维向量。我们具体将这个格式写出来（**高能预警**）：

$$
\begin{aligned}
&\text{Evolve}~H_3/2:\\
s^* &=s^{n}\left(1+\frac{\pi^{n}}{2M} \frac{\Delta t}{2}\right)^{2} \\
\pi^{*} &=\pi^{n} /\left(1+\frac{\pi^{n}}{2M} \frac{\Delta t}{2}\right) \\
&\text{Evolve}~H_2/2:\\
p^* &=p^{n}-\left.s^* \frac{\partial V}{\partial q}\right|_{q_n,Q_n} \frac{\Delta t}{2} \\
P^*&=P-\left.s^*\frac{\partial V}{\partial Q}\right|_{q_n,Q_n} \frac{\Delta t}{2}\\
\pi^{**}&=\pi^*-V(q_n,Q_n)\frac{\Delta t}{2} \\
&\text{Evolve}~H_1:\\
q^{n+1} &=q^{n}+\frac{p^*}{s^*} \Delta t \\
Q^{n+1} &=Q^{n}+ \Delta t \\
\pi^{***}&= \pi^{**}+\left[\frac{1}{2}\left(\frac{p^*}{s^*}\right)^{2} -\ln s^*+H_{0}-1\right] \Delta t \\
&\text{Evolve}~H_2/2:\\
p^{n+1} &=p^*-\left.s^* \frac{\partial V}{\partial q}\right|_{q_{n+1},Q_{n+1}} \frac{\Delta t}{2}\\
P^{n+1}&=P^*-\left.s^*\frac{\partial V}{\partial Q}\right|_{q_{n+1},Q_{n+1}} \frac{\Delta t}{2}\\
\pi^{****}&=\pi^{***}-V(q_{n+1},Q_{n+1})\frac{\Delta t}{2} \\
&\text{Evolve}~H_3/2:\\
s^{n+1}&= s^*\left(1+\frac{\pi^{****}}{2M} \frac{\Delta t}{2}\right)^{2} \\ \pi^{n+1}&= \pi^{*** *} /\left(1+\frac{\pi^{****}}{2M} \frac{\Delta t}{2}\right) \end{aligned}
$$

当然实际计算的过程中我们并不关心这个 Hamilton 量到底变化了多少，所以 $P$ 是不用计算的（它也不用于更新其他变量）；$Q$ 也是不用显式计算的，只需要知道「时间」在每一步的中间更新而非开始时更新就可以了。

# 误差理论

## 点估计理论

为了定量刻画不充分采样产生的误差，我们需要一点统计学的分析。为简便起见，移动能量零点使初态 $F=0$，这样 Jarzynski 等式变为 $F=\ln\langle e^{-W}\rangle$ 从这个等式出发，我们可以将基于 $N$ 个样本的某种统计平均称为一个估值（estimator）$F_N$，例如最简单的估值是

$$
F_N=-\ln\left(\frac1N\sum_{i=1}^Ne^{- W_i}\right)
$$

---

理想的估值方案需要在尽可能少的计算时间内获得尽可能精确的自由能，为此我们定义均方误差：$\varepsilon^2[F_N]=\langle(F_N-F)^2\rangle$，这个均方误差可以分为两部分：$\langle(F_N-F)^2\rangle=\langle(F_N-\langle F_N\rangle)^2\rangle+(\langle F_N\rangle-F)^2$。前一部分是估值自身的方差（随机误差），记作 $\sigma^2[F_N]$；后一部分是估值期望与真值的偏差（系统误差），记作 $b^2[F_N]$，总而言之 $\varepsilon^2[F_N]=\sigma^2[F_N]+b^2[F_N]$。

## 直接指数平均是有偏估计

上述最简单的估值方案表现如何？首先考虑它的系统误差 $b^2$，我们引入记号

$$
X=e^{-W},X_N=\frac1N\sum_{i=1}^Ne^{-W_i}
$$

也即 $F_N=-\ln X_N$，那么这个估值的期望是 $\langle F_N\rangle=-\langle\ln X_N\rangle$

由 Jensen’s（琴生）不等式，$\ln\langle X_N\rangle<\langle\ln X_N\rangle$，而 $\langle X_N\rangle=\langle X\rangle=e^{-F}$，故有 $\langle F_N\rangle\ge -\ln e^{-F}=F$

这说明我们总是高估真实的自由能变。

---

高估了多少？我们记随机变量 $X$ 的期望为 $m$，方差为 $s^2$，$\langle X\rangle=e^{-F}=m$，可以将 $\ln(\cdot)$ 在 $X_N/m$ 处展开：

$$
-\langle \ln X_N\rangle=-\ln m-\left\langle\ln \frac{X_N}m\right\rangle=-\ln m-\left\langle Y_N-\frac{Y_N^2}2+\frac{Y_N^3}3+...\right\rangle
$$

其中 $Y_N=X_N/m-1$。$-\ln m$ 是真值，所以系统误差是后面的级数部分，又因为 $\langle Y_N\rangle=0$，所以系统误差的主导项是

$$
b_N\approx \frac12\left\langle Y_N^2\right\rangle=\frac12\left\langle\frac{(X_N-m)^2}{m^2}\right\rangle=\frac{s^2}{2Nm^2}
$$

同理，可以算出随机误差

$$
\sigma_N^2\approx \langle Y_N^2\rangle=\frac{s^2}{Nm^2}
$$

鉴于 $b_N^2=O(N^{-2})$，$\sigma_N^2$ 似乎是 $\varepsilon_N^2$ 的主要来源，所以我们将只考虑 $\varepsilon_N^2\approx\sigma_N^2$。

---

又由于 $X=e^{-W}$，所以 $\varepsilon_N^2$ 可以化简为（$W_d$ 是耗散功 $W-F$）

$$
\varepsilon_N^2\approx \frac{\langle (e^{-W_d}-1)^2\rangle}N
$$

换言之，获得准确度为 $kT$ 的数据所需的采样数目为 $N\approx\langle(e^{-W_d}−1)^2\rangle$。上篇文章中提到的绝大多数计算方法基于在一定条件下最小化 $\langle(e^{-W_d}−1)^2\rangle$。

# 一些结果

## 解析计算

自由能可以用配分函数表示：

$$
\begin{aligned}
F&=-\ln\frac{Z_1}{Z_0}\\
&=-\ln\left\{\int \mathrm dp\mathrm dq\exp\left[-\left(\frac12p^2+q^4-16q^2\right)\right]\right\}\\
&=\ln \frac{\pi e^{32}\left(I_{-1 / 4}(32)+I_{1 / 4}(32)\right)}{\sqrt{2} \Gamma(5 / 4)}\\
&\approx 62.9407
\end{aligned}
$$

如果初态取自 Boltzmann 分布，容易得到当 $\lambda$ 变换速度足够快时，有

$$
P(W, \lambda'(t)=\infty)=\frac{\exp \left\{-\left(W^{2} / 16^{2}-W\right)\right\}}{4 \sqrt{W} \pi e^{32}\left(I_{-1 / 4}(32)+I_{1 / 4}(32)\right)}
$$

尽管分母中有 $\sqrt W$ 项，在 $W\approx 10^2$ 的小范围内可以近似看成正态分布，从而可以应用累积函数展开加以讨论。

## 程序编写

目前写了一组简单的测试程序：

- `DoubleWell.f90`：体系参数和运动方程的求解方法；
    - Nosé-Poincaré 控温
    - 含时二阶辛算法求解
- `Expansion.f90`：用直接指数平均和累积量展开方法求值；
    - 输出原始和不同阶数展开的估值的期望和方差
    - 基于功的近正态分布讨论误差分析的合理性

## 数据

- 每个轨迹在 $10^{-2}$ 秒内以 $10^{-3}$ 步长演化，每次采样 $10^4$ 个轨迹，
- 用不同估值方案计算，考察不同估值方案的系统误差；
- 重复采样 $10^2$ 次，考察不同估值方案的随机误差；
- 由于功是正态的，所以二阶展开效果比较好（同时也说明需要更复杂的体系来检验）。

![http://ww1.sinaimg.cn/large/006tNc79ly1g5mcntnlgnj30zk0qomxc.jpg](http://ww1.sinaimg.cn/large/006tNc79ly1g5mcntnlgnj30zk0qomxc.jpg)

不同方法比较
