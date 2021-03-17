$(function () {
    // 1.初始化分类
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 封装
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: (res) => {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值 渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 2.初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click()
    })

    // 5.设置图片
    $("#coverFile").change(function (e) {
        // 拿到用户选择的问价
        var file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return;
        }
        // 根据选择的文件，创建于该随影的URL路径
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image.cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
        // console.log(state);
    })

    // 7.添加文章
    $("#form-pub").on("submit", function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 创建FormData对象，收据数据
        var fd = new FormData(this)
        // 放入状态
        fd.append("state", state)
        // 放入图片
        $image.cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            // 将Canvas 画布上的内容，转化为文件对象
            .toBlob(function (blob) {
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                //  发送ajax要在toBlob函数里面
                // console.log(...fd);
                publishArticle(fd)
            })
    })

    // 封装，添加文章方法
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: (res) => {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜您，发布文章成功！")
                // 跳转
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1500)
            }
        })
    }
})