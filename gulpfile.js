var gulp = require('gulp');
var webpack = require('webpack');
const gutil = require('gulp-util');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cleanCSS = require('gulp-clean-css');
var short = require('postcss-short');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');
var yargs = require('yargs').options({
    w: {
        alias: 'watch',
        type: 'boolean'
    },
    s: {
        alias: 'server',
        type: 'boolean'
    },
    p: {
        alias: 'port',
        type: 'number'
    }
}).argv;

//环境判断
let __DEV__ = gutil.env._[0] == 'dev' ? true : false;

var option = {
    base: 'src'
};
var dist = __dirname + '/dist';

gulp.task('build:style', function () {
    return gulp.src('./src/css/*.scss', option)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(['last 2 versions']),
            short({
                position: { 
                    skip: '_',  //默认*号跳过，改为'_'下划线是因为*号跳过在scss中会进行乘法运算
                    prefix: 's' //只识别前缀为-s-的属性，因为position:-webkit-sticky有冲突
                },
                spacing: {
                    skip: '_'
                }
            }),
        ]))
        .pipe(cleanCSS({
            format: {
                breaks: {  //控制在哪里插入断点
                    afterAtRule: true,
                    afterBlockEnds: true,  //控制在一个块结束后是否有换行符,默认为`false`
                    afterRuleEnds: true,   //控制在规则结束后是否有换行符;默认为`false`
                    afterComment: true     //注释后是否换行，默认false
                }
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

//引用webpack对js进行合并压缩提取，并生成html页面到dist下
gulp.task("build-dll:js", function (callback) {
    webpack(require('./webpack.dll.config.js')).run(function (err, stats) {
        callback();
        browserSync.reload()
    });
});

//引用webpack对js进行合并压缩提取，并生成html页面到dist下
gulp.task("build:js", function (callback) {
    webpack(require('./webpack.config.js')).run(function (err, stats) {
        callback();
        browserSync.reload()
    });
});


//复制src/assets/img目录到dist/img下
gulp.task('copy:images', function () {
    return gulp.src(['src/assets/img/**/*'])
        .pipe(gulp.dest('dist/images'))
});


gulp.task('watch', function () {
    gulp.watch('src/**/*.scss', ['build:style']);
    gulp.watch('src/assets/img/**/*', ['copy:images']);
    gulp.watch(['src/**/*.js', 'src/*.html'], ['build:js']);
});

gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: '/index.html'
    });
});

gulp.task('dll', ['build-dll:js', 'build:js'])

// 参数说明
//  -p: 服务器启动端口，默认8080
gulp.task('dev', ['build:style', 'dll', 'copy:images'], function () {
    gulp.start('server');
    gulp.start('watch');
});

gulp.task('build', ['build:style', 'dll', 'copy:images']);