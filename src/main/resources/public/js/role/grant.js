$(function () {
    //加载树形结构
    loadModuleData();
});

//定义树形结构对象
var zTreeObj;

/**
 * 加载资源树形数据
 */
function loadModuleData() {
    // 通过ajax查询资源列表
    $.ajax({
        type:"post",
        // 查询所有的资源列表时，传递角色ID，查询当前角色对应的已经授权的资源
        url:ctx+"/module/queryAllModules?roleId="+$("[name='roleId']").val(),
        dataType:"json",
        success:function (data) {

            // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
            var setting = {
                check: {
                    enable: true
                },
                //使用简单的JSON数据
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                //绑定函数
                callback: {
                    //当checkbox/radio被选中或取消选中时触发的函数
                    onCheck: zTreeOnCheck
                }
            };
            // data：查询到的资源列表
            // 加载zTree树插件
            zTreeObj = $.fn.zTree.init($("#test1"), setting, data);
        }
    })
}

/**
 * 当checkbox/radio 被选中或取消选中时触发的函数
 * @param event
 * @param treeId
 * @param treeNode
 */
function zTreeOnCheck(event, treeId, treeNode) {
    //alert(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
    var nodes= zTreeObj.getCheckedNodes(true);
    var mIds="mIds=";

    for(var i=0;i<nodes.length;i++){
        if(i<nodes.length-1){
            mIds=mIds+nodes[i].id+"&mIds=";
            console.log(mIds)
        }else{
            mIds=mIds+nodes[i].id;
        }
    }

    //发送ajax请求，执行角色的授权操作
    $.ajax({
        type:"post",
        url:ctx+"/role/addGrant",
        data:mIds+"&roleId="+$("input[name='roleId']").val(),
        dataType:"json",
        success:function (data) {
            console.log(data);
        }
    })

}