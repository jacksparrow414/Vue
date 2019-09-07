<script>
export default {
  beforeCreate() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    console.log('daskjfadfsfasdjfaidfadnfasdjfnasdfahsdjfeuwiue')
    return h() // avoid warning message
  }
}
</script>
