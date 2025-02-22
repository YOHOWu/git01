package com.msb.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.msb.crm.base.BaseService;
import com.msb.crm.base.ResultInfo;
import com.msb.crm.dao.CustomerLossMapper;
import com.msb.crm.dao.CustomerReprieveMapper;
import com.msb.crm.query.CustomerReprieveQuery;
import com.msb.crm.utils.AssertUtil;
import com.msb.crm.vo.Customer;
import com.msb.crm.vo.CustomerReprieve;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomerReprieveService extends BaseService<CustomerReprieve,Integer> {
    @Resource
    private CustomerReprieveMapper customerReprieveMapper;
    @Resource
    private CustomerLossMapper customerLossMapper;

    /**
     * 分页条件查询流失客户暂缓操作的列表
     * @param customerReprieveQuery
     * @return
     */
    public Map<String, Object> queryCustomerReprieveByParams(CustomerReprieveQuery customerReprieveQuery) {
        Map<String, Object> map = new HashMap<>();

        //开启分页
        PageHelper.startPage(customerReprieveQuery.getPage(), customerReprieveQuery.getLimit());
        //得到对应分页对象
        PageInfo<CustomerReprieve> pageInfo = new PageInfo<>(customerReprieveMapper.selectByParams(customerReprieveQuery));

        //设置map对象
        map.put("code", 0);
        map.put("msg", "success");
        map.put("count", pageInfo.getTotal());
        //设置分页好的列表
        map.put("data", pageInfo.getList());

        return map;
    }

    /**
     * 添加流失客户暂缓数据
     *  1.参数校验
     *      流失客户ID lossId   非空，数据存在
     *      暂缓措施内容 measure  非空
     *  2.设置参数的默认值
     *      是否有效 is_valid  默认为1
     *      创建时间 create_date  默认为当前系统时间
     *      修改时间 update_date  默认为当前系统时间
     *  3.执行添加操作，判断受影响的行数
     * @param customerReprieve
     * @return
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addCustomerRepr(CustomerReprieve customerReprieve) {
        /* 1.参数校验 */
        checkParams(customerReprieve.getLossId(),customerReprieve.getMeasure());
        /* 2。设置参数的默认值 */
        customerReprieve.setIsValid(1);
        customerReprieve.setCreateDate(new Date());
        customerReprieve.setUpdateDate(new Date());
        /* 3.执行添加操作，判断受影响的行数 */
        AssertUtil.isTrue(customerReprieveMapper.insertSelective(customerReprieve)<1,"添加暂缓记录添加失败！");
    }

    /**
     * 参数校验
     * @param lossId
     * @param measure
     */
    private void checkParams(Integer lossId, String measure) {
        //流失客户ID lossId     非空，数据存在
        AssertUtil.isTrue(null==lossId ||
                customerLossMapper.selectByPrimaryKey(lossId)==null,"流失客户记录不存在！");
        //暂缓措施内容 measure   非空
        AssertUtil.isTrue(StringUtils.isBlank(measure),"暂缓措施内容不能为空！");
    }


    /**
     *  1.参数校验
     *      主键ID  id          非空，数据存在
     *      流失客户ID lossId    非空，数据存在
     *      暂缓措施内容 measure  非空
     *  2.设置参数的默认值
     *      是否有效 is_valid  默认为1
     *      创建时间 create_date  默认为当前系统时间
     *      修改时间 update_date  默认为当前系统时间
     *  3.执行更新操作，判断受影响的行数
     * 修改流失客户暂缓数据
     * @param customerReprieve
     * @return
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateCustomerRepr(CustomerReprieve customerReprieve) {
        /* 1.参数校验 */
        //主键ID  id          非空，数据存在
        AssertUtil.isTrue(null==customerReprieve.getId() ||
                customerReprieveMapper.selectByPrimaryKey(customerReprieve.getId())==null,"待更新记录不存在！");
        //参数校验
        checkParams(customerReprieve.getLossId(),customerReprieve.getMeasure());
        /* 2.设置参数的默认值 */
        customerReprieve.setUpdateDate(new Date());
        /* 3.执行更新操作，判断受影响的行数 */
        AssertUtil.isTrue(customerReprieveMapper.updateByPrimaryKeySelective(customerReprieve)<1,"修改暂缓数据失败！");
    }

    /**
     * 删除流失客户暂缓数据
     *   1.判断id是否为空，且数据存在
     *   2.设置is_valid为0
     *   3.执行更新操作，判断受影响的行数
     * @param id
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteCustomerRepr(Integer id) {
        //判断id是否为空
        AssertUtil.isTrue(null==id,"待删除记录不存在！");
        //通过id查询暂缓数据
        CustomerReprieve customerReprieve=customerReprieveMapper.selectByPrimaryKey(id);
        //判断数据是否存在
        AssertUtil.isTrue(null==customerReprieve,"待删除记录不存在！");

        //设置is_valid为0
        customerReprieve.setIsValid(0);
        customerReprieve.setUpdateDate(new Date());

        //执行更新操作，判断受影响的行数
        AssertUtil.isTrue(customerReprieveMapper.updateByPrimaryKeySelective(customerReprieve)<1,"删除暂缓数据失败！");
    }
}
