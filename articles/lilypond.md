---
title: LilyPond 简介
date: 2019-10-17
tags: [音乐, 技术]
cover: https://images.tansongchen.com/lilypond.webp
abstract: 推荐一个乐谱制作的软件
---

你或许没有听说过 LilyPond，但你绝对听说过 LaTeX。LaTeX 通过将文档的排版工作封装为一个个简单的、描述式的命令，能够使得用户轻松排版出高质量的文章。

那么，LaTeX 能不能用来排版乐谱呢？其实是可以的。你可以用你自己的包管理工具下载 [MusiXTeX](https://www.ctan.org/pkg/musixtex) 宏包，然后根据它的帮助文档在 LaTeX 中排版乐谱。不过，我相信你用不了多久，因为**它为了向下兼容 LaTeX，语法搞得太繁琐了**。

后来，一位 MusiXTeX 的开发人员忍无可忍，自己另立门户，搞出的排版工具就是我们今天的主角：*LilyPond*。

# 用纯文本书写音乐

众所周知，有很多优秀的「所见即所得」的乐谱排版软件，例如 [MuseScore](https://musescore.org/zh-hans/download)、[Sibelius](https://www.avid.com/zh/sibelius) 和 [Finale](https://www.finalemusic.com/)，那么为什么要使用看起来更加繁琐的标记语言呢？在回答这个问题之前，我们首先要界定：我们什么时候需要排版乐谱。

如果你在作曲，那么你可能需要一个数字音频工作站软件，它能够用比五线谱更直观的「钢琴卷帘」的方式呈现音乐：

![macOS 上的 GarageBand 主界面](http://img.candobear.com/2019-10-20-045656.png)

显然这一步和乐谱是没有关系的。但是，如果你*希望将自己的工作发布给别人*，例如将半成品旋律交给另一位协作者配伴奏，或者将成品提供给乐手演奏时，就必须使用更加易读的乐谱形式。也就是说，乐谱纯粹是*主体工作完成之后的一种呈现形式*。

在这一界定下，我认为基于标记语言的 LilyPond 有如下三个优势：

## 排版质量高

「所见即所得」的排版软件必须在你输入每一个音符时给出相应的排版结果，因此在一定程度上*排版缺乏全局考量*。在 LilyPond 的官网上，作者给出了巴赫的一段钢琴作品的自动排版结果：

![LilyPond 排版结果](https://pic2.zhimg.com/v2-4df2862754c3259267b81e2c79c60175_r.jpg)

对比收费软件 Finale 的结果，可见 LilyPond 在低声部的流畅程度要显著更好：

![Finale 的排版结果](https://pic4.zhimg.com/80/v2-133ae5a5a1b0f6ebfcf9049909a1f150_hd.jpg)

LilyPond 在每一次编译时都能够获得全部输入信息，因此可以作出更精细的调整。

## 批量操作

文本文件使得乐谱中的片段复用变得*从未如此简单*。你可以定义一个「变量」存储一段和弦进行，然后*在乐谱的不同地方引用这个变量*。这样，你改动一次片段，所有引用都会自动改变。

你也可以进行复制粘贴或查找替换。而在「所见即所得」的工具中，由于内容和样式是混杂在一起的，粘贴时很可能会发生意想不到的格式错位。

## 版本管理

其他排版软件都将乐谱作为 XML 或二进制文件存储，改动一个音符都会对整个文件造成极大影响。而 LilyPond 存储为文本文件，使得*版本管理工具可以轻松检测出修改之处，进而使用回退、比较、拉取等操作*。

例如，你可以使用 Git 在本地进行版本管理，也可以上传 GitHub 与你的协作者一起写~~代码~~乐谱。

# 环境配置

## 下载安装

LilyPond 的最新版本是 2.18 和 2.19 版（奇数版本号为开发版本，偶数版本号为稳定版本）。虽然 2.19 是开发版本，但由于 2.18 在处理中文字体时有一定的缺陷，所以还是建议[下载 2.19 版](http://lilypond.org/development.html)，最新的版本号为 2.19.83。

#### 对于 macOS 10.15 用户，目前官网上尚无对应的 64 位版本，但论坛上已经有人[自行编译了一个 64 位版](https://share.weiyun.com/5pV3DuD)，虽然没有图形界面，但经我测试命令行编译可用，没有遇到问题。

## 命令行编译

下面是一个 LilyPond 的示例文件：

```latex
\version "2.19.83"
\header {
  title = "小星星"
}
\relative c' {
  c4 c g' g a a g2
  f4 f e e d d c2
}
```

第一行是版本号（保证更新后的兼容性），第二行是标题，而第三行是一个新的谱表，这些记号的含义将在下一部分说明。现在你可以将它保存为 `test.ly`，然后使用命令行编译。初次编译可能需要一分钟左右（LilyPond 此时将所有可用的字体复制到程序文件夹中备用），以后编译会加快。

分情况讨论：

### macOS 10.14 及更低版本

如果你安装好了官网提供的 LilyPond.app，你可以运行

```bash
/Applications/LilyPond.app/Contents/Resources/bin/lilypond test.ly
```

或者也可以直接打开 `LilyPond.app` 按它提供的指示操作。

### macOS 10.15

如果你安装了我提供的个人编译版，你可以运行

```bash
/opt/lilypond/bin/lilypond test.ly
```

### Windows

将你保存好的 `test.ly` 放置在桌面上，然后拖拽到 LilyPond 的快捷方式上进行编译。

# 基本使用

下面我们来解读一下 `test.ly` 的第三行到底干了一些什么事情。

```latex
\relative c' {
  c4 c g' g a a g2
  f4 f e e d d c2
}
```

### `\relative` 命令

`\relative` 表示大括号内的音符都是相对于某一个 C 音的音高。例如，`\relative c'` 即是相对于中央 C（小字一组 C，c<sub>1</sub>）的音高。

### 音符时值

用 `c4` 指定一个音高为 C 的四分音符。如果没有特意指定，其后的音符均维持这一时值。

而特意指定 `g2` 则将这一音符切换为二分音符。

### 音高

在 `\relative` 中，下一音符在指定音名后总是会寻找与上一个音符不超过四度的音高来自动匹配。如果你需要大于等于五度的跳跃，你可以使用临时的 `'` 或 `,` 来完成向上八度和向下八度的跳跃。例如，在 C 音上方纯五度的 G 音要写为 `g'`。

# 了解更多

## 联系方式

考虑到配置较为复杂，如果你遇到了问题，可以联系我（tansongchen@pku.edu.cn）或者在下面的留言区提问。

你也可以在北京大学音乐创作协会的社群中寻求支持。

## 手册

[入门指南](http://lilypond.org/doc/v2.18/Documentation/learning.pdf) 提供了一些最基础的帮助，强烈建议阅读。

[其他帮助文件](http://lilypond.org/manuals.html) 包括记谱速查手册和音乐术语表，可供参考。

## 集成式开发环境

理论上你可以在记事本里写所有乐谱，但一个好的开发环境能大幅度提高生产力。你有两个选择：

1. 使用[官网推荐的集成式开发环境](http://lilypond.org/easier-editing.html)，有 Frescobaldi 和 Denemo 两个选择；但它们最近的更新时间还在 17 年，我个人不建议使用；
2. 像我一样在 Visual Studio Code 中自己配置。下面简述在 Visual Studio Code 中的配置方法：

首先新建一个工作区，新建 `task.json` 设置编译任务：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "印刷乐谱",
      "type": "shell",
      "command": "/opt/lilypond/bin/lilypond ${fileBasename}",
      "options": {
        "cwd": "${relativeFileDirname}"
      },
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

其中 `command` 和 `options` 根据你自己的需要配置。然后，下载这个插件：

![LilyPond 插件](http://img.candobear.com/2019-10-20-055344.png)

它提供了基本的语法高亮功能。

然后，你就可以一键运行生成任务来输出乐谱了。

##### 使用愉快！
