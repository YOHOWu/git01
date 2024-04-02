layui.use(['form', 'layer','jquery_cookie'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
        $ = layui.jquery_cookie($);


    /**
     * 加载指派人的下拉框  (客户经理)
     */
    $.post(ctx+"/user/queryAllCustomerManager",function (data) {
        if (data != null ){
            //获取隐藏域中设置的分配人
            var assigner = $("input[name='man']").val();
            //遍历返回的数据
            for (var i = 0; i < data.length; i++) {
                var opt="";
                //判断是否需要被选中
                if(assigner == data[i].id){
                    //设置下拉选项
                    opt= "<option value='"+ data[i].id + "' selected>" + data[i].uname + "</option>";
                }else {
                    opt= "<option value='"+ data[i].id + "'>" + data[i].uname + "</option>";
                }
                //将下拉项设置到下拉框中
                $("#assigner").append(opt);
            }
        }
        //重新渲染
        layui.form.render("select");
    });


    /**
     * 表单Submit监听
     */
    form.on("submit(addOrUpdateCustomerServe)", function (data) {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        //设置处理人
        data.field.serviceProcePeople=$.cookie("trueName");

        //弹出loading
        $.post(ctx + "/customer_serve/update", data.field, function (res) {
            if (res.code == 200) {
                setTimeout(function () {
                    top.layer.close(index);
                    top.layer.msg("操作成功！",{icon:6});
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
                }, 500);
            } else {
                layer.msg(res.msg, {icon: 5});
            }
        });
        return false;
    });


    /**
     * 关闭弹出层
     */
    $("#closeBtn").click(function () {
        //当你在iframe页面关闭自身时
        var index = parent.layer.getFrameIndex(window.name);//先得到当前iframe层的索引
        parent.layer.close(index);//再执行关闭
    });
});