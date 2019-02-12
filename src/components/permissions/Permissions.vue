<template>
  <div>
    <!-- 1.0 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.0 权限列表 -->
    <el-table :data="permissionsList" border style="width: 100%">
      <el-table-column prop="id" label="#" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级" width="180"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
        permissionsList:[]
    }
  },
  created() {
    this.getPermissionsListData()
  },
  methods:{
      getPermissionsListData(){
          this.$axios.get(`rights/list`).then(response=>{
              console.log(response);
              if(response.status ===200){
                  this.permissionsList = response.data.data
                  console.log(this.permissionsList);
              }
          })
      }
  }
}
</script>

<style>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
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
