layui.use(['table', 'layer', "form"], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        form = layui.form;

    //客户列表展示
    var tableIns = table.render({
        elem: '#customerList',
        url: ctx + '/customer/list',
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [10, 15, 20, 25],
        limit: 10,
        toolbar: "#toolbarDemo",
        id: "customerListTable",
        cols: [[
            {type: "checkbox", fixed: "center"},
            {field: "id", title: '编号', fixed: "true"},
            {field: 'name', title: '客户名', align: "center"},
            {field: 'fr', title: '法人', align: 'center'},
            {field: 'khno', title: '客户编号', align: 'center'},
            {field: 'area', title: '地区', align: 'center'},
            {field: 'cusManager', title: '客户经理', align: 'center'},
            {field: 'myd', title: '满意度', align: 'center'},
            {field: 'level', title: '客户级别', align: 'center'},
            {field: 'xyd', title: '信用度', align: 'center'},
            {field: 'address', title: '详细地址', align: 'center'},
            {field: 'postCode', title: '邮编', align: 'center'},
            {field: 'phone', title: '电话', align: 'center'},
            {field: 'webSite', title: '网站', align: 'center'},
            {field: 'fax', title: '传真', align: 'center'},
            {field: 'zczj', title: '注册资金', align: 'center'},
            {field: 'yyzzzch', title: '营业执照', align: 'center'},
            {field: 'khyh', title: '开户行', align: 'center'},
            {field: 'khzh', title: '开户账号', align: 'center'},
            {field: 'gsdjh', title: '国税', align: 'center'},
            {field: 'dsdjh', title: '地税', align: 'center'},
            {field: 'createDate', title: '创建时间', align: 'center'},
            {field: 'updateDate', title: '更新时间', align: 'center'},
            {title: '操作', templet: '#customerListBar', fixed: "right", align: "center", minWidth: 150}
        ]]
    });


    /**
     * 搜索按钮的点击事件
     */
    $(".search_btn").click(function () {
        /**
         * 表格重载  多条件查询
         */
        tableIns.reload({
            //设置需要传递给后端的参数
            where: { //设定异步数据接口的额外参数
                //通过文本框设置传递的参数
                customerName: $("[name='name']").val(),// 客户名
                customerNo: $("[name='khno']").val(),// 客户编号
                level: $("#level").val()    //客户级别
            }
            , page: {
                curr: 1
            }
        });
    });


    /**
     * 监听头部工具栏
     */
    table.on('toolbar(customers)', function (data) {
        if (data.event == "add") {  //添加客户信息
            openAddOrUpdateCustomerDialog();//打开添加/修改客户信息的对话框
        } else if (data.event == "order") {//客户的订单数据查看
            //获取被选择的数据的相关信息
            var checkStatus = table.checkStatus(data.config.id);
            //打开订单信息的对话框(传递选择的数据记录)
            openOrderInfoDialog(checkStatus.data);

        }
    });

    /**
     * 监听行工具栏
     */
    table.on('tool(customers)', function (data) {
        if (data.event == "edit") {
            //打开添加/修改客户信息的对话框
            openAddOrUpdateCustomerDialog(data.data.id);
        } else if (data.event === "del") {
            deleteCustomer(data.data.id);
        }
    });

    /**
     * 打开添加/修改客户信息的对话框
     * @param id
     */
    function openAddOrUpdateCustomerDialog(id) {
        var title = "客户管理-客户添加";
        var url = ctx + "/customer/addOrUpdateCustomerPage";
        if (id) {
            title = "客户管理-客户更新信息";
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
     * 打开指定客户的订单对话框
     * @param data
     */
    function openOrderInfoDialog(data) {
        //判断用户是否选择客户
        if (data.length == 0) {
            layer.msg("请选择查看订单对应客户!", {icon: 5});
            return;
        }
        //判断用户是否多选
        if (data.length > 1) {
            layer.msg("暂不支持批量查看!",{icon:5});
            return;
        }
        //打开对话框
        layui.layer.open({
            title: "客户管理-订单信息查看",
            type: 2,
            area: ["700px", "500px"],
            maxmin: true,
            content: ctx + "/customer/toCustomerOrderPage?id=" + data[0].id
        })

    }


    /**
     * 删除客户信息
     * @param id
     */
    function deleteCustomer(id){
        layer.confirm("确认删除当前记录?", {icon: 3, title: "客户管理"}, function (index) {
            $.post(ctx + "/customer/delete", {id: id}, function (data) {
                if (data.code == 200) {
                    layer.msg("删除成功", {icon: 6});
                    tableIns.reload();//刷新表格
                } else {
                    layer.msg(data.msg,{icon:5});//删除失败
                }
            });
        });
    }

});
