<template>
  <div class="container-water-fall">
    <waterfall :col="col" :data="list">
      <template>
        <div v-for="(item, index) in list" :key="index" class="cell-item">
          <img :lazy-src="item.url" alt="无法加载">
          <div class="item-body">
            <div class="item-footer">
              <div class="item-title">
                {{ item.name }}
              </div>
              <div class="item-del">
                <el-button type="text" icon="el-icon-delete" circle @click="deleteImage(item)" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </waterfall>
  </div>
</template>

<script>
import {deleteOss } from '@/api/system/oss'
export default {
  props: {
    // 图片数据
    list: {
      type: Array,
      default: () => []
    },
    // 定义列数
    col: {
      type: Number,
      default: 8
    }
  },
  updated(){
    console.log('imageList',this.list);
  },
  methods: {
    deleteImage(val) {
      this.$confirm(
        '是否确认删除"' + val.name,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteOss(val.ossId);
        })
        .then(() => {
          this.$emit('changeList')
          this.$message.success("删除成功");
        })
        .catch(() => {});
    }
  }
}
</script>
<style lang="scss" scoped>
.item-body {
   margin: 5px;
  .item-footer {
    display: flex;
    justify-content: space-between;
    .item-title {
      display: flex;
      align-items: center;
      font-size: 13px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
    .item-del {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
.cell-item {
  width: 100%;
  margin-bottom: 6px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>
