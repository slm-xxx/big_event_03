let baseURL = "http://ajax.frontend.itheima.net"

$.ajaxPrefilter(function (options) {
    console.log(options);
    // 手动添加前缀 拼接对应环境开发的服务器地址
    options.url = baseURL + options.url
    // 身份验证
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
})