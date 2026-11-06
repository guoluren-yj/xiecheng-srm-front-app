<template>
  <div class="Detail">
    <!-- 阶梯报价 -->
    <template v-if="type === 'ladder'">
      <div class="card-distribution">
        <ul>
          <li>
            <span>
              {{ `${customizeInfo.headInfo.itemCode} - ${customizeInfo.headInfo.itemName}` }}
            </span>
          </li>
          <template v-for="(item, index) in list" >
            <customize
              :key="index"
              :columns="customizeInfo.getColumns"
              :data-source="item"
              :code="customizeInfo.code"/>
          </template>
        </ul>
      </div>
    </template>

    <!-- 报价明细 -->
    <template v-if="type === 'quotaion'">
      <div class="card-distribution" style="border-bottom: 10px solid var(--color-border-default);">
        <ul>
          <li>
            <span>
              {{ `${customizeInfo.headInfo.templateNum} - ${customizeInfo.headInfo.templateName}` }}
            </span>
          </li>
          <customize
            :columns="customizeInfo.getHeadColumns"
            :data-source="customizeInfo.headInfo"
            :code="customizeInfo.headCode"/>
        </ul>
      </div>
      <div v-for="(item, index) in list"
           :key="index" class="card-distribution">
        <ul>
          <li>
            <span>
              {{ `${item.configCode} - ${item.configName}` }}
            </span>
          </li>
          <!-- 个性化组件替换后的代码 -->
          <customize
            :columns="customizeInfo.getColumns"
            :data-source="item"
            :code="customizeInfo.code"/>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "DetailLinePop",
  props: {
    list: {
      type: Array
    },
    type: {
      type: String,
    },
    customizeInfo: {
      type: Object
    }
  },
};
</script>

<style lang="stylus" scoped>
.Detail {
  height: 100%;
  position: relative;
  overflow: scroll;
}

.card-personalized {
  width: 100%;
  color: #333333;
  padding 12px 15px;
  background: var(--color-bg-default);
  border-bottom: 1px solid var(--color-border-default);
  border-top: 10px solid var(--color-border-default);
}
.card-distribution {
  width: 100%;
  color: #333333;
  padding 12px 15px;
  background: var(--color-bg-default);
  border-bottom: 1px solid var(--color-border-default);
  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .distr {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #EFF3FE;
      border-radius: 2px;
      width: 44px;
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #276EF1;
      line-height: 20px;
      margin-right: 8px;
    }
  }
}

>>> .customize-item-field{
  color: #333333 !important;
}
</style>
