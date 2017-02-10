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
    rev = require('gulp-rev'), // MD5
    revCollector = require('gulp-rev-collector'),
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
        // .pipe(rev())
        // .pipe(rev.manifest())
        .pipe(gulp.dest('static/dist/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssmini())
        .pipe(rev())
        .pipe(gulp.dest('static/dist/css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
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
        .pipe(rev())
        .pipe(gulp.dest('static/dist/js/'))
        .pipe(sourcemaps.write())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
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
        .pipe(rev())
        .pipe(gulp.dest('static/dist/js/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('static/dist/js/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/libjs'))
})
gulp.task('csslib', function () {
	return gulp.src(['lib/layer_mobile/need/layer.css'])
		.pipe(concat('lib.css'))
        .pipe(rev())
		.pipe(gulp.dest('static/dist/css/'))
        .pipe(cssmini())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('static/dist/css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/libcss'))
})

gulp.task('rev', function() {
    return gulp.src(['rev/**/*.json', 'index.html'])
        .pipe(revCollector({
            replaceReved: true, // 默认false，是否使用dirReplacements的规则替换模板文件中的文件引用地址；false，只是替换文件名
            dirReplacements: {
                // './static/dist/': '/dist/', // 只写一个不能替换
                './static/dist/css/': '/dist/css/',
                // './static/dist/js/': '/dist/js/',
                // './static/dist/css/': '/dist/css/',
                './static/dist/js/': '/dist/js/'
                // '/cdn/': function(manifest_value) {
                //     return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                // }
            }
        }))
        .pipe(gulp.dest('static'))
})

gulp.task('clean', function () {
    del(['static'])
})

gulp.task('imagemin', function () {
    return gulp.src(['images/other/*.png','images/other/*.jpg'])
        // .pipe(imagemin()) // 似乎由于yarn的存在，imagemin依赖报错
        .pipe(gulp.dest('static/dist/images/other/'))
})
gulp.task('server:dev', ['server', 'script', 'jslib', 'csslib','imagemin', 'rev']);
gulp.task('build:dev', ['clean','sass', 'script', 'jslib','csslib','imagemin', 'rev']);
gulp.task('build:prod', ['clean','sass', 'script','jslib', 'csslib','imagemin', 'rev']);