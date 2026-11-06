<template>
  <srm-popup
    :visible="value"
    :title="subTitle"
    @onClose="$emit('input',false)">
    <div class="prequalification-detail">
      <div>
        <ul v-if="supplierAssignInfo.length">
          <li v-for="(itemA,index) in supplierAssignInfo" :key="index">
            <!-- 供应商 -->
            <div v-if="dateType==='supplier'" class="supplier-detail">
              <customize :columns="getSupplierAssignColumns" :data-source="itemA"/>
            </div>
          </li>
        </ul>
        <ul v-else-if="expertsAssignInfo.length">
          <li v-for="(itemB,index) in expertsAssignInfo" :key="index">
            <!-- 专家 -->
            <customize :columns="getExpertsAssignColumns" :data-source="itemB"/>
          </li>
        </ul>
        <no-content v-else img-src="NoResult@3x.png" />
      </div>
    </div>
  </srm-popup>
</template>

<script>
import NoContent from "@/components/NoContent";
export default {
  modules: [ "ssrc.bidHall", "hipspfm.expertScoring" ],
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
    supplierAssignInfo: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      item: {},
    };
  },
  computed:{
    subTitle() {
      return this.dateType === "supplier" ? this.$T("ssrc.bidHall.view.message.button.viewSupplier").$D("查看供应商") : this.$T("ssrc.bidHall.model.bidHall.assignExpert").$D("分配专家");
    },
    getExpertsAssignColumns() {
      const columns = [
        {
          fieldCode: "expertName",
          fieldType:"EMPTY",
          render:(val, record) => <div class="expert-detail">
            <span
              class={record.assignFlag ? "expert-tag" : "expert-tag active"}>{record.assignFlag ? this.$T("hipspfm.expertScoring.view.message.assigned").$D("已分配") : this.$T("hipspfm.expertScoring.view.message.unAssigned").$D("未分配")}</span>
            <span class="expert-name">{ val }</span>
            <span class="expert-code">({record.loginName})</span>
          </div>
        },
      ];

      return columns;
    },
    getSupplierAssignColumns() {
      const columns = [
        {
          fieldCode: "expertName",
          fieldType:"EMPTY",
          render:(val, record) => <div>
            <div class="supplier-name noWrap">{record.supplierCompanyName}</div>
            <span
              class="supplier-tag">{record.assignFlag ? this.$T("hipspfm.expertScoring.view.message.assigned").$D("已分配") : this.$T("hipspfm.expertScoring.view.message.unAssigned").$D("未分配")}</span>
            <span class="supplier-code">{record.supplierCompanyNum}</span>
          </div>
        },
      ];

      return columns;
    }
  },
  mounted() {
  }
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

.sub-title {
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding-left: 20px;
  font-weight: bold;
  font-size: 24px;
  color:var(--color-font-default);
  margin-bottom: 8px;
}

.prequalification-detail {
  padding-bottom: 80px;
  height: calc(100vh - 50px);
  overflow: auto;

  ul {
    li {
      border-bottom:1px solid var(--color-border-default);
      margin-left: 20px;
      padding: 15px 20px 15px 0;

      .supplier-name {
        width: 335px;
        font-size: 16px;
        color:var(--color-font-default);
        letter-spacing: 0;
        line-height: 26px;
      }

      .supplier-tag, .expert-tag {
        display: inline-block;
        padding: 0 4px;
        background:var(--color-bg-default-c);
        border-radius: 2px;
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
      }

      .active {
        color:var(--color-font-default-c);
        background:var(--color-bg-default-d,rgba(65,70,96,0.1)) ;
      }

      .supplier-code, .expert-name, .expert-code {
        margin-left: 8px;
        font-size: 14px;
        color:var(--color-font-default-b);
        line-height: 22px;
      }

      .expert-name, .expert-code {
        font-size: 16px;
        color:var(--color-font-default);
      }
    }
  }
}

.handler-bottom {
  width: 100%;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  font-weight: bold;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  text-align: center;
  z-index: 555;
}
</style>
