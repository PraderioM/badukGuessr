const gulp = require("gulp");
const inline = require("gulp-inline");

gulp.task("default", () => {
  return gulp
    .src("./dist/baduk-guesser/*.html")
    .pipe(inline())
    .pipe(gulp.dest("./docs"));
});
