import { $T, DataSet } from "srm-mobile-ui";
import { basicInfoDS, lineInfoDS } from "../datasource/index";

import {
  getViewScopeList,
  getScopeDetailListApi
} from "../api/index";

export default {
  data() {
    return {
      templateInfo: {},
      basicInfoDataSet: new DataSet(basicInfoDS(this.parameters?.priceAdjustmentHeaderId)),
      lineInfoDataSet: new DataSet(lineInfoDS(this.parameters?.priceAdjustmentHeaderId)),
      visible: false,
      popupData: {},
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "priceAdjustmentName",
              fieldType: "EMPTY",
              render: (val) => <SrmListHeader>{val}</SrmListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "priceAdjustmentCode",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.priceAdjustmentCode").$D("调价单编码"),
              disabled: true,
            },
            {
              fieldCode: "createdByName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.createdBy").$D("创建人"),
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.creationDate").$D("创建时间"),
            },
            {
              fieldCode: "priceAdjustmentTypeMeaning",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.priceAdjustmentType").$D("调价单类型"),
            },
            {
              fieldCode: "sourceFromMeaning",
              fieldName:$T("ssrc.priceAdjustmentWorkBench.view.title.priceAdjustmentSource").$D("调价单来源"),
            },
            {
              fieldCode: "remark",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.remarks").$D("说明"),
            },
          ];
        case "lineInfo":
          return [
            {
              fieldCode: "itemName",
              fieldType: "EMPTY",
              render: (val) => <SrmListHeader>
                {val}
                <span
                  slot="right"
                  class="srm-icon icon-chevron-right"
                  style={{ fontSize: "16px", color: "var(--color-default)" }}
                />
              </SrmListHeader>,
              formRow: 1,
            },
            // {
            //   fieldCode: "priceAdjustmentLineNum",
            //   fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.priceAdjustmentLineNum").$D("调价单行号"),
            // },
            {
              fieldCode: "sourceFromNum",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.sourceFromNum"
              ).$D("来源单据编码"),
            },
            {
              fieldCode: "sourceFromLineNum",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.sourceFromLineNum"
              ).$D("来源单据行号"),
            },
            {
              fieldCode: "applicationScope",
              fieldName: $T("ssrc.inquiryHall.view.title.applicationScope").$D(
                "适用范围"
              ),
              render: () => <span style="color: var(--color-other-default-b)">
                {this.$T("ssrc.priceLibraryNew.view.title.view").$D("查看")}
              </span>,
              callBack: (record) => {
                this.$loading.show();
                new Promise((resolve) => {
                  getViewScopeList({
                    appScopeType: record?.appScopeType,
                    priceAdjustmentLineId: record?.priceAdjustmentLineId,
                  }).then((result) => {
                    let arr = [];
                    for (let i = 0; i < result.length; i++) {
                      let temp = {
                        firstFlag: true,
                        dataCode: null,
                        dataName: result[i].dimensionName,
                        key: result[i].dimensionCode,
                        dimensionCode: result[i].dimensionCode,
                        parentKey: null,
                        appScopeId: result[i].appScopeId,
                      };
                      arr.push(temp);
                    }
                    resolve(arr);
                  });
                })
                  .then((res) => {
                    this.getScopeDetailAll(record, res);
                  })
                  .finally(() => {
                    this.$loading.hide();
                  });
              },
            },
            {
              fieldCode: "itemCategoryName",
              type: "object",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.itemCategoryId"
              ).$D("物料品类"),
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.supplierCompanyId"
              ).$D("供应商"),
            },
            {
              fieldCode: "validDateFrom",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.validDateFrom"
              ).$D("有效期从"),
            },
            {
              fieldCode: "validDateTo",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.validDateTo"
              ).$D("有效期至"),
            },
            {
              fieldCode: "uomCodeAndName",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.uomId"
              ).$D("单位"),
            },
            {
              fieldCode: "sourceFromMeaning",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.sourceFrom"
              ).$D("数据来源"),
            },
            {
              fieldCode: "taxIncludedPrice",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.taxIncludedPrice'"
              ).$D("单价（含税）"),
              precision: (val, record) =>
                Number(
                  this.$options.filters.calcCurrencyPrecision(
                    record.currencyCode,
                    "financialPrecision"
                  )
                ),
            },
            {
              fieldCode: "netPrice",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.netPrice"
              ).$D("单价（不含税）"),
              precision: (val, record) =>
                Number(
                  this.$options.filters.calcCurrencyPrecision(
                    record.currencyCode,
                    "financialPrecision"
                  )
                ),
            },
            {
              fieldCode: "ladderQuotation",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.ladderQuotation"
              ).$D("阶梯报价"),
              render: (val) =>
                val !== "null" ? <span style="color: var(--color-other-default-b)">
                  {this.$T("ssrc.priceLibraryNew.view.title.view").$D("查看")}
                </span> : <span>-</span>,
              callBack: (record) => {
                if (!record.priceLibLadderList) {
                  return;
                }
                this.$loading.show();
                this.$popup({
                  title: this.$T(
                    "ssrc.priceLibraryNew.view.message.ladderQuotation"
                  ).$D("阶梯报价"),
                  showHeader: false,
                  showClose: false,
                  showBack: false,
                  height: "100vh",
                  position: "bottom",
                  content: <LadderQuotation priceLibLadderList={record?.priceLibLadderList}/>,
                });
                this.$loading.hide();
              },
            },
            {
              fieldCode: "itemCode",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.itemCode"
              ).$D("物料编码"),
            },
            {
              fieldCode: "companyName",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.companyId"
              ).$D("公司"),
            },
            {
              fieldCode: "currencyName",
              fieldName: $T(
                "ssrc.priceAdjustmentWorkBench.view.title.currencyCode"
              ).$D("币种"),
            },
          ];
        case "lineInfoDetail":
          return [
            {
              fieldCode: "priceAdjustmentLineNum",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.priceAdjustmentLineNum").$D("调价单行号"),
            },
            {
              fieldCode: "sourceFromNum",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.sourceFromNum").$D("来源单据编码"),
            },
            {
              fieldCode: "sourceFromLineNum",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.sourceFromLineNum").$D("来源单据行号"),
            },
            {
              fieldCode: "applicationScope",
              fieldName: $T("ssrc.inquiryHall.view.title.applicationScope").$D("适用范围"),
              render: () => <span style="color: var(--color-other-default-b)">
                {this.$T("ssrc.priceLibraryNew.view.title.view").$D("查看")}
              </span>,
              callBack: (record) => {
                this.$loading.show();
                new Promise((resolve) => {
                  getViewScopeList({
                    appScopeType: record?.appScopeType,
                    priceAdjustmentLineId: record?.priceAdjustmentLineId,
                  }).then((result) => {
                    let arr = [];
                    for (let i = 0; i < result.length; i++) {
                      let temp = {
                        firstFlag: true,
                        dataCode: null,
                        dataName: result[i].dimensionName,
                        key: result[i].dimensionCode,
                        dimensionCode: result[i].dimensionCode,
                        parentKey: null,
                        appScopeId: result[i].appScopeId,
                      };
                      arr.push(temp);
                    }
                    resolve(arr);
                  });
                })
                  .then((res) => {
                    this.getScopeDetailAll(record, res);
                  })
                  .finally(() => {
                    this.$loading.hide();
                  });
              },
            },
            {
              fieldCode: "itemCategoryName",
              type: "object",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.itemCategoryId").$D("物料品类"),
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.supplierCompanyId").$D("供应商"),
            },
            {
              fieldCode: "validDateFrom",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.validDateFrom").$D("有效期从"),
            },
            {
              fieldCode: "validDateTo",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.validDateTo").$D("有效期至"),
            },
            {
              fieldCode: "ouName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.ouId").$D("业务实体"),
            },
            {
              fieldCode: "invOrganizationName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.invOrganizationId").$D("库存组织"),
            },
            {
              fieldCode: "purOrganizationName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.purOrganizationId").$D("采购组织"),
            },
            {
              fieldCode: "purchaseAgentName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.purchaseAgentId").$D("采购员"),
            },
            {
              fieldCode: "uomCodeAndName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.uomId").$D("单位"),
            },
            {
              fieldCode: "sourceFromMeaning",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.sourceFrom").$D("数据来源"),
            },
            {
              fieldCode: "benchmarkPriceTypeMeaning",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.benchmarkPriceType").$D("基准价类型"),
            },
            {
              fieldCode: "taxIncludedPrice",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.taxIncludedPrice'").$D("单价（含税）"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
            },
            {
              fieldCode: "netPrice",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.netPrice").$D("单价（不含税）"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
            },
            {
              fieldCode: "ladderQuotation",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.ladderQuotation").$D("阶梯报价"),
              render: (val) =>
                val !== "null" ? <span style="color: var(--color-other-default-b)">
                  {this.$T("ssrc.priceLibraryNew.view.title.view").$D("查看")}
                </span> : <span>-</span>,
              callBack: (record) => {
                if (!record.priceLibLadderList) {
                  return;
                }
                this.$loading.show();
                this.$popup({
                  title: this.$T(
                    "ssrc.priceLibraryNew.view.message.ladderQuotation"
                  ).$D("阶梯报价"),
                  showHeader: false,
                  showClose: false,
                  showBack: false,
                  height: "100vh",
                  position: "bottom",
                  content: <LadderQuotation priceLibLadderList={record?.priceLibLadderList}/>,
                });
                this.$loading.hide();
              },
            },
            {
              fieldCode: "itemName",
              fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料名称"),
            },
            {
              fieldCode: "itemCode",
              fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
            },
            {
              fieldCode: "companyName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.companyId").$D("公司"),
            },
            {
              fieldCode: "currencyName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.currencyCode").$D("币种"),
            },
            {
              fieldCode: "taxRate",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.taxId").$D("税率ID"),
            },
            {
              fieldCode: "exchangeRate",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.exchangeRateId").$D("汇率"),
            },
            {
              fieldCode: "exchangeRateDate",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.exchangeRateDate").$D("汇率日期"),
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.creationDate").$D("创建日期"),
            },
            {
              fieldCode: "priceBatchQuantity",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.priceBatchQuantity").$D("价格批量"),
            },
            {
              fieldCode: "supplierName",
              fieldName: $T("ssrc.priceAdjustmentWorkBench.view.title.supplierId").$D("本地供应商"),
            },
          ];
        default:
          break;
        }
      };
    }
  },
  methods: {
    // 获取 自定义语言
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("ssrc.priceAdjustmentWorkBench.content.cardTitle.basicInfo").$D("基本信息"),
        "lineInfo": $T("ssrc.priceAdjustmentWorkBench.content.cardTitle.line").$D("调价单明细信息"),
      };
      return languageList[key] || key;
    },
    // 获取 自定义配置
    getCodeDefine(key) {
      const codeDefine = {
        "basicInfo": "SMBL.WORKFLOW.PRICEADJUSTMENTWORKBENCH_HEADER_FORM",
        "lineInfo": "SMBL.WORKFLOW.PRICEADJUSTMENTWORKBENCH_LINE_TABLE",
        "lineInfoDetail": "SMBL.WORKFLOW.PRICEADJUSTMENTWORKBENCH_LINE_DETAIL_TABLE",
      };
      return codeDefine[key] || "";
    },
    // 弹框
    openPopup(name, item) {
      this.popupData["data"] = item;
      this.popupData["columns"] = name;
      this.popupData["code"] = name;
      this.visible = true;
    },
    clicklineInfoDetailInfo(record) {
      this.openPopup("lineInfoDetail", record.data);
    },
    async getScopeDetailAll(record, arr) {
      this.treeList = [];
      this.treeList = arr;
      const promise = arr.map((i) => new Promise((resolve) => {
        getScopeDetailListApi({
          priceAdjustmentLineId: record?.priceAdjustmentLineId,
          appScopeId: i?.appScopeId,
          dimensionCode: i.dimensionCode,
        }).then((res) => {
          let arrTemp = [];
          for (let j = 0; j < res.length; j++) {
            if (!res[j].parentKey) {
              res[j].parentKey = i.dimensionCode;
            }
            let temp1 = {
              firstFlag:false,
              dataCode:res[j].dataCode,
              dataName:res[j].dataName,
              key:res[j].key ? res[j].key : i.dimensionCode + j,
              dimensionCode:res[j].dimensionCode,
              parentKey:res[j].parentKey,
            };
            arrTemp.push(temp1);
          }
          resolve(arrTemp);
        });
      }).then((item) => {
        let temp = JSON.stringify(item);
        let t1 = JSON.parse(temp);
        this.treeList = this.treeList.concat(t1);
      }));
      await Promise.all(promise);
      this.$popup({
        showHeader: false,
        showClose: false,
        showBack: false,
        height: "100vh",
        position: "bottom",
        content: <ViewScope list={this.treeList} />,
      });
    },
  }
};