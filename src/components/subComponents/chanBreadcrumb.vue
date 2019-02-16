<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props:{
        level1:String,
        level2:String
    }
}
</script>

<style scoped>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
</style>
