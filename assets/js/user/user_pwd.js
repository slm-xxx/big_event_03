$(function () {
    // 1.自定义验证规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return "新旧密码不能相同"
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次输入的密码不一致"
            }
        },
    })

    // 4.表单提交
    $(".layui-form").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg("修改密码成功");
                $(".layui-form")[0].reset();
            }
        })
    })
})