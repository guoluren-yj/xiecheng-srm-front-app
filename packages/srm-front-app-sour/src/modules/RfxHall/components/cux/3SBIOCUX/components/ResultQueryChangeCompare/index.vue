<template>
  <!-- 组件 -->
  <div style="min-height: 400px;">
    <section class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <!-- 基本信息 -->
          <ul style="padding: 16px 15px;">
            <customize
              :columns="getColumns('base')"
              :data-source="headInfo"
              :need-padding="false"/>
          </ul>
          <srm-blank size="mid" theme="fill"/>
          <srm-list :scrollable="false"
                    :data-set="lineTableDataSet"
                    :columns="getColumns('line')"
                    height="auto"
                    style="height: auto"/>
        </srm-scroll-tab>
      </div>

      <!-- 弹框 -->
      <srm-popup :visible.sync="visible"
                 position="right"
                 height="100%">
        <srm-list
          :scrollable="false"
          :data-set="historyDataSet"
          :columns="getColumns('history')"
          height="auto"
          style="height: auto"/>
      </srm-popup>
    </section>
  </div>
</template>

<script>
import { getHeadInfoApi } from "./api";
import { DataSet } from "srm-mobile-ui";
import { lineTableDs, historyDs } from "./datasource/ds";
import moment from "moment";

const renderDate = (value) => {
  if (value) {
    return moment(value).format("YYYY-MM-DD");
  }
  return "-";
};

export default {
  modules: [ "sscux.ssrc", "scux.resultQueryHistoryRecord", "hzero.common", "ssrc.inquiryHall" ],
  name: "ResultQueryChangeCompare",
  props: {
    rfxHeaderId: {
      type: String,
      default: null,
    },
    processInstanceId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      headInfo: {},
      // 评分明细
      lineTableDataSet: {},
      historyDataSet: {},
      visible: false,
    };
  },
  mounted() {
    this.lineTableDataSet = new DataSet(lineTableDs(this.rfxHeaderId, this.processInstanceId));
    this.lineTableDataSet.refresh();
    this.getHeadInfo();
  },
  methods: {
    openPopup(resultId) {
      this.historyDataSet = new DataSet(historyDs(resultId));
      this.historyDataSet.refresh();
      this.visible = true;
    },
    async getHeadInfo() {
      this.$loading.show();
      const res = await getHeadInfoApi({ rfxHeaderId: this.rfxHeaderId, processInstanceId: this.processInstanceId });
      this.$loading.hide();
      this.headInfo = res;
    },
    getColumns(type) {
      switch (type) {
      case "base":
        return [
          {
            fieldCode: "operatorName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.operatorName").$D("操作人"),
            fieldType: "TEXT",
            // formRow: 10,
          },
          {
            fieldCode: "attributeDatetime10",
            fieldName: this.$T("sscux.ssrc.model.3sbio.operatorTime").$D("操作时间"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "expandCompanyName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.expandCompanyName").$D("拓展公司"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "newExpandCompanyName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newExpandCompanyName").$D("新拓展公司"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "attributeLongtext12",
            fieldName: this.$T("sscux.ssrc.model.3sbio.changeRemark").$D("变更原因"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "attributeLongtext13",
            fieldName: this.$T("sscux.ssrc.model.3sbio.attachmentUuid").$D("附件"),
            fieldType: "UPLOAD",
          },
          {
            fieldCode: "attributeVarchar23",
            fieldName: this.$T("sscux.ssrc.model.3sbio.isShareToShenyangPur").$D("是否共享至沈阳基地采购"),
            fieldType: "TEXT",
            render: (val) => val === "1" ? this.$T("hzero.common.status.yes").$D("是") : val === "0" ? this.$T("hzero.common.status.no").$D("否") : "-"
          },
          {
            fieldCode: "attributeVarchar24",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newIsShareToShenyangPur").$D("新是否共享至沈阳基地采购"),
            fieldType: "TEXT",
            render: (val) => val === "1" ? this.$T("hzero.common.status.yes").$D("是") : val === "0" ? this.$T("hzero.common.status.no").$D("否") : "-"
          },
        ];
      case "line":
        return [
          {
            fieldCode: "sourceNum",
            fieldName: this.$T("sscux.ssrc.model.3sbio.sourceNum").$D("寻源单号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "rfxLineItemNum",
            fieldName: this.$T("sscux.ssrc.model.3sbio.rfxLineItemNum").$D("行号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemCode",
            fieldName: this.$T("sscux.ssrc.model.3sbio.itemCode").$D("物料编码"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.itemName").$D("名称与描述"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "quotationExpiryDateFrom",
            fieldName: this.$T("sscux.ssrc.model.3sbio.quotationExpiryDateFrom").$D("报价有效期从"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "quotationExpiryDateTo",
            fieldName: this.$T("sscux.ssrc.model.3sbio.quotationExpiryDateTo").$D("报价有效期至"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "attributeLongtext11",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newQuotationExpiryDateFrom").$D("新报价有效期从"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "attributeLongtext12",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newQuotationExpiryDateTo").$D("新报价有效期至"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "resultId",
            fieldName: this.$T("sscux.ssrc.model.3sbio.historyRecord").$D("历史记录"),
            fieldType: "TEXT",
            render: (val) => <srm-button type="primary" size="small" plain rect disabled={!val} onClick={() => this.openPopup(val)}>{ this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }</srm-button>
          },
          {
            fieldCode: "prDisplayNum",
            fieldName: this.$T("sscux.ssrc.model.3sbio.prDisplayNum").$D("采购申请号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "prDisplayLineNum",
            fieldName: this.$T("sscux.ssrc.model.3sbio.prDisplayLineNum").$D("采购申请行号"),
            fieldType: "TEXT",
          },
        ];
      case "history":
        return [
          {
            fieldCode: "realName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.operatorName").$D("操作人"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "creationDate",
            fieldName: this.$T("sscux.ssrc.model.3sbio.operatorTime").$D("操作时间"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "expandCompanyName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.expandCompanyName").$D("拓展公司"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "newExpandCompanyName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newExpandCompanyName").$D("新拓展公司"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "shareFlagMeaning",
            fieldName: this.$T("sscux.ssrc.model.3sbio.isShareToShenyangPur").$D("是否共享至沈阳基地采购"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "newShareFlagMeaning",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newIsShareToShenyangPur").$D("新是否共享至沈阳基地采购"),
            fieldType: "TEXT",
            render: (val) => val === "1" ? this.$T("hzero.common.status.yes").$D("是") : val === "0" ? this.$T("hzero.common.status.no").$D("否") : "-"
          },
          {
            fieldCode: "rfxNum",
            fieldName: this.$T("sscux.ssrc.model.3sbio.rfxNum").$D("寻源单号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "rfxLineItemNum",
            fieldName: this.$T("sscux.ssrc.model.3sbio.rfxLineItemNum").$D("行号"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemCode",
            fieldName: this.$T("sscux.ssrc.model.3sbio.itemCode").$D("物料编码"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "itemName",
            fieldName: this.$T("sscux.ssrc.model.3sbio.itemName").$D("名称与描述"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "quotationExpiryDateFrom",
            fieldName: this.$T("sscux.ssrc.model.3sbio.quotationExpiryDateFrom").$D("报价有效期从"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "quotationExpiryDateTo",
            fieldName: this.$T("sscux.ssrc.model.3sbio.quotationExpiryDateTo").$D("报价有效期至"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "newQuotationExpiryDateFrom",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newQuotationExpiryDateFrom").$D("新报价有效期从"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "newQuotationExpiryDateTo",
            fieldName: this.$T("sscux.ssrc.model.3sbio.newQuotationExpiryDateTo").$D("新报价有效期至"),
            fieldType: "TEXT",
            render: renderDate
          },
          {
            fieldCode: "changeRemark",
            fieldName: this.$T("sscux.ssrc.model.3sbio.changeRemark").$D("变更原因"),
            fieldType: "TEXT",
          },
          {
            fieldCode: "attachmentUuid",
            fieldName: this.$T("sscux.ssrc.model.3sbio.attachmentUuid").$D("附件"),
            fieldType: "UPLOAD",
          },
        ];
      default:
        return [];
      }
    },
    getCustomizeCode(type) {
      return this.$T.get(this, `resultQueryChangeComparison.${type}.customizeCode`);
    },
  }
};
</script>
