<template>
  <srm-popup
    :title="dateType==='supplier' ? $T('ssrc.bidHall.view.message.button.viewSupplier').$D('查看供应商'): $T('ssrc.bidHall.model.bidHall.assignExpert').$D('分配专家')"
    :visible="value"
    rounded
    height="80%"
    position="bottom"
    @onClose="$emit('input', false)">
    <div>
      <div class="prequalification-detail">
        <ul v-if="dateType==='supplier'">
          <template v-if="supplierAssignInfo.length">
            <li v-for="(item,index) in supplierAssignInfo" :key="index">
              <!-- 供应商 -->
              <div class="supplier-detail">
                <div class="supplier-name noWrap">{{ item.supplierCompanyName }}</div>
                <span
                  class="supplier-tag">{{ $T('hipspfm.expertScoring.view.message.assigned').$D('已分配') }}</span>
                <span class="supplier-code">{{ item.supplierCompanyNum }}</span>
              </div>
            </li>
          </template>
          <no-content v-else img-src="NoResult@3x.png" />
        </ul>
        <ul v-else class="expert-detail">
          <template v-if="expertsAssignInfo.length">
            <li v-for="(item,index) in expertsAssignInfo" :key="index">
              <div>
                <span
                  :class="item.assignFlag?'expert-tag active':'expert-tag'">{{ $T('hipspfm.expertScoring.view.message.assigned').$D('已分配') }}</span>
                <span class="expert-name">{{ item.expertName }}</span>
                <span class="expert-code">({{ item.loginName }})</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </srm-popup>
</template>

<script>
import NoContent from "@/components/NoContent";
export default {
  modules: [ "ssrc.bidHall", "hipspfm.expertScoring", "hipspfm.common" ],
  name: "SupplierInfo",
  components: {
    NoContent,
  },
  props: {
    showMsg: {
      type: Array,
      default: () => []
    },
    value: {
      type: Boolean,
      default: false
    },
    dateType: {
      type: String,
      default: "supplier"
    },
    expertsAssignInfo: {
      type: Array,
      default: () => []
    },
    supplierAssignInfo:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      item: {}
    };
  },
  mounted() {}
};
</script>

<style lang="stylus" scoped>
.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.prequalification-detail {
  padding-bottom: 80px;
  height: calc(100vh - 50px);
  overflow: auto;

  ul {
    li {
      border-bottom: 1px solid var(--color-border-default);
      margin-left: 20px;
      padding: 14px 20px 14px 0;

      .supplier-name {
        width: 335px;
        font-size: 16px;
        color: var(--color-font-default);
        letter-spacing: 0;
        line-height: 26px;
      }

      .supplier-tag, .expert-tag {
        display: inline-block;
        padding: 0 4px;
        background: var(--color-bg-default-c);
        border-radius: 2px;
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
      }

      .active {
        color: var(--color-font-default-c);
        background: var(--color-bg-default-d, rgba(65, 70, 96, 0.1));
      }

      .supplier-code, .expert-name, .expert-code {
        margin-left: 8px;
        font-size: 14px;
        color: var(--color-font-default-b);
        line-height: 22px;
      }

      .expert-name, .expert-code {
        font-size: 16px;
        color: var(--color-font-default);
      }
    }
  }
}
</style>
