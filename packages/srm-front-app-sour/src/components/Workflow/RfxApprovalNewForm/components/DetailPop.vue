<template>
  <div class="Detail">
    <!-- 物料/评分要素细项 -->
    <template v-if="type === 'item'">
      <div v-for="(item, index) in list"
           :key="index" class="card-personalized">
        <ul>
          <li>
            <span>
              {{ item.rfxLineItemNum }}：{{ `${item.itemCode} - ${item.itemName}` }}
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

    <!-- 分配物料/分配标段/分配专家 -->
    <template v-if="type === 'distrItem'">
      <div v-for="(item, index) in list"
           :key="index" class="card-distribution">
        <ul>
          <li>
            <p v-if="item.assignFlag" class="distr">{{ $T('hipspfm.expertScoring.view.message.assigned').$D('已分配') }}</p>
            <span>
              {{ `${item.itemCode} - ${item.itemName}` }}
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
    <template v-if="type === 'expert'">
      <div v-for="(item, index) in list"
           :key="index" class="card-distribution">
        <ul>
          <li>
            <p v-if="item.assignFlag" class="distr">{{ $T('hipspfm.expertScoring.view.message.assigned').$D('已分配') }}</p>
            <span>
              {{ `${item.expertName}` }}
            </span>
          </li>
        </ul>
      </div>
    </template>
    <template v-if="type === 'section'">
      <div v-for="(item, index) in list"
           :key="index" class="card-distribution">
        <ul>
          <li>
            <p class="distr">{{ $T('hipspfm.expertScoring.view.message.assigned').$D('已分配') }}</p>
            <span>
              {{ `${item.sectionCode} - ${item.sectionName}` }}
            </span>
          </li>
        </ul>
      </div>
    </template>
    <template v-if="type === 'score'">
      <div v-for="(item, index) in list"
           :key="index" class="card-distribution">
        <ul>
          <li>
            <span>
              {{ `${item.indicateCode} - ${item.indicateName}` }}
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
  modules: [ "hipspfm.expertScoring" ],
  name: "DetailPop",
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
  methods: {
  }
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
