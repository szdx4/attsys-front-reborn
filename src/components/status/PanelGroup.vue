<template>
  <el-row class="panel-group">
    <el-col
      v-for="(item, index) in data"
      :span="6"
      :key="index"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper" :class="getIconClass(index)">
          <i :class="item.icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ item.title }}</div>
          <count-to
            :start-val="0"
            :end-val="item.count"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'PanelGroup',
  components: { countTo },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    getIconClass (index) {
      return 'icon-' + index
    }
  }
}
</script>

<style lang="scss">
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    margin-left: 10px;
    margin-right: 10px;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-0 {
        background: #40c9c6;
      }
      .icon-1 {
        background: #36a3f7;
      }
      .icon-2 {
        background: #f4516c;
      }
      .icon-3 {
        background: #34bfa3;
      }
    }
    .icon-0 {
      color: #40c9c6;

      i {
        font-size: 48px;
      }
    }
    .icon-1 {
      color: #36a3f7;

      i {
        font-size: 48px;
      }
    }
    .icon-2 {
      color: #f4516c;

      i {
        font-size: 48px;
      }
    }
    .icon-3 {
      color: #34bfa3;

      i {
        font-size: 48px;
      }
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
