'use strict';
var pkg = require('./package.json');

var arg = process.argv.splice(2)[0],
    env = arg.split(':')[1],
    method = arg.split(':')[0];
    console.log('arg' + arg);
    console.log('env' + env);
console.log('当前环境是' + env)

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    // babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmini = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    spritesmith = require('gulp.spritesmith'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),//更新提醒
    browserSync = require('browser-sync').create(),//自动刷新
    del = require('del'),//清除文件
    gulpIf = require('gulp-if'),
    revAll = require('gulp-rev-all'), // MD5
    stripDebug = require('gulp-strip-debug'),
    gulpWebpack = require('webpack-stream'); //清楚文件

var reload = browserSync.reload;

gulp.task('server',['sass'],function () {//开启服务器并监听
    browserSync.init({
        server: {
            baseDir: './'
        }
        // proxy: 'http://act.mailejifen.com/' // 代理的地址
    });
    gulp.watch('sass/*.scss',['sass']);
    gulp.watch('src/*.js',['script']);
    // gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('sass',function () {
    return  gulp.src('sass/style.scss')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(sass(autoprefixer('safari 5','ie 9', 'opera 12.1', 'ios 6', 'android 4')))
        .pipe(gulp.dest('dist/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssmini())
        .pipe(gulp.dest('dist/css'))
        // .pipe(browserSync.stream())
        .pipe(reload({stream: true}))
});

gulp.task('script', function () { // md5, 压缩
    return gulp.src([
            'src/index.js',
            'src/template.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('default.js'),{newLine: ';'})
        .pipe(gulpIf(method == 'build', uglify())) // build:dev测试环境和产品
        .pipe(gulpIf(method == 'build', stripDebug())) // build:prod产品
        .pipe(gulpIf(method == 'build', rename({suffix: '.min'})))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('jslib', function () {
    return gulp.src(['lib/zepto.js',
            'lib/artTemplate.js',
            'lib/dropload/dropload.js',
            'lib/layer_mobile/layer.js'
        ])
        .pipe(concat('lib.js', {newLine: ';'}))
        .pipe(gulp.dest('dist/js/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js/'))
})
gulp.task('csslib', function () {
	return gulp.src(['lib/layer_mobile/need/layer.css'])
		.pipe(concat('lib.css'))
		.pipe(gulp.dest('dist/css/'))
        .pipe(cssmini())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css/'))
})

gulp.task('imagemin', function () {
    return gulp.src(['images/other/*.png','images/other/*.jpg'])
        // .pipe(imagemin()) // 似乎由于yarn的存在，imagemin依赖报错
        .pipe(gulp.dest('dist/images/other/'))
})
gulp.task('server:dev', ['server', 'script', 'jslib', 'csslib','imagemin']);
gulp.task('build:dev', ['sass', 'script', 'jslib','csslib','imagemin']);
gulp.task('build:prod', ['sass', 'script','jslib', 'csslib','imagemin']);