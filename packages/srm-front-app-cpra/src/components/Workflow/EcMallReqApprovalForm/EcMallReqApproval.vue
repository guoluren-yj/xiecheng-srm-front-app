<template>
  <section v-if="headInfo">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        class="tab-container"
        :label="
          $T('sprm.purchaseRequisitionInquiry.view.title.orderHeaderInfo').$D(
            '采购申请头信息'
          )
        ">
        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
          <span>{{
            $T("hipspfm.workFlow.view.message.noApplicationHeader").$D(
              "暂无申请头信息"
            )
          }}</span>
        </div>
        <srm-list
          v-else
          :data-set="ecHeadInfoDS"
          customize-code="SMBL.WORKFLOW.ECMALLREQ_APPROVAL_HEAD_INFO"
          :columns="columns()"
          :scrollable="false"
          @itemClick="showDetailPop(-1)"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        class="tab-container"
        :label="
          $T('sprm.purchaseRequisitionInquiry.view.title.deliveryInfo').$D(
            '收货/收单信息'
          )
        ">
        <srm-list
          :data-set="deliveryInfoDS"
          :scrollable="false"
          customize-code="SMBL.WORKFLOW.SMBL.WORKFLOW.ECMALLREQ_APPROVAL_DELIVERY_INFO"
          :columns="getDeliveryInfoDSColumns()"
          @itemClick="showDetailPop(-2)" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        class="tab-container"
        :label="$T('sprm.purchaseRequisitionInquiry.view.title.billingInfo').$D('开票信息')">
        <srm-list
          :data-set="supplyInfoDS"
          :scrollable="false"
          :columns="getSupplyInfoColumns()"
          @itemClick="showDetailPop(-3)" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        class="tab-container"
        :label="$T('sprm.purchaseRequisitionInquiry.view.title.purchaseLineInfo').$D('采购申请行信息')">
        <srm-list
          :data-set="supplyCategoryDS"
          :scrollable="false"
          customize-code="SMBL.WORKFLOW.ECMALLREQ_APPROVAL_LINE_INFO"
          :columns="getSupplyCategoryColumns()"
          @itemClick="showDetailPop"/>
      </srm-scroll-tab-item>
   </srm-scroll-tab>

    <srm-detail-pop :visible.sync="detailPop" :data-source="dataSource" :pop-customize-code="popCustomizeCode" :columns="detailColumns" />

    <!-- billDetailPop -->
    <srm-popup :visible="billDetailPop" width="100%" height="100%" :title="$T('sprm.common.model.common.executionBillDetail').$D('执行单据详情')"
               @onClose="billDetailPop = false" >
      <srm-list
        v-if="billDetailPop"
        :data-set="billDetaulDS"
        customize-code="SMBL.WORKFLOW.ECMALLREQ_APPROVAL_LINE_INFO"
        :columns="getBillDetailColumns"/>
    </srm-popup>
  </section>
</template>

<script>
import { SrmUtil, DataSet } from "srm-mobile-ui";
import { Popup, NavBar } from "hips";
import { getEcOrderHeadApi } from "./api";
import ecHeadInfoDS from "./datasource/EcHeadInfoDS";
import supplyInfoDS from "./datasource/SupplyInfoDS";
import deliveryInfoDS from "./datasource/DeliveryInfoDS";
import supplyCategoryDS from "./datasource/SupplyCategoryDS";
import billDetaulDS from "./datasource/BillDetaulDS";
import SrmDetailPop from "./components/SrmDetailPop";
import uuid from "uuid";
import CuxMethods from "../CUX/EcMallReqApprovalForm/mixin";

export default {
  modules: [ "hipspfm.common", "hzero.common", "sprm.purchaseRequisitionInquiry", "sprm.common", "hipspfm.workFlow", "sprm.purchaseReqInquiry", "smbl.common" ],
  name: "EcMallReqApproval",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    // eslint-disable-next-line vue/no-unused-components
    SrmDetailPop,
  },
  extends: CuxMethods,
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    showFilePop: {
      type: Function,
    },
    topHeight: {
      type: String | Number,
      default: 0,
    }
  },
  data() {
    return {
      activeKey: 0,
      headInfo: {},
      lineInfo:[],
      ecHeadInfoDS: new DataSet(ecHeadInfoDS(this)),
      supplyInfoDS: new DataSet(supplyInfoDS()),
      deliveryInfoDS: new DataSet(deliveryInfoDS()),
      supplyCategoryDS: new DataSet(supplyCategoryDS(this)),
      billDetaulDS: new DataSet(billDetaulDS(this)),
      scroll: "",
      navIndex: 0,
      contentLenArr: [],
      lengthArr: [],
      uuid:uuid(),
      detailPop:false,
      popCustomizeCode:" ",
      detailColumns:[],
      dataSource:{},
      billDetailPop:false
    };
  },
  computed: {
    columns() {
      return () => [ {
        fieldCode: "title",
        fieldType: "EMPTY",
        formRow: 1,
        render: (val, item) =>
          <SrmListHeader>
            <span class="list-head">{item.title || "-"}</span>
          </SrmListHeader>
        ,
      },
      {
        fieldCode: "displayPrNum",
        fieldName: this.$T("sprm.common.displayPrNum").$D("采购申请编号"),
      },
      {
        fieldCode: "prTypeName",
        fieldName: this.$T("sprm.common.model.common.sqType").$D("申请类型"),
      },
      {
        fieldCode: "amount",
        fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
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
      },
      {
        fieldCode: "createByName",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "purchaseAgentName",
        fieldName: this.$T("sprm.common.model.purchaserName").$D("采购员"),
      },
      {
        fieldCode: "companyName",
        fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "ouName",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
      },
      {
        fieldCode: "purchaseOrgName",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
      },
      {
        fieldCode: "prSourcePlatformMeaning",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
      },
      {
        fieldCode: "paymentMethodName",
        fieldName: this.$T("sprm.common.model.common.paymentMethodCode").$D("支付方式"),
      },
      {
        fieldCode: "creationDate",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
      },
      {
        fieldCode: "lotNum",
        fieldName: this.$T("sprm.common.model.common.lotNum").$D("批次号"),
      },
      {
        fieldCode: "prRequestedName",
        fieldName: this.$T("sprm.common.model.common.applicant").$D("申请人"),
        render: (val, item) => item.prRequestedNum && val ? `${item.prRequestedNum || ""}-${val}` : "-",
      },
      {
        fieldCode: "requestDate",
        fieldName: this.$T("sprm.common.model.common.requestDate").$D("申请日期"),
        render: (val) => SrmUtil.dateFormat(val),
      },
      {
        fieldCode: "originalCurrency",
        fieldName: this.$T("sprm.common.model.common.originalCurrency").$D("原币币种"),
      },
      {
        fieldCode: "remark",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
      }, ];
    },
    getHeadDetailColumns() {
      return [ {
        fieldCode: "title",
        fieldName: this.$T("sprm.common.model.common.title").$D("标题"),
      },
      {
        fieldCode: "displayPrNum",
        fieldName: this.$T("sprm.common.displayPrNum").$D("采购申请编号"),
      },
      {
        fieldCode: "prTypeName",
        fieldName: this.$T("sprm.common.model.common.sqType").$D("申请类型"),
      },
      {
        fieldCode: "amount",
        fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
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
      },
      {
        fieldCode: "createByName",
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "purchaseAgentName",
        fieldName: this.$T("sprm.common.model.purchaserName").$D("采购员"),
      },
      {
        fieldCode: "companyName",
        fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "ouName",
        fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
      },
      {
        fieldCode: "purchaseOrgName",
        fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
      },
      {
        fieldCode: "prSourcePlatformMeaning",
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
      },
      {
        fieldCode: "paymentMethodName",
        fieldName: this.$T("sprm.common.model.common.paymentMethodCode").$D("支付方式"),
      },
      {
        fieldCode: "creationDate",
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
      },
      {
        fieldCode: "lotNum",
        fieldName: this.$T("sprm.common.model.common.lotNum").$D("批次号"),
      },
      {
        fieldCode: "prRequestedName",
        fieldName: this.$T("sprm.common.model.common.applicant").$D("申请人"),
        render: (val, item) => item.prRequestedNum && val ? `${item.prRequestedNum || ""}-${val}` : "-",
      },
      {
        fieldCode: "requestDate",
        fieldName: this.$T("sprm.common.model.common.requestDate").$D("申请日期"),
      },
      {
        fieldCode: "originalCurrency",
        fieldName: this.$T("sprm.common.model.common.originalCurrency").$D("原币币种"),
      },
      {
        fieldCode: "remark",
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
      }, ];
    },
    getDeliveryDetailColumns() {
      return [
        {
          fieldName: this.$T("sprm.common.model.common.invoiceAddress").$D("收单方地址"),
          fieldCode: "invoiceAddressName",
        },
        {
          fieldName: this.$T("sprm.common.model.receiveContactName").$D("收货联系人"),
          fieldCode: "receiverContactName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
          fieldCode: "receiverTelNum",
          render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
        },
        {
          fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
          fieldCode: "receiverAddressName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
          fieldCode: "invoiceContactName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
          fieldCode: "invoiceTelNum",
          render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
        },
        {
          fieldName: this.$T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
          fieldCode: "purchaseUnitName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
          fieldCode: "receiverEmailAddress",
        },
      ];
    },
    getInvoiceDetailColumns() {
      return [
        {
          fieldName: this.$T("sprm.common.model.common.invoiceTitle").$D("发票抬头"),
          fieldCode: "invoiceTitle",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterNum").$D("税务登记号"),
          fieldCode: "taxRegisterNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterAddress").$D("税务登记地址"),
          fieldCode: "taxRegisterAddress",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterTel").$D("公司电话"),
          fieldCode: "taxRegisterTel",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterBank").$D("开户行"),
          fieldCode: "taxRegisterBank",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterBankAccount").$D("开户行账号"),
          fieldCode: "taxRegisterBankAccount",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceMethodCode").$D("开票方式"),
          fieldCode: "invoiceMethodName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceTypeCode").$D("发票形式"),
          fieldCode: "invoiceTypeName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
          fieldCode: "invoiceTitleTypeName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
          fieldCode: "invoiceDetailTypeName",
          fieldType: "TEXT",
        },
      ];
    },
    getLineDetailColumns() {
      return [
        {
          fieldName: this.$T("sprm.common.model.common.statusCode").$D("状态"),
          fieldCode: "prLineStatusCodeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.productName").$D("商品名称"),
          fieldCode: "productName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.productNum").$D("商品编码"),
          fieldCode: "productNum",
          fieldType: "TEXT",
          labelCode: "sprm.common.model.common.productNum",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invOrganizationId").$D("库存组织"),
          fieldCode: "invOrganizationName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.catalogName").$D("商品目录"),
          fieldCode: "catalogName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.categoryName").$D("物料分类"),
          fieldCode: "categoryName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.lineNumber").$D("行号"),
          fieldCode: "displayLineNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.uomName").$D("单位"),
          fieldCode: "uomCodeAndName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxType").$D("税种"),
          fieldCode: "taxCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.includingTaxAndFreightPrice").$D("预估单价（含税含运费）"),
          fieldCode: "taxIncludedUnitPrice",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.localFinancialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedUnitPriceMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxExcludedFreightPrice").$D("预估单价（含税不含运费）"),
          fieldCode: "taxWithoutFreightPrice",
          fieldType: "INPUT_NUMBER",
          precision: (val, item) => {
            // 只有SRM类型单据做金额精度控制
            if (item.prSourcePlatform === "SRM") {
              return this.$options.filters.calcCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision");
            }
            return null;
          },
          editor: false,
        },
        {
          fieldName: this.$T("sprm.common.model.common.unitPriceBatch").$D("每"),
          fieldCode: "unitPriceBatch",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.linePrice").$D("行金额"),
          fieldCode: "taxIncludedLineAmount",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedLineAmountMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.lineFreight").$D("行运费"),
          fieldCode: "lineFreight",
          render: (val, item) => {
            if (item.linePriceHiddenFlag === 1) {
              return item.lineFreightMeaning;
            }
            return val === 0 ? 0 : val || "-";
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.currencyCode").$D("币种"),
          fieldCode: "currencyCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.budgetIoFlag").$D("预算外标识"),
          fieldCode: "budgetIoFlag",
          fieldType: "TEXT",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxIncludedBudgetUnitPrice").$D("预算单价(含税)"),
          fieldCode: "taxIncludedBudgetUnitPrice",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedBudgetUnitPriceMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.budgetAccountName").$D("预算科目"),
          fieldCode: "budgetAccountName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.neededDate").$D("需求日期"),
          fieldCode: "neededDate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.jdPrice").$D("划线价"),
          fieldCode: "jdPrice",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.costCenter").$D("成本中心"),
          fieldCode: "costName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.projectCategory").$D("项目类别"),
          fieldCode: "projectCategory",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.sumProject").$D("总账科目"),
          fieldCode: "accountSubjectName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.wbs").$D("WBS元素"),
          fieldCode: "wbs",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.ouName").$D("业务实体"),
          fieldCode: "ouName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
          fieldCode: "purchaseOrgName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.purchaserName").$D("采购员"),
          fieldCode: "agentName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.supplierName").$D("供应商"),
          fieldCode: "supplierName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.xyNum").$D("协议编号"),
          fieldCode: "pcNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.prRequestedName").$D("申请人"),
          fieldCode: "prRequestedName",
          fieldType: "TEXT",
          render: (val, item) => item.prRequestedNum && val ? `${item.prRequestedNum || ""}-${val}` : "-",
        },
        {
          fieldName: this.$T("sprm.common.model.common.moneyPayPart").$D("费用承担部门"),
          fieldCode: "expBearDep",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.handleStatus").$D("执行状态"),
          fieldCode: "executionStatusMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.executionBillNum").$D("执行单据编号"),
          fieldCode: "displayExecutionBillNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.handlePerson").$D("需求执行人"),
          fieldCode: "executorName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
          fieldCode: "executionBillDetail",
          fieldType: "TEXT",
          render:() => <span style="color: var(--color-other-default-b)">{this.$T("hzero.common.button.details").$D("查看详情") }</span>,
          callBack:async (record) => {
            this.$loading.show();
            this.billDetaulDS.setQueryParameter({
              prLineId: record.prLineId
            });
            await this.billDetaulDS.query();
            this.billDetailPop = true;
            this.$loading.hide();
          }
        },
        {
          fieldName: this.$T("sprm.common.model.common.assignedDate").$D("分配日期"),
          fieldCode: "assignedDate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.purchaseRequisitionInquiry.model.common.infoRecord").$D("信息记录"),
          fieldCode: "infoRecord",
          labelCode: "sprm.purchaseRequisitionInquiry.model.common.infoRecord",
        },
        {
          fieldName: this.$T("sprm.purchaseRequisitionInquiry.model.common.lastPurPrice").$D("上次采购单价"),
          fieldCode: "lastPurPrice",
          fieldType: "INPUT_NUMBER",
          precision: (val, item) => {
            // 只有SRM类型单据做金额精度控制
            if (item.prSourcePlatform === "SRM") {
              return this.$options.filters.calcCurrencyPrecision(item.currencyCode, "defaultPrecision");
            }
            return null;
          },
          editor: false,
        },
        {
          fieldName: this.$T("sprm.purchaseRequisitionInquiry.model.common.historicalSheet").$D("历史询价单"),
          fieldCode: "historicalInquirySheet",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.suspendRemark").$D("暂挂原因"),
          fieldCode: "suspendRemark",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.closedRemark").$D("关闭原因"),
          fieldCode: "closedRemark",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemModel").$D("型号"),
          fieldCode: "itemModel",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemSpecs").$D("规格"),
          fieldCode: "itemSpecs",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.enclosure").$D("附件"),
          fieldCode: "enclosure",
          fieldType: "TEXT",
          render:() => <span style="color: var(--color-other-default-b)">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件") }</span>,
          callBack:(record, val) => {
            let UUid = "";
            !record.enclosure ? UUid = this.uuid : UUid = val;
            this.showFilePop(UUid);
          }
        },
      ];
    },
    getBillDetailColumns() {
      return [
        {
          fieldCode: "displayPrNum",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              <span class="list-head">{this.$T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.prNum").$D("单据编号")}：{item.displayPrNum}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sprm.common.model.common.lineNumber").$D("行号"),
          fieldCode: "lineNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.executeBillType").$D("执行单据类型"),
          fieldCode: "executeBillTypeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.executionBillNum").$D("执行单据编号"),
          fieldCode: "executionBillNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.executionBillLineNum").$D("执行单据行号"),
          fieldCode: "executionBillLineNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.executeQuantity").$D("有效数量"),
          fieldCode: "executeQuantity",
          fieldType: "INPUT_NUMBER",
          editor:false,
        },
        {
          fieldName: this.$T("sprm.common.model.supplierName").$D("供应商"),
          fieldCode: "supplier",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.billStatus").$D("状态"),
          fieldCode: "billStatus",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.neededDate").$D("需求日期"),
          fieldCode: "neededDate",
          fieldType: "TEXT",
        },
      ];
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getEcOrderHead();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T(
        "sprm.purchaseRequisitionInquiry.view.title.ErequirementDetail"
      ).$D("电商商城需求明细")
    );
  },
  methods: {
    getDeliveryInfoDSColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) =>
            <SrmListHeader>
              <span class="list-head">{this.$T("sprm.common.model.common.invoiceAddress").$D("收单方地址")}：{item.invoiceAddressName}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sprm.common.model.receiveContactName").$D("收货联系人"),
          fieldCode: "receiverContactName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
          render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
          fieldCode: "receiverTelNum",
        },
        {
          fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
          fieldCode: "receiverAddressName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
          fieldCode: "invoiceContactName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
          fieldCode: "invoiceTelNum",
          render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
        },
        {
          fieldName: this.$T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
          fieldCode: "purchaseUnitName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
          fieldCode: "receiverEmailAddress",
        },
      ];
    },
    getSupplyInfoColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) =>
            <SrmListHeader>
              <span class="list-head">{item.invoiceTitle}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterNum").$D("税务登记号"),
          fieldCode: "taxRegisterNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterAddress").$D("税务登记地址"),
          fieldCode: "taxRegisterAddress",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterTel").$D("公司电话"),
          fieldCode: "taxRegisterTel",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterBank").$D("开户行"),
          fieldCode: "taxRegisterBank",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRegisterBankAccount").$D("开户行账号"),
          fieldCode: "taxRegisterBankAccount",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceMethodCode").$D("开票方式"),
          fieldCode: "invoiceMethodName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceTypeCode").$D("发票形式"),
          fieldCode: "invoiceTypeName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
          fieldCode: "invoiceTitleTypeName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
          fieldCode: "invoiceDetailTypeName",
          fieldType: "TEXT",
        },
      ];
    },
    getSupplyCategoryColumns() {
      let cuxBasicInfoDetail = [];
      const currentTenant = SrmUtil.getTenantNum();
      // 标准二开埋点
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
      return [
        {
          fieldCode: "categoryDescription",
          formRow: 1,
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              <span class="list-head">{item.productName}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sprm.common.model.common.productNum").$D("商品编码"),
          fieldCode: "productNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.invOrganizationId").$D("库存组织"),
          fieldCode: "invOrganizationName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.catalogName").$D("商品目录"),
          fieldCode: "catalogName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.lineNumber").$D("行号"),
          fieldCode: "displayLineNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.uomName").$D("单位"),
          fieldCode: "uomCodeAndName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxType").$D("税种"),
          fieldCode: "taxCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.includingTaxAndFreightPrice").$D("预估单价（含税含运费）"),
          fieldCode: "taxIncludedUnitPrice",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedUnitPriceMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxExcludedFreightPrice").$D("预估单价（含税不含运费）"),
          fieldCode: "taxWithoutFreightPrice",
          fieldType: "INPUT_NUMBER",
          precision: (val, item) => {
            // 只有SRM类型单据做金额精度控制
            if (item.prSourcePlatform === "SRM") {
              return this.$options.filters.calcCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision");
            }
            return null;
          },
          editor: false,
        },
        {
          fieldName: this.$T("sprm.common.model.common.linePrice").$D("行金额"),
          fieldCode: "taxIncludedLineAmount",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedLineAmountMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.lineFreight").$D("行运费"),
          fieldCode: "lineFreight",
          render: (val, item) => {
            if (item.linePriceHiddenFlag === 1) {
              return item.lineFreightMeaning;
            }
            return val === 0 ? 0 : val || "-";
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sprm.common.model.common.budgetIoFlag").$D("预算外标识"),
          fieldCode: "budgetIoFlag",
          fieldType: "TEXT",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sprm.common.model.common.enclosure").$D("附件"),
          fieldCode: "enclosure",
          fieldType: "TEXT",
        },
      ].concat(currentTenant === "SRM-XXJT" ? cuxBasicInfoDetail : []);
    },
    showDetailPop(index, key) {
      this.detailPop = true;
      switch (index) {
      case -1:
        this.detailColumns = this.getHeadDetailColumns;
        this.popCustomizeCode = "SMBL.WORKFLOW.ECMALLREQ_APPROVAL_HEAD_INFO";
        this.dataSource = this.headInfo;
        break;
      case -2:
        this.detailColumns = this.getDeliveryDetailColumns;
        this.popCustomizeCode = "SMBL.WORKFLOW.SMBL.WORKFLOW.ECMALLREQ_APPROVAL_DELIVERY_INFO";
        this.dataSource = this.headInfo;
        break;
      case -3:
        this.detailColumns = this.getInvoiceDetailColumns;
        this.popCustomizeCode = "";
        this.dataSource = this.headInfo;
        break;
      default:
        this.detailColumns = this.getLineDetailColumns;
        this.popCustomizeCode = "SMBL.WORKFLOW.ECMALLREQ_APPROVAL_LINE_DETAIL";
        this.dataSource = this.supplyCategoryDS.toData()[key];
        break;
      }
    },
    // 获取申请头信息
    async getEcOrderHead() {
      await getEcOrderHeadApi(this.changeReqId, {
        customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.HEADER",
      }).then((res) => {
        this.ecHeadInfoDS.setData([ res ] || []);
        this.supplyInfoDS.setData([ res ] || []);
        this.deliveryInfoDS.setData([ res ] || []);
        this.supplyCategoryDS.setQueryParameter({
          prSourcePlatformCode: res.prSourcePlatform ? res.prSourcePlatform : 1,
          customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.LINE_ECOMMERCE"
        });
        this.supplyCategoryDS.query();
        this.headInfo = res;
        let attachmentUuid = res.attachmentUuid || uuid();

        this.$emit("GetAttachmentUuid", attachmentUuid);
      });
    },
    beforeRouteLeave(to, from, next) {
      if (this.billDetailPop) {
        this.billDetailPop = false;
        next(false);
        return false;
      }
      next();
    }
  },
};
</script>

<style lang="stylus" scoped>
.tab-container{
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 50px;
  >>> .srm-list-item-card-head-left{
    margin-left 0
  }
  .list-head{
    width 345px;
    font-size: 14px;
    text-align: left;
    color: #333333;
    line-height: 20px;
    display block;
    white-space nowrap;
    overflow hidden;
    text-overflow ellipsis;
  }
}

.tab-container::-webkit-scrollbar {
  display: none;
}
</style>
