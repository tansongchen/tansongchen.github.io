---
title: 个人网站迁移小记
date: 2021-11-20
categories: [技术]
cover: https://images.tansongchen.com/lh.webp
description: 兼论如何搭建一个快得吓人的网站
---

# 背景

想搭建一个自己的网站的尝试从大二就开始了。在那之前，我只知道 Markdown 可以看作是 HTML 的子集的一种简写，只会在写文章的时候修改 Markdown 排版器的 CSS 图一乐，除此之外对网页设计一无所知。19 年的暑假，我研究了一番当时的各种静态网页生成器，最后选了当时特别火的 Hexo。Hexo 基于 Node.js，支持多种模板引擎，还有很多开箱即用的主题（例如 NexT），让你不用写一行 HTML/CSS/JavaScript 就能上线一个精致现代的网站；那个暑假我用它写博客写得不亦乐乎，还买了一直用到现在 `tansongchen.com` 域名，连接到托管静态网页的 GitHub Pages。不过，这个主题比较偏向于博客，不是很容易添加新的页面；基于模板引擎的主题定制起来也不是特别方便，容易和用同一主题的其他人撞衫。

20 年秋天的时候申请研究生，在知乎上看到别人用另一个静态网页生成器 Hugo（基于 go）做的个人学术主页，被它的简洁所吸引，自己也做了一套。这个新的网页放在 `academic` 仓库下，伴随我度过了申请季，直到 21 年夏天申请签证的时候怕 check 期间有人看到才关掉（笑）。后来我逐渐意识到我无法也没有必要调和两套静态网页生成器，纠结于框架和主题只是因为我不懂得前端技术，而这看起来并不是一个长期的解决方案；于是我下定决心好好学习前端技术，用不那么预先定义好的工具和框架做一个真正属于我自己的网页。

那么应该怎么做呢？我希望这个网站是一个可以至少在十年尺度上能方便地不断维护、不断扩展加入一些新的内容版块的系统，希望它能不局限于纯静态而是可以响应来自读者的事件——同时又不至于太难以维护，希望它能与我日常的学习工作中信息管理工作流深度集成，还希望它能优雅美观、体现作者的志趣。我发现用 JavaScript 框架（如 React, Vue 等）渲染比用模板引擎渲染提供了更多的可编程性，也能更自然地表达交互逻辑。最终我选择了 Gatsby，一个基于 React 的静态网页生成器，其原理是把 React 组件首次渲染得到的 HTML 以及相应的 JavaScript bundle 放到静态文件服务器中，这样可以兼顾单页 App 的架构和对 SEO 的友好。

# 技术选型

## TypeScript

这个没啥好说的，TS 可以帮你告别满天飞的 undefined（笑）

## CSS

由于 Gatsby 不自带 CSS 框架，所以首先要选一个 CSS 框架。虽然我其实不太懂 CSS，不过我从直觉上看有这么几个要求：

1. 响应式处理得好，移动端优先
2. 纯 CSS，不包含 JS，以免和 React 的逻辑冲突
3. 作者审美要和我比较接近，样式最好是开箱即用

根据这些限制我选了 [Bulma](https://bulma.io)，一个基于 SASS 的 CSS 框架。这个框架比较符合我审美的一点是扁平化、简洁大方。题外话，我不太喜欢 Google 的 Material Design 和 Materialize CSS。

## Markup

以前用 Markdown 排版微信订阅号文章的时候，我经常为了得到一些特殊的组件而不得不 hack，把不常用的标签（比如 `<h4>`, `<h5>`）定义成与它们标签含义无关的新样式，但是这样做并不 semantic。为了跟 React 定义的组件打通，我用了 MDX 作为标记语言，相当于在 Markdown 里写 JSX。比如

```markdown
## subtitle

<Widget>
  content
</Widget>
```

## API

组件的首次渲染在 React 生命周期中其实是调用的 `render()` 方法，如果有在首次渲染后继续交互的逻辑就需要在 `componentDidMount` 或者 `componentDidUpdate` 里调用 API，目前用到了两个 API：

1. 在 `/code/` 页面调用 GitHub API 动态获取一些代码仓库的描述、星数和分支数等等。这个 API 是 GitHub 提供的，直接 fetch 即可；
2. 在文章页面添加评论功能。这个在下一节中详细介绍。

# 搭建

## 组件

首先编写 `<Header>`, `<Footer>` 等基本组件，然后拼装成一个 `<Layout>` 用于所有页面；对于每篇文章，调用 Gatsby 提供的 `<MDXRenderer>` 组件完成 MDX 标记语言的渲染，然后再自己写一个 `<Commenter>` 组件用来处理评论区和添加新评论的表单等逻辑。评论区的逻辑如下，采用了比较流行的 serverless 架构：

- AWS DynamoDB 存储评论数据
- AWS API Gateway 定义一些访问这些数据的 REST API
- AWS Lambda 把 API 请求连接到 DynamoDB 做增删改查
- 组件首次渲染完成后在 `componentDidMount` 里拉取这些数据，然后调用 `setState()` 触发重新渲染
- 用户添加评论之后首先 POST 到 AWS Lambda，成功之后直接在组件内部用 `setState()` 更新评论区，这样就不需要重新构建网页。

虽然目前只有这一个是真正动态的功能，但是它比较完整地展示了在纯静态网页里做动态功能的流程，后面也可以用来加其他功能。

## 页面

目前除了由 MDX 自动生成的页面之外有首页、关于、文章、相册和代码这五个页面，这些没什么好说的，一行一行写就行了。

## 图床

为了方便以后文章的写作，我在 GitHub 上开了另一个[仓库](https://github.com/tansongchen/images)用来存放图片。在写作时，可以先用本地的图床工具（uPic）上传到图床，然后把链接插入到 MDX 文件中。

# 优化

Gatsby 本身就提供了很多针对静态网页的优化，例如 `<Link>` 标签可以把站内页面预加载，这样点击站内链接几乎都是秒开；但是还有一些手工优化的空间。在优化之前，我首先学习了一下 Google Lighthouse 里各项指标的含义：

1. First Contentful Paint（FCP）：首个文本、图片或者其他有内容含义的元素渲染完成的时间，在此之前浏览器要首先拿到完整的 HTML 和阻塞渲染的 CSS/JS；
2. Largest Contentful Paint（LCP）：首屏中最大元素渲染完成的时间
3. Speed Index：首屏内容全部出现的时间
4. Time to Interactive（TTI）：用户可以开始交互（如向下拉页面）的时间
5. Total Blocking Time（TBT）：在 FCP 之后和 TTI 之前，如果有任何进程花费的时间大于 50 ms，则用户会感觉到被阻塞，TBT 是各任务所有大于 50 ms 部分的时间之和；
6. Cumulative Layout Shift（CLS）：元素在渲染过程中的位置移动，这主要是由于不阻塞渲染的 CSS 的不完全加载造成的。

由于 Gatsby 编译时已经完成了 React 的首次渲染，而且默认会把 CSS 内联到 HTML 中，所以主要是优化 FCP 和 LCP（尤其是 HTML 本身和内联到 HTML 的 CSS 的大小）。

## 图片相关优化

1. Gatsby 的 `<StaticImage>` 组件会针对每一个大图片生成一些低分辨率的替代品，在打开页面时首先加载这些并渲染，然后等大图下载好之后再替换；
2. 把图片转换成 Google 开发的 `webp` 格式，可以压缩很多倍而不使图片质量变差很多；
3. 把 GitHub 仓库的图床链接通过 jsDelivr 这样的 CDN 服务加速（例如，[https://images.tansongchen.com/lh.webp](https://images.tansongchen.com/lh.webp)）；

## 公式相关优化

处理文章中的数学公式，比较标准的做法应该是把 KaTeX 作为一个 Node.js package 安装，然后在渲染时调用它里面的方法把 LaTeX 字符串转化为 HTML 标签；但是在实践中，由于 KaTeX 生成的 HTML 非常冗杂，一个 HTML 文件可能接近 1M，非常影响文章页面的 FCP。为了解决这个问题，我只用 `remark-katex` 把公式区域选出来变成一个 `<span>` 或 `<div>` 并加上 `math-inline` 或 `math-display` 的标签，然后在 `componentDidMount()` 中再调用 KaTeX 渲染，这样那些冗杂的 HTML 标签不会出现在文件服务器上的 HTML 中。

## CSS 和 JS 优化

Bulma 本身有接近 200K，我用了 PurgeCSS 把没有用到的选择器都在最后的 HTML 文件中删除，降到了 30K 左右；另外 KaTeX 的 CSS 也有接近 100K，我的做法是在组件渲染（`render()`）的时候再把它的链接插入到 `<head>` 元素中，这样不影响 FCP。

另外我还尝试过用 jsDelivr 加速 CSS 和 JS 的访问，但是居然变慢了，可能是现有的 CSS 和 JS 太小以至于解析 CDN 域名的开销抵消了加载速度的提高。

---

做完这些优化之后，Google Lighthouse 四项打分都达到了满分。

![](https://images.tansongchen.com/lh.webp)

# 后续工作

我注意到现在 Gatsby 把所有用到的 Bulma 选择器都内联在了每个页面中，但其实每个页面应该只用到了自己的一部分 CSS。这个后续可以再优化。
