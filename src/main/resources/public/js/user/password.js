layui.use(['form','jquery','jquery_cookie'],
    function () {
        var form = layui.form,
            layer = layui.layer,
            $ = layui.jquery,
            $ = layui.jquery_cookie($);

        //表单的submit监听 form.on('submit(按钮元素的lay-filter属性值)', function (data) { });
        form.on('submit(saveBtn)', function (data) {
            //所有表单元素的值
            console.log(data.field);
            //发送ajax请求
            $.ajax({
                type:"post",
                url:ctx+"/user/updatePwd",
                data:{
                    oldPwd:data.field.old_password,
                    newPwd:data.field.new_password,
                    repeatPwd:data.field.again_password
                },
                success:function (result) {
                    if(result.code==200){
                        //修改密码成功后，清空cookie，跳转到登录页面
                        layer.msg("密码更新成功,系统将在3秒后自动退出....",function () {
                            $.removeCookie("userIdStr",{domain:"localhost",path:"/crm"});
                            $.removeCookie("userName",{domain:"localhost",path:"/crm"});
                            $.removeCookie("trueName",{domain:"localhost",path:"/crm"});

                        //跳转到登录页面
                        window.parent.location.href=ctx+"/index";
                    })
                }else{
                    layer.msg(result.msg,{icon:5});
                }
            }
        });
        return false;
    });
});
