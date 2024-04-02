layui.use(['table', 'layer', "form"], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    //暂缓列表展示
    var tableIns = table.render({
        elem: '#customerRepList',
        url: ctx + '/customer_rep/list?lossId=' + $("input[name='id']").val(),
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 10,
        toolbar: "#toolbarDemo",
        id: "customerRepListTable",
        cols: [[
            {type: "checkbox", fixed: "center"},
            {field: "id", title: '编号', fixed: "true"},
            {field: 'measure', title: '暂缓措施', align: "center"},
            {field: 'createDate', title: '创建时间', align: "center"},
            {field: 'updateDate', title: '更新时间', align: "center"},
            {title: '操作', fixed: "right", align: "center", minWidth: 150, templet: "#customerRepListBar"}
        ]]
    });

    /**
     * 监听头部工具栏事件
     */
    table.on('toolbar(customerReps)', function (obj) {
        switch (obj.event) {
            case "add":
                //打开添加/修改暂缓数据的页面
                openAddOrUpdateCustomerReprDialog();
                break;
            case "confirm":
                updateCustomerLossState();
                break;
        }
    });

    /**
     * 监听行工具栏
     */
    table.on('tool(customerReps)', function (data) {
        if (data.event == "edit") { //更新暂缓操作
            //打开添加/更新暂缓数据的页面
            openAddOrUpdateCustomerReprDialog(data.data.id);
        } else if (data.event == "del") {
            //删除暂缓数据
            deleteCustomerRepr(data.data.id);
        }
    });


    /**
     * 打开添加/修改暂缓数据的页面
     * @param id
     */
    function openAddOrUpdateCustomerReprDialog(id) {
        var title = "暂缓管理-添加暂缓";
        var url = ctx + "/customer_rep/toAddOrUpdateCustomerReprPage?lossId=" + $("input[name='id']").val();
        if (id != null && id != '') {
            title = "暂缓管理-更新暂缓";
            url = url + "&id=" + id;
        }
        layui.layer.open({
            title: title,
            type: 2,
            area: ["500px", "220px"],
            maxmin: true,
            content: url
        })
    }

    /**
     * 更新流失客户的流失状态
     */
    function updateCustomerLossState() {
        layer.confirm("当前客户确认流失?", {icon: 3, title: "客户流失管理"}, function (index) {
            //关闭确认框
            layer.close(index);

            //prompt层输入框
            layer.prompt({title: "请输入流失原因", formType: 2}, function (text, index) {
                //关闭输入框
                layer.close(index);
                /**
                 * 发送请求给后台，更新指定流失客户的流失状态
                 *   1.指定流失客户      流失客户ID (隐藏域)
                 *   2.流失原因         输入框的内容 (text)
                 */
                $.ajax({
                    type: "post",
                    url: ctx + "/customer_loss/updateCustomerLossStateById",
                    data: {
                        id: $("input[name='id']").val(),  // 流失客户ID
                        lossReason: text  // 流失原因
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.code == 200) {
                            layer.msg('确认流失成功！', {icon: 6});
                            layer.closeAll("iframe");
                            // 刷新父页面
                            parent.location.reload();
                        } else {
                            layer.msg(data.msg, {icon: 5});
                        }
                    }

                });

            });
        });
    }


    /**
     * 删除暂缓数据
     */
    function deleteCustomerRepr(id) {
        layer.confirm("确认删除当前记录?", {
            icon: 3,
            title: "暂缓管理"
        }, function (index) {
            //关闭确认框
            layer.close(index);
            //发送ajax请求，删除记录
            $.ajax({
                type: "post",
                url: ctx + "/customer_rep/delete",
                data: {
                    id: id
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


});
