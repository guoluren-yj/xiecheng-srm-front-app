<template>
  <div>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="$T('scux.supQuoApplicationApproval.view.title.deye.baseInfo').$D('基础信息')" code="baseInfoTab">
        <srm-form :data-set="formDs" :columns="getColumns('form')" />
      </srm-scroll-tab-item>
      <!-- 项目计划 -->
      <srm-scroll-tab-item :label="$T('scux.supQuoApplicationApproval.view.title.deye.quotaLine').$D('配额申请行')" code="quotaLineTab">
        <srm-list :data-set="tableDs" :columns="getColumns('quotaLine')" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";

import { formDS, tableDS } from "./store/ds";

export default {
  modules: [ "scux.supQuoApplicationApproval", "sslm.supplierQuotaManage", "hzero.common" ],
  name: "DEYESupQuotaBatchApproval",
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formDs: new DataSet(formDS()),
      tableDs: new DataSet(tableDS()),
    };
  },
  mounted() {
    const businessKey = this.parameters?.businessKey || this.$parent?.processInstance?.businessKey || this?.$parent?.$parent?.processInstance?.businessKey || null;
    if (businessKey) {
      this.formDs.setQueryParameter({
        businessKey,
      });
      this.tableDs.setQueryParameter({
        businessKey,
      });
      this.formDs.refresh();
      this.tableDs.refresh();
    }
  },
  methods: {
    getColumns(columnType) {
      switch (columnType) {
      case "form":
        return [
          {
            fieldCode: "peBatchNum",
            fieldName: $T("scux.supQuoApplicationApproval.model.deye.approvalNumber").$D("配额审批单号"),
            formRow: 10,
          },
          {
            fieldCode: "submittedUserName",
            fieldName: $T("hzero.common.creationName").$D("创建人"),
            formRow: 20,
          },
          {
            fieldCode: "creationTime",
            fieldName: $T("hzero.common.creationDate").$D("创建时间"),
            formRow: 30,
          },
          {
            fieldCode: "attachmentUuid",
            fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
            showCount: true,
            fieldType: "UPLOAD",
            bucketName: "private-bucket",
          },
          {
            fieldCode: "remark",
            fieldName: $T("hzero.common.remark").$D("备注"),
            formRow: 50,
          },
        ];
      case "quotaLine":
        return [
          {
            fieldCode: "quotaAgreementNum",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.agreementNo").$D("配额协议号"),
          },
          {
            fieldCode: "itemCode",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.itemCode").$D("物料编码"),
          },
          {
            fieldCode: "itemName",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.itemName").$D("物料名称"),
          },
          {
            fieldCode: "effectiveDateFrom",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.isValidFrom").$D("有效期从"),
          },
          {
            fieldCode: "effectiveDateTo",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.isValidTo").$D("有效期至"),
          },
          {
            fieldCode: "numberOfProsecutions",
            fieldName: $T("scux.supQuoApplicationApproval.modal.quota.numberOfProsecutions").$D("起拆量"),
          },
          {
            fieldCode: "erpSupplierCode",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.erpSuppilerCode").$D("ERP供应商编码"),
          },
          {
            fieldCode: "erpSupplierName",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.supplierName").$D("供应商名称"),
          },
          {
            fieldCode: "quotaRatio",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.ratio").$D("配额比（%）"),
          },
          {
            fieldCode: "orderSeq",
            fieldName: $T("hzero.common.priority").$D("优先级"),
          },
          {
            fieldCode: "versionDescription",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.versionExplain").$D("版本说明"),
          },
          {
            fieldCode: "companyName",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.company").$D("公司"),
          },
          {
            fieldCode: "createdByName",
            fieldName: $T("sslm.supplierQuotaManage.modal.quota.founder").$D("创建人"),
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("hzero.common.date.creation").$D("创建时间"),
          },
        ];
      default:
        return [];
      }
    },
  },
};
</script>