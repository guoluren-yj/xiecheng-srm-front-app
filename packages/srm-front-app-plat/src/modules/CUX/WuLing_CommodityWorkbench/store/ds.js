import { SrmUtil, $T } from "srm-mobile-ui";

const skuListDs = () => ({
  autoQuery: true,
  editable: false,
  fastQueryField: {
    fieldCode: "itemParam",
    fieldType: "TEXT",
    // @ts-ignore
    fieldName: $T("smpc.product.model.itemCodeAndName").$D("物料编码、名称"),
  },
  queryFields: [
    {
      fieldCode: "skuParam",
      fieldType: "TEXT",
      // @ts-ignore
      fieldName: $T("smpc.product.model.productCodeAndName").$D("商品编码、名称"),
    },
  ],
  transport: {
    read: {
      url: `/smpc/v1/${SrmUtil.getTenantId()}/pur-skus?skuType=CATA&recycleFlag=0&receiveFlag=1`,
      method: "get",
    },
  },
});

function commonDs(otherProps = {}) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    ...otherProps,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

export { skuListDs, commonDs };