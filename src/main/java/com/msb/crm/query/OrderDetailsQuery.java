package com.msb.crm.query;

import com.msb.crm.base.BaseQuery;

public class OrderDetailsQuery extends BaseQuery {
    private Integer orderId;//订单ID

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }
}
