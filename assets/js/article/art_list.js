$(function () {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 10, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 2.初始化列表
    var layer = layui.layer

    initTable()

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'GET',
            data: q,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败")
                }
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 3.初始化分类
    var form = layui.form
    initCate()

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

    // 4.筛选功能
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state;
        q.cate_id = cate_id
        // 初始化文章列表
        initCate()
    })

    //5.分页
    var laypage = layui.laypage

    function renderPage(total) {
        // alert(total)
        // console.log(total);
        // 执行一个playpage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //第几页

            // 分页模块设置，显示哪些字模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            limits: [2, 3, 5, 10], // 每页显示多少条数据的选择器
            jump: function (obj, first) {
                // obj：所有参数所在的对象，first：是否是第一次初始化分页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit; //limit	每页显示的条数。
                // 判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        });
    }

    // 6.删除
    $("body").on('click', ".btn-delete", function () {
        // 5.2 获取Id，发送请求，渲染页面
        var Id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('是否确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + Id,
                type: 'get',
                success: (res) => {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 添加成功，重新渲染页面
                    layer.msg("恭喜您，文章删除成功！")
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--
                    initTable()

                    layer.close(index)
                }
            })
        });
    })
})