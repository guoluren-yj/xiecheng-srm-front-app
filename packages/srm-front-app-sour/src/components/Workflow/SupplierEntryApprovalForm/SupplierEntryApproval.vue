<script>
import { SrmUtil, DataSet } from "srm-mobile-ui";
import {
  queryInviteInfo,
  getRegisterInfoApi,
  fetchAiApproveData,
  fetchApproveStatus,
  queryFilterInvestigationTemplate,
} from "./api";
import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";
import { dealConfigData, questionnaireForm, questionnaireConfigName } from "@/components/Investigation/utils";
import { getInvestigateDS, getInvestigateColums } from "@/components/Investigation/getInvestigateDS";
import columns from "./mixins/columns";
import {
  commonDs,
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
  entryBaseDs,
} from "./datasource";

/**
 * SupplierEntryApprovalForm 供应商录入审批工作流表单
 * @author ZLH
 * @date 2023-02-10
 * @version 1.0
 */
export default {
  modules: [ "sslm.enterpriseInform", "spfm.supplierRegister", "spfm.enterpriseCertification", "spfm.enterprise", "spfm.contactPerson", "spfm.disposeInvite", "spfm.supplierManage", "hzero.common", "spfm.address", "spfm.bank", "sslm.common", "spfm.finance", "spfm.common", "entity.attachment", "spfm.attachment", "sslm.supplierInform", "sslm.supplierEntryDetail", "sslm.supplierInvite", "hipspfm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.common", "spcm.purchaseContractView", "spcm.contractTemplate", "spcm.purchaseContractType", "sslm.investigationCorrelation", "sslm.supplierDetail", "smbl.common" ],
  name: "SupplierEntryApprovalForm",
  components: { AiTipSection },
  mixins: [ columns ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 调查表页签初始化一个ds,不然ds没有current,页面不展示数据
    const investigateDefaultDs = {};
    questionnaireConfigName.forEach((item) => {
      investigateDefaultDs[item] = new DataSet(commonDs());
    });
    return {
      companyBaseInfo:{}, // 企业基本信息
      changeReqId: "",
      configList:[], // 调查表配置
      configNameList:[], // 调查表页面key集合
      investigateDsObj:investigateDefaultDs, // 调查表ds集合
      investigateColumnsObj:{}, // 调查表columns集合
      organizationId: SrmUtil.getTenantId(),
      // 注册地址
      domesticForeignRelation: "",
      allowSupplierInviteFlag:false,
      entryBaseDataSet: new DataSet(commonDs()), // 录入单基础信息
      companyBaseDataSet: new DataSet(commonDs()), // 企业基本信息
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
      aiApproveStatus:null,
      aiApproveDTOList:[],
    };
  },
  mounted() {
    this.changeReqId = this.parameters.changeReqId;
    const allowSupplierInvite = this.parameters.allowSupplierInvite;
    this.allowSupplierInviteFlag = Boolean(Number(allowSupplierInvite));
    this.init();
    this.handleAiApproveData();
  },
  methods: {
    // 预览附件
    handlePreview(val) {
      const downApi = "/hfle/v1/files/redirect-url";
      this.previewImg = this.buildImgUrl(val, "private-bucket", downApi);
      this.$previewImage([ this.previewImg ], { showClose: true });
    },
    // 初始化加载数据
    async init() {
      const payload = {
        changeReqId: this.changeReqId,
        dataSource: 3,
      };
      // 登记信息查询参数
      const registerInfoParam = {
        ...payload,
        customizeUnitCode: "SSLM.SUPPLIER_ENTRY_DETAIL.BASIC_INFO_OVERSEAS",
      };
      await getRegisterInfoApi(registerInfoParam).then((res) => {
        if (res) {
          this.companyBaseInfo = res || {};
          const { domesticForeignRelation } = res || {};
          this.domesticForeignRelation = domesticForeignRelation;
          this.registerDataSet = new DataSet(registerDs({ ...payload, domesticForeignRelation }));
          this.registerDataSet.setData([ res ] || []);
        }
      });
      // 查询邀请信息
      await queryInviteInfo({
        ...payload,
        customizeUnitCode: "SSLM.SUPPLIER_ENTRY_DETAIL.INVITATION_INFO"
      }).then(async(res) => {
        if (res) {
          this.inviteDataSet = new DataSet(inviteDs());
          this.inviteDataSet.setData([ res ] || []);
          const { investgHeaderId, investigateTemplateId } = res;
          if (investgHeaderId && investigateTemplateId) {
            const investigTemplateConfig = await queryFilterInvestigationTemplate({
              delTmplFlag:0,
              investgHeaderId,
              investigateTemplateId,
            }) || {};
            const newConfigList = dealConfigData(investigTemplateConfig).configList;
            this.configList = newConfigList;
            this.configNameList = newConfigList.map((config) => config.configName);
            newConfigList.forEach((config) => {
              const queryParameter = {
                investgHeaderId,
                tenantId: this.organizationId,
              };
              this.investigateDsObj[config.configName] = new DataSet(getInvestigateDS(config, queryParameter));
              this.investigateDsObj[config.configName].refresh();
              this.investigateColumnsObj[config.configName] = getInvestigateColums(config, this);
            });
          }
        }
      });
      this.businessDataSet = new DataSet(businessDs(payload));
      this.businessDataSet.refresh();
      this.otherDataSet = new DataSet(otherDs(payload));
      this.otherDataSet.refresh();
      this.entryBaseDataSet = new DataSet(entryBaseDs(payload));
      this.entryBaseDataSet.refresh();
      this.bankDataSet = new DataSet(bankDs(payload));
      this.bankDataSet.refresh();
      this.contactDataSet = new DataSet(contactDs(payload));
      this.contactDataSet.refresh();
      this.addressDataSet = new DataSet(addressDs(payload));
      this.addressDataSet.refresh();
      this.invoiceDataSet = new DataSet(invoiceDs(payload));
      this.invoiceDataSet.refresh();
      this.financeDataSet = new DataSet(financeDs(payload));
      this.financeDataSet.refresh();
      this.attachmentDataSet = new DataSet(attachmentDs(payload));
      this.attachmentDataSet.refresh();
    },
    // 个性化单元编码
    getCustomizeCode(code) {
      const codeList = {
        "entryBase": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.ENTRY_BASE",
        "companyBase": this.domesticForeignRelation === 1 ? "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.COMPANY_BASE" : this.domesticForeignRelation === 2 ? "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.COMPANY_BASE_PERSON" : "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.COMPANY_BASE_OVERSEAS",
        "business": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.BUSINESS",
        "contact": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.CONTACT",
        "address": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.ADDRESS",
        "bank": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.BANK",
        "invoice": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.INVOICE",
        "finance": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.FINANCE",
        "attachment": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.ATTACHMENT",
        "other": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.OTHER",
        "invitation": "SMBL.WORKFLOW.SUPPLIER_ENTRY_APPROVAL.INVITATION",
      };
      return codeList[code] || "";
    },
    getRegisterInfoColumns() {
      return this.getRegisterColumns({ domesticForeignRelation:this.domesticForeignRelation });
    },
    openDetailPopup(dataSet, col = []) {
      this.$popup({
        title: this.$T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={col}
          dataSet={dataSet}/>,
      });
    },
    // 查询智能审核相关数据
    handleAiApproveData() {
      fetchAiApproveData({
        documentType: "ENTERING",
        documentId: this.changeReqId,
      }).then((res) => {
        if (res) {
          this.aiApproveDTOList = res;
        }
      });
      fetchApproveStatus({
        documentType: "ENTERING",
        documentId: this.changeReqId,
      }).then((res) => {
        if (res) {
          this.aiApproveStatus = res.status;
        }
      });
    },
  },
  render() {
    return <srm-scroll-tab>
      {this.aiApproveStatus &&
        <AiTipSection
          aiApproveStatus={this.aiApproveStatus}
          aiReviewParams={this.aiApproveDTOList} />
      }
      {this.entryBaseDataSet &&
        <srm-scroll-tab-item key="entryBaseInfo" label={this.$T("sslm.supplierEntryDetail.view.entry.entryBaseInfo").$D("录入单基础信息")}>
          <srm-list
            data-set={this.entryBaseDataSet}
            scrollable={false}
            columns={this.getEntryBaseColumns()}
            customize-code={this.getCustomizeCode("entryBase")}
          />
        </srm-scroll-tab-item>
      }
      {this.registerDataSet &&
        <srm-scroll-tab-item key="companyBaseInfo" label={this.$T("sslm.supplierEntryDetail.view.entry.companyBaseInfo").$D("企业基本信息")}>
          <srm-list
            data-set={this.registerDataSet}
            scrollable={false}
            columns={this.getRegisterInfoColumns().slice(0, 10)}
            customize-code={this.getCustomizeCode("companyBase")}
            onItemClick={() => this.getRegisterInfoColumns().length > 10 ? this.openDetailPopup(this.registerDataSet, this.getRegisterInfoColumns()) : null}

          />
        </srm-scroll-tab-item>
      }
      {this.businessDataSet &&
        <srm-scroll-tab-item key="business" label={this.$T("spfm.enterprise.view.message.business").$D("业务信息")}>
          <srm-list
            data-set={this.businessDataSet}
            scrollable={false}
            columns={this.getBusinessColumns()}
            customize-code={this.getCustomizeCode("business")}
          />
        </srm-scroll-tab-item>
      }
      {this.contactDataSet && !this.configNameList.includes("sslmInvestgContact") &&
        <srm-scroll-tab-item key="contactPerson" label={this.$T("sslm.supplierEntryDetail.view.entry.contactPerson").$D("联系人")}>
          <srm-list
            data-set={this.contactDataSet}
            scrollable={false}
            columns={this.getContactColumns()}
            customize-code={this.getCustomizeCode("contact")}
          />
        </srm-scroll-tab-item>
      }
      {this.addressDataSet && !this.configNameList.includes("sslmInvestgAddress") &&
        <srm-scroll-tab-item key="addressInfo"label={this.$T("spfm.enterprise.view.message.page.addressInfo").$D("地址信息")}>
          <srm-list
            data-set={this.addressDataSet}
            scrollable={false}
            columns={this.getAddressColumns()}
            customize-code={this.getCustomizeCode("address")}
          />
        </srm-scroll-tab-item>
      }
      {this.bankDataSet && !this.configNameList.includes("sslmInvestgBankAccount") &&
        <srm-scroll-tab-item key="bankInfo"label={this.$T("spfm.enterprise.view.message.page.bankInfo").$D("银行信息")}>
          <srm-list
            data-set={this.bankDataSet}
            scrollable={false}
            columns={this.getBankColumns()}
            customize-code={this.getCustomizeCode("bank")}
          />
        </srm-scroll-tab-item>
      }
      {this.invoiceDataSet &&
        <srm-scroll-tab-item key="invoiceInfo" label={this.$T("spfm.enterprise.view.message.page.invoiceInfo").$D("开票信息")}>
          <srm-list
            data-set={this.invoiceDataSet}
            scrollable={false}
            columns={this.getInvoiceColumns()}
            customize-code={this.getCustomizeCode("invoice")}
          />
        </srm-scroll-tab-item>
      }
      {this.financeDataSet && !this.configNameList.includes("sslmInvestgFin") &&
        <srm-scroll-tab-item key="financeInfo" label={this.$T("spfm.enterprise.view.message.page.financeInfo").$D("财务信息")}>
          <srm-list
            data-set={this.financeDataSet}
            scrollable={false}
            columns={this.getFinanceColumns()}
            customize-code={this.getCustomizeCode("finance")}
          />
        </srm-scroll-tab-item>
      }
      {this.attachmentDataSet && !this.configNameList.includes("sslmInvestgAttachment") &&
        <srm-scroll-tab-item key="attachment"label={this.$T("spfm.enterprise.view.message.attachment").$D("附件信息")}>
          <srm-list
            data-set={this.attachmentDataSet}
            scrollable={false}
            columns={this.getAttachmentColumns()}
            customize-code={this.getCustomizeCode("attachment")}
          />
        </srm-scroll-tab-item>
      }
      {this.inviteDataSet &&
        <srm-scroll-tab-item key="invitationInfo" label={this.$T("sslm.supplierEntryDetail.view.entry.invitationInfo").$D("邀请信息")}>
          <srm-list
            data-set={this.inviteDataSet}
            scrollable={false}
            columns={this.getInviteColumns()}
            customize-code={this.getCustomizeCode("invitation")}
          />
        </srm-scroll-tab-item>
      }
      {this.otherDataSet &&
        <srm-scroll-tab-item key="otherInfo" label={this.$T("spfm.enterprise.view.message.otherInfo").$D("其他信息")}>
          <srm-list
            data-set={this.otherDataSet}
            scrollable={false}
            columns={this.getOtherColumns()}
            customize-code={this.getCustomizeCode("other")}
          />
        </srm-scroll-tab-item>
      }
      {
        this.configList.map((config) => this.investigateDsObj[config.configName] ?
          <srm-scroll-tab-item key={config.configName} label={config.configDescription}>
            {questionnaireForm[config.configName] ?
              <srm-form
                data-set={this.investigateDsObj[config.configName]}
                columns={this.investigateColumnsObj[config.configName]}
              /> :
              <srm-list
                scrollable={false}
                data-set={this.investigateDsObj[config.configName]}
                columns={this.investigateColumnsObj[config.configName]}
              />
            }

          </srm-scroll-tab-item> :
          null,
        )
      }
    </srm-scroll-tab>
    ;
  }
};
</script>

<style scoped lang="stylus">

</style>