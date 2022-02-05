// HTML
import htmlmin from 'gulp-htmlmin'

// CSS
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
// Clean CSS
import clean from 'gulp-purgecss'

//SASS
import dartSass from 'sass'
import gulpSass from 'gulp-sass'

// JavaScript
import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'

// Common
import gulpConcat from 'gulp-concat'
import sourcemaps from 'gulp-sourcemaps'

//Cache bust
import cacheBust from 'gulp-cache-bust'

// Optimizacion de imagenes
import imagemin from 'gulp-imagemin'

//Browser-sync
//? init se usa para construir un servidor de desarrollo y poder visualizar la app/pagina
//? stream inyecta el css cuando hacemos cambios
//? reload cambia la pagina cuando hay cambios
import { init as server, stream, reload } from 'browser-sync'

//Plumber
import plumber from 'gulp-plumber'

// Variables/constantes
const cssPlugins = [cssnano(), autoprefixer({ grid: 'autoplace' })]
const sass = gulpSass(dartSass)

// gulp.task('styles', () => {
// 	return gulp
// 		.src('./src/css/*.css')
// 		.pipe(plumber())
// 		.pipe(gulpConcat('styles-min.css'))
// 		.pipe(postcss(cssPlugins))
// 		.pipe(gulp.dest('./public/css'))
// 		.pipe(stream())
// })

gulp.task('sass', () => {
	return gulp
		.src('./src/scss/styles.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(postcss(cssPlugins))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('./public/css'))
		.pipe(stream())
})

gulp.task('clean', () => {
	return (
		gulp
			.src('./public/css/styles.css')
			// .pipe(sourcemaps.init())
			.pipe(plumber())
			.pipe(
				clean({
					content: ['./public/*.html'],
				})
			)
			// .pipe(sourcemaps.write('../maps'))
			.pipe(gulp.dest('./public/css'))
	)
})

gulp.task('html-min', () => {
	return gulp
		.src('./src/*.html')
		.pipe(plumber())
		.pipe(
			htmlmin({
				removeComments: true,
				collapseWhitespace: true,
			})
		)
		.pipe(
			cacheBust({
				type: 'timestamp',
			})
		)
		.pipe(gulp.dest('./public'))
})

//Esta tarea convierte codigo nuevo a codigo compatible con todos los navegadores
gulp.task('babel', () => {
	return (
		gulp
			.src('./src/js/*.js') // especifica el origen de los archivos, aqui se le dice que tome todos los archivos de JavaScript (con extension .js) de la carpeta js contenida en src
			.pipe(plumber())
			.pipe(gulpConcat('scripts-min.js')) // gulpConcat se usa para unir varios archivos en uno solo, se une en el orden que se indice en gulp.src:
			//?  gulp.task('scripts', function() {
			//?    return gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
			//?      .pipe(concat('all.js'))
			//?      .pipe(gulp.dest('./dist/'));
			//? });
			// pipe se usa para concatenar metodos
			.pipe(babel())
			.pipe(sourcemaps.init())
			.pipe(terser()) //gulp terser se usa para minificar (comprimir) el codigo y dejarlo en una sola linea
			.pipe(sourcemaps.write('../maps'))
			.pipe(gulp.dest('./public/js')) // gulp.dest es para indicar el destino del archivo o archivos, en este caso es la carpeta js dentro de public
	)
})

gulp.task('imgmin', () => {
	return gulp
		.src('./src/images/*')
		.pipe(plumber())
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 30, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
			])
		)
		.pipe(gulp.dest('./public/images'))
})

// creamos una tarea por defecto (se ejecuta cuando escibimos gulp en la terminal), esta tarea tiene un vigilante que 'vigila' los cambios en los archivos
gulp.task('default', () => {
	server({
		server: './public',
	})
	gulp.watch('./src/*.html', gulp.series('html-min')).on('change', reload)
	// gulp.watch('./src/css/*.css', gulp.series('styles'))
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
	gulp.watch('./src/js/*.js', gulp.series('babel')).on('change', reload) // el primer parametro son los archivos que tiene que vigilar, el segundo parametro es la tarea que tiene que ejecutar cuando haya un cambio los archivos
})

// const sum = (a, b) => a + b
