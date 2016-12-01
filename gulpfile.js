'use strict';

/**
 * Import node modules
 */
var gulp         = require('gulp');
var stylus       = require('gulp-stylus');
var rename       = require('gulp-rename');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano      = require('cssnano');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var babelify     = require('babelify');
var browser_sync = require('browser-sync');
var ejs          = require('gulp-ejs');

var path = {
  src: {
    css    : 'src/stylus',
    js     : 'src/js',
    images : 'src/images',
    favicon: 'src/favicon.ico',
    ejs : [
      'src/ejs/**/*.ejs',
      '!src/ejs/**/_*.ejs'
    ]
  },
  dist: {
    css    : 'public/assets/css',
    js     : 'public/assets/js',
    images : 'public/assets/images',
    favicon: 'public',
    ejs    : 'public',
  }
};

/**
 * ES6 to ES5
 */
gulp.task('js', function() {
  return browserify({
    entries: 'src/js/app.js'
  })
  .transform('babelify', {presets: ['es2015']})
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(gulp.dest(path.dist.js));
} );

/**
 * Stylus to CSS
 */
gulp.task('css', function() {
  return gulp.src(path.src.css + '/*.styl')
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest(path.dist.css))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })]))
    .pipe(gulp.dest(path.dist.css))
    .pipe(postcss([cssnano()]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.dist.css));
});

/**
 * EJS to HTML
 */
gulp.task('ejs', function() {
  gulp.src(path.src.ejs)
  .pipe(ejs(
    {
      version: '4.0.0',
      css    : '/assets/css',
      js     : '/assets/js',
      images : '/assets/images',
      is_front_page: false
    },
    {ext: '.html'})
  )
  .pipe(gulp.dest(path.dist.ejs));
});

/**
 * images
 */
gulp.task( 'imagecopy', function(){
  gulp.src(path.src.images + '/**/*.+(jpg|jpeg|png|gif|svg)')
    .pipe(gulp.dest(path.dist.images));
} );
gulp.task('favicon', function(){
  gulp.src(path.src.favicon)
    .pipe(gulp.dest(path.dist.favicon));
} );

/**
 * Auto Compile.
 */
gulp.task('watch', function() {
  gulp.watch([path.src.css + '/**/*.styl'], ['css']);
  gulp.watch([path.src.js + '/**.js'], ['js']);
  gulp.watch([path.src.images + '/**/*.+(jpg|jpeg|png|gif|svg)'], ['imagecopy']);
  gulp.watch([path.src.favicon], ['favicon']);
  gulp.watch(['src/ejs/**/*.ejs'], ['ejs']);
});


/**
 * Browsersync
 */
gulp.task('browsersync', function() {
  browser_sync.init( {
    server: {
      baseDir: "public/"
    },
    files: [
      'public/**'
    ]
  });
});

/**
 * Deploy GitHub Pages
 */
gulp.task('deploy', ['build'], function() {
  return gulp.src(
        [
          'public/**'
        ],
        {base: './public'}
      )
      .pipe(gulp.dest('gh-pages'));
});

gulp.task('build', ['css', 'js', 'imagecopy', 'favicon', 'ejs']);

gulp.task('default', ['build', 'browsersync', 'watch']);
