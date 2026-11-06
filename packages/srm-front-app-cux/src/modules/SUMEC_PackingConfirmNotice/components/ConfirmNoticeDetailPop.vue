<template>
  <hips-popup
    v-model="value"
    style="height: calc(100vh - 20px); width: 100%; overflow: hidden; border-top-left-radius: 12px; border-top-right-radius: 12px;"
    position="bottom"
    :overlay-on-click-close="false"
    @click-overlay="$emit('input', false)">
    <!-- 导航 -->
    <NavPopHead :title="$T('smbl.common.message.detailInfo').$D('明细信息详情')" :show-pop-head-flag="true" @clickBack="$emit('input',false)" />
    <div ref="content" class="rfxprice-detail">
      <!-- 内容区 -->
      <div class="card-personalized">
        <CustomizeDetail :columns="getColumns" :data-source="detailInfo" code="SMBL.SUMEC.PACKINGCONFIRMATIONNOTICE.DETAILINFO" />
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { Popup } from "hips";
import NavHead from "@/components/NavHead";
import NavPopHead from "@/components/NavPopHead";

export default {
  modules: [ "smbl.common" ],
  name: "ConfirmNoticeDetailPop",
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
    detailInfo:{
      type:Object,
      default:{}
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
          fieldName: "商品名称",
          fieldType: "TEXT",
          fieldCode: "productName",
          langCode:"smbl.common.model.productName"
        },
        {
          fieldName: "行号",
          fieldType: "TEXT",
          fieldCode: "lineNumber",
          langCode:"smbl.common.model.lineNumber"
        },
        {
          fieldName: "本次出运数量",
          fieldType: "TEXT",
          fieldCode: "shipmentQuantity",
          langCode:"smbl.common.model.shipmentQuantity"
        },
        {
          fieldName: "包装数量",
          fieldType: "TEXT",
          fieldCode: "packagesQuantity",
          langCode:"smbl.common.model.packagesQuantity"
        },
        {
          fieldName: "尺码",
          fieldType: "TEXT",
          fieldCode: "boxSize",
          langCode:"smbl.common.model.boxSize"
        },
        {
          fieldName: "颜色",
          fieldType: "TEXT",
          fieldCode: "boxColor",
          langCode:"smbl.common.model.boxColor"
        },
        {
          fieldName: "箱数",
          fieldType: "TEXT",
          fieldCode: "boxQuantity",
          langCode:"smbl.common.model.boxQuantity"
        },
        {
          fieldName: "箱规",
          fieldType: "TEXT",
          fieldCode: "boxLength",
          langCode:"smbl.common.model.casesOfGauge"
        },
        {
          fieldName: "毛重",
          fieldType: "TEXT",
          fieldCode: "grossWeight",
          langCode:"smbl.common.model.grossWeight"
        },
        {
          fieldName: "净重",
          fieldType: "TEXT",
          fieldCode: "netWeight",
          langCode:"smbl.common.model.netWeight"
        },
        {
          fieldName: "体积",
          fieldType: "TEXT",
          fieldCode: "volume",
          langCode:"smbl.common.model.volume"
        },
        {
          fieldName: "装箱日期",
          fieldType: "TEXT",
          fieldCode: "vanningDate",
          langCode:"smbl.common.model.vanningDate",
          render: (val) => {
            return this.$options.filters["CalcDate"](val);
          }
        },
        {
          fieldName: "采购合同号",
          fieldType: "TEXT",
          fieldCode: "contractNumber",
          langCode:"smbl.common.model.contractNumber"
        },
        {
          fieldName: "合同行号",
          fieldType: "TEXT",
          fieldCode: "lineNumber",
          langCode:"smbl.common.model.contractLineNumber"
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
          fieldName: "集装箱号",
          fieldType: "TEXT",
          fieldCode: "containerNumber",
          langCode:"smbl.common.model.containerNumber"
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
        {
          fieldName: "备注",
          fieldType: "TEXT_AREA",
          fieldCode: "remark",
          langCode:"smbl.common.model.comment",
          disabled: true
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
  height calc(100vh - 44px);
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
