import { $T } from "srm-mobile-ui";
import { encryptMd5 } from "@/utils/utils";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

function mainPriceDS(templateCode, viewCode) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    queryParameter: {
      from: "EDIT",
      templateCode: templateCode,
      viewCode: viewCode,
      page: 0,
      size: 10,
      sign: encryptMd5({ templateCode }),
    },
    // bodyParameter: {
    //   pageNum: 1,
    //   pageSize: 10,
    // },
    fastQueryField: {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称"),
    },
    // 查询表单字段
    queryFields: [
    ],
    fields: [
    ],
    events: {
    },
    transport: {
      read: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-mains`,
        method: "get",
      },
    },
  };
}

// 阶梯报价行
function laddersDS(priceLibId, benchmarkPriceType) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    queryParameter: {
      priceLibId: priceLibId,
      benchmarkPriceType:benchmarkPriceType,
      page: 0,
      size: 10,
    },
    // bodyParameter: {
    //   pageNum: 1,
    //   pageSize: 10,
    // },
    // fastQueryField: {
    //   fieldCode: "itemName",
    //   fieldType: "TEXT",
    //   fieldName: $T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称"),
    // },
    // 查询表单字段
    queryFields: [
    ],
    fields: [
    ],
    events: {
    },
    transport: {
      read: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-ladders`,
        method: "get",
      },
      destroy: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-ladders`,
        method: "delete",
      },
    },
  };
}

export {
  commonDs,
  mainPriceDS,
  laddersDS };
