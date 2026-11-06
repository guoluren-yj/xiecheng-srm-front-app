<!--
 * @租户级变更审批详情页面
 * @Author: ZLH
 * @Date: 2022-07-07 14:56:42
 * @LastEditors: ZLH
 * @LastEditTime: 2022-07-22 23:15:54
 * @Description: 租户级企业信息变更固定的：登记信息、注册业务信息、联系人信息、地址信息、银行信息、开票信息、财务状况、附件信息、供应商分类、其他信息+调查表页签
                 其中：联系人信息、地址信息、银行信息、财务状况、附件信息可能会和调查表发生替换
-->
<script>

import { DataSet, SrmUtil } from "srm-mobile-ui";
import tabsColumns from "../mixins/tabsColumns";
import handelTenantInvestigate from "../mixins/handelTenantInvestigate";
import { commonDs } from "../datasource/tabsInfoDS";
import {
  getTenantBasicInfoApi,
  getTenantBusinessInfoApi,
  getTenantContactInfoApi,
  getTenantAddressInfoApi,
  getTenantBankInfoApi,
  getTenantInvoiceInfoApi,
  getTenantFinanceInfoApi,
  getTenantAttachmentInfoApi,
  getTenantSupClassInfoApi,
  getTenantOtherInfoApi,
  approvedApi,
  rejectApi,
  getBasisInfoApi,
} from "../api";

export default {
  modules: [ "sslm.supplierWarehouse", "sslm.enterpriseInform", "smbl.common", "sslm.supplierDetail", "sslm.common", "hipspfm.common", "smbl.workFlow", "hipspfm.workFlow" ],
  name: "EnterpriseInformConfirmDetail",
  components: {
  },
  mixins:[ tabsColumns, handelTenantInvestigate ],
  data() {
    return {
      changeReqId:"", // id
      changeConfirmId:null,
      currentButtonTab: 1, // 0:变更前 | 1：变更后
      domesticForeignRelationOld:1, //认证地区(境内:1 | 境外：0 | 个人：2)
      domesticForeignRelationNew:1, //认证地区(境内:1 | 境外：0 | 个人：2)
      dataSource: 1, // 1企业信息变更 2供应商信息变更
      basisDataSet:new DataSet(commonDs()), // 基础信息
      basisInfo:{}, // 基础信息
      showBtnFlag:false,
      approveRemark:"", // 审批意见
      approvedPopup: null, // 审批意见弹窗
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
      oldSupClassList: [], // 供应商分类信息（旧）
      newSupClassList: [], // 供应商分类信息（新）
      supClassDataSet:new DataSet(commonDs()),
      oldOtherList: [], // 其他信息（旧）
      newOtherList: [], // 其他信息（新）
      otherDataSet:new DataSet(commonDs()),
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
    } = this.$route.query;
    this.changeReqId = changeReqId;
    this.companyId = companyId;
    this.partnerTenantId = partnerTenantId;
    this.changeConfirmId = changeConfirmId;

    // 获取调查表配置信息
    this.fetchConfig().then(() => {
      // 加载tab页数据
      this.fetchDatas();
    });

    // 基础信息
    this.getBasisInfo();

    this.$loading.hide();
  },
  methods: {
    // 操作按钮
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.workFlow.view.status.rejected").$D("审批拒绝"),
          type: "danger",
          fill: false,
          bordered: true,
          handler: () => {
            this.handlerOperation("rejected");
          },
        },
        {
          title: this.$T("smbl.workFlow.view.status.approved").$D("审批通过"),
          type: "primary",
          fill: true,
          visible: true,
          handler: () => {
            this.handlerOperation("approved");
          },
        }
      ];
    },
    // 处理同意/拒绝操作
    handlerOperation(type) {
      // 审批通过
      if (type === "approved") {
        this.showApprovedPopup(type);
      } else if (type === "rejected") {
        // 审批拒绝
        this.showApprovedPopup(type);
      }
    },
    // 审批意见pop
    showApprovedPopup(type) {
      this.approveRemark = "";
      this.approvedPopup = this.$popup({
        title: this.$T("sslm.enterpriseInform.model.application.approvalOpinion").$D("审批意见"),
        showHeader: true,
        showClose: false,
        showBack: false,
        rounded: true,
        height: "50vh",
        position: "bottom",
        content:<srm-flex style={{ padding: "0 15px" }}>
          <srm-textarea-field
            v-model={this.approveRemark}
            placeholder={this.$T("hipspfm.workFlow.view.message.inputApproveRemark").$D("请输入审批意见")}
            height={120}
            maxLength={1000}
            required={false}
            clearButton={false}
            showLength={true}
            editButton={false}
            showResizer={false}/>
          <srm-bottom-handler btn-arr={type === "approved" ? this.getApprovedButtons("approved") : this.getApprovedButtons("rejected")}/>
        </srm-flex>
      });
    },
    // 审批意见弹窗按钮
    getApprovedButtons(type) {
      if (type === "approved") {
        return [
          {
            text: this.$T("smbl.common.button.cancel").$D("取消"),
            type: "info",
            fill: false,
            handler: () => {
              this.approvedPopup.closePopup();
            },
          },
          {
            text: this.$T("smbl.workFlow.view.status.approved").$D("审批通过"),
            type: "primary",
            fill: true,
            handler: () => {
              this.approved();
            },
          }
        ];
      } else if (type === "rejected") {
        return [
          {
            text: this.$T("smbl.common.button.cancel").$D("取消"),
            type: "info",
            fill: false,
            handler: () => {
              this.approvedPopup.closePopup();
            },
          },
          {
            text: this.$T("smbl.workFlow.view.status.rejected").$D("审批拒绝"),
            type: "danger",
            fill: true,
            handler: () => {
              this.rejected();
            },
          }
        ];
      }
    },
    // 审批拒绝
    rejected() {
      this.$loading.show();
      const selected = [ { changeConfirmId:this.changeConfirmId, approvalOpinion:this.approveRemark } ];
      const params = selected;
      rejectApi(params).then((res) => {
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
          // 关闭pop
          this.approvedPopup.closePopup();
          // 返回列表页
          setTimeout(() => this.$router.replace({ name: "EnterpriseInformConfirmList" }), 1000);
        }
      }).finally(() => this.$loading.hide());
    },
    // 审批通过
    approved() {
      this.$loading.show();
      const selected = [ { ...this.basisInfo, approvalOpinion:this.approveRemark, changeConfirmId:this.changeConfirmId } ];
      const params = selected;
      approvedApi(params).then((res) => {
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
          // 关闭pop
          this.approvedPopup.closePopup();
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
      if (this.sslmInvestgContactFlag) {
        this.getContactInfo();
      }
      if (this.sslmInvestgBankAccountFlag) {
        this.getBankInfo();
      }
      if (this.sslmInvestgAddressFlag) {
        this.getAddressInfo();
      }
      if (this.sslmInvestgFinFlag) {
        this.getFinanceInfo();
      }
      if (this.sslmInvestgAttachmentFlag) {
        this.getAttachmentInfo();
      }
      this.getSupClassInfo();
      this.getOtherInfo();
    },
    // 变更前|变更后 数据切换
    refreshAllDataSet() {
      // 更新标准tab
      this.registDataSet = new DataSet(commonDs());
      this.regBusinessDataSet = new DataSet(commonDs());
      this.invoiceDataSet = new DataSet(commonDs());
      this.sslmInvestgContactFlag ? this.contactDataSet = new DataSet(commonDs()) : "";
      this.sslmInvestgBankAccountFlag ? this.bankDataSet = new DataSet(commonDs()) : "";
      this.sslmInvestgAddressFlag ? this.addressDataSet = new DataSet(commonDs()) : "";
      this.sslmInvestgFinFlag ? this.financialDataSet = new DataSet(commonDs()) : "";
      this.sslmInvestgAttachmentFlag ? this.attachmentDataSet = new DataSet(commonDs()) : "";
      this.supClassDataSet = new DataSet(commonDs());
      this.otherDataSet = new DataSet(commonDs());
      if (this.currentButtonTab === 0) {
        this.registDataSet.setData(this.oldRegistDataList);
        this.regBusinessDataSet.setData(this.oldRegBusinessList);
        this.invoiceDataSet.setData(this.oldInvoiceList);
        this.contactDataSet.setData(this.oldContactList);
        this.bankDataSet.setData(this.oldBanktList);
        this.addressDataSet.setData(this.oldAddressList);
        this.financialDataSet.setData(this.oldFinancialList);
        this.attachmentDataSet.setData(this.oldAttachmentList);
        this.supClassDataSet.setData(this.oldSupClassList);
        this.otherDataSet.setData(this.oldOtherList);
      } else {
        this.registDataSet.setData(this.newRegistDataList);
        this.regBusinessDataSet.setData(this.newRegBusinessList);
        this.invoiceDataSet.setData(this.newInvoiceList);
        this.contactDataSet.setData(this.newContactList);
        this.bankDataSet.setData(this.newBankList);
        this.addressDataSet.setData(this.newAddressList);
        this.financialDataSet.setData(this.newFinancialList);
        this.attachmentDataSet.setData(this.newAttachmentList);
        this.supClassDataSet.setData(this.newSupClassList);
        this.otherDataSet.setData(this.newOtherList);
      }

      // // 调查表tab
      // this.investigateConfigHeaders.filter((e) => this.investigateConfigRenderMap[e.configName])
      //   .map((res) => {
      //     this.tabsDs[res.configName] = new DataSet(commonDs());
      //     if (this.currentButtonTab === 0) {
      //       this.tabsDs[res.configName].setData(this.investigateDatas[res.configName][0]);
      //     } else {
      //       this.tabsDs[res.configName].setData(this.investigateDatas[res.configName][1]);
      //     }
      //   });
    },
    getDefaultDataSet(columns) {
      const config = {
        autoQuery: false,
        selection: Infinity,
        pageSize: 10,
        editable: false,
        enableQuery: false,
        showTotalCount: false,
        fields: columns,
      };
      return new DataSet(config);
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
          this.showBtnFlag = res.reqStatus === "WAIT_CONFIRMED";
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
      // 查询租户级
      getTenantBasicInfoApi(params).then((res) => {
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
      // 查询租户级
      getTenantBusinessInfoApi(params).then((res) => {
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
      // 查询租户级
      getTenantInvoiceInfoApi(params).then((res) => {
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
      // 查询租户级
      getTenantContactInfoApi(params).then((res) => {
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
      // 查询租户级
      getTenantBankInfoApi(params).then((res) => {
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
      // 查询租户级
      getTenantAddressInfoApi(params).then((res) => {
        if (res) {
          this.oldAddressList = res.oldAddresses || [];
          this.newAddressList = res.newAddresses || [];
          this.addressDataSet.setData(this.newAddressList);
        }
      });
    },
    // 获取财务状况信息
    getFinanceInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询租户级
      getTenantFinanceInfoApi(params).then((res) => {
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
        // companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        // dataSource:this.dataSource,
      };
      // 查询租户级
      getTenantAttachmentInfoApi(params).then((res) => {
        if (res) {
          this.oldAttachmentList = res.oldAttachments || [];
          this.newAttachmentList = res.newAttachments || [];
          this.attachmentDataSet.setData(this.newAttachmentList);
        }
      });
    },
    // 获取供应商分类信息
    getSupClassInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询租户级
      getTenantSupClassInfoApi(params).then((res) => {
        if (res) {
          this.oldSupClassList = res.oldFirmChangeCates || [];
          this.newSupClassList = res.newFirmChangeCates || [];
          this.supClassDataSet.setData(this.newSupClassList);
        }
      });
    },
    // 获取其他信息
    getOtherInfo() {
      const params = {
        changeReqId: this.changeReqId,
        companyId:this.companyId,
        partnerTenantId:this.partnerTenantId,
        dataSource:this.dataSource,
      };
      // 查询租户级
      getTenantOtherInfoApi(params).then((res) => {
        if (res) {
          this.oldOtherList = [ res.oldSupOther ] || [];
          this.newOtherList = [ res.newSupOther ] || [];
          this.otherDataSet.setData(this.newOtherList);
        }
      });
    },
  },
  render() {
    return <div style="height: 100vh;">
      <div>
        {
          this.investigateConfig.investigateConfigHeaders && <srm-scroll-tab style="height: 90vh;">
            <srm-blank size="1px" theme="fill"/>
            <srm-flex style="height: 40px">
              <srm-button
                class={this.currentButtonTab === 0 ? "srm-button-on-change" : "srm-button-no-change"}
                style="margin-left: 20px" onClick={() => {
                  this.tabIndexChange(0);
                }}>
                { this.$T("sslm.enterpriseInform.view.title.beforeChange").$D("变更前") }
              </srm-button>
              <srm-button
                class={this.currentButtonTab === 1 ? "srm-button-on-change" : "srm-button-no-change"}
                style="margin-left: 8px" onClick={() => {
                  this.tabIndexChange(1);
                }}>
                { this.$T("sslm.enterpriseInform.view.title.afterChange").$D("变更后") }
              </srm-button>
            </srm-flex>
            <srm-scroll-tab-item label={ this.$T("sslm.enterpriseInform.title.changeInfoForm").$D("变更单信息")}>
              <srm-list
                data-set={this.basisDataSet}
                columns={this.getBasisColumnsInfo}
                scrollable={false}
                customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_BASIS_INFO"/>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.fixCatalog.registInform").$D("登记信息")}>
              <srm-list
                data-set={this.registDataSet}
                columns={this.getRegistColumnsInfo}
                scrollable={false}
                customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_REGIST_INFO"/>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.fixCatalog.registeBusinessInform").$D("注册业务信息")}>
              <srm-list
                data-set={this.regBusinessDataSet}
                columns={this.getRegBusinessColumnsInfo}
                scrollable={false}
                customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_REG_BUSINESS_INFO"/>
            </srm-scroll-tab-item>
            {
              this.sslmInvestgContactFlag && <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.fixCatalog.contactInform").$D("联系人信息")}>
                <srm-list
                  data-set={this.contactDataSet}
                  columns={this.getContactColumnsInfo}
                  scrollable={false}
                  customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_CONTACT_INFO"/>
              </srm-scroll-tab-item>
            }
            {
              this.sslmInvestgAddressFlag && <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.model.address.title:").$D("地址信息")}>
                <srm-list
                  data-set={this.addressDataSet}
                  columns={this.getAddressColumnsInfo}
                  scrollable={false}
                  customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_ADDRESS_INFO"/>
              </srm-scroll-tab-item>
            }
            {
              this.sslmInvestgBankAccountFlag && <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.fixCatalog.bankInform").$D("银行信息")}>
                <srm-list
                  data-set={this.bankDataSet}
                  columns={this.getBankColumnsInfo}
                  scrollable={false}
                  customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_BANK_INFO"/>
              </srm-scroll-tab-item>
            }
            <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.fixCatalog.invoiceInform").$D("开票信息")}>
              <srm-list
                data-set={this.invoiceDataSet}
                columns={this.getInvoiceColumnsInfo}
                scrollable={false}
                customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_INVOICE_INFO"/>
            </srm-scroll-tab-item>
            {
              this.sslmInvestgFinFlag && <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.model.financialStatus.title").$D("财务状况")}>
                <srm-list
                  data-set={this.financialDataSet}
                  columns={this.getFinancialColumnsInfo}
                  scrollable={false}
                  customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_FINANCIAL_INFO"/>
              </srm-scroll-tab-item>
            }
            {
              this.sslmInvestgAttachmentFlag && <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.model.attachmentInfo.title").$D("附件信息")}>
                <srm-list
                  data-set={this.attachmentDataSet}
                  columns={this.getAttachmentColumnsInfo}
                  scrollable={false}
                  customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_ATTACHMENT_INFO"/>
              </srm-scroll-tab-item>
            }
            <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.fixCatalog.supplierClassify").$D("供应商分类")}>
              <srm-list
                data-set={this.supClassDataSet}
                columns={this.getSupClassColumnsInfo}
                scrollable={false}
                customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_SUP_CLASS_INFO"/>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item label={this.$T("sslm.enterpriseInform.view.title.otherInformation").$D("其他信息")}>
              <srm-list
                data-set={this.otherDataSet}
                columns={this.getOtherColumnsInfo}
                scrollable={false}
                customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_OTHER_INFO"/>
              {this.investigateConfig.investigateConfigHeaders.length < 1 && <div class={this.showBtnFlag ? "bottom-space-view-with-btn" : "bottom-space-view"}/> }
            </srm-scroll-tab-item>
            {
              this.investigateConfig.investigateConfigHeaders && this.investigateConfig.investigateConfigHeaders
                .filter((e) => this.investigateConfigRenderMap[e.configName] || e.children)
                // eslint-disable-next-line arrow-body-style
                .map((header, index) => {
                  return <SrmScrollTabItem
                    key={index}
                    label={header.configDescription || "-"}>
                    {
                      this.investigateConfigRenderMap[header.configName](header)
                    }
                    {index + 1 === this.investigateConfig.investigateConfigHeaders.length && <div class={this.showBtnFlag ? "bottom-space-view-with-btn" : "bottom-space-view"}/> }
                  </SrmScrollTabItem>;
                })
            }
          </srm-scroll-tab>
        }
        {this.showBtnFlag && <srm-bottom-handler btn-arr={this.getBtnArr()} />}
      </div>
    </div>;
  }
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