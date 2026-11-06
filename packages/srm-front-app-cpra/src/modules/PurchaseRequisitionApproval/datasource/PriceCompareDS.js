// 比价单
import { $T, SrmUtil } from "srm-mobile-ui";

function priceCompareDS() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [ {
      fieldCode: "productCode",
      fieldName: $T("sprm.common.model.common.productCode").$D("商品编码"),
      fieldType: "TEXT",
    }, {
      fieldCode: "supplierCompanyNum",
      fieldName: $T("sprm.common.model.common.supplierCompanyNum").$D("供应商编码"),
      fieldType: "TEXT",
      render: (val, item) => `${item.supplierCompanyName} - ${val}`,
    }, {
      fieldCode: "productName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.productName").$D("商品名称"),
    }, {
      fieldCode: "price",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.modal.unitPrice").$D("单价"),
    }, {
      fieldName: $T("sprm.common.model.common.imagePath").$D("商品图片"),
      fieldType: "TEXT",
      fieldCode: "imagePath",
      render: (val) => val ? <div style="color: var(--font-color-primary)" onClick={(e) => {
        let paths = val.split("@");
        SrmUtil.previewFile({
          fileName: paths[paths.length - 1],
          fileUrl: val,
          bucketName: SrmUtil.getDefaultPubBucketName()
        });
        e.stopPropagation();
      }}>
        {$T("spcm.common.model.clickView").$D("点击查看")}
      </div> : "-",
    } ],
  };
}

export {
  priceCompareDS,
};