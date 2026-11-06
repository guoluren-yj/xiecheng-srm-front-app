import { encryptMd5 } from "@/utils/utils";

function indexDs(priceLibId, templateCode, dimensionId, fromPriceLibId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    enableQuery:false,
    showTotalCount: true,
    queryParameter: {
      priceLibId:priceLibId,
      from:"APPROVE_RELEVANT_PRICE",
      templateCode:templateCode,
      dimensionId:dimensionId,
      fromPriceLibId:fromPriceLibId,
      sign: encryptMd5({ templateCode }),
    },
    fields: [],
    transport: {
      read: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-mains`,
        method: "get",
      },
    },
  };
}

export default indexDs;
