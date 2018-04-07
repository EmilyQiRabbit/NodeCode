// gulp命令默认请求gulpfile.js文件，各类管道（任务）都在这个文件里，本工程对 js 进行处理的代码如下：
/*----其他代码-----*/
// 开建管道，名字叫`js`
gulp.task('js', ['clean'], function() {
  // 合并、压缩、混淆，并拷贝js文件
  return es.merge(                   //这是个workflow插件，是Node.js模块，都是Node.js应用，当然也可以使用了
    gulp.src(assets.js.vendor) //管道1入口
    .pipe(gulp.dest(settings.destFolder + '/js/')), // 直接流到管道1出口，相当于简单拷贝

    gulp.src(assets.js.paths) //管道2入口
    .pipe(order(assets.js.order)) //过滤网1：排序
    .pipe(sourcemaps.init())  //过滤网2：建sourcemaps
    .pipe(uglify())   //这算是管道中的管道了，过滤网3：混淆处理
    .pipe(concat(settings.prefix.destfile + '.js')) //过滤网4：合并处理
    .pipe(sourcemaps.write()) //建maps结束，输出sourcemaps
    .pipe(gulp.dest(settings.destFolder + '/js')) //管道2出口
  )
  .pipe(concat(settings.prefix.mergefile + '.js'))  //汇总管道：对上述2个管道的输出再合并
  .pipe(gulp.dest(settings.destFolder + '/js/'))    //汇总管道出口
});
/*----其他代码-----*/