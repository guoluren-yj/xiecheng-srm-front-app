<!--
 * @平台级变更确认详情页面
 * @Author: ZLH
 * @Date: 2022-07-06 19:13:32
 * @LastEditors: ZLH
 * @LastEditTime: 2022-07-14 15:35:50
 * @Description: 平台级企业信息变更确认页签全部固定：登记信息、注册业务信息、联系人信息、地址信息、银行信息、开票信息、财务状况、附件信息
-->
<template>
  <div style="height: 100vh;">
    <div>
      <!-- 内容区域 -->
      <srm-scroll-tab style="height: 90vh;">
        <srm-blank size="1px" theme="fill"/>
        <srm-flex style="height: 40px">
          <srm-button :class="currentButtonTab === 0 ? 'srm-button-on-change' : 'srm-button-no-change'" style="margin-left: 20px" @click="tabIndexChange(0)"> {{ $T('sslm.enterpriseInform.view.title.beforeChange').$D('变更前') }}</srm-button>
          <srm-button :class="currentButtonTab === 1 ? 'srm-button-on-change' : 'srm-button-no-change'" style="margin-left: 8px" @click="tabIndexChange(1)"> {{ $T('sslm.enterpriseInform.view.title.afterChange').$D('变更后') }}</srm-button>
        </srm-flex>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.title.changeInfoForm').$D('变更单信息')">
          <srm-list
            :data-set="basisDataSet"
            :columns="getBasisColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_BASIS_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.fixCatalog.registInform').$D('登记信息')">
          <srm-list
            :data-set="registDataSet"
            :columns="getRegistColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_REGIST_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.fixCatalog.registeBusinessInform').$D('注册业务信息')">
          <srm-list
            :data-set="regBusinessDataSet"
            :columns="getRegBusinessColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_REG_BUSINESS_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.fixCatalog.contactInform').$D('联系人信息')">
          <srm-list
            :data-set="contactDataSet"
            :columns="getContactColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_CONTACT_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.model.address.title:').$D('地址信息')">
          <srm-list
            :data-set="addressDataSet"
            :columns="getAddressColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_ADDRESS_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.fixCatalog.bankInform').$D('银行信息')">
          <srm-list
            :data-set="bankDataSet"
            :columns="getBankColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_BANK_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.fixCatalog.invoiceInform').$D('开票信息')">
          <srm-list
            :data-set="invoiceDataSet"
            :columns="getInvoiceColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_INVOICE_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.model.financialStatus.title').$D('财务状况')">
          <srm-list
            :data-set="financialDataSet"
            :columns="getFinancialColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_FINANCIAL_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sslm.enterpriseInform.view.model.attachmentInfo.title').$D('附件信息')">
          <srm-list
            :data-set="attachmentDataSet"
            :columns="getAttachmentColumnsInfo"
            :scrollable="false"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLAT_ATTACHMENT_INFO"/>
          <div :class="showBtnFlag ? 'bottom-space-view-with-btn' : 'bottom-space-view'"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
      <srm-bottom-handler v-if="showBtnFlag" :btn-arr="getBtnArr()" />}
    </div>
  </div>
</template>
<script>

import { DataSet, SrmUtil } from "srm-mobile-ui";
import tabsColumns from "../mixins/tabsColumns";
import { commonDs } from "../datasource/tabsInfoDS";
import {
  getPlatformBasicInfoApi,
  getPlatformBusinessInfoApi,
  getPlatformInvoiceInfoApi,
  getPlatformContactInfoApi,
  getPlatformBankInfoApi,
  getPlatformAddressInfoApi,
  getPlatformFinanceInfoApi,
  getPlatformAttachmentInfoApi,
  getBasisInfoApi,
  batchOkApi,
} from "../api";

export default {
  modules: [ "sslm.supplierWarehouse", "sslm.enterpriseInform", "smbl.common", "sslm.supplierDetail", "sslm.common", "hipspfm.common" ],
  name: "EnterpriseInformConfirmDetail",
  components: {
  },
  mixins:[ tabsColumns, ],
  data() {
    return {
      changeReqId:"", // id
      changeConfirmId:null,
      platformConfirmNewestFlag:null,
      currentButtonTab: 1, // 0:变更前 | 1：变更后
      domesticForeignRelationOld:1, //认证地区(境内:1 | 境外：0 | 个人：2)
      domesticForeignRelationNew:1, //认证地区(境内:1 | 境外：0 | 个人：2)
      dataSource: 1, // 1企业信息变更 2供应商信息变更
      basisDataSet:new DataSet(commonDs()), // 基础信息
      basisInfo:{}, // 基础信息
      showBtnFlag: false,
      oldRegistDataList: [], // 登记信息（旧）
      newRegistDataList: [], // 登记信息（新）
      registDataSet:new DataSet(commonDs()),
      oldRegBusinessList: [], // 注册业务信息（旧）
      newRegBusinessList: [], // 注册业务信息（新）
      regBusinessDataSet:new DataSet(commonDs()),
      oldInvoiceList: [], // 开票信息（旧）
      newInvoiceList: [], // 开票信息（新）
      invoiceDataSet:new DataSet(commonDs()),
      oldContactList: [], // 联系人信息（旧）
      newContactList: [], // 联系人信息（新）
      contactDataSet:new DataSet(commonDs()),
      oldBanktList: [], // 银行信息（旧）
      newBankList: [], // 银行信息（新）
      bankDataSet:new DataSet(commonDs()),
      oldAddressList: [], // 地址信息（旧）
      newAddressList: [], // 地址信息（新）
      addressDataSet:new DataSet(commonDs()),
      oldFinancialList: [], // 财务状况（旧）
      newFinancialList: [], // 财务状况（新）
      financialDataSet:new DataSet(commonDs()),
      oldAttachmentList: [], // 附件信息（旧）
      newAttachmentList: [], // 附件信息（新）
      attachmentDataSet:new DataSet(commonDs()),
    };
  },
  computed: {
  },
  async beforeMount() {
    this.$loading.show();
    const {
      changeReqId,
      companyId,
      partnerTenantId,
      changeConfirmId,
      platformConfirmNewestFlag,
    } = this.$route.query;
    this.changeReqId = changeReqId;
    this.companyId = companyId;
    this.partnerTenantId = partnerTenantId;
    this.changeConfirmId = changeConfirmId;
    this.platformConfirmNewestFlag = platformConfirmNewestFlag;

    // 基础信息
    this.getBasisInfo();

    // 加载tab页数据
    this.fetchDatas();

    this.$loading.hide();
  },
  methods: {
    // 操作按钮
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.ok").$D("确认"),
          type: "primary",
          fill: true,
          bordered: true,
          handler: () => {
            this.handlerOkOperation();
          },
        },
      ];
    },
    // 处理确认操作
    handlerOkOperation() {
      // 确认
      this.$dialog({
        content: this.$T("hipspfm.common.button.confirm").$D("确认") + "？",
        onOk: () => {
          this.bathOk();
        },
      });
    },
    // 批量审批通过
    bathOk() {
      this.$loading.show();
      const selected = [ { ...this.basisInfo, changeConfirmId:this.changeConfirmId } ];
      const params = selected;
      batchOkApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          // 返回列表页
          setTimeout(() => this.$router.replace({ name: "EnterpriseInformConfirmList" }), 1000);
        }
      }).finally(() => this.$loading.hide());
    },
    // 附件预览
    preview(fileName, fileUrl) {
      const file = {
        fileName:fileName,
        fileUrl:fileUrl,
        bucketName:SrmUtil.getDefaultBucketName(),
      };
      SrmUtil.previewFile(file);
    },
    // 切换tab
    tabIndexChange(index) {
      this.currentButtonTab = index;
      this.refreshAllDataSet();
    },
    // 初始化数据
    fetchDatas() {
      this.getBasicInfo();
      this.getBusinesscInfo();
      this.getInvoiceInfo();
      this.getContactInfo();
      this.getBankInfo();
      this.getAddressInfo();
      this.getFinanceInfo();
      this.getAttachmentInfo();
    },
    // 变更前|变更后 数据切换
    refreshAllDataSet() {
      this.registDataSet = new DataSet(commonDs());
      this.regBusinessDataSet = new DataSet(commonDs());
      this.invoiceDataSet = new DataSet(commonDs());
      this.contactDataSet = new DataSet(commonDs());
      this.bankDataSet = new DataSet(commonDs());
      this.addressDataSet = new DataSet(commonDs());
      this.financialDataSet = new DataSet(commonDs());
      this.attachmentDataSet = new DataSet(commonDs());
      if (this.currentButtonTab === 0) {
        this.registDataSet.setData(this.oldRegistDataList);
        this.regBusinessDataSet.setData(this.oldRegBusinessList);
        this.invoiceDataSet.setData(this.oldInvoiceList);
        this.contactDataSet.setData(this.oldContactList);
        this.bankDataSet.setData(this.oldBanktList);
        this.addressDataSet.setData(this.oldAddressList);
        this.financialDataSet.setData(this.oldFinancialList);
        this.attachmentDataSet.setData(this.oldAttachmentList);
      } else {
        this.registDataSet.setData(this.newRegistDataList);
        this.regBusinessDataSet.setData(this.newRegBusinessList);
        this.invoiceDataSet.setData(this.newInvoiceList);
        this.contactDataSet.setData(this.newContactList);
        this.bankDataSet.setData(this.newBankList);
        this.addressDataSet.setData(this.newAddressList);
        this.financialDataSet.setData(this.newFinancialList);
        this.attachmentDataSet.setData(this.newAttachmentList);
      }
    },
    // 获取基础信息
    getBasisInfo() {
      const params = {
        changeReqId: this.changeReqId,
        customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.HEADER",
      };
      // 查询平台级
      getBasisInfoApi(params).then((res) => {
        if (res) {
          this.basisInfo = res;
          this.basisDataSet.setData([ res ] || []);
          this.showBtnFlag = [ "WAIT_TENANT_CONFIRMED" ].includes(res.reqStatus) && this.platformConfirmNewestFlag === 1;
        }
      });
    },
    // 获取登记信息
    getBasicInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询平台级
      getPlatformBasicInfoApi(params).then((res) => {
        if (res) {
          this.oldRegistDataList = [ res.oldBasic ] || [];
          this.newRegistDataList = [ res.newBasic ] || [];
          this.domesticForeignRelationOld = res.oldBasic.domesticForeignRelation;
          this.domesticForeignRelationNew = res.newBasic.domesticForeignRelation;
          this.registDataSet.setData(this.newRegistDataList);
        }
      });
    },
    // 获取注册业务信息
    getBusinesscInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询平台级
      getPlatformBusinessInfoApi(params).then((res) => {
        if (res) {
          this.oldRegBusinessList = [ res.oldBusiness ] || [];
          this.newRegBusinessList = [ res.newBusiness ] || [];
          this.regBusinessDataSet.setData(this.newRegBusinessList);
        }
      });
    },
    // 获取开票信息
    getInvoiceInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
        customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.INVOICE_INFO",
      };
      // 查询平台级
      getPlatformInvoiceInfoApi(params).then((res) => {
        if (res) {
          this.oldInvoiceList = [ res.oldInvoice ] || [];
          this.newInvoiceList = [ res.newInvoice ] || [];
          this.invoiceDataSet.setData(this.newInvoiceList);
        }
      });
    },
    // 获取联系人信息
    getContactInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询平台级
      getPlatformContactInfoApi(params).then((res) => {
        if (res) {
          this.oldContactList = res.oldContacts || [];
          this.newContactList = res.newContacts || [];
          this.contactDataSet.setData(this.newContactList);
        }
      });
    },
    // 获取银行信息
    getBankInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
        customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.BANK_INFO",
      };
      // 查询平台级
      getPlatformBankInfoApi(params).then((res) => {
        if (res) {
          this.oldBanktList = res.oldBankAccounts || [];
          this.newBankList = res.newBankAccounts || [];
          this.bankDataSet.setData(this.newBankList);
        }
      });
    },
    // 获取地址信息
    getAddressInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询平台级
      getPlatformAddressInfoApi(params).then((res) => {
        if (res) {
          this.oldAddressList = res.oldAddresses || [];
          this.newAddressList = res.newAddresses || [];
          this.addressDataSet.setData(this.newAddressList);
        }
      });
    },
    // 获取地址信息
    getFinanceInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询平台级
      getPlatformFinanceInfoApi(params).then((res) => {
        if (res) {
          this.oldFinancialList = res.oldFinance || [];
          this.newFinancialList = res.newFinance || [];
          this.financialDataSet.setData(this.newFinancialList);
        }
      });
    },
    // 获取附件信息
    getAttachmentInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询平台级
      getPlatformAttachmentInfoApi(params).then((res) => {
        if (res) {
          this.oldAttachmentList = res.oldAttachments || [];
          this.newAttachmentList = res.newAttachments || [];
          this.attachmentDataSet.setData(this.newAttachmentList);
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-button-on-change {
  background: #EFF3FE;
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
}

.srm-button-no-change {
  background: rgba(255,255,255,0.00);
  font-size: 12px;
  color: #AFAFAF;
  line-height: 16px;
  font-weight: 500;
}

.bottom-space-view {
  margin-bottom: 40px;
}

.bottom-space-view-with-btn {
  margin-bottom: 100px;
}
</style>