export default {
  data() {
    return {};
  },
  methods: {
    getWaitCreateListColumns(nodeTemplateCode) {
      switch (nodeTemplateCode) {
      case "ASN":
        return [
          {
            fieldCode: "itemName",
            fieldType: "EMPTY",
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.itemName }</span>
              <span slot="right">{ item.itemCode }</span>
            </srm-list-header>
          },
          {
            fieldCode: "sourceDisplayNum",
            render: (val, item) => <span>{val}-{item.sourceDisplayLineNum}</span>
          },
          {
            fieldCode: "sourceNodeConfigName",
          },
          {
            fieldCode: "canCreateQuantity",
            render: (val, item) => <span>{val}{val ? `（${item.displayUom}）` : ""}</span>
          },
          {
            fieldCode: "invOrganizationName",
          },
          {
            fieldCode: "companyName",
          },
        ];
      case "PLAN":
        return [
          {
            fieldCode: "itemName",
            fieldType: "EMPTY",
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.itemName }</span>
              <span slot="right">{ item.itemCode }</span>
            </srm-list-header>
          },
          {
            fieldCode: "sourceDisplayNum",
            render: (val, item) => <span>{val}-{item.sourceDisplayLineNum}</span>
          },
          {
            fieldCode: "sourceNodeConfigName",
          },
          {
            fieldCode: "canCreateQuantity",
            render: (val, item) => <span>{val}{val ? `（${item.displayUom}）` : ""}</span>
          },
          {
            fieldCode: "invOrganizationName",
          },
          {
            fieldCode: "supplierCompanyName",
          },
        ];
      default:
        return [];
      }
    },
  }
};
