<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item key="baseInfoTab" :label="$T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息')" code="baseInfoTab">
        <srm-form :data-set="formDs" :columns="getBasicColumns()" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="supplierInfoTab" :label="$T('scux.purchaserEvaluationDetail.view.content.supplierInfo').$D('供应商信息')" code="supplierInfoTab">
        <srm-form :data-set="formDs" :columns="getSupplierColumns()" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="companyInfoTab" :label="$T('scux.purchaserEvaluationDetail.view.content.companyInfo').$D('公司信息')" code="companyInfoTab">
        <srm-form class="basic-company" :data-set="formDs" :columns="getCompanyColumns()" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="evaluationResultTab" :label="$T('sslm.purchaserEvaluationDetail.view.content.assessmentResult').$D('评估结果')" code="evaluationResultTab">
        <srm-form :data-set="formDs" :columns="getEvaluationColumns()" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="rectifyTab" :label="$T('scux.purchaserEvaluationDetail.view.content.guyu.rectify').$D('整改不符合项')" :show-title="false" code="rectifyTab">
        <div class="scux-guyu-list-scroll-tab-item-title">
          <span>{{ $T('scux.purchaserEvaluationDetail.view.content.guyu.rectify').$D('整改不符合项') }}</span>
          <span v-if="parameters.pageType === 'groupMembersEditor'" class="scux-guyu-tab-item-right">
            <div class="scux-guyu-tab-item-right-delete"><em class="srm-icon icon-trash" @click="handleDeleteFileItem"/></div>
            <em class="srm-icon icon-plus" @click="handleAddFileItem"/>
          </span>
        </div>
        <srm-list :data-set="rectifyDs" :columns="getRectifyColumns()" :show-select-all="false" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, SrmButton, $T } from "srm-mobile-ui";

import { rectifyDS, formDS } from "./store/ds";
import { customizeUnitCode } from "./constant";
import { handleSaveAllDetail } from "./api";

export default {
  modules: [ "sslm.purchaserEvaluationDetail", "scux.purchaserEvaluationDetail", "sslm.supplierDocManage", "hipspfm.common" ],
  name: "GUYUPurEvaluationApprovalDetailForm",
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    parameters: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      formDs: new DataSet(formDS({ evalHeaderId: this.changeReqId, pageType: this.parameters.pageType })),
      rectifyDs: new DataSet(rectifyDS({ evalHeaderId: this.changeReqId, pageType: this.parameters.pageType })),
    };
  },
  mounted() {
    if (this.changeReqId) {
      this.formDs.refresh();
      this.rectifyDs.refresh();
    }
  },
  methods: {
    handleAddFileItem() {
      this.rectifyDs.create({
        orderSource: "reportEval",
      });
    },
    handleDeleteFileItem() {
      this.rectifyDs.removeSelect();
    },
    // 基础信息
    getBasicColumns() {
      const columns = [
        {
          fieldCode: "evalNum",
        },
        {
          fieldCode: "reportStatus",
        },
        {
          fieldCode: "sourceTypeMeaning",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "realName",
        },
        {
          fieldCode: "strategyName",
        },
        {
          fieldCode: "evalDateFrom",
        },
        {
          fieldCode: "evalDateTo",
        },
        {
          fieldCode: "attributeVarchar19",
        },
        {
          fieldCode: "attributeVarchar1",
        },
        {
          fieldCode: "attributeVarchar2",
        },
        {
          fieldCode: "attributeVarchar3",
        },
        {
          fieldCode: "attributeVarchar20",
        },
        {
          fieldCode: "attributeDecimal1",
        },
        {
          fieldCode: "attributeVarchar7",
        },
        {
          fieldCode: "attributeVarchar10",
        },
        {
          fieldCode: "attributeVarchar11",
        },
        {
          fieldCode: "attributeVarchar12",
        },
      ].filter(Boolean);
      return columns;
    },
    // 供应商信息
    getSupplierColumns() {
      return [
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "supplierType",
        },
        {
          fieldCode: "supplierContactor",
        },
        {
          fieldCode: "supplierContactPhone",
        },
        // {
        //   fieldCode: "attributeVarchar8",
        // },
        // {
        //   fieldCode: "attributeVarchar9",
        // },
      ];
    },
    // 公司信息
    getCompanyColumns() {
      return [
        {
          fieldCode: "companyName",
        },
      ];
    },
    // 评估结果
    getEvaluationColumns() {
      const basicInfo = this.formDs?.current?.data || {};
      const { attributeVarchar19 } = basicInfo;
      return [
        {
          fieldCode: "attributeVarchar13",
        },
        {
          fieldCode: "attributeVarchar14",
        },
        {
          fieldCode: "attributeVarchar22",
        },
        {
          fieldCode: "attributeLongtext1",
        },
        {
          fieldCode: "attributeLongtext3",
        },
        {
          fieldCode: "attributeLongtext2",
        },
        {
          fieldCode: "attributeVarchar5",
        },
        attributeVarchar19 === "HZP" ? {
          fieldCode: "attributeVarchar6",
        } : {
          fieldCode: "attributeVarchar23",
        },
        {
          fieldCode: "attributeVarchar17",
        },
        {
          fieldCode: "attributeLongtext4",
        },
        {
          fieldCode: "attributeLongtext5",
        },
        {
          fieldCode: "attributeLongtext6",
        },
        {
          fieldCode: "attributeVarchar15",
        },
        attributeVarchar19 === "HZP" ? {
          fieldCode: "attributeVarchar16",
        } : {
          fieldCode: "attributeVarchar24",
        },
      ];
    },
    // 发起质量整改
    handleQualityRectification() {
      this.$notification.open({
        message: $T("scux.purchaserEvaluationDetail.view.message.qualityRectificationTip").$D("请前往PC端发起质量整改！"),
        duration: 2000
      });
    },
    // 整改不符合项
    getRectifyColumns() {
      return [
        {
          fieldCode: "opteration",
          render: (_, record) => !record.problemNum ?
            <SrmButton plain rect size="small" onClick={() => this.handleQualityRectification()}>
              {$T("sslm.supplierDocManage.view.button.qualityRectification").$D("发起质量整改")}
            </SrmButton> :
            <span>-</span>
          ,
        },
        {
          fieldCode: "problemNum",
        },
        {
          fieldCode: "attributeLongtext1",
        },
        {
          fieldCode: "attributeLongtext2",
        },
      ];
    },
    // 获取保存参数
    async handleSavePageData() {
      const { sourceType, riskEventNum, riskProcessUuid } = this.parameters || {};
      const validateFlag = await Promise.all([ this.formDs.validate(), this.rectifyDs.validate() ]);
      if (validateFlag.every((item) => item)) {
        const saveHeaderData = this.formDs?.current?.data || {};
        const res = await handleSaveAllDetail({
          ...saveHeaderData,
          siteEvalExternalOrders: this.rectifyDs.toData(),
          sourceType,
          riskEventNum,
          riskProcessUuid,
          customizeUnitCode: customizeUnitCode.join(","),
        });
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
          return false;
        }
        return true;
      }
      return false;
    },
    // 审批前调用保存
    beforeApprove(approveResult) {
      return new Promise((resolve, reject) => {
        if (approveResult === "Approved") {
          this.handleSavePageData().then((res) => {
            if (!res) {
              reject(false);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
  .basic-company {
    min-height: auto;
  }
  .scux-guyu-list-scroll-tab-item-title {
    -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: var(--background-color-empty-second);
      color: var(--font-color-default);
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      font-size: 3.733vw;
      font-weight: 600;
      line-height: 5.333vw;
      padding: 2.667vw 4vw;
      justify-content: space-between;
  }
  .scux-guyu-tab-item-right {
    font-weight: 400;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .scux-guyu-tab-item-right-delete {
    margin-right: 8px;
  }
  >>> .srm-list-tool-button-wrap {
    display: none;
  }
</style>