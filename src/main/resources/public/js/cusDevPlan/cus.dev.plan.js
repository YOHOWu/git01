layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    //机会数据列表展示
    var  tableIns = table.render({
        id:'saleChanceTable',
        elem: '#saleChanceList',
        //访问数据的URL (后台的数据接口) 设置flag参数，表示查询的是客户开发计划数据
        url : ctx+'/sale_chance/list?state=1&flag=1',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "saleChanceListTable",
        cols : [[
            {type: "checkbox", fixed:"center"},
            {field: "id", title:'编号',fixed:"true"},
            {field: 'chanceSource', title: '机会来源',align:"center"},
            {field: 'customerName', title: '客户名称',  align:'center'},
            {field: 'cgjl', title: '成功几率', align:'center'},
            {field: 'overview', title: '概要', align:'center'},
            {field: 'linkMan', title: '联系人',  align:'center'},
            {field: 'linkPhone', title: '联系电话', align:'center'},
            {field: 'description', title: '描述', align:'center'},
            {field: 'createMan', title: '创建人', align:'center'},
            {field: 'createDate', title: '创建时间', align:'center'},
            {field: 'devResult', title: '开发状态', align:'center',templet:function (d) {
                    return formatterDevResult(d.devResult);
                }},
            {title: '操作',fixed:"right",align:"center", minWidth:150,templet:"#op"}
        ]]
    });

    function formatterDevResult(value){
        /**
         * 格式化开发状态
         * 0-未开发
         * 1-开发中
         * 2-开发成功
         * 3-开发失败
         */
        if(value==0){
            return "<div style='color: yellow'>未开发</div>";
        }else if(value==1){
            return "<div style='color: #00FF00;'>开发中</div>";
        }else if(value==2){
            return "<div style='color: #00B83F'>开发成功</div>";
        }else if(value==3){
            return "<div style='color: red'>开发失败</div>";
        }else {
            return "<div style='color: #af0000'>未知</div>"
        }
    }


    // 搜索按钮的点击事件
    $(".search_btn").click(function () {
        //表格重载 多条件查询
        tableIns.reload({
            //设置需要传递给后端的参数
            where:{ //设定异步数据接口的额外参数，任意设
                //通过文本框/下拉框的值，设置传递的参数
                customerName:$("input[name='customerName']").val(),// 客户名
                createMan:$("input[name='createMan']").val(),// 创建人
                devResult:$("#devResult").val()    //开发状态
            }
            ,page:{
                curr:1  //重新从第1页开始
            }
        })
    });


    /**
     * 行工具栏监听事件
     */
    table.on("tool(saleChances)",function (data) {
        //判断类型
        if(data.event=="dev"){
            openCusDevPlanDialog("计划项数据开发",data.data.id);
        }else if(data.event =="info"){
            openCusDevPlanDialog("计划项数据详情",data.data.id);
        }
    });

    /**
     * 打开计划项开发或详情页面
     * @param title
     * @param id
     */
    function openCusDevPlanDialog(title,id) {
        layui.layer.open({
            title:title,
            type:2,
            area:["750px","550px"],
            maxmin:true,
            content:ctx+"/cus_dev_plan/toCusDevPlanPage?id="+id
        })
    }





});
