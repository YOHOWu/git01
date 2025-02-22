package com.msb.crm.service;

import com.msb.crm.base.BaseService;
import com.msb.crm.dao.ModuleMapper;
import com.msb.crm.dao.PermissionMapper;
import com.msb.crm.dao.RoleMapper;
import com.msb.crm.utils.AssertUtil;
import com.msb.crm.vo.Permission;
import com.msb.crm.vo.Role;
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
public class RoleService extends BaseService<Role, Integer> {
    @Resource
    private RoleMapper roleMapper;
    @Resource
    private PermissionMapper permissionMapper;
    @Resource
    private ModuleMapper moduleMapper;

    /**
     * 查询所有的角色列表
     *
     * @return
     */
    public List<Map<String, Object>> queryAllRoles(Integer userId) {
        return roleMapper.queryAllRoles(userId);
    }

    /**
     * 添加角色
     * 1.参数校验
     * 角色名称    非空，名称唯一
     * 2.设置参数的默认值
     * 是否有效
     * 创建时间
     * 修改时间
     * 3.执行添加操作，判断受影响的行数
     *
     * @param role
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addRole(Role role) {
        /* 1.参数校验 */
        AssertUtil.isTrue(StringUtils.isBlank(role.getRoleName()), "角色名称不能为空！");
        //通过角色名称查询角色记录
        Role temp = roleMapper.selectByRoleName(role.getRoleName());
        //判断角色记录是否存在(添加操作时，如果角色记录存在则表示名称不可用)
        AssertUtil.isTrue(temp != null, "角色名称已存在，请重新输入！");

        /* 2.设置参数的默认值 */
        role.setIsValid(1);
        role.setCreateDate(new Date());
        role.setUpdateDate(new Date());

        /* 3.执行添加操作，判断受影响的行数 */
        AssertUtil.isTrue(roleMapper.insertSelective(role) < 1, "角色添加失败！");
    }

    /**
     * 修改角色信息
     * 1.参数校验
     * 角色ID        非空，且数据存在
     * 角色名称       非空，名称唯一
     * 2.设置参数的默认值
     * 修改时间
     * 3.执行更新操作，判断受影响的行数
     *
     * @param role
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateRole(Role role) {
        /* 1.参数校验 */
        //角色ID      非空，且数据存在
        AssertUtil.isTrue(null == role.getId(), "待更新记录不存在！");
        //通过角色ID查询角色记录
        Role temp = roleMapper.selectByPrimaryKey(role.getId());
        //判断角色记录是否存在
        AssertUtil.isTrue(null == temp, "待更新记录不存在");

        //角色名称      非空，名称唯一
        AssertUtil.isTrue(StringUtils.isBlank(role.getRoleName()), "角色名称不能为空！");
        //通过角色名称查询角色记录
        temp = roleMapper.selectByRoleName(role.getRoleName());
        //判断角色记录是否存在（如果不存在，表示可使用；如果存在，且角色ID与当前更新的角色ID不一致，表示角色名称不可用）
        AssertUtil.isTrue(null != temp && (!temp.getId().equals(role.getId())), "角色名称已存在，不可使用！");

        /* 2.设置参数的默认值 */
        role.setUpdateDate(new Date());

        /* 3.执行更新操作，判断受影响的行数 */
        AssertUtil.isTrue(roleMapper.updateByPrimaryKeySelective(role) < 1, "修改角色失败！");
    }

    /**
     * 删除角色
     * 1.删除角色
     * 角色ID        非空，数据存在
     * 2.设置相关参数的默认值
     * 是否有效       0(删除记录)
     * 修改时间       系统默认时间
     * 3.执行更新操作，判断受影响的行数
     *
     * @param roleId
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteRole(Integer roleId) {
        //判断角色ID是否为空
        AssertUtil.isTrue(null == roleId, "待删除记录不存在！");
        //通过角色ID查询角色记录
        Role role = roleMapper.selectByPrimaryKey(roleId);
        //判断角色记录是否存在
        AssertUtil.isTrue(null == role, "待删除记录不存在！");

        //设置删除状态
        role.setIsValid(0);
        role.setUpdateDate(new Date());

        //执行更新操作
        AssertUtil.isTrue(roleMapper.updateByPrimaryKeySelective(role)<1,"角色删除失败！");
    }

    /**
     * 角色授权
     *   将对应的角色ID与资源ID添加到对应的权限表中
     *      直接添加权限不合适，会出现重复的权限数据（执行修改或删除权限时）
     *      推荐使用：
     *          先将已有的权限记录删除，再将需要设置的权限记录添加
     *          1.通过角色ID查询对应的的权限记录
     *          2.如果权限记录存在，则删除对应的角色拥有的权限记录
     *          3.如果有权限记录，则添加权限记录（批量添加）
     * @param roleId
     * @param mIds
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addGrant(Integer roleId, Integer[] mIds) {
        //1.通过角色ID查询对应的权限记录
        Integer count=permissionMapper.countPermissionByRoleId(roleId);
        //2.如果权限记录存在，则删除对应的角色拥有的权限记录
        if (count>0){
            //删除权限记录
            permissionMapper.deletePermissionByRoleId(roleId);
        }
        //3.如果有权限记录，则添加权限记录
        if (mIds!=null && mIds.length>0){
            //定义Permission集合
            List<Permission> permissionList=new ArrayList<>();

            //遍历资源ID数组
            for (Integer mId:mIds){
                Permission permission=new Permission();
                permission.setModuleId(mId);
                permission.setRoleId(roleId);
                permission.setAclValue(moduleMapper.selectByPrimaryKey(mId).getOptValue());
                permission.setCreateDate(new Date());
                permission.setUpdateDate(new Date());
                //将对象设置到集合中
                permissionList.add(permission);
            }

            //执行批量添加操作，判断受影响的行数
            AssertUtil.isTrue(permissionMapper.insertBatch(permissionList)!=permissionList.size(),"角色授权失败！");
        }
    }
}
