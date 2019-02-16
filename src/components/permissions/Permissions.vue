<template>
  <div>
    <!-- 1.0 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>    -->  
    <my-breadcrumb  level1="权限管理" level2="权限列表"></my-breadcrumb>

    <!-- 2.0 权限列表 -->
    <el-table :data="permissionsList" border style="width: 100%">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级" :formatter="formatter" width="180"></el-table-column>
    </el-table>
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
        permissionsList:[]
    }
  },
  // created(){}当该组件的实例创建完毕时会执行
  created() {
    this.getPermissionsListData()
  },
  methods:{
      getPermissionsListData(){
          this.$axios.get(`rights/list`).then(response=>{
              if(response.status ===200){
                  this.permissionsList = response.data.data
              }
          })
      },
      formatter(row,column){
        switch(row.level){
          case '0':
            return "一级"
            break;
          case '1':
            return "二级"
            break;
          case '2':
            return "三级"
            break;
        }

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
