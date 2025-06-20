---
title: 涨落定理简介
date: 2019-08-13
categories: [物理, 化学]
cover: https://images.tansongchen.com/fluctuation-theorems.webp
description: It is causality which ultimately is responsible for breaking time reversal symmetry and which leads to the possibility of irreversible macroscopic behavior.
---

# 时间反演与 Loschmidt 佯谬

## 力学与热力学的矛盾

自热力学第二定律建立以来，它就与经典力学表现出一个明显的矛盾：组成宏观物体的微观粒子所遵循的动力学方程都是时间反演对称的，而热力学第二定律却表现出明显的时间反演不对称性。具体来说，当 Hamilton 量不含有磁场时，在时间反演映射 $t\to -\tau,q\to Q,p\to -P$ 下有 $H\to H$，从而正则方程

$$
\frac{\mathrm dP}{\mathrm d\tau}=\frac{\mathrm dp}{\mathrm dt}=-\frac{\partial H}{\partial q}=-\frac{\partial H}{\partial Q}
$$

$$
\frac{\mathrm dQ}{\mathrm d\tau}=-\frac{\mathrm dq}{\mathrm dt}=-\frac{\partial H}{\partial p}=\frac{\partial H}{\partial P}
$$

的形式得到保持。但热力学第二定律告诉我们， $\Delta S\ge 0$，用更加微观一些的语言表述，这意味着给定初始的宏观态和结束的宏观态，对每一条微观轨迹 $x(t)$ 上的熵产生泛函取平均时总是大于 0：$\langle\Omega[x(t)]\rangle\ge0$。也即虽然某些轨迹的熵可以减少，但从系综平均来看，熵是增加的。为了解决这个矛盾，Boltzmann 在非平衡统计力学中提出了稀薄气体的 $H$ 定理（其中 $d\omega$ 为相空间体积元，$f$ 为相空间分布函数）：

$$
H=\int f\ln f\mathrm d\omega=\langle\ln f\rangle
$$

并证明了 $H$ 对时间的导数总是小于 0。上式与 Gibbs 熵公式 $S=-\sum_ip_i\ln p_i$ 非常相似，因此 $H$ 恒减可以等价地看作是 $S$ 恒增。但 Loschmidt 提出，如果在某一时刻将粒子的动量全部反向，$f$ 是动量偶函数（保持不变），而系统沿轨迹原路返回，所产生的 $H$ 函数将随时间增加，而这也是不违背力学规律的。

为了解释这个矛盾，有人曾提出过「不可逆性人择原理」，即我们生活的时间与空间恰好是使得 $H$ 函数随时间减少的时空范围，从生命体本质上也是一种非平衡耗散结构来看，$H$ 函数减少是生命存在的必要条件，因此在 $H$ 函数增加的宇宙中，并不会产生出相应的智慧生物来观测到这一现象。显然，就如同宇宙学中的人择原理一样，这种看法引发了强烈的质疑，更多人愿意寻找非人择的、更基本的物理解释。

## 描述介观尺度的规律

将宏观过程的不可逆性与微观过程的可逆性联系在一起引出矛盾，在科学哲学的意义上是一种还原论的方法，它认为高一级尺度上的规律可以完全由低一级尺度上的规律的叠加来描述。然而，就像近年来关于复杂性的科学所讨论的那样，「整体大于部分之和｜More is Different」，高一级尺度上可能由于个体之间的相互作用而表现出完全不同的规律，微观过程的动力学规律与宏观过程的热力学规律就是如此。

因此，想要解决这个问题，就必须考虑介于宏观和微观之间的体系，讨论这样的宏观小微观大的体系中不可逆性是如何随着体系的增大而一步步产生出来的。我们将要看到，描述这样的小体系的科学语言就是非平衡动力学。

# 涨落定理

## 过程涨落定理（TFT）

以下我们假定体系的运动可以用经典力学描述，并使用如下的标记：

- 由 $n$ 个自由度的运动所张成的 $2n$ 维向量 $x(t)=(q_1,...,q_n,p_1,...,p_n)$；
- 体系在相空间中的分布函数 $f(x,t)$，其物理意义是在时刻 $t$，体积元 $x+\mathrm dx$ 内找到系统的概率。

根据总概率守恒，类比于流体的连续性方程我们可以得到体系的运动方程：

$$
\frac{\partial f(\mathbf x(t),t)}{\partial t}=-\nabla\cdot(f\dot{\mathbf x}(t))
$$

由 $\div(F\varphi)=\varphi\div F+F\cdot\operatorname{grad}\varphi$，可以得到

$$
\frac{\mathrm df(\mathbf x(t),t)}{\mathrm dt}=-(\nabla\cdot\dot{\mathbf x}(t))f
$$

注意，如果体系是孤立的，则 $\dot{\mathbf x}(t)$ 可以用 Hamilton 方程描述，它是标量函数 $H$ 的梯度（$\dot{\mathbf x}(t)=\mathbf J\nabla H$），从而散度恰好为 0。这说明，$(\nabla\cdot\dot{\mathbf x}(t))$ 从某种意义上表示了体系与外界耦合从而发生不可逆过程的强度，当它为 0 时 Liouville-Poincaré 守恒律表明相空间的体积守恒，所以我们记它为压缩因子 $z(t)$。

这样，分布函数的变化可以写为 $f(x(t),t)=f(x(0),0)\exp\left(−\int_0^t z(\tau)\mathrm d\tau\right)$ 如果相空间体积不守恒，含有相同数量相点的体积就会压缩或者膨胀，鉴于概率守恒，记 $\omega$ 是初始相点附近的小体积，那么 $f(x(t),t)\omega(x(t),t)=f(x(0),0)\omega(x(0),0)$，所以体积膨胀可以表示为

$$
\omega(x(t),t)=\omega(x(0),0)\exp\left(\int_0^tz(\tau)\mathrm d\tau\right)
$$

现在我们考虑对轨迹的终点做时间反演变换，反演中心是 $t/2$，即 $M:x(t)\equiv(q(t),p(t))\to y(0)=(q(t),-p(t))$，那么这个变换的 Jacobi 行列式等于 1，所以应该有 $\omega(x(t),t)=\omega(y(0),0)$。所以，正向轨迹和反演后轨迹所含的相点数目之比是

$$
\frac{f(\mathbf x(0),0)\omega(\mathbf x(0),0)}{f(\mathbf y(0),0)\omega(\mathbf y(0),0)}=\frac{f(\mathbf x(0),0)}{f(\mathbf x(t),0)}\exp\left(-\int_0^tz(\tau)\mathrm d\tau\right)
$$

我们把这个式子定义为耗散泛函的指数 $e^{\Omega t}$。

---

我们现在可以导出过程涨落定理（transient fluctuation theorem, TFT）的主要结果了。考虑在时间 $t$ 内耗散泛函平均值为 $A$（$p(\Omega=A)$）和平均值为 $−A$（$p(\omega=−A)$）的比值，它可以表示为那些「**随后将要生成这些轨迹的初始相点数量**」的比值。具体来说，

$$
\begin{aligned}
\frac{p(\Omega=A)}{p(\Omega=-A)}=\frac{\sum_i^{\Omega=A}\omega(\mathbf x_i(0),0)f(\mathbf x_i(0),0)}{\sum_i^{\Omega=-A}\omega(\mathbf y_i(0),0)f(\mathbf y_i(0),0)}
\end{aligned}
$$

我们将这些 $\Omega=-A$ 的轨迹全部取时间反演，则变成

$$
=\frac{\sum_i^{\Omega=A}\omega(\mathbf x_i(0),0)f(\mathbf x_i(0),0)}{\sum_i^{\Omega=A}\omega(\mathbf x_i(0),0)f(\mathbf x_i(0),0)e^{-\Omega t}}
$$

由于求和号内的 $\Omega$ 都相同，所以可以提到求和号外，因此

$$
\frac{p(\Omega=A)}{p(\Omega=-A)}=e^{A t}
$$

---

对上式，我们可以作出如下的解读：

### 概率论解读

由于 $A$ 是广延量，它随体系大小增长和增长，可以认为对大体系、长的观测时间，$e^{At}$ 是非常大的数，使得产生正耗散的概率相对于负耗散的概率是压倒性的，这说明了微观可逆到宏观不可逆的变化并不是质变，而是关于体系大小和观测时间的量变。

### 积分解读

我们可以在上式中对所有轨迹进行积分：

$$
\int p(\Omega=A)\mathrm dA=\int e^{At}p(\Omega=−A)\mathrm dA
$$

也即：$e^{-\Omega t}=1=e^0$。根据 Jensen’s （琴生）不等式，有 $\langle e^{x}\rangle\ge e^{\langle x\rangle}$，因此平均来看，耗散大于 0： $\langle\Omega\rangle\ge0$。这与热力学第二定律相容。

### 耗散泛函的物理意义

上述定义出来的耗散泛函到底是个什么东西？它取决于具体系综的形式。例如，正则系综下耗散泛函为 $\Omega t=W−\Delta F$ 由于 $W=\Delta U-Q$，$\Delta F=\Delta U-T\Delta S$，所以上式总的结果是 $-Q+T\Delta S$。体系的熵变可以分解为因热交换产生的熵 $\Delta S_1=Q/T$，以及纯粹因不可逆性产生的熵 $\Delta S_2$，那么可以看出上式就等于 $T\Delta S_2$。因此，正则系综下耗散泛函有平均熵产生率的物理意义。

## 稳态涨落定理（SSFT）

处在非平衡状态的系统有可能达到某种稳定的状态，在这种状态下体系稳定地产生耗散，速率不随时间变化。假设达到这种平衡的弛豫时间为 $\tau$，那么当 $t/\tau\gg 1$ 时，应该有

$$
\begin{aligned}
\lim_{t/\tau\to\infty}&\frac1t\ln\frac{p(\Omega(t>\tau)=A)}{p(\Omega(t>\tau)=-A)}\\
= &\frac1t\ln\frac{p(\Omega=A)}{p(\Omega=-A)}=A
\end{aligned}
$$

这表明在非平衡稳态（steady state）时，这种轨迹的概率分布不随时间改变。

# 涨落定理与因果律

在推出涨落定理之后，我们大概需要回头来问一句，在时间反演对称的运动方程中我们是从哪里引入不对称性，从而推导出所需要的结果的呢？

注意，我们为了计算产生耗散 $A$ 和 $-A$ 的相对概率，所使用的方法是考虑「**随后将要生成这些轨迹的初始相点数量**」。如果我们考虑「**此前曾经生成这些轨迹的相点数量**」，从轨迹的唯一性、时间反演对称性来看这是等价的，结果又如何呢？

$$
\frac{f(\mathbf x(t),t)\omega(\mathbf x(t),t)}{f(\mathbf y(t),t)\omega(\mathbf y(t),t)}=e^{-\Omega t}
$$

代入

$$
\begin{aligned}
\frac{p(\Omega=A)}{p(\Omega=-A)}=\frac{\sum_i^{\Omega=A}\omega(\mathbf x_i(t),t)f(\mathbf x_i(t),t)}{\sum_i^{\Omega=-A}\omega(\mathbf y_i(t),t)f(\mathbf y_i(t),t)}
\end{aligned}
$$

我们就能得到「反涨落定理」！

$$
\frac{p(\Omega=A)}{p(\Omega=-A)}=e^{-A t}
$$

据此，Evans 表示：

> It is causality which ultimately is responsible for breaking time reversal symmetry and which leads to the possibility of irreversible macroscopic behavior.
>

因果律是一种公理，是我们认识世界所默认使用的方法论的一部分。如果我们采用反因果律（未来决定过去）的思考方式重复上述推导，就能得到相反的结果，也即耗散泛函的平均值总是为负，宏观物体的熵永不减少。总之，将热力学第二定律的时间不可逆性与因果律联系起来，无疑是一种更加不「人择」的讲法，也为非平衡动力学的更多认识奠定了基础。
