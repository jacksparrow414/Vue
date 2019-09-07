<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="name">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'RoleManager',
    data() {
      return {
        list: null
      }
    }
  }
</script>
