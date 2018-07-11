const gulp = require('gulp')
const connect = require('gulp-connect') // 服务模块
const proxy = require('http-proxy-middleware') // 代理模块
const concat = require('gulp-concat') // 文件合并插件
const changed = require('gulp-changed') // 文件合并插件

// var dirName = 'task'
var dirName = 'report'
// var host = 'https://ql.qiling.work'
var host = 'https://qy.yusong.com.cn'
// 服务
gulp.task('connect', function () {
    connect.server({
        root: dirName,
        host: '0.0.0.0',
        port: 8082,
        // livereload: true,
        middleware: function (connect, opt) {
            return [
                proxy('/api', {
                    target: host,
                    changeOrigin: true
                }),
                // proxy('/test', {
                //     target: 'http://localhost:5566',
                //     changeOrigin: true
                // }),
                proxy('/staticserver', {
                    target: host,
                    changeOrigin: true
                })
            ]
        }

    })
})

gulp.task('comment-js', function () {
    return gulp.src(`${dirName}/js/comment/*.js`)
        .pipe(concat('comment.js'))
        .pipe(gulp.dest(`${dirName}/js`))
})

// gulp.task('html', function () {
//     gulp.src('./report/**/*.html')
//         // .pipe(changed('./report'))
//         .pipe(gulp.dest('./report'))
//         .pipe(connect.reload())
// })
// gulp.task('watch-html', function () {
//     gulp.watch(['./report/**/*.html'], ['html'])
// })

gulp.task('watch-comment-js', function () {
    gulp.watch([`${dirName}/js/comment/*.js'], ['comment-js`])
})

gulp.task('default', ['connect', 'comment-js', 'watch-comment-js'])