<!-- eslint-disable rulesdir/no_hips -->
<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <nav-head :title="$T('sslm.supplierDetail.view.message.title.supplierLifetime').$D('生命周期')" />
    <div class="srm-main-info">
      <!-- 头信息 -->
      <div class="srm-div-headInfo">
        <li>
          <img src="@/assets/NoLogo@3x.png" alt="">
        </li>
        <li>
          <span class="companyName">{{ basicInfo.companyName }}</span>
          <gan-so-company-tag-element v-if="renderCompanyTagElement()" :go-to-tab="handleGoToTab" />
          <span>{{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.companyNum").$D("客户编码") }}：<i> {{
            basicInfo.companyNum }} </i></span>
          <span>{{ $T("sslm.supplierDetail.model.supDetail.companyInfo.createDate").$D("注册时间") }}：<i> {{
            basicInfo.creationDate | CalcDate }}</i></span>
          <span>{{ $T("sslm.supplierDetail.model.supplierDetail.lastEditDate").$D("最近更新") }}：<i> {{
            historys.lastUpdateDate }}</i></span>
          <div style="display: flex">
            <span> {{ $T("sslm.supplierDetail.button.relatedForm").$D("关联单据") }}： </span>
            <span style="color: blue" @click="showRelatedForm"> {{
              $T("sslm.supplierDetail.button.seeRelatedForm").$D("查看关联单据") }} </span>
          </div>
        </li>
      </div>

      <!-- 内容区域 -->
      <srm-scroll-tab ref="scrollTab" class="content" customize-code="SMBL.SUPPLIER_LIFE_CYCLE.DETAIL_INFO.TABS">
        <srm-scroll-tab-item key="register"
                             :label="$T('sslm.supplierDetail.view.message.title.registrationInfo').$D('登记信息')" code="register">
          <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.REGISTER_INFO" :data-source="basicInfo"
                     :columns="getRegisterInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item key="business" :label="$T('sslm.supplierDetail.view.message.basicBusinessInfo').$D('业务信息')"
                             code="business">
          <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.BUSINESS_INFO" :data-source="headInfo.business"
                     :columns="getBusinessInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="!configNameList.includes('sslmInvestgFin')" key="finance"
                             :label="$T('sslm.supplierDetail.view.message.title.treeYearsFinance').$D('财务状况')" code="finance">
          <div v-for="(item, index) in headInfo.financeList" :key="index">
            <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.FINANCE_INFO" :data-source="item"
                       :columns="getFinanceInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item key="supplierLife"
                             :label="$T('sslm.supplierDetail.view.message.title.supplierLifetime').$D('生命周期')" code="supplierLife">
          <hips-timeline class="srm-lifeCycle">
            <hips-timeline-item v-for="(item, index) in lifeCycleInfo" :key="index"
                                color="var(--color-other-default-b)">
              <div class="lifeCycle-item-title">{{ item.reqStage }}</div>
              <div class="lifeCycle-content">
                <div>
                  <span>{{ $T("sslm.supplierDetail.view.message.step.proposer").$D("申请人") }}：{{ item.proposer }}</span>
                  <span>{{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.index").$D("序号") }}：{{ index + 1
                  }}</span>
                </div>
                <div>
                  {{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.reqProcessDate").$D("申请时间") }}：{{
                    item.reqProcessDate | CalcDate }}
                </div>
                <div>{{ $T("sslm.supplierDetail.view.message.step.approver").$D("审批人") }}：{{ item.approver }}</div>
              </div>
            </hips-timeline-item>
          </hips-timeline>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="!configNameList.includes('sslmInvestgSupplierCate')" key="supplierClass"
                             :label="$T('sslm.supplierDetail.view.message.title.supplierClass').$D('供应商分类')" code="supplierClass">
          <div v-for="(item, index) in supplierClassification" :key="index">
            <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.SUPPLIER_CLASS_INFO" :data-source="item"
                       :columns="getSupplierClassInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item key="supplyCapacity"
                             :label="$T('sslm.supplierDetail.view.fixCatalog.supplyCapacityList').$D('供货能力清单')" code="supplyCapacity">
          <div v-for="(item, index) in supplyCapacityList" :key="index" @click="showSupplierCapacityListDetail(item)">
            <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.SUPPLY_CAPACITY_INFO" :data-source="item"
                       :columns="getSupplyCapacityInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="!configNameList.includes('sslmInvestgContact')" key="contact"
                             :label="$T('sslm.supplierDetail.view.message.title.supplierContact').$D('联系人')" code="contact">
          <div v-for="(item, index) in contactList" :key="index" @click="showSupplyConcatDetail(item)">
            <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.SUPPLY_CONTACT_INFO" :data-source="item"
                       :columns="getSupplierContactInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="!configNameList.includes('sslmInvestgAddress')" key="address"
                             :label="$T('sslm.supplierDetail.view.message.title.supplierAddress').$D('地址')" code="address">
          <div v-for="(item, index) in addressList" :key="index">
            <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.ADDRESS_INFO" :data-source="item"
                       :columns="getAddressInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="!configNameList.includes('sslmInvestgBankAccount')" key="bankAccount"
                             :label="$T('sslm.supplierDetail.view.message.title.supplierBankAccount').$D('银行账户')" code="bankAccount">
          <div v-for="(item, index) in bankAccountList" :key="index">
            <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.BANK_ACCOUNT_INFO" :data-source="item"
                       :columns="getBankAccountInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="!configNameList.includes('sslmInvestgAttachment')" key="attachment"
                             :label="$T('sslm.supplierDetail.title.attachment').$D('附件信息')" code="attachment">
          <div v-for="(item, index) in headInfo.attachmentList" :key="index">
            <customize :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.ATTACHMENT_INFO" :data-source="item"
                       :columns="getAttachmentInfoColumns" />
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item key="purchaseInfo" code="purchaseInfo"
                             :label="$T('sslm.common.view.title.purchaseInfo').$D('采购财务信息')">
          <h2>{{ $T('sslm.common.view.title.purchaseHeaderInfo').$D('采购财务头信息') }}</h2>
          <customize need-padding :data-source="purchaseHeaderData" :columns="getPurchaseHeaderColumns"
                     code="SMBL.SUPPLIER_LIFE_CYCLE.PURCHASE_HEADER" />
          <h2>{{ $T('sslm.common.view.title.purchaseLineInfo').$D('采购财务行信息') }}</h2>
          <srm-list :data-set="purchaseLineDS" :scrollable="false" :columns="getPurchaseColumns"
                    code="SMBL.SUPPLIER_LIFE_CYCLE.PURCHASE_LINE" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item key="otherInfo" :label="$T('sslm.supplierDetail.view.message.otherInfo').$D('其他信息')"
                             code="otherInfo">
          <customize :need-padding="true" :data-source="otherInfo" :columns="getOtherInfoColumnsMerge()"
                     code="SMBL.SUPPLIER_LIFE_CYCLE.OTHER_INFO" />
        </srm-scroll-tab-item>
        <!-- 调查表页签 -->
        <srm-scroll-tab-item v-for="(config) in configList" :key="config.configName" :code="config.configName"
                             :label="config.configDescription">
          <div v-if="questionnaireForm[config.configName]">
            <srm-form :data-set="investigateDsObj[config.configName]"
                      :columns="investigateColumnsObj[config.configName]" />
          </div>
          <div v-else>
            <srm-list :scrollable="false" :data-set="investigateDsObj[config.configName]"
                      :columns="investigateColumnsObj[config.configName]" />
          </div>
        </srm-scroll-tab-item>

        <srm-scroll-tab-item v-if="supplierSourceDescFlag" key="supplierSourceDesc" code="supplierSourceDesc"
                             :label="$T('sslm.common.cux.tqly.supplierSourceDesc').$D('供应商来源说明')">
          <customize need-padding :data-source="otherInfo" :columns="getSupplierSourceDescColumns" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 供货能力清单信息弹窗 -->
    <srm-popup :visible.sync="supplierCapacityListVisible" height="100%" position="right"
               :title="$T('sslm.supplierDetail.view.message.title.supplyCapacityList').$D('供货能力详情')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.SUPPLY_CAPACITY_INFO_DETAIL"
                          :data-source="currentCapacityListInfo" :columns="getSupplyCapacityListDetailColumns" />
      </div>
    </srm-popup>
    <!-- 联系人信息弹窗 -->
    <srm-popup :visible.sync="supplyConcatVisible" height="100%" position="right"
               :title="$T('hipspfm.supplierLifeCycle.view.title.concatInfo').$D('联系人信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" code="SMBL.SUPPLIER_LIFE_CYCLE.SUPPLY_CONTACT_INFO_DETAIL"
                          :data-source="currentSupplyConcatInfo" :columns="getSupplyConcatDetailColumns" />
      </div>
    </srm-popup>
    <!-- 元组弹窗 -->
    <gan-so-modal :modal-props="gansoModalProps" />
  </div>
</template>

<script>
import uuid from "uuid";
import { SrmUtil, DataSet } from "srm-mobile-ui";
import { isEmpty } from "@/utils/index";
import { Timeline, TimelineItem } from "hips";
import { camelCase } from "lodash";
import {
  getSuppliersApi,
  getLifeCycleListApi,
  getSupplierClassificationListApi,
  getSupplyCapacityListApi,
  getVersionHistoryApi,
  getCompanyIdApi,
  fetchOtherInfo,
  fetchPurchaseHeader,
  fetchQuestionnaireTmpl,
} from "../api";
import { getPurchaseLineDS } from "../datasource/getPurchaseLineDS";
import { questionnaireForm, questionnaireConfigName } from "@/components/Investigation/utils";
import { getInvestigateDS, getInvestigateColums } from "@/components/Investigation/getInvestigateDS";
import SupplierRelatedForm from "@/components/SupplierRelatedDoc/SupplierRelatedForm";
import getColumns from "../mixins/getColumns";
import GanSoCompanyTagElement from "../components/GanSoCompanyTagElement.vue";
import CompleteMethod from "../../CUX_PART/Method/CompleteMethod";
import GanSoModal from "../components/GanSoModal.vue";
import { abnormalAttCountTableDs, evaluationAttCountTableDs, checkAttCountTableDs } from "../datasource/ganSoModalDs";

export default {
  modules: [ "sslm.supplierDetail", "sslm.supplyAbility", "hipspfm.supplierLifeCycle", "hipspfm.common", "sodr.sendOrder", "sslm.evaluationQuery", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.common", "spcm.purchaseContractView", "spcm.contractTemplate", "sslm.investigationCorrelation", "spcm.purchaseContractType", "smbl.common", "ssrc.inquiryHall", "sqam.common", "hzero.button", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "sagm.common", "spcm.purchaseRequisitionCreation", "ssrc.common", "hipspfm.workFlowAgrement", "sodr.common", "small.common", "entity.attachment", "sqam.inquiryHall", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "ssrc.queryRfq", "hipspfm.expertScoring", "hipspfm.invoiceBill", "ssrc.bidHall", "smbl.inquiryHall", "sslm.commonApplication", "spfm.importErp", "sslm.supplierInform", "sslm.purchaserEvaluation" ],
  name: "DeliveryBillDetail",
  components: {
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
    GanSoCompanyTagElement: GanSoCompanyTagElement,
    GanSoModal: GanSoModal,
  },
  extends: CompleteMethod,
  mixins: [ getColumns ],
  data() {
    // 调查表页签初始化一个ds,不然ds没有current,页面不展示数据
    const investigateDefaultDs = {};
    questionnaireConfigName.forEach((item) => {
      investigateDefaultDs[item] = new DataSet();
    });
    return {
      headInfo: {}, // 信息
      historys: {}, // 最近更新时间
      lifeCycleInfo: [], // 生命周期信息
      supplierClassification: [], // 供应商分类信息
      addressList: [], // 地址信息
      bankAccountList: [], // 银行账户信息
      supplyCapacityList: [], // 供货能力清单信息
      contactList: [], // 联系人信息
      //接收传参
      companyId: "", //公司id
      tenantId: "", // tenantId
      supplierCompanyId: "", //供应商公司id
      supplierTenantId: "", //供应商租户id
      spfmCompanyId: "",
      spfmSupplierCompanyId: "",
      isAssignFlag: 0,
      basicInfo: {},
      businessNature: "", //经营性质
      uuid: "",
      logoFlag: false,
      operationPopup: false, //操作记录弹窗标识
      supplierCapacityListVisible: false, //供货能力清单信息弹窗
      currentCapacityListInfo: {}, //供货能力清单信息
      supplyConcatVisible: false, //联系人信息弹窗
      currentSupplyConcatInfo: {}, //联系人信息
      otherInfo: {}, // 其他信息
      purchaseHeaderData: {},
      questionnaireForm,
      configList: [], // 调查表配置
      configNameList: [], // 调查表页面key集合
      investigateDsObj: investigateDefaultDs, // 调查表ds集合
      investigateColumnsObj: {}, // 调查表columns集合
      purchaseLineDS: new DataSet(getPurchaseLineDS()),
      gansoModalProps: {
        visible: false,
        title: "",
        popupData: [],
        dataSet: {},
      },
      checkAttCountTableDs_: new DataSet(checkAttCountTableDs()),
      abnormalAttCountTableDs_: new DataSet(abnormalAttCountTableDs()),
      evaluationAttCountTableDs_: new DataSet(evaluationAttCountTableDs()),
    };
  },
  computed: {
    getTenantNum() {
      return window.localStorage.getItem("tenantNum");
    },
    // 仅天齐锂业展示供应商来源说明(src-42169)
    supplierSourceDescFlag() {
      return SrmUtil.getTenantNum() === "SRM-TQLY";
    },
  },
  async mounted() {
    this.$loading.show();
    this.tenantId = this.$route.query.tenantId;
    this.supplierCompanyId = this.$route.query.supplierCompanyId;
    this.supplierTenantId = this.$route.query.partnerTenantId;
    this.spfmCompanyId = this.$route.query.spfmCompanyId;
    this.spfmSupplierCompanyId = this.$route.query.spfmSupplierCompanyId;
    this.isAssignFlag = this.$route.query.isAssignFlag;
    const companyId = this.$route.query.companyId;
    this.companyId = companyId;
    if (!companyId) {
      const params = {
        lovCode: "SSLM.USER_AUTH.COMPANY",
        tenantId: this.tenantId,
        partnerCompanyId: this.supplierCompanyId,
      };
      await getCompanyIdApi(params).then((response) => {
        if (!isEmpty(response)) {
          this.companyId = response[0].companyId;
        }
      });
    }
    if (this.companyId && this.supplierCompanyId) {
      try {
        await this.getSupplier();
        await this.getVersionHistory();
        await this.getLifeCycleList();
        await this.getSupplierClassificationList();
        await this.getSupplyCapacityList();
        await this.getOtherInfo();
        await this.getQuestionnaireTmpl();
        await this.getPurchaseHeader();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
    this.$loading.hide();
  },
  methods: {
    handleGoToTab(code) {
      const index = this.$refs.scrollTab._data.children.findIndex((item) => item?.code === code);
      if (index === -1) {
        return;
      }
      this.$refs.scrollTab.changeTab(index);
    },
    showRelatedForm() {
      this.$popup({
        title: this.$T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SupplierRelatedForm
          supplierCompanyId={this.basicInfo.supplierCompanyId}
          requisitionId={this.basicInfo.requisitionId}
          toStageId={this.basicInfo.toStageId}
          companyId={this.companyId}
          parentRouter={this.$router}
          isLifeCyclesSummaryFlag={1}
        />,
      });
    },
    //获取供应商信息
    async getSupplier() {
      const params = {
        companyId: this.companyId,
        customizeUnitCode: [
          "SSLM.SUPPLIER_LIFE_CYCLE.DETAIL.BUSINESS",
          "SSLM.SUPPLIER_LIFE_CYCLE.FINANCE_LIST",
          "SSLM.SUPPLIER_LIFE_CYCLE.INVOICE_INFO",
          "SSLM.SUPPLIER_LIFE_CYCLE.ATTACHMENT_LIST",
          "SSLM.SUPPLIER_LIFE_CYCLE.DETAIL_REGISTRATION_INFO",
          "SSLM.SUPPLIER_LIFE_CYCLE.DETAIL_REGISTRATION_OVERSEAS",
          "SSLM.SUPPLIER_LIFE_CYCLE.DETAIL_REGISTRATION_PERSONAL",
          "SSLM.SUPPLIER_LIFE_CYCLE.SUPPLIER_BASIC",
          "SSLM.SUPPLIER_LIFE_CYCLE.CONTACTS_INFO",
          "SSLM.SUPPLIER_LIFE_CYCLE.ADDRESS_INFO",
          "SSLM.SUPPLIER_LIFE_CYCLE.BANK_INFO",
        ].join(),
        supplierCompanyId: this.supplierCompanyId
      };
      const headInfo = await getSuppliersApi(params);
      this.headInfo = headInfo;
      this.basicInfo = headInfo.basic;
      this.contactList = headInfo.contactList;
      this.addressList = headInfo.addressList;
      this.bankAccountList = headInfo.bankAccountList;
      this.uuid = uuid();
      this.logoFlag = Boolean(headInfo.business.logoUrl);
      //经营性质
      let arr = [];
      if (this.headInfo.business.manufacturerFlag === 1) {
        arr.push(this.$T("sslm.supplierDetail.model.companyInfo.manufacturerFlag").$D("制造商"));
      }
      if (this.headInfo.business.traderFlag === 1) {
        arr.push(this.$T("sslm.supplierDetail.model.companyInfo.traderFlag").$D("贸易商"));
      }
      if (this.headInfo.business.servicerFlag === 1) {
        arr.push(this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.servicerFlag").$D("服务商"));
      }
      if (arr.length > 1) {
        this.businessNature = arr.join("/");
      } else if (arr.length === 1) {
        this.businessNature = arr[0];
      }
    },
    //获取供应商分类信息
    async getSupplierClassificationList() {
      const params = {
        "supplierCompanyId": this.supplierCompanyId,
        "isAssignFlag": this.isAssignFlag || 1,
        "supplierTenantId": this.supplierTenantId,
      };
      const supplierClassification = await getSupplierClassificationListApi(params);
      this.supplierClassification = supplierClassification.content;
    },
    //获取生命周期信息
    async getLifeCycleList() {
      const params = {
        "supplierCompanyId": this.supplierCompanyId,
        "companyId": this.companyId
      };
      this.lifeCycleInfo = await getLifeCycleListApi(params);
    },
    //获取供货能力清单信息
    async getSupplyCapacityList() {
      const params = {
        "companyId": this.companyId,
        "supplierCompanyId": this.supplierCompanyId,
        "customizeUnitCode": "SSLM.SUPPLIER_LIFE_CYCLE.ABILITY_LINE_TABLE"
      };
      const { content = [] } = await getSupplyCapacityListApi(params);
      this.supplyCapacityList = content;
    },
    //获取历史版本信息
    async getVersionHistory() {
      const params = {
        "companyId": this.companyId,
        "partnerCompanyId": this.supplierCompanyId
      };
      this.historys = await getVersionHistoryApi(params);
    },
    merge: function (val, industryName) {
      let arr = [];
      if (val && industryName === "industryName") {
        val.forEach((element) => {
          arr.push(element.industryName);
        });
      } else if (val && industryName === "categoryName") {
        val.forEach((element) => {
          arr.push(element.categoryName);
        });
      }
      const returnVal = arr.join("/");
      return returnVal;
    },
    // 查看供货能力清单详情
    showSupplierCapacityListDetail(item) {
      this.supplierCapacityListVisible = !this.supplierCapacityListVisible;
      this.currentCapacityListInfo = item;
    },
    // 查看联系人详情
    showSupplyConcatDetail(item) {
      this.supplyConcatVisible = !this.supplyConcatVisible;
      this.currentSupplyConcatInfo = item;
    },
    buildImgUrl(fileUrl, bucketName) {
      const baseUrl = process.env.VUE_APP_BASE_URL;
      const downApi = "/hfle/v1/files/redirect-url";
      const accessToken = window.localStorage.getItem("user-token");
      const url = encodeURIComponent(fileUrl);
      return `${baseUrl + downApi}?access_token=${accessToken}&bucketName=${bucketName}&url=${url}`;
    },
    // 获取其他信息
    async getOtherInfo() {
      const params = {
        companyId: this.companyId,
        supplierCompanyId: this.supplierCompanyId,
        supplierTenantId: this.supplierTenantId,
        customizeUnitCode: "SSLM.SUPPLIER_LIFE_CYCLE.OTHER_INFO"
      };
      this.otherInfo = await fetchOtherInfo(params);
    },
    // 查询采购财务头信息
    async getPurchaseHeader() {
      const { tenantId, supplierCompanyId } = this.$route.query;
      await fetchPurchaseHeader({
        tenantId,
        companyId: this.companyId,
        supplierCompanyId,
        customizeUnitCode: "SSLM.SUPPLIER_LIFE_CYCLE.PURCHASE_HEADER",
        sourceKey: "c7n"
      }).then((response) => {
        this.purchaseHeaderData = response;
      });
      this.purchaseLineDS.setQueryParameter({
        companyId: this.companyId,
        supplierCompanyId,
      });
      this.purchaseLineDS.refresh();
    },
    // 查询调查表配置
    async getQuestionnaireTmpl() {
      const { tenantId, supplierCompanyId, partnerTenantId } = this.$route.query;
      await fetchQuestionnaireTmpl({
        tenantId,
        companyId: this.companyId,
        partnerTenantId,
        partnerCompanyId: supplierCompanyId,
        supplierBasicId: this.basicInfo.supplierBasicId,
      }).then((res) => {
        if (res && !res.failed) {
          const newConfigList = res.map((item) => {
            const { configName, investigateConfigLines } = item;
            return {
              ...item,
              configName: camelCase(configName),
              lines: (investigateConfigLines || []).map((line) => ({
                ...line,
                configName,
                fieldCode: camelCase(line.fieldCode),
              })),
            };
          });
          this.configList = newConfigList;
          this.configNameList = newConfigList.map((n) => n.configName);
          const queryParameter = {
            tenantId,
            supplierBasicId: this.basicInfo.supplierBasicId,
            investgHeaderId: res[0].investgHeaderId,
          };
          newConfigList.forEach((config) => {
            this.investigateDsObj[config.configName] = new DataSet(getInvestigateDS(config, queryParameter));
            this.investigateDsObj[config.configName].refresh();
            this.investigateColumnsObj[config.configName] = getInvestigateColums(config, this);
          });
        }
      });
    },
    renderCompanyTagElement() {
      if (this.over$showCompanyTag && typeof this.over$showCompanyTag === "function") {
        const response = this.over$showCompanyTag();

        return response;
      }
      return false;
    },
    // 查看附件列表
    downloadlFileHandler(fileList) {
      this.$showFileList({
        fileList: fileList.map((e) => ({
          fileUrl: e.fileUrl,
          fileName: e.fileName,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
    },
    // 处理弹窗
    handleModal(type, val) {
      switch (type) {
      case "attributeVarchar33":
        this.checkAttCountTableDs_.setData(JSON.parse(val || "[]"));
        this.gansoModalProps = {
          title: this.$T("sslm.supplierDetail.model.supplierDetail.checkAttCount").$D("稽核案件"),
          visible: true,
          dataSet: this.checkAttCountTableDs_,
          onClose: () => {
            this.checkAttCountTableDs_.reset();
          },
        };
        break;
      case "attributeVarchar35":
        this.evaluationAttCountTableDs_.setData(JSON.parse(val || "[]"));
        this.gansoModalProps = {
          title: this.$T("sslm.supplierDetail.model.supplierDetail.evaluationLevel").$D("考评单"),
          visible: true,
          dataSet: this.evaluationAttCountTableDs_,
          onClose: () => {
            this.evaluationAttCountTableDs_.reset();
          },
        };
        break;
      case "attributeVarchar32":
        this.abnormalAttCountTableDs_.setData(JSON.parse(val || "[]"));
        this.gansoModalProps = {
          title: this.$T("sslm.supplierDetail.model.supplierDetail.abnormalAttCount").$D("品质异常单"),
          visible: true,
          dataSet: this.abnormalAttCountTableDs_,
          onClose: () => {
            this.abnormalAttCountTableDs_.reset();
          },
        };
        break;
      case "attributeVarchar38":
        this.downloadlFileHandler(JSON.parse(val || "[]"));
        break;
      case "attributeVarchar37":
        this.downloadlFileHandler(JSON.parse(val || "[]"));
        break;
      default:
        break;
      }
    },
    getOtherInfoColumnsMerge() {
      if (this.renderCompanyTagElement()) {
        return [
          ...this.getOtherInfoColumns,
          // 附件信息
          {
            fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.riskReport").$D("风险报告"),
            fieldCode: "attributeVarchar37",
            render: (val) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.handleModal("attributeVarchar37", val)}>{this.$T("sslm.supplierDetail.model.supplierDetail.riskReport").$D("风险报告")}</a>,
          },
          {
            fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.relationshipCheck").$D("关系排查"),
            fieldCode: "attributeVarchar38",
            render: (val) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.handleModal("attributeVarchar38", val)}>{this.$T("sslm.supplierDetail.model.supplierDetail.relationshipCheck").$D("关系排查")}</a>,
          },
          // 弹框
          {
            fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.checkAttCount").$D("稽核案件"),
            fieldCode: "attributeVarchar33",
            render: (val) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.handleModal("attributeVarchar33", val)}>{this.$T("sslm.supplierDetail.model.supplierDetail.checkAttCount").$D("稽核案件")}</a>,
          },
          {
            fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.evaluationLevel").$D("考评单"),
            fieldCode: "attributeVarchar35",
            render: (val) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.handleModal("attributeVarchar35", val)}>{this.$T("sslm.supplierDetail.model.supplierDetail.evaluationLevel").$D("考评单")}</a>,
          },
          {
            fieldName: this.$T("sslm.supplierDetail.model.supplierDetail.abnormalAttCount").$D("品质异常单"),
            fieldCode: "attributeVarchar32",
            render: (val) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.handleModal("attributeVarchar32", val)}>{this.$T("sslm.supplierDetail.model.supplierDetail.abnormalAttCount").$D("品质异常单")}</a>,
          },
        ];
      }
      return this.getOtherInfoColumns;
    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}

.srm-span-bigBlock {
  border-radius: 2px;
  background:var(--color-bg-default-d,rgba(65,70,96,0.1)) ;
  padding: 1px 4px;
  font-weight: normal;
  font-size: 10px !important;
  line-height: 18px !important;
  font-family: PingFangSC-Medium;
  color:var(--color-font-default-c);
  position: relative;
  display: inline-block;
  bottom: 1px;
  margin-left: 5px;
}

.srm-span-block-red {
  color: var(--color-other-default) !important;
  background:var(--color-bg-default)0F0 !important;
}

.srm-span-block-blue {
  color: var(--color-other-default-b) !important;
}

.srm-span-font-blue {
  color: var(--color-other-default-b) !important;
}

.srm-span-font-red {
  color: var(--color-other-default) !important;
}

.srm-column-div-box {
  display: flex;
  flex-direction: row;
  padding-bottom: 11px;
  margin: 14px 0 0px 0px;
  border-bottom:1px solid var(--color-border-default);
  padding-right: 20px;
  align-items: center;

  .srm-span-image-headImg {
    height: 20px;

    img {
      width: 20px;
      height: 20px;
    }

    margin-right: 8px;
  }
}

.srm-div-headInfo {
  padding: 4px 20px 6px 20px;
  border-bottom:8px solid var(--color-border-default);
  display: flex;
  li {
    &:nth-child(1){
      margin-right:12px;
      img{
        width:40px;
        height:40px;
      }
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color:var(--color-font-default-c);
      line-height: 20px;
      display:block
    }
    .companyName{
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color:var(--color-font-default);
      line-height: 22px;
      font-weight:700;
      margin-bottom:4px;
    }
  }
  .money {
    font-size: 16px;
    color: var(--color-other-default);
  }
}

.srm-lifeCycle {
  margin: 16px 20px 0 20px;

  >>> .hips-timeline-item__tail {
    top: 4px;
  }

  >>> .hips-timeline-item__head {
    background: var(--color-other-default-b);
    width: 8px;
    height: 8px;
    top: 4px;
  }

  .lifeCycle-item-title {
    font-size: 16px;
    color: var(--color-other-default-b);
    fongt-weight: 700;
  }

  .lifeCycle-content {
    margin-top: 4px;
    padding: 8px 12px;
    background:var(--color-bg-default-b);
    border-radius: 4px;

    & div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 10px;
        color: var(--color-font-default-e);
        line-height: 18px;
      }

      & span:nth-child(1) {
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;
        fongt-weight: 700;
      }
    }

    & div:nth-child(2) {
      font-family: PingFangSC-Regular;
      color:var(--color-font-default-b);
      line-height: 20.1px;
    }

    & div:nth-child(3) {
      margin-top: 8px;
      color: var(--color-other-default-b);
      line-height: 20.1px;
    }
  }
}

</style>
