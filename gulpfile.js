'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')


gulp.task('babel-test', () => {
    return gulp.src('./test/src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./test/dist'));
})

gulp.task('babel', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
})

gulp.task('default', ['babel', 'babel-test'])

