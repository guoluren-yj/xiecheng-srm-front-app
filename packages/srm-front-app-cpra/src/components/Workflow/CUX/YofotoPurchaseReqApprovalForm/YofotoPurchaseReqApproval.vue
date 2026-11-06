<template>
  <div>
    <srm-scroll-tab class="main-tab">
      <srm-scroll-tab-item :label="$T('sprm.common.view.panel.basicInfo').$D('申请基础信息')">
        <div @click="showBasicInfoDetail">
          <srm-form v-if="basicInfoDataSet"
                    :data-set="basicInfoDataSet"
                    :columns="getBasicInfoColumns"
                    :customize-code="getBasicInfoColumnsCode"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 外部ERP不显示，电商来源不显示，其余显示 -->
      <srm-scroll-tab-item v-if="prSourcePlatform !== 'ERP'" :label="$T('sprm.common.view.panel.organization').$D('采购方及采买组织信息')">
        <div @click="showOrganizationDetail">
          <srm-form v-if="basicInfoDataSet" :data-set="basicInfoDataSet" :columns="getOrganizationColumns" style="min-height: 0px;" customize-code="SMBL.PURCHASE_REQUISITION_APPROVAL.ORGANIZATION"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 仅电商来源展示 -->
      <srm-scroll-tab-item v-if="prSourcePlatform === 'E-COMMERCE'" :label="$T('sprm.common.view.panel.deliveryInfo').$D('收货/收单信息')">
        <div @click="showDeliveryInfoDetail">
          <srm-form v-if="basicInfoDataSet" :data-set="basicInfoDataSet" :columns="getDeliveryInfoColumns" customize-code="SMBL.PURCHASE_REQUISITION_APPROVAL.DELIVERY_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 仅电商来源展示开票信息 -->
      <srm-scroll-tab-item v-if="prSourcePlatform === 'E-COMMERCE'" :label="$T('sprm.common.view.panel.billingInfo').$D('开票信息')">
        <div @click="showBillingInfoDetail">
          <srm-form v-if="basicInfoDataSet" :data-set="basicInfoDataSet" :columns="getBillingInfoColumns" customize-code="SMBL.PURCHASE_REQUISITION_APPROVAL.BILLING_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 申请明细信息 -->
      <srm-scroll-tab-item :label="$T('sprm.common.view.panel.detailInfo').$D('申请明细信息')" style="position: relative;">
        <srm-flex v-if="basicInfo && basicInfo.changedFlag" justify="end" class="change-buttons">
          <srm-button class="change-button" size="mid" :fill="changedButtonsFlag === 'before'" bordered type="warn" @click="beforeChangeAction">{{ $T("sprm.common.view.button.beforeChange").$D("变更前") }}</srm-button>
          <srm-button class="change-button" size="mid" :fill="changedButtonsFlag === 'after'" bordered type="danger" @click="afterChangeAction">{{ $T("sprm.common.view.button.afterChange").$D("变更后") }}</srm-button>
        </srm-flex>
        <srm-list v-if="prLineDataSet" class="scoll-list" :scrollable="false" :columns="getRuqustInfoColumns" :data-set="prLineDataSet" customize-code="SMBL.PURCHASE_REQUISITION_APPROVAL.LINE_INFO" @itemClick="lineItemClick"/>
      </srm-scroll-tab-item>
      <!-- 附件信息 -->
      <srm-scroll-tab-item :label="$T('sprm.common.view.panel.attachmentInfo').$D('附件')">
        <div v-for="(item, index) in attachmentsItems" :key="index" class="attachment-card">
          <srm-upload :attachment-uuid="item.uuid"
                      desc-title=""
                      title=""
                      :show-count="false"
                      :show-icon="false"
                      :can-upload="false"
                      :can-delete="false" />
          <srm-flex class="attachment-container">
            <span class="icon srm-icon icon-other" />
            <span class="title">{{ item.title }}</span>
            <srm-tag v-if="!item.isExternalFlag" class="attachment-type" size="mid">{{ $T("sprm.common.model.common.enterEnclosure").$D("内部附件") }}</srm-tag>
            <srm-tag v-else class="attachment-type" type="danger" size="mid">{{ $T("sprm.common.model.common.externalAttachmentUuid").$D("外部附件") }}</srm-tag>
          </srm-flex>
          <span class="right-icon srm-icon icon-chevron-right"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item :label="$T('smbl.common.message.OperationRecord').$D('操作记录')">
        <div class="record-container">
          <history-record-tiled
            :show-remark="false"
            :loading="false"
            :action-data="actionRecordList"
            operation-meaning-field-name="status"
            operator-field-name="processUserName"
            process-date-field-name="creationDate"
            process-remark-field-name="processRemark"
            :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
            process-remark-info-field-name="unknown"/>
        </div>
        <div class="bottom-button-space" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-bottom-handler v-if="approvalButtonFlag" :btn-arr="bottomButtons" />
    <srm-popup :visible.sync="approvalRemarkPopupFlag"
               :show-header="false"
               :rounded="false"
               height="auto"
               position="top">
      <srm-textarea-field v-if="basicInfo"
                          v-model="basicInfo.approvedRemark"
                          :placeholder="$T('sprm.common.title.approvedRemark').$D('审批意见')"
                          :show-resizer="false"
                          class="approval-remark-text"
                          :height="260"/>
      <srm-flex justify="start"
                align="center"
                style="border-top: 1px solid var(--color-border-default);">
        <srm-button style="flex: 1; color: var(--font-color-disable);" size="x-large" plain :circle="false" @click="approvalRemarkPopupFlag = false">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
        <srm-button v-if="approvalRemarkType === 'APPROVAL'"
                    style="flex: 1;border-radius: 0px !important;"
                    size="x-large"
                    type="success"
                    fill
                    :bordered="false"
                    :rect="true"
                    :circle="false"
                    @click="approvalAction">
          {{ $T("sprm.purchaseRequisitionApproval.view.button.approval").$D("审批通过") }}
        </srm-button>
        <srm-button v-if="approvalRemarkType === 'REJECT'"
                    style="flex: 1;border-radius: 0px !important;"
                    size="x-large"
                    type="danger"
                    fill
                    :bordered="false"
                    :rect="true"
                    :circle="false"
                    @click="rejectAction">
          {{ $T("sprm.purchaseRequisitionApproval.view.button.reject").$D("审批拒绝") }}
        </srm-button>
      </srm-flex>
    </srm-popup>
    <srm-popup :visible.sync="lineDetailFlag"
               :show-header="false"
               :rounded="false"
               height="100vh"
               position="right">
      <srm-form
        v-if="lineDetailDataSet"
        style="padding-bottom: 100px;"
        :data-set="lineDetailDataSet"
        customize-type="detail"
        :columns="getLineDetailColumns()"
        customize-code="SMBL.PURCHASE_REQUISITION_APPROVAL.LINE_INFO.DETAIL"/>
      <srm-bottom-handler v-if="basicInfo && basicInfo.changedFlag" :btn-arr="lineDetailChangeStateButtons" />
    </srm-popup>
  </div>
</template>

<script>
import {
  getPrDetailApi,
  getPermissionsApi,
  getActionsRecordApi,
  submitApprovalApi,
  submitRejectApi,
  cancelApprovalApi,
  cancelRejectApi,
  saveApi
} from "./api/index";
import { SrmUtil, DataSet } from "srm-mobile-ui";
import { isArray } from "lodash";
import { purchaseRequisitionLineDS } from "./datasource/PurchaseRequisitionLineDS";
import { prLineDetailDS } from "./datasource/PrLineDetailDS";
import { customAttributeDS } from "./datasource/CustomAttributeDS";
import { lastPurPriceDS } from "./datasource/LastPurPriceDS";
import { executionBillDS } from "./datasource/ExecutionBillDS";
import { priceCompareDS } from "./datasource/PriceCompareDS";
import { productAttributeDS } from "./datasource/ProductAttributeDS";
import { productCustomAttDS } from "./datasource/ProductCustomAttDS";
import { formDS } from "./datasource/FormDS";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
export default {
  modules: [ "sprm.common", "hipspfm.common", "sprm.purchaseRequisitionApproval", "smbl.common", "spcm.common" ],
  name: "PurchaseRequisitionApprovalDetail",
  components: {
    HistoryRecordTiled
  },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      prHeaderId: null,
      prSourcePlatform: null,
      basicInfo: null,
      attachmentsItems: [], // 附件列表
      externalAttachmentFlag: false, // 是否显示外部附件
      prLineDataSet: null, // 行信息
      basicInfoDataSet: null, // 基本信息
      customAttributeDataSet: null, // 物料定制属性
      lastPurPriceDataSet: null, // 上次采购单价
      lastPurPriceDetailDataSet: null, // 上次采购单价-详情
      executionBillDataSet: null, // 执行单据详情
      executionBillDetailDataSet: null, // 执行单据详情
      priceCompareDataSet: null, // 比价单
      priceCompareDetailDataSet: null, // 比价单-详情
      productAttributeDataSet: null, // 商品属性
      productCustomAttDataSet: null, // 定制品属性
      // 操作记录
      actionRecordList: [],
      // 审批按钮控制
      approvalButtonFlag: false,
      // 审批意见弹框
      approvalRemarkPopupFlag: false,
      approvalRemarkType: "APPROVAL", // APPROVAL\REJECT
      // 变更前\变更后按钮标记
      changedButtonsFlag: "after", // after\before
      // 行-详情
      lineDetailFlag: false,
      lineDetailDataSet: null,
    };
  },
  computed: {
    lineDetailChangeStateButtons() {
      return [ {
        text: this.$T("sprm.common.view.button.beforeChange").$D("变更前"),
        bordered: true,
        visible: true,
        fill: this.changedButtonsFlag === "before",
        type: "warn",
        handler: () => {
          this.beforeChangeAction();
        }
      }, {
        text: this.$T("sprm.common.view.button.afterChange").$D("变更后"),
        bordered: true,
        visible: true,
        fill: this.changedButtonsFlag === "after",
        type: "danger",
        handler: () => {
          this.afterChangeAction();
        }
      }, ];
    },
    bottomButtons() {
      return [ {
        text: this.$T("sprm.purchaseRequisitionApproval.view.button.reject").$D("审批拒绝"),
        bordered: true,
        visible: true,
        type: "danger",
        handler: () => {
          this.approvalRemarkType = "REJECT";
          this.approvalRemarkPopupFlag = true;
        }
      }, {
        text: this.$T("sprm.purchaseRequisitionApproval.view.button.approval").$D("审批通过"),
        fill: false,
        visible: true,
        bordered: true,
        size: "large",
        type: "success",
        handler: () => {
          this.approvalRemarkType = "APPROVAL";
          this.approvalRemarkPopupFlag = true;
        }
      } ];
    },
    // 基本信息-Columns
    getBasicInfoColumns() {
      // if (this.prSourcePlatform === "ERP") {
      //   return this.getBasicInfoERPColumns();
      // } else if (this.prSourcePlatform === "E-COMMERCE") {
      //   return this.getBasicInfoECOMMERCEColumns();
      // }
      return this.getBasicInfoSrmColumns();
    },
    getBasicInfoColumnsCode() {
      // if (this.prSourcePlatform === "ERP") {
      //   return "SMBL.PURCHASE_REQUISITION_APPROVAL.BASIC_INFO_ERP";
      // } else if (this.prSourcePlatform === "E-COMMERCE") {
      //   return "SMBL.PURCHASE_REQUISITION_APPROVAL.BASIC_INFO_ECOMMERCE";
      // }
      return "SMBL.PURCHASE_REQUISITION_APPROVAL.BASIC_INFO";
    },
    // 基本信息详情-Columns
    getBasicInfoDetailColumns() {
      // if (this.prSourcePlatform === "ERP") {
      //   return this.getBasicInfoERPDetailColumns();
      // } else if (this.prSourcePlatform === "E-COMMERCE") {
      //   return this.getBasicInfoECOMMERCEDetailColumns();
      // }
      return this.getBasicInfoSrmDetailColumns();
    },
    getBasicInfoDetailColumnsCode() {
      // if (this.prSourcePlatform === "ERP") {
      //   return "SMBL.PURCHASE_REQUISITION_APPROVAL.BASIC_INFO_ERP.DETAIL";
      // } else if (this.prSourcePlatform === "E-COMMERCE") {
      //   return "SMBL.PURCHASE_REQUISITION_APPROVAL.BASIC_INFO_ECOMMERCE.DETAIL";
      // }
      return "SMBL.PURCHASE_REQUISITION_APPROVAL.BASIC_INFO.DETAIL";
    },
    // 采购方与采买组织-columns
    getOrganizationColumns() {
      return [ {
        fieldCode: "companyName",
        fieldType: "EMPTY",
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
        </srm-list-header>,
      }, {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
      }, {
        fieldCode: "purchaseOrgName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
      }, {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.purchaserName").$D("采购员"),
      }, ];
    },
    // 采购方与采买组织-详情-columns
    getOrganizationDetailColumns() {
      return [ {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
      }, {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
      }, {
        fieldCode: "purchaseOrgName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
      }, {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.purchaserName").$D("采购员"),
      }, ];
    },
    // 收货/收单信息-columns
    getDeliveryInfoColumns() {
      return [ {
        fieldType: "EMPTY",
        fieldCode: "receiverContactName",
        render: (val) => <srm-list-header>
          <span>{this.$T("sprm.common.model.common.acceptPerson").$D("收货联系人")}：{val}</span>
        </srm-list-header>,
      }, {
        fieldType: "TEXT",
        fieldCode: "receiverAddressName",
        fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
      }, {
        fieldType: "TEXT",
        fieldCode: "receiverTelNum",
        fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
        render: (val, item) => val ? `${item.internationalTelCode || "" } ${val}` : "-",
      }, {
        fieldType: "TEXT",
        fieldCode: "invoiceAddress",
        fieldName: this.$T("sprm.common.model.common.invoiceAddress").$D("收单方地址"),
      }, {
        fieldType: "TEXT",
        fieldCode: "invoiceContactName",
        fieldName: this.$T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
      }, {
        fieldType: "TEXT",
        fieldCode: "invoiceTelNum",
        fieldName: this.$T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
        render: (val, item) => val ? `${item.internationalTelCode || "" } ${val}` : "-",
      }, {
        fieldType: "TEXT",
        fieldCode: "purchaseUnitName",
        fieldName: this.$T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
      }, {
        fieldType: "TEXT",
        fieldCode: "receiverEmailAddress",
        fieldName: this.$T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
      }, ];
    },
    // 收货/收单信息-详情-columns
    getDeliveryInfoDetailColumns() {
      return [ {
        fieldType: "TEXT",
        fieldCode: "receiverContactName",
        fieldName: this.$T("sprm.common.model.common.acceptPerson").$D("收货联系人"),
      }, {
        fieldType: "TEXT",
        fieldCode: "receiverAddressName",
        fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
      }, {
        fieldType: "TEXT",
        fieldCode: "receiverTelNum",
        fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
        render: (val, item) => val ? `${item.internationalTelCode || "" } ${val}` : "-",
      }, {
        fieldType: "TEXT",
        fieldCode: "invoiceAddress",
        fieldName: this.$T("sprm.common.model.common.invoiceAddress").$D("收单方地址"),
      }, {
        fieldType: "TEXT",
        fieldCode: "invoiceContactName",
        fieldName: this.$T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
      }, {
        fieldType: "TEXT",
        fieldCode: "invoiceTelNum",
        fieldName: this.$T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
        render: (val, item) => val ? `${item.internationalTelCode || "" } ${val}` : "-",
      }, {
        fieldType: "TEXT",
        fieldCode: "purchaseUnitName",
        fieldName: this.$T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
      }, {
        fieldType: "TEXT",
        fieldCode: "receiverEmailAddress",
        fieldName: this.$T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
      }, ];
    },
    // 开票信息-columns
    getBillingInfoColumns() {
      return [ {
        fieldType: "EMPTY",
        fieldCode: "taxRegisterNum",
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceTitle").$D("发票抬头"),
        fieldType: "TEXT",
        fieldCode: "invoiceTitle",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterAddress").$D("税务登记地址"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterAddress",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterTel").$D("公司电话"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterTel",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterBank").$D("开户行"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterBank",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterBankAccount").$D("开户行账号"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterBankAccount",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceMethod").$D("开票方式"),
        fieldType: "TEXT",
        fieldCode: "invoiceMethodName",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceTitleTypeMeaning").$D("发票形式"),
        fieldType: "TEXT",
        fieldCode: "invoiceTypeName",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
        fieldType: "TEXT",
        fieldCode: "invoiceTitleTypeName",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
        fieldType: "TEXT",
        fieldCode: "invoiceDetailTypeName",
      }, ];
    },
    // 开票信息-详情-columns
    getBillingInfoDetailColumns() {
      return [ {
        fieldType: "TEXT",
        fieldCode: "taxRegisterNum",
        fieldName: this.$T("sprm.common.model.common.taxRegisterNum").$D("税务登记号"),
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceTitle").$D("发票抬头"),
        fieldType: "TEXT",
        fieldCode: "invoiceTitle",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterAddress").$D("税务登记地址"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterAddress",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterTel").$D("公司电话"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterTel",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterBank").$D("开户行"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterBank",
      }, {
        fieldName: this.$T("sprm.common.model.common.taxRegisterBankAccount").$D("开户行账号"),
        fieldType: "TEXT",
        fieldCode: "taxRegisterBankAccount",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceMethod").$D("开票方式"),
        fieldType: "TEXT",
        fieldCode: "invoiceMethodName",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceTitleTypeMeaning").$D("发票形式"),
        fieldType: "TEXT",
        fieldCode: "invoiceTypeName",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
        fieldType: "TEXT",
        fieldCode: "invoiceTitleTypeName",
      }, {
        fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
        fieldType: "TEXT",
        fieldCode: "invoiceDetailTypeName",
      }, ];
    },
    // 申请明细信息-columns
    getRuqustInfoColumns() {
      return [ {
        fieldCode: "invOrganizationName",
        formRow: 10,
      }, {
        fieldCode: "quantity",
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "displayLineNum",
        formRow: 20,
        formCol: 20,
      }, {
        fieldCode: "productName",
        formRow: 30,
      }, {
        fieldCode: "productNum",
        formRow: 40,
      }, {
        fieldCode: "itemName",
        formRow: 50,
      }, {
        fieldCode: "itemCode",
        formRow: 60,
      }, {
        fieldCode: "categoryName",
        formRow: 70,
        formCol: 10,
      }, {
        fieldCode: "productSpecsJson",
        formRow: 70,
        formCol: 20,
        render: (val, item) => val ? <div style="color: var(--font-color-primary)" onClick={(e) => {
          e.stopPropagation();
          this.showProductAttributes(item);
        }}>
          {this.$T("sprm.common.view.button.viewProperty").$D("查看属性")}
        </div> : "-",
      }, {
        fieldCode: "taxIncludedUnitPrice",
        formRow: 80,
        formCol: 10,
      }, {
        fieldCode: "lastPurchasePrice",
        formRow: 80,
        formCol: 20,
        render: (val, item) => val || val === 0 ? <span style="color: var(--font-color-primary)" onClick={(e) => {
          e.stopPropagation();
          this.showLastPurPriceList(item);
        }}>{SrmUtil.getNumberLocalized(val)}</span> : "-",
      }, {
        fieldCode: "attachmentUuid",
        formRow: 90,
        formCol: 10,
      }, {
        fieldCode: "executionBillDetail",
        formRow: 90,
        formCol: 20,
        render: (val, item) => <div style="color: var(--font-color-primary)" onClick={(e) => {
          e.stopPropagation();
          this.showExecutionBill(item);
        }}>
          {this.$T("spcm.common.model.clickView").$D("点击查看")}
        </div>,
      }, {
        fieldCode: "budgetIoFlag",
        formRow: 100,
        formCol: 10,
      }, {
        fieldCode: "neededDate",
        formRow: 100,
        formCol: 20,
      }, {
        fieldCode: "remark",
        formRow: 110,
      }, ];
    }
  },
  beforeMount() {
    if (this.parameters) {
      // 审批页面过来的，不可显示审批按钮
      this.prHeaderId = this.parameters.prHeaderId;
      this.approvalButtonFlag = false;
    } else {
      // 子应用过来的，需要审批按钮
      this.prHeaderId = this.$route.query.prHeaderId;
      this.approvalButtonFlag = true;
    }
    this.requestData();
  },
  methods: {
    // 审批前校验
    beforeApprove() {
      if (!this.basicInfoDataSet.validate()) {
        return false;
      }
      // 保存数据
      return new Promise((resolve, reject) => {
        this.prLineDataSet.toData().map((data) => {
          data.neededDate = SrmUtil.dateFormat(data.neededDate, "yyyy-MM-dd hh:mm:ss");
        });
        saveApi({
          ...this.basicInfoDataSet.toData()[0],
          prLineList: this.prLineDataSet.toData(),
        }).then((res) => {
          if (res && res.failed) {
            reject(false);
          }
          resolve(true);
        });
      });
    },
    async requestData() {
      this.$loading.show();
      // 请求网络
      let baseInfo = await getPrDetailApi(this.prHeaderId);
      let permissions = await getPermissionsApi([ "hzero.srm.requirement.prm.pr-platform.ps.external-attachment" ]);
      let records = await getActionsRecordApi(this.prHeaderId);
      // 取出来源平台
      this.prSourcePlatform = baseInfo.prSourcePlatform;
      // 构建基本信息tab的数据
      this.basicInfo = baseInfo;
      this.basicInfoDataSet = new DataSet(formDS());
      // 保留_token
      let _token = this.basicInfo._token;
      this.basicInfoDataSet.create(this.basicInfo, 0);
      this.basicInfo._token = _token;
      // 行数据
      this.prLineDataSet = new DataSet(purchaseRequisitionLineDS(this.prHeaderId, baseInfo.changedFlag));
      this.externalAttachmentFlag = permissions[0].approve;
      // 附件数据构建
      this.attachmentsItems.push({
        isExternalFlag: false,
        title: this.$T("sprm.common.view.button.headAttachment").$D("头附件"),
        uuid: this.basicInfo.attachmentUuid,
      });
      if (this.externalAttachmentFlag) {
        this.attachmentsItems.push({
          isExternalFlag: true,
          title: this.$T("sprm.common.view.button.headAttachment").$D("头附件"),
          uuid: this.basicInfo.externalAttachmentUuid,
        });
      }
      // 操作记录数据处理
      /**
       * 动作为【新增行/删除行】的操作记录直接隐藏，
       * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
       * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
       * 动作为【分配】的操作记录不允许合并
       * 动作为【更新/变更】的操作记录 对字段进行合并记录
       */
      let data = [];
      (isArray(records) ? records : []).map((res) => {
        if (res.processTypeCode !== "NEWLINE" && res.processTypeCode !== "DELLINE") {
          if (res.processTypeCode === "ASSIGNED") {
            data.push(res);
          } else if (res.processTypeCode === "UPDATE") {
            if (data.findIndex((val) => val.batchNo === res.batchNo) === -1) {
              // 拼接更新的信息
              let updateRecords = [];
              records.map((val) => {
                if (val.batchNo === res.batchNo) {
                  updateRecords.push(val);
                }
              });
              let processRemarks = updateRecords.map((u) =>
                `\n${u.processUserName} ${u.processRemark ? u.processRemark : `将【${u.changeFieldMeaning}】由【${u.oldValue || ""}】改成【${u.newValue}】 行号【${u.displayLineNum}】`}`
              ) || [];
              data.push({ ...res, processRemark: processRemarks.join("\n") });
            }
          } else if (data.findIndex((val) => val.processedDate === res.processedDate && val.batchNo === res.batchNo) === -1) {
            if (res.processTypeCode === "CHANGE") {
              // 拼接变更的信息
              let updateRecords = [];
              records.map((val) => {
                if (val.batchNo === res.batchNo) {
                  updateRecords.push(val);
                }
              });
              let processRemarks = updateRecords.map((u) =>
                `\n${u.processUserName} ${u.processRemark ? u.processRemark : `将【${u.changeFieldMeaning}】由【${u.oldValue || ""}】改成【${u.newValue}】 行号【${u.displayLineNum}】`}`
              ) || [];
              data.push({ ...res, processRemark: processRemarks.join("\n") });
            } else {
              data.push(res);
            }
          }
        }
      });
      this.actionRecordList = data.map((item) => ({
        ...item,
        status: {
          type: "info",
          text: item.processTypeCodeMeaning,
        }
      }));
      this.$loading.hide();
    },
    // 基础信息弹框
    showBasicInfoDetail() {
      this.$popup({
        title: this.$T("sprm.common.view.panel.basicInfo").$D("申请基础信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getBasicInfoDetailColumns}
          data-source={this.basicInfo}
          type="list"
          need-padding={true}
          code={this.getBasicInfoDetailColumnsCode}/>,
      });
    },
    // 采购方及采买组织信息详情弹框
    showOrganizationDetail() {
      this.$popup({
        title: this.$T("sprm.common.view.panel.organization").$D("采购方及采买组织信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getOrganizationDetailColumns}
          data-source={this.basicInfo}
          type="list"
          need-padding={true}
          code="SMBL.PURCHASE_REQUISITION_APPROVAL.ORGANIZATION.DETAIL"/>,
      });
    },
    // 收货/收单查看详情
    showDeliveryInfoDetail() {
      this.$popup({
        title: this.$T("sprm.common.view.panel.deliveryInfo").$D("收货/收单信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getDeliveryInfoDetailColumns}
          data-source={this.basicInfo}
          type="list"
          need-padding={true}
          code="SMBL.PURCHASE_REQUISITION_APPROVAL.DELIVERY_INFO.DETAIL"/>,
      });
    },
    // 开票信息查看详情
    showBillingInfoDetail() {
      this.$popup({
        title: this.$T("sprm.common.view.panel.deliveryInfo").$D("收货/收单信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getBillingInfoDetailColumns}
          data-source={this.basicInfo}
          type="list"
          need-padding={true}
          code="SMBL.PURCHASE_REQUISITION_APPROVAL.BILLING_INFO.DETAIL"/>,
      });
    },
    afterChangeAction() {
      this.prLineDataSet.records.forEach((record) => {
        if (record.data.changeState === 2) {
          record.data.changeState = 1;
        }
      });
      this.changedButtonsFlag = "after";
    },
    beforeChangeAction() {
      this.prLineDataSet.records.forEach((record) => {
        if (record.data.changeState === 1) {
          record.data.changeState = 2;
        }
      });
      this.changedButtonsFlag = "before";
    },
    // 行点击-查看行详情
    lineItemClick(record) {
      this.lineDetailDataSet = new DataSet(prLineDetailDS());
      this.lineDetailDataSet.create(record.data, 0);
      this.lineDetailFlag = true;
    },
    // 行点击-执行单据
    showExecutionBill(item) {
      this.executionBillDataSet = new DataSet(executionBillDS(item.prLineId));
      this.$popup({
        title: this.$T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-list data-set={this.executionBillDataSet} columns={
          [ {
            fieldCode: "displayPrNum",
            fieldType: "EMPTY",
            render: (val) => <srm-list-header show-open-tag={true}>
              <span>{val}</span>
            </srm-list-header>,
          },
          { fieldCode: "lineNum", },
          { fieldCode: "executeBillTypeMeaning", },
          { fieldCode: "executionBillNum", },
          { fieldCode: "executionBillLineNum", },
          { fieldCode: "executeQuantity", },
          { fieldCode: "supplier", },
          { fieldCode: "billStatusMeaning", },
          { fieldCode: "needDate", }, ]}
        onItemClick={this.showExecutionBillDetail}/>,
      });
      this.executionBillDataSet.refresh();
    },
    showExecutionBillDetail(record) {
      this.executionBillDetailDataSet = new DataSet(executionBillDS());
      this.executionBillDetailDataSet.create(record.data, 0);
      this.$popup({
        title: this.$T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-form data-set={this.executionBillDetailDataSet} customize-type="detail" columns={[
          { fieldCode: "displayPrNum", },
          { fieldCode: "lineNum", },
          { fieldCode: "executeBillTypeMeaning", },
          { fieldCode: "executionBillNum", },
          { fieldCode: "executionBillLineNum", },
          { fieldCode: "executeQuantity", },
          { fieldCode: "supplier", },
          { fieldCode: "billStatusMeaning", },
          { fieldCode: "needDate", },
        ]}></srm-form>,
      });
    },
    // 行点击-比加单
    showPriceCompareList(item) {
      this.priceCompareDataSet = new DataSet(priceCompareDS());
      this.$popup({
        title: this.$T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-list scrollable={false} data-set={this.priceCompareDataSet} columns={
          [ {
            fieldCode: "productCode",
            fieldType: "EMPTY",
            render: (val) => <srm-list-header show-open-tag={true}>
              <span>{val}</span>
            </srm-list-header>,
          },
          { fieldCode: "supplierCompanyNum", },
          { fieldCode: "productName", },
          { fieldCode: "price", },
          { fieldCode: "imagePath", }, ]}
        onItemClick={this.showPriceCompareDetail}/>,
      });
      this.priceCompareDataSet.setData(JSON.parse(item.productCompareJson));
    },
    // 行点击-比加单-详情
    showPriceCompareDetail(record) {
      this.priceCompareDetailDataSet = new DataSet(priceCompareDS());
      this.priceCompareDetailDataSet.create(record.data, 0);
      this.$popup({
        title: this.$T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-form data-set={this.priceCompareDetailDataSet} customize-type="detail" columns={[
          { fieldCode: "productCode", },
          { fieldCode: "supplierCompanyNum", },
          { fieldCode: "productName", },
          { fieldCode: "price", },
          { fieldCode: "imagePath", },
        ]}></srm-form>,
      });
    },
    // 行点击-物料定制属性
    showCustomAttributeList(item) {
      this.customAttributeDataSet = new DataSet(customAttributeDS(item.itemId, item.prLineId));
      this.$popup({
        title: this.$T("sprm.common.model.common.customAttributeList").$D("物料定制属性"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-list data-set={this.customAttributeDataSet} columns={
          [ { fieldCode: "attributeName", }, { fieldCode: "attributeValue", } ]}/>,
      });
      this.customAttributeDataSet.refresh();
    },
    // 行点击-商品定制属性，定制品属性
    showCustomSpecsJson(item) {
      this.productCustomAttDataSet = new DataSet(productCustomAttDS());
      this.$popup({
        title: this.$T("sprm.common.model.common.customSpecs").$D("定制品属性"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-list scrollable={false} data-set={this.productCustomAttDataSet} columns={
          [ { fieldCode: "componentName", }, { fieldCode: "other", }, { fieldCode: "cpValue" } ]}/>,
      });
      this.productCustomAttDataSet.setData(JSON.parse(item.customSpecsJson));
    },
    // 行点击-上次采购单价
    showLastPurPriceList(item) {
      this.lastPurPriceDataSet = new DataSet(lastPurPriceDS(item.poLineId));
      this.$popup({
        title: this.$T("sprm.common.model.common.lastPurPrice").$D("上次采购单价"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-list data-set={this.lastPurPriceDataSet} columns={
          [ {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            render: (val) => <srm-list-header show-open-tag={true}>
              <span>{val}</span>
            </srm-list-header>,
          },
          { fieldCode: "lineNum", },
          { fieldCode: "companyName", },
          { fieldCode: "supplierCode", },
          { fieldCode: "supplierName", },
          { fieldCode: "enteredTaxIncludedPrice", },
          { fieldCode: "quantity", },
          { fieldCode: "taxIncludedLineAmount", },
          { fieldCode: "confirmedDate", }, ]}
        onItemClick={this.lastPurPriceDetail}/>,
      });
      this.lastPurPriceDataSet.refresh();
    },
    // 行点击-上次采购单价-详情
    lastPurPriceDetail(record) {
      this.lastPurPriceDetailDataSet = new DataSet(lastPurPriceDS());
      this.lastPurPriceDetailDataSet.create(record.data, 0);
      this.$popup({
        title: this.$T("sprm.common.model.common.lastPurchasePrice").$D("上次采购单价"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-form data-set={this.lastPurPriceDetailDataSet} customize-type="detail" columns={[
          { fieldCode: "displayPoNum", },
          { fieldCode: "lineNum", },
          { fieldCode: "companyName", },
          { fieldCode: "supplierCode", },
          { fieldCode: "supplierName", },
          { fieldCode: "enteredTaxIncludedPrice", },
          { fieldCode: "quantity", },
          { fieldCode: "taxIncludedLineAmount", },
          { fieldCode: "confirmedDate", },
        ]}></srm-form>,
      });
    },
    // 行点击-商品属性
    showProductAttributes(item) {
      this.productAttributeDataSet = new DataSet(productAttributeDS());
      this.$popup({
        title: this.$T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-list scrollable={false} data-set={this.productAttributeDataSet} columns={[
          { fieldCode: "pName" }, { fieldCode: "pValue" },
        ] } />
      });
      this.productAttributeDataSet.setData(JSON.parse(item.productSpecsJson));
    },
    // 审批通过按钮
    async approvalAction() {
      this.approvalRemarkPopupFlag = false;
      this.$loading.show();
      let res = null;
      if ("CANCELLEDING" === this.basicInfo.approvalPendingStatus) {
        // 取消中
        res = await cancelApprovalApi([ this.basicInfo ]);
      } else {
        // 其余按已提交处理
        res = await submitApprovalApi([ this.basicInfo ]);
      }
      this.$loading.hide();
      if (res && !res.failed) {
        this.$router.back();
      }
    },
    // 审批拒绝按钮
    async rejectAction() {
      this.approvalRemarkPopupFlag = false;
      this.$loading.show();
      let res = null;
      if ("CANCELLEDING" === this.basicInfo.approvalPendingStatus) {
        // 取消中
        res = await cancelRejectApi([ this.basicInfo ]);
      } else {
        // 其余按已提交处理
        res = await submitRejectApi([ this.basicInfo ]);
      }
      this.$loading.hide();
      if (res && !res.failed) {
        this.$router.back();
      }
    },
    // 基本信息-详情-ERP来源
    getBasicInfoERPDetailColumns() {
      return [ {
        fieldCode: "displayPrNum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.modal.displayPrNum").$D("采购申请编号"),
        formRow: 10,
        formCol: 10,
      }, {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        formRow: 30,
        formCol: 10,
      }, {
        fieldCode: "prSourcePlatformMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        formRow: 40,
        formCol: 10,
      }, {
        fieldCode: "sourceCodeMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.externalSystemName").$D("外部系统名称"),
        formRow: 50,
        formCol: 10,
      }, {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
        formRow: 60,
        formCol: 10,
      }, ];
    },
    // 基本信息-详情-电商来源
    getBasicInfoECOMMERCEDetailColumns() {
      return [ {
        fieldCode: "displayPrNum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.modal.displayPrNum").$D("采购申请编号"),
        formRow: 10,
        formCol: 10,
      }, {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.title").$D("标题"),
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        formRow: 30,
        formCol: 10,
      }, {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        formRow: 40,
        formCol: 10,
      }, {
        fieldCode: "amount",
        fieldType: "INPUT_NUMBER",
        fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
        formRow: 50,
        formCol: 10,
        editor: false,
        precision: (val, record) => {
          if (record.prSourcePlatform === "SRM") {
            return record.financialPrecision;
          }
        },
      }, {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
        formRow: 60,
        formCol: 10,
      }, {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
        formRow: 70,
        formCol: 10,
      }, {
        fieldCode: "purchaseOrgName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
        formRow: 80,
        formCol: 10,
      }, {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.purchaserName").$D("采购员"),
        formRow: 90,
        formCol: 20,
      }, {
        fieldCode: "prSourcePlatformMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        formRow: 100,
        formCol: 10,
      }, {
        fieldCode: "lotNum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.lotNum").$D("批次号"),
        formRow: 110,
        formCol: 10,
      }, {
        fieldCode: "originalCurrency",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.originalCurrency").$D("原币币种"),
        formRow: 120,
        formCol: 10,
      }, {
        fieldCode: "paymentMethodName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.paymentMethodCode").$D("支付方式"),
        formRow: 130,
        formCol: 10,
      }, {
        fieldCode: "requestDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.requestDate").$D("申请日期"),
        formRow: 140,
        formCol: 10,
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
        formRow: 150,
        formCol: 10,
      }, ];
    },
    //基本信息-详情-SRM及其他来源
    getBasicInfoSrmDetailColumns() {
      return [ {
        fieldCode: "displayPrNum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.modal.displayPrNum").$D("采购申请编号"),
        formRow: 10,
        formCol: 10,
      }, {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.title").$D("标题"),
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        formRow: 25,
        formCol: 10,
      }, {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        formRow: 30,
        formCol: 10,
      }, {
        fieldCode: "prTypeName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prTypeName").$D("申请类型"),
        formRow: 35,
        formCol: 10,
      }, {
        fieldCode: "unitName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.unitName").$D("所属部门"),
        formRow: 40,
        formCol: 10,
      }, {
        fieldCode: "prSourcePlatformMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        formRow: 45,
        formCol: 10,
      }, {
        fieldCode: "originalCurrency",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.originalCurrency").$D("原币币种"),
        formRow: 50,
        formCol: 10,
      }, {
        fieldCode: "amount",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
        formRow: 60,
        formCol: 10,
        render: (val, item) => {
          let length = 0;
          if (item.prSourcePlatform === "SRM") {
            length = item.financialPrecision;
          }
          if (item.headerPriceHiddenFlag === 1) {
            return item.amountMeaning;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      }, {
        fieldCode: "localCurrency",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.localCurrency").$D("本币币种"),
        formRow: 70,
        formCol: 10,
      }, {
        fieldCode: "localCurrencyTaxSum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.localCurrencyTaxSum").$D("本币含税金额"),
        formRow: 80,
        formCol: 10,
        render: (val, item) => {
          let length = 0;
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          if (item.headerPriceHiddenFlag === 1) {
            return item.localCurrencyTaxSumMeaning;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      }, {
        fieldCode: "paymentMethodName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.paymentMethodCode").$D("支付方式"),
        formRow: 90,
        formCol: 10,
      }, {
        fieldCode: "lotNum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.lotNum").$D("批次号"),
        formRow: 100,
        formCol: 20,
      }, {
        fieldCode: "prRequestedName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prRequestedName").$D("申请人"),
        formRow: 110,
        formCol: 10,
        render: (val, item) => item.prRequestedNum && val ? `${item.prRequestedNum || ""}-${val}` : "-",
      }, {
        fieldCode: "requestDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.requestDate").$D("申请日期"),
        formRow: 120,
        formCol: 20,
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
        formRow: 130,
        formCol: 10,
      }, ];
    },
    // 基本信息-ERP来源
    getBasicInfoERPColumns() {
      return [ {
        fieldCode: "displayPrNum",
        fieldType: "EMPTY",
        formRow: 10,
        formCol: 10,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
        </srm-list-header>,
      }, {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        formRow: 30,
        formCol: 10,
      }, {
        fieldCode: "prSourcePlatformMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        formRow: 40,
        formCol: 10,
      }, {
        fieldCode: "sourceCodeMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.externalSystemName").$D("外部系统名称"),
        formRow: 40,
        formCol: 20,
      }, {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
        formRow: 50,
        formCol: 10,
      }, ];
    },
    // 基本信息-电商来源
    getBasicInfoECOMMERCEColumns() {
      return [ {
        fieldCode: "displayPrNum",
        fieldType: "EMPTY",
        formRow: 10,
        formCol: 10,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
        </srm-list-header>,
      }, {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.title").$D("标题"),
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        formRow: 30,
        formCol: 10,
      }, {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        formRow: 40,
        formCol: 10,
      }, {
        fieldCode: "amount",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
        formRow: 40,
        formCol: 20,
        editor: false,
        render: (val, item) => {
          let length = 0;
          if (item.prSourcePlatform === "SRM") {
            length = item.financialPrecision;
          }
          if (item.headerPriceHiddenFlag === 1) {
            return item.amountMeaning;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      }, {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
        formRow: 50,
        formCol: 10,
      }, {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
        formRow: 60,
        formCol: 10,
      }, {
        fieldCode: "purchaseOrgName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
        formRow: 70,
        formCol: 10,
      }, {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.purchaserName").$D("采购员"),
        formRow: 70,
        formCol: 20,
      }, {
        fieldCode: "prSourcePlatformMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        formRow: 80,
        formCol: 10,
      }, {
        fieldCode: "lotNum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.lotNum").$D("批次号"),
        formRow: 80,
        formCol: 20,
      }, {
        fieldCode: "originalCurrency",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.originalCurrency").$D("原币币种"),
        formRow: 90,
        formCol: 10,
      }, {
        fieldCode: "paymentMethodName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.paymentMethodCode").$D("支付方式"),
        formRow: 90,
        formCol: 20,
      }, {
        fieldCode: "requestDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.requestDate").$D("申请日期"),
        formRow: 100,
        formCol: 10,
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
        formRow: 110,
        formCol: 10,
      }, ];
    },
    // 基本信息-SRM及其他来源
    getBasicInfoSrmColumns() {
      return [ {
        fieldCode: "displayPrNum",
        fieldType: "EMPTY",
        formRow: 10,
        formCol: 10,
        render: (val) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
        </srm-list-header>,
      }, {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.title").$D("标题"),
        formRow: 20,
        formCol: 10,
      }, {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        formRow: 25,
        formCol: 10,
      }, {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        formRow: 30,
        formCol: 10,
      }, {
        fieldCode: "prTypeName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prTypeName").$D("申请类型"),
        formRow: 30,
        formCol: 20,
      }, {
        fieldCode: "unitName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.unitName").$D("所属部门"),
        formRow: 40,
        formCol: 10,
      }, {
        fieldCode: "prSourcePlatformMeaning",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        formRow: 40,
        formCol: 20,
      }, {
        fieldCode: "originalCurrency",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.originalCurrency").$D("原币币种"),
        formRow: 50,
        formCol: 10,
      }, {
        fieldCode: "amount",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
        formRow: 50,
        formCol: 20,
        render: (val, item) => {
          let length = 0;
          if (item.prSourcePlatform === "SRM") {
            length = item.financialPrecision;
          }
          if (item.headerPriceHiddenFlag === 1) {
            return item.amountMeaning;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      }, {
        fieldCode: "localCurrencyTaxSum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.localCurrencyTaxSum").$D("本币含税金额"),
        formRow: 60,
        formCol: 10,
        render: (val, item) => {
          let length = 0;
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          if (item.headerPriceHiddenFlag === 1) {
            return item.localCurrencyTaxSumMeaning;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      }, {
        fieldCode: "paymentMethodName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.paymentMethodCode").$D("支付方式"),
        formRow: 70,
        formCol: 10,
      }, {
        fieldCode: "lotNum",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.lotNum").$D("批次号"),
        formRow: 70,
        formCol: 20,
      }, {
        fieldCode: "prRequestedName",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.prRequestedName").$D("申请人"),
        formRow: 80,
        formCol: 10,
        render: (val, item) => item.prRequestedNum && val ? `${item.prRequestedNum || ""}-${val}` : "-",
      }, {
        fieldCode: "requestDate",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.requestDate").$D("申请日期"),
        formRow: 80,
        formCol: 20,
        render: (val) => SrmUtil.dateFormat(val),
      }, {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
        formRow: 90,
        formCol: 10,
      },
      {
        fieldCode: "attributeVarchar2",
        fieldName: this.$T("sprm.common.model.common.attributeVarchar2").$D("是否免竞价"),
        visible: (val, item) => item.attributeVarchar2 === 1 || item.attributeVarchar2 === "1",
        render: (val, item) => item.attributeVarchar2Meaning,
      },
      {
        fieldCode: "attributeVarchar6Meaning",
        fieldName: this.$T("sprm.common.model.common.attributeVarchar6").$D("免竞价类型"),
        visible: (val, item) => item.attributeVarchar2 === 1 || item.attributeVarchar2 === "1",
      },
      {
        fieldCode: "attributeVarchar8Meaning",
        fieldName: this.$T("sprm.common.model.common.attributeVarchar8").$D("免竞价适用时间"),
        visible: (val, item) => item.attributeVarchar2 === 1 || item.attributeVarchar2 === "1",
      },
      {
        fieldCode: "attributeLongtext1",
        fieldName: this.$T("sprm.common.model.common.attributeLongtext1").$D("免竞价详情说明"),
        visible: (val, item) => item.attributeVarchar2 === 1 || item.attributeVarchar2 === "1",
      },
      {
        fieldCode: "attributeDecimal1",
        fieldName: this.$T("sprm.common.model.common.attributeDecimal1").$D("预估采购金额"),
        fieldType: "INPUT_NUMBER",
        visible: (val, item) => item.attributeVarchar2 === 1 || item.attributeVarchar2 === "1",
        editor: false,
      },
      {
        fieldCode: "attributeDecimal2",
        fieldName: this.$T("sprm.common.model.common.attributeDecimal2").$D("采购复核金额"),
        fieldType: "INPUT_NUMBER",
        visible: (val, item) => item.attributeVarchar2 === 1 || item.attributeVarchar2 === "1",
        editor: () => {
          const userInfo = SrmUtil.getUserInfo();
          if (userInfo.currentRoleCode && userInfo.currentRoleCode === "purchaser") {
            return true;
          }
          return false;
        },
        required: () => {
          const userInfo = SrmUtil.getUserInfo();
          if (userInfo.currentRoleCode && userInfo.currentRoleCode === "purchaser") {
            return true;
          }
          return false;
        },
      } ];
    },
    // 申请行-详情
    getLineDetailColumns() {
      return [ { fieldCode: "displayLineNum", },
        { fieldCode: "quantity", },
        { fieldCode: "prLineStatusCodeMeaning", },
        { fieldCode: "invOrganizationName", },
        { fieldCode: "productNum", },
        { fieldCode: "operable", },
        { fieldCode: "productName", },
        { fieldCode: "skuType", },
        { fieldCode: "customUomName", },
        { fieldCode: "customQuantity", },
        { fieldCode: "packageQuantity", },
        { fieldCode: "thirdSkuCode", },
        { fieldCode: "thirdSkuName", },
        {
          fieldCode: "customSpecsJson",
          render: (val, item) => val ? <div style="color: var(--font-color-primary)" onClick={(e) => {
            e.stopPropagation();
            this.showCustomSpecsJson(item);
          }}>
            {this.$T("spcm.common.model.clickView").$D("点击查看")}
          </div> : "-",
        },
        { fieldCode: "itemCode", },
        { fieldCode: "itemName", },
        { fieldCode: "itemModel", },
        { fieldCode: "itemSpecs", },
        { fieldCode: "categoryName", },
        { fieldCode: "customMadeFlag", },
        {
          fieldCode: "customAttributeList",
          render: (val, item) => item.customMadeFlag ? <span style="color: var(--font-color-primary)" onClick={(e) => {
            e.stopPropagation();
            this.showCustomAttributeList(item);
          }}>{this.$T("sprm.common.itemcustom.special").$D("定制属性")}</span> : "-",
        },
        { fieldCode: "catalogName", },
        {
          fieldCode: "productSpecsJson",
          render: (val, item) => val ? <div style="color: var(--font-color-primary)" onClick={(e) => {
            e.stopPropagation();
            this.showProductAttributes(item);
          }}>
            {this.$T("sprm.common.view.button.viewProperty").$D("查看属性")}
          </div> : "-",
        },
        { fieldCode: "neededDate", },
        { fieldCode: "occupiedQuantity", },
        { fieldCode: "changeQuantity", },
        { fieldCode: "orderOccupiedQuantity", },
        { fieldCode: "sourceOccupiedQuantity", },
        { fieldCode: "restSourceQuantity", },
        { fieldCode: "restPoQuantity", },
        { fieldCode: "secondLevelStrategyMeaning", },
        { fieldCode: "uomCodeAndName", },
        { fieldCode: "currencyCode", },
        { fieldCode: "taxIncludedUnitPrice", },
        {
          fieldCode: "lastPurchasePrice",
          render: (val, item) => val || val === 0 ? <span style="color: var(--font-color-primary)" onClick={(e) => {
            e.stopPropagation();
            this.showLastPurPriceList(item);
          }}>{SrmUtil.getNumberLocalized(val)}</span> : "-",
        },
        { fieldCode: "unitPriceBatch", },
        { fieldCode: "taxIncludedLineAmount", },
        { fieldCode: "localCurrencyNoTaxSum", },
        { fieldCode: "localCurrencyNoTaxUnit", },
        { fieldCode: "localCurrencyTaxUnit", },
        { fieldCode: "localCurrencyTaxSum", },
        { fieldCode: "supplierList", },
        { fieldCode: "supplierCompanyIdLov", },
        { fieldCode: "prRequestedName", },
        { fieldCode: "purchaseAgentName", },
        { fieldCode: "executorName", },
        { fieldCode: "accountSubjectName", },
        { fieldCode: "costName", },
        { fieldCode: "expBearDep", },
        { fieldCode: "projectNum", },
        { fieldCode: "projectName", },
        { fieldCode: "projectCategoryMeaning", },
        { fieldCode: "wbsCode", },
        { fieldCode: "taxIncludedBudgetUnitPrice", },
        { fieldCode: "budgetAccountName", },
        { fieldCode: "budgetIoFlag", },
        { fieldCode: "pcNum", },
        { fieldCode: "receiveAddress", },
        { fieldCode: "receiveContactName", },
        { fieldCode: "receiveTelNum", },
        { fieldCode: "lineFreight", },
        { fieldCode: "remark", },
        { fieldCode: "budgetOccupyFlag", },
        { fieldCode: "attachmentUuid", },
        { fieldCode: "changeAttachmentUuid", },
        {
          fieldCode: "executionBillDetail",
          render: (val, item) => <div style="color: var(--font-color-primary)" onClick={(e) => {
            e.stopPropagation();
            this.showExecutionBill(item);
          }}>
            {this.$T("spcm.common.model.clickView").$D("点击查看")}
          </div>,
        },
        {
          fieldCode: "productCompareJson",
          render: (val, item) => val ? <div style="color: var(--font-color-primary)" onClick={(e) => {
            e.stopPropagation();
            this.showPriceCompareList(item);
          }}>
            {this.$T("spcm.common.model.clickView").$D("点击查看")}
          </div> : "-",
        }, ];
    }
  },
};
</script>

<style lang="stylus" scoped>
.change-buttons {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  .change-button {
    margin-left: 8px;
  }
}

.attachment-card {
  position: relative;
  height: 54px;
  border-bottom: 1px solid var(--color-border-default);
  >>> .srm-upload {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .right-icon {
    position: absolute;
    right: 15px;
    top: 15px;
    color: var(--font-color-disable);
    font-size: 20px;
  }
  .attachment-container {
    pointer-events: none;
    height: 100%;
    .icon {
      color: var(--color-warn);
      margin-left: 15px;
      font-size: 28px;
    }
    .title {
      margin-left: 8px;
    }
    .attachment-type {
      margin-left: 8px;
    }
  }
}
.bottom-button-space {
  height: 74px;
  height: calc(74px + constant(safe-area-inset-bottom));
  height: calc(74px + env(safe-area-inset-bottom));
  background: var(--background-color-empty-second);
}

// UI校对
.main-tab {
  >>> .srm-scroll {
    background: var(--background-color-empty-second); // 上拉背景色
  }
  // 列表的颜色改回
  .scoll-list {
    >>> .srm-scroll {
      background: var(--background-color-empty);
    }
  }
  // 操作记录最小高度
  >>> .srm-history-record-content {
    min-height: 0px;
  }
}
</style>
