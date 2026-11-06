<template>
  <div style="height: 100vh">
    <!-- 内容区 -->
    <Customize :need-padding="true" :data-source="orderChange" :columns="getOrderChangeInfoColumns" />
    <div
      v-for="(lineInfo) in lineInfoList"
      :key="lineInfo.lineNum"
      class="content-item">
      <div class="purchase-info">
        <div class="content">
          <!-- 个性化组件替换后的代码 -->
          <Customize
            :need-padding="true"
            :columns="getLineInfoColumns"
            :data-source="lineInfo"/>
        </div>
        <srm-blank size="large" theme="fill" />
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderChangeDetailApi,getOrderLineApi,getOperationRecordApi } from "../api";
export default {
  modules: [ "scux.orderChange","spcm.common" ],
  name: "HygyOrderChangeApprovalDetailContent",
  components: {
  },
  props: {
    id: {
      type: String,
      require: false
    }
  },
  data() {
    return {
      orderChange:{},
      poNum: "",
      poHeaderId:"",
      lineInfoList:[],
      headerChangeList:[],
      lineChangeList:[]
    };
  },
  computed: {
    // 详情内容
    getOrderChangeInfoColumns() {
      const columns = [
        {
          fieldCode: "title",
          fieldType: "EMPTY",
          formRow: 0,
          render: () => {
            return (
              <SrmListHeader>
                <span>{this.$T("scux.orderChange.view.title.orderHeaderInfo").$D("订单头信息")}</span>
              </SrmListHeader>
            );
          },
        },
        {
          fieldName: "订单号",
          fieldCode: "poNum",
          langCode: "scux.orderChange.model.poNum",
          formRow: 1,
          render:(val)=>{
            return (
              this.headerChangeList.includes("poNum") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "公司",
          fieldCode: "companyName",
          langCode: "scux.orderChange.model.companyName",
          formRow: 2,
          render:(val)=>{
            return (
              this.headerChangeList.includes("companyName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "供应商名称",
          fieldCode: "supplierName",
          langCode: "scux.orderChange.model.supplierName",
          formRow: 3,
          render:(val)=>{
            return (
              this.headerChangeList.includes("supplierName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "订单类型",
          fieldCode: "poTypeDesc",
          langCode: "scux.orderChange.model.poTypeDesc",
          formRow: 4,
          render:(val)=>{
            return (
              this.headerChangeList.includes("poTypeDesc") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "含税金额",
          fieldCode: "taxIncludeAmount",
          langCode: "scux.orderChange.model.taxIncludeAmount",
          render:(val)=>{
            return (
              this.headerChangeList.includes("taxIncludeAmount") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 5,
        },
        {
          fieldName: "不含税金额",
          fieldCode:"amount",
          langCode: "scux.orderChange.model.amount",
          render:(val)=>{
            return (
              this.headerChangeList.includes("amount") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 6,
        },
        {
          fieldName: "币种",
          fieldCode: "currencyCode",
          langCode: "scux.orderChange.model.currencyCode",
          formRow: 7,
          render:(val)=>{
            return (
              this.headerChangeList.includes("currencyCode") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "总数量",
          fieldCode: "quantityTotal",
          langCode: "scux.orderChange.model.quantityTotal",
          formRow: 8,
          render:(val)=>{
            return (
              this.headerChangeList.includes("quantityTotal") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "付款条件",
          fieldCode: "termsName",
          langCode: "scux.orderChange.model.termsName",
          formRow: 9,
          render:(val)=>{
            return (
              this.headerChangeList.includes("termsName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "月结账期（天）",
          fieldCode: "attributeVarchar10",
          langCode: "scux.orderChange.model.monthlyInvocingPeriod",
          formRow: 10,
          render:(val)=>{
            return (
              this.headerChangeList.includes("attributeVarchar10") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "付款方式",
          fieldCode: "attributeVarchar11Meaning",
          langCode: "scux.orderChange.model.paymentMethod",
          formRow: 11,
          render:(val)=>{
            return (
              this.headerChangeList.includes("attributeVarchar11Meaning") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "订单摘要",
          fieldCode: "remark",
          fieldType: "EMPTY",
          langCode: "scux.orderChange.model.orderSummary",
          formRow: 12,
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderChange.model.orderSummary").$D("订单摘要")}：</span>
              {this.headerChangeList.includes("remark") ? <span style="color:red">{val}</span> : <span>{val}</span>}
            </srm-flex>;
          }
        },
        {
          fieldName:"内部附件",
          formRow:13,
          fieldCode: "purchaserInnerAttachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={this.$T("scux.orderChange.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderChange.view.button.viewAttachmentUuid"
                  ).$D("附件查看")}
                />
              </div>
            );
          },
          callBack: () => {},
        },
        {
          fieldName:"外部附件",
          formRow:14,
          fieldCode: "attachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={this.$T("scux.orderChange.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderChange.view.button.viewAttachmentUuid"
                  ).$D("附件查看")}
                />
              </div>
            );
          },
          callBack: () => {},
        },
      ];

      return columns;
    },
    //订单行信息
    getLineInfoColumns() {
      const columns = [
        {
          fieldCode: "title",
          fieldType: "EMPTY",
          formRow: 0,
          render: () => {
            return (
              <SrmListHeader>
                <span>{this.$T("scux.orderChange.view.title.orderLineInfo").$D("订单行信息")}</span>
              </SrmListHeader>
            );
          },
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          langCode: "scux.orderChange.model.lineNum",
          formRow: 1,
          formCol:1
        },
        {
          fieldName: "物料名称",
          fieldCode: "itemName",
          langCode: "scux.orderChange.model.itemName",
          fieldType:"EMPTY",
          render:(val)=>{
            return (
              this.lineChangeList.includes("itemName") ? <srm-flex>
                <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderChange.model.itemName").$D("物料名称")}：</span>
                <span style="color:red">{val}</span>
              </srm-flex> : <srm-flex>
                <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderChange.model.itemName").$D("物料名称")}：</span>
                <span>{val}</span>
              </srm-flex>
            );
          },
          formRow: 2,
          formCol:1
        },
        {
          fieldName: "物料备注",
          fieldCode: "attributeVarchar2",
          langCode: "scux.orderChange.model.itemRemark",
          fieldType: "EMPTY",
          formRow: 3,
          formCol:1,
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderChange.model.itemRemark").$D("物料备注")}：</span>
              {this.lineChangeList.includes("attributeVarchar2") ? <span style="color:red">{val}</span> : <span>{val}</span>}
            </srm-flex>;
          }
        },
        {
          fieldName: "数量",
          fieldCode: "quantity",
          langCode: "scux.orderChange.model.quantity",
          render:(val)=>{
            return (
              this.lineChangeList.includes("quantity") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 4,
          formCol:1,
        },
        {
          fieldName: "单位",
          fieldCode: "uomCodeAndName",
          langCode: "scux.orderChange.model.uomCodeAndName",
          render:(val)=>{
            return (
              this.lineChangeList.includes("uomCodeAndName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 4,
          formCol:2,
        },
        {
          fieldName: "容差上限",
          fieldCode: "attributeBigint7",
          langCode: "scux.orderChange.model.toleranceUpperLimit",
          render:(val)=>{
            return (
              this.lineChangeList.includes("attributeVarchar7") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 5,
          formCol:1,
        },
        {
          fieldName: "容差下限",
          fieldCode: "attributeBigint8",
          langCode: "scux.orderChange.model.toleranceLowerLimit",
          render:(val)=>{
            return (
              this.lineChangeList.includes("attributeVarchar8") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 5,
          formCol:2,
        },
        {
          fieldName: "含税单价",
          fieldCode: "enteredTaxIncludedPrice",
          langCode: "scux.orderChange.model.TaxIncludedUnitPrice",
          render:(val)=>{
            return (
              this.lineChangeList.includes("enteredTaxIncludedPrice") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 6,
          formCol:1,
        },
        {
          fieldName: "币种",
          fieldCode: "currencyCode",
          langCode: "scux.orderChange.model.currencyCode",
          render:(val)=>{
            return (
              this.lineChangeList.includes("currencyCode") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 6,
          formCol:2,
        },
        {
          fieldName: "税率",
          fieldCode: "taxRate",
          langCode: "scux.orderChange.model.taxRate",
          render:(val)=>{
            return (
              this.lineChangeList.includes("taxRate") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 7,
          formCol:1,
        },
        {
          fieldName: "不含税单价",
          fieldCode:"unitPrice",
          langCode: "scux.orderChange.model.noIncludeTaxUnitPrice",
          render:(val)=>{
            return (
              this.lineChangeList.includes("unitPrice") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 7,
          formCol:2
        },
        {
          fieldName: "需求日期",
          fieldCode: "needByDate",
          langCode: "scux.orderChange.model.needByDate",
          render:(val)=>{
            return (
              // eslint-disable-next-line new-cap
              this.lineChangeList.includes("needByDate") ? <span style="color:red">{this.$options.filters["CalcDate"](val)}</span> : <span>{this.$options.filters["CalcDate"](val)}</span>
            );
          },
          formRow: 8,
          formCol:1
        },
        {
          fieldName: "海外到货日期",
          fieldCode: "attributeDatetime1",
          langCode: "scux.orderChange.model.deliveryOverseasDate",
          formRow: 8,
          formCol:2,
          render:(val)=>{
            return (
              // eslint-disable-next-line new-cap
              this.lineChangeList.includes("attributeDatetime1") ? <span style="color:red">{this.$options.filters["CalcDate"](val)}</span> : <span>{this.$options.filters["CalcDate"](val)}</span>
            );
          },
        },
        {
          fieldName: "项目描述2",
          fieldCode: "attributeVarchar4",
          langCode: "scux.orderChange.model.projectDescription",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderChange.model.projectDescription").$D("项目描述")}：</span>
              {this.lineChangeList.includes("attributeVarchar4") ? <span style="color:red">{val}</span> : <span>{val}</span>}
            </srm-flex>;
          },
          formRow: 9,
        },
        {
          fieldName: "采购协议",
          fieldCode: "attributeVarchar11",
          langCode: "scux.orderChange.model.purchaseAgreement",
          formRow: 10,
          render:(val)=>{
            return (
              // eslint-disable-next-line new-cap
              this.lineChangeList.includes("attributeVarchar11") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
        },
        {
          fieldName: "备注",
          fieldCode: "remark",
          langCode: "scux.orderChange.model.remark",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderChange.model.remark").$D("备注")}：</span>
              {this.lineChangeList.includes("remark") ? <span style="color:red">{val}</span> : <span>{val}</span>}
            </srm-flex>;
          },
          formRow: 11,
        },
        {
          fieldName:"附件",
          formRow:12,
          fieldCode: "attachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={this.$T("scux.orderChange.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderChange.view.button.viewAttachmentUuid"
                  ).$D("附件查看")}
                />
              </div>
            );
          },
          callBack: () => {},
        },
      ];

      return columns;
    },
  },
  mounted() {
    this.poNum = JSON.parse(this.$route.query.info).poNum;
    this.poHeaderId = JSON.parse(this.$route.query.info).poHeaderId;
    this.getOrderChangeDetail();
    this.getOrderLine();
    this.getOperationRecord();
  },

  methods: {
    async getOrderChangeDetail() {
      await getOrderChangeDetailApi(this.id || this.poNum).then((res)=>{
        this.orderChange = res.content[0];
      });
    },
    //获取订单行信息
    getOrderLine() {
      let params = {
        camp: 1, //1采购方2供应商
        customizeUnitCode: "SODR.ORDER_APPROVE_LINE_LIST.APPROVE,SODR.ORDER_APPROVE_LINE_LIST.OTHER",
        sortType: 1, //排序类型
      };
      getOrderLineApi(this.poHeaderId, params).then((res) => {
        this.lineInfoList = res.content;
      });
    },
    //获取操作记录
    getOperationRecord() {
      getOperationRecordApi(this.poHeaderId).then((res)=>{
        this.headerChangeList = res.content.map((item)=>{
          if (item.ChangeTypeCode === "UPDATE" && !item.displayLineNum) {
            return item.ChangeFieldName;
          }
        }).filter((item)=>item);
        this.lineChangeList = res.content.map((item)=>{
          if (item.ChangeTypeCode === "UPDATE" && item.displayLineNum) {
            return item.ChangeFieldName;
          }
        }).filter((item)=>item);
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
>>> .noWrap>div{
  display:flex;
}
>>> .srm-upload{
  width:auto;
}
</style>
