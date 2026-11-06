<template>
  <div style="height: 100vh;">
    <div>
      <!-- 内容区域 -->
      <srm-scroll-tab customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.TABS">
        <srm-scroll-tab-item code="basic" :label="$T('sslm.common.view.archiveFilled.baseInfo').$D('基础信息')">
          <srm-list
            :data-set="basisDataSet"
            :columns="getBasisColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.BASIS_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="contact" :label="$T('sslm.supplierWarehouse.view.warehous.contact').$D('联系人')">
          <srm-list
            :data-set="contactDataSet"
            :columns="getContactColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.CONTACT_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="address" :label="$T('sslm.supplierWarehouse.view.warehous.address').$D('地址')">
          <srm-list
            :data-set="addressDataSet"
            :columns="getAddressColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.ADDRESS_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="bank" :label="$T('sslm.supplierWarehouse.view.warehous.bankAccount').$D('银行账户')">
          <srm-list
            :data-set="bankDataSet"
            :columns="getBankColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.BANK_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="attachment" :label="$T('sslm.supplierWarehouse.view.warehous.attachment').$D('附件')">
          <srm-list
            :data-set="attachmentDataSet"
            :columns="getAttachmentColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.ATTACHMENT_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="purchaseHeader" :label="$T('sslm.supplierInform.view.fixCatalog.purchaseHeaderInform').$D('采购/财务头信息')">
          <srm-list
            :data-set="purchaseHeaderDataSet"
            :columns="getPurchaseHeaderColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.PURCHASE_HEADER_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="purchaseLine" :label="$T('sslm.supplierInform.view.fixCatalog.purchaseLineInform').$D('采购/财务行信息')">
          <srm-list
            :data-set="purchaseLineDataSet"
            :columns="getPurchaseLineColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.PURCHASE_LINE_INFO"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </div>
</template>
<script>

import { DataSet, SrmUtil } from "srm-mobile-ui";
import { yesOrNoRenderer } from "@/utils/renderer.js";
import { basicInfoDS, contactDataSet, addressDataSet, bankDataSet, attachmentDataSet, purchaseHeaderDataSet, purchaseLineDataSet } from "../datasource/tabsInfoDS";

export default {
  modules: [ "sslm.supplierWarehouse", "sslm.sample", "sslm.common", "smbl.common", "spfm.importErp", "sslm.supplierInform", "hipspfm.common" ],
  name: "SimpleSupWarehouseDetail",
  components: {
  },
  data() {
    return {
      extSupplierReqId:"", // id
      basisDataSet:{}, // 基础信息
      contactDataSet:{}, // 联系人信息
      addressDataSet:{}, // 地址信息
      bankDataSet:{}, // 银行信息
      attachmentDataSet:{}, // 附件信息
      purchaseHeaderDataSet:{}, // 采购财务信息头
      purchaseLineDataSet:{}, // 采购财务信息行
    };
  },
  computed: {
    // 基础信息
    getBasisColumnsInfo() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applyNum").$D("申请单号"),
          fieldCode: "reqNumber",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applyStatus").$D("申请状态"),
          fieldCode: "reqStatusMeaning",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
          fieldCode: "reqTypeCodeMeaning",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applicant").$D("申请人"),
          fieldCode: "creator",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.unitName").$D("创建人部门"),
          fieldCode: "unitName",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.creationTime").$D("创建时间"),
          fieldCode: "creationDate",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierNum").$D("供应商编码"),
          fieldCode: "supplierNum",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
          fieldCode: "supplierName",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierType").$D("供应商类型"),
          fieldCode: "supplierTypeCodeMeaning",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.idNum").$D("身份证号"),
          fieldCode: "idNum",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.passport").$D("护照"),
          fieldCode: "passport",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.unifiedSocialCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.organizingInstitutionCode").$D("组织机构代码"),
          fieldCode: "organizingInstitutionCode",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.dunCode").$D("邓白氏编码"),
          fieldCode: "dunsCode",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.businessRegistrationNumber").$D("商业注册登记号"),
          fieldCode: "businessRegistrationNumber",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.explain").$D("说明"),
          fieldCode: "remark",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.externalSystem").$D("来源系统"),
          fieldCode: "externalSystemName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.enabledFlag").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
          render: (val) => yesOrNoRenderer(val),
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.termName").$D("付款条款"),
          fieldCode: "termName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.paymentType").$D("付款方式"),
          fieldCode: "typeName",
          fieldType: "TEXT",
        },
      ];
      return columns;
    },
    // 联系人信息
    getContactColumnsInfo() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render:(val, record) => {
            const isDefaultContact = record.defaultFlag ? this.$T("sslm.supplierWarehouse.view.warehous.default").$D("默认") : "";
            const isEnabled = record.enabledFlag ? this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用") : this.$T("sslm.supplierWarehouse.model.warehouse.unEnable").$D("未启用");
            return <srm-flex>
              <srm-button size="mini" type="primary" fill={Boolean(record.defaultFlag)} plain={Boolean(!record.defaultFlag)} rect> { isDefaultContact } </srm-button>
              <srm-button style="margin-left: 5px;" size="mini" type={record.enabledFlag ? "success" : "danger"} fill rect> { isEnabled } </srm-button>
              <span style="margin-left: 5px; font-size: 14px; color: #333333; font-weight: 600"> {record.name} - {record.genderMeaning}</span>
            </srm-flex>;
          }
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.idTypeMeaning").$D("证件类型"),
          fieldCode: "idTypeMeaning",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.documentNumber").$D("证件号码"),
          fieldCode: "idNumber",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.department").$D("所属部门"),
          fieldCode: "department",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.position").$D("职务"),
          fieldCode: "position",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.contactTypeMeaning").$D("联系人类型"),
          fieldCode: "contactTypeMeaning",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.mobilephone").$D("移动电话"),
          fieldCode: "mobilephone",
          fieldType: "TEXT",
          render: (val, record) => val ? record.internationalTelMeaning + " | " + val : ""
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.mail").$D("邮箱"),
          fieldCode: "mail",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.officePhone").$D("办公电话"),
          fieldCode: "officePhone",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT"
        },
      ];
      return columns;
    },
    // 地址信息
    getAddressColumnsInfo() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render:(val, record) => {
            const isEnabled = record.enabledFlag ? this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用") : this.$T("sslm.supplierWarehouse.model.warehouse.unEnable").$D("未启用");
            return <srm-flex>
              <srm-button size="mini" type={record.enabledFlag ? "success" : "danger"} fill rect> { isEnabled } </srm-button>
              <span style="margin-left: 5px; font-size: 14px; color: #333333; font-weight: 600"> {record.addressDetail}</span>
            </srm-flex>;
          }
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.countryIdMeaning").$D("国家/地区"),
          fieldCode: "countryIdMeaning",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.empty.warehouse.regionPathName").$D("省/市/区"),
          fieldCode: "regionPathName",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.postalCode").$D("邮政编码"),
          fieldCode: "postCode",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.addressRemark").$D("地址备注"),
          fieldCode: "remark",
          fieldType: "TEXT"
        },
      ];
      return columns;
    },
    // 银行账号信息
    getBankColumnsInfo() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          render:(val, record) => {
            const isMast = record.masterFlag ? this.$T("sslm.supplierWarehouse.model.warehouse.mainBankAccount").$D("主账户") : "";
            const isEnabled = record.enabledFlag ? this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用") : this.$T("sslm.supplierWarehouse.model.warehouse.unEnable").$D("未启用");
            return <srm-flex>
              <srm-button size="mini" type="primary" fill={Boolean(record.masterFlag)} plain={Boolean(!record.masterFlag)} rect> { isMast } </srm-button>
              <srm-button style="margin-left: 5px;" size="mini" type={record.enabledFlag ? "success" : "danger"} fill rect> { isEnabled } </srm-button>
              <span style="margin-left: 5px; font-size: 14px; color: #333333; font-weight: 600"> {record.bankName}  {record.bankCode}</span>
            </srm-flex>;
          }
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.countryIdMeaning").$D("国家/地区"),
          fieldCode: "countryId",
          fieldType: "TEXT",
          render: (val, record) => record.countryName,
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankFirm").$D("联行行号"),
          fieldCode: "bankFirm",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.openeBankName").$D("开户行名称"),
          fieldCode: "bankBranchName",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankAccount").$D("银行账号"),
          fieldCode: "bankAccountNum",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT"
        },
      ];
      return columns;
    },
    // 附件信息
    getAttachmentColumnsInfo() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.attachmentName").$D("附件名称"),
          fieldCode: "description",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.attachmentSize").$D("附件大小"),
          fieldCode: "fileSize",
          fieldType: "TEXT",
          render:(val) => val ? (Number(val) / 1024 / 1024).toFixed(4) : ""
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.creationDate").$D("上传时间"),
          fieldCode: "creationDate",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.uploadUser").$D("上传人"),
          fieldCode: "uploader",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.view.warehous.attachment").$D("附件"),
          fieldCode: "attachmentUrl",
          fieldType: "TEXT",
          render: (val) => val &&
                <SrmButton
                  plain rect
                  onClick={() => this.$previewImage([ SrmUtil.buildImgUrl(val, SrmUtil.getDefaultBucketName()) ])}>
                  {this.$T("sslm.supplierWarehouse.model.warehouse.look").$D("查看")}
                </SrmButton>
        },
      ];
      return columns;
    },
    // 采购财务头
    getPurchaseHeaderColumnsInfo() {
      const columns = [
        {
          fieldName: this.$T("spfm.importErp.model.importErp.planGroups").$D("计划组"),
          fieldCode: "programmeGroups",
          fieldType: "TEXT",
          render: (val, record) => record.programmeGroupsMeaning,
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.schemeGroup").$D("方案组"),
          fieldCode: "schemeGroup",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.accountGroup").$D("账户组"),
          fieldCode: "accountGroup",
          fieldType: "TEXT",
          render: (val, record) => record.accountGroupMeaning,
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
          fieldCode: "reconciliationAccount",
          fieldType: "TEXT",
          render: (val, record) => record.reconciliationAccountMeaning,
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.erpCompanyCode").$D("erp公司代码"),
          fieldCode: "ouId",
          fieldType: "TEXT",
          render: (val, record) => record.ouCode,
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.termName").$D("付款条款"),
          fieldCode: "termId",
          fieldType: "TEXT",
          render: (val, record) => record.termIdMeaning,
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.accountFlag").$D("记账冻结"),
          fieldCode: "frozenFlag",
          fieldType: "TEXT",
          render: (val) => yesOrNoRenderer(val),
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.paymentFreezeCode").$D("付款冻结代码"),
          fieldCode: "paymentFrozen",
          fieldType: "TEXT",
          render: (val, record) => record.paymentFrozenMeaning,
        },
      ];
      return columns;
    },
    // 采购财务行
    getPurchaseLineColumnsInfo() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.organizationCode").$D("采购组织"),
          fieldCode: "organizationCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.organizationName").$D("采购组织名称"),
          fieldCode: "organizationName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.purchaseAgent").$D("采购员"),
          fieldCode: "purchaseAgentId",
          fieldType: "TEXT",
          render: (val, record) => record.purchaseAgentName,
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.termName").$D("付款条款"),
          fieldCode: "termId",
          fieldType: "TEXT",
          render: (val, record) => record.termName
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.payMethod").$D("付款方式"),
          fieldCode: "typeCode",
          fieldType: "TEXT",
          render: (val, record) => record.typeName
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.internationalCondition").$D("国贸条件"),
          fieldCode: "tradeTerms",
          fieldType: "TEXT",
          render: (val, record) => record.tradeTermsMeaning
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.internationalSite").$D("国贸地点"),
          fieldCode: "tradeTermsSite",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.currencyCode").$D("订单货币"),
          fieldCode: "currencyCode",
          fieldType: "TEXT",
          render: (val, record) => record.currencyName
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
          fieldCode: "reconciliationAccount",
          fieldType: "TEXT",
          render: (val, record) => record.reconciliationAccountMeaning
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.sortNumber").$D("排序码"),
          fieldCode: "sortNumber",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.accountFlag").$D("记账冻结"),
          fieldCode: "frozenFlag",
          fieldType: "TEXT",
          render: (val) => yesOrNoRenderer(val),
        },
      ];
      return columns;
    },
  },
  async beforeMount() {
    this.$loading.show();
    const {
      extSupplierReqId
    } = this.$route.query;
    this.extSupplierReqId = extSupplierReqId;

    // 基础信息
    this.basisDataSet = new DataSet(basicInfoDS(this.extSupplierReqId));
    this.basisDataSet.refresh();

    // 联系人信息
    this.contactDataSet = new DataSet(contactDataSet(this.extSupplierReqId));
    this.contactDataSet.refresh();

    // 地址信息
    this.addressDataSet = new DataSet(addressDataSet(this.extSupplierReqId));
    this.addressDataSet.refresh();

    // 银行信息
    this.bankDataSet = new DataSet(bankDataSet(this.extSupplierReqId));
    this.bankDataSet.refresh();

    // 附件信息
    this.attachmentDataSet = new DataSet(attachmentDataSet(this.extSupplierReqId));
    this.attachmentDataSet.refresh();

    // 采购财务信息头
    this.purchaseHeaderDataSet = new DataSet(purchaseHeaderDataSet(this.extSupplierReqId));
    this.purchaseHeaderDataSet.refresh();

    // 采购财务信息行
    this.purchaseLineDataSet = new DataSet(purchaseLineDataSet(this.extSupplierReqId));
    this.purchaseLineDataSet.refresh();

    this.$loading.hide();
  },
  methods: {
  },
};
</script>

<style lang="stylus" scoped>
</style>