$(function () {
    // 1.自定义校验规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1-6个字符之间"
            }
        }
    })
    // 2.用户渲染
    initUserInfo()
    var layer = layui.layer

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'get',
            data: {},
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 响应成功，渲染用户列表
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.表单重置
    $("#btnReset").on('click', function (e) {
        e.preventDefault();
        initUserInfo()
    })

    // 4.修改用户信息
    $(".layui-form").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/userinfo',
            type: 'post',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("用户信息修改失败！")
                }
                layer.msg("用户信息修改成功！")
                window.parent.getUserInfo()
            }
        })
    })
})