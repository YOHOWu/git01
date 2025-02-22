package com.msb.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.msb.crm.base.BaseService;
import com.msb.crm.dao.CustomerOrderMapper;
import com.msb.crm.query.CustomerOrderQuery;
import com.msb.crm.vo.CustomerOrder;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomerOrderService extends BaseService<CustomerOrder, Integer> {
    @Resource
    private CustomerOrderMapper customerOrderMapper;

    /**
     * 多条件分页查询客户 (返回的数据格式必须满足layUi中数据表格要求的格式)
     * @param customerOrderQuery
     * @return
     */
    public Map<String, Object> queryCustomerOrderByParams(CustomerOrderQuery customerOrderQuery) {
        Map<String,Object> map=new HashMap<>();

        //开启分页
        PageHelper.startPage(customerOrderQuery.getPage(),customerOrderQuery.getLimit());
        //得到对应分页对象
        PageInfo<CustomerOrder> pageInfo=new PageInfo<>(customerOrderMapper.selectByParams(customerOrderQuery));

        //设置map对象
        map.put("code",0);
        map.put("msg","success");
        map.put("count",pageInfo.getTotal());
        //设置分页好的列表
        map.put("data",pageInfo.getList());

        return map;
    }

    /**
     * 通过订单ID查询订单记录
     * @param orderId
     * @return
     */
    public Map<String, Object> queryOrderById(Integer orderId) {
        return customerOrderMapper.queryOrderById(orderId);
    }
}
