<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.TargetedBargaining3sbio.view.baseInfoDetail').$D('定向议价明细')">
        <srm-form :data-set="headerDataDs" :columns="getBaseInfoColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { headerDs } from "../datasource/index";
export default {
  modules: [ "hipspfm.common", "scux.TargetedBargaining3sbio" ],
  name: "TargetedBargaining3sbio",
  components: {},
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerDataDs: new DataSet(headerDs()),
    };
  },
  computed: {
    getBaseInfoColumns() {
      return [
        {
          fieldCode: "documentNum",
          fieldName: $T("scux.TargetedBargaining3sbio.model.documentNum").$D("单据编号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "title",
          fieldName: $T("scux.TargetedBargaining3sbio.model.title").$D("标题"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "createByName",
          fieldName: $T("scux.TargetedBargaining3sbio.model.createByName").$D("创建人"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("scux.TargetedBargaining3sbio.model.creationDate").$D("创建时间"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "companyIdMeaning",
          fieldName: $T("scux.TargetedBargaining3sbio.model.companyIdMeaning").$D("公司"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "categoryMeaning",
          fieldType: "TEXT",
          fieldName: $T("scux.TargetedBargaining3sbio.model.category").$D("定向议价申请类别"),
        },
        {
          fieldCode: "supplierCompanyIdMeaning",
          fieldName: $T("scux.TargetedBargaining3sbio.model.supplierCompanyIdMeaning").$D("供应商名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "supplierContacts",
          fieldName: $T("scux.TargetedBargaining3sbio.model.supplierContacts").$D("供应商联系人"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "supplierContactPhoneNum",
          fieldName: $T("scux.TargetedBargaining3sbio.model.supplierContactPhoneNum").$D("供应商联系人手机号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "validDateTo",
          fieldName: $T("scux.TargetedBargaining3sbio.model.validDateTo").$D("定向议价供应商审批有效期至"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "annualTotalAmount",
          fieldName: $T("scux.TargetedBargaining3sbio.model.annualTotalAmount").$D("年度预估总额"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "currencyMeaning",
          fieldName: $T("scux.TargetedBargaining3sbio.model.currencyMeaning").$D("币种"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "materialCategoryMeaning",
          fieldName: $T("scux.TargetedBargaining3sbio.model.materialCategory").$D("物料品类"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "reason",
          fieldName: $T("scux.TargetedBargaining3sbio.model.reason").$D("申请原因"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "notes",
          fieldName: $T("scux.TargetedBargaining3sbio.model.notes").$D("备注"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("scux.TargetedBargaining3sbio.model.attachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
        },
      ];
    },
  },
  created() {
    this.headerDataDs.setQueryParameter({ "documentId": this.changeReqId });
    this.headerDataDs.refresh();
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="stylus" scoped>
.srm-form{
  min-height: 10vh;
}
table{
  width:100%;
}
table,table tr th, table tr td {
  border:1px solid #1f1f1f;
  text-align: center;
}
td {
  height: 30px;
  a {
    color: #00BFBF;
  }
  .srm-check-box{
    margin-top: 5px;
  }
}
</style>
