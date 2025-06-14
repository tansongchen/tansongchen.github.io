---
title: 基于轨迹的量子动力学方法
date: 2020-04-06
categories: [物理, 化学]
cover: https://images.tansongchen.com/quantum-dynamics.webp
description: 最近看的奇奇怪怪的文章的总结
---

2003 年，徐光宪院士在《大学化学》期刊上撰文《今日化学何去何从》，分析透彻、用语精辟，发人深思。徐光宪院士提出了 21 世纪化学领域的四个重大问题，其中第一个问题，也称「化学的第一根本规律」的即是：

> 建立精确有效而又普遍适用的化学反应的含时多体量子理论和统计理论。

理论上，含时 Schrödinger 方程提供了对任何量子动力学过程的最直接描述，然而其计算量随体系尺度增大而呈 $O(e^N)$ 复杂度增长，难以应用到大分子体系；在非零温以至于室温分子体系中展开波函数往往需要巨大数量的基组。含时 Hartree-Fock 和含时密度泛函是两种有效的平均场近似理论，但其准确性尚不能令人满意。

然而，量子动力学并非只有波函数一种表示方法。对于我们熟知的经典力学，就存在很多种等价的描述方法，我们称之为「表象（representations）」，例如 Newton, Lagrange 和 Hamilton 方程各自提供了不同的表象。对于量子力学而言，量子态和算符并非真实存在的客体，而只是一种对系统的描述；任何一种描述只要能*给出正确的可观测量*，就是一种合理的等价表象。

通过近年来的理论方法发展，我们可以在量子动力学的相空间表象（phase space representation）下构建化学理论，为复杂化学体系的动力学提供了新的视角和自然的经典到量子理论的过渡。

本文是专栏「量子动力学方法」的第 1 篇。

---

# 相空间表象

经典统计力学将 $n$ 自由度系统用 $2n$ 维相空间描述，并提出了相空间分布函数 $\rho$，使得一个可观测量 $A$ 可以用平均值
$$
\int\mathrm dx\mathrm dp\rho A
$$
描述。是否有可能对量子系统进行类似的描述？

## 纯态的相空间

设量子系统可以用纯态 $|\varphi\rangle$ 表示，则可观测量 $A$ 由算符的平均值表达：
$$
A=\langle\varphi|\hat A|\varphi\rangle
$$
若我们在表达式中插入一组坐标空间的完备基，则为
$$
\begin{aligned}
A&=\int\mathrm dx\langle\varphi|\hat A|x\rangle\langle x|\varphi\rangle\\
&=\int\mathrm dx\langle x|\varphi\rangle\langle\varphi|\hat A|x\rangle\\
&=\int\mathrm dx\langle x|\hat\rho\hat A|x\rangle\\
&=\mathrm{Tr}(\hat\rho\hat A)
\end{aligned}
$$
在上式中我们定义了态的密度算符 $\hat\rho=|\varphi\rangle\langle\varphi|$。现在我们对密度算符和可观测量算符定义其 Wigner 函数：
$$
O_W(x,p)=\int\mathrm dy\left\langle x-\frac y2\right|\hat O\left|x+\frac y2\right\rangle e^{ip^Ty}
$$
容易证明，下式
$$
\int\mathrm dx\mathrm dp\rho_W(x,p)A_W(x,p)
$$
即给出了可观测量 $A$ 的期望值；具体的证明留给读者为习题。该式是经典相空间平均值的量子对应。

## 混合态的相空间

如果我们将纯态一般化为混合态，且该混合态可以用密度算符 $\hat\rho$ 表述，则也容易证明可观测量的表达式与上式相同。例如，当处于正则系综时，密度算符即是 Boltzmann 算符 $e^{-\beta\hat H}$。由于混合态密度算符的迹不是 1，我们需要除以配分函数来得到可观测量：
$$
A=\frac1Z\operatorname{Tr}(\hat\rho\hat A)
$$

## 时间关联函数的相空间表示

现在我们考虑一类特殊的可观测量，它由两个算符在不同时刻的关联表示：
$$
C_{AB}(t)=\frac1 Z\operatorname{Tr}(\hat\rho \hat A(0)\hat B(t))
$$
其中算符 $\hat B(t)$ 由 Heisenberg 表象给出：
$$
\hat B(t)=e^{i\hat Ht}\hat B(0)e^{-i\hat Ht}
$$
由于求迹的循环等价性，我们也可以将 $e^{-i\hat Ht}$ 移到前面，得到
$$
C_{AB}(t)=\frac1Z\operatorname{Tr}(\hat A^{\beta}(t)\hat B)
$$
其中 $\hat A^{\beta}(t)=e^{i\hat Ht}e^{-\beta\hat H}\hat Ae^{-i\hat H t}$。在这里我们可以将 $\hat A^\beta(t)$ 看作是一个特殊的密度算符，从而计算
$$
C_{AB}(t)=\frac1Z\int\mathrm dx\mathrm dpA^{\beta}_W(x,p,t)B_W(x,p)
$$

# 量子 Liouville 方程

经典力学中我们用 Poisson 括号描述物理量的演化：
$$
\frac{\partial A}{\partial t}=\{H,A\}=-\left(\frac{\partial A}{\partial x}\right)^{T}M^{-1}p+\left(\frac{\partial A}{\partial p}\right)^{T}V'(x)
$$
而在量子力学中，我们有如下的演化方程：
$$
\frac{\partial \hat O(t)}{\partial t}=-\frac1{i\hbar}[\hat A^{\beta}(t),\hat H]
$$
如何在相空间表象下表达这一关系？

## 相空间表象下的 Liouville 方程

我们自然地联想到，相空间表象下，是否 Wigner 函数的 Poisson 括号即是物理量的时间导数？然而并不是。由于算符的不对易性，Wigner 函数的时间导数中存在势能的无限阶梯度，即：
$$
\begin{aligned}
\frac{\partial A^\beta_W}{\partial t}=&-\left(\frac{\partial A_W^\beta}{\partial x}\right)^{T}M^{-1}p+\left(\frac{\partial A_W^{\beta}}{\partial p}\right)^{T}V'(x)\\
&\color{red}{-\frac{\hbar^2}{24}\frac{\partial^3A_W^\beta}{\partial p^3}V^{(3)}(x)+\cdots}
\end{aligned}
$$

## 经典、高温与谐振子极限

不过，由于高阶导数总是含相应阶数的 $\hbar$ 因子，在经典极限（$\hbar\to0$）下它们可以忽略；在高温极限（$\beta\to 0$）下，算符 $\hat A^{\beta}$ 中的密度算符趋近于单位算符，不对易性消失，因而高阶导数也可以忽略；在谐振子极限下，势能的三阶以上导数为 0，因而。

因此，该式自然地给出了动力学的经典、高温与谐振子三种极限。

# 经典 Wigner 模型

如果我们忽略掉上式中的高阶项，则系统的运动与经典 Liouville 方程无异；此时我们在关联函数的表达式中作如下变换，定义
$$
f(x,p)=\frac{A_W^\beta(x,p)}{\rho_W(x,p)}
$$
则关联函数变为：
$$
C_{AB}(t)=\frac1Z\int\mathrm dx\mathrm dp\rho_W(x,p)f(x,p)B(x,p,t)
$$
此式的意义在于，若我们以 Wigner 相空间中的分布函数 $\rho_W$ 采样，计算每点处的 $f$ 和 $B$ 值加权平均即是时间关联函数；又由于系统的运动可以看作是经典的，在各态历经的前提下经典轨迹上各点的出现概率应该符合 $\rho_W$。因此我们可以将上式改成等价的分子动力学形式：
$$
\begin{aligned}
C_{AB}(t)&=\frac 1Z\int\mathrm dx_0\mathrm dp_0\rho_W(x_0,p_0)f(x_0,p_0)B_W(x_t,p_t)\\
&=\frac1T\int_0^T\mathrm dt'f(x(t'),p(t'))B_W(x(t'+t),p(t'+t))
\end{aligned}
$$
通过对单一的轨迹进行采样计算，我们就能获得经典 Wigner 模型下的时间关联函数。

这一表述也可以从线性化半经典初始值表示（LSC-IVR）推出。

---

注意，这一时间关联函数与经典统计力学中的时间关联函数区别为：经典统计力学中力学量的形式未必等于对应算符的 Wigner 函数的形式；且经典的时间关联函数使用的是力学量 $A$，此处使用的是变换后的 Wigner 函数 $f$。

下一篇文章中我们将会讨论如何超越经典 Wigner 模型（也即线性化半经典理论），更准确地研究系统的动力学。

在上一篇文章中，我们讨论了量子动力学的相空间表象，并基于 Wigner 函数推导出了近似计算量子时间关联函数的方法。但是，由于我们在分布函数的运动方程中忽略了高阶项，对系统长时间的运动将是不正确的。我们将要看到，通过与经典 Liouville 定理的类比，我们可以发展平衡 Liouville 动力学（ELD），并结合路径积分方法作为采样方案得到路径积分 Liouville 动力学（PILD）方法，实现对系统量子效应更准确的描述。

本文是专栏「量子动力学方法」的第 2 篇。

# ELD

## 有效力的引入

Wigner 函数的运动方程中存在无穷阶导数：
$$
\begin{aligned}
\frac{\partial P_W}{\partial t}=&-\left(\frac{\partial P_W}{\partial x}\right)^{T}M^{-1}p+\left(\frac{\partial P_W}{\partial p}\right)^{T}V'(x)\\
&\color{red}{-\frac{\hbar^2}{24}\frac{\partial^3P_W}{\partial p^3}V^{(3)}(x)+\cdots}
\end{aligned}
$$
但是，现在我们假定这些项之和可以用一个「修正后的有效势函数」$V_{\rm eff}$ 的导数表示，也即（稍后我们会说明这样做的合理性）
$$
\frac{\partial P_W}{\partial t}=-\left(\frac{\partial P_W}{\partial x}\right)^{T}M^{-1}p+\left(\frac{\partial P_W}{\partial p}\right)^{T}\color{red}{V'_{\rm eff}(x)}
$$
在热平衡下，Wigner 函数 $P_W$ 不应该随时间变化，因此我们就得到了
$$
\left(\frac{\partial P_W^\beta}{\partial x}\right)^{T}M^{-1}p=\left(\frac{\partial P_W}{\partial p}\right)^{T}\color{red}{V'_{\rm eff}(x)}
$$
如果对于某个确定的 $x$，$P_W^{\beta}$ 关于 $p$ 的依赖关系可以近似地用正态分布来描述，那么对 $p$ 的导数也会含有 $p$ 的一次项乘以 $e$ 指数的形式，因此左右两端同时消去 $p$ 就能解出 $V'_{\rm eff}$ 的大小。

## 拟经典轨迹的构造

在 LSC-IVR 中，我们构造的拟经典轨迹中力就是经典力，但是这里我们将拟经典力换成有效力，也即
$$
\begin{aligned} \dot{x} &=\frac{p}{m} \\ \dot{p}&=-\frac{\partial V_{\mathrm{eff}}\left(x, p\right)}{\partial x} \end{aligned}
$$
在这条轨迹上，可以证明 Wigner 函数对 $t$ 的全导数保持不变：
$$
\frac{\mathrm dP_W(x(t),p(t),t)}{\mathrm dt}=0
$$
因此时间关联函数就归结为在一条由有效力产生的拟经典轨迹上求时间平均：
$$
C_{A B}(t)=\lim _{T \rightarrow \infty} \frac{1}{T} \int_{0}^{T}\mathrm d t^{\prime} f\left(x({t^{\prime}}), p({t^{\prime}}) ; t^{\prime}\right) B_W\left(x({t^{\prime}+t}), p({t^{\prime}+t})\right)
$$
相较于 LSC-IVR，这一表达式包含了更多的量子效应，并且在有效力表示成立的情况下，能够获得系统的准确结果。

# PILD

## TGA 近似

那么如何计算有效力呢？这首先需要我们对 Wigner 函数 $P_W$ 的性质进行研究。在经典情况下，相空间分布函数关于动量总是正态分布的；而对于 $P_W$ 我们也可以近似认为正态分布，并且引入一个修正的质量矩阵 $M_{\rm therm}$ 来描述这个正态分布：
$$
\begin{aligned}
P_W&\propto\left\langle x\left|e^{-\beta H}\right| x\right\rangle\left(\frac{\beta}{2 \pi}\right)^{N/ 2}\left|\operatorname{det}\left(M_{\mathrm{therm}}\right)\right|^{-1 / 2} \\ & \times \exp \left[-\frac{\beta}{2} p^T M_{\mathrm{therm}}^{-1} p\right] \end{aligned}
$$
如果我们再进一步假定 $M_{\rm therm}$ 不依赖于位置（至少在线性系统中是这样），那么我们就得到了一个非常简单的有效力的表达：
$$
-\frac{\partial}{\partial x} V_{\mathrm{eff}}(x)=\frac{1}{\beta}M_{\mathrm{therm}} M^{-1} \frac{\partial}{\partial x} \ln \left\langle x\left|e^{-\beta \hat{H}}\right| x\right\rangle
$$
这即为 TGA（Thermal Gaussian Approximation）近似。如果系统的势能函数是多项式、指数函数或 Gaussian 函数，它有解析的表达形式；但其他形式下则比较困难。我们有必要找到一种更加一般化的方法来计算。

## 路径积分表示

下式
$$
\rho(x)=\left\langle x\left|e^{-\beta \hat{H}}\right| x\right\rangle
$$
不易计算的主要原因在于动能和势能算符的不对易性；但通过将 Boltzmann 算符拆成 $P$ 个算符 $e^{-\beta\hat H/P}$ 的乘积，可以部分地减少其不对易性；我们通过插入位置空间的完备基 $1=\int\mathrm dx|x\rangle\langle x|$ 对每一个算符求值，就得到：
$$
\begin{aligned} \rho(x)=& \lim _{P \rightarrow \infty}\left[\left(\frac{P}{2 \pi \beta \hbar^{2}}\right)^{N}|M|\right]^{P / 2} \int \mathrm{d} x_{2} \cdots \int \mathrm{d} x_{P} \\ & \exp \left\{-\frac{P}{2 \beta \hbar^{2}}\left[\left(x_{1}-x_{2}\right)^{\mathrm{T}} M\left(x_{1}-x_{2}\right)+\cdots\right.\right.\\ &\left.\left.+\left(x_{P}-x_{1}\right)^T M\left(x_{P}-x_{1}\right)\right]-\frac{\beta}{P}\left[V\left(x_{1}\right)+\cdots+V\left(x_{P}\right)\right]\right\} \end{aligned}
$$
上式可以形象地比喻为由 $P$ 个珠子构成的环形高分子，每两个珠子之间用弹簧连接。

（这种方法尽管可以从纯数学的角度理解，但也可以看作是 Feynman 路径积分表示中时间取为虚时的类推结果。因此，这种方法也称为路径积分方法。）

不过，出于我们后面会解释的原因，在这里我们希望引入一套新的位置坐标表示：
$$
\left\{\begin{array}{l}x_{1}={\xi}_{1} \\ x_{i}={\xi}_{i}+\frac{i-1}{i} x_{i+1}+\frac{1}{i} {\xi}_{1}(i=2, \cdots, P)\end{array}\right.
$$
这相当于一个合同变换，变换的结果就是将「弹簧势」对角化：
$$
\begin{array}{rl}\rho(x)&= \lim _{P \rightarrow \infty}\left[\left(\frac{P}{2 \pi \beta \hbar^{2}}\right)^{N}|M|\right]^{P / 2} \int \mathrm{d} \xi_{2} \cdots \int \mathrm{d} \xi_{P} \\ & \exp \left\{-\beta \sum_{j=1}^{P}\left[\frac{1}{2} \omega_{P}^{2} {\xi}_{j}^{T} \overline{M}_{j} \xi_{j}\right.\right. \\ & \left.\left.+\frac{1}{P} V\left(x_{j}\left({\xi}_{1}, \cdots, {\xi}_{P}\right)\right)\right]\right\}\end{array}
$$
对角化后的质量矩阵元为：
$$
\left\{\begin{array}{l}\overline{M}_{1}=0 \\ \overline{M}_{i}=\frac{i}{i-1} M(i=2, \cdots, P)\end{array}\right.
$$
这样，有效力就归结为一个高维积分的求算，这可以通过 Monte Carlo 方法进行。

## 路径积分分子动力学

然而直接的 Monte Carlo 采样比较低效。我们又注意到，对角化后它有些类似于 $P$ 个谐振子的经典正则分布，因此我们可以再插入虚拟动量的积分，将它转换为一个具有同构经典 Hamiltonian
$$
H_{\rm classical}=\sum_j\left(\frac{p_j^T\tilde M_jp_j}{2}+\frac12\omega_P^2\xi_j^T\bar M_j\xi_j\right)+\phi(\xi_1,\cdots,\xi_j)
$$
如果我们进一步作标度变换（$\alpha\ll1$）
$$
\tilde M_j=\alpha\bar M_j
$$

$$
\omega_{\mathrm{ad}}=\omega_{P}\alpha^{-1/2}
$$

来加快第 2 ~ $P$ 个珠子的运动，则第 1 个珠子（即系统真实坐标和动量）就会和第 2 ~ $P$ 个珠子的时间尺度完全分离。因此，这一 Monte Carlo 采样就可以用第 2 ~ $P$ 个珠子的恒温分子动力学采样代替。由于两者的时间尺度是分离的，在每一个第 1 个珠子的特征时间内，对其余珠子的采样就可以认为是完全的。

## Langevin 控温

同时，为了保证第 2 ~ $P$ 个珠子在不同时刻的分布确实符合正则分布，我们需要引入适当的控温方式。由于这些珠子的运动并不是真实的运动，我们可以采取 Langevin 动力学进行高效的控温。最终系统的运动方程可以写作
$$
\begin{aligned} \dot{{\xi}}_{j}=& \tilde{{M}}_{j}^{-1} {p}_{j} \\ \dot{{p}}_{j}=&-\omega_{\mathrm{ad}}^{2} \tilde{{M}}_{j} {\xi}_{j}-\frac{\partial \phi}{\partial {\xi}_{j}}-\gamma {p}_{j} \\ &+\sqrt{2 \gamma / \beta} \tilde{{M}}_{j}^{1 / 2} {\eta}_{j}(t) \end{aligned}
$$

## 总结

我们提出了平衡 Liouville 动力学（ELD），用有效力来描述系统的量子效应；为了系统地计算这一有效力，我们将它用路径积分方法展开，并把得到的高维积分对应到一个经典系统的正则系综期望值，然后再利用 Langevin 控温动力学加以计算；由此得到的方法称为路径积分 Liouville 动力学（PILD）。
