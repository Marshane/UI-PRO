# CSS Guide Line

#### 目录

  1. [命名规则](#0)
    1. [](#0-0)
    1. [](#0-1)
    1. [](#0-2)
    1. [](#0-3)
    1. [](#0-4)
  1. [代码格式](#1)
    1. [说明文案的注释方法](#1-0)
  1. [优化方案](#3-0)
  1. [最佳实践](#4-0)
  1. [典型错误](#5-0)

<a name="0"></a>
## 整体结构

<a name="0-0"></a>
#### HTML基础结构

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
  <table> 
    <caption>常见标签表</caption> 
    <thead> 
        <tr><th align="left"><sub>标签</sub></th><th align="left"><sub>语义</sub></th><th align="left"><sub>嵌套常见错误</sub></th>
        <th align="left"><sub>常用属性（加粗的为不可缺少的或建议的）</sub></th></tr> 
    </thead> 
    <tbody>
        <tr><td><sub>&lt;a&gt;&lt;/a&gt;</sub></td><td><sub>超链接/锚</sub></td><td><sub>a不可嵌套a</sub></td><td><sub>href，name，title，rel，target</sub></td></tr> 
        <tr><td><sub>&lt;br /&gt;</sub></td><td><sub>换行</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;button&gt;&lt;/button&gt;</sub></td><td><sub>按钮</sub></td><td><sub>不可嵌套表单元素</sub></td><td><sub>type，disabled</sub></td></tr> 
        <tr><td><sub>&lt;dd&gt;&lt;/dd&gt;</sub></td><td><sub>定义列表中的定义（描述内容）</sub></td><td><sub>只能以dl为父容器，对应一个dt</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;del&gt;&lt;/del&gt;</sub></td><td><sub>文本删除</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;div&gt;&lt;/div&gt;</sub></td><td><sub>块级容器</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;dl&gt;&lt;/dl&gt;</sub></td><td><sub>定义列表</sub></td><td><sub>只能嵌套dt和dd</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;dt&gt;&lt;/dt&gt;</sub></td><td><sub>定义列表中的定义术语</sub></td><td><sub>只能以dl为父容器，对应多个dd</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;em&gt;&lt;/em&gt;</sub></td><td><sub>强调文本</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;form&gt;&lt;/form&gt;</sub></td><td><sub>表单</sub></td><td><sub>&nbsp;</sub></td><td><sub><b>action</b>，target，method，name</sub></td></tr> 
        <tr><td><sub>&lt;h1&gt;&lt;/h1&gt;</sub></td><td><sub>标题</sub></td><td><sub>从h1到h6，不可嵌套块级元素</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;iframe&gt;&lt;/iframe&gt;</sub></td><td><sub>内嵌一个网页</sub></td><td><sub>&nbsp;</sub></td><td><sub>frameborder，width，height，src，scrolling，name</sub></td></tr> 
        <tr><td><sub>&lt;img /&gt;</sub></td><td><sub>图像</sub></td><td><sub>&nbsp;</sub></td><td><sub><b>alt</b>，src，width，height</sub></td></tr> 
        <tr><td><sub>&lt;input /&gt;</sub></td><td><sub>各种表单控件</sub></td><td><sub>&nbsp;</sub></td><td><sub><b>type</b>，name，value，checked，disabled，maxlength，readonly，accesskey</sub></td></tr> 
        <tr><td><sub>&lt;label&gt;&lt;/label&gt;</sub></td><td><sub>标签为input元素定义标注</sub></td><td><sub>&nbsp;</sub></td><td><sub>for</sub></td></tr> 
        <tr><td><sub>&lt;li&gt;&lt;/li&gt;</sub></td><td><sub>列表项</sub></td><td><sub>只能以ul或ol为父容器</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;link /&gt;</sub></td><td><sub>引用样式或icon</sub></td><td><sub>不可嵌套任何元素</sub></td><td><sub><b>type，rel</b>，href</sub></td></tr> 
        <tr><td><sub>&lt;meta /&gt;</sub></td><td><sub>文档信息</sub></td><td><sub>只用于head</sub></td><td><sub>content，http-equiv，name</sub></td></tr> 
        <tr><td><sub>&lt;ol&gt;&lt;/ol&gt;</sub></td><td><sub>有序列表</sub></td><td><sub>只能嵌套li</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;option&gt;&lt;/option&gt;</sub></td><td><sub>select中的一个选项</sub></td><td><sub>仅用于select</sub></td><td><sub><b>value</b>，selected，disabled</sub></td></tr> 
        <tr><td><sub>&lt;p&gt;&lt;/p&gt;</sub></td><td><sub>段落</sub></td><td><sub>不能嵌套块级元素</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;script&gt;&lt;/script&gt;</sub></td><td><sub>引用脚本</sub></td><td><sub>不可嵌套任何元素</sub></td><td><sub><b>type</b>，src</sub></td></tr> 
        <tr><td><sub>&lt;select&gt;&lt;/select&gt;</sub></td><td><sub>列表框或下拉框</sub></td><td><sub>只能嵌套option或optgroup</sub></td><td><sub>name，disabled，multiple</sub></td></tr> 
        <tr><td><sub>&lt;span&gt;&lt;/span&gt;</sub></td><td><sub>内联容器</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;strong&gt;&lt;/strong&gt;</sub></td><td><sub>强调文本</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;style&gt;&lt;/style&gt;</sub></td><td><sub>引用样式</sub></td><td><sub>不可嵌套任何元素</sub></td><td><sub><b>type</b>，media</sub></td></tr> 
        <tr><td><sub>&lt;sub&gt;&lt;/sub&gt;</sub></td><td><sub>下标</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;sup&gt;&lt;/sup&gt;</sub></td><td><sub>上标</sub></td><td><sub>&nbsp;</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;table&gt;&lt;/table&gt;</sub></td><td><sub>表格</sub></td><td><sub>只可嵌套表格元素</sub></td><td><sub>width，align，background，cellpadding，cellspacing，summary，border</sub></td></tr> 
        <tr><td><sub>&lt;tbody&gt;&lt;/tbody&gt;</sub></td><td><sub>表格主体</sub></td><td><sub>只用于table</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;td&gt;&lt;/td&gt;</sub></td><td><sub>表格中的单元格</sub></td><td><sub>只用于tr</sub></td><td><sub>colspan，rowspan</sub></td></tr> 
        <tr><td><sub>&lt;textarea&gt;&lt;/textarea&gt;</sub></td><td><sub>多行文本输入控件</sub></td><td><sub>&nbsp;</sub></td><td><sub>name，accesskey，disabled，readonly，rows，cols</sub></td></tr> 
        <tr><td><sub>&lt;tfoot&gt;&lt;/tfoot&gt;</sub></td><td><sub>表格表尾</sub></td><td><sub>只用于table</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;th&gt;&lt;/th&gt;</sub></td><td><sub>表格中的标题单元格</sub></td><td><sub>只用于tr</sub></td><td><sub>colspan，rowspan</sub></td></tr> 
        <tr><td><sub>&lt;thead&gt;&lt;/thead&gt;</sub></td><td><sub>表格表头</sub></td><td><sub>只用于table</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;title&gt;&lt;/title&gt;</sub></td><td><sub>文档标题</sub></td><td><sub>只用于head</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;tr&gt;&lt;/tr&gt;</sub></td><td><sub>表格行</sub></td><td><sub>嵌套于table或thead、tbody、tfoot</sub></td><td><sub>&nbsp;</sub></td></tr> 
        <tr><td><sub>&lt;ul&gt;&lt;/ul&gt;</sub></td><td><sub>无序列表</sub></td><td><sub>只能嵌套li</sub></td><td><sub>&nbsp;</sub></td></tr> 
    </tbody> 
</table>


<a name="2-0"></a>
## 内容语义


#### 内容类型决定使用的语义标签
  - 在网页中某种类型的内容必定需要某种特定的HTML标签来承载，也就是我们常常提到的根据你的内容语义化HTML结构。

#### 加强“资源型”内容的可访问性和可用性
  - 在资源型的内容上加入描述文案，比如给img添加alt属性，在audio内加入文案和链接等等。

#### 加强“不可见”内容的可访问性
  - 背景图上的文字应该同时写在html中，并使用css使其不可见，有利于搜索引擎抓取你的内容，也可以在css失效的情况下看到内容。

#### 适当使用实体
  - 以实体代替与HTML语法相同的字符，避免浏览解析错误。

  <table>
      <caption>常用HTML字符实体（建议使用实体）：</caption>
      <thead>
          <tr><th><sub>字符</sub></th><th><sub>名称</sub></th><th><sub>实体名</sub></th><th><sub>实体数</sub></th></tr>
      </thead>
      <tbody>
          <tr><td><sub>"</sub></td><td><sub>双引号</sub></td><td><sub>&amp;quot;</sub></td><td><sub>&amp;#34;</sub></td></tr>
          <tr><td><sub>&amp;</sub></td><td><sub>&amp;符</sub></td><td><sub>&amp;amp;</sub></td><td><sub>&amp;#38;</sub></td></tr>
          <tr><td><sub>&lt;</sub></td><td><sub>左尖括号（小于号）</sub></td><td><sub>&amp;lt;</sub></td><td><sub>&amp;#60;</sub></td></tr>
          <tr><td><sub>&gt;</sub></td><td><sub>右尖括号（大于号）</sub></td><td><sub>&amp;gt;</sub></td><td><sub>&amp;#62;</sub></td></tr>
          <tr><td><sub>&nbsp;</sub></td><td><sub>空格</sub></td><td><sub>&amp;nbsp;</sub></td><td><sub>&amp;#160;</sub></td></tr>
          <tr><td><sub>　</sub></td><td><sub>中文全角空格</sub></td><td><sub>&nbsp;</sub></td><td><sub>&amp;#12288;</sub></td></tr>
      </tbody>
  </table>
  <table>
      <caption>常用特殊字符实体（不建议使用实体）：</caption>
      <thead>
          <tr><th><sub>字符</sub></th><th><sub>名称</sub></th><th><sub>实体名</sub></th><th><sub>实体数</sub></th></tr>
      </thead>
      <tbody>
          <tr><td><sub>¥</td><td><sub>元</td><td><sub>&amp;yen;</td><td><sub>&amp;#165;</td></tr>
          <tr><td><sub>¦</td><td><sub>断竖线</td><td><sub>&amp;brvbar;</td><td><sub>&amp;#166;</td></tr>
          <tr><td><sub>©</td><td><sub>版权</td><td><sub>&amp;copy;</td><td><sub>&amp;#169;</td></tr>
          <tr><td><sub>®</td><td><sub>注册商标R</td><td><sub>&amp;reg;</td><td><sub>&amp;#174;</td></tr>
          <tr><td><sub>™</td><td><sub>商标TM</td><td><sub>&amp;trade;</td><td><sub>&amp;#8482;</td></tr>
          <tr><td><sub>·</td><td><sub>间隔符</td><td><sub>&amp;middot;</td><td><sub>&amp;#183;</td></tr>
          <tr><td><sub>«</td><td><sub>左双尖括号</td><td><sub>&amp;laquo;</td><td><sub>&amp;#171;</td></tr>
          <tr><td><sub>»</td><td><sub>右双尖括号</td><td><sub>&amp;raquo;</td><td><sub>&amp;#187;</td></tr>
          <tr><td><sub>°</td><td><sub>度</td><td><sub>&amp;deg;</td><td><sub>&amp;#176;</td></tr>
          <tr><td><sub>×</td><td><sub>乘</td><td><sub>&amp;times;</td><td><sub>&amp;#215;</td></tr>
          <tr><td><sub>÷</td><td><sub>除</td><td><sub>&amp;divide;</td><td><sub>&amp;#247;</td></tr>
          <tr><td><sub>‰</td><td><sub>千分比</td><td><sub>&amp;permil;</td><td><sub>&amp;#8240;</td></tr>
      </tbody>
  </table>