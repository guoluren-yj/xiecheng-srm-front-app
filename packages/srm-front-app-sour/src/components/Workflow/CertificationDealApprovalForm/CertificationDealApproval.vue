<script>
import { DataSet } from "srm-mobile-ui";
import {
  getRegisterInfoApi,
  queryTabDataConfig,
  fetchAiApproveData,
  fetchApproveStatus,
} from "./api";
import investigate from "./mixins/investigate";
import columns from "./mixins/columns";
import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { camelCase } from "lodash";
import {
  commonDs,
  appealReasonDs,
  certificationResultDs,
  manualReviewDs,
  registerDs,
  businessDs,
  contactDs,
  addressDs,
  bankDs,
  invoiceDs,
  financeDs,
  attachmentDs,
  inviteDs,
  otherDs,
} from "./datasource";

const BANK_ACCOUNT = "spfm_company_bank_account"; // 银行
const CONTANT = "spfm_company_contact"; // 联系人
const ADDRESS = "spfm_company_address"; // 地址
const INVOICE = "spfm_company_invoice"; // 开票
const FIN = "spfm_company_fin"; // 财务
const ATTACHMENT = "spfm_company_attachment"; // 附件

const transformFields = [
  // 地址信息
  {
    name: "countryId",
    code: "countryName",
  },
  {
    name: "regionId",
    code: "regionPathName",
  },
  // 银行信息
  {
    name: "bankCountryId",
    code: "bankCountryName",
  },
  {
    name: "bankId",
    code: "bankName",
  },
  {
    name: "accountNature",
    code: "accountNatureMeaning",
  },
  {
    name: "accountPurpose",
    code: "accountPurposeMeaning",
  },
  {
    name: "currencyId",
    code: "currencyName",
  },
  {
    name: "paymentTypeId",
    code: "paymentTypeIdMeaning",
  },
  // 附件信息
  {
    name: "attachmentType",
    code: "attachmentTypeMerge",
  },
  {
    name: "supplierAttachmentUuid",
    code: "attachmentUuid",
  },
];

/**
 * CertificationDealApprovalForm 企业认证审批工作流表单
 * @author ZLH
 * @date 2023-02-10
 * @version 1.0
 */
export default {
  modules: [ "spfm.certificationApproval", "spfm.enterprise", "spfm.contactPerson", "spfm.disposeInvite", "spfm.supplierManage", "spfm.supplierRegister", "spfm.approval", "hzero.common", "hipspfm.common", "spfm.address", "spfm.bank", "sslm.common", "spfm.finance", "spfm.common", "entity.attachment", "spfm.attachment", "sslm.supplierInform", "sslm.supplierDetail", "smbl.common", "sslm.enterpriseInform", "spfm.enterpriseCertification", "sslm.supplierInvite", "sslm.supplierEntryDetail", "sslm.certificationApproval" ],
  name: "CertificationDealApprovalForm",
  components: { AiTipSection, HistoryRecordTiled },
  mixins: [ investigate, columns ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dataLoadingFlag: false,
      changeReqId: "",
      // 注册地址
      domesticForeignRelation: "",
      allowSupplierInviteFlag:false,
      showManualReviewFlag: false,
      appealReasonDataSet: new DataSet(commonDs()), // 申诉原因
      certificationResultDataSet: new DataSet(commonDs()), // 三方认证结果
      manualReviewDataSet: new DataSet(commonDs()), // 企业验证-人工材料
      registerDataSet: new DataSet(commonDs()), // 登记信息
      businessDataSet: new DataSet(commonDs()), // 业务信息
      contactDataSet: new DataSet(commonDs()), // 联系人信息
      addressDataSet: new DataSet(commonDs()), // 地址信息
      bankDataSet: new DataSet(commonDs()), // 银行信息
      invoiceDataSet: new DataSet(commonDs()), // 开票信息
      financeDataSet: new DataSet(commonDs()), // 财务信息
      attachmentDataSet: new DataSet(commonDs()), // 附件信息
      otherDataSet: new DataSet(commonDs()), // 其他信息
      inviteDataSet: new DataSet(commonDs()), // 邀约信息
      mainDataTab: [], // 主数据页签字段
      enableTabFiles:{}, // 策略配置启用字段
      aiApproveStatus:null,
      aiApproveDTOList:[],
    };
  },
  async mounted() {
    this.changeReqId = this.parameters.changeReqId;
    const allowSupplierInvite = this.parameters.allowSupplierInvite;
    this.allowSupplierInviteFlag = Boolean(Number(allowSupplierInvite));
    await this.queryTabDataConfigInfo();
    this.handleAiApproveData();
    this.dataLoadingFlag = true;
  },
  methods: {
    // 预览附件
    handlePreview(val) {
      const downApi = "/hfle/v1/files/redirect-url";
      this.previewImg = this.buildImgUrl(val, "private-bucket", downApi);
      this.$previewImage([ this.previewImg ], { showClose: true });
    },
    handleFields(lineList = []) {
      const requiredList = [];
      const enableList = [];
      (lineList || []).forEach((item) => {
        // 只传启用的字段
        const { fieldCode, requiredFlag } = item;
        const formatFieldCode = camelCase(fieldCode);
        const transformField = transformFields.find((n) => n.name === formatFieldCode) || {};
        const finalFieldCode = transformField.code || formatFieldCode;
        if (requiredFlag) {
          requiredList.push(finalFieldCode);
        }
        enableList.push(finalFieldCode);
      });
      return {
        requiredList,
        enableList,
      };
    },
    // 查询表格配置
    async queryTabDataConfigInfo() {
      const payload = {
        changeReqId: this.changeReqId,
        dataSource: 4,
      };
      // 获取企业验证-人工材料信息
      this.manualReviewDataSet = new DataSet(manualReviewDs(payload));
      await this.manualReviewDataSet.refresh().then(() => {
        const { attestationType } = this.manualReviewDataSet?.current?.data || {};
        this.showManualReviewFlag = attestationType === "MANPOWER";
      });
      await getRegisterInfoApi(payload).then((res) => {
        if (res) {
          const { domesticForeignRelation } = res || {};
          this.domesticForeignRelation = domesticForeignRelation;
          this.registerDataSet = new DataSet(registerDs({ ...payload, domesticForeignRelation }));
          this.registerDataSet.setData([ res ] || []);
          this.appealReasonDataSet = new DataSet(appealReasonDs());
          this.certificationResultDataSet = new DataSet(certificationResultDs());
          this.certificationResultDataSet.setData([ res ] || []);
          this.appealReasonDataSet.setData([ res ] || []);
        }
      });
      this.businessDataSet = new DataSet(businessDs(payload));
      this.businessDataSet.refresh();
      this.otherDataSet = new DataSet(otherDs(payload));
      this.otherDataSet.refresh();
      if (this.allowSupplierInviteFlag) {
        this.inviteDataSet = new DataSet(inviteDs(payload));
        this.inviteDataSet.refresh();
      }
      await queryTabDataConfig(payload).then((res) => {
        if (res) {
          (res || []).forEach((item) => {
            const { configName, strategyCfLineList } = item;
            const { enableList } = this.handleFields(strategyCfLineList);
            this.enableTabFiles[`${configName}`] = enableList;
            // 银行
            if (configName === BANK_ACCOUNT) {
              this.bankDataSet = new DataSet(bankDs(payload));
              this.bankDataSet.refresh();
              this.mainDataTab.push(configName);
            }
            // 联系人
            if (configName === CONTANT) {
              this.contactDataSet = new DataSet(contactDs(payload));
              this.contactDataSet.refresh();
              this.mainDataTab.push(configName);
            }
            // 地址
            if (configName === ADDRESS) {
              this.addressDataSet = new DataSet(addressDs(payload));
              this.addressDataSet.refresh();
              this.mainDataTab.push(configName);
            }
            // 开票
            if (configName === INVOICE) {
              this.invoiceDataSet = new DataSet(invoiceDs(payload));
              this.invoiceDataSet.refresh();
              this.mainDataTab.push(configName);
            }
            // 财务
            if (configName === FIN) {
              this.financeDataSet = new DataSet(financeDs(payload));
              this.financeDataSet.refresh();
              this.mainDataTab.push(configName);
            }
            // 附件
            if (configName === ATTACHMENT) {
              this.attachmentDataSet = new DataSet(attachmentDs(payload));
              this.attachmentDataSet.refresh();
              this.mainDataTab.push(configName);
            }
          });
        }
      });
    },
    // 个性化单元编码
    getCustomizeCode(code) {
      const codeList = {
        "register": this.domesticForeignRelation === 1 ? "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.REGISTER" : this.domesticForeignRelation === 2 ? "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.REGISTER_PERSON" : "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.REGISTER_OVERSEAS",
        "business": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.BUSINESS",
        "contact": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.CONTACT",
        "address": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.ADDRESS",
        "bank": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.BANK",
        "invoice": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.INVOICE",
        "finance": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.FINANCE",
        "attachment": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.ATTACHMENT",
        "other": "SMBL.WORKFLOW.CERTIFICATION_DEAL_APPROVAL.OTHER",
      };
      return codeList[code] || "";
    },
    getRegisterInfoColumns(showArrow = false) {
      const cols = this.getRegisterColumns({ domesticForeignRelation:this.domesticForeignRelation });
      if (cols.length > 10) {
        return this.getRegisterColumns({ domesticForeignRelation:this.domesticForeignRelation, showArrow });
      }
      return cols;
    },
    openRegisterDetailPopup(dataSet, col = []) {
      this.$popup({
        title: this.$T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={col}
          dataSet={dataSet}
        />,
      });
    },
    // 查询智能审核相关数据
    handleAiApproveData() {
      fetchAiApproveData({
        documentType: "REGISTER",
        documentId: this.changeReqId,
      }).then((res) => {
        if (res) {
          this.aiApproveDTOList = res;
        }
      });
      fetchApproveStatus({
        documentType: "REGISTER",
        documentId: this.changeReqId,
      }).then((res) => {
        if (res) {
          this.aiApproveStatus = res.status;
        }
      });
    },
  },
  render() {
    return this.dataLoadingFlag && <srm-scroll-tab>
      {this.aiApproveStatus &&
        <AiTipSection
          aiApproveStatus={this.aiApproveStatus}
          aiReviewParams={this.aiApproveDTOList} />
      }
      <srm-scroll-tab-item label={this.$T("sslm.certificationApproval.view.message.certificationResult").$D("三方认证结果")}>
        <srm-list
          data-set={this.certificationResultDataSet}
          scrollable={false}
          columns={this.getCertificationResultColumns()}
          class="sslm-result-list-item"
        />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.appealReason").$D("申诉原因")}>
        <srm-list
          data-set={this.appealReasonDataSet}
          scrollable={false}
          columns={this.getAppealReasonColumns()}
        />
      </srm-scroll-tab-item>
      {this.showManualReviewFlag &&
            <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.manualReview").$D("企业验证-人工材料")}>
              <srm-list
                data-set={this.manualReviewDataSet}
                scrollable={false}
                columns={this.getManualReviewColumns()}
              />
            </srm-scroll-tab-item>
      }
      <srm-scroll-tab-item label={this.$T("spfm.certificationApproval.view.title.registerInfo").$D("登记信息")}>
        <srm-list
          data-set={this.registerDataSet}
          scrollable={false}
          columns={this.getRegisterInfoColumns(true).slice(0, 10)}
          customize-code={this.getCustomizeCode("register")}
          onItemClick={() => this.getRegisterInfoColumns().length > 10 ? this.openRegisterDetailPopup(this.registerDataSet, this.getRegisterInfoColumns(false)) : null}
        />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.business").$D("业务信息")}>
        <srm-list
          data-set={this.businessDataSet}
          scrollable={false}
          columns={this.getBusinessColumns()}
          customize-code={this.getCustomizeCode("business")}
        />
      </srm-scroll-tab-item>
      {this.mainDataTab.includes(CONTANT) &&
            <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.contact").$D("联系人信息")}>
              <srm-list
                data-set={this.contactDataSet}
                scrollable={false}
                columns={this.getContactColumns(this.enableTabFiles[`${CONTANT}`])}
                customize-code={this.getCustomizeCode("contact")}
              />
            </srm-scroll-tab-item>
      }
      {this.mainDataTab.includes(ADDRESS) &&
            <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.page.addressInfo").$D("地址信息")}>
              <srm-list
                data-set={this.addressDataSet}
                scrollable={false}
                columns={this.getAddressColumns(this.enableTabFiles[`${ADDRESS}`])}
                customize-code={this.getCustomizeCode("address")}
              />
            </srm-scroll-tab-item>
      }
      {this.mainDataTab.includes(BANK_ACCOUNT) &&
            <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.page.bankInfo").$D("银行信息")}>
              <srm-list
                data-set={this.bankDataSet}
                scrollable={false}
                columns={this.getBankColumns(this.enableTabFiles[`${BANK_ACCOUNT}`])}
                customize-code={this.getCustomizeCode("bank")}
              />
            </srm-scroll-tab-item>
      }
      {this.mainDataTab.includes(INVOICE) &&
            <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.page.invoiceInfo").$D("开票信息")}>
              <srm-list
                data-set={this.invoiceDataSet}
                scrollable={false}
                columns={this.getInvoiceColumns(this.enableTabFiles[`${INVOICE}`])}
                customize-code={this.getCustomizeCode("invoice")}
              />
            </srm-scroll-tab-item>
      }
      {this.mainDataTab.includes(FIN) &&
            <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.page.financeInfo").$D("财务信息")}>
              <srm-list
                data-set={this.financeDataSet}
                scrollable={false}
                columns={this.getFinanceColumns(this.enableTabFiles[`${FIN}`])}
                customize-code={this.getCustomizeCode("finance")}
              />
            </srm-scroll-tab-item>
      }
      {this.mainDataTab.includes(ATTACHMENT) &&
            <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.attachment").$D("附件信息")}>
              <srm-list
                data-set={this.attachmentDataSet}
                scrollable={false}
                columns={this.getAttachmentColumns(this.enableTabFiles[`${ATTACHMENT}`])}
                customize-code={this.getCustomizeCode("attachment")}
              />
            </srm-scroll-tab-item>
      }
      {this.allowSupplierInviteFlag &&
            <srm-scroll-tab-item label={this.$T("sslm.supplierInvite.view.title.inviteInfo").$D("邀约信息")}>
              <srm-list
                data-set={this.inviteDataSet}
                scrollable={false}
                columns={this.getInviteColumns()}
              />
            </srm-scroll-tab-item>
      }
      <srm-scroll-tab-item label={this.$T("spfm.enterprise.view.message.otherInfo").$D("其他信息")}>
        <srm-list
          data-set={this.otherDataSet}
          scrollable={false}
          columns={this.getOtherColumns()}
          customize-code={this.getCustomizeCode("other")}
        />
      </srm-scroll-tab-item>
      {
        this.investigateConfig.investigateConfigHeaders &&
        this.investigateConfig.investigateConfigHeaders
          .filter((e) => this.investigateConfigRenderMap[e.configName] || e.children)
          .map((header, index) => <SrmScrollTabItem
            key={index}
            label={header.configDescription || "-"}>
            {
              header.children ? header.children.map((child, childIndex) => [ <SrmFlex class={ childIndex === 0 ? "sub-title-first" : "sub-title"} align="center">{child.configDescription || "-"}</SrmFlex>,
                [
                  this.investigateConfigRenderMap[child.configName](child)
                ] ]) :
                this.investigateConfigRenderMap[header.configName] ?
                  [
                    this.investigateConfigRenderMap[header.configName](header)
                  ] : ""
            }
          </SrmScrollTabItem>
          )
      }
    </srm-scroll-tab>;
  }
};
</script>

<style scoped lang="stylus">
  .sslm-result-list-item{
    >>> .srm-list-item-card{
      .customize{
        .customize-item{
          margin-bottom: 0;
        }
      }
    }
  }
  .sslm-investg-modal-form {
    >>> .customize-detail{
      .form-item{
        .srm-field-wrapper-container{
          .srm-field-value{
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
