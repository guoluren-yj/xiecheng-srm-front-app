<template>
  <div v-if="loading" class="mainDetail">
    <div ref="wrapper" class="contentWrap wrapper">
      <customize-detail class="" :need-padding="true" :columns="getAgreementInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.AGREEMENT_INFO" />
    </div>
  </div>
</template>
<script>

// import { getPdfFile } from "@/common/api/commonApi";

import { BUCKET_NAME } from "srm-mobile-ui/packages/request/config";

// import { getAgreementDetailApi } from "../../api/Jin";
import { getAgreementDetailApi, getPdfFile } from "./api/hygy.js";
import { previewFile } from "srm-mobile-ui/src/utils/index";
export default {
  modules: [ "hipspfm.workFlowAgrement", "spcm.purchaseRequisitionCreation", "spcm.common", "hipspfm.common", "scux.procurementDecisionReview", "scux.purchaseRecordApproval", "smbl.common" ],
  name: "HygyAgreementApproval",
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      headInfo:{},
      loading:false,
      preFileUrl:"",
      preModel:false,
    };
  },
  computed: {
    getAgreementInfoColumns() {
      return [
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcName").$D("协议名称"),
          fieldCode: "pcName",
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.amount").$D("协议总额"),
          fieldCode: "taxIncludeAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.contractFileUrl").$D("用章附件（文本）"),
          fieldCode:"contractFileUrl",
          render: (val, item) => <div style="color: blue; font-size: 14px;" on-click={(e) => {
            e.stopPropagation();
            this.showContractAttachment(val, item.contractFileUrl);
          }}>
            <span>{ this.$T("scux.procurementDecisionReview.button.viewAttachment").$D("查看附件") }</span>
            <span>{ val && item.contractFileUrl ? "(1)" : "(0)" }</span>
          </div>
        },
        {
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldCode: "startDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldCode: "endDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },

        {
          fieldName: this.$T("spcm.common.model.common.depName").$D("所属部门"),
          fieldCode: "unitName",
        },

        {
          fieldName: this.$T("spcm.common.model.agentName").$D("采购员"),
          fieldCode: "purchaseAgentName",
        },

        {
          fieldName: this.$T("spcm.common.model.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("smbl.common.view.title.preFile").$D("附件预览"),
          fieldCode: "preDoc",
        },
        {
          fieldName: this.$T("spcm.common.model.signDescription").$D("签订原因"),
          fieldCode: "signDescription",
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        },
      ];
    },
  },
  watch: {
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getAgreementDetail();
        this.preFileUrl = await getPdfFile(BUCKET_NAME, this.headInfo["contractFileUrl"]);
        this.$loading.hide();
        this.loading = true;
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowAgrement.view.title.agrementApproval").$D("协议审批"));
  },
  methods: {
    // 获取协议审批详情信息
    async getAgreementDetail() {
      await getAgreementDetailApi(this.changeReqId).then((res) => {
        this.headInfo = res || {};
        if (typeof this.headInfo.attribute1Meaning === "object") {
          this.moreAttribute1Meaning = Object.values(
            this.headInfo.attribute1Meaning
          ).join("/");
        }
      });
    },
    // 显示用章文本附件
    async showContractAttachment(uuid, fileAdress) {
      if (!uuid || !fileAdress) {
        return;
      }
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileAdress,
        fileName: uuid,
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.mainDetail {
  font-family: PingFangSC-Medium;
  height: calc(100vh - 260px);
  overflow: auto;
}
</style>
