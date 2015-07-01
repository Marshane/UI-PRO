// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    // imagemin = require('gulp-imagemin'),       //图片压缩
    // sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    //jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),                         
    rev=require('gulp-rev'),                   //更改版本名
    revCollector=require('gulp-rev-collector'),//gulp-rev的插件，用于html模板更改引用路径
    port = 3001,
    livereload = require('gulp-livereload');   //livereload

// 样式处理
gulp.task('css', function () {
    var cssSrc = 'css/*.css',
        cssDst = 'dist/css';

    gulp.src(cssSrc)
        // .pipe(sass({ style: 'expanded'}))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});

// js处理
gulp.task('js', function () {
    var mainSrc = 'scripts/*.js',
        mainDst = 'dist/js/',
        appSrc = 'lab/*.js',
        appDst = 'dist/js/';

    gulp.src(appSrc)
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(concat("lab.js"))
        .pipe(gulp.dest(appDst))
        .pipe(livereload(server));

    // gulp.src(mainSrc)
    //     .pipe(uglify())
    //     .pipe(rename({ suffix: '.min' }))
    //     .pipe(concat("business.js"))
    //     .pipe(gulp.dest(mainDst))
    //     .pipe(livereload(server));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/css', './dist/js'], {read: false}) //第二个参数 {read:false} 是不读取文件名 加快速度
        .pipe(clean())
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('css','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){
    server.listen(port, function(err){
        if (err) {
            return console.log(err)
        }
        // 监听css
        gulp.watch('css/*.css', function(){
            gulp.run('css');
        });

        // 监听js
        gulp.watch(['lab/*.js','js/*.js'], function(){
            gulp.run('js');
        });
    });
});