export default {
  beforeRouteLeave (to, from, next) {
    if (to.matched[1].name !== from.matched[1].name) {
      this.$destroy()
    }
    next()
  }
}
