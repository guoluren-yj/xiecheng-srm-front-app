import { $T } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";
import { getHeaderApi, getLineApi } from "../api";

export default {
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      initLoading: true,
      loading: false,
      headInfo: {}, // 头信息
      linesInfo: [ {} ], // 行信息
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
      await getHeaderApi(this.changeReqId, {
        page: 0,
        size: 1000,
      }).then((res) => {
        this.headInfo = { ...res };
      });
    },
    // 行信息
    async fetchLine() {
      await getLineApi(this.changeReqId, {
        page: 0,
        size: 1000,
      }).then((res) => {
        this.linesInfo = res.content;
      });
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "noData": this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "baseInfo": this.$T("ssta.invoicePool.view.panel.panel.baseInfo").$D("基本信息"),
        "invoiceLineInfo": this.$T("ssta.invoicePool.view.panel.panel.invoiceLineInfo").$D("发票行信息"),
      };
      return languageList[key] || key;
    },
    // 获取 lov值集
    getLovCode(key) {
      const lovList = {
      };
      return lovList[key] || "";
    },
  },
  // 获取字段配置
  computed: {
    // 头
    getHeadColumns() {
      return [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          fieldName: "header",
          render: (val, item) => {
            const invoiceStatus = item.invoiceStatus;
            const statusType = {
              NORMAL: "success",
              NEGATIVE: "danger",
              INVALID: "info",
            };
            return <div style="width: 100%">
              <SrmListHeader>
                {item.invoiceNum}
                <SrmButton slot="right" plain rect
                  style={{ fontWeight: "bold" }}
                  type={statusType[invoiceStatus]}>
                  {item.invoiceStatusMeaning}
                </SrmButton>
              </SrmListHeader>
            </div>;
          },
          formRow: 1,
        },
        {
          fieldCode: "invoiceCode",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceAndNum").$D("发票代码"),
          formRow: 2,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "invoiceTypeMeaning",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceTypeMeaning").$D("发票类型"),
          formRow: 3,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "invoicingDate",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoicingDate").$D("开票日期"),
          render: (val) => dateFormat(val),
          formRow: 3,
        },
        {
          fieldCode: "sumCheckTimes",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.sumCheckTimes").$D("累计查验次数"),
          render: (val) => val || "-",
          formRow: 4,
        },
        {
          fieldCode: "checkTimes",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.checkTimes").$D("当天查验次数"),
          render: (val) => val || "-",
          formRow: 4,
        },
        {
          fieldCode: "supplierCompanyName",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierCompanyName").$D("销方名称"),
          formRow: 5,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "supUnifiedSocialCode",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supUnifiedSocialCode").$D("销方税号"),
          formRow: 6,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "supAccount",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supAccount").$D("销方银行帐号"),
          formRow: 7,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "supAddrAndTel",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supAddrAndTel").$D("销方地址电话"),
          formRow: 8,
          render: (val) => val ? val : "-"
        },
      ];
    },
    // 行
    getLineColumns() {
      return [
        {
          fieldCode: "line",
          fieldType: "EMPTY",
          fieldName: "line",
          render: (val, item) => <div style="width: 100%">
            <SrmListHeader>
              {item.itemName}
            </SrmListHeader>
          </div>,
          formRow: 1,
        },
        {
          fieldCode: "netAmount",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmount").$D("不含税金额"),
          formRow: 2,
          render: (val) =>
            // eslint-disable-next-line new-cap
            val ? this.$options.filters["CalcMoney"](val) : "-"
        },
        {
          fieldCode: "taxIncludedAmount",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedAmount").$D("价格合计"),
          formRow: 3,
          render: (val) =>
            // eslint-disable-next-line new-cap
            val ? this.$options.filters["CalcMoney"](val) : "-"
        },
        {
          fieldCode: "quantity",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.quantity").$D("数量"),
          formRow: 3,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "taxRate",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxRate").$D("税率"),
          formRow: 4,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "taxAmount",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmount").$D("税额"),
          formRow: 4,
          render: (val) =>
            // eslint-disable-next-line new-cap
            val ? this.$options.filters["CalcMoney"](val) : "-"
        },
        {
          fieldCode: "taxIncludedPrice",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedPrice").$D("含税单价"),
          formRow: 5,
          render: (val) =>
            // eslint-disable-next-line new-cap
            val ? this.$options.filters["CalcMoney"](val) : "-"
        },
        {
          fieldCode: "netPrice",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.netPrice").$D("不含税单价"),
          formRow: 5,
          render: (val) =>
            // eslint-disable-next-line new-cap
            val ? this.$options.filters["CalcMoney"](val) : "-"
        },
        {
          fieldCode: "uom",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.uom").$D("单位"),
          formRow: 6,
          render: (val) => val ? val : "-"
        },
        {
          fieldCode: "lineNum",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.lineNum").$D("行号"),
          formRow: 6,
        },
        {
          fieldCode: "spec",
          fieldType: "TEXT",
          fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.spec").$D("规格型号"),
          formRow: 7,
          render: (val) => val ? val : "-"
        },
      ];
    },
    // 详情
    getDetailColumns() {
      return (flag) => {
        if (flag === "line") {
          return [
            {
              fieldCode: "lineNum",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.lineNum").$D("行号"),
              formRow: 6,
            },
            {
              fieldCode: "netAmount",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmount").$D("不含税金额"),
              formRow: 2,
              render: (val) =>
                // eslint-disable-next-line new-cap
                val ? this.$options.filters["CalcMoney"](val) : "-"
            },
            {
              fieldCode: "taxIncludedAmount",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedAmount").$D("价格合计"),
              formRow: 3,
              render: (val) =>
                // eslint-disable-next-line new-cap
                val ? this.$options.filters["CalcMoney"](val) : "-"
            },
            {
              fieldCode: "quantity",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.quantity").$D("数量"),
              formRow: 3,
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "taxRate",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxRate").$D("税率"),
              formRow: 4,
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "taxAmount",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmount").$D("税额"),
              formRow: 4,
              render: (val) =>
                // eslint-disable-next-line new-cap
                val ? this.$options.filters["CalcMoney"](val) : "-"
            },
            {
              fieldCode: "taxIncludedPrice",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedPrice").$D("含税单价"),
              formRow: 5,
              render: (val) =>
                // eslint-disable-next-line new-cap
                val ? this.$options.filters["CalcMoney"](val) : "-"
            },
            {
              fieldCode: "netPrice",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.netPrice").$D("不含税单价"),
              formRow: 5,
              render: (val) =>
                // eslint-disable-next-line new-cap
                val ? this.$options.filters["CalcMoney"](val) : "-"
            },
            {
              fieldCode: "uom",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.uom").$D("单位"),
              formRow: 6,
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "lineNum",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.lineNum").$D("行号"),
              formRow: 6,
            },
            {
              fieldCode: "spec",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.spec").$D("规格型号"),
              formRow: 7,
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "expenseItem",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.expenseItem").$D("费用项目(货运发票)"),
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "plateNo",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.plateNo").$D("车牌号(通行费)"),
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "trafficDateStart",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.trafficDateStart").$D("通行日期起(通行费)"),
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "trafficDateEnd",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.trafficDateEnd").$D("通行日期至(通行费)"),
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "trafficTypeMeaning",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.trafficTypeMeaning").$D("类型"),
              render: (val) => val ? val : "-"
            },
            {
              fieldCode: "itemName",
              fieldType: "TEXT",
              fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemName").$D("货物或应税劳务，服务名称"),
              render: (val) => val ? val : "-"
            },
          ];
        }
        return [
          {
            fieldCode: "invoiceCode",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceAndNum").$D("发票代码"),
            formRow: 2,
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "invoiceTypeMeaning",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceTypeMeaning").$D("发票类型"),
            formRow: 3,
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "invoicingDate",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoicingDate").$D("开票日期"),
            render: (val) => dateFormat(val),
            formRow: 3,
          },
          {
            fieldCode: "sumCheckTimes",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.sumCheckTimes").$D("累计查验次数"),
            render: (val) => val || "-",
            formRow: 4,
          },
          {
            fieldCode: "checkTimes",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.checkTimes").$D("当天查验次数"),
            render: (val) => val || "-",
            formRow: 4,
          },
          {
            fieldCode: "supplierCompanyName",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierCompanyName").$D("销方名称"),
            formRow: 5,
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "supUnifiedSocialCode",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supUnifiedSocialCode").$D("销方税号"),
            formRow: 6,
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "supAccount",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supAccount").$D("销方银行帐号"),
            formRow: 7,
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "supAddrAndTel",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.supAddrAndTel").$D("销方地址电话"),
            formRow: 8,
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "machineNum",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.machineNum").$D("机器编号"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "checkCode",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.checkCode").$D("检验码"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "companyName",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.companyName").$D("购方名称"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "purUnifiedSocialCode",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.purUnifiedSocialCode").$D("购方税号"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "purAccount",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.purAccount").$D("购方银行帐号"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "purAddrAndTel",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.purAddrAndTel").$D("购方地址电话"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "netAmount",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmount").$D("不含税金额"),
            render: (val) =>
              // eslint-disable-next-line new-cap
              val ? this.$options.filters["CalcMoney"](val) : "-"
          },
          {
            fieldCode: "taxAmount",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmount").$D("税额"),
            render: (val) =>
              // eslint-disable-next-line new-cap
              val ? this.$options.filters["CalcMoney"](val) : "-"
          },
          {
            fieldCode: "taxIncludedAmount",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedAmount").$D("价格合计"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "zeroTaxRateFlagMeaning",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.zeroTaxRateFlagMeaning").$D("零税率标志"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "tollFlagMeaning",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.tollFlagMeaning").$D("通行费标志"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "invalidFlagMeaning",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invalidFlagMeaning").$D("作废标志"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "drawer",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.drawer").$D("开票人"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "payee",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.payee").$D("收款人"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "reviewer",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.reviewer").$D("复核人"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "blueInvoiceNum",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.blueInvoiceNum").$D("蓝票发票代码"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "blueInvoiceCode",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.blueInvoiceCode").$D("蓝票发票号码"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "fileUrl",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.fileUrl").$D("文件url"),
            render: (val) => val ? val : "-"
          },
          {
            fieldCode: "remark",
            fieldType: "TEXT",
            fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.remark").$D("备注"),
            render: (val) => val ? val : "-"
          },
        ];
      };
    }
  }
};