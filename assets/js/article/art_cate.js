$(function () {
    // 1.文章类别列表展示
    initArtCateList()
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: (res) => {
                // console.log(res);
                var htmlStr = template("tpl-art-cate", {
                    data: res.data
                })
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2.显示添加文章分类列表
    var layer = layui.layer

    $("#btnAdd").on('click', function () {
        // 利用框架代码，显示提示添加文章
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-add").html()

        });
    })

    var indexAdd = null
    // 3.提交文章分类添加（事件委托）
    $("body").on('submit', "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            type: 'post',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 添加成功，重新渲染页面
                initArtCateList()
                layer.msg("恭喜您，文章类别添加成功！")
                layer.close(indexAdd)
            }
        })
    })

    // 4.修改-展示列表
    var indexEdit = null
    var form = layui.form
    $("tbody").on('click', '.btn-edit', function () {
        // 利用框架代码，显示提示添加文章
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-edit").html()

        });
        // 4.2 获取Id，发送请求，渲染页面
        var Id = $(this).attr('data-id')
        // console.log(Id);
        $.ajax({
            url: '/my/article/cates/' + Id,
            type: 'get',
            data: {},
            dataType: 'json',
            success: (res) => {
                form.val("form-edit", res.data)
            }
        })
    })

    // 4.修改--提交
    $("body").on('submit', "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            type: 'post',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 添加成功，重新渲染页面
                initArtCateList()
                layer.msg("恭喜您，文章类别更新成功！")
                layer.close(indexEdit)
            }
        })
    })

    // 5.删除
    $("body").on('click', ".btn-delete", function () {
        // 5.2 获取Id，发送请求，渲染页面
        var Id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('是否确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'get',
                success: (res) => {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 添加成功，重新渲染页面
                    initArtCateList()
                    layer.msg("恭喜您，文章类别删除成功！")
                    layer.close(index)
                }
            })
        });

    })
})