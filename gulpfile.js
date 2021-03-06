const babel = require('rollup-plugin-babel');
const cssnano = require('gulp-cssnano');
const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const Rollup = require('rollup');
const rollup = require('gulp-rollup');
const run = require('run-sequence');
const sass = require('gulp-sass');
const size = require('gulp-size');
const uglify = require('rollup-plugin-uglify');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');

const rollupConfig = minimize => ({
  rollup: Rollup,
  entry: './src/jEdit.js',
  moduleName: 'jEdit',
  format: 'umd',
  exports: 'named',
  plugins: [babel({ exclude: 'node_modules/**' })].concat(
    minimize
      ? [
        uglify({
          compress: { warnings: false },
          mangle: true,
          sourceMap: false
        })
      ]
      : []
  )
});


gulp.task('clean', () => del(['./dist']));

gulp.task('script', () => {
  gulp.src('./src/*.js')
    .pipe(rollup(rollupConfig(false)))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('./dist'))

    gulp.src('./src/*.js')
      .pipe(rollup(rollupConfig(true)))
      .pipe(rename('jEdit.min.js'))
      .pipe(size({ showFiles: true }))
      .pipe(size({ gzip: true, showFiles: true }))
      .pipe(gulp.dest('./dist'))
});

gulp.task('style', () => {
  gulp.src(['./src/jEdit.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'))
    .pipe(cssnano())
    .pipe(rename('jEdit.min.css'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('default', ['clean'], () => {
  run('script', 'style')
  gulp.watch('./src/jEdit.scss', ['style'])
  gulp.watch('./src/jEdit.js', ['script'])
});

// gulp.task('default', ['clean', 'style', 'script'], () => {
//   livereload.listen();
//   nodemon({
//     scrpt: 'jEdit.js',
//     ext: 'js scss',
//     watch: 'src'
//   }).on('restart', () => {
//     setTimeout(() => {
//       livereload.changed('jEdit.js');
//       gulp.src('jEdit.js').pipe(notify('Reload....'));
//     }, 1000);
//   });
// });
