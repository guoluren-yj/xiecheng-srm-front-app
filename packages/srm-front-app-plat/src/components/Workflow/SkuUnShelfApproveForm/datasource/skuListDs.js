import { $T } from "srm-mobile-ui";

const skuListDs = () => ({
  autoQuery: false,
  selection: Infinity,
  pageSize: 5,
  editable: false,
  showTotalCount: true,
  enableQuery:false,
  fields: [
    {
      fieldCode: "skuCode",
      fieldName: $T("smpc.product.view.skuCode").$D("商品编码"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldName: $T("smpc.product.model.supplier").$D("供应商"),
    },
  ],
});

export default skuListDs;