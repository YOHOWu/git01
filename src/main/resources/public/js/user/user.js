layui.use(['table', 'layer', "form"], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    /**
     * 加载数据表格
     */
    var tableIns = table.render({
        id: 'userTable',
        elem: '#userList',
        url: ctx + '/user/list',
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 10,
        //头部工具栏
        toolbar: "#toolbarDemo",
        //表头
        cols: [[
            {type: "checkbox", fixed: "left", width: 50},
            {field: "id", title: '编号', fixed: "true", width: 80},
            {field: 'userName', title: '用户名称', minWidth: 50, align: "center"},
            {field: 'email', title: '用户邮箱', minWidth: 100, align: 'center'},
            {field: 'phone', title: '手机号', minWidth: 100, align: 'center'},
            {field: 'trueName', title: '真实姓名', align: 'center'},
            {field: 'createDate', title: '创建时间', align: 'center', minWidth: 150},
            {field: 'updateDate', title: '更新时间', align: 'center', minWidth: 150},
            {title: '操作', minWidth: 150, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });


    /**
     * 搜索按钮的点击事件
     */
    $(".search_btn").on("click", function () {
        // 表格重载
        // 多条件查询
        table.reload("userTable", {
            // 设置需要传递给后端的参数
            where: {  //设定异步数据接口的额外参数，任意设
                // 通过文本框，设置传递的参数
                userName: $("[name='userName']").val(),// 用户名
                email: $("[name='email']").val(),// 邮箱
                phone: $("[name='phone']").val()    //手机号
            }
            , page: {
                curr: 1  // 重新从第1页开始
            }
        })
    });


    /**
     * 监听头部工具栏
     */
    table.on('toolbar(users)', function (data) {
        if (data.event == "add") {  //添加用户
            //打开添加/修改用户的对话框
            openAddOrUpdateUserDialog();
        } else if (data.event == "del") {   //删除用户
            //获取被选中的数据的信息、
            var checkStatus=table.checkStatus(data.config.id);
            //删除多个用户记录
            delUser(checkStatus.data);
        }
    });


    function delUser(userData) {
        /**
         * 批量删除
         *   datas:选择的待删除记录数组
         */
        if (userData.length == 0) {
            layer.msg("请选择待删除记录!",{icon:5});
            return;
        }
        //询问用户是否确认删除
        layer.confirm("确定删除选中的记录吗？", {icon:3,title:'用户管理'}, function (index) {
            //关闭确认框
            layer.close(index);
            // 传递的参数是数组 ids=10&ids=20&ids=30
            var ids = "ids=";
            // 循环选中的行记录的数据
            for (var i = 0; i < userData.length; i++) {
                if (i < userData.length - 1) {
                    ids = ids + userData[i].id + "&ids=";
                } else {
                    ids = ids + userData[i].id;
                }
            }

            // 发送ajax请求，执行删除用户
            $.ajax({
                type: "post",
                url: ctx + "/user/delete",
                data: ids,
                dataType: "json",
                success: function (result) {
                    if (result.code == 200) {
                        layer.msg("删除成功！",{icon:6});  //提示成功
                        //刷新表格
                        tableIns.reload();
                    } else {
                        layer.msg(result.msg,{icon:5});  //提示失败
                    }
                }
            })


        })
    }

    /**
     * 监听行工具栏
     */
    table.on('tool(users)', function (data) {
        var layEvent = data.event;
        if (layEvent === "edit") {  //更新用户
            //打开添加/修改用户的对话框
            openAddOrUpdateUserDialog(data.data.id);
        } else if (layEvent === "del") {
            layer.confirm("确认删除当前记录?", {icon: 3, title: "用户管理"}, function (index) {
                $.post(ctx + "/user/delete", {ids: data.data.id}, function (data) {
                    if (data.code == 200) {
                        layer.msg("删除成功");
                        tableIns.reload();
                    } else {
                        layer.msg(data.msg);
                    }
                })
            })
        }
    });


    /**
     * 打开添加/修改用户的对话框
     * @param id
     */
    function openAddOrUpdateUserDialog(id) {
        var title = "<h3>用户管理-用户添加</h3>";
        var url = ctx + "/user/toAddOrUpdateUserPage";
        if (id != null && id != '') {
            title = "<h3>用户管理-用户更新</h3>";
            url += "?id=" + id; // 传递主键，查询数据
        }
        layui.layer.open({
            title: title,
            type: 2,
            area: ["700px", "500px"],
            maxmin: true,
            content: url
        })
    }


});
