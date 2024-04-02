package com.msb.crm.controller;

import com.msb.crm.base.BaseController;
import com.msb.crm.query.OrderDetailsQuery;
import com.msb.crm.service.OrderDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Map;

@RequestMapping("order_details")
@Controller
public class OrderDetailsController extends BaseController {
    @Resource
    private OrderDetailsService orderDetailsService;

    /**
     * 分页条件查询订单详情列表
     * @param orderDetailsQuery
     * @return
     */
    @RequestMapping("list")
    @ResponseBody
    public Map<String,Object> queryOrderDetailsByParams(OrderDetailsQuery orderDetailsQuery){
        return orderDetailsService.queryOrderDetailsByParams(orderDetailsQuery);
    }
}
