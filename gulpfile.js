// Gulp
var gulp = require('gulp');

// Plugins
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

// Paths
var paths = {
    scripts: ['assets/js/*.js'],
    images: ['assets/img/**'],
    fonts: ['assets/fonts/**']
};

// Jade to HTML
gulp.task('jade', function() {
    gulp.src(['**/*.jade', '!./{node_modules/**, node_modules}'])
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('Build/'))
        .pipe(livereload(server));
});

// Compile Stylus
gulp.task('stylus', function() {
    gulp.src(['assets/stylus/main.styl'])
        .pipe(plumber())
        .pipe(stylus({
            'set': ['compress']
        }))
        .pipe(gulp.dest('Build/assets/css'))
        .pipe(livereload(server));
});
// Uglify JS
gulp.task('uglify', function() {
    gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(uglify({
            outSourceMap: false
        }))
        .pipe(gulp.dest('Build/assets/js'));
});

// Compress images.
gulp.task('imagemin', function() {
    gulp.src(paths.images)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest('Build/assets/img'));
});

// Copy all static assets
gulp.task('copyFonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('Build/assets/fonts'));
});

// Livereload
gulp.task('listen', function(next) {
    server.listen(35729, function(err) {
        if (err) return console.log;
        next();
    });
});

// Watch files
gulp.task('watch', function(event) {
    gulp.watch('**/*.jade', ['jade']);
    gulp.watch('assets/stylus/main.styl', ['stylus']);
    gulp.watch(paths.images, ['imagemin']);
    gulp.watch(paths.fonts, ['copyFonts']);
    gulp.watch(paths.scripts, ['uglify']);
});

gulp.task('default', ['listen', 'watch']);