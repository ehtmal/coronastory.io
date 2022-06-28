const gulp = require('gulp');
// var uglify = require('gulp-uglify-es').default;
const terser = require('gulp-terser');
const concat = require('gulp-concat');

// Script bundle task
gulp.task('script', async function(){
    // Index.html
    gulp.src([
        // Common
        './js/utilities/utility.js',
        './js/utilities/string-utility.js',
        './js/utilities/date-utility.js',
        './js/utilities/number-utility.js',
        './js/common/constant.js',
        // Language
        './js/languages/en.js',
        './js/languages/vi.js',
        // Resources
        './js/resources/station-data.js',
        './js/resources/rules-default.js',
        './js/resources/rules-real-all.js',
        './js/resources/rules-real-confirmed.js',
        './js/resources/rules-real-active.js',
        './js/resources/rules-real-recovered.js',
        './js/resources/rules-real-deaths.js',
        './js/resources/stories-default.js',
        './js/resources/prefix-setting.js',
        // Classes
        './js/classes/bypass-date.js',
        './js/classes/pictogram.js',
        './js/classes/country-modal.js',
        './js/classes/global-summary.js',
        './js/classes/ranking-bar.js',
        './js/classes/repository.js',
        './js/classes/seekbar.js',
        './js/classes/story.js',
        './js/classes/story-manager.js',
        './js/classes/story-map.js',
        './js/classes/story-player.js',
        // Scripts
        './js/site.js',
        './js/main-screen.js',
    ])
    .pipe(concat('bundlejs.js'))
    // .pipe(uglify())
	.pipe(terser())
    .pipe(gulp.dest('./js/bundles'));

    // StoryStudio.html
    gulp.src([
        // Utilities
        './js/utilities/utility.js',
        './js/utilities/string-utility.js',
        './js/utilities/date-utility.js',
        './js/utilities/number-utility.js',
        './js/common/constant.js',
        // Language
        './js/languages/en.js',
        './js/languages/vi.js',        
        // Resources
        './js/resources/station-data.js',
        './js/resources/rules-default.js',
        './js/resources/rules-real-all.js',
        './js/resources/rules-real-confirmed.js',
        './js/resources/rules-real-active.js',
        './js/resources/rules-real-recovered.js',
        './js/resources/rules-real-deaths.js',
        './js/resources/stories-default.js',
        './js/resources/prefix-setting.js',
        // Classes
        './js/classes/bypass-date.js',
        './js/classes/pictogram.js',
        './js/classes/country-modal.js',
        './js/classes/global-summary.js',
        './js/classes/ranking-bar.js',
        './js/classes/repository.js',
        './js/classes/seekbar.js',
        './js/classes/story.js',
        './js/classes/story-manager.js',
        './js/classes/story-map.js',
        './js/classes/story-player.js',
        './js/classes/storystudio/manager-auto-story.js',
        './js/classes/storystudio/manager-manual-story.js',
        // Scripts
        './js/site.js',
        './js/story-studio-screen.js',
    ])
    .pipe(concat('story-studio-bundlejs.js'))
    // .pipe(uglify())
	.pipe(terser())
    .pipe(gulp.dest('./js/bundles'));

})

// Default task alias
gulp.task('default', gulp.series('script'));
