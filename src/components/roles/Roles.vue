<template>
  <div>
    <!-- 1.0 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb> -->
     <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <!-- 2.0 添加角色按钮 -->
    <el-button type="success" @click="dialogVisible4Add=true" plain>添加角色</el-button>
    <!-- 3.0 角色列表 -->
    <el-table
    :data="roleList"
    style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="scope">
                
                <el-row v-for="item in scope.row.children" :key="item.id">
                    <el-col :span="3">
                        <el-tag
                            @close="deletePermission(scope.$index,scope.row.id,item.id)"
                            :key="item.id"
                            closable>    
                            {{ item.authName }}
                        </el-tag>
                        <i v-if="item.children.length>0" class="el-icon-arrow-right arrow"></i>
                    </el-col>
                    <el-col :span="21">
                        <el-row v-for="subItem in item.children" :key="subItem.id">
                            <el-col :span="4">
                                <el-tag
                                    @close="deletePermission(scope.$index,scope.row.id,subItem.id)"
                                    :key="subItem.id"
                                    type="success"
                                    closable>    
                                    {{ subItem.authName }}
                                </el-tag>
                                 <i v-if="subItem.children.length>0" class="el-icon-arrow-right arrow"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag
                                    @close="deletePermission(scope.$index,scope.row.id,thirdItem.id)"
                                    class="thirdItem"
                                    v-for="thirdItem in subItem.children"
                                    :key="thirdItem.id"
                                    closable
                                    type="warning">
                                    {{thirdItem.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column
        type="index"
        width="50"
        ></el-table-column>
        <el-table-column
        label="角色名称"
        prop="roleName"
        width="180"
        ></el-table-column>
        <el-table-column
        label="角色描述"
        prop="roleDesc"
        width="400"
        ></el-table-column>
        <el-table-column
        label="操作"
        >
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="queryRole(scope.row.id)" size="small" plain></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)" size="small" plain></el-button>
                <el-button type="warning" icon="el-icon-check" size="small" @click="queryRights(scope.row)" plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 4.0添加角色对话框 -->
    <el-dialog
    title="添加角色"
    :visible.sync="dialogVisible4Add"
    width="30%"
    >
        <el-form :model="addRoleObj" :rules="rules" ref="addRoleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRoleObj.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRoleObj.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Add = false">取 消</el-button>
            <el-button type="primary" @click="addRole()">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 5.0编辑角色对话框 -->
    <el-dialog
    title="编辑角色"
    :visible.sync="dialogVisible4Edit"
    width="30%"
    >
        <el-form :model="editRoleObj" :rules="rules" ref="editRoleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRoleObj.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRoleObj.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Edit = false">取 消</el-button>
            <el-button type="primary" @click="editRole()">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 6.0角色赋权对话框 -->
    <el-dialog
    title="赋权角色"
    :visible.sync="dialogVisible4Rights"
    width="50%"
    >
        <el-tree
            ref="grantTreeRef"
            :data="rightsList" 
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="checkedKeys"
            :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Rights = false">取 消</el-button>
            <el-button type="primary" @click="submitRights()">确 定</el-button>
        </span>
    </el-dialog>



  </div>
</template>

<script>
import myBreadCrumb from '../subComponents/chanBreadcrumb.vue'
export default {
  components:{
    'my-breadcrumb':myBreadCrumb
  },
    data(){
        return {
            roleList:[],
            dialogVisible4Add:false, // 添加角色对话框标识符,
            dialogVisible4Edit:false, // 编辑角色对话框标识符
            dialogVisible4Rights:false, // 角色赋权对话框标识符
            addRoleObj:{
                roleName:'',
                roleDesc:''
            },
            editRoleObj:{

            },
            rules:{
                roleName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ]
            },
            rightsList:[], // 存储树状角色列表数据
            checkedKeys:[], // 存储该角色已赋权的角色列表id,三级权限id  
            defaultProps: { // 配置对应关系
                children: 'children',
                label: 'authName'
            },
            roleId:'' // 存储角色id
        }
    },
    created(){
        this.getRoleList()
    },
    methods:{
        // 获取角色列表
        getRoleList(){
            this.$axios.get('roles').then(res=>{
                this.roleList=res.data.data
            })
        },
        // 添加角色
        addRole(){
            console.log(1111);
            // 验证表单是否填写完整
            console.log(this.$refs.roleForm);
            this.$refs.addRoleForm.validate(valid=>{
                if(valid){
                    this.$axios.post('roles',this.addRoleObj).then(res=>{
                        this.$message({
                            message: res.data.meta.msg,
                            type: 'success'
                        });
                        
                        this.dialogVisible4Add = false;

                        this.getRoleList();

                    })
                }
            })
        },
        // 查询角色
        queryRole(id){
            this.$axios.get(`roles/${id}`).then(res=>{
                this.editRoleObj = res.data.data
                this.dialogVisible4Edit = true
            })
        },
        // 编辑角色
        editRole(){
            this.$refs.editRoleForm.validate(valid=>{
                if(valid){
                    this.$axios.put(`roles/${this.editRoleObj.roleId}`,this.editRoleObj).then(res=>{
                        if(res.data.meta.status ===200){
                            this.$message({
                            message: res.data.meta.msg,
                            type: 'success'
                            });
                        
                            this.dialogVisible4Edit = false;

                            this.getRoleList();
                        }
                    })
                }
            })
        },
        // 删除角色
        deleteRole(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '警告!', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            this.$axios.delete(`roles/${id}`).then(res=>{
                if(res.data.meta.status ===200){
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                });

                    this.getRoleList();
                }
            })
            
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 删除指定角色权限
        deletePermission(index,roleId,rightsId){
            this.$axios.delete(`roles/${roleId}/rights/${rightsId}`).then(res=>{
                this.$message({message:res.data.meta.msg,type:'success'})
                this.roleList[index].children=res.data.data
            })
        },
        // 查询角色赋权
        queryRights(role){
            this.roleId = role.id
            this.checkedKeys = []
            
            if(role.children && role.children.length > 0){
                role.children.forEach(subrole=>{
                    if(subrole.children && subrole.children.length > 0){
                        subrole.children.forEach(thirdrole=>{
                            if(thirdrole.children && thirdrole.children.length > 0){
                                thirdrole.children.forEach(Last=>{
                                    this.checkedKeys.push(Last.id)
                                })
                            }
                        })
                    }
                })
            }

            this.$axios.get('rights/tree').then(res=>{
                this.rightsList = res.data.data
                this.dialogVisible4Rights = true;
            })
        },
        // 提交修改角色赋权
        submitRights(){

            // 获取所有被选中的节点id
            const checkedKeysList = this.$refs.grantTreeRef.getCheckedKeys();
            // console.log(checkedKeysList);

            // 获取所有被半选中的节点id
            const halfCheckedKeysList = this.$refs.grantTreeRef.getHalfCheckedKeys();
            // console.log(halfCheckedKeysList);

            // 合并两个节点id
             const lastKeys = checkedKeysList.concat(halfCheckedKeysList);
            //  console.log(lastKeys);

             // 这是最终需要提交给后台的字符串（里面包含选中和半选中的key）
            const rids = lastKeys.join(',')
            // console.log(rids);
            
            // 给角色赋权
            this.$axios.post(`roles/${this.roleId}/rights`,{rids}).then(res=>{
                console.log(res);
                if(res.data.meta.status===200){
                    this.$message({message:res.data.meta.msg,type:'success'})

                    this.dialogVisible4Rights = false

                    this.getRoleList()
                }
            })
            

        }
    }
}
</script>



<style scoped>
.el-tag {
  margin-left: 5px;
  margin-top:5px;
}
.authlist {
  border-top: solid 1px #d3dce6;
  padding-bottom: 5px;
}
.arrow {
  font-size: 16px;
  font-weight: bold;
}
</style>