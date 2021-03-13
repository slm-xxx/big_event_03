$(function () {
    // 需求1：点击注册账号，隐藏登录，显示注册页面
    $("#link_reg").on('click', function () {
        $(".login-box").hide()
        $(".reg-box").show()
    })
    // ：点击登录账号，隐藏注册，显示登录页面
    $("#link_login").on('click', function () {
        $(".login-box").show()
        $(".reg-box").hide()
    })
    // 需求2:自定义验证规则
    var form = layui.form;
    form.verify({
        // 密码验证
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码验证
        repwd: function (value) {
            // 选择器必须带空格，选择的是后代中的input ，name属性值为password的那一个标签
            var pwd = $(".reg-box input[name=password]").val()
            if (value !== pwd) {
                return "两次密码输入不一致！"
            }
        }
    })
    // 需求3.注册功能
    let layer = layui.layer
    $("#form_reg").on("submit", function (e) {
        // 阻止默认提交
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val()
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    // 注册失败，弹出提示和伤心的表情
                    return layer.msg(res.message, {
                        icon: 5
                    })
                }
                // 注册成功弹出提示和微笑的表情
                layer.msg("注册成功，请登录！", {
                    icon: 6
                })
                // 手动切换到登录表单
                $("#link_login").click()
                // 重置表单
                $("#form_reg")[0].reset()
            }
        })
    })
    // 4.登录功能
    $("#form_login").submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你，登录成功！")
                // 保存token，未来的接口要使用token
                localStorage.setItem('token', res.token)
                // 跳转
                location.href = "/index.html"
            }
        })
    })
})