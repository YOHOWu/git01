package com.msb.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.msb.crm.base.BaseService;
import com.msb.crm.dao.CustomerLossMapper;
import com.msb.crm.query.CustomerLossQuery;
import com.msb.crm.utils.AssertUtil;
import com.msb.crm.vo.Customer;
import com.msb.crm.vo.CustomerLoss;
import com.msb.crm.vo.CustomerReprieve;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomerLossService extends BaseService<CustomerLoss,Integer> {
    @Resource
    private CustomerLossMapper customerLossMapper;

    /**
     * 分页条件查询流失客户列表
     * @param customerLossQuery
     * @return
     */
    public Map<String, Object> queryCustomerLossByParams(CustomerLossQuery customerLossQuery) {
        Map<String, Object> map = new HashMap<>();

        //开启分页
        PageHelper.startPage(customerLossQuery.getPage(), customerLossQuery.getLimit());
        //得到对应分页对象
        PageInfo<CustomerLoss> pageInfo = new PageInfo<>(customerLossMapper.selectByParams(customerLossQuery));

        //设置map对象
        map.put("code", 0);
        map.put("msg", "success");
        map.put("count", pageInfo.getTotal());
        //设置分页好的列表
        map.put("data", pageInfo.getList());

        return map;
    }

    /**
     * 更新流失客户的流失状态
     *   1.参数校验
     *      判断id非空，且对应的数据存在
     *      流失原因非空
     *   2.设置参数的默认值
     *      设置流失状态  state=1  0=暂缓流失，1=确认流失
     *      客户流失时间  系统当前时间
     *      更新时间     系统当前时间
     *   3.执行更新操作，判断受影响的行数
     * @param id
     * @param lossReason
     */
    public void updateCustomerLossStateById(Integer id, String lossReason) {
        /* 1.参数校验 */
        //判断id非空
        AssertUtil.isTrue(null==id, "待确认流失的客户不存在！");
        //通过id查询流失客户的记录
        CustomerLoss customerLoss=customerLossMapper.selectByPrimaryKey(id);
        //判断流失客户记录是否存在
        AssertUtil.isTrue(null==customerLoss, "待确认流失的客户不存在！");
        //流失原因非空
        AssertUtil.isTrue(null==lossReason, "流失原因不能为空！");

        /* 2.设置参数的默认值 */
        //设置流失状态  state=1  0=暂缓流失，1=确认流失
        customerLoss.setState(1);
        //设置流失原因
        customerLoss.setLossReason(lossReason);
        //客户流失时间  系统当前时间
        customerLoss.setConfirmLossTime(new Date());
        //更新时间     系统当前时间
        customerLoss.setUpdateDate(new Date());

        /* 3.执行更新操作，判断受影响的行数 */
        AssertUtil.isTrue(customerLossMapper.updateByPrimaryKeySelective(customerLoss)<1, "确认流失失败！");
    }
}
