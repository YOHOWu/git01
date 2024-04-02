package com.msb.crm.dao;

import com.msb.crm.base.BaseMapper;
import com.msb.crm.vo.SaleChance;

public interface SaleChanceMapper extends BaseMapper<SaleChance,Integer> {
    //多条件查询的接口不需要单独定义，由于多个模块都涉及到多条件查询，这里对多条件分页查询方法由父接口BaseMapper定义

}