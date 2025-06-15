---
title: 格林函数的随机化方法
date: 2019-11-18
categories: [物理, 化学]
cover: https://images.tansongchen.com/green-functions.webp
description: 适用于大体系的 O(N) GW 方法的推导
---

# 固体中的准粒子

准粒子是凝聚态物理中最重要的概念之一，它能够将凝聚态中被复杂的相互作用影响的粒子简化为数量极少、相互作用微弱、具有等效能量和质量的准粒子，揭示电荷转移与输运中的重要性质。

然而，在 Kohn-Sham 框架下的密度泛函理论常常并不能很好地给出准粒子的性质——涉及到强的相互作用时，基于物理图像和经验的泛函常常失效。为此，发展一些对相互作用进行更加本质的阐述的理论至关重要。

在《随机格林函数方法》专栏中，我们将在 Green 函数框架下，引入系统的自能算符与 *GW* 近似，并说明高效计算准粒子能量的随机方法。本文（一）将简要提供基本的物理基础并给出以 Kohn-Sham 轨道作为出发点的参照体系 Green 函数（$G_0$）的表达式。

# 二次量子化表象

## 产生/湮灭算符

众所周知，一次量子化将物理量描述为线性 Hermite 算符，物理量的期望值由算符作用在给定的量子态上给出。

而在二次量子化中，量子态本身也变为了算符。我们记描述 $N$ 个电子的波函数为 $\Psi_N$，即 $\Psi_N(x_1,\cdots,x_N)$ 则*产生算符* $c^\dagger$ 是一类将全体 $N$ 电子波函数空间 $\mathcal H(N)$ 映射到全体 $N+1$ 电子波函数空间 $\mathcal H(N+1)$ 的映射，而*湮灭算符* $c$ 则正好相反。

$$
\begin{array} { l } { \hat { c } : \mathcal H ( N + 1 ) \rightarrow \mathcal H ( N ) } \\ { \hat { c } ^ { \dagger } : \mathcal H ( N ) \rightarrow \mathcal H ( N + 1 ) } \end{array}
$$

容易证明：*如果 $\{\varphi_i\}$ 是一组单电子波函数完备基，则由这组基构成的全体 N 阶行列式波函数是一组 N 电子波函数完备基。*行列式波函数由下式给出。

$$
|\Phi\rangle=\begin{vmatrix}
\varphi_{a_1}(x_1)&\cdots&\varphi_{a_n}(x_1)\\
\vdots&\vdots&\vdots\\
\varphi_{a_1}(x_n)&\cdots&\varphi_{a_n}(x_n)\\
\end{vmatrix}
$$

那么，给定一个单电子轨道 $\varphi_j$，可以定义相应于这个轨道的产生/湮灭算符 $c_j^\dagger,c_j$，使得它们的作用效果是在行列式中加入或删去 $\varphi_j(x)$ 这一行，进而由完备性我们可以定义该算符对于任意波函数的作用效果。

显然，这样的产生/湮灭算符的物理意义就是*产生/湮灭一个在轨道 $j$ 上的电子*。

## 场算符

除了产生/湮灭一个在轨道 *j* 上的电子外，我们还可以在给定位置产生/湮灭电子，为此我们定义场算符：

$$
\begin{aligned}
f(x)=\sum_j\varphi_j(x)c_j\\
f^{\dagger}(x)=\sum_j\varphi^*_j(x)c_j^{\dagger}
\end{aligned}
$$

即表示产生/湮灭位置 *x* 处的任意轨道上的电子。

## Heisenberg 绘景

由于只有算符的期望值是可观测量，所以只要得到正确的期望值，我们*可以对算符进行任意修改*。对于随时间演化的系统，我们因此可以将时间演化的效果从波函数完全转移到算符上。换句话说，如果系统的时间演化可以用 $|\Psi(t)\rangle=U(t)|\Psi(0)\rangle$ 表示，那么我们将 Heisenberg 绘景下的算符 $O(t)$ 写成 $U^\dagger OU$ 就能包括时间演化的效果。特别对于 Hamilton 量不含时的系统，时间演化算符 $U=e^{-iHt}$。

# Green 函数

## Green 函数的定义

我们现在可以给出 Green 函数的定义：对于一个 $N$ 电子系统，其 Green 函数是 $G(rtr't')=\langle 0|T[f(rt)f^{\dagger}(r't')]|0\rangle$ 其中 $|0\rangle$ 是系统基态，$f(rt)$ 和 $f^\dagger(r't')$ 分别是湮灭场算符和产生场算符在 Heisenberg 绘景下的形式，而 $T$ 是时序算符，其定义为：

$$
T [ A ( t _ { 1 } ) B ( t _ { 2 } ) ] \equiv \left\{ \begin{array} { l l } { A ( t _ { 1 } ) B ( t _ { 2 } ) } & {t _ { 1 } > t _ { 2 } } \\ { -B ( t _ { 2 } ) A ( t _ { 1 } ) } & {t _ { 2 } > t _ { 1 } } \end{array} \right.
$$

## Kohn-Sham Green 函数

在计算含相互作用的准粒子能量之前，我们首先要求解一个*较简单的、简化相互作用的体系作为参照体系*，然后才能基于简单体系的 Green 函数 *G*0 进行改进。

一个很好的出发点是密度泛函理论，我们将 Kohn-Sham 方程解出的轨道作为与场算符关联的轨道，计算它对应的 Green 函数，将是：

$$
\begin{aligned}
G_0(r,r',t)=&\sum _ { n } \varphi _ { n } ( r ) \varphi _ { n }  ( r ^ { \prime } ) e ^ { - i \varepsilon _ { n } t } \\  \times &[ ( 1 - f _ { n } ) \theta ( t ) - f _ { n } \theta ( - t ) ]
\end{aligned}
$$

其中 $\varphi_n$ 是第 $n$ 个 Kohn-Sham 轨道，而 $\varepsilon_n$ 是相应的能量。如果该轨道被占据，则 $f_n=1$，否则 $f_n=0$。$\theta(t)$ 是 Heaviside 阶跃函数：

$$
\theta(t)=
\begin{cases}
1&t>0\\
0&t\le0
\end{cases}
$$

它的推导留给读者作为练习（笑）。

## Green 算符

为了更深刻地揭示 Green 算符的本质，我们将 $G_0(r,r',t)$ 看作是一个算符 $\hat G_0$ 作用于位置本征态 $\langle r|$, $|r\rangle$ 上。那么

$$
\begin{aligned}
\hat G_0&=\sum_n|\varphi_n\rangle\langle\varphi_n|e^{-i\varepsilon_nt}\\
&\times[( 1 - f _ { n } ) \theta ( t ) - f _ { n } \theta ( - t ) ]\\
&=e^{-iHt}[(1-P)\theta(t)-P\theta(-t)]
\end{aligned}
$$

这里我们将占据数 $f_n$ 转化为了关于全部占据轨道的投影算符：

$$
P=\sum_{n<N_{\rm occupied}}|\varphi_n\rangle\langle\varphi_n|
$$

# 频域 Green 函数 $\tilde G$

## $\tilde G$ 的引入

我们在时域引入了格林函数 $G(r,t,r',t')$，它是两个位置和两个时刻的函数；但容易证明，*如果系统的 Hamilton 量不显含时间，那么它将仅仅依赖于两个时刻之差*，即 $t-t'$:

$$
\begin{aligned}
G&=T\left[-i\langle 0|f(rt)f^{\dagger}(r't')|0\rangle\right]\\
&=T\left[-i\langle 0|f(r)e^{-iH(t-t')}f^{\dagger}(r')|0\rangle e^{iE(t-t')}\right]
\end{aligned}
$$

那么，我们关于 $t-t'$ 作 Fourier 变换，就得到了频域 Green 函数：$\tilde G(r,r',\omega)=\mathcal F[G(r,r',t-t')]$

## $\tilde G$ 的极点是准粒子能量

为了具体计算这个 Fourier 变换，我们首先需要将两个场算符中间的演化算符 $e^{-iH(t-t')}$ 变成一个可以操作的数。为此我们插入一个**由行列式波函数构成的完备基**：

$$
\begin{aligned}
e^{-iH(t-t')}&=\sum_{\Phi}e^{-iHt}|\Phi\rangle\langle\Phi|e^{iHt'}\\
&=\sum_{\Phi}|\Phi\rangle\langle\Phi|e^{-iE_{\Phi}(t-t')}\\
\end{aligned}
$$

然后，我们注意到，若要矩阵元 $\langle 0|f(r)|\Phi\rangle$, $\langle\Phi|f^{\dagger}(r)|0\rangle$ 不为 0，需要 $|\Phi\rangle$ 是一个比基态多一个电子的波函数，这样我们**将场算符展开为各个轨道上的产生/湮灭算符时，算符作用的结果才能不为 0**。化简结果给出

$$
\begin{aligned}
G(r,r',t)=&\sum _ { n } \varphi _ { n } ( r ) \varphi _ { n }^*  ( r ^ { \prime } ) e ^ { - i \varepsilon _ { n } t } \\  \times &[ ( 1 - f _ { n } ) \theta ( t ) - f _ { n } \theta ( - t ) ]
\end{aligned}
$$

（跟上次的结果一样，只不过这里的 $\varepsilon_n$ **是系统的准粒子激发能量而非 Kohn-Sham 轨道的能量**。）对它作 Fourier 变换给出

$$
\tilde G ( r,r',\omega ) = \sum _ { n } \frac { \varphi _ { n } (r) \varphi _ { n }^* (r') } { \omega - \varepsilon _ { n }}
$$

综上所述，*$\tilde G$ 的全部极点对应的能量即是系统的准粒子激发能量*。因此，我们将问题归结为如何求解 $\tilde G$ 的极点。

# 自能函数 $\Sigma$

## $G$ 的运动方程

为了做这件事情，我们首先要考察时域 Green 函数是如何随时间演化的。根据 Heisenberg 绘景下算符的演化关系

$$
i \frac { \partial f ( r ) } { \partial t } = [ f(r) , H ]
$$

我们可以得到 Green 函数的运动方程：

$$
\begin{aligned}
&\left( i \frac { \partial } { \partial t } - h _ { 0 } ( x ) \right) G ( x t , x ^ { \prime } t ^ { \prime } ) \\
- &i \int \mathrm d r ^ { \prime \prime } \mathrm d t ^ { \prime \prime } \nu ( r , r ^ { \prime \prime } ) \langle 0 | T [ f ^ { \dagger } ( r ^ { \prime \prime } t )  \\
&f ( r ^ { \prime \prime } t ) f ( r t ) f^ { \dagger } ( r ^ { \prime } t ^ { \prime } ) ] | 0 \rangle \\
= &\delta ( x - x ^ { \prime } ) \delta ( t - t ^ { \prime } )
\end{aligned}
$$

事情看起来有些不妙，因为我们想求解 Green 函数的运动反而引入了更复杂的东西，积分项中关于基态的期望值实际上是*二体 Green 函数*，即

$$
\begin{aligned}
\langle 0 | T [ f ^ { \dagger } ( r ^ { \prime \prime } t )f ( r ^ { \prime \prime } t ) f ( r t ) f^ { \dagger } ( r ^ { \prime } t ^ { \prime } ) ] | 0 \rangle
\\
=G_2(rt,r't',r''t,r''t^+)
\end{aligned}
$$

## $\Sigma$ 的引入

但是，考虑到二体 Green 函数本质上是描述了电子的相互作用，我们可以*将二体 Green 函数解释为一个经典相互作用 $V_H$ 和一个交换关联相互作用 $\Sigma_{\rm xc}$ 之和*。$V_H$ 即 Hartree 势，是电子作用的平均化：

$$
V_H(r)=\int\frac{\rho(r')}{|r-r'|}\mathrm dr'
$$

而交换相互作用就是二者之差。这样，Green 函数的运动方程可以写为：

$$
\begin{aligned}
&\left[ i \frac { \partial } { \partial t } - h _ { 0 } ( x ) - V _ { H } ( x ) \right] G \\
- &\int \mathrm d r ^ { \prime \prime } \mathrm d t ^ { \prime \prime } \Sigma ( r t , r ^ { \prime \prime } t ^ { \prime \prime } ) G \\
= &\delta ( r - r ^ { \prime } ) \delta ( t - t ^ { \prime } )
\end{aligned}
$$

## 准粒子方程

现在我们将它变换到频域来简化含有偏导数和 $\delta$ 函数的表达式（这里定义 $H_0=h_0+V_H$ 是所有「经典」的 Hamilton 量）。

$$
\begin{aligned}
&(\omega-H_0(r))\tilde G(r,r',\omega)\\
-&\int\mathrm dr''\tilde\Sigma(r,r'',\omega)\tilde G(r,r'',\omega)\\
=&\delta(r-r')
\end{aligned}
$$

这是一个关于 $\tilde G$ 的积分-微分方程。根据微分方程和 Green 函数的基本知识，$\tilde G$ 可以由下面的表达式给出：

$$
\tilde G(r,r',\omega)=\sum_n\frac{\varphi_n(r)\varphi_n^*(r')}{\omega-\varepsilon_n(\omega)}
$$

其中 $\varphi_n(r)$ 和 $\varepsilon_n$ 是如下本征方程的本征函数和本征值：

$$
H_0\varphi_n+\int\mathrm dr'\Sigma(r,r')\varphi_n(r')=\varepsilon_n\varphi_n
$$

注意：我们上面得到的 $\tilde G$ 的表达式和一开始推导出的形式相同，那么表明 $\varphi_n$ 就是实际体系的轨迹，而 $\varepsilon_n$ 就是我们要求的准粒子能量。

综上所述，我们只要*求解这一（单粒子）本征方程就能得到准粒子能量*了！

# $GW$ 近似和 $G_0W_0$ 近似

## Hedin 方程组

在上述方程中，$H_0$ 是清楚的，但自能函数 $\Sigma$ 是不清楚的。如果读者接触过密度泛函理论的话，一定会想起来密度泛函中也有类似的操作：我们把所有非经典的相互作用都放到了交换关联泛函 $E_{\rm xc}[\rho]$ 中。这种做法，可以简称为：

### 把脏东西都扫到地毯下面。

不过，交换关联泛函我们只能猜测，而自能函数，至少*从理论上我们有第一性原理的方法来求解*，这种方法被称为 Hedin 方程组，是由如下四个耦合的方程给出的：

![http://img.candobear.com/2019-10-18-212502.png](http://img.candobear.com/2019-10-18-212502.png)

Hedin 方程组

其中，数字 $1,2,\cdots,7$ 指代的是不同的位置和时间，即 $1\equiv(r_1,t_1)$。不幸的是，如果我们希望求解这样的问题，那将会比原来的多体问题更复杂！

## $GW$ 近似

在介绍 $GW$ 近似之前，我们首先了解一下上式中的 $W$ 是什么意思。屏蔽相互作用函数 $W(r,r',t)$ 由下式隐式地给出：

$$
W(r,r')=v(r,r')+\int\mathrm dr''\mathrm dr'''v(r,r'')P(r'',r''')W(r''',r')
$$

其中 $P$ 是极化率，也即屏蔽相互作用是*「裸」相互作用加上一个由极化作用导致的修正项*。

而所谓的 $GW$ 近似，就是（无比机智地）在 Hedin’s 方程中的第一式中令 $\Gamma=1$，使得 $\Sigma=iGW$。显然，这是巨大的简化，使得我们只需要求解准粒子方程和这个方程就能得到自能函数 $\Sigma$，进而得到准粒子能量。

## $G_0W_0$ 近似

不过，准粒子方程和 $\Sigma=iGW$ 仍然是耦合的，不容易求解。为此，我们再进行一次简化：

### 用 $G_0$ 代替 $G$

上一篇文章中，我们指出 Kohn-Sham 轨道可以给出一个近似的 $G_0\approx G$。鉴于 $\Sigma$ 本身就是对 $G$ 的一个修正项，我们这里就*忽略掉「修正项的修正项」*，使用（已知的）*G*0 代替未知的 *G*。

### 用 $W_0$ 代替 $W$

鉴于 $W$ 的定义本身就是隐式的，我们仍然用忽略掉「修正项的修正项」的思想，用 $v$ 代替 $W$，用 $G_0$ 直接计算 $P$。这样计算得到结果记为 $W_0$。

## 能量修正表达式

现在，我们可以用所有已知量一次性地表达 $\Sigma$ 了。我们再来看看准粒子方程：

$$
H_0\varphi_n+\int\mathrm dr'\Sigma(r,r')\varphi_n(r')=\varepsilon_n\varphi_n
$$

这个方程看上去是不是有点眼熟？是的！如果将自能函数 $\Sigma(r,r')$ 换成交换关联势 $v_{\rm xc}(r,r')$，那么将与 Kohn-Sham 方程无异（请注意 $H_0$ 已包含了核吸引势和 Hartree 势）。

如果密度泛函理论已经是一个较好的近似理论，我们应该预计：*自能函数相对于交换关联势的修正不大*。在这种情况下，我们可以用一阶微扰理论修正准粒子能量。

在一阶微扰理论中，如果已经解出 $H_0\varphi=\varepsilon_0\varphi$，对于新的 Hamilton 量 $H_0+V$，我们可以近似认为相应的能量本征值是 $\varepsilon=\vaepsilon_0+\langle\varphi_0|V|\varphi_0\rangle$ 在这里，$V$ 实际上是非局域势

$$
\int dr'(\Sigma(r,r')−V_{\rm xc}(r,r'))
$$

所以，通过对这个非局域势取期望，就能够获得准粒子的能量修正。

# 随机函数

## 函数的离散表示

上一节中我们把求解准粒子能量归结为计算 $GW$ 之积，不过在开始今天的话题之前首先要补充一些数学基础。

假设我们现在处理的都是有限体系（如小分子），那么我们可以用有限个格点处的函数值来描述一个函数。假设三维格点是 $n=(i,j,k)$ 而格点的间距都是 $h$，那么此时我们可以定义两个函数的向量内积为：

$$
\begin{aligned}
\langle f|g\rangle&=\int f(r)g(r)\mathrm d\tau\\
&\approx \sum_{n}f_ng_nh^3
\end{aligned}
$$

也即用有限体元来近似全空间的积分值。

## 随机函数

现在假设我们定义了这样一个函数，它在所有格点上的取值都是 $\zeta_n=\pm h^{3/2}$ 而取正还是取负是随机的。显然，这个函数的模方是 $\langle\zeta|\zeta\rangle=\sum_n (h^{-3/2})^2h^3=K$ 其中 $K$ 是格点总数（注意它不是归一化的）。

## 单位算符的随机函数表示

我们现在取很多个随机函数，并定义*随机单位算符*

$$
1_N=\frac1N\sum_{\zeta}|\zeta\rangle\langle\zeta|
$$

这个形式很像是单位算符的形式，那么它能不能用来近似单位算符呢？我们在基础量子力学中知道，一个算符是单位算符当且仅当对任意函数 $|\varphi\rangle$，都有 $1|\varphi\rangle=|\varphi\rangle$；当内积正定（没有迷向向量）时，这等价于对于任意函数 $|\varphi\rangle$，都有 $\langle\varphi|1|\varphi\rangle=\langle\varphi|\varphi\rangle$ 下面我们试图证明 $1_N$ 在 $N$ 很大的时候也有这个性质。

*定理* （随机单位算符的期望）对任意单位向量 $|\varphi\rangle$，$\langle\varphi|1_N|\varphi\rangle$ 的期望是 1。

证明：

$$
\begin{aligned}
E[\langle\varphi|1_N|\varphi\rangle]
&=E\left[\frac1N\sum_{\zeta}\langle\varphi|\zeta\rangle\langle\zeta|\varphi\rangle\right]\\
&=\frac1N\sum_{\zeta}\sum_{m,n}\varphi_m^*E\left[\zeta_m\zeta_n\right]\varphi_nh^6\\
&=\frac1N\sum_{\zeta}\sum_{m,n}\varphi_m^*\varphi_nh^3\delta_{mn}=1\\
\end{aligned}
$$

*定理* （随机单位算符的方差）对任意单位向量 $|\varphi\rangle$，$\langle\varphi|1_N^2-1|\varphi\rangle$ 的期望是 $(K−1)/N$，其中 $K$ 是此前定义过的格点个数。

证明：

$$
\begin{aligned}
&\qquad E[\langle\varphi|1_N^2-1^2|\varphi\rangle]\\
&=E\left[\frac1{N^2}\sum_{\zeta,\xi}\langle\varphi|\zeta\rangle\langle\zeta|\xi\rangle\langle\xi|\varphi\rangle\right]-1\\
&=E\left[\frac1{N^2}\sum_{\zeta}\langle\varphi|\zeta\rangle\langle\zeta|\zeta\rangle\langle\zeta|\varphi\rangle\right]+E\left[\frac1{N^2}\sum_{\zeta\ne\xi}\langle\varphi|\zeta\rangle\langle\zeta|\xi\rangle\langle\xi|\varphi\rangle\right]-1\\
&=\frac KN+\frac{N-1}{N}-1\\
&=\frac{K-1}N
\end{aligned}
$$

这样，我们证明了随机单位算符以 $N^{-1/2}$ 的速度收敛于单位算符。

# Green 函数的随机表示

## 从 Green 函数到 Green 算符

在上一节，我们给出了以 Kohn-Sham 轨道为基组的 Green 函数表达式：

$$
\begin{aligned}
&iG_0(r,r',t)\\&=\sum_n\varphi_n(r)\varphi_n(r')e^{-i\varepsilon_n^{\rm KS}t}[\theta(t)-f_n]
\end{aligned}
$$

但是，如果我们直接计算它的话，会十分困难：我们需要知道系统所有的轨道，无论是占有的还是未占有的。

这里就引入了一个非常重要的思想：*对于复杂系统基态的计算，从物理图像上来说不应该涉及到所有的轨道*。

我们重新检视这个表达式，发现 $\theta(t)-f_n$ 的本质在于：

- 在「$t<0$ 的过去」，投影到占据轨道上；
- 在「$t>0$ 的未来」，投影到未占据的轨道上。

于是我们可以把 Green 函数借助化学势写成这个形式：

$$
\langle r'|e^{-iH_0t}[\theta(t)−\theta(\mu-H_0)]|r\rangle
$$

其中 $\theta(\mu-H_0)$ 就对应着 $f_n$。

## 从单位算符到随机单位算符

当我们把算符乘到由 $1=\sum_n|\varphi_n\rangle\langle\varphi_n|$ 构成的单位算符上的时候，就形成了原先的 Green 函数形式。但现在我们用 $1_N$ 代替 $1$，就可以写成

$$
\begin{aligned}
&\qquad iG_0(r,r',t)\\
&=\langle r'|e^{-iH_0t}[\theta(t)-\theta(\mu-H_0)]|r\rangle\\
&\approx\frac1{N_{\zeta}}\sum_{\zeta}\langle r'|\zeta\rangle\langle\zeta|e^{-iH_0t}[\theta(t)-\theta(\mu-H_0)]|r\rangle\\
&=\frac1{N_{\zeta}}\sum_{\zeta}\zeta(r')\zeta(r,t)
\end{aligned}
$$

在上式中我们把计算的负担转移到了 $\zeta(r,t)$ 上，而 $\theta(\mu-H_0)$ 这个复杂的投影算符可以用 $\theta_\beta(\mu-H_0)$ 在 $\beta\to\infty$ 时来近似，其中

$$
\theta_{\beta}(x)=\frac12(1+\operatorname{erf}(\beta x))
$$

是一个「平滑化」的 $\theta$ 函数，可以用 Chebyshev 多项式来近似计算。

下一节我们将针对 $W$ 给出类似的随机表达式，并证明给定一个误差限，总体的计算量是随系统大小*线性*增长的，因而是非常高效的计算方法。

## $GW$ 的随机解耦

在（二）中，我们将自能期望转化到时域 $\Sigma(t)$ 后，它包含两部分：一部分是由瞬时交换作用造成的 $\Sigma^{\rm X}(t)$，另一部分是由极化作用造成的 $\Sigma^{\rm P}(t)$。前者的计算比较容易，所以我们下面只考虑 $\Sigma^{\rm P}(t)$。根据我们（三）中对 Green 函数 $G_0$ 的随机表示，我们有：

$$
\begin{aligned}
\Sigma _n^ {\rm P } ( t ) &= \int\mathrm dx\mathrm dx' \varphi _ { n }( r ) i G _ { 0 } ( r , r ^ { \prime } , t ) W _ { P } ( r , r ^ { \prime } , t ^ { + } ) \varphi _ { n } ( r ^ { \prime } )\\
&=\left\langle \int\mathrm dx\mathrm dx' \varphi _ { n }( r ) \zeta(r,t) W _ { P } ( r , r ^ { \prime } , t ^ { + } ) \varphi _ { n } ( r ^ { \prime } )\zeta(r')\right\rangle_{\zeta}
\end{aligned}
$$

既然 $\zeta(r,t)$ 和 $W_P(r,r',t)$ 都是含时的，我们应该将它们解耦。定义 $f_n(r,t)=\varphi_n(r)\zeta(r,t)$，我们可以发现：

$$
\begin{aligned}
f_n(r,t)&=\langle r|f_n\rangle\\
&\approx \langle\langle r|\xi\rangle\langle \xi|f_n\rangle\rangle_{\xi}\\
&=\left\langle\int\mathrm dr''\langle r|\xi\rangle\langle \xi|r''\rangle\langle r''|f_n\rangle\right\rangle_{\xi}\\
&=\left\langle\int\mathrm dr''\xi(r'')f_n(r'',t)\xi(r)\right\rangle_{\xi}\\
\end{aligned}
$$

因此

$\Sigma^{\rm P}(t)$ 可以写成

$$
\Sigma_{n}^{\rm P}(t)=\langle A_{n\zeta\xi}B_{n\zeta\xi}\rangle_{\zeta\xi}
$$

其中 $A_{n\zeta\xi}(t)=\int\varphi_n(r)\zeta(r,t)\xi(r)\mathrm dr$

$$
B_{n\zeta\xi}(t)=\int\xi(r)W^{\rm P}(r,r',t)\varphi_n(r')\zeta(r')\mathrm dr\mathrm dr'
$$

## 随机传播

### 计算 $B_{n\zeta\xi}$

对 $A_{n\zeta\xi}$ 的计算是平凡的，但对 $B_{n\zeta\xi}$ 不是这样。我们首先在频域将时序形式转化为延迟形式：

$$
\tilde { B } _ { n \zeta \xi } ( \omega ) = \operatorname { Re } \tilde { B } _ { n \zeta \xi } ^ {\rm R } ( \omega ) + i \operatorname { sgn } ( \omega ) \operatorname { Im } \tilde { B } _ { n \zeta \xi } ^ {\rm R } ( \omega )
$$

这样我们就能将延迟的 $B_{n\zeta\xi}^{\rm R}$ 用延迟的敏感函数 $\xi$ 表示：

$$
B _ { n \zeta \xi } ^ {\rm R } ( t ) = \int \xi ( r ) v (r,r ^ { \prime }) \Delta n _ { n \zeta } ^ { r } ( r ^ { \prime } , t )\mathrm d r\mathrm d r ^ { \prime }
$$

$$
\Delta n _ { n \zeta } ^ {\rm R } ( r , t ) = \int \chi ^ {\rm R } ( r , r ^ { \prime } , t ) v _ { n \zeta } ( r ^ { \prime } )\mathrm d r ^ { \prime }
$$

$$
v _ { n \zeta } ( r ^ { \prime } ) = \int v ( r ',r'') \varphi _ { n } ^ {\rm KS } ( r ^ { \prime \prime } ) \zeta ( r ^ { \prime \prime } )\mathrm d r ^ { \prime \prime }
$$

鉴于我们并不知道 $\xi$ 的具体形式，我们无法直接计算上述积分。幸运的是我们可以通过线性响应理论来计算。

### 线性响应理论

我们首先考虑一个一般的情况。给一个系统一个微扰势能 $u(r,t)=\tau u(r)\delta(t)$，造成的影响是什么？

在二次量子化表象下，这个势对系统的 Hamilton 量贡献可以写成

$$
H_1=\int\mathrm dr\psi^\dagger(r,t)u(r,t)\psi(r,t)=\int\mathrm drn(r,t)u(r,t)
$$

从而根据相互作用表象，$n_u(r,t)$（微扰后的电子密度）可以与微扰前演化到同一时刻的电子密度 $n(r,t)$ 联系起来：

$$
\langle n_u(r,t)=\langle U^\dagger(t,0)n(r,t)U(t,0)\rangle
$$

其中传播算符是

$$
U=\exp\left(-i\int_0^t\mathrm d\tau\int\mathrm dr' n(r',t)u(r',t)\right)\approx 1-i\int_0^t\mathrm d\tau\int\mathrm dr'n(r',t)u(r',t)
$$

所以电子密度差 $n_u(r,t)-n(r,t)$ 应该是

$$
\Delta n(r,t)\approx−i\int_0^t\mathrm dt'\int\mathrm dr'u(r',t')\langle [n(r,t),n(r',t')]\rangle
$$

在这里我们可以定义（延迟的）敏感函数

$$
\chi^{\rm R}(r,r',t,t')=-i\langle [n(r,t),n(r',t')]\rangle
$$

当然，根据与之前类似的论证，$\chi^{\rm R}$ 只与 $t-t'$ 有关，因此

$$
\Delta n(r,t)\approx\int_0^t\mathrm dt'\int\mathrm dr'\chi(r,r',t-t')u(r',t')
$$

此外 $u(r',t')$ 是瞬时的 $\tau u(r')\delta(t')$，因而

$$
\Delta n(r,t)= \tau \int \mathrm d r ^ { \prime } \chi ^ {\rm R} ( r , r ^ { \prime } , t ) u ( r ^ { \prime } )
$$

这个积分完全等价于通过传播含时 Schrödinger 方程来模拟体系来直接获得密度差。所以我们在 $t=0$ 时使用这个冲击势，此时其他的部分都可以忽略，方程可以写成

$$
i\frac{\partial}{\partial t}\psi(r,t)=\gamma\delta(t)u(r)\psi(r,t)
$$

所以我们在一个无限小的时内积分，将得到

$$
\begin{aligned}
\psi(t=0^+)&=\exp\left(-i\int_{t=0^-}^{t=0^+}\tau\delta(t)v(r)\right)\psi(t=0^-)\\
&=e^{-i\tau v(r)}\psi(t=0^-)
\end{aligned}
$$

进行这样的微扰后，我们进行传播，然后再计算一篇不微扰的传播，就能得到密度差。

不过，直接用体系的「真实」Schrödinger 方程来传播是不现实的。

### 含时 Hartree 方法

我们仍然可以近似地把问题当成一个单电子问题并用 Kohn-Sham Hamilton 量来传播，其中的 Hartree 势所依赖的密度动态更新。

$$
i \frac { \partial } { \partial t } \eta ( r , t ) = \left[h + v_{\rm H}[n(r,t)]+v_{\rm XC}[n(r,0)]\right]\eta(r,t)
$$

传播了一会之后，我们计算

$$
\Delta n _ { n \zeta } ^ {\rm R } ( r , t ) = \frac { 1 } { \tau } \langle | \eta _ { \tau } ( r , t ) | ^ { 2 } - | \eta _ { 0 } ( r , t ) | ^ { 2 } \rangle _ { \eta }
$$

其中 $\eta_\tau$ 是微扰后轨迹的传播结果，而 $\eta_0$ 是微扰前的传播结果。

一旦得到这一密度差后，我们就可以计算 $B^{\rm R}_{n\zeta\xi}(t)$，再转换成时序形式 $B_{n\zeta\xi}(t)$ 就可以得到我们所要的 $\Sigma(t)$ 了。

### 含时密度泛函方法

类似于含时 Hartree，但交换关联势所依赖的密度也在实时更新：

$$
H\approx h + v_{\rm H}[n(r,t)]+v_{\rm XC}[n(r,t)]
$$

---

至此，利用 Green 函数与随机方法进行准粒子能力计算的全部框架已经介绍完毕。

不过，还记得我们在做 $GW$ 近似时，近似认为顶点函数 $\Gamma=1$ 吗？在某些情况下，这是一个不合理的近似。后续的讨论主题可能会加入对这一问题的考虑，也称「顶点修正」。
