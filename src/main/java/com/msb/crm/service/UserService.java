package com.msb.crm.service;

import com.msb.crm.base.BaseService;
import com.msb.crm.dao.UserMapper;
import com.msb.crm.dao.UserRoleMapper;
import com.msb.crm.model.UserModel;
import com.msb.crm.utils.AssertUtil;
import com.msb.crm.utils.Md5Util;
import com.msb.crm.utils.PhoneUtil;
import com.msb.crm.utils.UserIDBase64;
import com.msb.crm.vo.User;
import com.msb.crm.vo.UserRole;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class UserService extends BaseService<User, Integer> {
    @Resource
    private UserMapper userMapper;
    @Resource
    private UserRoleMapper userRoleMapper;

    public UserModel userLogin(String userName, String userPwd) {
        //1.参数判断，判断用户姓名、用户密码非空
        checkLoginParams(userName, userPwd);

        //2.调用数据访问层，通过用户名查询用户记录，返回用户对象
        User user = userMapper.queryUserByUserName(userName);

        //3.判断用户对象是否为空
        AssertUtil.isTrue(user == null, "用户姓名不存在！");

        //4.判断密码是否正确，比较客户端传递的数据密码与数据库中查询的用户对象中的用户密码
        checkUserPwd(userPwd, user.getUserPwd());
        //返回构建用户对象
        return buildUserInfo(user);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void updatePassword(Integer userId, String oldPwd, String newPwd, String repeatPwd) {
        //通过用户ID查询用户记录，返回用户对象
        User user = userMapper.selectByPrimaryKey(userId);
        //判断用户记录是否存在
        AssertUtil.isTrue(null == user, "待更新记录不存在！");
        //参数校验
        checkPasswordParams(user, oldPwd, newPwd, repeatPwd);
        //设置用户的新密码
        user.setUserPwd(Md5Util.encode(newPwd));
        //执行更新，判断受影响的行数
        AssertUtil.isTrue(userMapper.updateByPrimaryKeySelective(user) < 1, "修改密码失败！");
    }

    //修改密码的参数校验：
    private void checkPasswordParams(User user, String oldPwd, String newPwd, String repeatPwd) {
        //判断原始密码是否为空
        AssertUtil.isTrue(StringUtils.isBlank(oldPwd), "原始密码不能为空！");
        //判断原始密码是否正确 (查询的用户对象中的用户密码是否与原始密码一致)
        AssertUtil.isTrue(!user.getUserPwd().equals(Md5Util.encode(oldPwd)), "原始密码不正确");
        //判断新密码是否为空
        AssertUtil.isTrue(StringUtils.isBlank(newPwd), "新密码不能为空！");
        //判断新密码是否与原始密码一致 (不允许新密码与原始密码一致)
        AssertUtil.isTrue(oldPwd.equals(newPwd), "新密码不能与原始密码相同！");
        //判断确认密码是否为空
        AssertUtil.isTrue(StringUtils.isBlank(repeatPwd), "确认密码不能为空！");
        //判断确认密码是否与新密码一致
        AssertUtil.isTrue(!newPwd.equals(repeatPwd), "确认密码与新密码不一致！");
    }


    private UserModel buildUserInfo(User user) {
        UserModel userModel = new UserModel();
        //设置加密的用户ID
        userModel.setUserIdStr(UserIDBase64.encoderUserID(user.getId()));
//            userModel.setUserIdStr("10");
        userModel.setUserName(user.getUserName());
        userModel.setTrueName(user.getTrueName());
        return userModel;
    }

    private void checkUserPwd(String userPwd, String Pwd) {
        //将客户端传递的密码加密
        userPwd = Md5Util.encode(userPwd);
        //判断密码是否相等
        AssertUtil.isTrue(!userPwd.equals(Pwd), "用户密码不正确！");

    }

    private void checkLoginParams(String userName, String userPwd) {
        //验证用户姓名
        AssertUtil.isTrue(StringUtils.isBlank(userName), "用户姓名不能为空");
        //验证用户密码
        AssertUtil.isTrue(StringUtils.isBlank(userPwd), "用户密码不能为空");
    }

    public List<Map<String, Object>> queryAllSales() {
        return userMapper.queryAllSales();
    }

    /**
     * 添加用户
     * 1.参数校验
     * 用户名userName     非空，且唯一
     * 邮箱email          非空
     * 手机号phone        非空，格式正确
     * 2.设置参数的默认值
     * isValid           1
     * createDate        系统当前时间
     * updateDate        系统当前时间
     * 默认密码            123->md5加密
     * 3.执行添加操作，判断受影响的行数
     *
     * @param user
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addUser(User user) {
        /* 1.参数校验 */
        checkUserParams(user.getUserName(), user.getEmail(), user.getPhone(), null);
        /* 2.设置参数的默认值 */
        user.setIsValid(1);
        user.setCreateDate(new Date());
        user.setUpdateDate(new Date());
        // 设置默认密码
        user.setUserPwd(Md5Util.encode("123456"));
        /* 3.执行添加操作，判断受影响的行数 */
        AssertUtil.isTrue(userMapper.insertSelective(user) < 1, "用户添加失败！");

        /**
         * 用户角色关联
         *   用户ID   userId
         *   角色ID   roleIds
         */
        relationUserRole(user.getId(), user.getRoleIds());
    }

    /**
     * 用户角色关联
     * 添加操作
     *   原始角色不存在
     *      1.不添加新的角色记录         不操作用户角色表
     *      2.添加新的角色记录           给指定用户绑定相关的角色记录
     * 更新操作
     *   原始角色不存在
     *   原始角色存在
     * 角色分配：判断用户对应的角色记录存在，先将用户原有的角色记录删除，添加新的角色记录
     * 删除操作
     *    删除指定用户绑定的角色记录
     */
    private void relationUserRole(Integer userId, String roleIds) {
        //通过用户ID查询角色记录
        Integer count = userRoleMapper.countUserRoleByUserId(userId);
        //判断角色记录是否存在
        if (count > 0) {
            //如果角色记录存在，则删除该用户对应的角色记录
            AssertUtil.isTrue(userRoleMapper.deleteUserRoleByUserId(userId) != count, "用户角色分配失败！");
        }

        //判断角色ID是否存在，如果存在，则添加该用户对应的角色记录
        if (StringUtils.isNotBlank(roleIds)) {
            //将用户角色数据设置到集合中，执行批量添加
            List<UserRole> userRoleList = new ArrayList<>();
            //将角色ID字符串转换成数组
            String[] roleIdsArray = roleIds.split(",");
            //遍历数组，得到对应的用户角色对象，并设置到集合中
            for (String roleId : roleIdsArray) {
                UserRole userRole = new UserRole();
                userRole.setRoleId(Integer.parseInt(roleId));
                userRole.setUserId(userId);
                userRole.setCreateDate(new Date());
                userRole.setUpdateDate(new Date());
                //设置到集合中
                userRoleList.add(userRole);
            }
            //批量添加用户角色记录
            AssertUtil.isTrue(userRoleMapper.insertBatch(userRoleList) != userRoleList.size(), "用户角色分配失败！");
        }
    }


    /**
     * 更新用户
     * 1.参数校验
     * 判断用户ID是否为空，且数据存在
     * 用户名userName     非空，且唯一
     * 邮箱email          非空
     * 手机号phone        非空，格式正确
     * 2.设置参数的默认值
     * updateDate        系统当前时间
     * 3.执行添加操作，判断受影响的行数
     *
     * @param user
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateUser(User user) {
        //判断用户ID是否为空，且数据存在
        AssertUtil.isTrue(null == user.getId(), "待更新记录不存在！");
        //通过ID查询数据
        User temp = userMapper.selectByPrimaryKey(user.getId());
        //判断是否存在
        AssertUtil.isTrue(null == temp, "待更新记录不存在！");
        //参数校验
        checkUserParams(user.getUserName(), user.getEmail(), user.getPhone(), user.getId());

        //设置默认值
        user.setUpdateDate(new Date());

        //执行更新操作，判断受影响的行数
        AssertUtil.isTrue(userMapper.updateByPrimaryKeySelective(user) != 1, "用户更新失败！");

        /**
         * 用户角色关联
         *   用户ID   userId
         *   角色ID   roleIds
         */
        relationUserRole(user.getId(), user.getRoleIds());
    }


    /**
     * 参数校验
     *
     * @param userName 用户名userName     非空，且唯一
     * @param email    邮箱email          非空
     * @param phone    手机号phone        非空，格式正确
     */
    private void checkUserParams(String userName, String email, String phone, Integer userId) {
        //判断用户名是否为空
        AssertUtil.isTrue(StringUtils.isBlank(userName), "用户名不能为空！");
        //判断用户名的唯一性    通过用户名查询用户对象
        User temp = userMapper.queryUserByUserName(userName);
        // 如果用户对象为空，则表示用户名可用；如果用户对象不为空，则表示用户名不可用
        // 如果是添加操作，数据库中无数据，只要通过名称查到数据，则表示用户名被占用
        // 如果是修改操作，数据库中有对应的记录，通过用户名查到数据，可能是当前记录本身，也可能是别的记录
        // 如果用户名存在，且与当前修改记录不是同一个，则表示其他记录占用了该用户名，不可用
        AssertUtil.isTrue(null != temp && !(temp.getId().equals(userId)), "用户名已存在，请重新输入！");
        //邮箱 非空
        AssertUtil.isTrue(StringUtils.isBlank(email), "用户邮箱不能为空！");
        // 手机号 非空 格式正确
        AssertUtil.isTrue(StringUtils.isBlank(phone), "用户手机号不能为空！");
        // 手机号 格式判断
        AssertUtil.isTrue(!PhoneUtil.isMobile(phone), "手机号格式不正确！");
    }

    /**
     * 用户删除
     *
     * @param ids
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteByIds(Integer[] ids) {
        //判断ids是否为空，长度是否大于0
        AssertUtil.isTrue(ids == null || ids.length == 0, "待删除记录不存在！");
        //执行删除操作，判断受影响的行数
        AssertUtil.isTrue(userMapper.deleteBatch(ids) != ids.length, "用户删除失败！");

        //遍历用户ID的数组
        for (Integer userId : ids) {
            //通过用户ID查询对应的用户角色记录
            Integer count = userRoleMapper.countUserRoleByUserId(userId);
            //判断用户角色记录是否存在
            if (count > 0) {
                //通过用户ID删除对应的用户角色记录
                AssertUtil.isTrue(userRoleMapper.deleteUserRoleByUserId(userId) != count, "删除用户角色失败！");
            }
        }
    }


    /**
     * 查询所有的客户经理
     * @return
     */
    public List<Map<String, Object>> queryAllCustomerManager() {
        return userMapper.queryAllCustomerManager();
    }
}
