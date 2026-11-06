import { $T } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getBasicColumns() {
      return [
        {
          formRow: 10,
          seq: 10,
          fieldCode: "approveNumber",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "createByName",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "creationDate",
          editor: false,
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "approveTypeMeaning",
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "skuType",
          editor: false,
          render: (val) => {
            if (val === "light") {
              return $T("smbl.workFlow.model.skuTypeMeaning.light").$D("轻品");
            }
            return "-";
          }
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "approveRemark",
        },
      ];
    },
    //行信息
    getLineColumns() {
      return [
        {
          formRow: 10,
          seq: 10,
          fieldCode: "statusMeaning",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "documentNumber",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "isManyMeaning",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "boxRule",
          editor: false,
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "itemCode",
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "itemName",
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "categoryCode",
        },
        {
          formRow: 80,
          seq: 10,
          fieldCode: "categoryName",
        },
        {
          formRow: 90,
          seq: 10,
          fieldCode: "uomName",
        },
        {
          formRow: 100,
          seq: 10,
          fieldCode: "typeMeaning",
        },
        {
          formRow: 110,
          seq: 10,
          fieldCode: "creationDate",
          editor: false,
        },
        {
          formRow: 120,
          seq: 10,
          fieldCode: "createByName",
        },
      ];
    },
  }
};
