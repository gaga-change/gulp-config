/** 
 * 功能：
 *   css: 编译less
 *   js: 纯拷贝
 *   img: 纯拷贝
 *   html: 纯拷贝
 * 附加：
 *   热更新
 * 
 * 解析后根目录： 
 *   - dist
 *   |- css
 *   |- js
 *   |- img
 *   |- page
 * 
 * 原文件目录：src
 *   |- less
 *   |- js
 *   |- img
 *   |- page
 * 
 * 核心插件
 *   gulp-less    | less编译插件
 *   gulp-clean   | 清空目录
 *   gulp-plumber | 报错不会中断
 *   gulp-notify  | 提示，搭配 plumber使用
 *   browser-sync | 热更新
 *   
 */

const gulp = require('gulp')
const less = require('gulp-less')
const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const browserSync = require('browser-sync')

var path = require('path')
const dir = {
    dist: {
        css: path.join(__dirname, 'dist', 'css'),
        js: path.join(__dirname, 'dist', 'js'),
        img: path.join(__dirname, 'dist', 'img'),
        page: path.join(__dirname, 'dist', 'page'),
    },
    src: {
        less: path.join(__dirname, 'src', 'less'),
        js: path.join(__dirname, 'src', 'js'),
        img: path.join(__dirname, 'src', 'img'),
        page: path.join(__dirname, 'src', 'page')
    }
}

// 清空dist目录
gulp.task('clean', function () {
    return gulp.src(path.join(__dirname, 'dist'), { read: false }).pipe(clean())
})

// less解析
gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(less({
            paths: [path.join(dir.src.less, 'includes')]
        }))
        .pipe(gulp.dest(dir.dist.css))
        .pipe(browserSync.stream())
})

// 纯拷贝
gulp.task('js', () => gulp.src('src/js/**/*.js').pipe(gulp.dest(dir.dist.js)).pipe(browserSync.stream()))
gulp.task('img', () => gulp.src('src/img/**/*').pipe(gulp.dest(dir.dist.img)).pipe(browserSync.stream()))
gulp.task('page', () => gulp.src('src/page/**/*.html').pipe(gulp.dest(dir.dist.page)))

gulp.task('serve', ['clean'], () => {
    browserSync.init({
        server: "./dist"
    });
    gulp.start(['less', 'js', 'img', 'page'])
    gulp.watch('src/less/**/*.less', ['less'])
    gulp.watch('src/js/**/*.js', ['js'])
    gulp.watch('src/img/**/*', ['img'])
    gulp.watch('src/page/**/*.html', ['page']).on('change', browserSync.reload)
})

gulp.task('default', ['serve'])