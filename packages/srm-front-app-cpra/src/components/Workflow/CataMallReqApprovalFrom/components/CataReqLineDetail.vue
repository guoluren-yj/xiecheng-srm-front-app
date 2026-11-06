<template>
  <srm-popup
    :title="$T('hipspfm.workFlowCata.model.common.purchaseLineInfo').$D('采购申请明细信息')"
    height="98%"
    :visible="visible"
    position="bottom"
    rounded
    @onClose="$emit('input', false)">
    <div class="orderLineDetail">
      <section class="headInfo">
        <li class="lineNum">
          <span>{{ $T('sprm.common.model.common.lineNumber').$D('行号') }}：{{ lineInfoDetail.lineNum }}</span>
        </li>
        <li>
          <span>{{ $T('sprm.common.model.common.productNum').$D('商品编码') }}：{{ lineInfoDetail.productNum }}</span>
        </li>
        <li>
          <span>{{ $T('sprm.common.model.common.productName').$D('商品名称') }}：{{ lineInfoDetail.productName }}</span>
        </li>
      </section>

      <div class="prequalification-detail language-class-ul-li">
        <ul>
          <!-- 个性化组件替换后的代码 -->
          <customize-detail :columns="getLineColumns" :data-source="lineInfoDetail"
                            code="SMBL.WORKFLOW.CATA_MALL_REQ.LINE_DETILE"/>
        </ul>
      </div>
    </div>
  </srm-popup>
</template>

<script>
import { View, NavBar, Input, Popup } from "hips";
import { SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
export default {
  modules: [ "hipspfm.workFlowCata", "sprm.common", "hipspfm.common", "entity.attachment" ],
  name: "CataReqLineDetail",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    lineInfoDetail: {
      type: Object
    },
    showFilePop:{
      type: Function
    }
  },
  data() {
    return {
      visible: false,
      uuid: "",
    };
  },
  computed:{
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sprm.common.model.common.catalogName").$D("商品目录"),
          fieldType: "TEXT",
          fieldCode: "catalogName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sprm.common.model.common.categoryName").$D("物料分类"),
          fieldType: "TEXT",
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.uomName").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxType").$D("税种"),
          fieldType: "TEXT",
          fieldCode: "taxCode",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRate").$D("税率"),
          fieldType: "TEXT",
          fieldCode: "taxRate",
          render:(val) => val ? val : "0"
        },
        {
          fieldName: this.$T("sprm.common.model.common.currencyCode").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价（含税）"),
          fieldCode: "taxIncludedUnitPrice",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedUnitPriceMeaning;
            }
            return Number(SrmUtil.getNumberLocalized(val, length));
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.linePrice").$D("行金额"),
          fieldCode: "taxIncludedLineAmount",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedLineAmountMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.neededDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "neededDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
          ,
        },
        {
          fieldName: this.$T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaseAgentName",
        },
        {
          fieldName: this.$T("hipspfm.common.message.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("entity.attachment.tag").$D("附件"),
          fieldCode: "attribute7",
          render: (val, record) => {
            if (record.attachmentUuid) {
              return <span style="color: blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>;
            }
            return <span>{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>;
          },
          callBack:(val, record) => {
            if (record.businessAttachmentUuid) {
              this.showFilePop(record.businessAttachmentUuid || uuid);
            }
          }
        },
      ];
      return columns;
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    }
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue{
   color:var(--color-other-default-b) !important;
}
.orderLineDetail {
  height: 100%;
  position: relative;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  .right-button {
    margin-right: 8px;

    img {
      margin-right: 12px;
      height: 24px;
      width: 24px;
    }
  }

  .headInfo {
    padding: 12px 20px 12px 20px;
    border-bottom: solid 8px var(--color-border-default);

    li {
      display: flex;
      margin-bottom: 4px;
      justify-content: space-between;
      font-weight bold
      span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        display: inline-block;
        color: var(--color-font-default);
        line-height: 24px;

        &:nth-child(1) {
          // font-weight: 700;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .lineNum {
      span {
        font-size: 16px;
        color: var(--color-font-default-e);
      }
    }
  }

  .prequalification-detail {
    height: calc(100vh - 176px);
  }
}
</style>
