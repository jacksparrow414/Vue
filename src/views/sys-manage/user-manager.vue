<template>
  <div class="app-container">
    <div class="filter-container" />
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="index" align="center" width="80" />
      <el-table-column label="name" />
    </el-table>
  </div>
</template>
<script>
  import { createArticle, fetchList, fetchPv, updateArticle } from '@/api/article'
  // waves directive
  import { parseTime } from '@/utils'
  // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'UserManage',
  data() {
    return {
      list: null
    }
  }
}
</script>
