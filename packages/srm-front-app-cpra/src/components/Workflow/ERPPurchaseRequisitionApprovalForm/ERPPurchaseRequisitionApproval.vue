<template>
  <div class="erp-purchase-requisition-approval">
    <srm-scroll-tab v-if="loadFinishFlag">
      <srm-scroll-tab-item :label="$T('sprm.purchaseReqCreation.view.title.orderHeaderInfo').$D('采购申请头信息')">
        <div v-if="headInfo" class="customize-card" @click="showHeadInfoDetail">
          <customize :need-padding="true" :columns="headColumns" :data-source="headInfo" code="SMBL.WORKFLOW.PURCHAEREQUISITION_ERP.HEAD"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sprm.purchaseReqCreation.view.title.purchaseLineInfo').$D('采购申请行信息')">
        <div v-for="(item, index) in linesList"
             :key="index"
             class="customize-card"
             :style="{'border-bottom': index === (linesList.length - 1) ? '' : '8px solid var(--split-line-color-primary)'}"
             @click="showLineInfoDetail(item)">
          <customize :need-padding="true" :columns="lineColumns" :data-source="item" code="SMBL.WORKFLOW.PURCHAEREQUISITION_ERP.LINE"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smbl.common.message.OperationRecord').$D('操作记录')">
        <div class="record-container">
          <history-record-tiled
            :show-remark="false"
            :loading="false"
            :action-data="actionRecordList"
            operation-meaning-field-name="status"
            operator-field-name="processUserName"
            process-date-field-name="creationDate"
            process-remark-field-name="processRemark"
            :remark-label="$T('smbl.common.message.OperationRecord').$D('操作记录')"
            process-remark-info-field-name="unknown"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="headInfo && headInfo.attachmentUuid" :label="$T('smbl.common.view.attachment').$D('附件')">
        <div class="attachment-container">
          <srm-upload class="head-attachment" :attachment-uuid="headInfo.attachmentUuid" :show-icon="false" :show-count="false"/>
          <srm-flex align="center" class="attachment-view">
            <div class="srm-icon icon-other" style="color: var(--color-other-default-c); font-size: 28px;" />
            <div style="margin-left: 16px; flex-grow: 1;">{{ $T("smbl.common.view.button.checkAttachmentList").$D("查看附件列表") }}</div>
            <div class="srm-icon icon-chevron-right" style="font-size: 16px;" />
          </srm-flex>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 头信息-详情弹框 -->
    <srm-popup :visible.sync="headInfoDetailPopupFlag" position="bottom" height="80%" :title="$T('sprm.purchaseReqCreation.view.title.orderHeaderInfo.detail').$D('采购申请头信息详情')" show-close rounded>
      <customize-detail :need-padding="true" :columns="headInfoDetailColumns" :data-source="headInfo" code="SMBL.WORKFLOW.PURCHAEREQUISITION_ERP.HEAD.DETAIL" />
    </srm-popup>
    <!-- 行信息-详情弹框 -->
    <srm-popup :visible.sync="lineInfoDetailPopupFlag" position="bottom" height="80%" :title="$T('sprm.purchaseReqCreation.view.title.purchaseLineInfo.detail').$D('采购申请行信息详情')" show-close rounded>
      <customize-detail :need-padding="true" :columns="lineInfoDetailColumns" :data-source="displayLineItem" code="SMBL.WORKFLOW.PURCHAEREQUISITION_ERP.LINE.DETAIL" />
    </srm-popup>
  </div>
</template>

<script>
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import {
  getPurchaseRequestApi,
  getPurchaseRequestLinesApi,
  getOperatingRecordsApi,
} from "./api/index";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "sprm.purchaseReqCreation", "sprm.common", "smbl.common", "smbl.workFlow", "hzero.common", "mallf.common" ],
  name: "ERPPurchaseRequisitionApproval",
  components: {
    HistoryRecordTiled
  },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      headInfo: {},
      linesList: [],
      displayLineItem: {},
      actionRecordList: [],
      loadFinishFlag: false,
      // flag
      headInfoDetailPopupFlag: false,
      lineInfoDetailPopupFlag: false,
    };
  },
  computed: {
    headColumns() {
      return [ {
        fieldName: "displayPrNum",
        fieldCode: "displayPrNum",
        fieldType: "EMPTY",
        formRow: 1,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{ val }</span>
        </srm-list-header>
      }, {
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        fieldCode: "createByName",
        formRow: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.creationDate").$D("创建时间"),
        fieldCode: "creationDate",
        formRow: 20,
      }, {
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        fieldCode: "prSourcePlatformMeaning",
        formRow: 30,
      }, {
        fieldName: this.$T("mallf.common.view.prType").$D("采购申请类型"),
        fieldCode: "prTypeName",
        formRow: 40,
      }, {
        fieldName: this.$T("sprm.common.modal.common.unitName").$D("所属部门"),
        fieldCode: "unitName",
        formRow: 45,
      }, {
        fieldName: this.$T("sprm.common.model.common.remark").$D("备注"),
        fieldCode: "remark",
        formRow: 50,
      }, ];
    },
    lineColumns() {
      return [ {
        fieldName: "ouName",
        fieldCode: "ouName",
        fieldType: "EMPTY",
        formRow: 1,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{ val }</span>
        </srm-list-header>
      }, {
        fieldName: this.$T("sprm.common.model.common.lineNumber").$D("行号"),
        fieldCode: "displayLineNum",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.enclosure").$D("附件"),
        fieldCode: "attachmentUuid",
        formRow: 10,
        formCol: 20,
        render: (val) => <srm-upload
          attachment-uuid={val}
          show-icon={false}
          show-count={false}
          desc-title={this.$T("smbl.common.button.viewAttachments").$D("查看附件")}
          color="var(--font-color-primary)" />,
      }, {
        fieldName: this.$T("sprm.common.model.common.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
        fieldCode: "itemName",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.categoryName").$D("物料分类"),
        fieldCode: "categoryName",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "quantity",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.uomName").$D("单位"),
        fieldCode: "uomName",
        formRow: 50,
        formCol: 20,
      }, {
        fieldName: this.$T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价（含税）"),
        fieldCode: "taxIncludedUnitPrice",
        formRow: 60,
        render: (val, item) => {
          let length = 0;
          // erp订单及电商申请转订单不做精度控制
          // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
          const erpFlag = item.sourceCode === "SRM" && item.poSourcePlatform === "ERP";
          // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
          const sapFlag = item.sourceCode === "SAP" && item.poSourcePlatform === "E-COMMERCE";
          if (!erpFlag && !sapFlag) {
            length = item.localFinancialPrecision;
          }
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedUnitPriceMeaning;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      }, {
        fieldName: this.$T("sprm.common.model.common.lineAmount").$D("行金额"),
        fieldCode: "taxIncludedLineAmount",
        formRow: 60,
        render: (val, item) => {
          let length = 0;
          // erp订单及电商申请转订单不做精度控制
          // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
          const erpFlag = item.sourceCode === "SRM" && item.poSourcePlatform === "ERP";
          // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
          const sapFlag = item.sourceCode === "SAP" && item.poSourcePlatform === "E-COMMERCE";
          if (!erpFlag && !sapFlag) {
            length = item.localFinancialPrecision;
          }
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedUnitPriceMeaning;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      }, {
        fieldName: this.$T("sprm.common.model.common.needDate").$D("需求日期"),
        fieldCode: "neededDate",
        formRow: 70,
        formCol: 10,
      }, ];
    },
    headInfoDetailColumns() {
      return [ {
        fieldName: this.$T("sprm.common.model.displayPrNum").$D("采购申请编号"),
        fieldCode: "displayPrNum",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        fieldCode: "creationDate",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        fieldCode: "createByName",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        fieldCode: "prSourcePlatformMeaning",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("mallf.common.view.prType").$D("采购申请类型"),
        fieldCode: "prTypeName",
        formRow: 50,
      }, {
        fieldName: this.$T("sprm.common.modal.common.unitName").$D("所属部门"),
        fieldCode: "unitName",
        formRow: 55,
      }, {
        fieldName: this.$T("sprm.common.model.common.remark").$D("备注"),
        fieldCode: "remark",
        formRow: 60,
        formCol: 10,
      }, ];
    },
    lineInfoDetailColumns() {
      return [ {
        fieldName: this.$T("sprm.common.model.common.lineNumber").$D("行号"),
        fieldCode: "displayLineNum",
        formRow: 10,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.uomName").$D("单位"),
        fieldCode: "uomName",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
        fieldCode: "purchaseAgentName",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.invOrganizationId").$D("库存组织"),
        fieldCode: "ouName",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.executionBillNum").$D("执行单据编号"),
        fieldCode: "displayExecutionBillNum",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.priceQuantity").$D("价格批量（每）"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "unitPriceBatch",
        formRow: 90,
        formCol: 10,
      }, ];
    },
  },
  mounted() {
    this.requestData();
  },
  methods: {
    async requestData() {
      let id = this.parameters.id;
      this.$loading.show();
      let headInfo = await getPurchaseRequestApi(id);
      let lines = await getPurchaseRequestLinesApi(id);
      let actions = await getOperatingRecordsApi(id);

      this.headInfo = headInfo;
      this.linesList = lines?.content || [];
      this.actionRecordList = (actions?.content || []).map((item) => ({
        ...item,
        status: {
          type: "info",
          text: item.processTypeCodeMeaning,
        }
      }));
      this.loadFinishFlag = true;
      this.$loading.hide();
    },
    showHeadInfoDetail() {
      this.headInfoDetailPopupFlag = true;
    },
    showLineInfoDetail(item) {
      this.lineInfoDetailPopupFlag = true;
      this.displayLineItem = item;
    },
  },
};
</script>

<style lang="stylus" scoped>

.erp-purchase-requisition-approval {
  background-color: var(--background-color-empty);
  .customize-card {
    padding-top: 6px;
    padding-bottom: 6px;
    background-color: var(--background-color-empty);
  }
   >>> .srm-list-item-card-head-left {
    max-width: 100%;
  }
  >>> .srm-history-record-item-content {
    z-index: 0;
  }
  >>> .srm-history-record-content {
    height: auto;
    min-height: 0px;
  }

  >>> .srm-button-info {
    color: var(--font-color-second);
  }

  .check-all-container {
    height: 44px;
    border-top: 1px solid var(--split-line-color-primary);
    color: var(--font-color-white);
  }
  .attachment-container {
    height: 60px;
    width: 100%;
    background-color: var(--background-color-empty);
    position: relative;
    .head-attachment {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    .attachment-view {
      height: 100%;
      width: 100%;
      padding: 0 15px;
      color: var(--font-color-default);
      font-size: 14px;
    }
  }

  .record-container {
    background-color: var(--background-color-empty);
  }
}

</style>