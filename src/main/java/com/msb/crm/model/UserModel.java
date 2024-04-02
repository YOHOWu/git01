package com.msb.crm.model;

public class UserModel {
    /*private Integer userId;*/
    private String userIdStr;//加密后的用户ID
    private String userName;
    private String trueName;

   /* public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }*/

    public String getUserIdStr() {
        return userIdStr;
    }

    public void setUserIdStr(String userIdStr) {
        this.userIdStr = userIdStr;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTrueName() {
        return trueName;
    }

    public void setTrueName(String trueName) {
        this.trueName = trueName;
    }
}
