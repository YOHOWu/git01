package com.msb.crm.query;

import com.msb.crm.base.BaseQuery;

public class CustomerReprieveQuery extends BaseQuery {
    private Integer lossId;//流失客户id

    public Integer getLossId() {
        return lossId;
    }

    public void setLossId(Integer lossId) {
        this.lossId = lossId;
    }
}
