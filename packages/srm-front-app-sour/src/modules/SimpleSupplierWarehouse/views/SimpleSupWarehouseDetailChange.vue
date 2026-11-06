<template>
  <div style="height: 100vh;">
    <div style="height: 80vh;">
      <!-- 内容区域 -->
      <!-- 头信息 -->
      <div v-if="titlePrompt !== ''" class="srm-head-info">
        {{ $T("smbl.common.message.prefix.businessRuleDefinition").$D("当前租户的业务规则定义配置要求") }}{{ titlePrompt }}{{ $T("smbl.common.message.suffix.businessRuleDefinition").$D("至少填写一行数据，请完善信息。") }}
      </div>
      <srm-scroll-tab customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.TABS">
        <srm-scroll-tab-item code="basic" :label="$T('sslm.common.view.archiveFilled.baseInfo').$D('基础信息')">
          <srm-list
            :data-set="basisDataSet"
            :columns="getBasisColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.BASIS_INFO_EDIT"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="initFinallyFlag" code="contact" :show-title="false" :label="$T('sslm.supplierWarehouse.view.warehous.contact').$D('联系人')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("sslm.supplierWarehouse.view.warehous.contact").$D("联系人") }}
            <span class="new">
              <em class="srm-icon icon-plus" @click="addOneContact"/>
            </span>
          </div>
          <srm-list
            :data-set="contactDataSet"
            :columns="getContactColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.CONTACT_INFO_EDIT"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="initFinallyFlag" code="address" :show-title="false" :label="$T('sslm.supplierWarehouse.view.warehous.address').$D('地址')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("sslm.supplierWarehouse.view.warehous.address").$D("地址") }}
            <span class="new">
              <em class="srm-icon icon-plus" @click="addOneAddress"/>
            </span>
          </div>
          <srm-list
            :data-set="addressDataSet"
            :columns="getAddressColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.ADDRESS_INFO_EDIT"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="initFinallyFlag" code="bank" :show-title="false" :label="$T('sslm.supplierWarehouse.view.warehous.bankAccount').$D('银行账户')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("sslm.supplierWarehouse.view.warehous.bankAccount").$D("银行账户") }}
            <span class="new">
              <em class="srm-icon icon-plus" @click="addOneBank"/>
            </span>
          </div>
          <srm-list
            :data-set="bankDataSet"
            :columns="getBankColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.BANK_INFO_EDIT"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="initFinallyFlag" code="attachment" :show-title="false" :label="$T('sslm.supplierWarehouse.view.warehous.attachment').$D('附件')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("sslm.supplierWarehouse.view.warehous.attachment").$D("附件") }}
            <span class="new">
              <em class="srm-icon icon-plus" @click="addOneAttachment"/>
            </span>
          </div>
          <srm-list
            :data-set="attachmentDataSet"
            :columns="getAttachmentColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.ATTACHMENT_INFO_EDIT"/>
          <div :class="hidePurchaseTab ? 'bottom-space-view' : ''" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="initFinallyFlag" code="purchaseHeader" :label="$T('sslm.supplierInform.view.fixCatalog.purchaseHeaderInform').$D('采购/财务头信息')">
          <srm-list
            :data-set="purchaseHeaderDataSet"
            :columns="getPurchaseHeaderColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.PURCHASE_HEADER_INFO_EDIT"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="initFinallyFlag" code="purchaseLine" :show-title="false" :label="$T('sslm.supplierInform.view.fixCatalog.purchaseLineInform').$D('采购/财务行信息')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("sslm.supplierInform.view.fixCatalog.purchaseLineInform").$D("采购/财务行信息") }}
            <span class="new">
              <em class="srm-icon icon-plus" @click="addOnePurchaseLine"/>
            </span>
          </div>
          <srm-list
            :data-set="purchaseLineDataSet"
            :columns="getPurchaseLineColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.PURCHASE_LINE_INFO_EDIT"/>
          <div class="bottom-space-view" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 基础信息详情 -->
    <srm-popup :visible.sync="basisPop" :title="$T('sslm.common.view.archiveFilled.baseInfo').$D('基础信息')" height="100%" position="right" :show-back="true">
      <customize-detail v-if="basisDataSet.data" ref="basisDetailRef" style="padding: 0 15px" :columns="getBasisColumnsInfoDetail" :data-source="basisDataSet.data[0]" code="SMBL.SIMPLE_SUP_WAREHOUSE.BASIS_DETAIL_INFO_EDIT"/>
      <srm-bottom-handler :btn-arr="getDetailBtnArr('basis')" type="tooltip"/>
      <div class="bottom-space-view" />
    </srm-popup>
    <!-- 联系人信息详情 -->
    <srm-popup :visible.sync="contactPop" :title="$T('sslm.supplierWarehouse.view.warehous.contact').$D('联系人')" height="100%" position="right" :show-back="true">
      <customize-detail ref="contactDetailRef" style="padding: 0 15px" :columns="getContactColumnsInfoDetail" :data-source="contaDetailctInfo" code="SMBL.SIMPLE_SUP_WAREHOUSE.CONTACT_DETAIL_INFO_EDIT"/>
      <srm-bottom-handler :btn-arr="getDetailBtnArr('contact')" type="tooltip"/>
      <div class="bottom-space-view" />
    </srm-popup>
    <!-- 省、市、区 -->
    <srm-popup :visible.sync="regionsLinkagePop" height="100%" position="right" :show-back="true">
      <srm-tree
        v-if="asyncListData.length > 0"
        v-model="selectedData"
        height="80%"
        :data="asyncListData"
        tab-key="regionName"
        primary-key="regionId"
        data-format="LIST"
        :render-fn="renderAsyncItem"
        :load-function="loadChildren"
        :checkbox-enable="true"
        :show-checkbox="true"
        :show-tab="false"
        show-header/>
      <div class="srm-tree-foot-wrapper">
        <span class="srm-tree-foot-msg-info">
          <!-- {{
            $T("smbl.common.validation.multiple").$D("该选择为多选")
          }} -->
        </span>
        <srm-button fill size="large" @click="onSelect">
          {{ $T("smbl.common.validation.confirmSelect").$D("确认选择") }}
        </srm-button>
      </div>
    </srm-popup>
    <srm-bottom-handler :btn-arr="getBtnArr" type="tooltip"/>
  </div>
</template>
<script>

import { DataSet, SrmUtil } from "srm-mobile-ui";
import { getFields, getCustomizeFields } from "@/utils/utils";
import { isEmpty } from "lodash";
import indexMix from "../mixins/index";
// import RegionsLinkage from "../components/RegionsLinkage";
import { commonDs, basicInfoDS, contactDataSet, addressDataSet, bankDataSet, attachmentDataSet, purchaseHeaderDataSet, purchaseLineDataSet } from "../datasource/tabsInfoDS";
import { saveSupplierInfoApi,
  getSupplierInfoApi,
} from "../api/index";

export default {
  modules: [ "smbl.common", "sslm.supplierWarehouse", "smbl.small", "hzero.common", "sslm.common", "sslm.siteInvestigateReport", "spfm.importErp", "sslm.supplierInform" ],
  name: "SimpleSupWarehouseDetailAdd",
  components: {
  },
  mixins: [ indexMix ],
  data() {
    return {
      titlePrompt:"",
      supplierId:"", // id
      // operationType:"", // 类型（新建:new/编辑:edit）
      basisDataSet:new DataSet(commonDs()), // 基础信息
      contactDataSet:new DataSet(contactDataSet()), // 联系人信息
      addressDataSet:new DataSet(addressDataSet()), // 地址信息
      bankDataSet:new DataSet(bankDataSet()), // 银行信息
      attachmentDataSet:new DataSet(attachmentDataSet()), // 附件信息
      purchaseHeaderDataSet:new DataSet(purchaseHeaderDataSet()), // 采购财务信息头
      purchaseLineDataSet:new DataSet(purchaseLineDataSet()), // 采购财务信息行
      basisDetailInfo:{}, // 基础详情信息
      contaDetailctInfo:{}, // 联系人详情信息
      basisPop:false,
      contactPop:false,
      bankList:[],
      asyncListData: [],
      selectedData: [],
      mustInputTabs:"", // 必输页签
      regionsLinkagePop:false,
      regionPathList:[], // 省、市、区路径数组
      regionIds:[], // 省、市、区id数组
      curRegionPathName:"", //省、市、区描述
      checkMode: "noCheck", // 业务规则定义银行名称校验方式
      initFinallyFlag: false, // 初始化完成标识
    };
  },
  computed: {
    // 按钮
    // getBtnArr() {
    //   return [
    //     {
    //       title: this.$T("smbl.common.button.save").$D("保存"),
    //       handler: () => this.handlerPre("save")
    //     },
    //     {
    //       title: this.$T("smbl.common.button.submit").$D("提交"),
    //       handler: () => this.handlerPre("submit"),
    //       fill: true
    //     },
    //     {
    //       title: this.$T("smbl.common.button.delete").$D("删除"),
    //       handler: () => this.handlerPre("delete")
    //     },
    //   ];
    // },
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
          fieldCode: "reqStatus",
          fieldType: "SELECT",
          lovCode: "SSLM.EXTERNAL_SUP_REQ_STATUS",
          displayField: "reqStatusMeaning",
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
          disabled:true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
          fieldCode: "reqTypeCode",
          fieldType: "SELECT",
          lovCode: "SSLM.EXTERNAL_SUP_REQ_TYPE",
          displayField: "reqTypeCodeMeaning",
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
          disabled:true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applicant").$D("申请人"),
          fieldCode: "creator",
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
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
          fieldCode: "supplierName",
          fieldType: "INPUT",
          required: true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierType").$D("供应商类型"),
          fieldCode: "supplierTypeCode",
          fieldType: "SELECT",
          lovCode: "SSLM.SUPPLIER_TYPE_CODE",
          // displayField: "supplierTypeCodeMeaning",
          required: true,
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button type="primary" fill onClick={() => this.goToBasisDetail(record)}> { this.$T("smbl.common.button.moreDetails").$D("更多详情") } </srm-button>
          </srm-flex>
        },
      ];
      return columns;
    },
    // 基础信息详情
    getBasisColumnsInfoDetail() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applyNum").$D("申请单号"),
          fieldCode: "reqNumber",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applyStatus").$D("申请状态"),
          fieldCode: "reqStatus",
          fieldType: "SELECT",
          lovCode: "SSLM.EXTERNAL_SUP_REQ_STATUS",
          displayField: "reqStatusMeaning",
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
          disabled:true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
          fieldCode: "reqTypeCode",
          fieldType: "SELECT",
          lovCode: "SSLM.EXTERNAL_SUP_REQ_TYPE",
          displayField: "reqTypeCodeMeaning",
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
          disabled:true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applicant").$D("申请人"),
          fieldCode: "creator",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.unitName").$D("创建人部门"),
          fieldCode: "unitId",
          displayField: "unitName",
          fieldType: "LOV",
          lovCode: "SPRM.USER_UNIT",
          options: {
            displayField: "unitName",
            subDisplayField: "unitCode",
            valueField: "unitId",
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.creationTime").$D("创建时间"),
          fieldCode: "creationDate",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierNum").$D("供应商编码"),
          fieldCode: "supplierNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
          fieldCode: "supplierName",
          fieldType: "INPUT",
          required: true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierType").$D("供应商类型"),
          fieldCode: "supplierTypeCode",
          fieldType: "SELECT",
          lovCode: "SSLM.SUPPLIER_TYPE_CODE",
          // displayField:"supplierTypeCodeMeaning",
          required: true,
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.idNum").$D("身份证号"),
          fieldCode: "idNum",
          fieldType: "INPUT",
          required:(val, record) => record.supplierTypeCode === "INDIVIDUAL_SUPPLIER" && (typeof record.passport === "undefined" || record.passport === "" || record.passport === null),
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.passport").$D("护照"),
          fieldCode: "passport",
          fieldType: "INPUT",
          required:(val, record) => record.supplierTypeCode === "INDIVIDUAL_SUPPLIER" && (typeof record.idNum === "undefined" || record.idNum === "" || record.idNum === null),
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.unifiedSocialCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.organizingInstitutionCode").$D("组织机构代码"),
          fieldCode: "organizingInstitutionCode",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.dunCode").$D("邓白氏编码"),
          fieldCode: "dunsCode",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.businessRegistrationNumber").$D("商业注册登记号"),
          fieldCode: "businessRegistrationNumber",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.explain").$D("说明"),
          fieldCode: "remark",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.externalSystem").$D("来源系统"),
          fieldCode: "externalSystemCode",
          displayField: "externalSystemName",
          fieldType: "LOV",
          lovCode: "SITF.ES_RELATIONS",
          required: true,
          options: {
            displayField: "externalSystemName",
            valueField: "externalSystemCode",
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.enabledFlag").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "SELECT",
          lovCode: "HPFM.FLAG",
          displayField:"enabledFlagMeaning",
          options: {
            displayField: "meaning",
            valueField: "value",
          },
        },
        {
          fieldName: this.$T("spfm.importErp.model.importErp.termName").$D("付款条款"),
          fieldCode: "termId",
          fieldType: "LOV",
          lovCode: "SMDM.PAYMENT.TERM",
          displayField:"termName",
          options: {
            displayField: "termName",
            valueField: "termId",
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.paymentType").$D("付款方式"),
          fieldCode: "paymentTypeCode",
          fieldType: "LOV",
          lovCode: "SMDM.PAYMENT_TYPE_CODE",
          displayField:"typeName",
          options: {
            displayField: "typeName",
            valueField: "typeCode",
          },
        },
      ];
      return columns;
    },
    // 联系人信息
    getContactColumnsInfo() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.name").$D("姓名"),
          fieldCode: "name",
          fieldType: "INPUT",
          required: true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.mobilephone").$D("移动电话"),
          fieldCode: "mobilephone",
          fieldType: "INPUT_NUMBER",
          required: true,
          prefixField:{
            lovCode:"HPFM.IDD",
            defaultValue:{ value: "+86", meaning:this.$T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
            // displayField:"internationalTelCodeMeaning",
            fieldCode:"internationalTelCode",
            fieldType: "SELECT"
          },
          validator: (val) => {
            if (val !== null && val !== "") {
              if (!SrmUtil.isMobileNumber(val)) {
                return this.$T("smbl.small.message.sale.notMobile.customerMobilePhone").$D("手机号码格式不正确！");
              }
            }
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.defaultContact").$D("默认联系人"),
          fieldCode: "defaultFlag",
          fieldType: "SWITCH",
          defaultValue:"0"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "SWITCH",
          defaultValue:"1"
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button style="margin-right: 5px" type="primary" size="mid" bordered onClick={() => this.deleteCheck("contact", record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button>
            <srm-button type="primary" fill onClick={() => this.goToContactDetail(record)}> { this.$T("smbl.common.button.moreDetails").$D("更多详情") } </srm-button>
          </srm-flex>
        },
      ];
      return columns;
    },
    // 联系人信息详情
    getContactColumnsInfoDetail() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.name").$D("姓名"),
          fieldCode: "name",
          fieldType: "INPUT",
          required: true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.gender").$D("性别"),
          fieldCode: "gender",
          fieldType: "SELECT",
          lovCode: "HPFM.GENDER",
          displayField: "genderMeaning",
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.idTypeMeaning").$D("证件类型"),
          fieldCode: "idType",
          fieldType: "SELECT",
          lovCode: "SPFM.ID_TYPE",
          displayField:"idTypeMeaning",
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.documentNumber").$D("证件号码"),
          fieldCode: "idNumber",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.department").$D("所属部门"),
          fieldCode: "department",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.position").$D("职务"),
          fieldCode: "position",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.contactTypeMeaning").$D("联系人类型"),
          fieldCode: "contactType",
          fieldType: "SELECT",
          lovCode: "SSLM.CONTACT_TYPE",
          displayField:"contactTypeMeaning",
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.mobilephone").$D("移动电话"),
          fieldCode: "mobilephone",
          fieldType: "INPUT_NUMBER",
          required: true,
          prefixField:{
            lovCode:"HPFM.IDD",
            defaultValue:{ value: "+86", meaning:this.$T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
            // displayField:"internationalTelCodeMeaning",
            fieldCode:"internationalTelCode",
            fieldType: "SELECT"
          },
          validator: (val) => {
            if (val !== null && val !== "") {
              if (!SrmUtil.isMobileNumber(val)) {
                return this.$T("smbl.small.message.sale.notMobile.customerMobilePhone").$D("手机号码格式不正确！");
              }
            }
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.mail").$D("邮箱"),
          fieldCode: "mail",
          fieldType: "INPUT",
          validator: (val) => {
            // eslint-disable-next-line no-useless-escape
            const mailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (val !== null && val !== "") {
              if (!mailPattern.test(val)) {
                return this.$T("smbl.common.message.mailFormatIncorrect!").$D("邮箱格式不正确！");
              }
            }
          },
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.officePhone").$D("办公电话"),
          fieldCode: "officePhone",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.defaultContact").$D("默认联系人"),
          fieldCode: "defaultFlag",
          fieldType: "SWITCH",
          defaultValue:"0"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "SWITCH",
          defaultValue:"1"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT_AREA"
        },
      ];
      return columns;
    },
    // 地址信息
    getAddressColumnsInfo() {
      const columns = [
        {
          fieldCode: "countryId",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.empty.warehouse.regionPathName").$D("省/市/区"),
          fieldCode: "regionPathName",
          fieldType: "EMPTY",
          render: (val, record, field) => {
            // field中有字段属性，个性化配置的属性会覆盖代码属性
            const { fieldName, editable, required } = field || {};
            const requiredFlag = required === 1;
            const disabledFlag = editable === 0;
            return <srm-flex justify="between" style="background: #EFF3FE; padding: 0 4px 0 3px;">
              <span>
                <span>{fieldName || this.$T("sslm.supplierWarehouse.model.empty.warehouse.regionPathName").$D("省/市/区")}</span>
                {requiredFlag && <span style="color: red">*</span>}：
                <span>{ record.regionPathName }</span>
              </span>
              <srm-button icon="icon-chevron-right" disabled={disabledFlag} plain type="brown" size="small" rect onClick={() => this.editRegionsLinkage(record)}/>
            </srm-flex>;
          }
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.detailedAddress").$D("详细地址"),
          fieldCode: "addressDetail",
          fieldType: "INPUT",
          required: true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.postalCode").$D("邮政编码"),
          fieldCode: "postCode",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.addressRemark").$D("地址备注"),
          fieldCode: "remark",
          fieldType: "INPUT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "SWITCH",
          defaultValue:"1"
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button style="margin-right: 5px" fill type="primary" onClick={() => this.deleteCheck("address", record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button>
          </srm-flex>
        },
      ];
      return columns;
    },
    // 银行账号信息
    getBankColumnsInfo() {
      const columns = [
        {
          fieldCode: "countryId",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankCode").$D("银行代码"),
          fieldCode: "bankId",
          render:(val, record) => record.bankCode,
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankName").$D("银行名称"),
          fieldCode: "bankName",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankFirm").$D("联行行号"),
          fieldCode: "bankFirm",
          displayField: "bankFirm",
          fieldType: "LOV",
          lovCode: "SMDM.BANK_BRANCK_FIRM_TENANT",
          options: {
            displayField: "bankFirm",
            subDisplayField: "depositBank",
            valueField: "bankFirm",
            queryParams:{
              bankId: this.getBankId(),
            },
            onClear: (ds) => {
              const {
                bankBranchId,
                bankBranchName,
                bankId,
                bankCode,
                bankName,
              } = getFields(ds, [
                "bankBranchId",
                "bankBranchName",
                "bankId",
                "bankCode",
                "bankName",
              ]);
              bankBranchId?.setData(null);
              bankBranchName?.setData(null);
              bankId?.setData(null);
              bankCode?.setData(null);
              bankName?.setData(null);
            },
            callback: (val, fieldCode, display, ds) => {
              let item = {};
              if (val.length) {
                item = val[0];
              }
              const {
                bankBranchId,
                bankBranchName,
                bankId,
                bankCode,
                bankName,
              } = getFields(ds, [
                "bankBranchId",
                "bankBranchName",
                "bankId",
                "bankCode",
                "bankName",
              ]);
              bankBranchId?.setData(item.bankBranchId);
              bankBranchName?.setData(item.bankBranchName);
              bankId?.setData(item.bankId);
              bankCode?.setData(item.bankCode);
              bankName?.setData(item.bankName);
            },
          },
          required: true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.openeBankName").$D("开户行名称"),
          fieldCode: "bankBranchName",
          fieldType: "TEXT"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
          fieldType: "INPUT",
          required: true
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankAccount").$D("银行账号"),
          fieldCode: "bankAccountNum",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用"),
          fieldCode: "enabledFlag",
          fieldType: "SWITCH",
          defaultValue:"1"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.mainAccount").$D("主账号"),
          fieldCode: "masterFlag",
          fieldType: "SWITCH",
          defaultValue:"0"
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "INPUT"
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button style="margin-right: 5px" fill type="primary" onClick={() => this.deleteCheck("bank", record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button>
          </srm-flex>
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
          fieldType: "INPUT"
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => {
            const { description } = record || {};
            const fileType = !isEmpty(description) ? description.split(".").reverse()[0].toLowerCase() : "";
            // 视频文件不可预览
            const previewFlag = !isEmpty(fileType) && ![ "mp4", "m4v", "mov", "qt", "avi", "flv", "wmv", "asf", "mkv", "asf", "rm", "rmvb", "vob", "ts", "dat", "mpeg", "mpg", "vob" ].includes(fileType);
            return <srm-flex justify="end">
              <srm-button type="primary" size="mid" bordered onClick={() => this.deleteCheck("attachment", record)}>
                { this.$T("smbl.common.button.delete").$D("删除") }
              </srm-button>
              <srm-button class="att-button" size="mid" bordered onClick={() => {
                this.$downloadFile(record.attachmentUrl, SrmUtil.getDefaultBucketName(), "sslm-common");
              }}>
                {this.$T("smbl.common.view.button.download").$D("下载")}
              </srm-button>
              {previewFlag && <srm-button class="att-button" size="mid" fill bordered onClick={() => {
                SrmUtil.previewFile({
                  fileName: record.description,
                  fileUrl: record.attachmentUrl,
                  bucketName: SrmUtil.getDefaultBucketName(),
                });
              }}>
                {this.$T("hzero.common.preview").$D("预览")}
              </srm-button>}
            </srm-flex>;
          }
        },
      ];
      return columns;
    },
    // 采购财务头信息
    getPurchaseHeaderColumnsInfo() {
      const columns = [
        {
          fieldCode: "programmeGroups",
        },
        {
          fieldCode: "schemeGroup",
        },
        {
          fieldCode: "accountGroup",
        },
        {
          fieldCode: "reconciliationAccount",
        },
        {
          fieldCode: "ouId",
        },
        {
          fieldCode: "termId",
        },
        {
          fieldCode: "frozenFlag",
        },
        {
          fieldCode: "paymentFrozen",
        },
      ];
      return columns;
    },
    // 采购财务行信息
    getPurchaseLineColumnsInfo() {
      const columns = [
        {
          fieldCode: "organizationCode",
        },
        {
          fieldCode: "organizationName",
        },
        {
          fieldCode: "purchaseAgentId",
        },
        {
          fieldCode: "termId",
        },
        {
          fieldCode: "typeCode",
        },
        {
          fieldCode: "tradeTerms",
        },
        {
          fieldCode: "tradeTermsSite",
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "reconciliationAccount",
        },
        {
          fieldCode: "sortNumber",
        },
        {
          fieldCode: "frozenFlag",
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button style="margin-right: 5px" type="primary" size="mid" bordered onClick={() => this.deleteCheck("purchaseLine", record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button>
          </srm-flex>
        },
      ];
      return columns;
    },
  },
  async beforeMount() {
    this.$loading.show();
    const {
      supplierId
    } = this.$route.query;
    this.supplierId = supplierId;
    //（新建:new/变更:edit）
    // this.operationType = operationType;
    this.getBankInfo();
    // 载入业务规则配置
    this.getRequiredTabsInfo();
    // 获取规则定义银行名称校验方式
    this.queryCheckMode();
    try {
      this.getSupplierInfo(supplierId);
    } catch (err) {
      this.$loading.hide();
      // eslint-disable-next-line no-console
      console.log(err, "error");
    } finally {
      this.$loading.hide();
      // 解决ds刷新过慢，导致表格中传入的并非最新创建ds，导致ds获取不到current问题
      this.initFinallyFlag = true;
    }
    this.$loading.hide();
  },
  methods: {
    // 获取简易供应商信息
    async getSupplierInfo(supplierId) {
      const params = {
        customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.BASIC_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.BANK_ACCOUNT,SSLM.EASY_SUPPLIER_WAREHOUSE.CONTACT_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ADDRESS_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ATTACHMENT"
      };
      this.$loading.show();
      await getSupplierInfoApi(supplierId, params).then((res) => {
        const curReqStatusMeaning = this.$T("smbl.common.view.add").$D("新建");
        const curReqTypeCodeMeaning = this.$T("smbl.common.view.changeInformation").$D("变更信息");
        if (res && !res.failed) {
          const basisInfo = {
            ...res,
            reqStatus: "NEW",
            reqStatusMeaning: curReqStatusMeaning,
            reqTypeCodeMeaning: curReqTypeCodeMeaning,
            reqTypeCode: "SUP_UPDATE_REQ",
            _status: "create",
            // supplierName:"",
            // supplierTypeCode:"",
          };
          //基础信息
          this.basisDataSet?.setData([ basisInfo ]);
          // 联系人信息
          this.contactDataSet?.setData(res.extSupplierContactReqs || []);
          // 地址信息
          this.addressDataSet?.setData(res.extSupplierAddressReqs || []);
          // 银行信息
          this.bankDataSet?.setData(res.extSupBkAccountReqs || []);
          // 附件信息
          this.attachmentDataSet?.setData(res.extSupplierAttachmentReqs || []);
          // 采购财务信息头
          this.purchaseHeaderDataSet?.setData([ res.extSupplierPfReq ] || []);
          // 采购财务信息行
          this.purchaseLineDataSet?.setData(res.extSupplierPfLineReqs || []);
        }
        // 查询采购/财务行是否展示
        const tabsUnitCode = "SMBL.SIMPLE_SUP_WAREHOUSE.TABS";
        this.tabsCuz = getCustomizeFields([ tabsUnitCode ], tabsUnitCode);
        this.$loading.hide();
      });
    },
    // 加载dataset
    fetchDataSet() {
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
    },
    // 保存
    save() {
      const params = this.buildParams("save");
      this.$loading.show();
      saveSupplierInfoApi(params).then((res) => {
        if (res.failed && res.message) {
          this.$notification.open({
            message: res.message,
            duration: 1500,
          });
          this.$loading.hide();
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.save.success").$D(
              "保存成功"
            ),
            duration: 1000,
          });
          this.$loading.hide();
          //刷新数据
          this.extSupplierReqId = res.extSupplierReqId;
          this.$router.push({
            name: "SimpleSupWarehouseDetailAdd",
            query: {
              extSupplierReqId: res.extSupplierReqId,
              operationType:"edit"
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

.srm-head-info{
  background: #EFF3FE;
  padding:5px 20px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: var(--color-other-default-b);
  line-height: 20px;
  font-weight: 500;
}
.att-button {
  margin-left: 5px;
}

.bottom-space-view {
  height: 120px;
  height: calc(120px + constant(safe-area-inset-bottom));
  height: calc(120px + env(safe-area-inset-bottom));
}

.srm-tree-foot-wrapper {
  height 60px;
  background var(--background-color-empty);
  padding-right 15px;
  padding-left 15px;
  z-index 9999;
  width 100%;
  position fixed;
  bottom 0;
  display flex;
  justify-content space-between;
  align-items center;
}

.srm-tree-foot-msg-info {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #c6cad6;
  letter-spacing: 0;
  line-height: 24px;
  border-right: none;
  text-align: left;
  height: auto;
}

>>> .srm-scroll-tab-item-title .srm-check-box-button-checked-checkbox {
  padding-top: 0 !important;
}
</style>
