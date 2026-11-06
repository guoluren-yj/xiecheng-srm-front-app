export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getBasicColumns() {
      const formColumns = [
        {
          fieldCode: "companyName",
          formRow: 1,
        },
        {
          fieldCode: "applyUserName",
          formRow: 2,
        },
        {
          fieldCode: "deptMeaning",
          formRow: 3,
        },
        {
          fieldCode: "expDeptMeaning",
          formRow: 3,
        },
        {
          fieldCode: "costCenterMeaning",
          formRow: 4,
        },
        {
          fieldCode: "purposeMeaning",
          formRow: 4,
        },
        {
          fieldCode: "productionLineMeaning",
          formRow: 5,
        },
        {
          fieldCode: "currencyCode",
          formRow: 5,
        },
        {
          fieldCode: "totalPrice",
          formRow: 6,
        },
        {
          fieldCode: "templateCode",
          formRow: 6,
        },
        {
          fieldCode: "templateName",
          formRow: 7,
        },
      ];
      return formColumns;
    },
    //商品信息
    getLineInfoColumns() {
      const lineColumns = [
        {
          fieldCode: "orderNum",
          formRow: 1,
        },
        {
          fieldCode: "skuName",
          formRow: 1,
        },
        {
          fieldCode: "quantity",
          formRow: 2,
        },
        {
          fieldCode: "taxIncludedPrice",
          formRow: 2,
        },
        {
          fieldCode: "taxRate",
          formRow: 2,
        },
        {
          fieldCode: "taxIncludedAmount",
          formRow: 3,
        },
        {
          fieldCode: "neededDate",
          // fieldType: "DATE",
          formRow: 3,
        },
        {
          fieldCode: "addressContactName",
          formRow: 4,
        },
        {
          fieldCode: "addressContactMobile",
          formRow: 4,
        },
        {
          fieldCode: "addressDetail",
          formRow: 5,
        },
        {
          fieldCode: "supplierCompanyName",
          formRow: 6,
        },
        {
          fieldCode: "remark",
          formRow: 7,
        },
        {
          fieldCode: "skuImage",
          render: (val) => {
            if (val) {
              return (
                <div style={{ width: "32px", height: "32px" }}>
                  <img
                    src={val}
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "inline-block",
                    }}
                  />
                </div>
              );
            }
            return "-";
          },
        },
      ];
      return lineColumns;
    },
  },
};
