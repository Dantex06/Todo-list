const gulp = require('gulp');
const htmlInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload')
const clean = require('gulp-clean');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fs = require('fs');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

const htmlIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
}
const serverOptions = {
    livereload: true,
    open: true
}

const plumberSettings = (title) => {
    return {
        errorHandler: notify.onError({
            title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

gulp.task('clean', function(done) {
    if(fs.existsSync('./docs/')){
        return gulp.src('./docs/', {read: false}).pipe(clean());
    }
    done();
})

gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
        .pipe(plumber(plumberSettings('HTML')))
        .pipe(htmlInclude(htmlIncludeSettings))
        .pipe(gulp.dest('./docs/'));
})

gulp.task('scss', function() {
    return gulp.src([
        './src/**/*.scss'
    ], { base: './src' })
        .pipe(plumber(plumberSettings('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(replace(/url\(['"]?(\.\.\/)+assets\/([^'"]+)['"]?\)/g, 'url("$2")'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('./docs/assets/'));
});

gulp.task('js', function(){
    return gulp.src('./src/**/*.js')
        .pipe(plumber(plumberSettings('JS')))
        .pipe(babel())
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./docs/js'));
})

gulp.task('fonts', function() {
    return gulp.src('./src/assets/fonts/**/*')
        .pipe(gulp.dest('./docs/assets/fonts/'));
})

gulp.task('server', function() {
    return gulp.src('./docs/').pipe(server(serverOptions))
})

gulp.task('watch', function(){
    gulp.watch('./src/**/*.html', gulp.series('html'));
    gulp.watch('./src/**/*.scss', gulp.series('scss'));
    gulp.watch('./src/**/*.js', gulp.series('js'));
    gulp.watch('./src/assets/fonts/**/*', gulp.series('fonts'));
})

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('html', 'scss', 'js', 'fonts'),
    gulp.parallel('server', 'watch')
));