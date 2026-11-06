<template>
  <hips-popup
    v-model="value"
    style="height: calc(100vh - 20px); width: 100%; overflow: hidden; border-top-left-radius: 12px; border-top-right-radius: 12px;"
    position="bottom"
    :overlay-on-click-close="false"
    @click-overlay="$emit('input', false)">
    <!-- 导航 -->
    <NavPopHead :title="$T('smbl.common.message.containerDetailInfo').$D('集装箱明细')" :show-pop-head-flag="true" @clickBack="$emit('input',false)" />
    <div ref="content" class="rfxprice-detail">
      <div v-for="(item,index) in summerLinesInfo" :key="index" class="card-personalized">
        <div class="card-first-between">
          <span class="line-code open-tag">
            {{ item.productName }}
          </span>
        </div>
        <!-- 内容区 -->
        <div>
          <Customize :columns="getColumns" :data-source="item" unit-type="Form" />
        </div>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { Popup } from "hips";
import NavHead from "@/components/NavHead";
import NavPopHead from "@/components/NavPopHead";

export default {
  modules: [ "smbl.common","sinv.common" ],
  name: "NoticeSumDetailLinesPop",
  components: {
    NavHead,
    NavPopHead,
    [Popup.name]: Popup,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    summerLinesInfo:{
      type:Array,
      default:()=>[]
    }
  },
  data() {
    return {
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
    };
  },
  computed:{
    getColumns() {
      const columns = [
        {
          fieldName: "本次出运数量",
          fieldCode: "shipmentQuantity",
          langCode: "smbl.common.model.shipmentQuantity",
          formRow: 1,
          formCol: 1
        },
        {
          fieldName: "包装数量",
          fieldCode: "packagesQuantity",
          langCode: "smbl.common.model.packagesQuantity",
          formRow: 1,
          formCol: 2
        },
        {
          fieldName: "尺码",
          fieldCode: "boxSize",
          langCode: "smbl.common.model.boxSize",
          formRow: 2,
          formCol: 1
        },
        {
          fieldName: "颜色",
          fieldCode: "boxColor",
          langCode: "smbl.common.model.boxColor",
          formRow: 2,
          formCol: 2
        },
        {
          fieldName: "箱数",
          fieldCode: "boxQuantity",
          langCode: "smbl.common.model.boxQuantity",
          formRow: 3,
          formCol: 1
        },
        {
          fieldName: "箱规",
          fieldCode: "boxLength",
          langCode: "smbl.common.model.casesOfGauge",
          formRow: 3,
          formCol: 2,
          render: (val,record) => {
            return record.boxLength + "*" + record.boxWidth + "*" + record.boxHeight;
          }
        },
        {
          fieldName: "毛重/kg",
          fieldCode: "grossWeight",
          langCode: "smbl.common.model.grossWeight",
          formRow: 4,
          formCol: 1
        },
        {
          fieldName: "净重/kg",
          fieldCode: "netWeight",
          langCode: "smbl.common.model.netWeight",
          formRow: 4,
          formCol: 2
        },
        {
          fieldName: "体积/m3",
          fieldCode: "volume",
          langCode: "smbl.common.model.volume",
          formRow: 5,
          formCol: 1
        },
        {
          fieldName: "装箱日期",
          fieldCode: "vanningDate",
          langCode: "smbl.common.model.vanningDate",
          formRow: 5,
          formCol: 2,
          render: (val) => {
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "合同行号",
          fieldCode: "lineNumber",
          langCode: "smbl.common.model.contractLineNumber",
          formRow: 6,
          formCol: 1
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          langCode: "smbl.common.model.lineNumber",
          formRow: 6,
          formCol: 2
        },
        {
          fieldName: "采购合同号",
          fieldCode: "contractNumber",
          langCode: "smbl.common.model.contractNumber",
          formRow: 7,
          formCol: 1
        },
        {
          fieldName: "供应商",
          fieldCode: "supplierCompanyName",
          langCode: "sinv.common.model.common.vendorCode",
          formRow: 8,
          formCol: 1
        },
        {
          fieldName: "P0#",
          fieldType: "TEXT",
          fieldCode: "poNum",
          langCode:"smbl.common.model.tag.poNum"
        },
        {
          fieldName: "Customer PO#",
          fieldType: "TEXT",
          fieldCode: "customerPoNum",
          langCode:"smbl.common.model.tag.customerPoNum"
        },
        {
          fieldName: "集装箱柜型",
          fieldType: "TEXT",
          fieldCode: "contractSize",
          langCode:"smbl.common.model.contractSize"
        },
        {
          fieldName: "集装箱封号",
          fieldType: "TEXT",
          fieldCode: "sealNumber",
          langCode:"smbl.common.model.sealNumber"
        },
        {
          fieldName: "船名",
          fieldType: "TEXT",
          fieldCode: "vessel",
          langCode:"smbl.common.model.vessel"
        },
        {
          fieldName: "运编号",
          fieldType: "TEXT",
          fieldCode: "invoiceNumber",
          langCode:"smbl.common.model.invoiceNumber"
        },
        {
          fieldName: "提单号",
          fieldType: "TEXT",
          fieldCode: "billLadingNumber",
          langCode:"smbl.common.model.billLadingNumber"
        },
        {
          fieldName: "装箱地址",
          fieldType: "TEXT",
          fieldCode: "packingAddress",
          langCode:"smbl.common.model.packingAddress"
        },
      ];
      return columns;
    }
  },
  methods: {
  },
};
</script>

<style lang="stylus" scoped>

.rfxprice-detail {
  width: 100%;
  height calc(100vh - 80px);
  overflow-y: auto;

  .card-personalized {
    width: 100%;
    color: #666666;
    padding 12px 15px;
    background: var(--color-bg-default);

    .card-first-single{
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
      padding: 12px 0;
    }

    .card-first-between{
      display: flex;
      justify-content: space-between;
      padding: 12px 0;

      .line-code {
        text-align: left;
        font-size: 16px;
        color: var(--color-font-default, #1b1e2b);
        font-weight: bold;
      }

      .line-num {
        font-size: 14px;
        color: #C6CAD6;
      }
    }
  }
}

>>> .hips-collapse-item__title .right-icon img {
  -webkit-transform: rotateZ(0) !important;
  transform: rotateZ(0) !important;
}

>>> .hips-collapse-item__title--expanded .right-icon img {
  -webkit-transform: rotateZ(90deg) !important;
  transform: rotateZ(90deg) !important;
}
</style>
