<template>
  <div ref="processChanged" class="process-changed">
    <srm-flex v-if="dbdList.length > 1"
              justify="between"
              align="start"
              :style="{height: showAll ? '' : '47px','overflow': 'hidden','padding':'3px 13px 3px 15px','border-bottom': '#f6f6f6 solid 1px'}">
      <srm-flex-item>
        <template v-for="(item, index) in dbdList">
          <srm-button :key="index"
                      style="margin: 5px 0px;min-width: 44px;max-width: 100px;"
                      :class="chooseWord === item.key?'circle':'plain'"
                      :type="chooseWord === item.key ? 'primary' : 'info'"
                      @click="chooseBtn(item.key, item.adjustRecordId)">
            {{ item.name }}
          </srm-button>
        </template>
      </srm-flex-item>
      <srm-flex-item style="margin-top: 10px">
        <em v-if="!showAll" class="srm-icon icon-caret-right" @click="showAll = true"/>
        <em v-if="showAll" class="srm-icon icon-caret-down" style="color:#276ef1" @click="showAll = false"/>
      </srm-flex-item>
    </srm-flex>
    <srm-scroll-tab class="main-tab"
                    customize-code="SMBL.WORKFLOW.RFXADJUST.TABS" @changeTab="changeTab">
      <div class="changed-view">
        <button-switch v-model="isBeforeChangedFlag" :btn-arr="getTitles" class="changed-button" @change="buttonswitchChange($event, 'line')" />
      </div>
      <srm-scroll-tab-item v-if="isBaseInfoChanged"
                           :class="{'last-tab-pan': currentKey === 'RFX_BASIC_INFO'}"
                           :label="$T('ssrc.inquiryHall.view.inquiryHall.rfxBasicInfo').$D('询价基础信息')" code="basicInfo">
        <customize style="padding: 8px 15px 10px;" :need-padding="true" :columns="getBaseInfoColumns" :data-source="displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO" code="SMBL.WORKFLOW.RFXADJUST.BASE_INFO"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="isItemChanged"
                           :class="{'last-tab-pan': currentKey === 'PURCHASE'}"
                           :label="$T('ssrc.inquiryHall.view.inquiryHall.item').$D('询价标的物')" code="item">
        <div v-for="(item, index) in displayRfxAdjustInfo.itemAdjustDTo" :key="index" class="card" style="padding: 8px 15px 8px 15px;">
          <srm-list-header :show-open-tag="true">
            <span style="font-size: 14px;">{{ item.rfxLineItemNum }}：{{ item.itemCode + '-' + item.itemName }}</span>
          </srm-list-header>
          <customize :need-padding="false" :columns="getSubjectMatterColumns" :data-source="item" code="SMBL.WORKFLOW.RFXADJUST.SUBJECT_MATTER"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="isPurchaseChanged"
                           :class="{'last-tab-pan': currentKey === 'PURCHASE'}"
                           :label="$T('ssrc.inquiryHall.view.inquiryHall.purOrganizationAndStaff').$D('采购组织及人员')" code="purOrganizationAndStaff">
        <customize :need-padding="true" :columns="getBuyerColumns" :data-source="displayRfxAdjustInfo" code="SMBL.WORKFLOW.RFXADJUST.PURCHASE"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="isSupplierRequireChanged"
                           :class="{'last-tab-pan': currentKey === 'SUPPLIER_REQUIRE'}"
                           :label="$T('ssrc.inquiryHall.view.inquiryHall.supplierWithRequest').$D('对供应商要求')" code="supplierWithRequest">
        <div v-for="(item, index) in displaySuppliersAdjustList" :key="index" class="card" style="padding: 8px 15px 8px 15px;">
          <srm-list-header :show-open-tag="true">
            <span style="font-size: 14px;">{{ item.supplierCompanyNum + '-' + item.supplierCompanyName }}</span>
          </srm-list-header>
          <customize :need-padding="false" :columns="getSupplierCardColumns" :data-source="item" code="SMBL.WORKFLOW.RFXADJUST.SUPPLIER_REQUIRE"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="isRfxPrequalChanged || isRfxQuotationChanged || isRfxExpertScore"
        :class="{'last-tab-pan': currentKey === 'RFX_REQUIRE'}"
        :label="$T('ssrc.inquiryHall.view.inquiryHall.rfxDeamnd').$D('询价要求')" code="rfxDemand">
        <div style="width: 100%; padding: 8px 15px 0px 15px;">
          <srm-list-header
            v-if="isRfxPrequalChanged"
            :show-open-tag="true">
            <span style="font-size: 14px;">{{ $T('ssrc.inquiryHall.model.inquiryHall.prequalification').$D('资格预审') }}</span>
          </srm-list-header>
        </div>
        <customize
          v-if="isRfxPrequalChanged"
          :need-padding="true"
          :columns="getQualificationColumns"
          :data-source="displayRfxAdjustInfo.rfxRequirePrequalHeaderAdjustDTO"
          code="SMBL.WORKFLOW.RFXADJUST.PREQUAL"/>
        <div style="width: 100%; padding: 8px 15px 0px 15px;">
          <srm-list-header v-if="isRfxQuotationChanged" :show-open-tag="true">
            <span style="font-size: 14px;">{{ $T('ssrc.inquiryHall.view.message.tab.quotation').$D('报价') }}</span>
          </srm-list-header>
        </div>
        <customize v-if="isRfxQuotationChanged && displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO && !displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO.rfxRoundHeaderDateAdjustDTOList" :need-padding="true" :columns="getPriceTimeColumns" :data-source="displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO" code="SMBL.WORKFLOW.RFXADJUST.QUOTATION"/>
        <template v-if="isRfxQuotationChanged && displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO && displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO.rfxRoundHeaderDateAdjustDTOList && displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO.rfxRoundHeaderDateAdjustDTOList.length">
          <customize v-for="(item, index) in displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO.rfxRoundHeaderDateAdjustDTOList"
                     :key="index"
                     :need-padding="true"
                     :columns="getPriceTimeRoundColumns(item.quotationRound)"
                     :data-source="item"/>
        </template>
        <customize v-if="isRfxQuotationChanged && displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO && displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO.rfxRoundHeaderDateAdjustDTOList && displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO.rfxRoundHeaderDateAdjustDTOList.length" :need-padding="true" :columns="getManyPriceTimeColumns" :data-source="displayRfxAdjustInfo.rfxRequireQuotationAdjustDTO" code="SMBL.WORKFLOW.RFXADJUST.MANY_QUOTATION"/>
        <div style="width: 100%; padding: 0px 15px 0px 15px;">
          <srm-list-header v-if="isRfxExpertScore" :show-open-tag="true">
            <span style="font-size: 14px;">{{ $T('ssrc.inquiryHall.view.message.experts').$D('专家') }}</span>
          </srm-list-header>
        </div>
        <div v-for="(item, index) in (isRfxExpertScore ? (displayExpertList || []) : [])" :key="index" class="card" style="padding: 8px 15px 8px 15px;">
          <srm-list-header :show-open-tag="false">
            <span style="font-size: 14px;">{{ item.loginName + "-" + item.expertName }}</span>
          </srm-list-header>
          <customize :need-padding="false" :columns="getExpertColumns" :data-source="item" code="SMBL.WORKFLOW.RFXADJUST.EXPERT"/>
        </div>
        <div v-if="isRfxExpertScore && displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO && displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.initialReview === 'NEED'" style="width: 100%; padding: 0px 15px 0px 15px;" >
          <srm-list-header :show-open-tag="true">
            <span style="font-size: 14px;">{{ $T('ssrc.inquiryHall.view.message.tab.complianceCheck').$D('符合性检查') }}</span>
          </srm-list-header>
        </div>
        <div v-for="(item, index) in ((isRfxExpertScore && displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO && displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.initialReview === 'NEED') ? (displayEvaluateAdjustInfo.initialReviewIndicList || []) : [])" :key="index + 500">
          <div v-if="item.indicateCode || item.indicateName" style="padding: 8px 15px 8px 15px;" class="card">
            <srm-list-header :show-open-tag="false">
              <span style="font-size: 14px;">{{ ( item.indicateCode ? ( item.indicateCode + "-" ) : '' ) + item.indicateName }}</span>
            </srm-list-header>
            <customize :need-padding="false" :columns="getInitialReview" :data-source="item" code="SMBL.WORKFLOW.RFXADJUST.INITIALREVIEW"/>
          </div>
        </div>
        <div v-if="isRfxExpertScore && (displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO && displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.bidRuleType === 'DIFF')" style="width: 100%; padding: 8px 15px 0px 15px;">
          <srm-list-header :show-open-tag="true">
            <span style="font-size: 14px;">{{ $T('ssrc.inquiryHall.model.inquiryHall.businessScoringElements').$D('商务组评分要素') }}</span>
          </srm-list-header>
        </div>
        <div v-for="(item, index) in (isRfxExpertScore ? (displayEvaluateAdjustInfo.businessIndicList || []) : [])" :key="index + 1000">
          <div v-if="item.indicateCode || item.indicateName" class="card" style="padding: 8px 15px 8px 15px;">
            <srm-list-header :show-open-tag="false">
              <span style="font-size: 14px;">{{ item.indicateCode + "-" + item.indicateName }}</span>
            </srm-list-header>
            <customize :need-padding="false" :columns="getScorePercenColumns" :data-source="item" code="SMBL.WORKFLOW.RFXADJUST.SCORE_ELEMENT"/>
          </div>
        </div>
        <div v-if="isRfxExpertScore && (displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO && displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.bidRuleType === 'DIFF')" style="width: 100%; padding: 8px 15px 0px 15px;">
          <srm-list-header :show-open-tag="true">
            <span style="font-size: 14px;">{{ $T('ssrc.inquiryHall.model.inquiryHall.technologyScoringElements').$D('技术组评分要素') }}</span>
          </srm-list-header>
        </div>
        <div v-for="(item, index) in (isRfxExpertScore ? (displayEvaluateAdjustInfo.technologyIndicList || []) : [])" :key="index + 2000">
          <div v-if="item.indicateCode || item.indicateName" class="card" style="padding: 8px 15px 8px 15px;">
            <srm-list-header :show-open-tag="false">
              <span style="font-size: 14px;">{{ item.indicateCode + "-" + item.indicateName }}</span>
            </srm-list-header>
            <customize :need-padding="false" :columns="getScorePercenColumns" :data-source="item" code="SMBL.WORKFLOW.RFXADJUST.SCORE_ELEMENT"/>
          </div>
        </div>
        <div v-if="isRfxExpertScore && (displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO && displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.bidRuleType === 'NONE')" style="width: 100%; padding: 8px 15px 0px 15px;">
          <srm-list-header :show-open-tag="true">
            <span style="font-size: 14px;">{{ $T('ssrc.inquiryHall.view.message.tab.scoringElements').$D('评分要素') }}</span>
          </srm-list-header>
        </div>
        <div v-for="(item, index) in (isRfxExpertScore ? (displayEvaluateAdjustInfo.otherIndicList || []) : [])" :key="index + 4000">
          <div v-if="item.indicateId" class="card" style="padding: 8px 15px 8px 15px;">
            <srm-list-header :show-open-tag="false">
              <span style="font-size: 14px;">{{ item.indicateCode + "-" + item.indicateName }}</span>
            </srm-list-header>
            <customize :need-padding="false" :columns="getScorePercenColumns" :data-source="item" code="SMBL.WORKFLOW.RFXADJUST.SCORE_ELEMENT"/>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :visible.sync="isAllotMaterialShowFlag" :title="$T('ssrc.inquiryHall.view.message.button.allotItem').$D('分配物料')" height="80%" rounded>
      <div v-loading="displayAllotItemsLogingFlag" style="width: 100%;height: 100%;">
        <div v-for="(item, index) in displayAllotItems" :key="index" class="card" style="padding: 8px 15px 8px 15px;">
          <srm-list-header :show-open-tag="false">
            <span style="font-size: 14px;">{{ item.itemCode + '-' + item.itemName }}</span>
          </srm-list-header>
          <customize :need-padding="false" :columns="getMaterialColumns" :data-source="item" type="list" code="SMBL.WORKFLOW.RFXADJUST.SUPPLIER_MATERIAL"/>
        </div>
      </div>
    </srm-popup>
    <srm-popup :visible.sync="isScoreEleDetailShowFlag" :title="$T('ssrc.inquiryHall.model.inquiryHall.elements.detail').$D('评分要素细项')" height="80%" rounded>
      <div v-loading="loadingEvaluateDetailFlag" style="width: 100%;height: 100%;">
        <div v-for="(item, index) in evaluateDetailContent" :key="index" class="card" style="padding: 8px 15px 8px 15px;">
          <srm-list-header :show-open-tag="false">
            <span style="font-size: 14px;">{{ (item.indicateCode ? (item.indicateCode + "-") : "") + item.indicateName }}</span>
          </srm-list-header>
          <customize :need-padding="false" :columns="getScoreEleColumns" :data-source="item" type="list" code="SMBL.WORKFLOW.RFXADJUST.SCORE_ELEMENT_DETAIL"/>
        </div>
      </div>
    </srm-popup>
    <srm-popup :visible.sync="isAllotExpertShowFlag" :title="$T('ssrc.inquiryHall.model.inquiryHall.assignExpert').$D('分配专家')" height="80%" rounded>
      <div v-loading="allotExpertLoadingFlag" style="width: 100%; height: 100%;">
        <div v-for="(item, index) in evaluateAllotContent || []" :key="index" class="expert-card">
          <srm-tag size="small" type="primary">{{ item.assignFlag ? $T("hipspfm.expertScoring.view.message.assigned").$D("已分配") : $T("hipspfm.expertScoring.view.message.unAssigned").$D("未分配") }}</srm-tag>
          <span class="name">{{ item.loginName + "-" + item.expertName }}</span>
        </div>
      </div>
    </srm-popup>
    <srm-popup :visible.sync="isScoreDetailShowFlag" :title="$T('ssrc.inquiryHall.model.inquiryHall.scoreRemark').$D('评分细则')" height="40%" rounded>
      <div class="score-detail">
        {{ showingIndicateRemark }}
      </div>
    </srm-popup>
  </div>
</template>

<script>

import ButtonSwitch from "@/components/V5/ButtonSwitch";
import {
  getDBDApi,
  getAfterRfxAdjustInfo,
  getBeforRfxAdjustInfo,
  getAfterSuppliersAdjustInfo,
  getBeforeSuppliersAdjustInfo,
  getAllotItemsInfoForSupplier,
  getAfterEvaluateInfo,
  getAfterEvaluateDetailApi,
  getAfterEvaluateAssignsApi,
  getAfterExpertListApi,
  getAfterItemInfo,
  getBeforeItemInfo,
  getBeforeEvaluateInfo,
  getBeforeEvaluateDetailApi,
  getBeforeEvaluateAssignsApi,
  getBeforeExpertListApi,
} from "./api/ProcessChangedApi";
import {
  getRequestStatus,
} from "./../NewPriceApprovalForm/api/NewPriceApproval";
export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.expertScoring", "ssrc.common", "hipspfm.common" ],
  name: "ProcessChangedApproval",
  components: {
    ButtonSwitch,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
  },
  data() {
    return {
      isBeforeChangedFlag: false,
      displayRfxAdjustInfo: {},
      afterRfxAdjustInfo: {},
      beforeRfxAdjustInfo: null,
      beforeItemAdjustList: [],
      afterItemAdjustList: [],
      displaySuppliersAdjustList: [],
      afterSuppliersAdjustInfo: {},
      beforeSuppliersAdjustInfo: null,
      displayAllotItems: [],
      displayAllotItemsLogingFlag: false,
      // 评分要素
      rfxHeaderAdjustId: null,
      rfxHeaderId: null,
      displayEvaluateAdjustInfo: {},
      afterEvaluateAdjustInfo: null,
      beforeEvaluateAdjustInfo: null,
      isScoreEleDetailShowFlag: false,
      loadingEvaluateDetailFlag: false,
      evaluateDetailContent: [],
      // 分配专家
      isAllotExpertShowFlag: false,
      allotExpertLoadingFlag: false,
      evaluateAllotContent: [],
      // 展示的评分细则
      showingIndicateRemark: null,
      // 专家列表
      displayExpertList: [],
      afterExpertList: [],
      beforeExpertList: [],
      subjectMatter: [ ],
      isAllotMaterialShowFlag: false,
      isScoreDetailShowFlag: false,
      multipleLanguage: {
        beforeChange: this.$T("ssrc.inquiryHall.view.button.beforeChange").$D("变更前"),
        afterChange: this.$T("ssrc.inquiryHall.view.button.afterChange").$D("变更后"),
        allot: this.$T("ssrc.inquiryHall.view.message.allot").$D("是"),
        notAllot: this.$T("ssrc.inquiryHall.view.message.notAllot").$D("否"),
      },
      currentTabIndex: 0,
      allTabKey: [ "ALL" ], // ALL、RFX_BASIC_INFO、PURCHASE、SUPPLIER_REQUIRE、RFX_REQUIRE
      currentKey: "ALL",
      chooseWord: "",
      //  { name: "1" },{ name: "2" }
      dbdList: [],
      changeReqId2: "",
      showAll: false,
      reviewMethodList: [], // 审查方式状态
    };
  },
  computed: {
    isBaseInfoChanged() {
      // 返回：基础信息是不是更改
      return true;
      // return this.displayRfxAdjustInfo && this.displayRfxAdjustInfo.adjustTypeList && this.displayRfxAdjustInfo.adjustTypeList.indexOf("RFX_BASIC_INFO") !== -1;
    },
    isPurchaseChanged() {
      // 返回：采购组织/人员是不是更改
      return this.displayRfxAdjustInfo && this.displayRfxAdjustInfo.adjustTypeList && this.displayRfxAdjustInfo.adjustTypeList.indexOf("PURCHASE") !== -1;
    },
    isItemChanged() {
      // 返回：询价标的物是否变更
      return this.displayRfxAdjustInfo && this.displayRfxAdjustInfo.adjustTypeList && this.displayRfxAdjustInfo.adjustTypeList.indexOf("RFX_ITEM") !== -1;
    },
    isSupplierRequireChanged() {
      // 返回：对供应商要求是否变更
      return this.displayRfxAdjustInfo && this.displayRfxAdjustInfo.adjustTypeList && this.displayRfxAdjustInfo.adjustTypeList.indexOf("SUPPLIER_REQUIRE") !== -1;
    },
    isRfxPrequalChanged() {
      // 返回：询价要求-资格预审是否变更
      return this.displayRfxAdjustInfo && this.displayRfxAdjustInfo.adjustTypeList && this.displayRfxAdjustInfo.adjustTypeList.indexOf("RFX_PREQUAL") !== -1;
    },
    isRfxQuotationChanged() {
      // 返回：询价要求-报价是否变更
      return this.displayRfxAdjustInfo && this.displayRfxAdjustInfo.adjustTypeList && this.displayRfxAdjustInfo.adjustTypeList.indexOf("RFX_QUOTATION") !== -1;
    },
    isRfxExpertScore() {
      // 返回：询价要求-专家/评分要素
      return this.displayRfxAdjustInfo && this.displayRfxAdjustInfo.adjustTypeList && this.displayRfxAdjustInfo.adjustTypeList.indexOf("RFX_EXPERT_SCORE") !== -1;
    },
    getTitles() {
      return [ this.multipleLanguage.beforeChange, this.multipleLanguage.afterChange ];
    },
    // 基本信息
    getBaseInfoColumns() {
      return [ {
        fieldName: this.$T("ssrc.inquiryHall.mode.rfxTitle").$D("询价单标题"),
        fieldCode: "rfxTitle",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
        fieldCode: "budgetAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
        fieldCode: "templateName",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.view.message.changeDocument").$D("变更说明"),
        fieldCode: "adjustRemark",
        formRow: 40,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attchment").$D("附件"),
        fieldCode: "adjustAttachmentUuid",
        formRow: 45,
        render: (val) => <SrmUpload type="primary" style="font-weight: bold;" attachmentUuid={val} showCount={false} showIcon={false} descTitle={this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}/>,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
        fieldCode: "businessAttachmentUuid",
        formRow: 50,
        render: (val) => <SrmUpload type="primary" style="font-weight: bold;" key={val} attachmentUuid={val} showCount={false} showIcon={false} descTitle={this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}/>,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
        fieldCode: "techAttachmentUuid",
        formRow: 50,
        render: (val) => <SrmUpload type="primary" style="font-weight: bold;" key={val} attachmentUuid={val} showCount={false} showIcon={false} descTitle={this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}/>,
      } ];
    },
    // 采购组织及人员
    getBuyerColumns() {
      return [ {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxByName").$D("询价员"),
        fieldCode: "",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkedByName").$D("核价员"),
        fieldCode: "",
        formRow: 10,
      }, ];
    },
    // 标的物
    getSubjectMatterColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ouName").$D("业务实体"),
          fieldCode: "ouName",
          formRow: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.inventoryOrg").$D("库存组织"),
          fieldCode: "invOrganizationName",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.floatTypeMeaning").$D("浮动方式"),
          fieldCode: "floatTypeMeaning",
          formRow: 30,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationRange").$D("报价幅度"),
          fieldCode: "quotationRange",
          formRow: 30,
        }
      ];
    },
    // 供应商
    getSupplierCardColumns() {
      return [ {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceCoefficient").$D("价格系数"),
        fieldCode: "priceCoefficient",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.contactName").$D("联系人"),
        fieldCode: "contactName",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.contactMobilePhone").$D("联系方式"),
        fieldCode: "contactMobilephone",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxEmail").$D("电子邮箱"),
        fieldCode: "contactMail",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.view.message.button.allotItem").$D("分配物料"),
        fieldCode: "rfxLineSupplierAdjustId",
        formRow: 30,
        render: (val, item) => <SrmFlex>
          <div class="detail-button" onclick={
            (e) => {
              e.stopPropagation();
              this.checkMaterialDetailAction(val, item);
            }
          }>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</div>
        </SrmFlex>,
      }, ];
    },
    // 预审
    getQualificationColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalEndDate").$D("预审截止时间"),
          fieldCode: "prequalEndDate",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reviewMethod").$D("审查方式"),
          fieldCode: "reviewMethod",
          fieldType: "TEXT",
          lovCode: "SSRC.REVIEW_METHOD",
          render: (val) => this.transReqStatus(val),
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrialGroupMain").$D("预审小组组长"),
          fieldCode: "preGroupLeaderLov",
          formRow: 20,
          render: (val) => val?.realName,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrialGroupMember").$D("预审小组成员"),
          fieldCode: "preGroupMemberLov",
          formRow: 20,
          render: (val) => (val || []).map((item, index) => `${item?.realName}${index + 1 === val.length ? "" : ","}`),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalAttachment").$D("资格预审文件"),
          fieldCode: "prequalAttachmentUuid",
          fieldType: "UPLOAD",
          formRow: 20,
        },
      ].filter(Boolean);
    },
    // 报价
    getPriceTimeColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationEndTime").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
        }
      ];
    },
    getManyPriceTimeColumns() {
      return [];
    },
    getPriceTimeRoundColumns() {
      return (quotationRound) => [
        {
          fieldName: `第${quotationRound}轮报价开始时间`,
          fieldCode: "roundQuotationStartDate",
          langCode: `ssrc.inquiryHall.model.inquiryHall.roundQuotationStartDate${quotationRound}`,
        }, {
          fieldName: `第${quotationRound}轮报价截止时间`,
          fieldCode: "roundQuotationEndDate",
          langCode: `ssrc.inquiryHall.model.inquiryHall.roundQuotationEndDate${quotationRound}`,
        }
      ];
    },
    // 专家
    getExpertColumns() {
      return [ {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.duty").$D("职责"),
        fieldCode: "evaluateLeaderFlagMeaning",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.teamMeaning").$D("本次评分类别"),
        fieldCode: "teamMeaning",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.expertType").$D("专家类型"),
        fieldCode: "expertCategoryMeaning",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxPhone").$D("联系电话"),
        fieldCode: "phone",
        render:(val, record) => val ? record.internationalTelCodeMeaning + " | " + val : "",
        formRow: 20,
      }, ];
    },
    // 符合性检查
    getInitialReview() {
      return [
        {
          fieldCode: "passFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.passFlag").$D("必须通过"),
          render: (val) => <span>{val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "assignedExperts",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allocatedExpert").$D("分配专家"),
          render: (_, item) => item.assignedEvaluateExperts,
          formRow: 50,
        }
      ];
    },
    // 评分要素
    getScorePercenColumns() {
      return [ {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重"),
        fieldCode: "weight",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.minScore").$D("最低分"),
        fieldCode: "minScore",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.maxScore").$D("最高分"),
        fieldCode: "maxScore",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.elements.detail").$D("评分要素细项"),
        fieldCode: "detailEnabledFlag",
        formRow: 20,
        render: (val, item) => {
          if (Number(val) === 0) {
            return <div>{this.$T("ssrc.inquiryHall.model.inquiryHall.noEnabled").$D("未启用")}</div>;
          }
          return <SrmFlex>
            <div class="detail-button" onclick={
              (e) => {
                e.stopPropagation();
                this.checkEvaluateDetail(item.evaluateIndicAdjustId, item.evaluateIndicId);
              }
            }>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</div>
          </SrmFlex>;
        },
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.assignExpert").$D("分配专家"),
        fieldCode: "assignExpert",
        formRow: 30,
        render: (_, item) => item.assignedEvaluateExperts,
        // render: (val, item) => <SrmFlex>
        //   <div class="detail-button" onclick={
        //     (e) => {
        //       e.stopPropagation();
        //       this.checkEvaluateAssigns(item.evaluateIndicAdjustId, item.sourceHeaderId, item.evaluateIndicId, item.adjustRecordId);
        //     }
        //   }>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</div>
        // </SrmFlex>,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.scoreRemark").$D("评分细则"),
        fieldCode: "indicateRemark",
        formRow: 30,
        render: (val) => <SrmFlex>
          <div class="detail-button" onclick={
            (e) => {
              e.stopPropagation();
              this.isScoreDetailShowFlag = true;
              this.showingIndicateRemark = val;
            }
          }>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</div>
        </SrmFlex>,
      }, ];
    },
    // 分配物料
    getMaterialColumns() {
      return [ {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.minLimitPrice").$D("最低限价"),
        fieldCode: "minLimitPrice",
        fieldType: "INPUT_NUMBER",
        editor: false,
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.maxLimitPrice").$D("最高限价"),
        fieldCode: "maxLimitPrice",
        fieldType: "INPUT_NUMBER",
        editor: false,
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.whetherAllot").$D("是否分配"),
        fieldCode: "inviteFlag",
        formRow: 20,
        render: (val) => Number(val) === 1 ? this.multipleLanguage.allot : this.multipleLanguage.notAllot,
      }, ];
    },
    // 评分要素细项
    getScoreEleColumns() {
      return [ {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.indicateRemark").$D("评分细则"),
        fieldCode: "indicateRemark",
        formRow: 10,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.minScore").$D("最低分"),
        fieldCode: "minScore",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.maxScore").$D("最高分"),
        fieldCode: "maxScore",
        formRow: 20,
      }, {
        fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.defaultScore").$D("缺省分"),
        fieldCode: "defaultScore",
        formRow: 30,
      }, ];
    },
  },
  mounted() {
    this.getDBD();
    this.$emit(
      "GetApprovalTitle",
      this.$T("ssrc.inquiryHall.view.title.approvalRfxAdjust").$D(
        "询价单调整审批"
      )
    );
    this.getReqStatusList();
  },
  methods: {
    chooseBtn(word, id) {
      this.chooseWord = word;
      this.changeReqId2 = id;
      this.getProcessChangedDetail();
    },
    filterSuppliers(list) {
      let newList = list.filter((item) => item.supplierCompanyId);
      return newList;
    },
    filterExperts(list) {
      let newList = list.filter((item) => item.expertId);
      return newList;
    },
    // 获取多标段
    getDBD() {
      getDBDApi(this.changeReqId).then((res) => {
        res.projectLineSectionList && res.projectLineSectionList.length > 0 && res.projectLineSectionList.map((item, index) => {
          this.dbdList.push({
            adjustRecordId: item.adjustRecordId,
            sourceHeaderId: item.sourceHeaderId,
            sourceFrom: item.sourceFrom,
            name: item.sectionName,
            key: index,
          });
        });
        if (this.dbdList && this.dbdList.length > 0) {
          this.chooseWord = this.dbdList[0].key;
          this.changeReqId2 = this.dbdList[0].adjustRecordId;
        } else {
          this.changeReqId2 = this.changeReqId;
        }
        this.getProcessChangedDetail();
      });
    },
    async getProcessChangedDetail() {
      if (this.isBeforeChangedFlag) {
        this.buttonswitchChange();
        return;
      }
      this.$loading.show();
      this.afterRfxAdjustInfo = await getAfterRfxAdjustInfo(this.changeReqId2);
      this.afterItemAdjustList = await getAfterItemInfo(this.changeReqId2);
      this.afterSuppliersAdjustInfo = await getAfterSuppliersAdjustInfo(this.changeReqId2) || {};
      this.displayRfxAdjustInfo = this.afterRfxAdjustInfo || {};
      this.mapAttachmentInfo();
      this.displayRfxAdjustInfo["itemAdjustDTo"] = this.afterItemAdjustList?.content || [];
      this.displaySuppliersAdjustList = this.filterSuppliers(this.afterSuppliersAdjustInfo?.content || []);
      // 评分要素
      this.rfxHeaderAdjustId = this.afterRfxAdjustInfo?.rfxHeaderBaseInfoAdjustDTO?.rfxHeaderAdjustId;
      this.rfxHeaderId = this.afterRfxAdjustInfo?.rfxHeaderBaseInfoAdjustDTO?.rfxHeaderId;
      this.afterEvaluateAdjustInfo = await getAfterEvaluateInfo(this.changeReqId2, this.rfxHeaderAdjustId, this.rfxHeaderId);
      this.displayEvaluateAdjustInfo = this.afterEvaluateAdjustInfo || {};
      // 专家
      this.afterExpertList = await getAfterExpertListApi(this.changeReqId2, this.rfxHeaderAdjustId, this.rfxHeaderId);
      this.displayExpertList = this.filterExperts(this.afterExpertList);
      // 全部key，计算srmtab的高度 RFX_BASIC_INFO、PURCHASE、SUPPLIER_REQUIRE、RFX_REQUIRE
      let allKeyAry = [ "ALL" ];
      if (this.isBaseInfoChanged) {
        allKeyAry.push("RFX_BASIC_INFO");
      }
      if (this.isItemChanged) {
        allKeyAry.push("RFX_ITEM");
      }
      if (this.isPurchaseChanged) {
        allKeyAry.push("PURCHASE");
      }
      if (this.isSupplierRequireChanged) {
        allKeyAry.push("SUPPLIER_REQUIRE");
      }
      if (this.isRfxPrequalChanged || this.isRfxExpertScore || this.isRfxQuotationChanged) {
        allKeyAry.push("RFX_REQUIRE");
      }
      this.allTabKey = allKeyAry;
      this.currentKey = this.getCurrentKey();
      this.$loading.hide();
      this.$forceUpdate();
    },
    stringForIndex(index) {
      if (index < 10) {
        return "0" + index;
      }
      return index.toString();
    },
    async buttonswitchChange() {
      this.displayRfxAdjustInfo = {};
      this.displaySuppliersAdjustList = [];
      if (this.isBeforeChangedFlag) {
        this.$loading.show();
        try {
          this.beforeRfxAdjustInfo = await getBeforRfxAdjustInfo(this.changeReqId2);
          this.beforeItemAdjustList = await getBeforeItemInfo(this.changeReqId2);
          this.beforeSuppliersAdjustInfo = await getBeforeSuppliersAdjustInfo(this.changeReqId2);
          this.rfxHeaderAdjustId = this.beforeRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.rfxHeaderAdjustId;
          this.rfxHeaderId = this.beforeRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.rfxHeaderId;
          this.beforeExpertList = await getBeforeExpertListApi(this.changeReqId2, this.rfxHeaderAdjustId, this.rfxHeaderId);
          this.beforeEvaluateAdjustInfo = await getBeforeEvaluateInfo(this.changeReqId2, this.rfxHeaderAdjustId, this.rfxHeaderId);
        } finally {
          this.$loading.hide();
        }
      } else {
        this.getProcessChangedDetail();
        return;
      }
      this.displayRfxAdjustInfo = this.isBeforeChangedFlag ? this.beforeRfxAdjustInfo : this.afterRfxAdjustInfo;
      this.mapAttachmentInfo();
      this.displaySuppliersAdjustList = this.filterSuppliers(this.isBeforeChangedFlag ? this.beforeSuppliersAdjustInfo.content : this.afterSuppliersAdjustInfo.content);
      this.displayExpertList = this.filterExperts(this.isBeforeChangedFlag ? this.beforeExpertList : this.afterExpertList);
      this.displayEvaluateAdjustInfo = this.isBeforeChangedFlag ? this.beforeEvaluateAdjustInfo : this.afterEvaluateAdjustInfo;
      this.displayRfxAdjustInfo["itemAdjustDTo"] = this.beforeItemAdjustList.content || [];
    },
    checkMaterialDetailAction(rfxLineSupplierAdjustId) {
      this.displayAllotItems = [];
      this.isAllotMaterialShowFlag = true;
      this.displayAllotItemsLogingFlag = true;
      getAllotItemsInfoForSupplier(rfxLineSupplierAdjustId, this.changeReqId2).then((response) => {
        this.displayAllotItems = response.content;
      }).finally(() => {
        this.displayAllotItemsLogingFlag = false;
      });
    },
    async checkEvaluateDetail(evaluateIndicAdjustId, evaluateIndicId) {
      this.evaluateDetailContent = [];
      this.isScoreEleDetailShowFlag = true;
      this.loadingEvaluateDetailFlag = true;
      if (this.isBeforeChangedFlag) {
        let { content } = await getBeforeEvaluateDetailApi(evaluateIndicAdjustId, evaluateIndicId);
        this.evaluateDetailContent = content || [];
      } else {
        let { content } = await getAfterEvaluateDetailApi(evaluateIndicAdjustId, evaluateIndicId);
        this.evaluateDetailContent = content || [];
      }
      this.loadingEvaluateDetailFlag = false;
    },
    async checkEvaluateAssigns(evaluateIndicAdjustId, sourceHeaderId, evaluateIndicId, adjustRecordId) {
      this.evaluateAllotContent = [];
      this.isAllotExpertShowFlag = true;
      this.allotExpertLoadingFlag = true;
      if (this.isBeforeChangedFlag) {
        this.evaluateAllotContent = await getBeforeEvaluateAssignsApi(evaluateIndicAdjustId, sourceHeaderId, evaluateIndicId, adjustRecordId);
      } else {
        this.evaluateAllotContent = await getAfterEvaluateAssignsApi(evaluateIndicAdjustId, sourceHeaderId, evaluateIndicId, adjustRecordId);
      }
      this.allotExpertLoadingFlag = false;
    },
    changeTab(val) {
      this.currentTabIndex = val.activeKey;
      this.currentKey = this.getCurrentKey();
      this.$forceUpdate();
    },
    // 附件字段重新赋值
    mapAttachmentInfo() {
      const { businessAttachmentUuid, techAttachmentUuid } = this.displayRfxAdjustInfo.rfxAttachmentAdjustDTO || {};
      this.displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.businessAttachmentUuid = businessAttachmentUuid;
      this.displayRfxAdjustInfo.rfxHeaderBaseInfoAdjustDTO.techAttachmentUuid = techAttachmentUuid;
    },
    getCurrentKey() {
      let count = this.allTabKey.length;
      if (this.currentTabIndex >= this.allTabKey.length) {
        return this.allTabKey[count - 1];
      }
      if (this.currentTabIndex === 0) {
        return this.allTabKey[count - 1];
      }
      let key = this.allTabKey[this.currentTabIndex];
      return key;
    },
    transReqStatus(value) {
      let s = "";
      this.reviewMethodList.find((v) => {
        if (v.value === value) {
          s = v.meaning;
        }
      });
      return s;
    },
    //状态
    async getReqStatusList() {
      this.reviewMethodList = await getRequestStatus("SSRC.REVIEW_METHOD");
    },
  },
};
</script>

<style lang="stylus" scoped>
.process-changed {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .main-tab {
      width: 100%;
    }
    .changed-view {
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
        .changed-button {
          margin-left: 15px;
        }
    }
    >>> .SrmScrollTabItem-title {
      background-color: var(--color-border-default);
    }
    >>> .srm-line-tab {
      height: 100%;
    }

    .detail-button {
      color: var(--color-other-default-b);
      font-size: 14px;
      font-weight: bold;
    }
}
.card {
    width: 100%;
    border-bottom: 1px solid var(--color-bg-default-b);
}

>>> .srm-popup-content {
    overflow: scroll;
    .card {
      &:last-child {
        margin-bottom: constant(safe-area-inset-bottom);
        margin-bottom: env(safe-area-inset-bottom);
      }
    }
}

.expert-card {
  padding: 16px 15px;
  display: flex;
  border-bottom: 1px solid var(--color-bg-default-b);
  .name {
    color: var(--color-font-default);
    font-size: 14px;
    line-height: 20px;
    margin-left: 8px;
  }
  &:last-child {
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }
}

.score-detail {
  margin: 16px 15px;
  color: var(--color-font-default);
  font-size: 14px;
  line-height: 20px;
}

>>> .srm-button-info {
  background: #fff !important;
  font-size: 12px;
}
>>> .srm-button-primary {
  font-size: 12px;
}

</style>