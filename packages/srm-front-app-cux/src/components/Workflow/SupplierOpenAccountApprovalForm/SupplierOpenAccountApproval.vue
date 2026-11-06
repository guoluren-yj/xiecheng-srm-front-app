<!-- 伽蓝纯二开的供应商开户功能- -->
<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-tab class="content">
      <!-- 基本信息 -->
      <srm-tab-pane
        :label="
          $T('scux.supplierOpenAccount.view.title.basicInfo').$D('基本信息')
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getBasicDetailColums,
              supplierOpenAccountFormInfo,
              $T('scux.supplierOpenAccount.view.title.basicInfo').$D('基本信息')
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{
                $T(
                  "scux.supplierOpenAccount.model.supplierOpenAccount.srmCode"
                ).$D("SRM编码")
              }}
              : {{ supplierOpenAccountFormInfo.supplierCompanyNum }}
            </div>
            <customize
              :columns="getBasicColums"
              :data-source="supplierOpenAccountFormInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 工商资料 -->
      <srm-tab-pane
        :label="
          $T('scux.supplierOpenAccount.view.title.commerceInfo').$D('工商资料')
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getCommericalInfoDetailColums,
              commericalInfo,
              $T('scux.supplierOpenAccount.view.title.commerceInfo').$D(
                '工商资料'
              )
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{ $T("mallf.common.model.registerAddress").$D("注册地址") }}：{{
                commericalInfo.registeredCountryName
              }}|{{ commericalInfo.registeredRegionName }}
            </div>
            <customize
              :columns="getCommerceInfoColums"
              :data-source="commericalInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 联系人 -->
      <srm-tab-pane
        :label="$T('scux.supplierLongList.model.contactName').$D('联系人')">
        <div class="content-item">
          <div
            v-for="(contact, key) in contactList"
            :key="key"
            class="card has-border">
            <div class="contact">
              <div class="contact-title">
                <srm-tag
                  v-if="contact.defaultFlag == 1"
                  size="small"
                  type="primary">
                  {{
                    $T(
                      "scux.supplierOpenAccount.modal.supplierOpenAccount.defaultContact"
                    ).$D("默认联系人")
                  }}
                </srm-tag>
                <span class="card-head">{{ contact.name }} / {{ contact.genderMeaning }}</span>
              </div>
              <div
                class="supply-open-account-status"
                :class="{
                  'open-status': contact.enabledFlag,
                  'disable-status': !contact.enabledFlag,
                }">
                {{
                  contact.enabledFlag == 1
                    ? $T("hipspfm.common.status.enabledFlag.enable").$D("启用")
                    : $T("hipspfm.common.status.enabledFlag.unenable").$D(
                      "不启用"
                    )
                }}
              </div>
            </div>
            <customize
              :columns="getContactColums"
              :data-source="contact"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 账户资料 -->
      <srm-tab-pane
        :label="
          $T('scux.supplierOpenAccount.view.title.accountInfo').$D('账户资料')
        ">
        <div class="content-item">
          <div
            v-for="(account, key) in accountInfoList"
            :key="key"
            class="card has-border">
            <div class="account">
              <div class="account-title">
                <srm-tag
                  v-if="account.mainAccountFlag == 1"
                  size="small"
                  type="primary">
                  {{
                    $T("sslm.supplierDetail.view.message.primaryAccount").$D(
                      "主账号"
                    )
                  }}
                </srm-tag>
                <span class="card-head">{{ account.bankAccountName }}</span>
              </div>
              <div
                class="supply-open-account-status"
                :class="{
                  'open-status': account.enabledFlag,
                  'disable-status': !account.enabledFlag,
                }">
                {{
                  account.enabledFlag == 1
                    ? $T("hipspfm.common.status.enabledFlag.enable").$D("启用")
                    : $T("hipspfm.common.status.enabledFlag.unenable").$D(
                      "不启用"
                    )
                }}
              </div>
            </div>
            <customize
              :columns="getAccountInfoColums"
              :data-source="account"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 开票资料 -->
      <srm-tab-pane
        :label="
          $T('scux.supplierOpenAccount.view.title.invoiceInfo').$D('开票资料')
        ">
        <div class="content-item">
          <div class="card">
            <div class="card-head">
              {{
                $T(
                  "scux.supplierOpenAccount.modal.supplierOpenAccount.taxRegistrationNumber"
                ).$D("纳税人识别号")
              }}：{{ invoiceInfo.taxRegistrationNumber }}
            </div>
            <customize
              :columns="getInvoiceInfoColums"
              :data-source="invoiceInfo"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 业务资料 -->
      <srm-tab-pane
        :label="
          $T('scux.supplierOpenAccount.view.title.businessInfo').$D('业务资料')
        ">
        <srm-button-group>
          <srm-button fill>
            <srm-upload
              :attachment-uuid="attachmentUuid"
              :show-count="false"
              :show-icon="false"
              :title="
                $T('smbl.common.model.purchaseInfoAttachment').$D(
                  '采购信息记录相关附件'
                )
              "
              :desc-title="
                $T('scux.businessInfo.model.attachmentUuid').$D('业务资料附件')
              "
              @showFilePopup="viewAttachment"/>
          </srm-button>
        </srm-button-group>
        <div class="content-item">
          <div class="card">
            <div class="card-head">
              {{
                $T(
                  "scux.supplierOpenAccount.modal.supplierOpenAccount.signatureType"
                ).$D("电子签章类型")
              }}：{{ supplierOpenAccountFormInfo.signatureTypeMeaning }}
            </div>
            <customize
              :columns="getBusinessInfoColums"
              :data-source="supplierOpenAccountFormInfo"/>
          </div>
          <div class="card">
            <!-- 个性化组件替换后的代码 -->
            <customize-detail
              :columns="getRemarkColums"
              :data-source="supplierOpenAccountFormInfo"/>
          </div>
        </div>
      </srm-tab-pane>
    </srm-tab>
    <!-- 供应商开户明细详情页pop -->
    <srm-detail-pop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :columns="getPopInfoColumns"/>
    <!-- 考察报告 -->
    <srm-popup :visible.sync="feedBackReportVisible" title="考察报告" rounded>
      <div class="feed-back-report">
        <div
          v-for="(item, index) in feedBackReportList"
          :key="index"
          class="card">
          <div class="report-title">
            <span class="evalNum">{{ item.evalNum }}</span>
            <span
              :class="{
                'going-status':
                  item.evalStatus != 'APPROVED' &&
                  item.evalStatus != 'REJECTED',
                'success-status': item.evalStatus == 'APPROVED',
                'reject-status': item.evalStatus == 'REJECTED',
              }">{{ item.evalStatusMeaning }}</span>
          </div>
          <div class="content">{{ item.evalDescription }}</div>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import SrmButtonGroup from "@/components/V5/SrmButtonGroup";
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import {
  getSupplyAccountInfoApi,
  getSuppliersListApi,
  getContactListApi,
  getAccountListApi,
  getTemplateModulesApi,
  getInvestigateBasicsApi,
  getFeedBackReportsApi,
  getCompanyNamesApi
} from "./api/SupplyOpenAccount";
export default {
  modules: [ "mallf.common", "spfm.enterprise", "scux.supplierOpenAccount", "scux.supplierLongList", "hipspfm.common", "sslm.supplierDetail", "smbl.common", "scux.businessInfo", "sslm.siteInvestigateReport", "spfm.partnership", "srmScux.companySubAccount", "scux.supplierPackingNotice", "hpfm.bank", "sslm.pointExamine", "spfm.bank", "sslm.supplierInform", "sslm.supplierWarehouse", "spfm.certificateAuthority" ],
  name: "SupplierOpenAccountApproval",
  components: {
    SrmButtonGroup,
    SrmDetailPop,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      attachmentUuid: "", //当前传入的文件uuid
      supplierCompanyId: "",
      headTitle: "", //表头标题
      supplierBasicId: 0,
      investgHeaderId: "",
      accountId: "",
      companyId: 0,
      supplierTenantId: 0,
      supplierOpenAccountFormInfo: {}, //供应商开户信息
      commericalInfo: {}, //工商资料
      approvalFormInfo: {},
      contactList: [], //联系人列表
      accountInfoList: [], //账户信息列表
      invoiceInfo: {}, //开票资料
      srmDetailPop: false, //明细页pop
      companyEmail: "", //公司邮箱
      getPopInfoColumns: [],
      detailInfo: {},
      feedBackReportList: [], //考察报告
      feedBackReportVisible: false,
      companyNameList:[]
    };
  },
  computed: {
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supplierCompanyName").$D("供应商全称"),
          fieldCode: "supplierCompanyName",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supplierShortName").$D("供应商简称"),
          fieldCode: "shortName",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.unitName").$D("提报部门"),
          fieldCode: "unitName",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supplierCategory").$D("供应商类别"),
          fieldCode: "supplierCategoryMeaning",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.territory").$D("负责区域"),
          fieldCode: "territory",
          formRow: 4,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.ouIds").$D("公司代码"),
          fieldCode: "ouIds",
          formRow: 5,
          formCol: 1,
          render: () =>
            <div>
              {this.companyNameList.map((v) =>
                v.meaning === this.companyNameList[this.companyNameList.length - 1] ?
                  <span> {v.meaning}</span> :
                  <span>{v.meaning} /</span>
              )}
            </div>
          ,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.paymentDay").$D("账期"),
          fieldCode: "paymentDayMeaning",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.appraisalResult").$D("评审结果"),
          fieldCode: "appraisalResultMeaning",
          formRow: 6,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.appraisalScope").$D("主要合作范围"),
          fieldCode: "appraisalScope",
          required: 1,
          formRow: 7,
          formCol: 1,
        },
      ];

      return columns;
    },
    // 基本信息详情
    getBasicDetailColums() {
      const columns = [
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supAccountNumber").$D("流程编号"),
          fieldCode: "supAccountNumber",
          formRow:10,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.unitName").$D("提报部门"),
          fieldCode: "unitName",
          formRow:20,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.realName").$D("提报人"),
          fieldCode: "realName",
          formRow:20,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.accountType").$D("类型"),
          fieldCode: "accountTypeMeaning",
          required: 1,
          formRow:30,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.submitDate").$D("提报日期"),
          fieldCode: "creationDate",
          formRow:40,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.srmCode").$D("SRM编码"),
          fieldCode: "supplierCompanyNum",
          required: 1,
          formRow:50,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supplierCompanyName").$D("供应商全称"),
          fieldCode: "supplierCompanyName",
          required: 1,
          formRow:60,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supplierShortName").$D("供应商简称"),
          fieldCode: "shortName",
          required: 1,
          formRow:70,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.formerName").$D("供应商曾用名"),
          fieldCode: "formerName",
          formRow:80,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supplierCategory").$D("供应商类别"),
          fieldCode: "supplierCategoryMeaning",
          required: 1,
          formRow:80,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.territory").$D("负责区域"),
          fieldCode: "territory",
          formRow:90,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.ouIds").$D("公司代码"),
          fieldCode: "ouIds",
          required: 1,
          formRow:100,
          formCol:10,
          render: () =>
            <div>
              {this.companyNameList.map((v) =>
                v === this.companyNameList[this.companyNameList.length - 1] ?
                  <span> {v.meaning}</span> :
                  <span>{v.meaning} /</span>
              )}
            </div>
          ,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.supplierProperty").$D("供应商属性"),
          fieldCode: "supplierPropertyMeaning",
          required: 1,
          formRow:110,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.procurementSection").$D("采购组"),
          fieldCode: "procurementSectionMeaning",
          required: 1,
          formRow:120,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.paymentDay").$D("账期"),
          fieldCode: "paymentDayMeaning",
          required: 1,
          formRow:130,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.otherCause").$D("其他账期说明"),
          fieldCode: "otherCause",
          required: 1,
          formRow:140,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.appraisalResult").$D("评审结果"),
          fieldCode: "appraisalResultMeaning",
          required: 1,
          formRow:150,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.projectCode").$D("项目编码"),
          fieldCode: "projectNum",
          formRow:160,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.projectWBS").$D("项目WBS"),
          fieldCode: "wbsCode",
          required: 1,
          formRow:170,
          formCol:10
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.model.supplierOpenAccount.appraisalScope").$D("主要合作范围"),
          fieldCode: "appraisalScope",
          required: 1,
          formRow:180,
          formCol:10
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.feedBack").$D("考察报告"),
          formRow: 190,
          formCol: 10,
          render: () => <a style="color: blue" >{this.$T(
            "mallf.common.model.lookDetails"
          ).$D("查看详情")}</a>,
          callBack: () => {
            this.getFeedBackReports();
          },
        },
      ];

      return columns;
    },
    // 工商资料
    getCommerceInfoColums() {
      const columns = [
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.addressDetail").$D("经营地址"),
          fieldCode: "addressDetail",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.legalRepName").$D("法人代表"),
          fieldCode: "legalRepName",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.registeredCapital").$D("注册资金"),
          fieldCode: "registeredCapital",
          formRow: 2,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.companyType").$D("企业性质"),
          fieldCode: "companyTypeMeaning",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.companyPhone").$D("公司电话"),
          fieldCode: "companyPhone",
        },
        {
          fieldName: this.$T("scux.supplierLongList.model.email").$D("邮箱"),
          fieldCode: "companyMail",
        },
      ];

      return columns;
    },
    // 工商资料详情
    getCommericalInfoDetailColums() {
      const columns = [
        {
          fieldName: this.$T("mallf.common.model.registerAddress").$D("注册地址"),
          fieldCode: "registeredCountryName",
          render: (val, record) => `${record.registeredCountryName}|${record.regionPathName}`,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.addressDetail").$D("经营地址"),
          fieldCode: "addressDetail",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.companyType").$D("企业性质"),
          fieldCode: "companyTypeMeaning",
        },
        {
          fieldName: this.$T("spfm.partnership.model.company.unifiedSocialCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.licenceEndDate").$D("营业执照有效期至"),
          fieldCode: "licenceEndDate",
          render: (val, record) => !val && record.longTermFlag ? this.$T("spfm.enterprise.view.message.longTerm").$D("长期") : val,
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.registeredCapital").$D("注册资金"),
          fieldCode: "registeredCapital",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.legalRepName").$D("法人代表"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.companyPhone").$D("公司电话"),
          fieldCode: "companyPhone",
        },
        {
          fieldName: this.$T("scux.supplierLongList.model.email").$D("邮箱"),
          fieldCode: "companyMail",
        },
      ];

      return columns;
    },
    // 联系人
    getContactColums() {
      const columns = [
        {
          fieldName: this.$T("scux.supplierLongList.model.email").$D("邮箱"),
          fieldCode: "mail",
        },
        {
          fieldName: this.$T("srmScux.companySubAccount.model.phoneRegin").$D("手机号码"),
          fieldCode: "mobilephone",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.model.suDe.contactsData.telephone").$D("固定电话"),
          fieldCode: "telephone",
        },
        {
          fieldName: this.$T("scux.supplierPackingNotice.model.deptId").$D("部门"),
          fieldCode: "department",
        },
        {
          fieldName: this.$T("scux.supplierLongList.model.position").$D("职位"),
          fieldCode: "position",
        },
      ];

      return columns;
    },
    // 账号资料
    getAccountInfoColums() {
      const columns = [
        {
          fieldName: this.$T("hpfm.bank.model.bank.bankName").$D("银行名称"),
          fieldCode: "bankName",
        },
        {
          fieldName: this.$T("sslm.pointExamine.model.common.bankCode").$D("银行编码"),
          fieldCode: "bankCode",
        },
        {
          fieldName: this.$T("spfm.bank.model.bank.bankFirm").$D("联行行号"),
          fieldCode: "bankFirm",
        },
        {
          fieldName: this.$T("sslm.supplierInform.model.supplierInform.depositBank").$D("开户行名称"),
          fieldCode: "bankBranchName",
        },
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
        },
        {
          fieldName: this.$T("spfm.certificateAuthority.model.certificateAuthority.bankAccountNum").$D("银行账户"),
          fieldCode: "bankAccountNum",
        },
      ];

      return columns;
    },
    // 开票资料
    getInvoiceInfoColums() {
      const columns = [
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.address").$D("地址"),
          fieldCode: "taxRegistrationAddress",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.telephone").$D("电话"),
          fieldCode: "taxRegistrationPhone",
        },
      ];

      return columns;
    },
    // 业务资料
    getBusinessInfoColums() {
      const columns = [
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.contractName").$D("合同接收人姓名"),
          fieldCode: "contractName",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.contractPhone").$D("合同接收人手机号"),
          fieldCode: "contractPhone",
        },
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.arrivalRecognition").$D("到货批次识别码"),
          fieldCode: "arrivalRecognitionMeaning",
        },
      ];

      return columns;
    },
    getRemarkColums() {
      const columns = [
        {
          fieldName: this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.remark").$D("备注说明"),
          fieldCode: "remark",
          render: (val) => <SrmTextareaBox value={val} disabled />,
        },
      ];

      return columns;
    },
  },
  async mounted() {
    this.accountId = this.changeReqId;
    this.getCompanyNameList();
    await this.getSupplyAccountInfo();
    await this.getCommericalInvoiceInfo();
    this.getContactList();
    this.getAccountList();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.supplierOpenAccount.view.title.supplierOpenAccount").$D(
        "供应商开户卡"
      )
    );
  },
  methods: {
    //跳到详情页
    goDetail(columns, infos, title) {
      this.getPopInfoColumns = columns;
      this.detailInfo = infos;
      this.headTitle = title;
      this.srmDetailPop = !this.srmDetailPop;
    },
    // 获取供应商账户基本信息和业务资料
    async getSupplyAccountInfo() {
      await getSupplyAccountInfoApi(this.accountId).then((res) => {
        this.supplierOpenAccountFormInfo = res;
        this.supplierCompanyId = res.supplierCompanyId;
        this.companyId = res.companyId;
        this.supplierTenantId = res.supplierTenantId;
      });
    },
    // 获取工商资料和开票资料
    async getCommericalInvoiceInfo() {
      await getSuppliersListApi(this.supplierCompanyId, this.companyId).then(
        async (res) => {
          this.commericalInfo = res.basic;
          this.supplierBasicId = res.basic.supplierBasicId;
          await this.getCompanyEmail();
          this.commericalInfo.companyMail = this.companyMail;
          this.invoiceInfo = res.invoice;
        }
      );
    },
    // 获取联系人列表
    async getContactList() {
      await getContactListApi(
        this.supplierCompanyId,
        this.supplierTenantId,
        this.companyId
      ).then((res) => {
        this.contactList = res;
      });
    },
    // 获取账户资料列表
    async getAccountList() {
      await getAccountListApi(
        this.supplierCompanyId,
        this.supplierTenantId,
        this.companyId
      ).then((res) => {
        this.accountInfoList = res;
      });
    },
    //查看业务资料附件
    viewAttachment() {
      this.attachmentUuid =
        this.supplierOpenAccountFormInfo.attachmentUuid || uuid();
    },
    //获取工商资料公司邮箱
    async getCompanyEmail() {
      await getTemplateModulesApi(
        this.supplierCompanyId,
        this.supplierTenantId,
        this.companyId
      ).then(async (res) => {
        if (res.length) {
          // eslint-disable-next-line no-unused-vars
          for (let item of res) {
            if (item.configName === "sslm_investg_basic") {
              this.investgHeaderId = item.investgHeaderId;
            }
          }
          await getInvestigateBasicsApi(
            this.investgHeaderId,
            this.supplierBasicId
          ).then((result) => {
            this.companyMail = result.companyMail;
          });
        }
      });
    },
    // 获取考察报告
    async getFeedBackReports() {
      await getFeedBackReportsApi(this.supplierCompanyId).then((res) => {
        this.feedBackReportList = res.content;
        this.feedBackReportVisible = !this.feedBackReportVisible;
      });
    },
    //获取基本信息下公司代码列表
    async getCompanyNameList() {
      await getCompanyNamesApi().then((res) => {
        this.companyNameList = res;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .customize-detail .form-item .value {
  justify-content: start;
}

>>> .srm-tag {
  margin-right: 8px;
}

>>> .srm-tag-mid {
  margin: 3px 12px 0 0;
  height: 16px;
}

>>> .srm-tag-fill-warn {
  background: #ff6937;
}

>>> .srm-tag-fill-info {
  background: #f6f6f6;
  color: #333;
}

>>> .file-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: var(--color-font-default-d);
}

>>> .navWrap .navContent li.active:before {
  display: none;
}

>>> .navWrap .navContent li {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #afafaf;
}

>>> .navWrap .navContent li.active {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #1f1f1f;
}

>>> .textarea-box {
  padding: 0;
  border: 0;
}

>>> .srm-button-group .srm-button-group-area {
  padding-bottom: 12px;
  border-bottom: 1px solid #f6f6f6;
}
>>> .srm-upload-title{
  color:#fff;
}
.open-status {
  color: #276EF1;
}

.disable-status {
  color: #E11900;
}

.success-status {
  color: #05944F;
}

.going-status {
  color: #276EF1;
}

.reject-status {
  color: #E11900;
}

.feed-back-report {
  box-sizing: border-box;
  padding: 0 15px;

  .card {
    box-sizing: border-box;
    padding: 16px 0;

    .report-title {
      display: flex;
      justify-content: space-between;

      .evalNum {
        font-size: 16px;
        font-family: Alibaba, Alibaba-PuHuiTi;
        font-weight: PuHuiTi;
        color: #333333;
      }
    }

    .content {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #757575;
      margin-top: 3px;
    }
  }
}

.detail-wrap {
  height: calc(100vh - 200px);
  overflow: auto;

  .contact, .account {
    display: flex;
    justify-content: space-between;
  }

  .supply-open-account-status {
    font-size: 14px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    margin-right: 15px;
  }

  .content {
    .card {
      box-sizing: border-box;
      padding: 16px 0 16px 15px;
    }
  }
}
</style>
