import { $T, SrmUtil } from "srm-mobile-ui";
function bargainProcessDS(vue) {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10000,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSRC.INQUIRY_HALL.PRICE_COMPARISON.THIS_QUOTATION",
    },
    fields: [
      {
        fieldName: $T("ssrc.priceComparison.model.comparison.supplierCode").$D("供应商编码"),
        fieldCode: "supplierCompanyNum",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.quotationTime").$D("报价时间"),
        fieldType: "DATE_PICKER",
        fieldCode: "quotationDate",
        editor: false,
        timePicker:true,
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.havePrice").$D("价格(含税)"),
        fieldCode: "quotationPrice",
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.num").$D("序号"),
        fieldCode: "num",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.quotationNode").$D("报价节点"),
        fieldCode: "quotationNodeMeaning",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.round").$D("轮次"),
        fieldCode: "roundNumber",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.itemName").$D("物料名称"),
        fieldCode: "itemName",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.comparison.supplierName").$D("供应商名称"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.ladderQuotation").$D("阶梯报价(含税)"),
        fieldCode: "rfxLadderQuotations",
        fieldType: "TEXT",
        editor: false,
      },
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/bargain-assistant/table/{rfxLineItemId}`,
        method: "get",
      },
    },
    events: {
      //苏博特项目特需，需要过滤对应物料的报价过程，后端接口无法动，前端过。存在隐患，1 数据当前接口数据了过大，一次分页没有获取全部数据，导致过滤数据后前端显示不准确； 2 数据量大，接口慢体验不好。以通知对应项目经理，仍然坚持改动（纯二开）。
      afterQuery(ds, result) {
        console.info("$$$", result, vue.filterItem);
        if (result && result.length > 0) {
          const newResult = result.filter((item) => {
            if (item.itemCode) {
              return item.itemCode === vue.filterItem;
            }
            return item.itemName === vue.filterItem;
          });
          result.length = 0;
          newResult.forEach((item) => {
            result.push(item);
          });
          console.info(result, "*****");
        }
      }
    }
  };
}

export default bargainProcessDS;
