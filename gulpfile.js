var gulp = require("gulp");
var mocha = require("gulp-mocha");

/*
Run tests.
 */
gulp.task("test", function () {
	return gulp.src("test/*.js", { read: false })
		.pipe(mocha());
});
