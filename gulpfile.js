'use strict';

const gulp = require('gulp');
const path = require('path');
const express = require('express');
const gulpLoadPlugins = require('gulp-load-plugins');
const reload = require('reload');

const $ = gulpLoadPlugins();
const app = express();
const publicDir = path.join(__dirname, 'src');

const reloadServer = reload(app);

gulp.task('serve', ['styles'], () => {
    const port = 3000;

    app.use(express.static('src'));

    app.listen(port, () => console.log('app listening on port ' + port));
    gulp.watch(['src/*.scss'], ['styles', reloadServer.reload]);
    gulp.watch(['src/*.html'], [reloadServer.reload]);
});

gulp.task('build', ['styles'], (done) => {
    done()
});

gulp.task('styles', () => {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];
    return gulp.src([
        'src/cookie-notice.scss',
    ])
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('src'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.size({title: 'cookie-notice'}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('src'))
});