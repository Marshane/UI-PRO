# HTML Guide Line

#### 目录

  1. [整体结构](#0)
    1. [HTML基础结构](#0-0)
    1. [结构顺序和视觉顺序基本保持一致](#0-1)
    1. [结构、表现、行为三者分离，避免内联](#0-2)
    1. [保持良好的简洁的树形结构](#0-3)
    1. [另外，请做到以下几点](#0-4)
  1. [代码格式](#1)
    1. [说明文案的注释方法](#1-0)
    1. [代码本身的注释方法](#1-1)
    1. [严格的嵌套](#1-2)
    1. [严格的属性](#1-3)
    1. [常用的标签](#1-4)
  1. [内容语义](#2)

<a name="0"></a>
## 整体结构

<a name="0-0"></a>
#### HTML基础结构(#00)

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

<a name="0-1"></a>
#### 结构顺序和视觉顺序基本保持一致

  - 按照从上至下、从左到右的视觉顺序书写HTML结构。
  - 有时候为了便于搜索引擎抓取，我们也会将重要内容在HTML结构顺序上提前。
  - 用div代替table布局，可以使HTML更具灵活性，也方便利用CSS控制。
  - table不建议用于布局，但表现具有明显表格形式的数据，table还是首选。

<a name="0-2"></a>
#### 结构、表现、行为三者分离，避免内联

  - 使用link将css文件引入，并置于head中。
  - 使用script将js文件引入，并置于body底部。

<a name="0-3"></a>
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

<a name="0-4"></a>
#### 另外，请做到以下几点

  - 结构上如果可以并列书写，就不要嵌套。
  - 如果可以写成&lt;div&gt;&lt;/div&gt;&lt;div&gt;&lt;/div&gt;那么就不要写成&lt;div&gt;&lt;div&gt;&lt;/div&gt;&lt;/div&gt;
  - 如果结构已经可以满足视觉和语义的要求，那么就不要有额外的冗余的结构。

  比如&lt;div&gt;&lt;h2&gt;&lt;/h2&gt;&lt;/div&gt;已经能满足要求，那么就不要再写成&lt;div&gt;&lt;div&gt;&lt;h2&gt;&lt;/h2&gt;&lt;/div&gt;&lt;/div&gt;
  - 一个标签上引用的className不要过多，越少越好。

  比如不要出现这种情况：&lt;div class="class1 class2 class3 class4"&gt;&lt;/div&gt;
  - 对于一个语义化的内部标签，应尽量避免使用className。

  比如在这样一个列表中，li标签中的itm应去除：&lt;ul class="m-help"&gt;&lt;li class="itm"&gt;&lt;/li&gt;&lt;li class="itm"&gt;&lt;/li&gt;&lt;/ul&gt;


<a name="1"></a>
## 代码格式

<a name="1-0"></a>
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

<a name="1-1"></a>
#### 代码本身的注释方法
  - 单行代码的注释也保持同行，两端空格；多行代码的注释起始和结尾都另起一行并左缩进对齐。

  ```html
    <!-- <h1 class="m-logo"><a href="#">LOGO</a></h1> -->
    <!--
    <ul class="m-nav">
        <li><a href="#">NAV1</a></li>
        <li><a href="#">NAV2</a></li>
    </ul>
    -->
  ```

<a name="1-2"></a>
#### 严格的嵌套
  - 尽可能以最严格的xhtml strict标准来嵌套，比如内联元素不能包含块级元素等等。
  - 正确闭合标签且必须闭合。

<a name="1-3"></a>
#### 严格的属性
  - 属性和值全部小写，每个属性都必须有一个值，每个值必须加双引号。
  - 没有值的属性必须使用自己的名称做为值（checked、disabled、readonly、selected等等）。
  - 可以省略style标签和script标签的type属性。

<a name="1-4"></a>
#### 常用的标签
  常见标签表
| 标签	| 语义	| 嵌套常见错误	 | 常用属性（加粗的为不可缺少的或建议的）                                   |
| ------------- |:-------------:| -----:| -----:|
| &lt;a&gt;&lt;/a&gt;	| 超链接/锚  | 	a不可嵌套a	 | href,name,title,rel,target                                  |
| &lt;br /&gt;	 | 换行	  |  | 	                                                                         |
| &lt;button&gt;&lt;/button&gt;	 | 按钮	 | 不可嵌套表单元素 | 	type,disabled|
| &lt;dd&gt;&lt;/dd&gt;	 | 定义列表中的定义（描述内容） | 	只能以dl为父容器，对应一个dt	  |  |                      |
| &lt;del&gt;&lt;/del&gt;	 | 文本删除	  |  | 	                                                                  |
| &lt;div&gt;&lt;/div&gt;	 | 块级容器	 	 |  |                                                                       |
| &lt;dl&gt;&lt;/dl&gt;	 | 定义列表	 | 只能嵌套dt和dd	                 |                                          |
| &lt;dt&gt;&lt;/dt&gt;	 | 定义列表中的定义术语 | 	只能以dl为父容器，对应多个dd	 |  |
| &lt;em&gt;&lt;/em&gt;	 | 强调文本	 |  |  	 |
| &lt;form&gt;&lt;/form&gt;	 | 表单	 |  |  	action,target,method,name|
| &lt;h1&gt;&lt;/h1&gt;	 | 标题	 | 从h1到h6，不可嵌套块级元素	 |  |
| &lt;iframe&gt;&lt;/iframe&gt;	 | 内嵌一个网页	 |  |  	frameborder,width,height,src,scrolling,name|
| &lt;img /&gt;	 | 图像	  |  | 	alt,src,width,height|
| &lt;input /&gt;	 | 各种表单控件	  |  | 	type,name,value,checked,disabled,maxlength,readonly,accesskey|
| &lt;label&gt;&lt;/label&gt;	 | 标签为input元素定义标注	  |  | 	for|
| &lt;li&gt;&lt;/li&gt;	 | 列表项	只能以ul或ol为父容器	 |
| &lt;link /&gt;	 | 引用样式或icon	不可嵌套任何元素 | 	type,rel,href | |
| &lt;meta /&gt;	 | 文档信息	 | 只用于head	 | content,http-equiv,name|
| &lt;ol&gt;&lt;/ol&gt;	 | 有序列表	 | 只能嵌套li | 	 |
| &lt;option&gt;&lt;/option&gt;	 | select中的一个选项	 | 仅用于select	value,selected,disabled | |
| &lt;p&gt;&lt;/p&gt;	 | 段落	 | 不能嵌套块级元素	 |  |
| &lt;script&gt;&lt;/script&gt;	 | 引用脚本	 | 不可嵌套任何元素	 | type,src|
| &lt;select&gt;&lt;/select&gt;	 | 列表框或下拉框	 | 只能嵌套option或optgroup	 | name,disabled,multiple|
| &lt;span&gt;&lt;/span&gt;	 | 内联容器	  |  | 	 |
| &lt;strong&gt;&lt;/strong&gt;	 | 强调文本	 |  |  	 |
| &lt;style&gt;&lt;/style&gt;	 | 引用样式	 | 不可嵌套任何元素 | 	type,media|
| &lt;sub&gt;&lt;/sub&gt;	 | 下标	  |  | 	 |
| &lt;sup&gt;&lt;/sup&gt;	 | 上标	  |  | 	 |
| &lt;table&gt;&lt;/table&gt;	 | 表格	 | 只可嵌套表格元素 | 	width,align,background,cellpadding,cellspacing,summary,border | |
| &lt;tbody&gt;&lt;/tbody&gt;	 | 表格主体	 | 只用于table | 	 |
| &lt;td&gt;&lt;/td&gt;	 | 表格中的单元格	 | 只用于tr | 	colspan,rowspan |
| &lt;textarea&gt;&lt;/textarea&gt;	 | 多行文本输入控件 | 	  | 	name,accesskey,disabled,readonly,rows,cols |
| &lt;tfoot&gt;&lt;/tfoot&gt;	 | 表格表尾 | 	只用于table	 |  |
| &lt;th&gt;&lt;/th&gt;	 | 表格中的标题单元格	 | 只用于tr	colspan,rowspan | |
| &lt;thead&gt;&lt;/thead&gt;	 | 表格表头	 | 只用于table | 	 |
| &lt;title&gt;&lt;/title&gt;	 | 文档标题 | 	只用于head | 	 |
| &lt;tr&gt;&lt;/tr&gt;	 | 表格行	 | 嵌套于table或thead、tbody、tfoot | 	 |
| &lt;ul&gt;&lt;/ul&gt;	 | 无序列表	 | 只能嵌套li	 |  |