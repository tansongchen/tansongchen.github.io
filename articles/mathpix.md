---
title: 20 行代码实现薅羊毛
date: 2019-11-01
categories: [技术]
cover: https://images.tansongchen.com/mathpix.webp
description: Life is short, you need Python.
---

###### 1

上学期，*@蝶总*给我推荐了一款堪称神器的应用：*Mathpix Snipping Tool*。它可以将图片中的数学公式识别出来，并转化为 LaTeX 命令。一键截图识别，一键粘贴，在需要从书本或文献摘录公式的场合简直太友好了。

我想：这么好用的应用，还免费，*真是良心之作呀！*

然而，今天上午的电动力学课上，当我优雅地截下一个规范变换的公式时，惊奇地发现：

##### Mathpix 开始收费了！

![Mathpix 近日起采取订阅制，每月 5 美元，否则每月只能使用 50 次](http://img.candobear.com/2019-10-10-031559.png)



###### 2

对于能够创造价值的生产力工具而言，重度使用的用户*每月花 5 美元订阅并不过分*。支持作者团队，也有利于后续的稳定更新与维护。

不过，既然 Mathpix 的识别服务做得如此之好，除了个人用户之外，肯定也有一些其他应用的开发者需要将 Mathpix 作为他们自己的应用的组件。

事实上，像 Mathpix 这样的服务经常能够将自己打包为 API（Application Programming Interface，应用编程接口），使得其他开发者可以通过程序发送简单的网络请求来使用这一服务。

那么 Mathpix 对开发者的收费标准又如何呢？通过查询[开发者的收费标准](https://mathpix.com/ocr#pricing)，我们可以看到：*开发者每月可以免费使用 1000 次！*

![Mathpix 对开发者的收费标准更加友善](http://img.candobear.com/2019-10-10-034205.png)

也就是说，如果我们也通过发送网络请求的方式实现调用，相比于直接使用它的图形用户界面来说每个月可以免费多使用 950 次识别，这已经完全满足个人使用了。

###### 3

### 申请成为开发者

首先，我们需要在[开发者页面](https://dashboard.mathpix.com/login)上注册一个帐号。注册完成后，我们会获得一个 `app_id` 和 `app_key`，如图所示：

![我的`app_key`当然不能给你们看啦！😈️](http://img.candobear.com/2019-10-10-%E6%88%AA%E5%B1%8F2019-10-0920.57.59.png)

###### 4

### 从剪贴板获取图片

在 macOS 上，按 Command + Shift + Control + 4 可以将屏幕的部分区域截图并保存到剪贴板上（你也可以设置更方便的快捷键，比如我设置为 Command + 分号）。通过 Python 的 `PIL` 模块，我们可以方便地将它保存为临时文件：

```python
from PIL import ImageGrab
ImageGrab.grabclipboard().save(tempPath, 'PNG')
```

其中 `tempPath` 是任意一个你认为不会影响到其他文件的目录，比如我选的是 `/Users/tansongchen/Public/Temp/temp.png`。

然后，我们再读取该文件备用：

```python
image = open(tempPath, 'rb').read()
```

###### 5

### 发送网络请求

我们需要将图片编码为能够在网络上传输的字符串（`base64 ` 编码），然后发送一个 POST 请求给 Mathpix 的 API。其中，`latex_simplified` 是我们所需要的转换格式。

```python
import base64, request
args = {
    'src': "data:image/jpg;base64," + base64.b64encode(image).decode(),
    'formats': ['latex_simplified']
    }
result = requests.post(
      'https://api.mathpix.com/v3/latex',
    data=json.dumps(args),
    headers=headers,
    timeout=30
    )
```

其中的 `headers` 就是包含了你的 `app_id` 和 `app_key` 的字典，例如我的是：

```python
headers = {
    'app_id': 'tansongchen_pku_edu_cn',
    'app_key': 'xxxxxxxxxxxxxxxxxxxx',
    'Content-type': 'application/json'
}
```

返回的结果储存在 `results` 变量中。

最后，我们调用 `pyperclip` 库将返回的结果处理后储存在剪贴板中，最后再用 `keyboard` 模拟粘贴动作，达成了一键识别粘贴。

完整的源代码如下：

```python
import base64, requests, json, keyboard, pyperclip
from PIL import ImageGrab
headers = {
    'app_id': 'tansongchen_pku_edu_cn',
    'app_key': 'xxxxxxxxxxxxxxxxxxxx',
    'Content-type': 'application/json'
}
tempPath = '/Users/tansongchen/Public/Temp/temp.png'
try:
    ImageGrab.grabclipboard().save(tempPath, 'PNG')
    image = open(tempPath, 'rb').read()
    args = {
        'src': "data:image/jpg;base64," + base64.b64encode(image).decode(),
        'formats': ['latex_simplified']
        }
    result = requests.post('https://api.mathpix.com/v3/latex', data=json.dumps(args), headers=headers, timeout=30)
    pyperclip.copy('$$\n%s\n$$' % json.loads(result.text)['latex_simplified'])
    keyboard.press_and_release('win+v')
except Exception:
    pass
```

注意：macOS 下的 Command 键应该写为 `win`，Option 键应该写为 `alt`。

嗯，真的只有 20 行……

###### 6

### macOS 的表演时间……

程序写好了。但是，总不能识别一次就手动运行一次程序呀？

这个问题有无数种自动化的解决办法。但是作为 macOS 的用户，*当然要用 macOS 的风格来解决这个问题*。为此我们用「自动操作」这款自带应用，定义一个「快速操作」类别的工作流程：

![新建「快速操作」的界面](http://img.candobear.com/2019-10-10-170010.png)

在流程中我们定义一个用 Python 解释器运行识别程序的 Shell 脚本：

![「快速操作」的编辑界面](http://img.candobear.com/2019-10-10-170130.png)

最后给这个「快速操作」取一个名字，在「系统偏好设置 - 键盘 - 快捷键 - 服务」中给它指定一个快捷键，以后就可以用快捷键来调用这个程序了！

![「系统偏好设置」中添加快捷键](http://img.candobear.com/2019-10-10-170353.png)

###### 7

回到最初的问题，打钱就能解决的事情，为什么要这么折腾？

复读机表示：还是那句话，生产力 = 场景 + 工作流。如果没有现成的工作流可用，知识工作者应该有能力设计自己的工作流。从我 20 行代码就调了 6 个库这一行为可以看出，未来的程序设计一定是更加模块化、简单化的；通过将底层实现细节隐藏，*程序设计将不是一项专业技能，而应该是能够为人人所用的生产力提升之道*。

最后送给大家一句 Bruce Eckel 的名言：

##### Life is short, <br/>you need Python.

---


