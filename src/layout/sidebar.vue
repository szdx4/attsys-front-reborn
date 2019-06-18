<template>
  <aside class="menu-expanded">
    <el-menu
      :default-active="activeMenu"
      :unique-opened="true"
      router
      mode="vertical"
      background-color="#434343"
    >
      <item v-for="route in this.routes" :key="route.path" :item="route"></item>
    </el-menu>
  </aside>
</template>

<script>
import item from './item'
import { router, filterRoutes } from '@/router'

export default {
  name: 'sidebar',
  components: {
    item
  },
  computed: {
    activeMenu () {
      return this.$route.path
    },
    routes () {
      return filterRoutes(this.$store.getters.user.role, router())
    }
  }
}
</script>

<style lang="scss">
.menu-expanded {
  flex: 0 0 230px;
  width: 230px;

  .el-menu {
    height: 100%;

    .is-active {
      background-color: #1c1c1c !important;
    }
  }
}
</style>
