'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')

gulp.task('babel', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
})

