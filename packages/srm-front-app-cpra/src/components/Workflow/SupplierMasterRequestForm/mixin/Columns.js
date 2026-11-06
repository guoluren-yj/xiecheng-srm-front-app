
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
          fieldCode: "approveNum",
          editor: false,
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "applyType",
          editor: false,
          render: (val) => {
            if (val === "STOR") {
              return this.$T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.STOR").$D("只变更仓库");
            }
            if (val === "MAIN") {
              return this.$T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.MAIN").$D("只变更主体");
            }
            if (val === "BOTH") {
              return this.$T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.BOTH").$D("变更仓库关联主体");
            }
            return "-";
          }
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "createdName",
          editor: false,
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "creationDate",
          editor: false,
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "remarks",
          editor: false,
        },
      ];
    },
    getLinesColumns() {
      return [
        {
          fieldCode: "lineNum",
          formRow: 10,
          seq: 10,
          editor: false,
        },
        {
          fieldCode: "supplierNum",
          formRow: 20,
          seq: 10,
          editor: false,
        },
        {
          fieldCode: "supplierName",
          formRow: 30,
          seq: 10,
          editor: false,
        },
        {
          fieldCode: "invOrganizationName",
          formRow: 40,
          seq: 10,
          editor: false,
        },
        {
          fieldCode: "companyName",
          formRow: 50,
          seq: 10,
          editor: false,
        },
        {
          fieldCode: "createModStatus",
          formRow: 60,
          seq: 10,
          editor: false,
          render: (val) => {
            if (val === "S") {
              return this.$T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.S").$D("同步成功");
            }
            if (val === "F") {
              return this.$T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.F").$D("同步失败");
            }
            return "-";
          }
        },
        {
          fieldCode: "failReason",
          formRow: 70,
          seq: 10,
          editor: false,
        },
      ];
    },
  }
};
