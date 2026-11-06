import { $T } from "srm-mobile-ui";

function formDs() {
  return {
    fields: [
      {
        fieldCode: "labelCode",
        fieldName: $T("scux.BoxCodeUnbind.model.labelCode").$D("箱码"),
        fieldType: "EMPTY",
      },
    ],
  };
}

function listDs() {
  return {
    fields: [
      {
        fieldCode: "uniqueNum",
        fieldName: $T("scux.BoxCodeUnbind.model.uniqueNum").$D("唯一码"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        // url: `/sada/v1/${localStorage.getItem("organizationId")}/rel-table-records/scux_srm_hegii_item_label/page`,
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/yroLqv5bzfMxsgS5aic9jfTtVFQPA3ViaUkCbpuRj1HicU`,
        method: "get",
      },
    },
  };
}

export { formDs, listDs };