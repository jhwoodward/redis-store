var gulp = require('gulp');
var rsync = require('gulp-rsync');


gulp.task('deploy', function () {
  return gulp.src('src/**')
    .pipe(rsync({
      root: 'src/',
      hostname: 'ec2',
      destination: 'redis-store/v2/'
    }));
});

gulp.task('deploy-p', function () {
  return gulp.src('package.json')
    .pipe(rsync({
      hostname: 'ec2',
      destination: 'redis-store/v2/'
    }));
});
