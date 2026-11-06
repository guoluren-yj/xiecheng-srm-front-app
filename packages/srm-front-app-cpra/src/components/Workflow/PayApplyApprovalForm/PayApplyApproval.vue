<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-scroll-tab class="content">
      <!-- 审批事项 -->
      <srm-scroll-tab-item
        :label="$T('hwfl.task.view.message.approveItem').$D('审批事项')">
        <div
          class="content-item"
          @click="
            goDetail(
              getApprovalDetailColums,
              approveItemInfo,
              'SMBL.WORKFLOW.PAYMENT_APPROVE_APPROVAL_DETAIL',
              $T('hwfl.task.view.message.approveItem').$D(
                '审批事项'
              ),
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{ approveItemInfo.processInstance?approveItemInfo.processInstance.processDefinitionName:'' }}
            </div>
            <customize
              :columns="getApprovalColums"
              :data-source="approveItemInfo"
              code="SMBL.WORKFLOW.PAYMENT_APPROVAL_APPROVALITEM"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 基本信息 -->
      <srm-scroll-tab-item
        :label="$T('ssta.purchaseSettle.view.title.basicInfo').$D('基本信息')">
        <div
          class="content-item"
          @click="
            goDetail(
              getBasicDetailColums,
              approvalFormInfo,
              'SMBL.WORKFLOW.PAYMENT_APPROVE_BASIC_DETAIL',
              $T('ssta.purchaseSettle.view.title.basicInfo').$D(
                '基本信息'
              )
            )
          ">
          <div class="card">
            <div class="settle">
              <div class="card-head open-tag">
                {{ approvalFormInfo.settleNum }}
              </div>
              <div class="settle-status">
                {{ approvalFormInfo.settleStatusMeaning }}
              </div>
            </div>
            <customize
              :columns="getBasicColums"
              :data-source="approvalFormInfo"
              code="SMBL.WORKFLOW.PAYAPPLYAPPROVAL_BASEINFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 交易方信息 -->
      <srm-scroll-tab-item
        :label="
          $T('ssta.purchaseSettle.view.title.transactionParty').$D('交易方信息')
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getTransactionPartyDetailColums,
              approvalFormInfo,
              'SMBL.WORKFLOW.PAYMENT_APPROVE_TRANSACTION_PARTY_DETAIL',
              $T('ssta.purchaseSettle.view.title.transactionParty').$D('交易方信息')
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{
                $T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D(
                  "币种"
                )
              }}：{{ approvalFormInfo.currencyCode }}
            </div>
            <customize
              :columns="getTransactionPartyColums"
              code="SMBL.WORKFLOW.TRANSACTION_PARTY"
              :data-source="approvalFormInfo"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 交易金额信息 -->
      <srm-scroll-tab-item
        :label="
          $T('ssta.purchaseSettle.view.title.transactionAmount').$D(
            '交易金额信息'
          )
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getSettleNetAmountDetailColums,
              approvalFormInfo,
              'SMBL.WORKFLOW.PAYMENT_APPROVE_SETTLE_NET_AMOUNT_DETAIL',
              $T('ssta.purchaseSettle.view.title.transactionAmount').$D(
                '交易金额信息'
              )
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{
                $T(
                  "ssta.purchaseSettle.model.purchaseSettle.settleNetAmount"
                ).$D("结算不含税总金额")
              }}：{{ approvalFormInfo.settleNetAmount | thousandBitSeparator }}
            </div>
            <customize
              :columns="getSettleNetAmountColums"
              :data-source="approvalFormInfo"
              code="SMBL.WORKFLOW.SETTLE_NET_AMOUNT"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 交易明细信息 -->
      <srm-scroll-tab-item
        :label="
          $T('ssta.purchaseSettle.view.message.panel.transactionDetails').$D(
            '交易明细信息'
          )
        ">
        <div class="content-item">
          <div
            v-for="(transaction, key) in transactionInfoList"
            :key="key"
            class="card has-border"
            @click="
              goDetail(
                getTransactionDetailsInfoDetailColums,
                transaction,
                'SMBL.WORKFLOW.PAYMENT_APPROVE_TRANSACTION_DETAILS_INFO_DETAIL',
                $T('ssta.purchaseSettle.view.message.panel.transactionDetails').$D(
                  '交易明细信息'
                )
              )
            ">
            <div class="card-head open-tag">{{ transaction.settleNum }}</div>
            <customize
              :columns="getTransactionDetailsInfoColums"
              :data-source="transaction"
              code="SMBL.WORKFLOW.TRANSACTION_DETAILS_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 主策略信息 -->
      <srm-scroll-tab-item
        :label="
          $T('ssta.purchaseSettle.view.title.mainStrategyInfo').$D('主策略信息')
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getMainStrategyInfoDetailColums,
              approvalFormInfo,
              'SMBL.WORKFLOW.PAYMENT_APPROVE_MAIN_STRATEGY_INFO_DETAIL',
              $T('ssta.purchaseSettle.view.title.mainStrategyInfo').$D(
                '主策略信息'
              )
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{ approvalFormInfo.settleConfigNum }}
            </div>
            <customize
              :columns="getMainStrategyInfoColums"
              :data-source="approvalFormInfo"
              code="SMBL.WORKFLOW.MAIN_STRATEGY_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 其他信息 -->
      <srm-scroll-tab-item
        :label="$T('ssta.purchaseSettle.view.title.otherInfo').$D('其他信息')">
        <div
          class="content-item"
          @click="
            goDetail(
              getOtherInfosDetailColums,
              approvalFormInfo,
              'SMBL.WORKFLOW.PAYMENT_APPROVE_OTHER_INFOS',
              $T('ssta.purchaseSettle.view.title.otherInfo').$D('其他信息')
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{
                $T(
                  "ssta.purchaseSettle.model.purchaseSettle.invOrganizationName"
                ).$D("库存组织")
              }}：{{ approvalFormInfo.invOrganizationName }}
            </div>
            <customize
              :columns="getOtherInfosColums"
              code="SMBL.WORKFLOW.OTHER_INFOS"
              :data-source="approvalFormInfo"/>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 付款信息明细详情页pop -->
    <srm-detail-pop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :pop-customize-code="popCustomizeCode"
      :columns="getPopInfoColumns"/>
    <!-- 多维付款列表 -->
    <srm-popup
      :visible.sync="multiPaymentVisible"
      :title="
        $T('ssta.purchaseSettle.view.title.multiPayment').$D('多维度付款')
      "
      rounded>
      <div class="payment">
        <div
          v-for="(item, index) in multiPaymentInfoList"
          :key="index"
          class="card">
          <div class="mult-payment-title">
            <span class="documentNum">{{ item.documentNum }}</span>
            <div @click="getMultiPrePaymentList(item.settleApplyLineList)">
              <span class="pre-pay-title">
                {{
                  $T("ssta.purchaseSettle.view.title.prePaymentWriteOff").$D(
                    "预付款核销"
                  )
                }}</span>
              <img class="arrow" src="@/assets/Comp/chevron-right.png" >
            </div>
          </div>
          <div class="content">
            {{
              $T(
                "ssta.purchaseSettle.view.message.model.purchaseSettle.paymentAmount"
              ).$D("本次付款金额")
            }}:{{ item.paymentAmount | thousandBitSeparator }} /
            {{
              $T(
                "ssta.purchaseSettle.purchaseSettle.remainingPaymentAmount"
              ).$D("剩余可付金额")
            }}:{{ item.remainingPaymentAmount | thousandBitSeparator }}
          </div>
          <div class="tag">
            <srm-tag size="mid" type="primary">
              {{
                $T(
                  "ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmount"
                ).$D("开票含税金额")
              }}:{{ item.invoicedTaxIncludedAmount | thousandBitSeparator }}
            </srm-tag>
            <srm-tag size="mid" type="primary">
              {{
                $T(
                  "ssta.purchaseSettle.view.message.model.purchaseSettle.applyAmount"
                ).$D("本次核销金额")
              }}:{{ item.applyAmount | thousandBitSeparator }}
            </srm-tag>
          </div>
        </div>
      </div>
    </srm-popup>
    <!-- 预付款核销列表 -->
    <srm-popup
      :visible.sync="prePaymentVisible"
      :title="
        $T('ssta.purchaseSettle.view.title.prePaymentWriteOff').$D('预付款核销')
      "
      rounded>
      <div class="payment">
        <div
          v-for="(item, index) in prePaymentInfoList"
          :key="index"
          class="card">
          <div class="pre-payment-title">
            <srm-tag size="small" type="primary">
              {{
                item.prepaymentTypeMeaning
              }}
            </srm-tag>
            <span class="documentNum">{{ item.prepaymentTitle }}</span>
          </div>
          <div class="content">
            {{ $T("ssta.purchaseSettle.associateNum").$D("关联单据编号") }}:{{
              item.associateNum ? item.associateNum : "--"
            }}
          </div>
          <div class="tag">
            <srm-tag size="mid" type="primary">
              {{
                $T(
                  "ssta.purchaseSettle.model.purchaseSettle.prepaymentRemainingAmount"
                ).$D("预付款剩余核销金额")
              }}:{{ item.prepaymentRemainingAmount | thousandBitSeparator }}
            </srm-tag>
            <srm-tag size="mid" type="primary">
              {{
                isMultiPrePayment? $T(
                  "ssta.purchaseSettle.model.purchaseSettle.applyAmount"
                ).$D("预付款核销总金额"):
                $T(
                  "ssta.purchaseSettle.view.message.model.supplySettle.applyAmount"
                ).$D("本次核销金额")
              }}:{{ item.applyAmount | thousandBitSeparator }}
            </srm-tag>
            <srm-tag v-if="item.prepaymentAmount" size="mid" type="primary">
              {{
                isMultiPrePayment?$T(
                  "ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount"
                ).$D("预付款总金额"):
                $T(
                  "ssta.purchaseSettle.view.message.model.purchaseSettle.prepaymentAmount"
                ).$D("预付款金额")
              }}:{{ item.prepaymentAmount | thousandBitSeparator }}
            </srm-tag>
            <srm-tag v-if="item.prepaymentCreatedBy" size="mid" type="primary">
              {{
                $T(
                  "ssta.purchaseSettle.model.purchaseSettle.prepaymentCreatedBy"
                ).$D("预付款申请人")
              }}:{{ item.prepaymentCreatedBy }}
            </srm-tag>
          </div>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import SrmDetailPop from "./components/SrmDetailPop";
import {
  getApprovalItemApi,
  getApprovalFormApi,
  getTransactionInfoListApi,
  getMultiPaymentListApi,
  getPrePaymentListApi,
  getTransactionDetailListApi,
  getPrePaymentCheckLevelApi,
  getPrePaymentCheckPointApi
} from "./api";
export default {
  modules: [ "ssta.purchaseSettle", "ssta.invoiceSheet", "sfin.payment", "hwfl.task", "ssta.ecAutoBill", "hwfp.common", "hwfp.commom", "scux.purchaseRecordApproval", "sfin.purchaseBillConfirm", "ssta.costSheet" ],
  name: "PayApplyApproval",
  components: {
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
      approvalId: "",
      approveItemInfo: {},
      approvalFormInfo: {},
      detailInfo: {},
      headTitle: "",
      transactionInfoList: [],
      getPopInfoColumns: [],
      srmDetailPop: false, //明细页pop
      multiPaymentVisible: false,
      prePaymentVisible: false,
      isMultiPrePayment:false, //是否是多维度列表下的预付款核销
      multiPaymentInfoList: [],
      prePaymentInfoList: [],
      popCustomizeCode:"", //详情弹框个性化编码
      checkLevel:"",
      checkPointList:[]
    };
  },
  computed: {
    // 审批事项
    getApprovalColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.ecAutoBill.model.ecAutoBill.prRequestedName").$D("申请人"),
          fieldCode: "assigneeName",
          render: (val, record) => `${val}(${record.assignee})`,
        },
        {
          fieldName: this.$T("hwfp.common.model.process.ID").$D("流程标识"),
          fieldCode: "executionId",
        },
        {
          fieldName: this.$T("hwfp.commom.model.apply.time").$D("申请时间"),
          fieldCode: "createTime",
        },
        {
          fieldName: this.$T("hwfp.common.model.process.description").$D("流程描述"),
          fieldCode: "description",
        },
      ];

      return columns;
    },
    // 审批事项详情
    getApprovalDetailColums() {
      const columns = [
        {
          fieldName: this.$T("hwfp.common.model.process.name").$D("流程名称"),
          fieldCode: "processInstance",
          render: (val) => val.processDefinitionName,
        },
        {
          fieldName: this.$T("ssta.ecAutoBill.model.ecAutoBill.prRequestedName").$D("申请人"),
          fieldCode: "assigneeName",
          render: (val, record) => `${val}(${record.assignee})`,
        },
        {
          fieldName: this.$T("hwfp.common.model.process.ID").$D("流程标识"),
          fieldCode: "executionId",
        },
        {
          fieldName: this.$T("hwfp.commom.model.apply.time").$D("申请时间"),
          fieldCode: "createTime",
        },
        {
          fieldName: this.$T("hwfp.common.model.process.description").$D("流程描述"),
          fieldCode: "description",
        },
      ];

      return columns;
    },
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.documentTypeMeaning").$D("结算单类型"),
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.campMeaning").$D("创建方阵营"),
          fieldCode: "campMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.createdUserName").$D("创建人"),
          fieldCode: "createdUserName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
      ];

      return columns;
    },
    // 基本信息详情
    getBasicDetailColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settlesNum").$D("结算单编号"),
          fieldCode: "settleNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.documentTypeMeaning").$D("结算单类型"),
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.campMeaning").$D("创建方阵营"),
          fieldCode: "campMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.createdUserName").$D("创建人"),
          fieldCode: "createdUserName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
      ];

      return columns;
    },
    // 交易方信息
    getTransactionPartyColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyName").$D("结算公司名称"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyNum").$D("结算公司编号"),
          fieldCode: "companyNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierName").$D("结算供应商名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierNum").$D("结算供应商编码"),
          fieldCode: "supplierCompanyNum",
        },
      ];

      return columns;
    },
    // 交易方详情信息
    getTransactionPartyDetailColums() {
      const columns = [
        {
          fieldName: this.$T("scux.purchaseRecordApproval.model.currencyCode").$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyName").$D("结算公司名称"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyNum").$D("结算公司编号"),
          fieldCode: "companyNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierName").$D("结算供应商名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierNum").$D("结算供应商编码"),
          fieldCode: "supplierCompanyNum",
        },
      ];

      return columns;
    },
    // 交易金额信息
    getSettleNetAmountColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTaxAmount").$D("结算总税额"),
          fieldCode: "settleTaxAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTaxIncludedAmount").$D("结算含税总金额"),
          fieldCode: "settleTaxIncludedAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedNetAmount").$D("已开票不含税总金额"),
          fieldCode: "invoicedNetAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedTaxAmount").$D("已开票税额"),
          fieldCode: "invoicedTaxAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmount").$D("开票含税金额"),
          fieldCode: "invoicedTaxIncludedAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paidAmount").$D("已付款金额"),
          fieldCode: "paidAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.remainingPaymentAmount").$D("剩余付款金额"),
          fieldCode: "remainingPaymentAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.title.prePaymentWriteOffInfo").$D("预付款核销信息"),
          fieldCode:"virPaymentWriteOffInfo",
          render: () => <a style="color: blue" >{this.$T(
            "ssta.purchaseSettle.button.prePaymentWriteOff"
          ).$D("预付款核销")}</a>,
          callBack: () => {
            this.isMultiPrePayment = false;
            this.getPrePaymentList();
          },
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.applyAmount").$D("预付款核销总金额"),
          fieldCode: "applyAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.prepaymentSpliteRule").$D("预付款拆分规则"),
          fieldCode: "prepaymentSpliteRuleMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息"),
          fieldCode:"virMultiPayment",
          render: () =>
            <div>
              <a style="color: blue" onClick={(e) => this.getMultiPaymentList(e)}>{this.$T(
                "ssta.purchaseSettle.view.title.multiPayment"
              ).$D("多维度付款")}</a>
              <a style="color: blue;margin-left:10px" onClick={(e) => this.getPaymentInfoSafeGuard(e)} >{this.$T(
                "ssta.purchaseSettle.view.title.paymentInfoUpdate"
              ).$D("付款信息维护")}</a>
            </div>
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paymentAmount").$D("付款总金额"),
          fieldCode: "paymentAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paymentSpliteRule").$D("付款自动拆分规则"),
          fieldCode: "paymentSpliteRuleMeaning",
        },
      ];

      return columns;
    },
    // 交易金额信息详情
    getSettleNetAmountDetailColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleNetAmount").$D("结算不含税总金额"),
          fieldCode: "settleNetAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTaxAmount").$D("结算总税额"),
          fieldCode: "settleTaxAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTaxIncludedAmount").$D("结算含税总金额"),
          fieldCode: "settleTaxIncludedAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedNetAmount").$D("已开票不含税总金额"),
          fieldCode: "invoicedNetAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedTaxAmount").$D("已开票税额"),
          fieldCode: "invoicedTaxAmount",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmount").$D("开票含税金额"),
          fieldCode: "invoicedTaxIncludedAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paidAmount").$D("已付款金额"),
          fieldCode: "paidAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.remainingPaymentAmount").$D("剩余付款金额"),
          fieldCode: "remainingPaymentAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息"),
          fieldCode:"virMultiPayment",
          render: () =>
            <div>
              <a style="color: blue" onClick={(e) => this.getMultiPaymentList(e)}>{this.$T(
                "ssta.purchaseSettle.view.title.multiPayment"
              ).$D("多维度付款")}</a>
              <a style="color: blue;margin-left:10px" onClick={(e) => this.getPaymentInfoSafeGuard(e)} >{this.$T(
                "ssta.purchaseSettle.view.title.paymentInfoUpdate"
              ).$D("付款信息维护")}</a>
            </div>
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.applyAmount").$D("预付款核销总金额"),
          fieldCode: "applyAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },

        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.prepaymentSpliteRule").$D("预付款拆分规则"),
          fieldCode: "prepaymentSpliteRuleMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息"),
          render: () => <a style="color: blue" >{this.$T(
            "ssta.purchaseSettle.view.title.paymentInfoUpdate"
          ).$D("付款信息维护")}</a>,
          callBack: (val) => {
            this.getPopInfoColumns = this.getPaymentInfoColumns;
            this.popCustomizeCode = "SMBL.WORKFLOW.PAYMENT_APPROVE_PAYMENT_INFO_DETAIL";
            this.detailInfo = val;
            this.srmDetailPop = !this.srmDetailPop;
          },
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paymentAmount").$D("付款总金额"),
          fieldCode: "paymentAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paymentSpliteRule").$D("付款自动拆分规则"),
          fieldCode: "paymentSpliteRuleMeaning",
        },
      ];

      return columns;
    },
    // 交易明细信息
    getTransactionDetailsInfoColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum").$D("结算事务编号"),
          fieldCode: "settleNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.common.sourceSettleNum").$D("开票结算单号"),
          fieldCode: "sourceSettleHeaderNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.itemName").$D("结算商品名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.common.applyAmount").$D("本次预付款核销金额"),
          fieldCode: "applyAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmounts").$D("已开票含税金额"),
          fieldCode: "invoicedAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paidAmount").$D("已付款金额"),
          fieldCode: "paidAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.button.prePaymentWriteOff").$D("预付款核销"),
          fieldCode:"virPrePaymentWriteOff",
          render: () => <a style="color: blue" >{this.$T(
            "ssta.invoiceSheet.view.button.detailview"
          ).$D("查看详情")}</a>,
          callBack: (val) => {
            this.isMultiPrePayment = false;
            this.getTransactionDetailList(val.settleLineId);
          },
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.adjustNetAmount").$D("尾差不含税调整金额"),
          fieldCode: "adjustNetAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.adjustTaxAmount").$D("尾差税额调整金额"),
          fieldCode: "adjustTaxAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
      ];

      return columns;
    },
    // 交易明细信息详情
    getTransactionDetailsInfoDetailColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D("结算单行号"),
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum").$D("结算事务编号"),
          fieldCode: "settleNum",
        },
        {
          fieldName: this.$T("sfin.purchaseBillConfirm.model.purchaseBillConfirm.sourceSettleNum").$D("结算事务来源编号｜行号"),
          fieldCode: "sourceSettleNumAndLineNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.itemCode").$D("结算商品编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.itemName").$D("结算商品名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.common.sourceSettleNum").$D("开票结算单号"),
          fieldCode: "sourceSettleHeaderNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.common.paymentAmount").$D("本次付款金额"),
          fieldCode: "paymentAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.common.applyAmount").$D("本次预付款核销金额"),
          fieldCode: "applyAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmounts").$D("已开票含税金额"),
          fieldCode: "invoicedAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.paidAmount").$D("已付款金额"),
          fieldCode: "paidAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.button.prePaymentWriteOff").$D("预付款核销"),
          fieldCode:"virPrePaymentWriteOff",
          render: () => <a style="color: blue" >{this.$T(
            "ssta.invoiceSheet.view.button.detailview"
          ).$D("查看详情")}</a>,
          callBack: (val) => {
            this.isMultiPrePayment = false;
            this.getTransactionDetailList(val.settleLineId);
          },
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.adjustNetAmount").$D("尾差不含税调整金额"),
          fieldCode: "adjustNetAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.adjustTaxAmount").$D("尾差税额调整金额"),
          fieldCode: "adjustTaxAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },

      ];

      return columns;
    },
    // 主策略信息
    getMainStrategyInfoColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.mainSettleStrategyNum").$D("主结算策略编码"),
          fieldCode: "settleConfigNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.configVersionNumber").$D("主结算策略版本号"),
          fieldCode: "configVersionNumber",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.confirmCollaborativeMode").$D("协同模式-确认"),
          fieldCode: "confirmCollaborativeModeMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.cancelCollaborativeMode").$D("协同模式-取消"),
          fieldCode: "cancelCollaborativeModeMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.confirmApproveMethod").$D("审批方式-确认"),
          fieldCode: "confirmApproveMethodMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.cancelApproveMethod").$D("审批方式-取消"),
          fieldCode: "cancelApproveMethodMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoiceMatch").$D("发票匹配规则"),
          fieldCode: "invoiceMatchMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.taxAmountTol").$D("税额允差范围"),
          fieldCode: "taxAmountTol",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.taxIncludedAmountTol").$D("含税金额允差范围"),
          fieldCode: "taxIncludedAmount",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.autoTaxAmountTol").$D("自动调整税额允差范围"),
          fieldCode: "taxAmountAdjustTol;",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.autoTaxIncludedAmountTol").$D("自动调整含税金额允差范围"),
          fieldCode: "amountAdjustTol;",
        },
      ];

      return columns;
    },
    // 主策略信息详情
    getMainStrategyInfoDetailColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.mainSettleStrategyNum").$D("主结算策略编码"),
          fieldCode: "settleConfigNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.mainSettleStrategyName").$D("主结算策略名称"),
          fieldCode: "settleConfigName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.configVersionNumber").$D("主结算策略版本号"),
          fieldCode: "configVersionNumber",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.confirmCollaborativeMode").$D("协同模式-确认"),
          fieldCode: "confirmCollaborativeModeMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.cancelCollaborativeMode").$D("协同模式-取消"),
          fieldCode: "cancelCollaborativeModeMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.confirmApproveMethod").$D("审批方式-确认"),
          fieldCode: "confirmApproveMethodMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.cancelApproveMethod").$D("审批方式-取消"),
          fieldCode: "cancelApproveMethodMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.invoiceMatch").$D("发票匹配规则"),
          fieldCode: "invoiceMatchMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.taxAmountTol").$D("税额允差范围"),
          fieldCode: "taxAmountTol",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.taxIncludedAmountTol").$D("含税金额允差范围"),
          fieldCode: "taxIncludedAmount",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.autoTaxAmountTol").$D("自动调整税额允差范围"),
          fieldCode: "taxAmountAdjustTol;",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.autoTaxIncludedAmountTol").$D("自动调整含税金额允差范围"),
          fieldCode: "amountAdjustTol;",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle..validateLevel").$D("尾差校验等级"),
          fieldCode: "amountValidateLevelMeaning;",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.validateAction").$D("尾差校验节点"),
          fieldCode: "amountValidateActionMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.adjustMode").$D("尾差分摊模式"),
          fieldCode: "amountAdjustModeMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.adjustRule").$D("尾差分摊规则"),
          fieldCode: "amountAdjustRuleMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.defaultPaymentDimensionMeaning").$D("付款维度【默认】"),
          fieldCode: "defaultPaymentDimensionMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.defaultPaymentSpliteRule").$D("付款自动拆分规则【默认】"),
          fieldCode: "defaultPaymentSpliteRuleMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.defaultPrepaymentSpliteRule").$D("预付款核销自动拆分规则【默认】"),
          fieldCode: "defaultPrepaymentSpliteRuleMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.lineLimitQuantity").$D("结算单行数限制"),
          fieldCode: "lineLimitQuantity",
          render: (val) => val ?
            val :
            this.$T("ssta.purchaseSettle.model.purchaseSettle.noLimit").$D(
              "无限制"
            ),
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.prepaymentDimension").$D("预付款核销维度"),
          fieldCode: "prepaymentDimensionMeaning",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.prepaymentCheckLevel").$D("预付款核销校验等级"),
          fieldCode: "prepaymentCheckLevel",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.prepaymentCheckPoint").$D("预付款核销校验节点"),
          fieldCode: "prepaymentCheckPoint",
          render: () =>
            <div>{
              this.checkPointList.map((v) => v === this.checkPointList[this.checkPointList.length - 1] ? <span>{v}</span> : <span>{v}/</span>)}
            </div>
          ,
        },
      ];

      return columns;
    },
    // 其他
    getOtherInfosColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.approvedRemark").$D("审批意见-确认"),
          fieldCode: "approvedRemark",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.canceledRemark").$D("审批意见-取消"),
          fieldCode: "canceledRemark",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.supplierManage.termName").$D("付款条件"),
          fieldCode: "termCode",
        },
        {
          fieldName: this.$T("ssta.costSheet.model.costSheet.remark").$D("备注"),
          fieldCode: "remark",
        },
      ];

      return columns;
    },
    // 其他信息详情
    getOtherInfosDetailColums() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.approvedRemark").$D("审批意见-确认"),
          fieldCode: "approvedRemark",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.canceledRemark").$D("审批意见-取消"),
          fieldCode: "canceledRemark",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.supplierManage.termName").$D("付款条件"),
          fieldCode: "termCode",
        },
        {
          fieldName: this.$T("ssta.costSheet.model.costSheet.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.accountingDate").$D("记账日期"),
          fieldCode: "accountingDate",
          required: 1,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.supplySettle.invOrganizationName").$D("库存组织"),
          fieldCode: "invOrganizationName",
        },
      ];

      return columns;
    },
    //付款信息详情页Columns
    getPaymentInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.bankId").$D("收款银行"),
          fieldType: "TEXT",
          fieldCode: "bankName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.bankBranchName").$D("收款开户行"),
          fieldType: "TEXT",
          fieldCode: "bankBranchName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.bankAccountNum").$D("收款银行账号"),
          fieldType: "TEXT",
          fieldCode: "bankAccountNum",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.bankAccountName").$D("银行账户名称"),
          fieldType: "TEXT",
          fieldCode: "bankAccountName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.paymentMethod").$D("付款方式"),
          fieldType: "TEXT",
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.model.purchaseSettle.termCode").$D("付款条件"),
          fieldType: "TEXT",
          fieldCode: "paymentTermName",
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.paymentDiscountAmount").$D("付款折扣金额"),
          fieldType: "TEXT",
          fieldCode: "paymentDiscountAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldName: this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.expectPaymentDate").$D("期望付款日期"),
          fieldType: "TEXT",
          fieldCode: "expectPaymentDate",
        },
      ];

      return columns;
    },
  },
  mounted() {
    this.approvalId = this.$route.query.taskId;
    this.getApprovalItem();
    this.getApprovalForm();
    this.getTransactionInfoList();
    this.$emit(
      "GetApprovalTitle",
      this.$T("sfin.payment.common.payApprove").$D("付款申请审批")
    );
  },
  methods: {
    //跳到详情页
    goDetail(columns, infos, popCustomizeCode, title) {
      this.getPopInfoColumns = columns;
      this.detailInfo = infos;
      this.getPrePaymentCheckLevel(this.detailInfo.prepaymentCheckLevel);
      this.getPrePaymentCheckPoint(this.detailInfo.prepaymentCheckPoint);
      this.headTitle = title;
      this.popCustomizeCode = popCustomizeCode;
      this.srmDetailPop = !this.srmDetailPop;
    },
    // 获取审批事项数据
    async getApprovalItem() {
      await getApprovalItemApi(this.approvalId).then((res) => {
        this.approveItemInfo = res;
      });
    },
    // 获取审批表单数据
    async getApprovalForm() {
      await getApprovalFormApi(this.changeReqId).then((res) => {
        this.approvalFormInfo = res;
      });
    },
    // 获取交易明细列表数据
    async getTransactionInfoList() {
      await getTransactionInfoListApi(this.changeReqId).then((res) => {
        this.transactionInfoList = res.content;
      });
    },
    // 获取多维付款列表数据
    async getMultiPaymentList(e) {
      e.stopPropagation();
      await getMultiPaymentListApi(this.changeReqId).then((res) => {
        this.multiPaymentInfoList = res;
        this.multiPaymentVisible = !this.multiPaymentVisible;
      });
    },
    // 获取多维付款列表下的预付款核销数据
    getMultiPrePaymentList(info) {
      this.isMultiPrePayment = true;
      this.prePaymentInfoList = info;
      this.prePaymentVisible = !this.prePaymentVisible;
    },
    // 获取预付款核销列表数据
    async getPrePaymentList() {
      await getPrePaymentListApi(this.changeReqId).then((res) => {
        this.prePaymentInfoList = res.content;
        this.prePaymentVisible = !this.prePaymentVisible;
      });
    },
    // 获取预付款核销校验等级
    async getPrePaymentCheckLevel(checkCode) {
      await getPrePaymentCheckLevelApi().then((res) => {
        // eslint-disable-next-line no-unused-vars
        for (let item of res) {
          if (checkCode === item.value) {
            this.checkLevel = item.meaning;
          }
        }
      });
    },
    // 获取预付款核销校验节点
    async getPrePaymentCheckPoint(checkPoint) {
      let checkPointList = checkPoint ? checkPoint.split(",") : [];

      await getPrePaymentCheckPointApi().then((res) => {
        // eslint-disable-next-line no-unused-vars
        for (let point of checkPointList) {
          // eslint-disable-next-line no-unused-vars
          for (let item of res) {
            if (point === item.value) {
              if (!this.checkPointList.includes(point)) {
                this.checkPointList.push(item.meaning);
              }
            }
          }
        }
      });
    },
    //获取交易明细的单条预付款核销信息
    async getTransactionDetailList(settleLineId) {
      await getTransactionDetailListApi(this.changeReqId, settleLineId).then(
        (res) => {
          this.prePaymentInfoList = res.content;
          this.prePaymentVisible = !this.prePaymentVisible;
        }
      );
    },
    //付款信息维护
    getPaymentInfoSafeGuard(e) {
      e.stopPropagation();
      this.getPopInfoColumns = this.getPaymentInfoColumns;
      this.popCustomizeCode = "SMBL.WORKFLOW.PAYMENT_APPROVE_PAYMENT_INFO_DETAIL";
      this.detailInfo = this.approvalFormInfo;
      this.srmDetailPop = !this.srmDetailPop;
    }
  },
};
</script>

<style lang="stylus" scoped>
>>> .customize-detail .form-item .value {
  justify-content: start;
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

.payment {
  box-sizing: border-box;
  padding: 0 15px;

  .card {
    box-sizing: border-box;
    padding: 16px 0;

    .mult-payment-title {
      display: flex;
      justify-content: space-between;

      .documentNum {
        font-size: 16px;
        font-family: Alibaba, Alibaba-PuHuiTi;
        font-weight: PuHuiTi;
        color: #333333;
      }

      .pre-pay-title {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #276ef1;
      }

      .arrow {
        vertical-align: middle;
      }
    }

    .pre-payment-title {
      display: flex;
      justify-content: flex-start;

      .documentNum {
        margin-left: 8px;
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

  .settle {
    display: flex;
    justify-content: space-between;
  }

  .settle-status {
    font-size: 14px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    color: #276ef1;
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
