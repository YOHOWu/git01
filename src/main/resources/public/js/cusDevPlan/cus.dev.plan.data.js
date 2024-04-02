layui.use(['table', 'layer'], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    //计划项数据展示
    var tableIns = table.render({
        id: 'cusDevPlanTable',
        elem: '#cusDevPlanList',
        url: ctx + '/cus_dev_plan/list?saleChanceId=' + $("[name='id']").val(),
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 10,
        toolbar: "#toolbarDemo",
        id: "cusDevPlanListTable",
        cols: [[
            {type: "checkbox", fixed: "center"},
            {field: "id", title: '编号', fixed: "true"},
            {field: 'planItem', title: '计划项', align: "center"},
            {field: 'exeAffect', title: '执行效果', align: "center"},
            {field: 'planDate', title: '执行时间', align: "center"},
            {field: 'createDate', title: '创建时间', align: "center"},
            {field: 'updateDate', title: '更新时间', align: "center"},
            {title: '操作', fixed: "right", align: "center", minWidth: 150, templet: "#cusDevPlanListBar"}
        ]]
    });

    /**
     * 监听头部工具栏
     */
    table.on('toolbar(cusDevPlans)', function (data) {
        if (data.event == "add") {     //添加计划项

            //打开添加或修改计划项的页面
            openAddOrUpdateCusDevPlanDialog();
        } else if (data.event == "success") {
            //更新营销机会的开发状态
            updateSaleChanceDevResult(2);     //开发成功
        } else if (data.event = "failed") {
            //更新营销机会的开发状态
            updateSaleChanceDevResult(3);     //开发失败
        }
    });


    table.on("tool(cusDevPlans)", function (obj) {
        var layEvent = obj.event;
        if (layEvent === "edit") {
            openAddOrUpdateCusDevPlanDialog(obj.data.id);
        } else if (layEvent === "del") {
            layer.confirm("确认删除当前记录?", {icon: 3, title: "客户开发计划管理"}, function (index) {
                $.post(ctx + "/cus_dev_plan/delete", {id: obj.data.id}, function (data) {
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
     * 监听行工具栏
     */
    table.on('tool(cusDevPlans)', function (data) {
        if (data.event == "edit") {    //更新计划项

            //打开添加或修改计划项的页面
            openAddOrUpdateCusDevPlanDialog(data.data.id);
        } else if (data.event == "del") {    //删除计划项

            deleteCusDevPlan(data.data.id);
        }
    })

    /**
     *打开添加或修改计划项的页面
     */
    function openAddOrUpdateCusDevPlanDialog(id) {
        var title = "计划项管理 - 添加计划项";
        var url = ctx + "/cus_dev_plan/toAddOrUpdateCusDevPlanPage?sId=" + $("[name='id']").val();

        //判断计划项的ID是否为空 (如果为空，则表示添加；不为空则表示更新操作)
        if (id != null && id != '') {
            //更新计划项
            title = "计划项管理-更新计划项";
            url = url + "&id=" + id;
        }
        //iframe层
        layui.layer.open({
            title: title,
            type: 2,
            area: ["700px", "500px"],
            maxmin: true,
            content: url
        })
    }


    /**
     *  更新营销机会的开发状态
     * @param sid
     * @param devResult
     */
    function updateSaleChanceDevResult(devResult) {
        layer.confirm("确认更新机会数据状态?", {icon: 3, title: "营销机会管理"}, function (index) {
            // 得到需要被更新的营销机会的ID (通过隐藏域获取)
            var sId = $("[name='id']").val();
            // 发送ajax请求，更新营销机会的开发状态
            $.post(ctx + "/sale_chance/updateSaleChanceDevResult", {
                id: sId,
                devResult: devResult
            }, function (result) {
                if (result.code == 200) {
                    layer.msg("数据更新成功", {icon: 6});
                    //关闭窗口
                    layer.closeAll("iframe");
                    // 刷新父页面
                    parent.location.reload();
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            });
        });
    }


    /**
     * 删除计划项数据
     */
    function deleteCusDevPlan(id) {
        //弹出确认框，询问用户是否确认删除记录
        layer.confirm('确认要删除该记录吗？', {icon: 3, title: '开发项数据管理'}, function (index) {
            //发送ajax请求，执行删除操作
            $.post(ctx + '/cus_dev_plan/delete', {id: id}, function (result) {
                //判断删除结果
                if (result.code == 200) {
                    //提示成功
                    layer.confirm('删除成功', {icon: 6});
                    //刷新数据表格
                    tableIns.reload();
                } else {
                    //提示失败原因
                    layer.msg(result.msg, {icon: 5});
                }
            })
        })
    }

});
