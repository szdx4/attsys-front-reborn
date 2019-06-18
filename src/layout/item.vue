<template>
  <div>
    <el-submenu v-if="hasChild(item)" :index="item.path">
      <template slot="title">
        <i :class="item.icon" />
        <span>{{ item.name }}</span>
      </template>
      <el-menu-item
        v-for="child in item.children"
        :key="child.path"
        :index="child.path"
        >
        <i :class="child.icon" />
        <span>{{ child.name }}</span>
      </el-menu-item>
    </el-submenu>

    <el-menu-item v-if="!hasChild(item)" :index="item.path">
      <i :class="item.icon" />
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'item',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    hasChild (item) {
      return item.children.length > 0
    }
  }
}
</script>

<style lang="scss">
.el-menu-item {
  color: #fff !important;
}

.el-submenu__title {
  color: #fff !important;
}
</style>
