// 需求计划的页面 - 公共部分
import { getHeaderApi } from "../api";
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import { commonDs, lineDs } from "../datasource/indexDs";
import { dateFormat } from "@/utils/index";

export default {
  data() {
    return {
      commonDataSet: new DataSet(commonDs()), // 基础信息
      lineDataSet: new DataSet(lineDs()), // 需求计划明细信息
      showPage: true,
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "rpNum",
              fieldName: $T("sprm.common.model.common.rpNum").$D("需求计划单号"),
              // fieldType: "EMPTY",
              // render: (val, item) => <div style="width:100%;display: flex;align-items: center;">
              //   <span style={{ fontWeight: 600 }}>{item.rpNum || "-"}</span>
              //   <div style="display: flex;align-items: center;marginLeft:auto">
              //     <span class="srm-icon icon-chevron-right" style={{ fontSize: "16px" }} />
              //   </div>
              // </div>,
              formRow: 10,
            },
            {
              fieldCode: "createdByName",
              fieldName: $T("sprm.common.model.common.createdByName").$D("创建人"),
              formRow: 20,
            },
            {
              fieldCode: "rpTypeName",
              fieldName: $T("sprm.common.model.common.rpTypeName").$D("需求计划类型"),
              formRow: 20,
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("sprm.common.model.common.creationDate").$D("创建时间"),
              formRow: 30,
            },
            {
              fieldCode: "originalCurrency",
              fieldName: $T("sprm.common.model.common.originalCurrency").$D("原币币种"),
              formRow: 40,
            },
            {
              fieldCode: "localCurrency",
              fieldName: $T("sprm.common.model.common.localCurrency").$D("本币币种"),
              formRow: 40,
            },
            {
              fieldCode: "localCurrencyNoTaxSum",
              fieldName: $T("sprm.common.model.common.localCurrencyNoTaxSum").$D("本币总金额(不含税)"),
              render: (val, record) => this.amountRender("localCurrencyNoTaxSum", record, record.headerPriceHiddenFlag, record.localFinancialPrecision),
              formRow: 50,
            },
            {
              fieldCode: "localCurrencyTaxSum",
              fieldName: $T("sprm.common.model.common.localCurrencyTaxSum").$D("本币总金额(含税)"),
              render: (val, record) => this.amountRender("localCurrencyTaxSum", record, record.headerPriceHiddenFlag, record.localFinancialPrecision),
              formRow: 50,
            },
            {
              fieldCode: "amount",
              fieldName: $T("sprm.common.model.common.planAmount").$D("计划总额"),
              render: (val, record) => this.amountRender("amount", record, record.headerPriceHiddenFlag, record.financialPrecision),
              formRow: 60,
            },
          ];
        case "organization":
          return [
            {
              fieldCode: "companyName",
              fieldType: "EMPTY",
              fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
              render: (val, item) => <SrmListHeader showOpenTag={false}>
                <span>{item.companyName || "-"}</span>
              </SrmListHeader>,
            },
            {
              fieldCode: "ouName",
              fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
            },
            {
              fieldCode: "purchaseOrgName",
              fieldName: $T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
            },
            {
              fieldCode: "unitName",
              fieldName: $T("sprm.common.model.common.unitName").$D("所属部门"),
            },
            {
              fieldCode: "purchaseAgentName",
              fieldName: $T("sprm.common.model.common.planAgentName").$D("计划员"),
            },
          ];
        case "detailInfo":
          return [
            {
              fieldCode: "itemName",
              fieldName: $T("sprm.common.model.common.itemName").$D("物料名称"),
              formRow: 30,
              fieldType: "EMPTY",
              render: (val, item) => <div style="width:100%;display: flex;align-items: center;">
                <span style={{ fontWeight: 600 }}>{item.itemName || "-"}</span>
                <div style="display: flex;align-items: center;marginLeft:auto">
                  <span class="srm-icon icon-chevron-right" style={{ fontSize: "16px" }} />
                </div>
              </div>
            },
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sprm.common.model.common.displayLineNum").$D("行号"),
              // fieldType: "EMPTY",
              // render: (val, item) => <SrmListHeader>
              //   <span>{item.displayLineNum || "-"}</span>
              // </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "invOrganizationName",
              fieldName: $T("sprm.common.model.common.invOrganizationName").$D("库存组织"),
              formRow: 20,
            },
            {
              fieldCode: "itemCode",
              fieldName: $T("sprm.common.model.common.itemCode").$D("物料编码"),
              formRow: 30,
            },

            {
              fieldCode: "uomName",
              fieldName: $T("sprm.common.model.common.uomCodeAndName").$D("单位"),
              formRow: 40,
            },
            {
              fieldCode: "quantity",
              fieldName: $T("sprm.common.model.common.quantity").$D("数量"),
              formRow: 40,
              render: (val) => SrmUtil.getNumberLocalized(val),
            },
            {
              fieldCode: "neededDate",
              fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
              formRow: 50,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sprm.common.model.common.remark").$D("备注"),
              formRow: 60,
            },
          ];
        case "attachInfo":
          return [
            {
              fieldName: this.$T("sprm.common.model.common.enterEnclosure").$D("内部附件"),
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              showCount: true,
              formRow: 10,
            },
            {
              fieldName: this.$T("sprm.common.view.outsideAttachment").$D("外部附件"),
              fieldCode: "externalAttachmentUuid",
              fieldType: "UPLOAD",
              showCount: true,
              formRow: 20,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "rpNum",
              fieldName: $T("sprm.common.model.common.rpNum").$D("需求计划单号"),
            },
            {
              fieldCode: "createdByName",
              fieldName: $T("sprm.common.model.common.createdByName").$D("创建人"),
            },
            {
              fieldCode: "rpTypeName",
              fieldName: $T("sprm.common.model.common.rpTypeName").$D("需求计划类型"),
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("sprm.common.model.common.creationDate").$D("创建时间"),
            },
            {
              fieldCode: "originalCurrency",
              fieldName: $T("sprm.common.model.common.originalCurrency").$D("原币币种"),
            },
            {
              fieldCode: "localCurrency",
              fieldName: $T("sprm.common.model.common.localCurrency").$D("本币币种"),
            },
            {
              fieldCode: "localCurrencyNoTaxSum",
              fieldName: $T("sprm.common.model.common.localCurrencyNoTaxSum").$D("本币总金额(不含税)"),
              render: (val, record) => this.amountRender("localCurrencyNoTaxSum", record, record.headerPriceHiddenFlag, record.localFinancialPrecision),
            },
            {
              fieldCode: "localCurrencyTaxSum",
              fieldName: $T("sprm.common.model.common.localCurrencyTaxSum").$D("本币总金额(含税)"),
              render: (val, record) => this.amountRender("localCurrencyTaxSum", record, record.headerPriceHiddenFlag, record.localFinancialPrecision),
            },
            {
              fieldCode: "amount",
              fieldName: $T("sprm.common.model.common.planAmount").$D("计划总额"),
              render: (val, record) => this.amountRender("amount", record, record.headerPriceHiddenFlag, record.financialPrecision),
            },
            {
              fieldCode: "containerName",
              fieldName: $T("sprm.common.model.common.container").$D("需求计划"),
            },
            {
              fieldCode: "requestDate",
              fieldName: $T("sprm.common.model.common.requestDate").$D("申请日期"),
              render: (val) => val ? dateFormat(val) : "-",
            },
            {
              fieldCode: "requestedByName",
              fieldName: $T("sprm.common.model.common.requestedBy").$D("申请人"),
            },
            {
              fieldCode: "remark",
              fieldName: $T("sprm.common.model.common.remark").$D("备注"),
            },
          ];
        case "organizationDetail":
          return [
            {
              fieldCode: "companyName",
              fieldName: $T("sprm.common.model.common.company").$D("公司"),
            },
            {
              fieldCode: "ouName",
              fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
            },
            {
              fieldCode: "purchaseOrgName",
              fieldName: $T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
            },
            {
              fieldCode: "unitName",
              fieldName: $T("sprm.common.model.common.unitName").$D("所属部门"),
            },
            {
              fieldCode: "purchaseAgentName",
              fieldName: $T("sprm.common.model.common.planAgentName").$D("计划员"),
            },
          ];
        case "detailInfoDetail":
          return [
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sprm.common.model.common.displayLineNum").$D("行号"),
            },
            {
              fieldCode: "invOrganizationName",
              fieldName: $T("sprm.common.model.common.invOrganizationName").$D("库存组织"),
            },
            {
              fieldCode: "itemCode",
              fieldName: $T("sprm.common.model.common.itemCode").$D("物料编码"),
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sprm.common.model.common.itemName").$D("物料名称"),
            },
            {
              fieldCode: "categoryName",
              fieldName: $T("sprm.common.model.common.categoryName").$D("物料分类"),
            },
            {
              fieldCode: "itemModel",
              fieldName: $T("sprm.common.model.common.itemModel").$D("规格"),
            },
            {
              fieldCode: "itemSpecs",
              fieldName: $T("sprm.common.model.common.itemSpecs").$D("型号"),
            },
            {
              fieldCode: "uomName",
              fieldName: $T("sprm.common.model.common.uomCodeAndName").$D("单位"),
            },
            {
              fieldCode: "neededDate",
              fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
            },
            {
              fieldCode: "quantity",
              fieldName: $T("sprm.common.model.common.quantity").$D("数量"),
              render: (val) => SrmUtil.getNumberLocalized(val),
            },
            {
              fieldCode: "taxCode",
              fieldName: $T("sprm.common.model.common.taxCode").$D("税种"),
            },
            {
              fieldCode: "taxRate",
              fieldName: $T("sprm.common.model.common.taxRate").$D("税率"),
            },
            {
              fieldCode: "unitPrice",
              fieldName: $T("sprm.common.model.common.unitPriceNew").$D("预估单价(不含税)"),
              render: (val, record) => this.amountRender("unitPrice", record, record.linePriceHiddenFlag, "", "price"),
            },
            {
              fieldCode: "taxIncludedUnitPrice",
              fieldName: $T("sprm.common.model.common.taxIncludedUnitPriceNew").$D("预估单价(含税)"),
              render: (val, record) => this.amountRender("taxIncludedUnitPrice", record, record.linePriceHiddenFlag, "", "price"),
            },
            {
              fieldCode: "lineAmount",
              fieldName: $T("sprm.common.model.common.lineNoAmountNew").$D("原币行金额(不含税)"),
              render: (val, record) => this.amountRender("lineAmount", record, record.linePriceHiddenFlag, record.financialPrecision),
            },
            {
              fieldCode: "taxIncludedLineAmount",
              fieldName: $T("sprm.common.model.common.taxIncludedLineAmountNew").$D("原币行金额(含税)"),
              render: (val, record) => this.amountRender("taxIncludedLineAmount", record, record.linePriceHiddenFlag, record.financialPrecision),
            },
            {
              fieldCode: "localCurrencyNoTaxSum",
              fieldName: $T("sprm.common.model.common.localCurrencyNoTaxSum").$D("本币金额(不含税)"),
              render: (val, record) => this.amountRender("localCurrencyNoTaxSum", record, record.linePriceHiddenFlag, record.localFinancialPrecision),
            },
            {
              fieldCode: "localCurrencyTaxSum",
              fieldName: $T("sprm.common.model.common.localCurrencyTaxSum").$D("本币金额(含税)"),
              render: (val, record) => this.amountRender("localCurrencyTaxSum", record, record.linePriceHiddenFlag, record.localFinancialPrecision),
            },
            {
              fieldCode: "localCurrencyNoTaxUnit",
              fieldName: $T("sprm.common.model.common.localCurrencyNoTaxUnit").$D("本币单价(不含税)"),
              render: (val, record) => this.amountRender("localCurrencyNoTaxUnit", record, record.linePriceHiddenFlag, record.localDefaultPrecision, "price"),
            },
            {
              fieldCode: "localCurrencyTaxUnit",
              fieldName: $T("sprm.common.model.common.localCurrencyTaxUnit").$D("本币单价(含税)"),
              render: (val, record) => this.amountRender("localCurrencyTaxUnit", record, record.linePriceHiddenFlag, record.localDefaultPrecision, "price"),
            },
            {
              fieldCode: "attachmentUuid",
              fieldName: $T("sprm.common.model.common.attachment").$D("附件"),
              fieldType: "UPLOAD",
              editor: false,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sprm.common.model.common.remark").$D("备注"),
            },
          ];
        default:
          return [];
        }
      };
    },
  },
  async mounted() {
    if (this.rpHeaderId) {
      try {
        // 基础信息查询
        await getHeaderApi(this.rpHeaderId, {
          customizeUnitCode: this.headCustomizeUnitCode,
        }).then((res) => {
          this.commonDataSet.create({ ...res }, 0);
        });
        // 需求计划明细信息查询
        this.lineDataSet.addPathParameter("rpHeaderId", this.rpHeaderId);
        this.lineDataSet.addQueryParameter("customizeUnitCode", this.lineCustomizeUnitCode);
        await this.lineDataSet.refresh();
      } catch (error) {
        // this.$notification.open({
        //   message: error,
        // });
      }
    } else {
      this.showPage = false;
      this.$notification.open({
        message: $T("hzero.common.notification.noShow.tips").$D("该单据当前状态不可查看"),
      });
    }
  },
  methods: {
    // eslint-disable-next-line valid-jsdoc
    /**
     * 金额精度控制+金额隐藏
     * @param {字段名} fieldCode
     * @param {单据} record
     * @param {金额隐藏标识} amountDisplayFlag
     * @returns
     */
    amountRender(fieldCode = "", record = {}, amountDisplayFlag = 0, precision = "", type) {
      // 金额隐藏
      if (amountDisplayFlag === 1) {
        return record[`${fieldCode}Meaning`] || "***";
      }
      // 金额精度
      return type === "price" ? Number(SrmUtil.getNumberLocalized(record[fieldCode], precision || record.defaultPrecision)) : SrmUtil.getNumberLocalized(record[fieldCode], precision || record.defaultPrecision);
    },
  }
};