layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    /**
     * 加载指派人的下拉框    (客户经理)
     */
    $.post(ctx+"/user/queryAllCustomerManager",function (res) {
        for(var i=0;i<res.length;i++){
            if($("input[name='man']").val() == res[i].id){
                $("#assigner").append("<option value=\""+res[i].id+"\"  selected='selected' >"+res[i].uname+"</option>");
            }else{
                $("#assigner").append("<option value=\""+res[i].id+"\"   >"+res[i].uname+"</option>");
            }

        }
        // 重新渲染下拉框内容
        layui.form.render("select");
    });

    /**
     * 表单提交监听
     */
    form.on('submit(addOrUpdateCustomerServe)',function (data) {
        var index= top.layer.msg("数据提交中,请稍后...",{icon:16,time:false,shade:0.8});

        //得到所有的表单元素的值
        var formData = data.field;

        var url = ctx+"/customer_serve/update"; //服务分配操作

        $.post(url,formData,function (res) {
            if(res.code==200){
                top.layer.msg("操作成功",{icon: 6});
                top.layer.close(index);
                layer.closeAll("iframe");
                // 刷新父页面
                parent.location.reload();
            }else{
                layer.msg(res.msg,{icon:5});
            }
        });
        //阻止表单提交
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