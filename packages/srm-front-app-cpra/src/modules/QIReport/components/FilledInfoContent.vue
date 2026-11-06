<template>
  <div class="filled-info-content">
    <srm-form customize-type="detail" :data-set="formDs" :columns="columns" />
    <div class="button-container">
      <srm-button bordered size="x-large" type="danger" class="cancel-button" @click="$emit('close')">
        {{ $T("hzero.common.button.cancel").$D("取消") }}
      </srm-button>
      <srm-button fill size="x-large" class="confirm-button" @click="onOk">
        {{ $T("hzero.common.button.confirm").$D("确认") }}
      </srm-button>
    </div>
  </div>
</template>

<script>
import { isNil } from "lodash";
import { DataSet } from "srm-mobile-ui";
import { emptyFormDS } from "../datasource/detailDS";
import { auditCancel, auditReject, auditComplete, auditContinuePCA } from "../api";
import { getPcUnitCodeMap } from "../utils";
export default {
  modules: [ "hzero.common", "sqam.common", "entity.roles", "entity.company", "entity.business", "entity.organization", "entity.supplier", "entity.item", "sodr.sendOrder", "entity.order", "sodr.common", "sqam.quoteIncomingInspection", "sslm.siteInvestigateReport", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail", "sslm.evaluationQuery", "hipspfm.common", "smbl.common" ],
  name: "FilledInfoContent",
  props: {
    action: {
      type: String,
      required: true,
      default: ""
    },
    headerDs: {
      type: Object,
      required: true,
      default: () => {}
    },
  },
  data() {
    return {
      formDs: new DataSet(emptyFormDS()),
    };
  },
  computed: {
    columns() {
      switch (this.action) {
      case "auditContinuePCA":
        return [
          {
            fieldCode: "approvedRemark",
            fieldType: "TEXT_AREA",
            fieldName: this.$T("sqam.common.incomingInspectionQuery.auditOpinion").$D("审核意见"),
            required: true,
          }
        ];
      case "auditComplete":
        return [
          {
            fieldCode: "approvedRemark",
            fieldType: "TEXT_AREA",
            fieldName: this.$T("sqam.common.incomingInspectionQuery.auditOpinion").$D("审核意见"),
            required: true,
          },
          {
            fieldCode: "expectedTrackTime",
            fieldType: "DATE_PICKER",
            fieldName: this.$T("sqam.common.view.message.expectedTrackTime").$D("期望成效追踪时间"),
          }
        ];
      case "auditReject":
        return [
          {
            fieldCode: "approvedRemark",
            fieldType: "TEXT_AREA",
            fieldName: this.$T("sqam.common.incomingInspectionQuery.auditOpinion").$D("审核意见"),
            required: true,
          }
        ];
      case "auditCancel":
        return [
          {
            fieldCode: "cancelRemark",
            fieldType: "TEXT_AREA",
            fieldName: this.$T("sqam.common.incomingInspectionQuery.cancelRemark").$D("取消原因"),
          }
        ];
      default:
        return [];
      }
    },
    customizeUnitCode() {
      const actionValues = {
        auditContinuePCA: getPcUnitCodeMap("audit").continuePCA,
        auditComplete: getPcUnitCodeMap("audit").complete,
        auditReject: getPcUnitCodeMap("audit").reject,
        auditCancel: getPcUnitCodeMap("audit").cancel,
      };
      const value = actionValues[this.action];
      return value;
    }
  },
  created() {
    // toData获取的是引用，所以这里需要复制一份
    const copyData = Object.assign({}, this.headerDs?.current?.toData() || {});
    this.formDs.create(copyData);
  },
  methods: {
    onOk() {
      const okFuncsMap = {
        "auditContinuePCA": this.handleAuditContinuePCA,
        "auditComplete": this.handleAuditComplete,
        "auditReject": this.handleAuditReject,
        "auditCancel": this.handleAuditCancel,
      };
      const okFunc = okFuncsMap[this.action];
      okFunc();
    },
    async handleAuditContinuePCA() {
      const validateRes = await this.formDs.validate();
      if (!validateRes) {
        return;
      }
      this.$loading.show();
      const res = await auditContinuePCA(
        this.formDs.current.toData(),
        { customizeUnitCode: getPcUnitCodeMap("audit").continuePCA }
      ).catch((err) => {
        throw err;
      }).finally(() => {
        this.$loading.hide();
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        this.$emit("close", true);
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async handleAuditComplete() {
      const validateRes = await this.formDs.validate();
      if (!validateRes) {
        return;
      }
      this.$loading.show();
      const res = await auditComplete(
        this.formDs.current.toData(),
        { customizeUnitCode: getPcUnitCodeMap("audit").complete }
      ).catch((err) => {
        throw err;
      }).finally(() => {
        this.$loading.hide();
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        this.$emit("close", true);
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async handleAuditReject() {
      const validateRes = await this.formDs.validate();
      if (!validateRes) {
        return;
      }
      this.$loading.show();
      const res = await auditReject(
        this.formDs.current.toData(),
        { customizeUnitCode: getPcUnitCodeMap("audit").reject }
      ).catch((err) => {
        throw err;
      }).finally(() => {
        this.$loading.hide();
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        this.$emit("close", true);
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async handleAuditCancel() {
      this.$loading.show();
      const res = await auditCancel(
        this.formDs.current.toData(),
        { customizeUnitCode: getPcUnitCodeMap("audit").cancel }
      ).catch((err) => {
        throw err;
      }).finally(() => {
        this.$loading.hide();
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        this.$emit("close", true);
      } else {
        this.$notification.open({ message: res.message });
      }
    },
  },
};
</script>

<style lang="stylus">
.filled-info-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .button-container {
    padding: 12px 15px;

    .cancel-button {
      width: calc(50% - 6px);
      margin-right: 12px;
    }

    .confirm-button {
      width: calc(50% - 6px);
    }
  }
}
</style>
