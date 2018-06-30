var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var cssnano         = require('gulp-cssnano');
var autoprefixer    = require('gulp-autoprefixer');
var sourcemaps      = require('gulp-sourcemaps');
var concat          = require('gulp-concat');
var rename          = require('gulp-rename');
var uglify          = require('gulp-uglify');


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
        return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/assets/scss/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});


// Move the javascript files into our /src/js folder
gulp.task('js-boot', function(cb) {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js',
                     'node_modules/tether/dist/js/tether.min.js',
                     'node_modules/bootstrap/dist/js/bootstrap.min.js',
                     'src/assets/js/general.js'
                   ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/assets/scss/**/*.scss'], ['sass']);
    gulp.watch(['src/assets/js/**/*.js'],['js-boot']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});


gulp.task('default', ['js-boot','serve']);
