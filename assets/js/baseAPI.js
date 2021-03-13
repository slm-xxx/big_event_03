let baseURL = "http://api-breakingnews-web.itheima.net"

$.ajaxPrefilter(function (options) {
    console.log(options);
    // 手动添加前缀 拼接对应环境开发的服务器地址
    options.url = baseURL + options.url
})