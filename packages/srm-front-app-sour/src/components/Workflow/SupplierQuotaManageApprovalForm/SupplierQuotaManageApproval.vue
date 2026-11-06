<template>
  <srm-scroll-tab>
    <!-- 基本信息 -->
    <srm-scroll-tab-item :label="$T('sslm.supplierQuotaManage.view.message.basicInfo').$D('基本信息')">
      <customize
        :columns="getBasicColums"
        :data-source="basicInfo"
        :need-padding="true"
        code="SMBL.WORKFLOW.SUP_QUO_MAN_BASIC"/>
    </srm-scroll-tab-item>
    <!-- 配额分配 -->
    <srm-scroll-tab-item :label="$T('sslm.supplierQuotaManage.view.message.auotaAsign').$D('配额分配')">
      <srm-list
        :data-set="dataSet"
        :columns="getContactInfoColums"
        customize-code="SMBL.WORKFLOW.SUP_QUO_MAN_LINES"
        @itemClick="onItemClick"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import indexDs from "./dataSource";
import { getBasicInfoApi } from "./api";
import moment from "moment";
export default {
  modules: [
    "sslm.supplierQuotaManage",
    "hzero.common",
    "ssrc.supplyInfoChange",
  ],
  name: "SupplierQuotaManageApproval",
  props: {
    parameters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      basicInfo: {}, //基本信息
      tableData: [], //配额分配
      dataSet: new DataSet(indexDs(this.parameters.quotaHeaderId, this.parameters.sourceKey)),
    };
  },
  computed: {
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.agreementDesc"
          ).$D("配额协议描述"),
          fieldCode: "quotaAgreementDescription",
          formRow: 10,
          fieldType:"EMPTY",
          render: (val) => <SrmListHeader showOpenTag={false}>
            <span>{val || "-"}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.agreementNo"
          ).$D("配额协议号"),
          fieldCode: "quotaAgreementNum",
          formRow: 20,
          formCol:1,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.versionNum"
          ).$D("版本号"),
          fieldCode: "versionNum",
          formRow: 20,
          formCol:2,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.itemCode"
          ).$D("物料编码"),
          fieldCode: "itemCode",
          formRow: 30,
          formCol:1,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.itemName"
          ).$D("物料名称"),
          fieldCode: "itemName",
          formRow: 30,
          formCol:2,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.categoryCode"
          ).$D("品类编码"),
          fieldCode: "categoryCode",
          formRow: 40,
          formCol:1,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.categoryName"
          ).$D("品类名称"),
          fieldCode: "itemCategoryName",
          formRow: 40,
          formCol:2,
        },
        {
          fieldName: this.$T("sslm.supplierQuotaManage.modal.quota.company").$D(
            "公司"
          ),
          fieldCode: "companyName",
          formRow: 50,
          formCol:1,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.businessEntity"
          ).$D("业务实体"),
          fieldCode: "ouName",
          formRow: 50,
          formCol:2,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.effective"
          ).$D("有效周期"),
          fieldCode: "validCycleMeaning",
          formRow: 60,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.isValidFrom"
          ).$D("有效期从"),
          fieldCode: "effectiveDateFrom",
          render: (val) => val ? moment(val).format("YYYY-MM-DD") : "-",
          formRow: 70,
          formCol:1,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.isValidTo"
          ).$D("有效期至"),
          fieldCode: "effectiveDateTo",
          render: (val) => val ? moment(val).format("YYYY-MM-DD") : "-",
          formRow: 70,
          formCol:2,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.numberOfProsecutions"
          ).$D("起拆量"),
          fieldCode: "numberOfProsecutions",
          formRow: 80,
          formCol:1,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.controlMethod"
          ).$D("控制方式"),
          fieldCode: "controlMethodMeaning",
          formRow: 80,
          formCol:2,
        },
        {
          fieldName: this.$T("sslm.supplierQuotaManage.modal.quota.buyer").$D(
            "分管采购员"
          ),
          fieldCode: "buyerName",
          formRow: 90,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.versionExplain"
          ).$D("版本说明"),
          fieldCode: "versionDescription",
          formRow: 100,
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.sourceDocType"
          ).$D("来源单据类型"),
          fieldCode: "sourceDocTypeMeaning",
          formRow: 110,
          formCol:1,
          visible: this.parameters.sourceKey === "OLD",
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.sourceNumber"
          ).$D("来源单据编号"),
          fieldCode: "sourceNumber",
          formRow: 110,
          formCol:2,
          visible: this.parameters.sourceKey === "OLD",
        },
      ];

      return columns;
    },
    // 配额分配
    getContactInfoColums() {
      const columns = [
        {
          fieldCode: "supplierName",
          fieldType:"EMPTY",
          render: (val) => <SrmListHeader showOpenTag={false}>
            <span>{val || "-"}</span>
          </SrmListHeader>
        },
        {
          fieldCode: "supplierNum",
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.suppilerCode"
          ).$D("供应商编码"),
        },
        {
          fieldName: this.$T(
            "sslm.supplierQuotaManage.modal.quota.erpSuppilerCode"
          ).$D("ERP供应商编码"),
          fieldCode: "erpSupplierNum",
        },
        {
          fieldName: this.$T("sslm.supplierQuotaManage.modal.quota.ratio").$D(
            "配额比（%）"
          ),
          fieldCode: "quotaRatio",
        },
        {
          fieldName: this.$T("hzero.common.priority").$D("优先级"),
          fieldCode: "orderSeq",
        },
      ];

      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    await this.getBasicInfo();
    this.$loading.hide();
    this.$emit(
      "GetApprovalTitle",
      this.$T("sslm.supplierQuotaManage.view.title.supplierQuota").$D(
        "供应商配额"
      )
    );
  },
  methods: {
    // 获取基本信息资料
    getBasicInfo() {
      const params = {
        quotaHeaderId: this.parameters.quotaHeaderId,
        customizeUnitCode: this.parameters.sourceKey === "NEW" ?
          "SSLM.SUP_QUOTA_APPLICATIONS_DETAIL.BASIC" :
          "SSLM.SUPPLIER_QUOTA_MANAGE.HEADER",
      };
      getBasicInfoApi(params).then((res) => {
        this.basicInfo = res;
        this.systemType = res.systemType;
      });
    },
  },
};
</script>