import {
  getStatusCodeColor,
} from "../utils";

export default {
  data() {
    return {};
  },
  methods: {
    getWaitAffirmListColumns(nodeTemplateCode, hdKey) {
      switch (nodeTemplateCode) {
      case "ASN":
        if (hdKey === "left") {
          return [
            {
              fieldCode: "displayAsnNum",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.displayAsnNum }</span>
                <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
              </srm-list-header>
            },
            {
              fieldCode: "companyName",
            },
            {
              fieldCode: "supplierCompanyName",
            },
            {
              fieldCode: "invOrganizationName",
            },
          ];
        }
        return [
          {
            fieldCode: "displayAsnNumAndLineNum",
            fieldType: "EMPTY",
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.displayAsnNum }-{ item.displayAsnLineNum }</span>
              <span slot="right" style={getStatusCodeColor(item.lineStatus)}>{ item.lineStatusMeaning }</span>
            </srm-list-header>
          },
          {
            fieldCode: "itemNameAndCode",
            render: (val, item) => <span>{ item.itemCode }|{item.itemName}</span>
          },
          {
            fieldCode: "actualQuantity",
            render: (val, item) => <span>{val}{val ? `（${item.displayUom}）` : ""}</span>
          },
          {
            fieldCode: "quantity",
            render: (val, item) => <span>{val}{val ? `（${item.displayUom}）` : ""}</span>
          },
          {
            fieldCode: "companyName",
          },
          {
            fieldCode: "supplierCompanyName",
          }
        ];
      case "PLAN":
        if (hdKey === "left") {
          return [
            {
              fieldCode: "displayPlanNum",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.displayPlanNum }</span>
                <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
              </srm-list-header>
            },
            {
              fieldCode: "companyName",
            },
            {
              fieldCode: "supplierCompanyName",
            },
          ];
        }
        return [
          {
            fieldCode: "displayPlanNumAndLineNum",
            fieldType: "EMPTY",
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.displayPlanNum }-{ item.displayPlanLineNum }</span>
              <span slot="right" style={getStatusCodeColor(item.lineStatus)}>{ item.lineStatusMeaning }</span>
            </srm-list-header>
          },
          {
            fieldCode: "itemNameAndCode",
            render: (val, item) => <span>{ item.itemCode }|{item.itemName}</span>
          },
          {
            fieldCode: "actualQuantity",
            render: (val, item) => <span>{val}{val ? `（${item.displayUom}）` : ""}</span>
          },
          {
            fieldCode: "quantity",
            render: (val, item) => <span>{val}{val ? `（${item.displayUom}）` : ""}</span>
          },
          {
            fieldCode: "companyName",
          },
          {
            fieldCode: "supplierCompanyName",
          }
        ];
      default:
        return [];
      }
    },
  }
};
