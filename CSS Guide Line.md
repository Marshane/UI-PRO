# CSS Guide Line


## 目录

  1. [CSS构成](#0)
    1. [base.css]() | [基础样式书写规范](#0-0)
    1. [layout.css]() | [布局..](#0-1)
    1. [module.css]() | [模块..](#0-2)
    1. [compontent.css (生成)]() | [组件..](#0-3)
    1. [state.css]() | [状态..](#0-4)
    1. [theme.css (生成)]() | [主题..](#0-5)
  1. [CSS指导](#1)
    1. [命名规则](#1-0)
    1. [代码格式](#1-1)
    1. [优化方案](#1-2)
    1. [最佳实践](#1-3)
    1. [典型错误](#1-4)

<a name="0"></a>
## CSS构成
> 定义模块和组件的区分在于，模块一般是由内容和组件构成的。模块一般与内容有关，组件一般是独立存在的。

>如果用人体来做比喻的话：layout 更多地指骨架，而 module 更多指一个功能单位，例如手臂或者是腿部，component 就是构成 module 的独立单位，可以运用在不同的 module 之间，例如细胞皮肤等等。

<a name="0-0"></a>
### 1. base
> 包含reset和基础重置样式

The goal of a reset stylesheet is to reduce browser inconsistencies in things like default line heights, margins and font sizes of headings, and so on。

##### css reset
```CSS
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td{ margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline;}
body {line-height: 1;}
ol, ul {list-style: none;}
table {border-collapse: collapse; border-spacing: 0;}
```
##### 基础重置样式，便我们快速定位或者重用的
```CSS
.pull-left{float:left;}
.pull-right{float:right;}
.pr {position: relative;}
.pa {position: absolute;}
.zomm {zoom: 1;}
.hidden {overflow: hidden;}
.none {display: none;}
.clearfix:before,.clearfix:after {content: "."; display: "block"; height: "0"; visibility: hidden;}
.clearfix:after {clear: both}
.clearfix {zoom: 1}
```

<a name="0-1"></a>
### 2. layout
> 布局样式着重于增加模块和组件的重用性

根据以上这个要求，我们可以使用以下的代码去实现，并且可以完美实现这一布局：
```HTML
<div class="cpu-rate">
    //头部
    <div class="hd"><h4>CPU占用率</h4></div>
    //内容主体
    <div class="bd">
        <div ui-circle value="100"></div>
    </div>
    //底部
    <div class="ft"></div>
</div>
```
```CSS
.cpu-rate{}
.cpu-rate .hd{}
.cpu-rate .hd h4{}
.cpu-rate .bd{}
.cpu-rate .ft{}
```
但是我们这样子就把这一模块写固定了，这种常用的布局可以运用在很多地方，只要包含<上中下>结构的布局都可以使用，或可以得到一些变化延伸，如带操作栏的表格，所以我们可以用下面的方式更好地解决重用性的问题：
```HTML
<div class="m-panel m-panel-cpu-rate">
    //头部
    <div class="hd">
        <h4>CPU占用率</h4>
        <a class="more" href="#">更多</a>
    </div>
    //内容主体
    <div class="bd">
        <div ui-circle value="100"></div>
    </div>
    //底部
    <div class="ft"></div>
</div>
```
用m-panel抽象出panel所有的基础特性，在用m-panel-cpu-rate去定义独有的样式。
```CSS
//抽象出m-panel公共样式
.m-panel{}
.m-panel .hd{}
.m-panel .hd h4{}
.m-panel .bd{}
.m-panel .ft{}
//去定制个性化的需求
.m-panel-cpu-rate .hd .more{}
```
在UI高度统一的情况下，只要看上去是类似的结构，我们就可以很方便的把我们的这个模块分别放置到不同的运用场景，就可以方便地嵌套了。


<a name="0-2"></a>
### 3. module
> 提高在不同页面中的重用率,需要根据项目具体分解

##### 关于模块样式，有如下几点需求：

  1. 避免使用 id 选择器，尽量使用 类 选择器

  1. 内部避免元素选择器(如果组件内部的元素可预测的话即可)

  1. 多用子类去定义组件，使其更加扩展化


  
<a name="0-3"></a>
### 4. compontent
> 定义组件的相关样式 (.c- )


<a name="0-4"></a>
### 5. state
> 状态样式一般作用于模块和组件

  1. 状态样式可以作用于模块和组件；
  1. 状态样式一般会结合 Javascript 进行使用。
  1. 命名时注意添加对应的组件名称 
  
例如下面的代码：
```HTML
<div ng-controller="CollapseDemoCtrl">
	<button class="btn btn-default" ng-click="isCollapsed = !isCollapsed">Toggle collapse</button>
	<hr>
	<div collapse="isCollapsed">
		<div class="well well-lg">Some content</div> 
	</div>
</div>
```

<a name="0-5"></a>
### 6. theme
> 只是换脸，所以在开始的时候定义好主题样式对于以后的扩展来说是十分方便的

来看主题样式的一个基本例子：

```CSS
/* in ui-layout.css */
.m-panel .hd{ border: 1px solid;}
/* in ui-layout-theme-default.css */
.m-panel .hd {border-color: blue;}
```


<a name="1"></a>
## CSS指导


<a name="1-0"></a>
### 1. 命名规则

##### 1.1 使用类选择器，放弃ID选择器

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID在一个页面中的唯一性导致了如果以ID为选择器来写CSS，就无法重用。

##### 1.2 "-"连字符
<b>她只表示两种含义：</b>分类前缀分隔符、扩展分隔符，详见以下具体规则。

<b>分类的命名方法：</b>使用单个字母+"-"为前缀 布局（layout）（.l-）； 模块（module）（.m-）；元件（component）（.c-）；功能（function）（.f-）；状态（state）（.s-）。

> 在样式中的选择器总是要以上面前五类开头，然后在里面使用后代选择器。


如果这五类不能满足的需求，视情况另外定义一个或多个大类，但必须符合单个字母+"-"为前缀的命名规则，即 .x- 的格式。

##### 1.2 后代选择器命名

 -  +"-"为前缀且长度大于等于2的类选择器为后代选择器，如：.hd为m-panel模块里的头部。
 - 一个语义化的标签也可以是后代选择器，比如：.m-list .bd li{}。
 - 不允许单个字母的类选择器出现，原因详见下面的“模块和元件的后代选择器的扩展类”。 通过使用后代选择器的方法，你不需要考虑他的命名是否已被使用，因为他只在当前模块或元件中生效，同样的样式名可以在不同的模块或元件中重复使用，互不干扰；在多人协作或者分模块协作的时候效果尤为明显！
后代选择器不需要完整表现结构树层级，尽量能短则短。

注：后代选择器不要在页面布局中使用，因为污染的可能性较大；


##### 1.3 命名应简约而不失语义
```CSS
//hd 为head简写
.m-panel .hd{}
```
##### 1.4 相同语义的不同类命名 和 模块和元件的扩展类的命名方法

方法：直接类别区分即可（如：.m-panel-grid等，都是面板模块，但是是完全不一样的模块）。

##### 1.5 防止污染和被污染

当模块或元件之间互相嵌套，且使用了相同的标签选择器或其他后代选择器，那么里面的选择器就会被外面相同的选择器所影响。

所以，如果你的模块或元件可能嵌套或被嵌套于其他模块或元件，那么要慎用标签选择器，必要时采用类选择器，并注意命名方式

<a name="1-1"></a>
### 2. 代码格式

##### 2.1 选择器、属性和值都使用小写

在xhtml标准中规定了所有标签、属性和值都小写，CSS也是如此。

##### 2.2 单行写完一个选择器定义

便于选择器的寻找和阅读，也便于插入新选择器和编辑，便于模块等的识别。去除多余空格，使代码紧凑减少换行。

如果有嵌套定义，可以采取内部单行的形式。
```CSS
/* 单行定义一个选择器 */
.m-list li,.m-list h3{width:100px;padding:10px;border:1px solid #ddd;}
/* 这是一个有嵌套定义的选择器 */
@media all and (max-width:600px){
    .m-class1 .itm{height:17px;line-height:17px;font-size:12px;}
    .m-class2 .itm{width:100px;overflow:hidden;}
}
@-webkit-keyframes showitm{
    0%{height:0;opacity:0;}
    100%{height:100px;opacity:1;}
}
```

##### 2.3 最后一个值也以分号结尾

通常在大括号结束前的值可以省略分号，但是这样做会对修改、添加和维护工作带来不必要的失误和麻烦。

##### 2.4 省略值为0时的单位

为节省不必要的字节同时也使阅读方便，我们将0px、0em、0%等值缩写为0。
```CSS
.m-box{margin:0 10px;background-position:50% 0;}
```

##### 2.5 使用单引号

省略url引用中的引号，其他需要引号的地方使用单引号。
```CSS
.m-box{background:url(bg.png);}
.m-box:after{content:'.';}
```

##### 2.6 使用16进制表示颜色值
除非你需要透明度而使用rgba，否则都使用#f0f0f0这样的表示方法，并尽量缩写。
```CSS
.m-box{color:#f00;background:rgba(0,0,0,0.5);}
```
##### 2.7 根据属性的重要性按顺序书写

只遵循横向顺序即可，先显示定位布局类属性，后盒模型等自身属性，最后是文本类及修饰类属性。
<table> 
    <thead> 
        <tr><th align="left"><sub>→</sub></th><th align="left"><sub>显示属性</sub></th><th align="left"><sub>自身属性</sub></th>
        <th align="left"><sub>文本属性和其他修饰</sub></th></tr> 
    </thead> 
    <tbody>
        <tr><td></td><td><sub>display</sub></td><td><sub>width</sub></td><td><sub>font</sub></td></tr> 
        <tr><td></td><td><sub>visibility</sub></td><td><sub>	height</sub></td><td><sub>	text-align</sub></td></tr> 
<tr><td></td><td><sub>position</sub></td><td><sub>	margin</sub></td><td><sub>	text-decoration</sub></td></tr> 
<tr><td></td><td><sub>float</sub></td><td><sub>	padding</sub></td><td><sub>	vertical-align</sub></td></tr> 
<tr><td></td><td><sub>clear</sub></td><td><sub>	border</sub></td><td><sub>	white-space</sub></td></tr> 
<tr><td></td><td><sub>list-style</sub></td><td><sub>	overflow</sub></td><td><sub>	color</sub></td></tr> 
<tr><td></td><td><sub>top</sub></td><td><sub>	min-width</sub></td><td><sub>	background</sub></td></tr> 
    </tbody>
</table>
```CSS
.m-box{position:relative;width:600px;margin:0 auto 10px;text-align:center;color:#000;}
```

##### 2.8 注释格式：/ 注释文字 /

 - 对选择器的注释统一写在被注释对象的上一行，对属性及值的注释写于分号后。
 - 注释内容两端需空格，已确保即使在编码错误的情况下也可以正确解析样式。
 - 在必要的情况下，可以使用块状注释，块状注释保持统一的缩进对齐。
 - 原则上每个系列的样式都需要有一个注释，言简意赅的表明名称、用途、注意事项等。

```CSS
/* 
 * 块状注释文字
 * 块状注释文字
 */
.m-list{width:500px;}
.m-list li{height:20px;line-height:20px;/* 这里是对line-height的一个注释 */overflow:hidden;}
.m-list li a{color:#333;}
/* 单行注释文字 */
.m-list li em{color:#666;}
```		

##### 2.9 原则上不允许使用Hack

很多不兼容问题可以通过改变方法和思路来解决，并非一定需要Hack，根据经验你完全可以绕过某些兼容问题。

一种合理的结构和合理的样式，是极少会碰到兼容问题的。

由于浏览器自身缺陷，我们无法避开的时候，可以允许使用适当的Hack。

##### 2.10 统一Hack方法

统一使用“*”和“_”分别对IE7和6进行Hack。如下代码所示：
```CSS
/* IE7会显示灰色#888，IE6会显示白色#fff，其他浏览器显示黑色#000 */
.m-list{color:#000;*color:#888;_color:#fff;}
```

##### 2.11 建议并适当缩写值

“建议并适当”是因为缩写总是会包含一系列的值，而有时候我们并不希望设置某一值，反而造成了麻烦，那么这时候你可以不缩写，而是分开写。

当然，在一切可以缩写的情况下，请务必缩写，它最大的好处就是节省了字节，便于维护，并使阅读更加一目了然。

##### 2.12 选择器顺序

请综合考虑以下顺序依据：

从大到小（以选择器的范围为准）
从低到高（以等级上的高低为准）
从先到后（以结构上的先后为准）
从父到子（以结构上的嵌套为准）
以下仅为简单示范：
```CSS
/* 从大到小 */
.m-list p{margin:0;padding:0;}
.m-list p.part{margin:1px;padding:1px;}
/* 从低到高 */
.m-logo a{color:#f00;}
.m-logo a:hover{color:#fff;}
/* 从先到后 */
.g-hd{height:60px;}
.g-bd{height:60px;}
.g-ft{height:60px;}
/* 从父到子 */
.m-list{width:300px;}
.m-list .itm{float:left;}
```


<a name="1-2"></a>
### 3. 优化方案

##### 3.1 值缩写

缩写值可以减少CSS文件大小，并增加可读性和可维护性。

但并非所有的值都必须缩写，因为当一个属性的值缩写时，总是会将所有项都设置一遍，而有时候我们不希望设置值里的某些项。

```CSS
/* 比如我们用下面这个样式来让某个定宽的容器水平居中，我们要的只是left和right，
 * 而top和bottom不是这个样式要关心的（如果设置了反倒会影响其他样式在这个容器上的使用），
 * 所以这时我们就不需要缩写
 */
.f-mgha{margin-left:auto;margin-right:auto;}
/* 比如下面这个模块的样式设置，我们确实需要设置padding的所有项，于是我们就可以采用缩写 */
.m-link{padding:6px 12px;}
```

##### 3.2 避免耗性能的属性

以下所举列的属性可能造成渲染性能问题。不过有时候需求大于一切……
```CSS
/* expression */
.class{width:expression(this.width>100?'100px':'auto');}
/* filter */
.class{filter:alpha(opacity=50);}
```
##### 3.3 选择器合并
即CSS选择器组合，可以一次定义多个选择器，为你节省很多字节和宝贵时间。

通常我们会将定义相同的或者有大部分属性值相同（确实是因为相关而相同）的一系列选择器组合到一起（采用逗号的方法）来统一定义。
```CSS
/* 以下对布局类选择器统一做了清除浮动的操作 */
.l-hd:after,.l-bd:after,.l-ft:after{display:block;visibility:hidden;clear:both;height:0;content:".";}
.l-hd,.l-bd,.l-ft{zoom:1;}
/* 通常background总是会占用很多字节，所以一般情况下，我们都会这样统一调用 */
.m-logo,.m-help,.m-list li,.u-tab li,.u-tab li a{background:url(../images/sprite.png) no-repeat 9999px 9999px;}
.m-logo{background-position:0 0;}
/* 以下是某个元件的写法，因为确实很多元素是联动的或相关的，所以采用了组合写法，可以方便理解和修改 */
.c-tab li,.c-tab li a{display:inline;float:left;height:30px;line-height:30px;}
.c-tab li{margin:0 3px;}
.c-tab li a{padding:0 6px;}
```

##### 3.4 背景图优化合并
<b>图片本身的优化：</b>

 - 图像质量要求和图像文件大小决定你用什么格式的图片，用较小的图片文件呈现较好的图像质量。  
 - 当图片色彩过于丰富且无透明要求时，建议采用jpg格式并保存为较高质量。
 - 当图片色彩过于丰富又有透明或半透明要求或阴影效果时，建议采用png24格式，并对IE6进行png8退化（或在不得已情况下使用滤镜）。
 - 当图片色彩不太丰富时无论有无透明要求，请采用png8格式，大多数情况下建议采用这种格式。
 - 当图片有动画时，只能使用gif格式。
 - 你可以使用工具对图片进行再次压缩，但前提是不会影响色彩和透明。

<b>多张图片的合并：</b>

 - 单个图标之间必须保留空隙，空隙大小由容器大小及显示方式决定。这样做的好处是既考虑了“容错性”又提高了图片的可维护性。
 - 图标的排列方式，也由容器大小及显示方式决定。排列方式分为以下几种：横向排列（容器宽度有限）、纵向排列（容器高度有限）、斜线排列（容器宽高不限），靠左排列（容器背景居左）、靠右排列（容器背景居右）、水平居中排列（容器背景水平居中）、垂直居中排列（容器背景垂直居中）。
 - 合并后图片大小不宜超过50K，建议大小在20K-50K之间。
 - 为保证多次修改后的图片质量，请保留一份PSD原始图，修改和添加都在PSD中进行，最后导出png。

<b>分类合并：</b>

并不是把所有的图标都合并在一张图片里就是最好的，除了要控制图片大小之外还要注意以下方法。

 - 按照图片排列方式，把排列方式一样的图片进行合并，便于样式控制。
 - 按照模块或元件，把同属于一个模块或元件的图片进行合并，方便模块或元件的维护。
 - 按照图片大小，把大小一致或差不多的图片进行合并，可充分利用图片空间。
 - 按照图片色彩，把色彩一致或差不多的图片进行合并，保证合并后图片的色彩不过于丰富，可防止色彩失真。
 - 综合以上方法进行合并。

<b>Hack的避免</b>

 - 当避免的代价较大时，可以使用Hack而不避免，比如你需要增加很多HTML或多写很多CSS时会得不偿失。
 - 丰富的实战经验可以帮助你了解那些常见问题并用多种不同的思路来避免它，所以经验和思维方法在这里显得很重要。
 - 根据你自己的能力来解决Hack的问题，我们不建议你用一个自己都没有把握的方法来避免Hack，因为也许你这个方法本身存在你没有发现的问题。
如果CSS可以做到，就不要使用JS

<b>让CSS做更多的事，减轻JS开发量。</b>

 - 用CSS控制交互或视觉的变化，JS只需要更改className。
 - 利用CSS一次性更改多个节点样式，避免多次渲染，提高渲染效率。
 - 如果你的产品允许不兼容低版本浏览器，那么动画实现可以交给CSS。

##### 3.4 便于阅读修改

如果你做到了“CSS规范”的所有要求，自然你也就写出了一个便于阅读和修改的漂亮的CSS。

当然，代码格式和命名规则是相对重要一些的。

##### 3.5 清晰的CSS模块

如果你做到了命名规则的要求，你的CSS模块也就清晰可见了。

用“注释”来说明每一个模块对于较大的CSS文件来说显得尤为重要。

##### 3.6 文件压缩

合理的书写CSS能很大程度上减少文件大小，完成后，在不损坏文件内容的情况下，想尽一切办法压缩你的CSS，你可以借助压缩工具把注释和多余的空格、换行去掉。


<a name="1-3"></a>
### 4. 最佳实践

##### 4.1 最佳选择器写法（模块）

```CSS
/* 这是某个模块 */
.m-nav{}/* 模块容器 */
.m-nav li,.m-nav a{}/* 先共性  优化组合 */
.m-nav li{}/* 后个性  语义化标签选择器 */
.m-nav a{}/* 后个性中的共性 按结构顺序 */
.m-nav a.a1{}/* 后个性中的个性 */
.m-nav a.a2{}/* 后个性中的个性 */
.m-nav .z-crt a{}/* 交互状态变化 */
.m-nav .z-crt a.a1{}
.m-nav .z-crt a.a2{}
.m-nav .btn{}/* 典型后代选择器 */
.m-nav .btn-1{}/* 典型后代选择器扩展 */
.m-nav .btn-dis{}/* 典型后代选择器扩展（状态） */
.m-nav .btn.z-dis{}/* 作用同上，请二选一（如果可以不兼容IE6时使用） */
.m-nav .m-sch{}/* 控制内部其他模块位置 */
.m-nav .u-sel{}/* 控制内部其他元件位置 */
.m-nav-1{}/* 模块扩展 */
.m-nav-1 li{}
.m-nav-dis{}/* 模块扩展（状态） */
.m-nav.z-dis{}/* 作用同上，请二选一（如果可以不兼容IE6时使用） */
```

##### 4.2 统一语义理解和命名
<b>布局（ .l- ）</b>

| 语义  | 命名 | 简写 |
| ------------- | ------------- | ------------- |
| 文档 | 	doc	 | doc | 
| 头部 | 	head | 	hd | 
| 主体 | 	body | 	bd | 
| 尾部 | 	foot | 	ft | 
| 主栏 | 	main | 	mn | 
| 主栏子容器 | 	mainc | 	mnc | 
| 侧栏  | 	side | 	sd |
| 侧栏子容器 | 	sidec | 	sdc | 
| 盒容器 | 	wrap/box | 	wrap/box | 

<b>模块（.m-）、元件（.c-）</b>

| 语义 | 	命名 | 	简写 | 
| ------------- | ------------- | ------------- |
| 导航 | 	nav | 	nav | 
| 子导航 | 	subnav	 | snav | 
| 面包屑 | 	crumb | 	crm | 
| 菜单 | 	menu | 	menu | 
| 选项卡 | 	tab | 	tab  | 
| 标题区 | 	head/title	 | hd/tt | 
| 内容区 | 	body/content | 	bd/ct | 
| 列表 | 	list | 	lst | 
| 表格 | 	table | 	tb | 
| 表单 | 	form | 	fm | 
| 热点 | 	hot | 	hot | 
| 排行 | 	top	 | top | 
| 登录 | 	login | 	log | 
| 标志 | 	logo | 	logo | 
| 搜索 | 	search | 	sch | 
| 幻灯 | 	slide | 	sld | 
| 提示 | 	tips | 	tips | 
| 帮助 | 	help | 	help | 
| 注册 | 	regist | 	reg | 
| 结果 | 	result | 	rst | 
| 标题 | 	title | 	tt | 
| 按钮 | 	button | 	btn | 
| 输入 | 	input | 	ipt | 

<b>功能（.f-）</b>

| 语义| 	命名| 	简写| 
| ------------- | ------------- | ------------- |
| 浮动清除| 	clearboth| 	cb| 
| 向左浮动| 	floatleft| 	fl| 
| 向右浮动| 	floatright| 	fr| 
| 内联块级| 	inlineblock| 	ib| 
| 文本居中| 	textaligncenter| 	tac| 
| 文本居右| 	textalignright| 	tar
| 文本居左| 	textalignleft| 	tal| 
| 垂直居中| 	verticalalignmiddle	| vam| 
| 溢出隐藏| 	overflowhidden| 	oh| 
| 完全消失| 	displaynone| 	dn| 
| 字体大小| 	fontsize| 	fs| 
| 字体粗细	| fontweight| 	fw| 

<b>主题（.t-）</b>

| 语义| 	命名| 	简写| 
| ------------- | ------------- | ------------- |
| 字体颜色| 	fontcolor| 	fc| 
| 背景| 	background| 	bg| 
| 背景颜色| 	backgroundcolor| 	bgc| 
| 背景图片| 	backgroundimage| 	bgi| 
| 背景定位| 	backgroundposition| 	bgp| 
| 边框颜色| 	bordercolor| 	bdc| 

<b>状态（.s-）</b>

| 语义	| 命名 | 	简写| 
| ------------- | ------------- | ------------- |
| 选中| 	selected| 	sel| 
| 当前| 	current| 	crt| 
| 显示| 	show| 	show| 
| 隐藏| 	hide| 	hide| 
| 打开| 	open| 	open| 
| 关闭| 	close| 	close| 
| 出错| 	error| 	err| 
| 不可用| 	disabled| 	dis| 

<a name="1-4"></a>
### 5. 典型错误

##### 5.1 不符合本规范的选择器用法

 - .class{}

不要以一个没有类别的样式作为主选择器，这样的选择器只能作为后代选择器使用，比如.m-xxx .class{}。

 - .m-xxx div{}

不要以没有语义的标签作为选择器，这会造成大面积污染，除非你可以断定现在或将来你的这个选择器不会污染其他同类。

 - .l-xxx .class{}

不要在页面布局中使用后代选择器，因为这个后代选择器可能会污染里面的元素。

 - .l-xxx .m-yyy{}.l-xxx .c-yyy{}
 
不要用布局去控制模块或元件，模块和元件应与布局分离独立。

 - .m-xxx .f-xxx{}.m-xxx .s-xxx{}

不要通过模块或其他类来重定义或修改或添加已经定义好的功能类选择器和皮肤类选择器。

 - .m-xxx .class .class .class .class{}
 
不要将选择器写的过于冗长，这会额外增加文件大小并且限制了太小范围的选择器，使树形结构过于严格应用范围过于局限，建议3-4个长度之内写完。

选择器并不需要完整反映结构嵌套顺序，相反，能简则简。

 - .m-xxx .m-yyy .zzz{}
 
不要越级控制，如果.zzz是.m-yyy的后代选择器，那么不允许.m-yyy之外的选择器控制或修改.zzz。

此时可以使用.m-yyy的扩展来修改.zzz，比如.m-yyy-1 .zzz{}。

