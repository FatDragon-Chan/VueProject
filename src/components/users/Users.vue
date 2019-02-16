<template>
  <div>
    <!-- 1.0 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-breadcrumb level1="用户管理" level2="用户列表"></my-breadcrumb>
    <!-- 2.0 搜索框 & 添加用户按钮 -->
    <el-input
      class="search"
      placeholder="请输入要搜索的内容"
      v-model="query"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
      ></el-button>
    </el-input>
    <el-button
      style="margin-left:5px;"
      type="success"
      plain
      @click="dialogVisible4Add = true"
    >添加用户</el-button>
    <!-- 3.0 用户列表 -->
    <el-table
      :data="userList"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="100"
      >
        <template slot-scope="scope">
          <!-- scope.row 就拿到当前遍历的那一行数据 -->
          <el-switch @change="changeState(scope.row.mg_state,scope.row.id)" v-model="scope.row.mg_state">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" >
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="queryUser(scope.row.id)"
            plain
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="deleteUser(scope.row.id)"
            plain
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-check"
            type="warning"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.0 分页条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 5.0 新增用户的对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogVisible4Add"
      width="50%"
    >
      <el-form
        :model="addUserObj"
        :rules="rules"
        ref="addUserRef"
        label-width="100px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addUserObj.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            v-model="addUserObj.password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addUserObj.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="addUserObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 5.0 编辑用户的对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogVisible4Edit"
      width="50%"
    >
      <el-form
        :model="editUserObj"
        :rules="rules"
        ref="addUserRef"
        label-width="100px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input disabled v-model="editUserObj.username"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editUserObj.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="editUserObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible4Edit = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
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
  data() {
    return {
      query: '', // 查询关键字
      pagenum: 1, // 页码
      pagesize: 5, // 每页显示多少条
      userList: [], // 用户列表
      total: 0, // 总条数
      dialogVisible4Add: false, //刚开始是隐藏
      dialogVisible4Edit:false,// 编辑用户界面刚开始也是隐藏的
      addUserObj: {
        // 添加用户
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserObj:{
         // 编辑用户
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  // 当Users组件的实例创建完成之后，会自动执行该函数
  created() {
    this.getUserListData()
  },
  methods: {
    // 发送请求，获取用户列表数据
    getUserListData() {
      /**
       * 参数1：url
       * 参数2：url的参数 & 请求头
       */
      this.$axios
        .get(`users`, {
          // url参数
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            query: this.query
          }
          /* ,
          // 请求头
          headers: {
            // Authorization 固定的，后台要求的
            Authorization: localStorage.getItem('mytoken')
          }*/
        }
        )
        .then(res => {
          //赋值给模型
          this.userList = res.data.data.users

          //赋值总条数
          this.total = res.data.data.total
        })
    },
    // 当页面改变的时候，触发
    handleSizeChange(pagesize) {
      this.pagesize = pagesize

      this.getUserListData()
    },
    // 当前页面发生改变的时候，触发
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum

      this.getUserListData()
    },
    // 新增用户
    addUser() {
      // 拿到el-form这个表单
      this.$refs.addUserRef.validate(valid => {
        if (valid) {
          // 验证通过
          
      this.$axios
            .post(`users`, this.addUserObj
            /* , {
              // 请求头
              headers: {
                // Authorization 固定的，后台要求的
                Authorization: localStorage.getItem('mytoken')
              }
            } */
            )
            .then(res => {
              if (res.data.meta.status === 201) {
                // 隐藏对话框
                this.dialogVisible4Add = false

                // 提示
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })

                // 重新查询列表
                this.getUserListData()
              }
            })
        }
      })
    },
    // 编译用户状态是否被禁用
    changeState(state,uid){
      this.$axios.put(`users/${uid}/state/${state}`).then(response=>{
        if(response.data.meta.status == 200){
          // 修改成功 提醒并刷新页面
          this.$message({
            message: response.data.meta.msg,
            type: 'success'
          });
        }
      })
    },
    // 查询用户信息
    queryUser(uid){
      this.$axios.get(`users/${uid}`).then(response=>{
        if(response.status==200){
          this.editUserObj = response.data.data  
          this.dialogVisible4Edit=true
        }
      })
    },
    // 编辑用户信息
    editUser(){
      this.$axios.put(`users/${this.editUserObj.id}`,this.editUserObj).then(response=>{
        if(response.status==200){
          this.$message({
            message: response.data.meta.msg,
            type: 'success'
          })

          // 关闭对话框
          this.dialogVisible4Edit = false

          // 刷新列表
          this.getUserListData()
        }
      })
      
    },
    // 删除单个用户
    deleteUser(uid){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`users/${uid}`).then(response=>{
            if(response.data.meta.status ===200){
              this.$message({
                message:response.data.meta.msg,
                type: 'success'
              });

              this.getUserListData()
            }
          })
        }).catch(()=>{
          // 取消了
        });
    }
  }
}
</script>

<style scoped>

.el-pagination {
  background-color: #d3dce6;
  padding-top: 10px;
  height: 35px;
  line-height: 35px;
}
.search {
  width: 300px;
}
</style>

