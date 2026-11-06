import {
  getHeaderApi,
  getLineApi,
  getLineInfoBillApi,
  getLineInfoSettleApi,
} from "../api";
import { detailCustomizeUnit } from "./indexDs";
import { supDetailCustomizeUnit } from "./indexDsBySupplier";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import { dateFormat } from "@/utils/index";
import { $T } from "srm-mobile-ui";

export default {
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    // 类型：区分采购方和销售方
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      initLoading: true,
      loading: false,
      headInfo: {}, // 头信息
      linesInfo: {}, // 行信息
      linesDetailInfo: {},
    };
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.initLoading = true;
        await this.fetchData();
        await this.fetchLine();
        this.loading = true;
      } catch (err) {
        this.initLoading = false;
      } finally {
        this.initLoading = false;
      }
    }
  },
  methods: {
    // 头信息
    async fetchData() {
      await getHeaderApi({
        billHeaderId: this.changeReqId,
        customizeUnitCode:
          this.type === "supplier" ?
            supDetailCustomizeUnit :
            detailCustomizeUnit,
        editFlag: 0,
      }).then((res) => {
        this.headInfo = { ...res };
      });
    },
    // 交易明细信息
    async fetchLine() {
      await getLineApi(this.changeReqId, {
        page: 0,
        size: 10,
        billHeaderId: this.changeReqId,
        customizeUnitCode:
          this.type === "supplier" ?
            "SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_DETAILS,SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_DETAIL_SEARCH" :
            "SSTA.PURCHASER_BILL_DETAIL.TRANSACTION_DETAILS,SSTA.PURCHASER_BILL_DETAIL.TRANSACTION_DETAIL_SEARCH",
      }).then((res) => {
        this.linesInfo = [ ...res.content ];
        this.$emit("getData", {
          ...this.headInfo,
          billLineList: [ ...this.linesInfo ],
        });
      });
    },
    // 交易明细 详情信息
    async fetchLineInfo(billHeaderId, settleId, settleConfigId) {
      this.$loading.show();
      await getLineInfoBillApi(billHeaderId, settleId).then((res) => {
        this.linesDetailInfo = { ...res };
      });
      await getLineInfoSettleApi(settleConfigId)
        .then((res) => {
          this.linesDetailInfo = { ...this.linesDetailInfo, ...res };
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    // 附件
    showAttachRecords(flag, url) {
      if (flag === 1) {
        this.$showFileList({
          title: this.$T("hipspfm.common.button.attach").$D("附件"),
          attachmentUuid: url,
        });
      }
      if (flag === 2) {
        previewFile({
          bucketName: "private-bucket",
          fileUrl: url,
          fileName: url,
        });
      }
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        noContent: this.$T("hipspfm.common.view.message.title.noData").$D(
          "暂无数据"
        ),
        baseInfoTab: this.$T("ssta.purchaseSettle.message.panel.baseInfos").$D(
          "基本信息"
        ),
        payInfoTab: this.$T(
          "ssta.purchaseSettle.message.panel.transactionParty"
        ).$D("交易方信息"),
        amountInfoTab: this.$T(
          "ssta.purchaseSettle.message.panel.transactionAmount"
        ).$D("交易金额信息"),
        detailInfoTab: this.$T(
          "ssta.purchaseSettle.message.panel.transactionDetails"
        ).$D("交易明细信息"),
        mainConfigInfoTab: this.$T(
          "ssta.purchaseSettle.message.panel.mainStrategyInfo"
        ).$D("主策略信息"),
        otherInfoTab: this.$T("ssta.purchaseSettle.message.panel.otherInfo").$D(
          "其他信息"
        ),
        settleMainInfoTab: this.$T(
          "ssta.purchaseSettle.view.title.settleMainInfo"
        ).$D("结算主信息"),
        settleExecInfoTab: this.$T(
          "ssta.purchaseSettle.view.title.settleRunInfo"
        ).$D("结算执行信息"),
        settleConfigInfoTab: this.$T(
          "ssta.purchaseSettle.view.title.settleStrategyInfo"
        ).$D("结算策略信息"),
        transactionAffair: this.$T(
          "ssta.purchaseSettle.view.title.transactionAffair"
        ).$D("交易事务信息"),
        invoiceInfo: this.$T("ssta.purchaseSettle.view.title.invoiceInfo").$D(
          "开票信息"
        ),
        settleDataRule: this.$T(
          "ssta.purchaseSettle.view.title.settleDataRule"
        ).$D("结算数据规则"),
        billRule: this.$T("ssta.purchaseSettle.view.title.billRule").$D(
          "对账单规则"
        ),
        billInfo: this.$T("ssta.purchaseSettle.view.title.billInfo").$D(
          "对账信息"
        ),
        collectionInfo: this.$T(
          "ssta.purchaseSettle.view.title.collectionInfo"
        ).$D("收款信息"),
        paymentInfo: this.$T("ssta.purchaseSettle.view.title.paymentInfo").$D(
          "付款信息"
        ),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCustomizeCode(code) {
      const codeList = {
        baseInfoTab: "SMBL.BILL_WORKPLACE.BASE_INFO",
        payInfoTab: "SMBL.BILL_WORKPLACE.TRADING_PARTY_INFO",
        amountInfoTab: "SMBL.BILL_WORKPLACE.TRANSACTION_AMOUNT_INFO",
        detailInfoTab: "SMBL.BILL_WORKPLACE.TRANSACTION_DETAILS_INFO",
        mainConfigInfoTab: "SMBL.BILL_WORKPLACE.SETTLE_CONFIG_INFO",
        otherInfoTab: "SMBL.BILL_WORKPLACE.OTHER_INFO",
        "settleMain-payInfoTab": "SMBL.BILL_WORKPLACE.MAIN_TRADING_PARTY_INFO",
        "settleMain-amountInfoTab":
          "SMBL.BILL_WORKPLACE.MAIN_TRANSACTION_AMOUNT_INFO",
        "settleMain-thingInfo":
          "SMBL.BILL_WORKPLACE.MAIN_TRANSACTION_THING_INFO",
        "settleExec-payInfoTab": "SMBL.BILL_WORKPLACE.EXEC_TRADING_PARTY_INFO",
        "settleExec-invoiceInfo": "SMBL.BILL_WORKPLACE.EXEC_INVOICE_INFO",
        "settleExec-paymentInfo": "SMBL.BILL_WORKPLACE.EXEC_PAYMENT_INFO",
        "settleConfig-dataRule": "SMBL.BILL_WORKPLACE.SETTLE_DATA_RULE",
        "settleConfig-billRule": "SMBL.BILL_WORKPLACE.SETTLE_BILL_RULE",
      };
      return codeList[code] || "";
    },
    // 获取 lov值集
    getLovCode(key) {
      const lovList = {};
      return lovList[key] || "";
    },
    callBackChange(fieldName, val, record) {
      if (fieldName === "netPrice") {
        record["netPrice"] = val;
        record["netPriceMeaning"] = String(val);
        record["netAmount"] = (record["quantity"] * record["netPrice"]).toFixed(
          2
        );
        record["netAmountMeaning"] = String(record["netAmount"]);
      }
      if (fieldName === "quantity") {
        record["quantity"] = val;
        record["netAmount"] = (record["quantity"] * record["netPrice"]).toFixed(
          2
        );
        record["netAmountMeaning"] = String(record["netAmount"]);
      }
      if (fieldName === "remark") {
        this.headInfo["remark"] = val;
      }
      if (record && record.settleId) {
        // eslint-disable-next-line no-shadow
        let index = this.linesInfo.findIndex(
          // eslint-disable-next-line no-shadow
          (val) => val.settleId === record.settleId
        );
        if (index > -1) {
          this.linesInfo[index] = { ...record };
        } else {
          this.linesInfo.push({ ...record });
        }
      }
      this.$emit("getData", {
        ...this.headInfo,
        billLineList: [ ...this.linesInfo ],
      });
    },
    // 获取字段
    getFieldInfo(name) {
      if (name === "netAmount1") {
        return {
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmountMeaning"
          ).$D("不含税总金额"),
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        };
      }
      if (name === "netAmount2") {
        return {
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billNetAmountMeaning"
          ).$D("本次对账不含税金额"),
          formRow: 7,
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        };
      }
      if (name === "taxIncludedAmount1") {
        return {
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedAmountMeaning"
          ).$D("含税总金额"),
          formRow: 2,
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        };
      }
      if (name === "taxIncludedAmount2") {
        return {
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billTaxIncludedAmountMeaning"
          ).$D("本次对账含税金额"),
          formRow: 10,
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        };
      }
      let columnList = [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            const billStatus = item.billStatus;
            const statusType = {
              SUBMITED: "primary",
              SUBMITED_APPROVING: "warn",
              CANCELING: "warn",
              CANCEL: "info",
              RETURN: "danger",
              CONFIRM: "success",
            };
            return (
              <SrmListHeader>
                {item.billNum}
                <SrmButton
                  slot="right"
                  plain
                  rect
                  style={{ fontWeight: "bold" }}
                  type={statusType[billStatus]}
                >
                  {item.billStatusMeaning}
                </SrmButton>
              </SrmListHeader>
            );
          },
          formRow: 1,
        },
        {
          fieldCode: "billNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseSettlePool.model.purchaseSettlePool.billNum"
          ).$D("对账单编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "billStatusMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billStatusMeaning"
          ).$D("对账单状态"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "createdUserName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.createdUserName"
          ).$D("创建人"),
          render: (val) => val ? val : "-",
          formRow: 3,
        },
        {
          fieldCode: "creationDate",
          fieldType: "DATE_PICKER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.creationDate"
          ).$D("创建日期"),
          options: {
            format: "yyyy-MM-dd",
          },
          editor: false,
          formRow: 3,
        },
        {
          fieldCode: "campMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.campMeaning"
          ).$D("创建方阵营"),
          render: (val) => val ? val : "-",
          formRow: 4,
        },

        {
          fieldCode: "companyNum",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCustomerCompanyNum"
              ).$D("对账客户公司编码") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompanyNum"
              ).$D("对账公司编码"),
          render: (val) => val ? val : "-",
          formRow: 4,
        },
        // {
        //   fieldCode: "companyNum",
        //   fieldType: "TEXT",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCustomerCompanyNum").$D("对账客户公司编码"),
        //   render: (val) => val ? val : "-",
        //   formRow: 2,
        // },

        {
          fieldCode: "companyName",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCustomerCompanyName"
              ).$D("对账客户公司名称") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompanyName"
              ).$D("对账公司名称"),
          render: (val) => val ? val : "-",
          formRow: 5,
        },
        // {
        //   fieldCode: "companyName",
        //   fieldType: "TEXT",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCustomerCompanyName").$D("对账客户公司名称"),
        //   render: (val) => val ? val : "-",
        //   formRow: 3,
        // },
        {
          fieldCode: "supplierCompanyNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billSupplierCompanyNum"
          ).$D("对账供应商公司编码"),
          render: (val) => val ? val : "-",
          formRow: 5,
        },
        {
          fieldCode: "supplierCompanyName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billSupplierCompanyName"
          ).$D("对账供应商公司名称"),
          render: (val) => val ? val : "-",
          formRow: 6,
        },
        {
          fieldCode: "sourceSupplierCompanyNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billSourceSupplierNum"
          ).$D("数据源平台供应商编码"),
          render: (val) => val ? val : "-",
          formRow: 6,
        },
        {
          fieldCode: "sourceSupplierCompanyName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billSourceSupplierName"
          ).$D("数据源平台供应商名称"),
          render: (val) => val ? val : "-",
          formRow: 7,
        },
        // {
        //   fieldCode: "line1",
        //   fieldType: "TEXT",
        //   fieldName: $T(
        //     "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCurrencyCode"
        //   ).$D("币种"),
        //   render: (val, item) => item.currencyCode,
        //   formRow: 7,
        // },
        {
          fieldCode: "currencyCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCurrencyCode"
          ).$D("币种"),
          render: (val) => val ? val : "-",
          formRow: 7,
        },
        {
          fieldCode: "supplierSiteCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierSiteCode"
          ).$D("供应商地点"),
          render: (val) => val ? val : "-",
          formRow: 8,
        },
        {
          fieldCode: "ouName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.ouName"
          ).$D("业务实体"),
          render: (val) => val ? val : "-",
          formRow: 8,
        },
        {
          fieldCode: "line2",
          fieldType: "EMPTY",
          render: (val, item) => {
            const length = this.$options.filters.calcCurrencyPrecision(
              item.currencyCode,
              "financialPrecision"
            );
            return (
              <SrmListHeader>
                {this.$T(
                  "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmountMeaning"
                ).$D("不含税总金额")}
                ：
                {this.$options.filters.calcMultipleDelimiter(
                  item.netAmount,
                  length
                )}
              </SrmListHeader>
            );
          },
          formRow: 1,
        },
        // {
        //   fieldCode: "netAmount",
        //   fieldType: "INPUT_NUMBER",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmountMeaning").$D("不含税总金额"),
        //   editor: false,
        //   precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        // },
        // {
        //   fieldCode: "netAmount",
        //   fieldType: "INPUT_NUMBER",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.billNetAmountMeaning").$D("本次对账不含税金额"),
        //   formRow: 7,
        //   editor: false,
        //   precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        // },
        // {
        //   fieldCode: "taxIncludedAmount",
        //   fieldType: "INPUT_NUMBER",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedAmountMeaning").$D("含税总金额"),
        //   formRow: 2,
        //   editor: false,
        //   precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        // },
        // {
        //   fieldCode: "taxIncludedAmount",
        //   fieldType: "INPUT_NUMBER",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.billTaxIncludedAmountMeaning").$D("本次对账含税金额"),
        //   formRow: 10,
        //   editor: false,
        //   precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        // },
        {
          fieldCode: "taxAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmountMeaning"
          ).$D("税额"),
          formRow: 3,
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        },
        {
          fieldCode: "line3",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleNum"
              ).$D("结算事务编号")}
              ：{item.settleNum}
            </SrmListHeader>,
          formRow: 1,
        },
        {
          fieldCode: "settleNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleNum"
          ).$D("结算事务编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "sourceSettleNumAndLineNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSettleNumAndLineNum"
          ).$D("结算事务来源编号｜行号"),
          render: (val) => val ? val : "-",
          formRow: 2,
        },
        {
          fieldCode: "itemCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemCode"
          ).$D("结算商品编码"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "itemName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemName1"
          ).$D("结算商品名称"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billQuantity"
          ).$D("本次对账数量"),
          formRow: 5,
          editor: () => false,
          // Boolean([ "NEW", "RETURN" ].includes(this.headInfo.billStatus)),
          disabled: () => false,
          inputChange: (val, record) => {
            this.callBackChange("quantity", val, record);
          },
        },
        {
          fieldCode: "unitPriceBatch",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.unitPriceBatch"
          ).$D("每"),
          render: (val) => val ? val : "-",
          formRow: 5,
        },
        {
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netPriceMeaning"
          ).$D("本次对账不含税单价"),
          formRow: 6,
          editor: () => false,
          // Boolean([ "NEW", "RETURN" ].includes(this.headInfo.billStatus)),
          disabled: () => false,
          inputChange: (val, record) => {
            this.callBackChange("netPrice", val, record);
          },
        },
        {
          fieldCode: "taxRate",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxRate"
          ).$D("税率"),
          render: (val) => val ? val : "-",
          formRow: 8,
        },
        {
          fieldCode: "taxIncludedPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedPriceMeaning"
          ).$D("本次对账含税单价"),
          render: (val) => val ? val : "-",
          formRow: 9,
        },
        {
          fieldCode: "line4",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              {$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.mainSettleConfigNum"
              ).$D("主结算策略编码")}
              ：{item.settleConfigNum}
            </SrmListHeader>,
          formRow: 1,
        },
        {
          fieldCode: "settleConfigNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.mainSettleConfigNum"
          ).$D("主结算策略编码"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "lineLimitQuantity",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.lineLimitQuantity"
          ).$D("对账单行数限制"),
          render: (val) =>
            val ?
              val :
              $T("ssta.purchaseSettle.model.purchaseSettle.noLimit").$D(
                "无限制"
              ),
          formRow: 2,
        },
        {
          fieldCode: "settleConfigName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.mainSettleConfigName"
          ).$D("主结算策略名称"),
          render: (val) => val ? val : "-",
          formRow: 3,
        },
        {
          fieldCode: "configVersionNumber",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.configVersionNumber"
          ).$D("主结算策略版本号"),
          render: (val) => val ? val : "-",
          formRow: 4,
        },
        {
          fieldCode: "autoIssueMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.autoIssueMeaning"
          ).$D("自动出单"),
          render: (val) => val ? val : "-",
          formRow: 5,
        },
        {
          fieldCode: "confirmCollaborativeModeMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.confirmCollaborativeModeMeaning"
          ).$D("协同模式-确认"),
          render: (val) => val ? val : "-",
          formRow: 6,
        },
        {
          fieldCode: "cancelCollaborativeModeMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.cancelCollaborativeModeMeaning"
          ).$D("协同模式-取消"),
          render: (val) => val ? val : "-",
          formRow: 8,
        },
        {
          fieldCode: "confirmApproveMethodMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.confirmApproveMethodMeaning"
          ).$D("审批方式-确认"),
          render: (val) => val ? val : "-",
          formRow: 7,
        },
        {
          fieldCode: "cancelApproveMethodMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.cancelApproveMethodMeaning"
          ).$D("审批方式-取消"),
          render: (val) => val ? val : "-",
          formRow: 9,
        },
        {
          fieldCode: "line5",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSettleNum"
              ).$D("结算事务来源编号")}
              ：{val ? val : "-"}
            </SrmListHeader>,
          formRow: 1,
        },
        {
          fieldCode: "sourceSettleNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSettleNum"
          ).$D("结算事务来源编号"),
          render: (val) => val ? val : "-",
          formRow: 1,
        },
        {
          fieldCode: "termCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.termCode"
          ).$D("付款编码"),
          render: (val) => val ? val : "-",
          formRow: 20,
        },
        {
          fieldCode: "purOrganizationName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.purOrganizationName"
          ).$D("采购组织"),
          render: (val) => val ? val : "-",
          formRow: 30,
        },
        {
          fieldCode: "invOrganizationName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invOrganizationName"
          ).$D("库存组织"),
          render: (val) => val ? val : "-",
          formRow: 30,
        },
        {
          fieldCode: "remark",
          fieldType: "TEXT_AREA",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.approvalRemark"
          ).$D("备注"),
          formRow: 33,
          editor: () => false,
          // Boolean([ "NEW", "RETURN" ].includes(this.headInfo.billStatus)),
          disabled: () => false,
          inputChange: (val) => {
            this.callBackChange("remark", val, {});
          },
        },
        {
          fieldCode: "canceledReason",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.canceledReason"
          ).$D("取消原因"),
          render: (val) => val ? val : "-",
          formRow: 50,
        },
        {
          fieldCode: "approvedRemark",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.approvedRemark"
          ).$D("审批意见-确认"),
          render: (val) => val ? val : "-",
          visible: () => [ "NEW" ].includes(this.headInfo.billStatus) ? 0 : 1,
          formRow: 60,
        },
        {
          fieldCode: "canceledRemark",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.canceledRemark"
          ).$D("审批意见-取消"),
          render: (val) => val ? val : "-",
          visible: () =>
            [
              "NEW",
              "SUBMITED",
              "SUBMITED_APPROVING",
              "WAIT_SUPPLIER_CONFIRM",
            ].includes(this.headInfo.billStatus) ?
              0 :
              1,
          formRow: 70,
        },
        {
          fieldCode: "poCreatedByName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.poCreatedByName"
          ).$D("订单创建人"),
          render: (val) => val ? val : "-",
          formRow: 80,
        },
      ];
      return columnList.find((v) => v.fieldCode === name) || {};
    },
    getLineFieldInfo(name) {
      if (name === "companyNum1") {
        return {
          fieldCode: "companyNum",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCustomerCompanyNum"
              ).$D("数据源客户公司编码") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCompanyNum"
              ).$D("数据源公司编码"),
          render: (val) => val ? val : "-",
        };
      }
      if (name === "companyNum2") {
        return {
          fieldCode: "companyNum",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCustomerCompanyNum"
              ).$D("结算客户公司编码") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCompanyNum"
              ).$D("结算公司编码"),
          render: (val) => val ? val : "-",
        };
      }
      if (name === "companyName1") {
        return {
          fieldCode: "companyName",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCustomerCompanyName"
              ).$D("数据源客户公司名称") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCompanyName"
              ).$D("数据源公司名称"),
          render: (val) => val ? val : "-",
        };
      }
      if (name === "companyName2") {
        return {
          fieldCode: "companyName",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCustomerCompanyName"
              ).$D("结算客户公司名称") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCompanyName"
              ).$D("结算公司名称"),
          render: (val) => val ? val : "-",
        };
      }
      let columnList = [
        {
          fieldCode: "1",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.type === "supplier" ?
                this.$T(
                  "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCustomerCompanyNum"
                ).$D("数据源客户公司编码") :
                this.$T(
                  "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCompanyNum"
                ).$D("数据源公司编码")}
              ：{val}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "companyNum",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCustomerCompanyNum"
              ).$D("数据源客户公司编码") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCompanyNum"
              ).$D("数据源公司编码"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "companyNum",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCustomerCompanyNum"
              ).$D("结算客户公司编码") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCompanyNum"
              ).$D("结算公司编码"),
          render: (val) => val ? val : "-",
        },
        // {
        //   fieldCode: "companyNum",
        //   fieldType: "TEXT",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCustomerCompanyNum").$D("数据源客户公司编码"),
        //   render: (val) => val ? val : "-",
        // },
        // {
        //   fieldCode: "companyNum",
        //   fieldType: "TEXT",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCustomerCompanyNum").$D("结算客户公司编码"),
        //   render: (val) => val ? val : "-",
        // },
        {
          fieldCode: "sourceSupplierCompanyName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSupplierName"
          ).$D("数据源供应商名称"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "sourceSupplierCompanyNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSupplierNum"
          ).$D("数据源供应商编码"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "companyName",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCustomerCompanyName"
              ).$D("数据源客户公司名称") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCompanyName"
              ).$D("数据源公司名称"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "companyName",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCustomerCompanyName"
              ).$D("结算客户公司名称") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCompanyName"
              ).$D("结算公司名称"),
          render: (val) => val ? val : "-",
        },
        // {
        //   fieldCode: "companyName",
        //   fieldType: "TEXT",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCustomerCompanyName").$D("数据源客户公司名称"),
        //   render: (val) => val ? val : "-",
        // },
        // {
        //   fieldCode: "companyName",
        //   fieldType: "TEXT",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCustomerCompanyName").$D("结算客户公司名称"),
        //   render: (val) => val ? val : "-",
        // },
        {
          fieldCode: "supplierCompanyNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierNum"
          ).$D("结算供应商编码"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "supplierCompanyName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierName"
          ).$D("结算供应商名称"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "2",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemCode"
              ).$D("结算商品编码")}
              ：{val}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "itemCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemCode"
          ).$D("结算商品编码"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "itemName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemName1"
          ).$D("结算商品名称"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "quantity",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsQuantity"
          ).$D("可结算数量"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "unitPriceBatch",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.unitPriceBatch"
          ).$D("每"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "netPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netPriceMeaning1"
          ).$D("不含税单价"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmountMeaning1"
          ).$D("不含税金额"),
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        },
        {
          fieldCode: "taxRate",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxRate"
          ).$D("税率"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "currencyCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.currencyCode"
          ).$D("结算币种"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "uom",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.uom"
          ).$D("单位"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "specificationsModel",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.spec"
          ).$D("规格型号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "srmItemCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.srmItemCode"
          ).$D("srm物料编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "categoryName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.categoryName"
          ).$D("物料分类"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "taxIncludedPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedPriceMeaning1"
          ).$D("含税单价"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedAmountMeaning1"
          ).$D("含税金额"),
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        },
        {
          fieldCode: "taxAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmountMeaning"
          ).$D("税额"),
          editor: false,
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            ),
        },
        {
          fieldCode: "3",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleNum1"
              ).$D("结算事务编号")}
              ：{val}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "settleNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleNum1"
          ).$D("结算事务编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "sourceSettleNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSettleNum"
          ).$D("结算事务来源编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "sourceSettleLineNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSettleLineNum"
          ).$D("结算事务来源行号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "dataSourceMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.dataSourceMeaning"
          ).$D("数据来源"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "trxDate",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.trxDate"
          ).$D("结算事务日期"),
          render: (val) => val ? dateFormat(val) : "-",
        },
        {
          fieldCode: "trxYear",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.trxYear"
          ).$D("事务年度"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "contractAndLineNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.contractAndLineNum"
          ).$D("协议编号|行号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "poAndLineNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.poAndLineNum1"
          ).$D("采购订单编号|行号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "asnAndLineNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.asnAndLineNum"
          ).$D("送货单号|行号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "poLineLocation",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.poLineLocation"
          ).$D("发运行"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "releaseNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.releaseNum"
          ).$D("发放号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "orderType",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.orderType"
          ).$D("订单类型"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "purOrganizationName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.purOrganizationName"
          ).$D("采购组织"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "invOrganizationName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invOrganizationName"
          ).$D("库存组织"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "inventoryName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.inventoryName"
          ).$D("库房"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "trxTypeCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.trxTypeCode"
          ).$D("事务类型编码"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "trxTypeCodeMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.trxTypeCodeName"
          ).$D("事务类型名称"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "createdByName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.createdByName"
          ).$D("创建人"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "purchaseAgentName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.purchaseAgentName"
          ).$D("采购员"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "sourceParentSettleLineNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceParentSettleLineNum"
          ).$D("父事务处理编号|行号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "freightFlag",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.freightFlag"
          ).$D("运费标识"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldCode: "ecPoNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.ecPoNum"
          ).$D("电商订单编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "ecPoSubNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.ecPoSubNum"
          ).$D("电商子订单编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "deliverTime",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.deliverTime"
          ).$D("妥投时间"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "deliverQuantity",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.deliverQuantity"
          ).$D("妥投数量"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "invoiceMethodMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceMethodMeaning"
          ).$D("开票方式"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "elecInvoiceView",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.elecInvoiceView"
          ).$D("查看电子发票"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "afterSalesStatusMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.afterSalesStatusMeaning"
          ).$D("电商售后状态"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "invoiceTypeMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.seoInvoiceType"
          ).$D("电商开票类型"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "costName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.costName"
          ).$D("成本中心"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "termCode",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.termOption"
          ).$D("付款条件"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "settleAttach",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleAttach"
          ).$D("结算事务行附件"),
          render: (val) =>
            <span
              style="color: #276ef1"
              onClick={(e) => {
                e.stopPropagation();
                this.showAttachRecords(1, val);
              }}
            >
              {$T("hipspfm.common.button.viewAttachments").$D("查看附件")}(
              {val ? "1" : "0"})
            </span>
          ,
        },
        {
          fieldCode: "pcSubjectLineNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.pcSubjectLineNum"
          ).$D("协议标的行号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "4",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedQuantity"
              ).$D("对账占用数量")}
              ：{val}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "billOccupiedQuantity",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedQuantity"
          ).$D("对账占用数量"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "billCompletedQuantity",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompletedQuantity"
          ).$D("对账完成数量"),
        },
        {
          fieldCode: "billOccupiedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedAmountMeaning"
          ).$D("对账占用含税金额"),
          editor: false,
        },
        {
          fieldCode: "billCompletedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompletedTaxAmountMeaning"
          ).$D("对账完成含税金额"),
          editor: false,
        },
        {
          fieldCode: "billRemoveFlag",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billRemoveFlag"
          ).$D("对账暂挂"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldCode: "billOccupiedNetAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedNetAmount"
          ).$D("对账占用不含税金额"),
          editor: false,
        },
        {
          fieldCode: "billOccupiedTaxAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedTaxAmount"
          ).$D("对账占用税额"),
          editor: false,
        },
        {
          fieldCode: "billCompletedNetAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompletedNetAmount"
          ).$D("对账完成不含税金额"),
          editor: false,
        },
        {
          fieldCode: "billCompletedTaxAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompletedTaxAmount"
          ).$D("对账完成税额"),
          editor: false,
        },
        {
          fieldCode: "billLockQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billLockQuantity"
          ).$D("对账锁定标记"),
          editor: false,
        },
        {
          fieldCode: "5",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedQuantity"
              ).$D("开票占用数量")}
              ：{val}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "invoiceOccupiedQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedQuantity"
          ).$D("开票占用数量"),
          editor: false,
        },
        {
          fieldCode: "invoiceCompletedQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedQuantity"
          ).$D("开票完成数量"),
          editor: false,
        },
        {
          fieldCode: "invoiceCompletedNetAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedNetAmountMeaning"
          ).$D("开票完成不含税金额"),
          editor: false,
        },
        {
          fieldCode: "invoiceCompletedTaxAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedTaxAmountMeaning"
          ).$D("开票完成税额"),
          editor: false,
        },
        {
          fieldCode: "invoiceRemoveFlag",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceRemoveFlag"
          ).$D("开票暂挂"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldCode: "invoiceOccupiedNetAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedNetAmountMeaning"
          ).$D("开票占用不含税金额"),
          editor: false,
        },
        {
          fieldCode: "invoiceOccupiedTaxAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedTaxAmountMeaning"
          ).$D("开票占用税额"),
          editor: false,
        },
        {
          fieldCode: "invoiceOccupiedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedAmountMeaning"
          ).$D("开票占用含税金额"),
          editor: false,
        },
        {
          fieldCode: "invoiceCompletedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedAmountMeaning"
          ).$D("开票完成含税金额"),
          editor: false,
        },
        {
          fieldCode: "invoiceLockQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceLockQuantity"
          ).$D("开票锁定标记"),
          editor: false,
        },
        {
          fieldCode: "6",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.type === "supplier" ?
                this.$T(
                  "ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectRemoveFlag"
                ).$D("收款暂挂") :
                this.$T(
                  "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentRemoveFlag"
                ).$D("付款暂挂")}
              ：
              {val ?
                this.$T("hipspfm.common.status.yes").$D("是") :
                this.$T("hipspfm.common.status.no").$D("否")}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "paymentRemoveFlag",
          fieldType: "TEXT",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectRemoveFlag"
              ).$D("收款暂挂") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentRemoveFlag"
              ).$D("付款暂挂"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldCode: "paymentRemoveFlag",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectRemoveFlag"
          ).$D("收款暂挂"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldCode: "paymentOccupiedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectOccupiedAmount"
              ).$D("收款占用金额") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentOccupiedAmount"
              ).$D("付款占用金额"),
          editor: false,
        },
        // {
        //   fieldCode: "paymentOccupiedAmount",
        //   fieldType: "INPUT_NUMBER",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectOccupiedAmount").$D("收款占用金额"),
        //   editor: false,
        // },
        {
          fieldCode: "paymentCompletedAmount",
          fieldType: "INPUT_NUMBER",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectCompletedAmount"
              ).$D("收款完成金额") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentCompletedAmount"
              ).$D("付款完成金额"),
          editor: false,
        },
        // {
        //   fieldCode: "paymentCompletedAmount",
        //   fieldType: "INPUT_NUMBER",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectCompletedAmount").$D("收款完成金额"),
        //   editor: false,
        // },
        {
          fieldCode: "paymentLockQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName:
            this.type === "supplier" ?
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectLockQuantity"
              ).$D("收款锁定标记") :
              $T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentLockQuantity"
              ).$D("付款锁定标记"),
          editor: false,
        },
        // {
        //   fieldCode: "paymentLockQuantity",
        //   fieldType: "INPUT_NUMBER",
        //   fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.collectLockQuantity").$D("收款锁定标记"),
        //   editor: false,
        // },
        {
          fieldCode: "7",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleConfigNum"
              ).$D("结算策略编号")}
              ：{val}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "settleConfigNum",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleConfigNum"
          ).$D("结算策略编号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "settleConfigName",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleConfigName"
          ).$D("结算策略名称"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "settleBasePriceMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleBasePrice"
          ).$D("结算基准价"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "settleModeMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleMode"
          ).$D("结算模式"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "settleMatchDimensionMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleMatchDimension"
          ).$D("结算匹配维度"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "versionNumber",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.versionNumber"
          ).$D("版本号"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "8",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.$T(
                "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompany1"
              ).$D("对账公司")}
              ：{val}
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "billCompanyMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompany1"
          ).$D("对账公司"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "billSupplierMeaning",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billSupplier"
          ).$D("对账供应商"),
          render: (val) => val ? val : "-",
        },
        {
          fieldCode: "paymentPartMatchFlag",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.partMatchFlag"
          ).$D("部分匹配"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldCode: "amountAdjustFlag",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoicePriceEdit"
          ).$D("单价调整"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldCode: "dependencyFlag",
          fieldType: "TEXT",
          fieldName: $T(
            "ssta.purchaseInvoicePool.model.purchaseInvoicePool.dependencyFlag"
          ).$D("是否依赖"),
          render: (val) =>
            val ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
      ];
      return columnList.find((v) => v.fieldCode === name) || {};
    },
  },
  // 获取字段配置
  computed: {
    // 头
    getHeadColumns() {
      let nameList = [
        "header",
        "createdUserName",
        "creationDate",
        "campMeaning",
        "currencyCode",
        "companyNum",
        "companyName",
        "supplierCompanyNum",
        "supplierCompanyName",
        "sourceSupplierCompanyName",
        "sourceSupplierCompanyNum",
        "supplierSiteCode",
        "ouName",
        // 其他信息
        // "line5",
        // "purOrganizationName",
        // "termCode",
        // "invOrganizationName",
        // "remark",
        // "canceledReason",
        // "poCreatedByName",
        // "approvedRemark",
        // "canceledRemark",
      ];
      let columns = nameList.map((res) => this.getFieldInfo(res));
      return columns;
    },
    // 行
    getLineColumns() {
      return (flag) => {
        let nameList = [];
        // if (flag === "payInfoTab") {
        //   nameList = [
        //     "line1",
        //     "companyNum",
        //     "companyName",
        //     "supplierCompanyNum",
        //     "supplierCompanyName",
        //     "sourceSupplierCompanyName",
        //     "sourceSupplierCompanyNum",
        //     "supplierSiteCode",
        //     "ouName",
        //   ];
        // }
        if (flag === "amountInfoTab") {
          nameList = [ "line2", "taxIncludedAmount1", "taxAmount" ];
        }
        if (flag === "detailInfoTab") {
          nameList = [
            "line3",
            "sourceSettleNumAndLineNum",
            "itemCode",
            "itemName",
            "quantity",
            "unitPriceBatch",
            "netPrice",
            "netAmount2",
            "taxRate",
            "taxAmount",
            "taxIncludedPriceMeaning",
            "taxIncludedAmount2",
          ];
        }
        if (flag === "mainConfigInfoTab") {
          nameList = [
            "line4",
            "lineLimitQuantity",
            "settleConfigName",
            "configVersionNumber",
            "autoIssueMeaning",
          ];
        }
        // if (flag === "otherInfoTab") {
        //   nameList = [
        //     "line5",
        //     "purOrganizationName",
        //     "termCode",
        //     "invOrganizationName",
        //     "remark",
        //     "canceledReason",
        //     "poCreatedByName",
        //     "approvedRemark",
        //     "canceledRemark",
        //   ];
        // }
        let columns = nameList.map((res) => this.getFieldInfo(res));
        return columns;
      };
    },
    // 详情
    getDetailColumns() {
      return (flag) => {
        let nameList = [
          "billNum",
          "billStatusMeaning",
          "campMeaning",
          "createdUserName",
          "creationDate",
          // 交易方信息
          "companyNum",
          "companyName",
          "currencyCode",
          "supplierCompanyNum",
          "supplierCompanyName",
          "sourceSupplierCompanyName",
          "sourceSupplierCompanyNum",
          "supplierSiteCode",
          "ouName",
          // 其他信息
          "sourceSettleNum",
          "purOrganizationName",
          "termCode",
          "invOrganizationName",
          "remark",
          "canceledReason",
          "poCreatedByName",
          "approvedRemark",
          "canceledRemark",
        ];
        // if (flag === "line1") {
        //   nameList = [
        //     "companyNum",
        //     "companyName",
        //     "currencyCode",
        //     "supplierCompanyNum",
        //     "supplierCompanyName",
        //     "sourceSupplierCompanyName",
        //     "sourceSupplierCompanyNum",
        //     "supplierSiteCode",
        //     "ouName",
        //   ];
        // }
        if (flag === "line2") {
          nameList = [ "netAmount1", "taxIncludedAmount1", "taxAmount" ];
        }
        if (flag === "line4") {
          nameList = [
            "settleConfigNum",
            "lineLimitQuantity",
            "settleConfigName",
            "configVersionNumber",
            "autoIssueMeaning",
          ];
          if (this.type === "supplier") {
            nameList = [
              "settleConfigNum",
              "lineLimitQuantity",
              "settleConfigName",
              "configVersionNumber",
              "autoIssueMeaning",
              "confirmCollaborativeModeMeaning",
              "confirmApproveMethodMeaning",
              "cancelCollaborativeModeMeaning",
              "cancelApproveMethodMeaning",
            ];
          }
        }
        // if (flag === "line5") {
        //   nameList = [
        //     "sourceSettleNum",
        //     "purOrganizationName",
        //     "termCode",
        //     "invOrganizationName",
        //     "remark",
        //     "canceledReason",
        //     "poCreatedByName",
        //     "approvedRemark",
        //     "canceledRemark",
        //   ];
        // }
        let columns = nameList.map((res, index) => ({
          ...this.getFieldInfo(res),
          formRow: index,
        }));
        return columns;
      };
    },
    // 交易明细详情
    getLineInfoColumns() {
      return (flag) => {
        let nameList = [];
        if (flag === "1") {
          nameList = [
            "1",
            "companyName1",
            "sourceSupplierCompanyName",
            "sourceSupplierCompanyNum",
            "companyNum2",
            "companyName2",
          ];
        }
        if (flag === "2") {
          nameList = [
            "2",
            "itemName",
            "quantity",
            "unitPriceBatch",
            "netPriceMeaning",
            "netAmount",
            "taxRate",
            "currencyCode",
            "uom",
            "specificationsModel",
          ];
        }
        if (flag === "3") {
          nameList = [
            "3",
            "sourceSettleNum",
            "sourceSettleLineNum",
            "dataSourceMeaning",
            "trxDate",
            "settleAttach",
          ];
        }
        if (flag === "4") {
          nameList = [
            "4",
            "billOccupiedAmount",
            "billCompletedQuantity",
            "billCompletedAmount",
            "billRemoveFlag",
            "billOccupiedNetAmount",
            "billOccupiedTaxAmount",
            "billCompletedNetAmount",
            "billCompletedTaxAmount",
            "billLockQuantity",
          ];
        }
        if (flag === "5") {
          nameList = [
            "5",
            "invoiceCompletedQuantity",
            "invoiceCompletedNetAmount",
            "invoiceCompletedTaxAmount",
            "invoiceRemoveFlag",
            "invoiceOccupiedNetAmount",
            "invoiceOccupiedTaxAmount",
            "invoiceOccupiedAmount",
            "invoiceCompletedAmount",
          ];
        }
        if (flag === "6") {
          nameList = [
            "6",
            "paymentOccupiedAmount",
            "paymentCompletedAmount",
            "paymentLockQuantity",
          ];
        }
        if (flag === "7") {
          nameList = [
            "7",
            "settleConfigName",
            "settleBasePriceMeaning",
            "settleModeMeaning",
            "settleMatchDimensionMeaning",
            "versionNumber",
          ];
        }
        if (flag === "8") {
          nameList = [
            "8",
            "billSupplierMeaning",
            "paymentPartMatchFlag",
            "amountAdjustFlag",
            "dependencyFlag",
          ];
          if (this.type === "supplier") {
            nameList = [ "8", "billSupplierMeaning" ];
          }
        }
        let columns = nameList.map((res, index) => ({
          ...this.getLineFieldInfo(res),
          formRow: index,
        }));
        return columns;
      };
    },
    // 交易明细详情 - 行信息
    getLineDetailColumns() {
      return (flag) => {
        let nameList = [];
        if (flag === "1") {
          nameList = [
            "companyNum1",
            "companyName1",
            "sourceSupplierCompanyName",
            "sourceSupplierCompanyNum",
            "companyNum2",
            "companyName2",
            "supplierCompanyNum",
            "supplierCompanyName",
          ];
        }
        if (flag === "2") {
          nameList = [
            "itemCode",
            "itemName",
            "quantity",
            "unitPriceBatch",
            "netPriceMeaning",
            "netAmount",
            "taxRate",
            "currencyCode",
            "uom",
            "specificationsModel",
            "srmItemCode",
            "categoryName",
            "taxIncludedPriceMeaning",
            "taxIncludedAmount",
            "taxAmount",
          ];
        }
        if (flag === "3") {
          nameList = [
            "settleNum",
            "sourceSettleNum",
            "sourceSettleLineNum",
            "dataSourceMeaning",
            "trxDate",
            "trxYear",
            "contractAndLineNum",
            "poAndLineNum",
            "asnAndLineNum",
            "poLineLocation",
            "releaseNum",
            "orderType",
            "purOrganizationName",
            "invOrganizationName",
            "inventoryName",
            "trxTypeCode",
            "trxTypeCodeMeaning",
            "createdByName",
            "purchaseAgentName",
            "sourceParentSettleLineNum",
            "freightFlag",
            "ecPoNum",
            "ecPoSubNum",
            "deliverTime",
            "deliverQuantity",
            "invoiceMethodMeaning",
            "elecInvoiceView",
            "afterSalesStatusMeaning",
            "invoiceTypeMeaning",
            "costName",
            "termCode",
            "settleAttach",
            "pcSubjectLineNum",
          ];
        }
        if (flag === "4") {
          nameList = [
            "billOccupiedQuantity",
            "billCompletedQuantity",
            "billOccupiedAmount",
            "billCompletedAmount",
            "billRemoveFlag",
            "billOccupiedNetAmount",
            "billOccupiedTaxAmount",
            "billCompletedNetAmount",
            "billCompletedTaxAmount",
            "billLockQuantity",
          ];
        }
        if (flag === "5") {
          nameList = [
            "invoiceOccupiedQuantity",
            "invoiceCompletedQuantity",
            "invoiceCompletedNetAmount",
            "invoiceCompletedTaxAmount",
            "invoiceRemoveFlag",
            "invoiceOccupiedNetAmount",
            "invoiceOccupiedTaxAmount",
            "invoiceOccupiedAmount",
            "invoiceCompletedAmount",
            "invoiceLockQuantity",
          ];
        }
        if (flag === "6") {
          nameList = [
            "paymentRemoveFlag",
            "paymentOccupiedAmount",
            "paymentCompletedAmount",
            "paymentLockQuantity",
          ];
        }
        if (flag === "7") {
          nameList = [
            "settleConfigNum",
            "settleConfigName",
            "settleBasePriceMeaning",
            "settleModeMeaning",
            "settleMatchDimensionMeaning",
            "versionNumber",
          ];
        }
        if (flag === "8") {
          nameList = [
            "billCompanyMeaning",
            "billSupplierMeaning",
            "paymentPartMatchFlag",
            "amountAdjustFlag",
            "dependencyFlag",
          ];
          if (this.type === "supplier") {
            nameList = [ "billCompanyMeaning", "billSupplierMeaning" ];
          }
        }
        let columns = nameList.map((res, index) => ({
          ...this.getLineFieldInfo(res),
          formRow: index,
        }));
        return columns;
      };
    },
  },
};
