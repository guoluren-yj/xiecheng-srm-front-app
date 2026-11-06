
import { getHeaderInfo } from "./api";

export default {
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    }
  },
  data() {
    return {
      headerInfo: {},
      lineInfo: [],
      type: null, // 流程表单类型 1(可编辑)/2(只读)
      styles: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: "1.333vw",
        fontSize: "3.2vw",
        lineHeight: "4.267vw",
        padding: "0 1.067vw",
        background: "#EFF3FE",
      }
    };
  },
  async mounted() {
    if (this.changeReqId) {
      await this.fetchData();
    }
    this.$emit("GetApprovalTitle",
      this.$T("scux.receipt.view.title.receiptApproval").$D("收货执行审批"),
    );
    if (this.parameters) {
      this.type = this.parameters.type;
    }
  },
  methods: {
    async fetchData() {
      await getHeaderInfo(this.changeReqId)
        .then((res) => {
          this.headerInfo = res;
        });
    },
    getFieldCode() {
      return this.type === "1" ?
        this.headerInfo?.asnAddressType === "Goods_to_the_warehouse" ?
          "attributeVarchar7" :
          "attributeVarchar7Meaning" :
        "attributeVarchar7";
    }
  },
  computed: {
    getHeaderColumns() {
      return [
        this.getFieldCode() === "attributeVarchar7" && {
          fieldName: this.$T("scux.receipt.created.model.attributeVarchar7").$D("是否按时收货"),
          fieldCode: this.getFieldCode(),
          fieldType: "EMPTY",
          render: (val, record, property) => {
            const { fieldName, fieldCode } = property;
            return <div style={this.styles}>
              <span style={{ marginRight: "8px", color: "red", fontWeight: "bold", whiteSpace: "nowrap" }}>{fieldName}*:</span>
              <div style={{ flex: 1 }}>
                <srm-lov-field
                  key={fieldCode}
                  v-model={record[fieldCode]}
                  display={{ Y: this.$T("scux.receipt.created.model.yesCux").$D("是"), N: this.$T("scux.receipt.created.model.noCux").$D("否") }}
                  select-type="select"
                  code="SPCM.YN"
                  placeholder={this.$T("scux.receipt.model.receipt.chooseCux").$D("请选择") + fieldName}
                />
              </div>
            </div>;
          },
        },
        this.getFieldCode() === "attributeVarchar7Meaning" && {
          fieldName: this.$T("scux.receipt.created.model.attributeVarchar7").$D("是否按时收货"),
          fieldCode: this.getFieldCode(),
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.asnNum").$D("送货单号"),
          fieldCode: "asnNum",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.signNum").$D("收货单号"),
          fieldCode: "signNum",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.attachmentUuids").$D("附件"),
          fieldCode: "attachmentUuid",
          render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={this.$T("scux.receipt.button.viewAttachments").$D("查看附件")} />,
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.supplierName").$D("供应商名称"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.shipDate").$D("发货日期"),
          fieldCode: "shipDate",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.asnAddressType").$D("送货地类型"),
          fieldCode: "asnAddressTypeMeaning",
        },
        this.headerInfo?.asnAddressType === "goods_to_the_outsourcing" && {
          fieldName: this.$T("scux.receipt.model.receipt.factoryName").$D("外协厂名称"),
          fieldCode: "attributeVarchar27",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.createName").$D("创建人"),
          fieldCode: "createName",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.signStatus").$D("状态"),
          fieldCode: "signStatusMeaning",
        },
        {
          fieldName: this.$T("scux.receipt.model.receipt.signRemark").$D("备注"),
          fieldCode: "signRemark",
        },
      ];
    },
    getLineColumns() {
      return [
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "asnLineNum",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "quantity",
        },
        {
          fieldCode: "receiveQuantity",
        },
        {
          fieldCode: "signDate",
        },
        {
          fieldCode: "inventoryCode",
        },
        {
          fieldCode: "productNum",
        },
        {
          fieldCode: "productName",
        },
        {
          fieldCode: "ouName",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "srmRcvTrxNum",
        },
        {
          fieldCode: "srmRcvTrxLineNum",
        },
        {
          fieldCode: "signRemark",
        },
      ];
    }
  }
};