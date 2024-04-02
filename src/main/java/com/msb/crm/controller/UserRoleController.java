package com.msb.crm.controller;

import com.msb.crm.base.BaseController;
import com.msb.crm.service.UserRoleService;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;

@Controller
public class UserRoleController extends BaseController {
    @Resource
    private UserRoleService userRoleService;
}
