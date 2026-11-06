<template>
  <div style="height: 100vh; overflow: auto">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip">
            <srm-upload
              :is-tab="true"
              :show-icon="false"
              :show-count="false"
              color="blue"
              :file-arr="fileArr"
              :desc-title="
                $T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件')
              "/>
          </srm-button>
          <srm-button
            size="small"
            type="warn"
            icon="icon-clock"
            @click="showOperationPop">
            <span>{{
              $T("hipspfm.common.message.title.operationRecord").$D("操作记录")
            }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-scroll-tab class="content" content-scroll @tabChange="onBottom">
        <srm-scroll-tab-item :label="getInvoiceHeaderTitle(headInfo)">
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{
              $T(
                "hipspfm.invoiceBill.view.message.NoNonConsignmentInvoiceHeader"
              ).$D("暂无非寄售发票头信息")
            }}</span>
          </div>
          <customize
            v-else
            ref="customize"
            :need-padding="true"
            :data-source="headInfo"
            code="SMBL.CREATE.RECEIVEABLE.INVOICE.HEAD_INFO"
            :columns="getOrderHeadInfoColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="
            $T('hipspfm.invoiceBill.view.title.validation.basicInformation').$D(
              '基本信息'
            )
          ">
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{
              $T(
                "hipspfm.invoiceBill.view.message.validation.NoBasicInformation"
              ).$D("暂无基本信息")
            }}</span>
          </div>
          <customize
            v-else
            :need-padding="true"
            :data-source="headInfo"
            code="SMBL.CREATE.RECEIVEABLE.INVOICE.BASIC_INFO"
            :columns="getOrderBasicInfoColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="
            $T('sfin.invoiceBill.model.invoiceBill.invoiceLineNum').$D('发票行')
          ">
          <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
            <span>{{
              $T(
                "hipspfm.invoiceBill.view.message.validation.NoInvoiceLineNum"
              ).$D("暂无发票行信息")
            }}</span>
          </div>
          <div
            v-for="(item, index) in lineInfo"
            v-else
            :key="index"
            @click="showLineInfoDetail(item)">
            <customize
              :need-padding="true"
              :data-source="item"
              code="SMBL.CREATE.RECEIVEABLE.INVOICE.LINE_INVOICE_INFO"
              :columns="getOrderLineInfoColumns"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :show-title="false"
          :label="$T('sfin.invoiceBill.view.taxInvoiceRow').$D('税务发票行')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("sfin.invoiceBill.view.taxInvoiceRow").$D("税务发票行") }}
            <span
              v-if="taxInfo.length != 0"
              class="all-check"
              @click="taxLineCheck">{{
                $T("hispfm.createInvoice.view.message.allCheck").$D("全部查验")
              }}</span>
            <span
              v-else
              class="all-check"
              style="background: var(--color-bg-default-f)">{{
                $T("hispfm.createInvoice.view.message.allCheck").$D("全部查验")
              }}</span>
          </div>
          <div v-if="taxInfo.length === 0" class="noContent">
            <span>{{
              $T(
                "hipspfm.invoiceBill.view.message.validation.NoTaxInvoiceRow"
              ).$D("暂无税务发票行信息")
            }}</span>
          </div>
          <div v-for="(item, index) in taxInfo" v-else :key="index">
            <customize
              :need-padding="true"
              :data-source="item"
              code="SMBL.CREATE.RECEIVEABLE.INVOICE.TAX_INVOICE_LINE_INFO"
              :columns="getTaxInvoiceRowInfoColumns"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="$T('sfin.invoiceBill.view.inf').$D('总账科目')">
          <div v-if="JSON.stringify(ledgerAccount) == '[]'" class="noContent">
            <span>{{
              $T("hipspfm.invoiceBill.view.message.validation.NoInf").$D(
                "暂无总账科目信息"
              )
            }}</span>
          </div>
          <div v-for="(item, index) in ledgerAccount" v-else :key="index">
            <customize
              :need-padding="true"
              :data-source="item"
              code="SMBL.CREATE.RECEIVEABLE.INVOICE.LEDGER_ACCOUNT_LINE_INFO"
              :columns="getLedgerAccountInfoColumns"/>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup
      :visible.sync="visible"
      height="100%"
      position="right"
      :title="
        $T('hipspfm.invoiceBill.view.message.invoiceInformation').$D('发票信息')
      ">
      <div style="height: 100%; overflow: auto">
        <srm-detail-head
          :data-source="lineInfoDetail"
          :columns="getInvoiceDetailHeadColumns"/>
        <customize-detail
          v-if="Object.keys(lineInfoDetail).length"
          :need-padding="true"
          :data-source="lineInfoDetail"
          code="SMBL.CREATE.RECEIVEABLE.INVOICE.HEAD_INFO"
          :columns="getOrderLineDetailInfoColumns"/>
        <srm-bottom-handler :btn-arr="getInvoiceLineBtnArr" />
      </div>
    </srm-popup>
    <!-- 操作记录弹窗 -->
    <operation-record
      v-model="operationPopup"
      :operation-arr="operationArr"
      :load-refresh="getOperationRecords"
      :loading="oploading"/>
    <!-- 编辑开票日期弹窗结束 -->
    <div id="FootButton" class="invite">
      <span @click="save">{{
        $T("hipspfm.common.button.save").$D("保存")
      }}</span>
      <span @click="submit">{{
        $T("hipspfm.common.button.submit").$D("提交")
      }}</span>
      <span class="addMethods">
        <transition name="slide-fade">
          <i v-if="showAdd" @click="showAddModal"><img class="image-blue-default" src="@/assets/CreateInvoice/icon_add@3x.png"></i>
        </transition>
      </span>
    </div>
    <hips-popup
      v-model="addModal"
      class="addModal top-boder-radius"
      style="height: 40%; width: 100%"
      position="bottom">
      <li>
        <span>{{
          $T(
            "hispfm.createInvoice.validation.message.addInvoiceToTaxInvoiceRow"
          ).$D("您将新增发票至税务发票行")
        }}</span>
      </li>
      <li>
        <div @click="goManualEntry">
          <img
            class="image-yellow-default"
            src="@/assets/CreateInvoice/icon_invoice_manualEntry@3x.png"
            alt>
          <div>
            {{
              $T("hipspfm.invoiceInspection.view.message.manualEntry").$D(
                "手工录入"
              )
            }}
          </div>
        </div>
        <div @click="goScanner">
          <img
            class="image-blue-default"
            src="@/assets/CreateInvoice/icon_invoice_sweep@3x.png"
            alt>
          <div>
            {{
              $T("hipspfm.invoiceInspection.view.message.scanAdd").$D(
                "扫描添加"
              )
            }}
          </div>
        </div>
        <div @click="goOcR">
          <img
            class="image-blue-default"
            src="@/assets/CreateInvoice/icon_invoice_ocrRecognition@3x.png"
            alt>
          <div>
            {{
              $T("sfin.invoiceBill.view.button.invoiceBill.ocrDistinguish").$D(
                "OCR识别"
              )
            }}
          </div>
        </div>
      </li>
      <li @click="showAddModal">
        <img class="image-blue-default" src="@/assets/CreateInvoice/page_close@3x.png" alt >
      </li>
    </hips-popup>
  </div>
</template>

<script>
import {
  getOrderHeaderApi,
  getOrderLineApi,
  getOrderTaxApi,
  getFileUUIDApi,
  getOpRecordApi,
  batchCheckApi,
  batchRemoveApi,
  getOrderLedgerAccountApi,
} from "../api/index";
import {
  getSaveApi,
  getSubmitApi,
  getRulesApi,
  getSettingsApi,
  updateInvoiceLineApi,
} from "../api/index";
import uuid from "uuid";
import { Popup } from "hips";
import OperationRecord from "@/components/OperationRecord";
import SrmAppCore from "srm-front-app-core";
export default {
  modules: [
    "sodr.sendOrder",
    "hzero.common",
    "spuc.common",
    "sodr.confirmOrder",
    "hipspfm.common",
    "sodr.common",
    "hipspfm.orderConfirmation",
    "ssrc.inquiryHall",
    "hipspfm.invoiceBill",
    "sfin.invoiceBill",
    "sfin.common",
    "sfin.supplierChargeEntry",
    "hispfm.createInvoice",
    "hipspfm.invoiceInspection",
    "smbl.invoice",
  ],
  name: "CreateInvoiceDetail",
  components: {
    OperationRecord,
    [Popup.name]: Popup,
  },
  data() {
    return {
      headInfo: {}, // 头信息
      lineInfo: [], // 行信息
      taxInfo: [], // 税务发票行信息
      ledgerAccount: [], //
      operationPopup: false,
      lineInfoDetail: {},
      operationArr: [], //操作记录
      basePrice: "NET_PRICE",
      oploading: false,
      attachmentUUID: "",
      showAdd: false, // 添加按钮
      visible: false,
      addModal: false,
      priceRule: {
        taxUpdFlag: 0,
        taxAmountUpdFlag: 0,
        quantityUpdFlag: 0,
        priceUpdFlag: 0,
        taxAmountTolerance: 0,
      },
    };
  },
  computed: {
    getInvoiceHeaderTitle() {
      return (headInfo) => {
        if (headInfo.businessType === "CONSIGNMENT") {
          return this.$T("sfin.invoiceBill.view.consignmentInvoiceHeader").$D(
            "寄售发票头信息"
          );
        }
        return this.$T("sfin.invoiceBill.view.nonConsignmentInvoiceHeader").$D(
          "非寄售发票头信息"
        );
      };
    },
    basePriceTaxFlag() {
      return this.basePrice && this.basePrice === "TAX_INCLUDED_PRICE";
    },
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      return [
        {
          title: this.$T(
            "sfin.invoiceBill.model.invoiceBill.supplierCompanyId"
          ).$D("供应商"),
          attachmentUuid: this.attachmentUUID || uuid(),
          readOnly: false,
        },
      ];
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "invoiceNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
      ];

      return columns;
    },
    //发票详情头
    getInvoiceDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "poNumAndLineNum",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader>
              <span style="color:#fff">{val}</span>
              <div slot="right">
                <span style="color: #fff">
                  {this.$T(
                    "sfin.invoiceBill.model.invoiceBill.invoiceLineNum"
                  ).$D("发票行")}
                    : {record.invoiceLineNum}
                </span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
      ];

      return columns;
    },
    // 发票头信息
    getOrderHeadInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceDateIssued").$D("开票日期"),
          fieldType: "DATE_PICKER",
          fieldCode: "taxInvoiceDateIssued",
          required: true,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceNum").$D("税务发票号码"),
          fieldCode: "taxInvoiceNum",
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceCode").$D("税务发票代码"),
          fieldCode: "taxInvoiceCode",
          fieldType: "INPUT",
          required: true,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoicePrice").$D("发票总额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          required: true,
          editor: true,
          editLimit: true,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceTaxAmount").$D("发票税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmount",
          required: true,
          editor: true,
          editLimit: true,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.deductionTaxAmount").$D("扣款税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "deductedTaxAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceRemark").$D("发票备注"),
          fieldType: "TEXT_AREA",
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.drawerSupplierName").$D("出票方"),
          fieldType: "TEXT",
          fieldCode: "approvedBy",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.payableInvoice.totalNonTax").$D("未税总额(系统)"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxWithoutAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmountSystem").$D("含税总额(系统)"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmountSystemMeaning",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxAmountSystem").$D("税额（系统）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmountSystemMeaning",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.deductedTaxIncludedAmount").$D("扣款金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "deductedTaxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierSiteName").$D("供应商地址"),
          fieldType: "TEXT",
          fieldCode: "supplierSiteName",
        },
      ];
      return columns;
    },
    //发票基本信息
    getOrderBasicInfoColumns() {
      const columns = [
        {
          fieldCode: "companyName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{val}</span>
              <div slot="right">
                <span class="status1">{record.invoiceStatusMeaning}</span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.purAgentNamee").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaseAgentName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.currencyCode").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceTitle").$D("开票主体"),
          fieldType: "TEXT",
          fieldCode: "invoiceTitle",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.purchaseOrgName").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purOrganizationName",
        },
      ];
      return columns;
    },
    // 发票行信息
    getOrderLineInfoColumns() {
      const columns = [
        {
          fieldCode: "asnNumAndAsnLineNum",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              <div slot="right">
                <span style="color: var(--color-font-default-e)">
                  {this.$T(
                    "sfin.invoiceBill.model.invoiceBill.invoiceLineNum"
                  ).$D("发票行")}
                    : {record.invoiceLineNum}
                </span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("sfin.common.model.common.taxRate").$D("税率(%)"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.sfin.invoiceBill").$D("含税单价"),
          fieldCode: "taxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.sfin.taxAmount").$D("税额"),
          fieldCode: "taxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.all.taxIncludedPrice").$D("含税总金额"),
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
      ];
      return columns;
    },
    // 税务发票行信息
    getTaxInvoiceRowInfoColumns() {
      const columns = [
        {
          fieldCode: "invoiceCode",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              {this.$T("sfin.invoiceBill.model.invoiceBill.invoiceCode").$D(
                "税务发票代码"
              )}
                :<span>{val}</span>
              <span slot="right">
                {record.validateStatusCode === "UNCHECK" &&
                    <span class="status status1">
                      {record.validateStatusCodeMeaning}
                    </span>
                }
                {record.validateStatusCode === "CHECK_SUCCESS" &&
                    <span class="status status2">
                      {record.validateStatusCodeMeaning}
                    </span>
                }
                {record.validateStatusCode === "CHECK_FAILED" &&
                    <span class="status status3">
                      {record.validateStatusCodeMeaning}
                    </span>
                }
                {record.validateStatusCode === "PARTIAL_SUCCESS" &&
                    <span class="status status4">
                      {record.validateStatusCodeMeaning}
                    </span>
                }
                {record.validateStatusCode === "PARTIAL_FAILED" &&
                    <span class="status status5">
                      {record.validateStatusCodeMeaning}
                    </span>
                }
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceNumber").$D("发票号"),
          fieldType: "TEXT",
          fieldCode: "invoiceNumber",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.checkStateExplain").$D("查验状态说明"),
          fieldType: "TEXT",
          fieldCode: "validateMessage",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceDateIssued").$D("开票日期"),
          fieldCode: "billingDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.checkCodeMeaning").$D("校验码"),
          fieldType: "TEXT",
          fieldCode: "checkCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceStatus").$D("发票状态"),
          fieldType: "TEXT",
          fieldCode: "taxInvoiceStatusCodeMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.noDepositInvoiceType").$D("发票种类"),
          fieldType: "TEXT",
          fieldCode: "noDepositInvoiceTypeMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceDirection").$D("发票方向"),
          fieldType: "TEXT",
          fieldCode: "invoiceDirectionMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额"),
          fieldType: "EMPTY",
          fieldCode: "totalAmount",
          render: (val, record) => {
            const length = this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            );
            return (
              <div class="footInfo footInfo1">
                <span>
                  {this.$T("sfin.invoiceBill.model.invoiceBill.netAmount").$D(
                    "不含税金额"
                  )}
                    : {this.$options.filters.calcMultipleDelimiter(val, length)}
                </span>
                <div>
                  <span onClick={() => this.taxLineCheck(record)}>
                    {this.$T("hipspfm.common.button.inspection").$D("查验")}
                  </span>
                  <span onClick={() => this.taxLineDelete(record)}>
                    {this.$T("hipspfm.common.button.delete").$D("删除")}
                  </span>
                </div>
              </div>
            );
          },
        },
      ];
      return columns;
    },
    // 总账科目行信息
    getLedgerAccountInfoColumns() {
      const columns = [
        {
          fieldCode: "deductionsNum",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{val}</span>
              <span slot="right">
                <span style="color: var(--color-font-default-e)">
                  {this.$T("sfin.invoiceBill.model.invoiceBill.lineNo").$D(
                    "行号"
                  )}
                    : {record.relationLineNum}
                </span>
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.common.model.common.accountSubjectName").$D("总账科目名称"),
          fieldType: "TEXT",
          fieldCode: "accountSubjectName",
        },
        {
          fieldName: this.$T("sfin.common.	model.common.debitCreditCodeMeaning").$D("借贷方"),
          fieldType: "TEXT",
          fieldCode: "debitCreditCodeMeaning",
        },
        {
          fieldName: this.$T("sfin.common.model.common.taxRate").$D("税率(%)"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sfin.common.model.common.taxIncludedAmountx").$D("含税扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.relationAmount").$D("已扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "relationAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.remainingDeductionAmount").$D("剩余可扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "remainingDeductionAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.deductionRemark").$D("扣款说明"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.deductionAmount").$D("本次扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "deductionAmount",
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
      ];
      return columns;
    },
    //发票行详细信息
    getOrderLineDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unitPriceBatch").$D("每"),
          fieldCode: "unitPriceBatch",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netPrice").$D("不含税单价"),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor: this.lineInfoDetail.netPriceUpdFlag,
          editLimit: this.lineInfoDetail.netPriceUpdFlag,
          render: (val, record) => {
            if (!record.quantity) {
              return 0;
            }
            if (this.basePriceTaxFlag) {
              return Number(
                Number(record.taxIncludedPrice) /
                  (1 + Number(record.taxRate / 100.0))
              );
            }
            return Number(val);
          },
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "defaultPrecision"
                )
              );
            }
          },
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "netAmount",
          editor: false,
          render: (val, record) => {
            if (!record.quantity) {
              return 0;
            }
            if (this.basePriceTaxFlag) {
              //若基准价含税，含税金额减税额计算；
              return (
                Number(record.taxIncludedAmount) -
                Number(record.lineInfoDetail.taxAmount)
              );
            }
            //若基准价不含税，round(不含税单价*数量/每,2）
            // round(不含税金额*税率，2)，
            const result = Number(
              Number(record.netPrice) * Number(record.quantity) /
                Number(record.unitPriceBatch)
            );
            record.taxAmount =
              record.taxAmount ||
              Number(result * Number(record.taxRate / 100.0));
            return result;
          },
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.orignNetPrice").$D("原不含税价"),
          fieldCode: "rawNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "financialPrecision"
                )
              );
            }
          },
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmount",
          editor: this.lineInfoDetail.taxAmountUpdFlag,
          editLimit: this.lineInfoDetail.taxAmountUpdFlag,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.sfin.invoiceBill").$D("含税单价"),
          fieldCode: "taxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: this.lineInfoDetail.taxIncludePriceUpdFlag,
          editLimit: this.lineInfoDetail.taxIncludePriceUpdFlag,
          render: (val, record) => {
            if (!record.quantity) {
              return 0;
            }
            if (this.basePriceTaxFlag) {
              return record.taxIncludedPrice;
            }
            return Number(
              Number(record.netPrice) * (1 + Number(record.taxRate) / 100.0)
            );
          },
          precision: (val, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "defaultPrecision"
                )
              );
            }
          },
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          render: (val, record) => {
            if (!record.quantity) {
              return 0;
            }
            if (this.basePriceTaxFlag) {
              //若基准价含税，round(含税单价*数量/每,2）
              //round（含税金额/（1+税率）*税率，2）；
              const result = Number(
                record.taxIncludedPrice * record.quantity /
                  record.unitPriceBatch
              );
              record.taxAmount =
                record.taxAmount ||
                Number(
                  result / (1 + Number(record.taxRate / 100.0)) *
                    Number(record.taxRate / 100.0)
                );
              return result;
            }
            //若若基准价不含税，不含税金额加税额计算
            return Number(record.netAmount) + Number(record.taxAmount);
          },
          editor: false,
          precision: (val, record) => Number(
            this.$options.filters.calcCurrencyPrecision(
              record.currencyCode,
              "financialPrecision"
            )
          ),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.specificationsAndModel").$D("规格型号"),
          fieldCode: "specificationsAndModel",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.displayReleaseNum").$D("发放号"),
          fieldCode: "displayReleaseNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.displayLineLocationNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.asnNum").$D("送货单号|行号"),
          fieldCode: "asnNumAndAsnLineNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.thingNumberAndLineNum").$D("事物编号|行号"),
          fieldCode: "trxAndLineNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.billNumAndBillLineNum").$D("对账单号|行号"),
          fieldCode: "billNumAndBillLineNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.trxDate").$D("事务日期"),
          fieldCode: "trxDate",
        },
      ];

      return columns;
    },
    getInvoiceLineBtnArr() {
      return [
        {
          title: this.$T("hipspfm.common.button.cancel").$D("取消"),
          // eslint-disable-next-line no-return-assign
          handler: () => this.visible = false,
        },
        {
          type: "success",
          title: this.$T("hipspfm.common.button.save").$D("保存"),
          // eslint-disable-next-line no-return-assign
          handler: this.confirmInvoice,
        },
      ];
    },
  },
  async mounted() {
    this.invoiceHeaderId = this.$route.query.invoiceHeaderId;
    await this.getOrderHeader();
    await this.getOrderLedgerAccount();
    await this.getOrderTax();
    await this.getOrderLine();
    await this.getOperationRecords();
    this.getSettings();
    this.getRules();
  },
  methods: {
    // 获取配置中心单价修改规则
    getSettings() {
      const value = "010505";
      //扣款基准价 010531 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      //对账及开票基准价 010505 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      getSettingsApi().then((res) => {
        this.basePrice = res[value] === "" ? "NET_PRICE" : res[value];
      });
    },
    getRules() {
      getRulesApi().then((res) => {
        this.priceRule = res.filter(
          (e) => e.consignmentType === this.headInfo.businessType
        );
        if (this.priceRule.length > 0) {
          this.priceRule = this.priceRule[0];
        } else {
          this.priceRule = {};
        }
      });
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看行详情
    showLineDetail(item) {
      this.visible = !this.visible;
      this.currentLineInfo = item;
    },
    // 获取发票头信息
    async getOrderHeader() {
      try {
        this.headInfo = await getOrderHeaderApi(this.invoiceHeaderId);
        if (this.headInfo.attachmentUuid) {
          this.attachmentUUID = this.headInfo.attachmentUuid;
        } else {
          const { content } = await getFileUUIDApi();
          this.attachmentUUID = content;
        }
      } catch (err) {
        console.log(err);
      }
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      await getOrderLineApi(this.invoiceHeaderId).then((res) => {
        this.$loading.hide();
        this.lineInfo = res.content;
        this.loading = true;
      });
    },
    //获取订单税务发票行信息
    async getOrderTax() {
      await getOrderTaxApi(this.invoiceHeaderId).then((res) => {
        this.$loading.hide();
        console.log(this.taxInfo, "taxinfo");
        this.taxInfo = res.content;
      });
    },
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      console.log(this.lineInfoDetail, "linedetail");
      setTimeout(() => {
        this.visible = true;
      }, 200);
    },
    async getOrderLedgerAccount() {
      const params = {
        invoiceHeaderId: this.invoiceHeaderId,
        organizationId: window.localStorage.getItem("tenantId"),
        page: 0,
        size: 1000,
      };
      await getOrderLedgerAccountApi(params).then((res) => {
        this.$loading.hide();
        this.ledgerAccount = res.content;
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      this.oploading = true;
      await getOpRecordApi(this.invoiceHeaderId).then((res) => {
        this.oploading = false;
        this.operationArr = res.content;
      });
    },
    confirmInvoice() {
      this.$loading.show();
      if (
        this.priceRule.taxAmountUpdFlag &&
        Math.abs(
          this.lineInfoDetail.taxAmount - this.lineInfoDetail.taxAmount
        ) > this.priceRule.taxAmountTolerance
      ) {
        this.$hips.toast({
          message: this.$T("smbl.invoice.view.taxAmountNotMatch").$D(
            "修改后税额较原税额超过税额允差，无法保存，请修改"
          ),
          duration: 1500,
        });
      }
      updateInvoiceLineApi(
        this.headInfo.invoiceHeaderId,
        this.lineInfoDetail
      ).then((res) => {
        if (!res.failed) {
          this.getOrderHeader();
          this.getOrderLine();
        }
        this.$loading.hide();
      });
    },
    // 保存
    save() {
      if (!this.$refs.customize.validate()) {
        return;
      }
      this.$loading.show({
        text: this.$T("hipspfm.invoiceInspection.view.message.saving").$D(
          "保存中"
        ),
      });
      this.headInfo.customizeUnitCode =
        "SFIN.INVOICE_CREATE_DETAIL.TAX_LINE,SFIN.INVOICE_UPDATE_DETAIL.HEADER_INFO,SFIN.INVOICE_UPDATE_DETAIL.BASIC_INFO";
      this.headInfo.invoiceLines = this.lineInfo;
      getSaveApi(this.headInfo).then((res) => {
        if (!res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
          this.getOrderHeader();
          this.getOrderLine();
        }
        this.$loading.hide();
      });
    },
    // 通过
    submit() {
      if (!this.$refs.customize.validate()) {
        return;
      }
      this.$loading.show({
        text: this.$T("hipspfm.invoiceBill.view.message..submitting").$D(
          "提交中"
        ),
      });
      this.headInfo.invoiceLines = this.lineInfo;
      getSubmitApi(this.headInfo).then((res) => {
        this.$loading.hide();
        if (!res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
          });
          // eslint-disable-next-line consistent-this
          const _this = this;
          setTimeout(() => {
            _this.$router.push({
              name: "CreateInvoiceList",
            });
          }, 1000);
        }
      });
    },
    // 发票弹窗显示或隐藏
    showAddModal() {
      setTimeout(() => {
        this.addModal = !this.addModal;
      }, 10);
    },
    //扫一扫
    async goScanner() {
      let _this = this;
      SrmAppCore.scanQrCode(function (result) {
        console.info(result);
        _this.$router.push({
          name: "EditableDetailB",
          query: {
            result,
            editable: false,
            invoiceHeaderId: this.headInfo.invoiceHeaderId,
          },
        });
      },function (){
        _this.$notification.open({
          message: _this
              .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
              .$D("扫码异常"),
          key,
          class: "notification",
          duration: 3,
        });
      });

      // const navigatorInfo = navigator.userAgent.toLowerCase();
      // if (
      //   navigatorInfo.includes("welink") ||
      //   navigatorInfo.includes("cloudlink")
      // ) {
      //   /** welink **/
      //   await this.getWlScan();
      // } else if (navigatorInfo.indexOf("micromessenger") !== -1) {
      //   /** 微信 **/
      //   await this.getWxScan();
      // } else if (dd.env.platform !== "notInDingTalk") {
      //   console.log("钉钉扫码");
      //   /** 钉钉 **/
      //   await this.getDdScan();
      // } else {
      //   /** APP **/
      //   await this.getAppScan();
      // }
    },
    // welink扫码
    // getWlScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   HWH5.scanCode({ needResult: 1 })
    //     .then((res) => {
    //       let result = JSON.parse(res).result;
    //       console.log(res);
    //       _this.$router.push({
    //         name: "EditableDetailB",
    //         query: {
    //           result,
    //           editable: false,
    //           invoiceHeaderId: this.headInfo.invoiceHeaderId,
    //         },
    //       });
    //     })
    //     .catch(() => {
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3,
    //       });
    //     });
    // },
    // // APP扫码
    // getAppScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   scanBridge()
    //     .then((res) => {
    //       let result = JSON.parse(res).result;
    //       JSON.stringify(res).indexOf(",") === -1 ?
    //         _this.$notification.open({
    //           message:
    //               _this
    //                 .$T("hipspfm.invoiceInspection.view.message.scanError")
    //                 .$D("扫码有误") +
    //               "," +
    //               _this
    //                 .$T(
    //                   "hipspfm.invoiceInspection.validation.message.useManualEntry"
    //                 )
    //                 .$D("请使用手工录入"),
    //           key,
    //           class: "notification",
    //           duration: 3,
    //         }) :
    //         _this.$router.push({
    //           name: "EditableDetailB",
    //           query: {
    //             result,
    //             editable: false,
    //             invoiceHeaderId: this.headInfo.invoiceHeaderId,
    //           },
    //         });
    //     })
    //     .catch(() => {
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3,
    //       });
    //     });
    // },
    parseInvoice(text) {
      let dataArr = text.split(",");
      const invoiceCode = dataArr[2];
      const invoiceNumber = dataArr[3];
      const totalAmount = dataArr[4];

      const year = dataArr[5].slice(0, 4) + "-";
      const month = dataArr[5].slice(4, 6) + "-";
      const day = dataArr[5].slice(6, 8);
      const billingDate = `${year}${month}${day}`;
      let checkCodeArr = JSON.stringify(dataArr[6]);
      let checkCodeLen = checkCodeArr.length;
      const checkCode =
        checkCodeArr &&
        checkCodeArr.substring(checkCodeLen - 7, checkCodeLen - 1);
      return {
        invoiceCode,
        invoiceNumber,
        totalAmount,
        billingDate,
        checkCode,
      };
    },
    // 微信扫码
    // getWxScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   const wx = parent.wxBridge || parent.jWeixin;
    //   if (!wx) {
    //     _this.$notification.open({
    //       message: _this
    //         .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //         .$D("扫码异常"),
    //       key,
    //       class: "notification",
    //       duration: 3,
    //     });
    //   }
    //   wx.scanQRCode({
    //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //     scanType: [ "qrCode" ], // 可以指定扫二维码还是一维码，默认二者都有
    //     success: function (resC) {
    //       console.log("扫描单号", resC.resultStr);
    //       let result = resC.resultStr; // 当needResult 为 1 时，扫码返回的结果
    //       const invoice = _this.parseInvoice(result);
    //       invoice.invoiceHeaderId = _this.headInfo.invoiceHeaderId;
    //       _this.$router.push({
    //         name: "ManualEntryB",
    //         query: invoice,
    //       });
    //     },
    //     fail: function (err) {
    //       console.log("scanerr", err);
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3,
    //       });
    //     },
    //     cancel: function (resE) {
    //       console.log("cancel", resE);
    //       _this.$router.push({ name: "CreateInvoiceDetail" });
    //     },
    //   });
    // },
    // // 钉钉扫码
    // getDdScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   dd.ready(function () {
    //     dd.biz.util.scan({
    //       type: "all",
    //       onSuccess: function (data) {
    //         console.log("扫码结果", data);
    //         let result = data.text;
    //         _this.$router.push({
    //           name: "EditableDetailB",
    //           query: {
    //             result,
    //             editable: false,
    //             invoiceHeaderId: this.headInfo.invoiceHeaderId,
    //           },
    //         });
    //       },
    //       onFail: function (err) {
    //         if (Number(err.errorCode) === 10) {
    //           _this.$router.push({ name: "InvoiceInspection" });
    //         } else {
    //           _this.$notification.open({
    //             message: _this
    //               .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //               .$D("扫码异常"),
    //             key,
    //             class: "notification",
    //             duration: 3,
    //           });
    //         }
    //       },
    //     });
    //   });
    // },
    //进入OCR识别
    goOcR() {
      this.$router.push({
        name: "OcrRecognitionB",
        query: {
          invoiceHeaderId: this.headInfo.invoiceHeaderId,
        },
      });
    },
    //进入手工录入
    goManualEntry() {
      this.$router.push({
        name: "ManualEntryB",
        query: this.headInfo
      });
    },
    // 删除
    taxLineDelete(item) {
      this.$hips.dialog.confirm({
        title: " ",
        content:
          this.$T("hipspfm.invoiceBill.validation.message.comfirmDelete").$D(
            "是否确认删除"
          ) + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        asyncClose: true,
        closable: false,
        onOk: () => {
          let params = [];
          params.push(item);
          batchRemoveApi(params).then(() => {
            this.$hips.toast({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D(
                "操作成功"
              ),
              duration: 1500,
            });
            this.$hips.dialog.close();
            this.getOrderTax();
          });
        },
        onCancel() {},
      });
    },
    // 查验
    taxLineCheck(item) {
      let params = [];
      if (item.type === "click") {
        params = this.taxInfo;
      } else {
        params.push(item);
      }
      batchCheckApi(params).then((res) => {
        if (res) {
          if (res.failed) {
            this.$hips.toast({ message: res.message, duration: 1500 });
            this.$hips.dialog.close();
          } else {
            this.$hips.toast({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D(
                "操作成功"
              ),
              duration: 1500,
            });
            this.$hips.dialog.close();
            this.getOrderHeader();
            this.getOrderTax();
          }
        } else {
          this.$hips.toast({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            duration: 1500,
          });
          this.$hips.dialog.close();
          this.getOrderHeader();
          this.getOrderTax();
        }
      });
    },
    onBottom(activeIndex) {
      if (Object.keys(this.taxInfo).length === 0) {
        activeIndex >= 2 ? this.showAdd = true : this.showAdd = false;
      } else {
        activeIndex >= 3 ? this.showAdd = true : this.showAdd = false;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: scroll;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}

.srm-scroll-tab-item-title {
  .all-check {
    float: right;
    background: var(--color-other-default-b);
    border-radius: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: var(--color-font-default-d);
    text-align: right;
    padding: 7px 14px;
    line-height: 22px;
    position: relative;
    bottom: 3.5px;
  }
}

.invite {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  background: var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    font-weight: bold;
    border-right: 1px solid var(--color-border-default);
  }

  span:nth-child(odd) {
    color: var(--color-font-default-b);
  }
}

.code-red {
  color: #ff0000 !important;
}

.status {
  text-align: right;
}

.status1 {
  color: var(--color-font-default-e);
}

.status2 {
  color: var(--color-other-default-b);
}

.status3 {
  color: var(--color-other-default);
}

.status4 {
  color: var(--color-other-default-c);
}

.status5 {
  color: var(--color-other-default-c);
}

>>> .customize-detail {
  padding: 0px 20px 10px 15px !important;
}

.contentText {
  >>> .hips-textarea {
    padding: 10px 20px;
  }

  >>> .hips-textarea__label-value {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default, #1b1e2b);
    line-height: 26px;
    font-weight: bold;
  }

  >>> .hips-textarea__body {
    height: 174px;
  }

  >>> .hips-textarea__input-value textarea {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: var(--color-font-default, #1b1e2b);
    letter-spacing: 0.7px;
    line-height: 28px;
  }

  >>> .hips-textarea__input-value textarea::-webkit-input-placeholder {
    bg_url(icon_editor);
    background-repeat: no-repeat;
    background-size: 20px 20px;
    color: var(--color-font-default-e);
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-moz-placeholder {
    bg_url(icon_editor);
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::-moz-placeholder {
    bg_url(icon_editor);
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-ms-input-placeholder {
    bg_url(icon_editor);
    background-repeat: no-repeat !important;
    color: var(--color-font-default-e);
    background-size: 20px 20px !important;
    background-position-y: 3px !important;
  }

  >>> .hips-textarea__input-value textarea::-ms-input-placeholder {
    bg_url(icon_editor);
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::placeholder {
    bg_url(icon_editor);
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }
}

.handlerWrap {
  display: flex;

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: var(--color-font-default-b);
    line-height: 56px;
    text-align: center;
  }

  .submitWrap {
    color: var(--color-font-default-d);
    background: var(--color-other-default-b);
  }

  .cancleWrap {
    color: var(--color-font-default-d);
    background: var(--color-other-default) !important;
  }
}

.addModal {
  padding: 0px 20px;

  li:nth-child(1) {
    span {
      display: inline-block;
      padding: 36px 0px 48px 0px;
      font-size: 14px;
      color: var(--color-font-default-e);
    }
  }

  li:nth-child(2) {
    display: flex;
    text-align: center;
    justify-content: space-around;
    color: var(--color-font-default);
    color: var(--color-font-default);

    img {
      height: 32px;
      width: 32px;
      margin-bottom: 4px;
    }

    div {
      font-weight: 700;
    }
  }

  li:nth-child(3) {
    text-align: center;
    margin-top: 54px;

    img {
      height: 52px;
      width: 52px;
      transform: rotate(-270deg);
      background: var(--color-other-default-b);
      border-radius: 50%;
      box-shadow: 0 2px 6px 0 rgba(0, 65, 61, 0.2);
    }
  }
}

.addMethods {
  position: fixed;
  z-index: 1600;
  bottom: calc(18px + constant(safe-area-inset-bottom));
  bottom: calc(18px + env(safe-area-inset-bottom));
  left: 161.5px;
  width: 52px !important;
  height: 52px;
  border-radius: 50%;

  img {
    width: 52px;
    height: 52px;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
}

.footInfo1 {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.footInfo {
  height: 40px;
  border-bottom: 8px solid var(--color-border-default);
  font-family: PingFangSC-Medium;
  color: var(--color-font-default);
  font-size: 14px;
  display: flex;
  font-weight: 600;

  span:nth-child(1) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  div {
    flex: 0 1 auto;

    span {
      background: var(--color-other-default-b);
      border-radius: 16px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: var(--color-font-default-d);
      line-height: 20px;
      padding: 8px 16px;
      margin-left: 12px;
      position: relative;
      bottom: 2px;
    }

    span:nth-child(2) {
      background: var(--color-other-default);
    }
  }
}

>>> .srm-field-wrapper-fill {
  background: #fff;
  padding: 0;
}

>>> .srm-popup-content {
  height: calc(100vh - 100px) !important;
}
</style>
