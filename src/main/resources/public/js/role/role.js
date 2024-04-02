layui.use(['table', 'layer'], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    //角色列表展示
    var tableIns = table.render({
        //容器元素的ID属性值
        elem: '#roleList',
        //访问数据的URl（后台的数据接口）
        url: ctx + '/role/list',
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 10,
        //开启头部工具栏
        toolbar: "#toolbarDemo",
        id: "roleTable",
        cols: [[
            //field：要求field属性值与返回的数据中对应的属性字段名一致
            //title：设置列的标题
            //sort：是否允许排列（默认false）
            //fixed：固定列
            {type: "checkbox", fixed: "left", width: 50},
            {field: "id", title: '编号', fixed: "true", width: 80},
            {field: 'roleName', title: '角色名', minWidth: 50, align: "center"},
            {field: 'roleRemark', title: '角色备注', minWidth: 100, align: 'center'},
            {field: 'createDate', title: '创建时间', align: 'center', minWidth: 150},
            {field: 'updateDate', title: '更新时间', align: 'center', minWidth: 150},
            {title: '操作', minWidth: 150, templet: '#roleListBar', fixed: "right", align: "center"}
        ]]
    });

    /**
     * 多条件搜索
     */
    $(".search_btn").click(function () {
        table.reload("roleTable", {
            page: {
                curr: 1
            },
            where: {
                //通过文本框，设置传递的参数
                roleName: $("input[name='roleName']").val()  // 角色名称
            }
        })
    });

    /**
     * 监听头部工具栏事件
     */
    table.on('toolbar(roles)', function (data) {
        if (data.event == "add") {  //添加操作
            openAddOrUpdateRoleDialog();
        } else if (data.event == "grant") {     //授权操作
            //获取数据表格选中的记录数据
            var checkStatus=table.checkStatus(data.config.id);
            //打开授权的对话框
            openAddGrantDialog(checkStatus.data);
        }
    });

    /**
     * 监听行工具栏
     */
    table.on('tool(roles)', function (data) {
        if (data.event == "edit") {
            openAddOrUpdateRoleDialog(data.data.id);
        } else if (data.event == "del") {
            deleteRole(data.data.id);
        }
    });


    /**
     * 打开添加/更新角色的对话框
     * @param id
     */
    function openAddOrUpdateRoleDialog(id) {
        var title = "角色管理-角色添加";
        var url = ctx + "/role/toAddOrUpdateRolePage";
        if (id != null && id != '') {
            title = "角色管理-角色更新";
            url = url + "?id=" + id;
        }
        layui.layer.open({
            title: title,
            type: 2,
            area: ["700px", "500px"],
            maxmin: true,
            content: url
        })
    }

    /**
     * 删除角色
     * @param roleId
     */
    function deleteRole(roleId) {
        layer.confirm("确认删除当前记录?", {
            icon: 3,
            title: "角色管理"
        }, function (index) {
            //关闭确认框
            layer.close(index);

            //发送ajax请求，删除记录
            $.ajax({
                type: "post",
                url: ctx + "/role/delete",
                data: {
                    roleId: roleId
                },
                success: function (result) {
                    if (result.code == 200) {
                        layer.msg("删除成功", {icon: 6});
                        tableIns.reload();
                    } else {
                        layer.msg(result.msg, {icon: 5});
                    }
                }
            });
        });
    }

    /**
     * 打开授权页面
     * @param data
     */
    function openAddGrantDialog(data) {
        if (data.length == 0) {
            layer.msg("请选择待授权的角色记录!", {icon: 5});
            return;
        }
        if (data.length > 1) {
            layer.msg("暂不支持批量角色授权!", {icon: 5});
            return;
        }

        layui.layer.open({
            title: "角色管理-角色授权",
            type: 2,
            area: ["700px", "500px"],
            maxmin: true,
            content: ctx + "/module/toAddGrantPage?roleId=" + data[0].id
        })

    }


});
