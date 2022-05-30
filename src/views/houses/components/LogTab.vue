<template>
  <log-list
    ref="log-list"
    typeId="40"
    :sourceId="id"
    :params="{projectId: id}"
  ></log-list>
</template>

<script>
import { LogList } from '@/components'
export default {
  components: {
    LogList
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  }
}
</script>

<style></style>
