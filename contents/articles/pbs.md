---
title: 在课题组中优雅地使用 PBS
date: 2019-08-29
tags: [技术]
cover: https://images.tansongchen.com/pbs.webp
abstract: 截止 2019 年 9 月，课题组的计算集群上配备了由中科曙光提供的可移植批处理系统（Portable Batch System，下简称 PBS），可供大家提交计算任务使用。
---

上篇：基本使用

# 可移植批处理系统简介

截止 2019 年 9 月，课题组的计算集群上配备了由中科曙光提供的可移植批处理系统（Portable Batch System，下简称 PBS），可供大家提交计算任务使用。

PBS 最初是 NASA 管理计算任务时研发的系统，发展到今天有 OpenPBS、TORQUE 和 PBS Professional 三个主要的发行版。不幸的是，经过咨询我并没有得知集群上安装的是哪一个发行版；我在网上找到的最详细的手册是由 [PBS Professional 18.2](https://www.pbsworks.com/pdfs/PBSUserGuide18.2.pdf) 提供的，但其中的少部分命令并不能在集群上运行。不过，本文中所使用的命令均经过了集群上的测试，可以放心使用。

# 脚本文件编写

## 准备工作

- 了解类 Unix 系统的基本命令；
- 具有一个可以执行这些基本命令的 Shell，例如 Linux、macOS 系统或 Windows 10 中的 Linux 子系统的终端；
- 具有一个集群帐户，并且会使用 `ssh user@host` 命令登录到自己的帐户

## 脚本文件概览

假设你现在拥有一个 Fortran 90 源码文件 `Hello.f90`，它的内容是这样的：

```fortran
program Hello
    print *, 'Hello World!'
end program
```

我们将它上传到自己的帐户根目录 `~`，并试图将它提交为一个任务。为此，我们可以在自己的帐户根目录 `~` 下新建一个脚本文件 `script`：

```bash
vim script
```

粘贴以下命令：

```bash
#PBS -q mix
#PBS -V
#PBS -S /bin/bash
#PBS -l nodes=1:ppn=24
#PBS -l walltime=24:00:00
source /opt/software/bashrc
NP=$(cat $PBS_NODEFILE | wc -l)
cd $PBS_O_WORKDIR
ifort Hello.f90
uniq $PBS_NODEFILE > tmpfile
mpirun -np $NP -machinefile tmpfile ./a.out
```

下面对其进行逐行的解释：

### 参数部分

1. `#PBS -q mix`：指定了任务所处的队列（集群上只有 `mix` 这一个队列）；
2. `#PBS -V`：将 PBS 所拥有的环境变量（如工作目录等）全部导入到本脚本中以便使用；
3. `#PBS -S /bin/bash`：指定了本脚本是一个 bash 脚本；
4. `#PBS -l nodes=1:ppn=24`：向 PBS 要求 1 个节点和 24 个核的资源进行计算（集群上有 14 个节点，每个节点为 24 或 28 核）；
5. `#PBS -l walltime=24:00:00`：指定了本任务运行 24 小时后强制停止；

### 命令部分

1. `source /opt/software/bashrc`：从这里导入环境变量，如接下来要用到的 ifort 编译器；
2. `NP=$(cat $PBS_NODEFILE | wc -l)`：从 PBS 系统中查询实际获取到的核数目（可能小于要求的数目）；
3. `cd $PBS_O_WORKDIR`：转到 PBS 的工作目录下；
4. `ifort Hello.f90`：使用 ifort 编译器编译 Fortran 源代码，输出的可执行文件默认为 `a.out`；
5. `uniq $PBS_NODEFILE > tmpfile`：将 PBS 的运行配置保存到临时文件中；
6. `mpirun -np $NP -machinefile tmpfile ./a.out`：使用 mpirun（并行运行工具）来运行编译好的 `a.out` 文件，使用的核数为第 2 步中获取到的值。

## 提交脚本

现在，你可以在根目录下提交这个脚本：

```bash
qsub script
```

提交后，系统会将任务的 id `XXXXX.mu01` 输出到屏幕上。如果一切顺利，在根目录下将会产生四个新文件：

1. `tmpfile` 即刚才说的临时文件；
2. `a.out` 是编译生成的文件；
3. `script.oXXXXX` 是标准输出文件；
4. `script.eXXXXX` 是标准错误文件。

其中 XXXXX 是自动生成的任务序号，在 2019 年 9 月这个序号的数值大约为 81000，后续会不断增加。`mu01` 则是服务器的名字。

我们首先来看标准输出文件。`script.oXXXXX` 的内容是：

```bash
Copyright (C) 2009-2014 Intel Corporation. All rights reserved.
Intel(R) Inspector XE 2015 (build 379161)
Copyright (C) 2009-2015 Intel Corporation. All rights reserved.
Intel(R) VTune(TM) Amplifier XE 2015 (build 403110)
Copyright (C) 2009-2014 Intel Corporation. All rights reserved.
Intel(R) Advisor XE 2015 (build 380555)
Hello World!
```

前六行是在导入环境变量时 Intel 打广告产生的输出，而 `Hello World!` 是程序运行产生的输出。~~（目前没有发现不让 Intel 打广告的办法，就这样吧。）~~

其次看标准错误文件。`script.eXXXXX` 的内容是：

```
-bash: BASH_FUNC_module(): line 0: syntax error near unexpected token `)'
-bash: BASH_FUNC_module(): line 0: `BASH_FUNC_module() () {  eval `/usr/bin/modulecmd bash $*`'
-bash: error importing function definition for `BASH_FUNC_module'
/opt/software/bashrc: line 25: /opt/software/g09/bsd/g09.profile: 权限不够
/opt/software/bashrc: line 40: /etc/profile.d/conda.sh: 没有那个文件或目录
/opt/software/bashrc: line 41: conda: command not found
```

比较遗憾的是，这里确实有一些错误。这些错误主要是导入环境变量时产生的，部分环境变量~~因年久失修~~找不到对应的资源。不过，这对于我们的应用来说没有影响，因此不用管它就好了。

## 其他常用命令

### 为任务命名

在脚本的参数部分加入 `#PBS -N <JobName>` 可以为任务设置名称。如果像刚才一样不设置名称，会将所提交脚本的文件名作为任务的名称，例如 `script`。

### `qstat` 查看作业状态

登录后，使用 `qstat` 命令可以查看当前正在运行的作业。返回信息的格式为：

```
序号｜任务名｜用户｜运行时间｜运行状态｜队列
```

所以，当需要一次提交大量任务时，推荐为任务命名以分辨。

### `qdel` 取消作业

如果任务能够正常运行，但我们出于某些原因想停止它（如源码中有错误或运行时间过长），我们可以使用 `qdel XXXXX.mu01` 命令来强制停止。

### 链接库

服务器上预装了 Intel 数学核心库（Intel MKL）并配置好了环境变量。如果你提交了 Fortran 源码并使用 ifort 编译器编译，只需要在编译选项中加入 `-mkl` 即可完成链接。如果你还需要使用 Lapack 95 接口，那么只需要在编译选项中加入 `mkl -lmkl_lapack95_lp64` 即可完成链接。（使用 Lapack 95 接口的优势可以参考[我此前写的介绍](https://tansongchen.com/hpc/)。）

如果你使用其他程序设计语言或其他库，请查看 `/opt/software/bashrc` 中是否含有所需要的资源，或咨询其他人以完成配置。

### 别名（Alias）与免密码登录的配置

配置别名可以让我们用简单的名字代替 `user@host`，而免密码登录可以让我们每次不需要输入密码，这不仅简化了操作，也是本文后半部分进行自动化的前提之一。

- [配置别名的教程](https://blog.csdn.net/xlgen157387/article/details/50282483)；
- [配置免密码登录的教程](https://blog.csdn.net/zhuying_linux/article/details/7049078)。

下篇：优雅使用

# 文件同步

## 说明

理论上，了解文章的前半部分已经足以使我们完整地使用这个系统。不过值得指出的是，这样做并不十分优雅。例如：

- 实际使用中，我们的任务并不会和 `Hello.f90` 一样简单，提交这样的任务通常需要我们上传很多文件；
- 每个任务所编译的源码是不同的，所以我们需要不断地写新的脚本；
- 由于服务器和本地的文件结构不一样，我们可能需要改动代码再上传，极易出错；

经过一定的配置，我比较好地解决了这些问题。如果你和我一样使用 Visual Studio Code 作为编辑器，一定会对它的任务（Task）功能有所耳闻，它可以帮助我们自动化一些动作，节省时间的同时也减少了出错的概率。通过设计任务，我的工作流程是这样的（`⌘` 是 macOS 中的 Command 键，相当于 Linux 中的 Meta 或 Windows 中的 Windows 键）：

- 按 `⌘;` `⌘u` 向服务器同步本地的代码文件并提交；
- 按 `⌘;` `⌘l` 查看作业运行情况；
- 按 `⌘;` `⌘e` 向本地同步服务器上的标准输出和标准错误文件用于调试；
- 按 `⌘;` `⌘d` 向本地同步服务器上计算产生的数据；

这是如何做到的呢？

## rsync 的使用

rsync 是一款能在本地和服务器之间同步文件的工具。在 macOS 系统中，我们可以通过「家酿啤酒」（Homebrew）包管理工具来安装它，命令为 `brew install rsync`（如果你使用 macOS 但不知道 Homebrew，~~那我怀疑你是一个假的程序猿，~~可以看这篇文章了解一下。在 Linux 系统中，它很可能已经被预置了，无需安装。rsync 的语法是：

```bash
rsync 源文件夹/ 目标文件夹
```

注意，这里源文件夹需要加 `/`，目标文件夹不需要加 `/`，语句的含义是：将源文件夹下的每一个文件同步到目标文件夹下。反之，如果是 `rsync 源文件夹 目标文件夹`，则是将源文件夹本身同步到目标文件夹下。

完整的帮助手册可以在[官方主页](https://download.samba.org/pub/rsync/rsync.html)中找到，不过本文中我们只用到了两个参数：

- `rsync -a 源文件夹/ 目标文件夹` 表示以归档模式同步，保持所有文件的属性不变；
- `rsync -a --delete 源文件夹/ 目标文件夹` 表示以严格模式同步，同步后两个文件夹下的文件完全一样，也就是说目标文件夹有但源文件夹没有的文件会被删除。

一个简单的想法是，我们可以将本地的工作文件夹（记为 `%`）与服务器上的工作文件夹（例如可以用根目录 `~`）同步。不过，这可能会导致意想不到的数据丢失。假设我们现在上传并提交了两个任务，过了一会第一个任务计算完成（同时第二个未完成），我们将数据下载了下来，又过了一会又上传了第三个任务。但此时第二个任务产生的数据在服务器上又有更新，本地的数据还是上一次下载的时候的，同步会导致旧数据覆盖新数据，造成数据丢失。

另外，一个不容易察觉但也可能造成影响的问题是：编译生成的可执行文件和模块文件（如果你也使用 Fortran）在这个过程中一同上传和下载。它们的体积相对来说很大，显著增加了同步所需要的时间，并且它们不能被不同的设备所兼容。例如，如果我们在 macOS 上编译了一个模块文件，在上传服务器时源码没有发生改动，那么安装了 Linux 系统的服务器会首先考虑直接调用这一模块文件，导致错误。（即使本地和服务器上都是 Linux 系统，不同发行版的编译结果之间也有一定差异。）

为了解决这两个问题，我们需要注意到这里所有的同步操作都是单向的：对于源码来说我们只需要将它上传到服务器，而对于数据来说我们只需要将它下载到本地。很自然地，我们可以将它们用不同的文件夹进行存放。经过一番设计，本地文件夹的结构为：

- `%/src`：存放源码文件
- `%/.module`：存放模块文件
- `%/.executable`：存放可执行文件
- `%/data`：存放本地运行产生的数据
- `%/log` 存放标准输出和标准错误文件
- **`%/cluster`：存放集群运行产生的数据**

而服务器上文件夹的结构为：

- `~/src`：存放源码文件
- `~/.module`：存放模块文件
- `~/.executable`：存放可执行文件
- `~/data`：存放集群运行产生的数据
- `~/log` 存放标准输出和标准错误文件

这样，上传是 `%/src` → `~/src`，下载是 `~/data` → `%/cluster`，互不干扰。

# 基于文件同步的工作流程

## 第一步：本地调试

下面我们将在显然，我们工作的大部分时间还是在本地进行代码设计和调试。本地编译运行的命令为：

```bash
ifort ${relativeFile} -module .module -o .executable/${fileBasenameNoExtension} -mkl -lmkl_lapack95_lp64 && .executable/${fileBasenameNoExtension}
```

上述命令的含义是：

- `${relativeFile}` 是 Code 中的环境变量，获取当前文件相对于工作目录 `%` 的路径；
- 我们对它进行编译，模块文件放置在 `%/.module`，可执行文件放置在 `%/.executable`，可执行文件的文件名即是源代码的文件名去掉后缀；
- 链接 mkl 库；
- 执行产生的可执行文件。

当待编译的源码有输出文件时，输出文件前应该加上 `data/`。例如，

```fortran
open(10, file = 'data/test.dat')
```

这里会使得这些数据都放到 `%/data` 目录中。

## 第二步：上传并提交

我们按下 `⌘;` `⌘u`，触发的命令是：

```bash
rsync -a --delete %/src/ user@host:src; ssh user@host 'qsub -v FILE=${relativeFile} script'
```

其中 `user@host` 是我们的登录帐户，如 `tansongchen@127.0.0.1`，而 `%/src` 要替换为你自己的工作目录。第一句是将本地的源码严格同步到服务器上，而第二步则是用 `qsub` 命令在服务器上提交脚本，同时将当前文件的相对目录作为一个参数传入。这一参数使得我们可以保持一个恒定的脚本而不必每次更改。这个脚本的内容是：

```bash
#PBS -q mix
#PBS -V
#PBS -S /bin/bash
#PBS -j oe
#PBS -o .log/${PBS_JOBID%.*}
#PBS -l nodes=1:ppn=24
#PBS -l walltime=24:00:00
source /opt/software/bashrc
NP=$(cat $PBS_NODEFILE | wc -l)
cd $PBS_O_WORKDIR
ifort $FILE -O3 -module .module -o .executable/${PBS_JOBID%.*} -mkl -lmkl_lapack95_lp64
uniq $PBS_NODEFILE > .executable/tmpfile
mpirun -np $NP -machinefile .executable/tmpfile .executable/${PBS_JOBID%.*}
```

其中 `FILE` 是待传入的参数，注意 Code 中文件相对于工作文件夹的路径恰好也是同步之后服务器上文件相对于根目录的路径，所以这使得同样的代码在本地编译和在服务器上编译时的行为完全一样。

相比于刚才最简单的脚本，这里有几个变化：

- `#PBS -j oe` 表明我们将标准输出（o）和标准错误（e）合并为一个文件输出；
- `#PBS -o log/${PBS_JOBID%.*}` 指定了这个输出的路径和文件名，其中 `${PBS_JOBID%.*}` 的含义是：我们首先获取这个任务的 id（作为环境变量导入），其一般格式是 `<任务序号>.<服务器名称>`，在课题组中目前为 `80xxx.mu01`；然后我们使用 `%.*` 来将 . 之后的字符替换掉，剩下的就只有序号了，输出的结果是 `.log/80xxx`；
- `o .executable/${PBS_JOBID%.*}` 表明我们将序号作为可执行文件的文件名，而不是源码的文件名，这是因为：在实际的计算任务提交过程中有可能用一个源码文件提交多次（如改变参数等），如果它们所生成的可执行文件互相覆盖，会产生不可预知的错误。

## 第三步：查看任务运行情况

假如此时服务器上没有任务正在排队，那么我们提交的任务会在约半分钟之内完成编译（视源码体量而定）。此时，我们按下 `⌘;` `⌘l`，触发的命令是：

```bash
ssh user@host 'qstat'
```

同理，这相当于模拟在服务器上输入 `qstat`。这会返回一个任务的列表，可以在其中找到自己的任务。

## 第四步：调试任务

当我们在提交作业后半分钟查看情况时，如果任务状态为 R 并且有一定的运行时间，那么说明该任务可以正常运行。反之，如果任务状态为 C，很可能是任务出现了错误（如果我们的任务没有简单到可以在半分钟内运行完的话）。此时，我们按下 `⌘;` `⌘e`，触发的命令是：

```bash
rsync -a --delete user@host:log/ %/log
```

这样，我们就能把刚才输出到 `log/` 中的标准输出文件和标准错误文件下载到本地并查看了。理论上说，有三种可能的错误：语法错，编译错和运行错。但是由于我们刚刚在本地调试好了源码，并且精巧地设计了文件体系使得源码在本地编译执行时的环境和在服务器上编译执行的环境完全相同，所以这三种错误都不太可能出现。如果错误真的出现了，那很可能是因为服务器上的编译器和链接到的库与本地的相应资源版本不同。

我曾经遇到过一个当时看上去非常费解的问题。在本地完美编译运行的程序在服务器上出现了运行错，提示信息为：

```bash
forrtl: severe (174): SIGSEGV, segmentation fault occurred
```

经过长时间的排查，终于发现：我在本地编译时使用了一个 Fortran 2008 中的新特性：可分配数组不经分配内存就可以直接赋值。本地的编译器是 Intel Parallel Studio 2019.4.233 中集成的 ifort 编译器，而服务器上则是 Parallel Studio 2013 中集成的版本，彼时对于这些新特性并无很好的支持。同时，这也表明我们要慎用这些新特性。

## 第五步：下载数据

若任务一直正常运行，并且达到了 C 的状态，那么表明任务已经运行完成。按下 `⌘;` `⌘d`，触发的命令为：

```bash
rsync -a --delete user@host:data/ %/cluster
```

注意，这里是将 `~/data/` 同步到 `%/cluster`，而不是同步到 `%/data`，因为后者存放的是本地编译运行生成的数据。下载后，我们可以查看 `%/cluster` 中的文件并将其归档，防止下一次同步时不经意间被同名文件覆盖。

# 总结

总而言之，进行如上封装操作并不是为了偷懒，而是为了减少出现严重错误（如，覆盖有用数据）的概率。如果你并不使用 Code，你可以在自己的编辑器和/或集成式开发环境中定义类似的脚本。如果它们并没有提供类似的功能，也可以写成 Shell 脚本并在命令行中执行。
