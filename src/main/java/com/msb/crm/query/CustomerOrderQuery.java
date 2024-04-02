package com.msb.crm.query;

import com.msb.crm.base.BaseQuery;

public class CustomerOrderQuery extends BaseQuery {
    private Integer cusId;  //客户ID

    public Integer getCusId() {
        return cusId;
    }

    public void setCusId(Integer cusId) {
        this.cusId = cusId;
    }
}
