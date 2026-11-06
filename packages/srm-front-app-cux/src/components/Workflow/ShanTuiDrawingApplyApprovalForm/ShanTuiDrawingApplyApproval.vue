<template>
  <div>
    <div class="customize-card" @click="showDetail">
      <customize :need-padding="true" :columns="getBaseInfoColumns" :data-source="baseInfo" type="list" />
    </div>
    <srm-popup :visible.sync="detailFlag"
               position="right"
               width="100%"
               height="100%"
               :show-header="false"
               :title="$T('smbl.common.message.tab.detailInfo').$D('明细信息')"
               :show-back="true">
      <customize-detail :need-padding="true" :columns="getDetailColumns" :data-source="baseInfo"/>
    </srm-popup>
  </div>
</template>

<script>
import { getBaseInfoApi } from "./api/index";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "scux.drawManagement", "smbl.common" ],
  name: "ShanTuiDrawingApplyApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      baseInfo: {},
      detailFlag: false,
    };
  },
  computed: {
    getBaseInfoColumns() {
      return [ {
        fieldName: "customHeader",
        fieldType: "EMPTY",
        fieldCode: "itemCode",
        formRow: 10,
        render: (val, item) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
          <span slot="right">{item.supplierTenantId === item.tenantId ? item.supplierStatusMeaning : item.purchaseStatusMeaning}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.itemName").$D("物料名称"),
        fieldType: "TEXT",
        fieldCode: "itemName",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.supplierCompanyName").$D("供应商名称"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyName",
        formRow: 30,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.unit").$D("单位"),
        fieldType: "TEXT",
        fieldCode: "unit",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.contactPerson").$D("联系人"),
        fieldType: "TEXT",
        fieldCode: "contactPerson",
        formRow: 40,
        formCol: 20,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.contactPhone").$D("联系人电话"),
        fieldType: "TEXT",
        fieldCode: "contactPhone",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.createdByName").$D("申请人"),
        fieldType: "TEXT",
        fieldCode: "createdByName",
        formRow: 60,
        formCol: 10,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.creationDate").$D("申请日期"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
        formRow: 60,
        formCol: 20,
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.pdmResult").$D("导入状态"),
        fieldType: "TEXT",
        fieldCode: "pdmResult",
        formRow: 70,
        formCol: 10,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.attachmentUuid").$D("附件"),
        fieldType: "UPLOAD",
        fieldCode: "attachmentUuid",
        formRow: 70,
        formCol: 20,
        showCount: false,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.applyReason").$D("申请原因"),
        fieldType: "TEXT",
        fieldCode: "applyReason",
        formRow: 80,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.supplierRemark").$D("供方备注"),
        fieldType: "TEXT",
        fieldCode: "supplierRemark",
        formRow: 90,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.purchaseRemark").$D("采方备注"),
        fieldType: "TEXT",
        fieldCode: "purchaseRemark",
        formRow: 100,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.pdmMessage").$D("反馈信息"),
        fieldType: "TEXT",
        fieldCode: "pdmMessage",
        formRow: 110,
      }, ];
    },
    getDetailColumns() {
      return [ {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.itemCode").$D("物料编码"),
        fieldType: "TEXT",
        fieldCode: "itemCode",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.itemName").$D("物料名称"),
        fieldType: "TEXT",
        fieldCode: "itemName",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.supplierStatus").$D("状态"),
        fieldType: "TEXT",
        fieldCode: "supplierTenantId",
        render: (val, item) => item.supplierTenantId === item.tenantId ? item.supplierStatusMeaning : item.purchaseStatusMeaning,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.supplierCompanyName").$D("供应商名称"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyName",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.unit").$D("单位"),
        fieldType: "TEXT",
        fieldCode: "unit",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.contactPerson").$D("联系人"),
        fieldType: "TEXT",
        fieldCode: "contactPerson",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.contactPhone").$D("联系人电话"),
        fieldType: "TEXT",
        fieldCode: "contactPhone",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.createdByName").$D("申请人"),
        fieldType: "TEXT",
        fieldCode: "createdByName",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.creationDate").$D("申请日期"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.pdmResult").$D("导入状态"),
        fieldType: "TEXT",
        fieldCode: "pdmResult",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.attachmentUuid").$D("附件"),
        fieldType: "TEXT",
        fieldCode: "attachmentUuid",
        render: (val) => <srm-upload
          attachment-uuid={val}
          show-icon={false}
          show-count={false}
          desc-title={ this.$T("smbl.common.button.viewAttachment").$D("查看附件") } />,
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.applyReason").$D("申请原因"),
        fieldType: "TEXT",
        fieldCode: "applyReason",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.supplierRemark").$D("供方备注"),
        fieldType: "TEXT",
        fieldCode: "supplierRemark",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.purchaseRemark").$D("采方备注"),
        fieldType: "TEXT",
        fieldCode: "purchaseRemark",
      }, {
        fieldName: this.$T("scux.drawManagement.model.drawManagement.pdmMessage").$D("反馈信息"),
        fieldType: "TEXT",
        fieldCode: "pdmMessage",
      }, ];
    }
  },
  beforeMount() {
    this.requestData();
  },
  methods: {
    async requestData() {
      this.$loading.show();
      let res = await getBaseInfoApi(this.parameters.drawingApplyId);
      this.baseInfo = res || {};
      this.$loading.hide();
    },
    showDetail() {
      this.detailFlag = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
.customize-card {
  padding: 6px 0px 6px 0px;
}
</style>

