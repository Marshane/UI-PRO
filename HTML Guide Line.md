# HTML Guide Line

#### 目录

  1. [整体结构](#整体结构)
  1. [代码格式](#代码格式)
  1. [内容语义](#内容语义)

## 整体结构

#### HTML基础设施

  - 文件应以“&lt;!DOCTYPE ......&gt;”首行顶格开始，推荐使用“&lt;!DOCTYPE html&gt;”。
  - 必须申明文档的编码charset，且与文件本身编码保持一致，推荐使用UTF-8编码&lt;meta charset="utf-8"/&gt;。
  - 根据页面内容和需求填写适当的keywords和description。
  - 页面title是极为重要的不可缺少的一项。

  ```html
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8"/>
    <title> html规范 </title>
    <meta name="keywords" content=""/>
    <meta name="description" content=""/>
    <meta name="viewport" content="width=device-width"/>
    <link rel="stylesheet" href="css/style.css"/>
    <link rel="shortcut icon" href="img/favicon.ico"/>
    <link rel="apple-touch-icon" href="img/touchicon.png"/>
    </head>
    <body>

    </body>
    </html>
  ```

#### 结构顺序和视觉顺序基本保持一致

  - 按照从上至下、从左到右的视觉顺序书写HTML结构。
  - 有时候为了便于搜索引擎抓取，我们也会将重要内容在HTML结构顺序上提前。
  - 用div代替table布局，可以使HTML更具灵活性，也方便利用CSS控制。
  - table不建议用于布局，但表现具有明显表格形式的数据，table还是首选。

#### 结构、表现、行为三者分离，避免内联

  - 使用link将css文件引入，并置于head中。
  - 使用script将js文件引入，并置于body底部。

#### 保持良好的简洁的树形结构

  - 每一个块级元素都另起一行，每一行都使用Tab缩进对齐（head和body的子元素不需要缩进）。删除冗余的行尾的空格。
  - 使用4个空格代替1个Tab（大多数编辑器中可设置）。
  - 对于内容较为简单的表格，建议将tr写成单行。
  - 你也可以在大的模块之间用空行隔开，使模块更清晰。

  ```html
    <div class="ui-panel">
        <div class="hd"><h4>内存占用率(%)</h4></div>
        <div class="bd"></div>
    </div>

    <div class="ui-panel">
        <div class="hd"><h4>文件系统使用率(%)</h4></div>
        <div class="bd"></div>
    </div>
  ```

#### 另外，请做到以下几点

  - 结构上如果可以并列书写，就不要嵌套。
  - 如果可以写成&lt;div&gt;&lt;/div&gt;&lt;div&gt;&lt;/div&gt;那么就不要写成&lt;div&gt;&lt;div&gt;&lt;/div&gt;&lt;/div&gt;
  - 如果结构已经可以满足视觉和语义的要求，那么就不要有额外的冗余的结构。

  比如&lt;div&gt;&lt;h2&gt;&lt;/h2&gt;&lt;/div&gt;已经能满足要求，那么就不要再写成&lt;div&gt;&lt;div&gt;&lt;h2&gt;&lt;/h2&gt;&lt;/div&gt;&lt;/div&gt;
  - 一个标签上引用的className不要过多，越少越好。

  比如不要出现这种情况：&lt;div class="class1 class2 class3 class4"&gt;&lt;/div&gt;
  - 对于一个语义化的内部标签，应尽量避免使用className。

  比如在这样一个列表中，li标签中的itm应去除：&lt;ul class="m-help"&gt;&lt;li class="itm"&gt;&lt;/li&gt;&lt;li class="itm"&gt;&lt;/li&gt;&lt;/ul&gt;



## 代码格式


#### 说明文案的注释方法

  - 采用类似标签闭合的写法，与HTML统一格式；注释文案两头空格，与CSS注释统一格式。
  - 开始注释：&lt;!-- 注释文案 --&gt;（文案两头空格）。
  - 结束注释：&lt;!-- /注释文案 --&gt;（文案前加“/”符号，类似标签的闭合）。
  - 允许只有开始注释！

  ```html
    <!-- 头部 -->
    <div class="g-hd">
        <!-- LOGO -->
        <h1 class="m-logo"><a href="#">LOGO</a></h1>
        <!-- /LOGO -->
        <!-- 导航 -->
        <ul class="m-nav">
            <li><a href="#">NAV1</a></li>
            <li><a href="#">NAV2</a></li>
            <!-- 更多导航项 -->
        </ul>
        <!-- /导航 -->
    </div>
    <!-- /头部 -->
  ```
