layui.use(['form', 'layer', 'formSelects'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    var formSelects = layui.formSelects;


    /**
     * 加载角色下拉框
     * 配置远程搜索，请求头，请求参数，请求类型等
     * formSelects.config(ID,Options,isJson);
     * ID         xm-select的值
     * Options    配置项
     * isJson     是否传输json数据，true将添加请求头 Content-Type:application/json;charset=UTF-8
     * @type {*|jQuery}
     */
    var userId = $("input[name='id']").val();
    formSelects.config("selectId", {
        type: "post",  //请求方式
        searchUrl: ctx + "/role/queryAllRoles?userId=" + userId,   //请求地址
        //自定义返回数据中name的key, 默认 name
        keyName: "roleName",    //下拉框中的文本内容，要与返回的数据中对应key一致
        //自定义返回数据中value的key, 默认 value
        keyVal: "id"
    }, true);


    /**
     * 表单submit监听
     */
    form.on('submit(addOrUpdateUser)', function (data) {
        //提交数据时的加载层
        var index = top.layer.msg("数据提交中,请稍后...", {icon: 16, time: false, shade: 0.8});
        //得到所有表单元素的值
        var formData = data.field;

        // 请求的地址(添加操作)
        var url = ctx + "/user/add ";

        // 判断用户ID是否为空，如果不为空则为更新操作
        if ($("[name='id']").val()) {
            url = ctx + "/user/update";
        }
        $.post(url, formData, function (result) {
            if (result.code == 200) {
                top.layer.msg("操作成功", {icon: 6});
                //关闭加载层
                top.layer.close(index);
                //关闭弹出层
                layer.closeAll("iframe");
                // 刷新父页面，重新加载数据
                parent.location.reload();
            } else {
                layer.msg(result.msg, {icon: 5});
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