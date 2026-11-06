import { $T } from "srm-mobile-ui";
export default {
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      approver: null, // 流程表单类型
    };
  },
  async mounted() {
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.assetCodeRequest.view.title.approval").$D(
        "资产编码申请提交审批",
      ),
    );
    if (this.parameters) {
      this.approver = this.parameters.approver;
    }
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldName: this.$T("scux.assetCodeRequest.model.title").$D("标题"),
          fieldCode: "title",
          formRow: 10,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.docNum").$D(
            "表单编号",
          ),
          fieldCode: "assetCardNo",
          formRow: 20,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.applicant").$D(
            "申请人",
          ),
          fieldCode: "requestedName",
          formRow: 30,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.applyDepartment").$D(
            "申请部门",
          ),
          fieldCode: "requestDeptName",
          formRow: 30,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.applyDate").$D(
            "申请日期",
          ),
          fieldCode: "requestDate",
          formRow: 35,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.assetManageDept").$D(
            "资产管理部门",
          ),
          fieldCode: "assetMgmtDeptName",
          formRow: 40,
          formCol: 1,
        },
        {
          fieldName: this.$T(
            "scux.assetCodeRequest.model.assetManageDeptAdmin",
          ).$D("资产管理部门管理员"),
          fieldCode: "assetAdminName",
          formRow: 40,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.companyName").$D(
            "所属公司名称",
          ),
          fieldCode: "companyName",
          formRow: 50,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.supplierName").$D(
            "供应商名称",
          ),
          fieldCode: "supplierName",
          formRow: 60,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.model.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 70,
          formCol: 1,
        },
        {
          fieldName: this.$T(
            "scux.assetCodeRequest.model.purchaseAttachment",
          ).$D("采购附件"),
          fieldCode: "attachmentUuid",
          formRow: 80,
          formCol: 1,
        },
        {
          fieldName: this.$T(
            "scux.assetCodeRequest.model.assetAdminAttachment",
          ).$D("资产管理员附件"),
          fieldCode: "assetAttachmentUuid",
          formRow: 80,
          formCol: 2,
        },
      ];
    },
    getBusinessColumns() {
      return [
        {
          fieldName: this.$T("scux.assetCodeRequest.field.lineNum").$D("序号"),
          fieldCode: "lineNum",
          formRow: 10,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.orderItemName").$D(
            "订单物料名称",
          ),
          fieldCode: "itemName",
          render: (val, item) =>
            <span style={{ color: item.assetName !== val ? "#e86b6b" : "" }}>
              {val}
            </span>,
          formRow: 20,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.orderSpec").$D(
            "订单规格",
          ),
          fieldCode: "specifications",
          render: (val, item) =>
            <span style={{ color: item.assetSpec !== val ? "#e86b6b" : "" }}>
              {val}
            </span>,
          formRow: 20,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.assetName").$D(
            "资产名称",
          ),
          fieldCode: "assetName",
          formRow: 30,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.assetSpec").$D(
            "资产规格",
          ),
          fieldCode: "assetSpec",
          formRow: 30,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.orderQty").$D(
            "订单数量",
          ),
          fieldCode: "quantity",
          formRow: 40,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.uom").$D("单位"),
          fieldCode: "uomName",
          formRow: 40,
          formCol: 2,
        },
        {
          fieldCode: "currentQty",
          formRow: 50,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.amountTax").$D(
            "含税金额",
          ),
          fieldCode: "taxIncludePrice",
          formRow: 50,
          formCol: 2,
        },
        {
          fieldCode: "arrivalDate",
          fieldName: $T("scux.assetCodeRequest.field.arrivalDate").$D("到货时间"),
          formRow: 60,
          formCol: 1,
        },

        {
          fieldCode: "warrantyPeriod",
          fieldName: $T("scux.assetCodeRequest.field.warrantyPeriodMonths").$D("质保期（月）"),
          formRow: 60,
          formCol: 2,
        },
        {
          fieldCode: "manufacturerName",
          fieldName: $T("scux.assetCodeRequest.field.manufacturer").$D("生产厂商"),
          formRow: 70,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.assetCategory").$D(
            "资产类别",
          ),
          fieldCode: "assetCategoryName",
          formRow: 80,
          formCol: 1,
        },
        {
          fieldName: this.$T(
            "scux.assetCodeRequest.field.physicalAssetCode",
          ).$D("实物资产编码"),
          fieldCode: "physicalAssetCode",
          formRow: 90,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.mergedAssetCode").$D(
            "合并主资产编码",
          ),
          fieldCode: "mergeMainAssetCode",
          formRow: 90,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.useDeptName").$D(
            "使用部门名称",
          ),
          fieldCode: "usageDeptName",
          formRow: 100,
          formCol: 1,
        },
        {
          fieldName: this.$T(
            "scux.assetCodeRequest.field.useResponsiblePerson",
          ).$D("使用责任人"),
          fieldCode: "userName",
          formRow: 110,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.storageLocation").$D(
            "存放地点",
          ),
          fieldCode: "location",
          formRow: 110,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.rdProject").$D(
            "研发项目",
          ),
          fieldCode: "rdProjectName",
          formRow: 120,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.rdStage").$D(
            "研发阶段",
          ),
          fieldCode: "rdStageName",
          formRow: 130,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.testNum").$D(
            "试验编号",
          ),
          fieldCode: "trialNoName",
          formRow: 140,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.assetCodeRequest.field.govSubsidy").$D(
            "政府补助",
          ),
          fieldCode: "govSubsidyName",
          formRow: 140,
          formCol: 2,
        },

      ];
    },
  },
};
