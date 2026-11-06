<template>
  <div style="height: 77vh">
    <srm-tab-bar>
      <srm-tab-item :label="$T('ssrc.inquiryHall.view.inquiryHall.headerDetail').$D('表头详情')">
        <srm-form :data-set="headerDs"
                  :columns="headerInfoColumns"/>
      </srm-tab-item>
      <srm-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.importData').$D('导入数据')" >
        <srm-list :data-set="listDs" :columns="columnList" />
      </srm-tab-item>
    </srm-tab-bar>
    <srm-popup
      :visible.sync="ladderFlag"
      position="right"
      show-back
      height="100%"
      :show-close="false"
      :title="$T('ssrc.priceLibraryNew.model.library.ladderQuotation').$D('阶梯报价')">
      <srm-list :columns="ladderPriceColumns" :data-set="ladderQuotationDs" />
    </srm-popup>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { encryptMd5 } from "@/utils/utils";
import { formDS, listDS, ladderQuotationDS } from "./store/dreameDS";
import { fetchLineData } from "./service/index";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.priceLibraryNew" ],
  props: {
    parameters: {
      type: Object,
    },
  },
  data: () => ({
    columnList: [],
    headerDs : new DataSet(formDS()),
    listDs: new DataSet(listDS()),
    ladderQuotationDs: new DataSet(ladderQuotationDS()),
    ladderFlag: false,
  }),
  beforeMount() {
    const {
      templateCode,
      importErpReqNum,
    } = this.parameters;
    this.listDs.setQueryParameter({
      from: "LIST",
      viewCode: "ALL_VIEW",
      page: 0,
      size: 1000,
      templateCode,
      importErpReqNum,
      sign: encryptMd5({ templateCode }),
    });
    this.getLadderBasisInfo = [
      {
        fieldCode: "itemName",
        fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称"),
      },
      {
        fieldCode: "itemCategoryIdMeaning",
        fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemCategoryIdMeaning").$D("物料品类"),
      },
      {
        fieldCode: "currencyCodeMeaning",
        fieldName: this.$T("ssrc.priceLibraryNew.view.message.currencyCode").$D("币种"),
      },
      {
        fieldCode: "taxRate",
        fieldName: this.$T("ssrc.priceLibraryNew.model.library.taxRate").$D("税率"),
      },
    ];
    this.headerInfoColumns = [
      {
        fieldCode: "priceAttachmentId",
      },
      {
        fieldCode: "priceRemark",
      },
      {
        fieldCode: "attributeVarchar1Meaning",
      },
    ];
    this.ladderPriceColumns = [
      {
        fieldCode: "ladderLineNum",
      },
      {
        fieldCode: "ladderFrom",
      },
      {
        fieldCode: "ladderPrice",
      },
      {
        fieldCode: "cumulativeFlag",
      },
      {
        fieldCode: "ladderPriceRemark",
      },
    ];
  },
  mounted () {
    this.fetchAllPriceLibInfo();
  },
  methods: {
    toLadderDetail(record) {
      this.ladderFlag = true;
      this.ladderQuotationDs.setQueryParameter({
        priceLibId: record.priceLibId,
      });
      this.ladderQuotationDs.query();
    },
    async fetchAllPriceLibInfo() {
      this.$loading.show();
      const { templateCode } = this.parameters;
      const result = await fetchLineData(
        {
          templateCode,
          shieldDimCodes: "priceLibraryStatus",
          relevantPriceFlag: 0,
        }
      );
      if (result && Array.isArray(result) && result.length > 0) {
        this.columnList = result
          .filter((e) => Number(e.fieldVisible) &&
          ![
            "erpPurchaseRecordNum",
            "applicationScope",
            "relevantPrice",
            "creationDate",
            "createdBy",
            "createdByMeaning",
          ].includes(e.dimensionCode))
          .map((e) => {
            let renderColumns;
            let lovQueryParams = {};
            let lovSubDisplayField = "null";
            let lovDisplayField = "";
            // 阶梯报价
            if (e.dimensionCode === "ladderQuotation" && e.fieldWidget === "LINK") {
              renderColumns = (val, record) => {
                if (record.ladderQuotationFlag === 1) {
                  return <srm-flex>
                    <srm-button type="primary" plain rect onClick={() => this.toLadderDetail(record)}> {val} </srm-button>
                  </srm-flex>;
                }
              };
            }

            // 1、处理lov固定传参
            // 2、处理值集显示及赋值
            if ([ "SELECT", "LOV" ].includes(e.fieldWidget)) {
            // 值集描述字段
              lovDisplayField = e.dimensionCode + "Meaning";
              if (e.fieldWidget === "LOV") {
                e.priceLibLovParamList.map((eChildren) => {
                  lovQueryParams[eChildren.paramName] = eChildren.paramValue;
                });
                e.priceLibDimMapList.map((eChildren) => {
                  // 值集内部（）中显示内容
                  if (eChildren.sourceFromFieldName.lastIndexOf("Code") > 0) {
                    lovSubDisplayField = eChildren.sourceFromFieldName || null;
                  }
                  if (eChildren.sourceFromFieldName.lastIndexOf("Rate") > 0) {
                    lovDisplayField = eChildren.sourceFromFieldName;
                  }
                });
              }
            }
            return {
              fieldCode:e.dimensionCode, // 字段编码
              fieldName:e.dimensionName, // 字段名称
              fieldType:e.fieldWidget, // 字段类型
              displayField:lovDisplayField, // 显示字段
              editor: false, // 是否可编辑
              disabled: true,
              visible:Boolean(e.fieldVisible), // 是否可见
              lovCode:[ "SELECT", "LOV" ].includes(e.fieldWidget) ? e.sourceCode : "",
              defaultValue:[ "SWITCH" ].includes(e.fieldWidget) ? "0" : "",
              render: renderColumns || "",
              options: {
                subDisplayField: lovSubDisplayField,
                queryParams: lovQueryParams
              },
            };
          });
        this.listDs.query().then(() => {
          const data = this.listDs.toData();
          if (Array.isArray(data) && data.length > 0) {
            this.headerDs.create(
              data[0], 0
            );
          }
          this.$loading.hide();
        });
      }
    },
  },
};
</script>>