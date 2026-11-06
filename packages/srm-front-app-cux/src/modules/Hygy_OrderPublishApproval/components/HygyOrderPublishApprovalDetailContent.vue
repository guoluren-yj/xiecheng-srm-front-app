<template>
  <div style="height: 100vh">
    <!-- 内容区 -->
    <Customize :need-padding="true" :data-source="orderPublish" :columns="getOrderPublishInfoColumns" />
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
import { getOrderPublishDetailApi,getOrderLineApi,getOperationRecordApi } from "../api";
export default {
  modules: [ "scux.orderPublish","spcm.common" ],
  name: "HygyOrderPublishApprovalDetailContent",
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
      orderPublish:{},
      poNum: "",
      poHeaderId:"",
      lineInfoList:[],
      headerPublishList:[],
      linePublishList:[]
    };
  },
  computed: {
    // 详情内容
    getOrderPublishInfoColumns() {
      const columns = [
        {
          fieldCode: "title",
          fieldType: "EMPTY",
          formRow: 0,
          render: () => {
            return (
              <SrmListHeader>
                <span>{this.$T("scux.orderPublish.view.title.orderHeaderInfo").$D("订单头信息")}</span>
              </SrmListHeader>
            );
          },
        },
        {
          fieldName: "订单号",
          fieldCode: "poNum",
          langCode: "scux.orderPublish.model.poNum",
          formRow: 1,
          render:(val)=>{
            return (
              this.headerPublishList.includes("poNum") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "公司",
          fieldCode: "companyName",
          langCode: "scux.orderPublish.model.companyName",
          formRow: 2,
          render:(val)=>{
            return (
              this.headerPublishList.includes("companyName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "供应商名称",
          fieldCode: "supplierName",
          langCode: "scux.orderPublish.model.supplierName",
          formRow: 3,
          render:(val)=>{
            return (
              this.headerPublishList.includes("supplierName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "订单类型",
          fieldCode: "poTypeDesc",
          langCode: "scux.orderPublish.model.poTypeDesc",
          formRow: 4,
          render:(val)=>{
            return (
              this.headerPublishList.includes("poTypeDesc") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "含税金额",
          fieldCode: "taxIncludeAmount",
          langCode: "scux.orderPublish.model.taxIncludeAmount",
          render:(val)=>{
            return (
              this.headerPublishList.includes("taxIncludeAmount") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 5,
        },
        {
          fieldName: "不含税金额",
          fieldCode:"amount",
          langCode: "scux.orderPublish.model.amount",
          render:(val)=>{
            return (
              this.headerPublishList.includes("amount") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 6,
        },
        {
          fieldName: "币种",
          fieldCode: "currencyCode",
          langCode: "scux.orderPublish.model.currencyCode",
          formRow: 7,
          render:(val)=>{
            return (
              this.headerPublishList.includes("currencyCode") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "总数量",
          fieldCode: "quantityTotal",
          langCode: "scux.orderPublish.model.quantityTotal",
          formRow: 8,
          render:(val)=>{
            return (
              this.headerPublishList.includes("quantityTotal") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "付款条件",
          fieldCode: "termsName",
          langCode: "scux.orderPublish.model.termsName",
          formRow: 9,
          render:(val)=>{
            return (
              this.headerPublishList.includes("termsName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "月结账期（天）",
          fieldCode: "attributeVarchar10",
          langCode: "scux.orderPublish.model.monthlyInvocingPeriod",
          formRow: 10,
          render:(val)=>{
            return (
              this.headerPublishList.includes("attributeVarchar10") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "付款方式",
          fieldCode: "attributeVarchar11Meaning",
          langCode: "scux.orderPublish.model.paymentMethod",
          formRow: 11,
          render:(val)=>{
            return (
              this.headerPublishList.includes("attributeVarchar11Meaning") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          }
        },
        {
          fieldName: "订单摘要",
          fieldCode: "remark",
          fieldType: "EMPTY",
          langCode: "scux.orderPublish.model.orderSummary",
          formRow: 12,
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderPublish.model.orderSummary").$D("订单摘要")}：</span>
              {this.headerPublishList.includes("remark") ? <span style="color:red">{val}</span> : <span>{val}</span>}
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
                  title={this.$T("scux.orderPublish.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderPublish.view.button.viewAttachmentUuid"
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
                  title={this.$T("scux.orderPublish.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderPublish.view.button.viewAttachmentUuid"
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
                <span>{this.$T("scux.orderPublish.view.title.orderLineInfo").$D("订单行信息")}</span>
              </SrmListHeader>
            );
          },
        },
        {
          fieldName: "行号",
          fieldCode: "lineNum",
          langCode: "scux.orderPublish.model.lineNum",
          formRow: 1,
          formCol:1
        },
        {
          fieldName: "物料名称",
          fieldCode: "itemName",
          langCode: "scux.orderPublish.model.itemName",
          fieldType:"EMPTY",
          render:(val)=>{
            return (
              this.linePublishList.includes("itemName") ? <srm-flex>
                <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderPublish.model.itemName").$D("物料名称")}：</span>
                <span style="color:red">{val}</span>
              </srm-flex> : <srm-flex>
                <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderPublish.model.itemName").$D("物料名称")}：</span>
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
          langCode: "scux.orderPublish.model.itemRemark",
          fieldType: "EMPTY",
          formRow: 3,
          formCol:1,
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderPublish.model.itemRemark").$D("物料备注")}：</span>
              {this.linePublishList.includes("attributeVarchar2") ? <span style="color:red">{val}</span> : <span>{val}</span>}
            </srm-flex>;
          }
        },
        {
          fieldName: "数量",
          fieldCode: "quantity",
          langCode: "scux.orderPublish.model.quantity",
          render:(val)=>{
            return (
              this.linePublishList.includes("quantity") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 4,
          formCol:1,
        },
        {
          fieldName: "单位",
          fieldCode: "uomCodeAndName",
          langCode: "scux.orderPublish.model.uomCodeAndName",
          render:(val)=>{
            return (
              this.linePublishList.includes("uomCodeAndName") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 4,
          formCol:2,
        },
        {
          fieldName: "容差上限",
          fieldCode: "attributeBigint7",
          langCode: "scux.orderPublish.model.toleranceUpperLimit",
          render:(val)=>{
            return (
              this.linePublishList.includes("attributeVarchar7") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 5,
          formCol:1,
        },
        {
          fieldName: "容差下限",
          fieldCode: "attributeBigint8",
          langCode: "scux.orderPublish.model.toleranceLowerLimit",
          render:(val)=>{
            return (
              this.linePublishList.includes("attributeVarchar8") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 5,
          formCol:2,
        },
        {
          fieldName: "含税单价",
          fieldCode: "enteredTaxIncludedPrice",
          langCode: "scux.orderPublish.model.TaxIncludedUnitPrice",
          render:(val)=>{
            return (
              this.linePublishList.includes("enteredTaxIncludedPrice") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 6,
          formCol:1,
        },
        {
          fieldName: "币种",
          fieldCode: "currencyCode",
          langCode: "scux.orderPublish.model.currencyCode",
          render:(val)=>{
            return (
              this.linePublishList.includes("currencyCode") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 6,
          formCol:2,
        },
        {
          fieldName: "税率",
          fieldCode: "taxRate",
          langCode: "scux.orderPublish.model.taxRate",
          render:(val)=>{
            return (
              this.linePublishList.includes("taxRate") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
          formRow: 7,
          formCol:1,
        },
        {
          fieldName: "不含税单价",
          fieldCode:"unitPrice",
          langCode: "scux.orderPublish.model.noIncludeTaxUnitPrice",
          render:(val)=>{
            return (
              this.linePublishList.includes("unitPrice") ? <span style="color:red">{this.$options.filters.thousandBitSeparator(val)}</span> : <span>{this.$options.filters.thousandBitSeparator(val)}</span>
            );
          },
          formRow: 7,
          formCol:2
        },
        {
          fieldName: "需求日期",
          fieldCode: "needByDate",
          langCode: "scux.orderPublish.model.needByDate",
          render:(val)=>{
            return (
              // eslint-disable-next-line new-cap
              this.linePublishList.includes("needByDate") ? <span style="color:red">{this.$options.filters["CalcDate"](val)}</span> : <span>{this.$options.filters["CalcDate"](val)}</span>
            );
          },
          formRow: 8,
          formCol:1
        },
        {
          fieldName: "海外到货日期",
          fieldCode: "attributeDatetime1",
          langCode: "scux.orderPublish.model.deliveryOverseasDate",
          formRow: 8,
          formCol:2,
          render:(val)=>{
            return (
              // eslint-disable-next-line new-cap
              this.linePublishList.includes("attributeDatetime1") ? <span style="color:red">{this.$options.filters["CalcDate"](val)}</span> : <span>{this.$options.filters["CalcDate"](val)}</span>
            );
          },
        },
        {
          fieldName: "项目描述2",
          fieldCode: "attributeVarchar4",
          langCode: "scux.orderPublish.model.projectDescription",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderPublish.model.projectDescription").$D("项目描述")}：</span>
              {this.linePublishList.includes("attributeVarchar4") ? <span style="color:red">{val}</span> : <span>{val}</span>}
            </srm-flex>;
          },
          formRow: 9,
        },
        {
          fieldName: "采购协议",
          fieldCode: "attributeVarchar11",
          langCode: "scux.orderPublish.model.purchaseAgreement",
          formRow: 10,
          render:(val)=>{
            return (
              // eslint-disable-next-line new-cap
              this.linePublishList.includes("attributeVarchar11") ? <span style="color:red">{val}</span> : <span>{val}</span>
            );
          },
        },
        {
          fieldName: "备注",
          fieldCode: "remark",
          langCode: "scux.orderPublish.model.remark",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderPublish.model.remark").$D("备注")}：</span>
              {this.linePublishList.includes("remark") ? <span style="color:red">{val}</span> : <span>{val}</span>}
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
                  title={this.$T("scux.orderPublish.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderPublish.view.button.viewAttachmentUuid"
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
    this.getOrderPublishDetail();
    this.getOrderLine();
    this.getOperationRecord();
  },

  methods: {
    async getOrderPublishDetail() {
      await getOrderPublishDetailApi(this.id || this.poNum).then((res)=>{
        this.orderPublish = res.content[0];
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
        this.headerPublishList = res.content.map((item)=>{
          if (item.PublishTypeCode === "UPDATE" && !item.displayLineNum) {
            return item.PublishFieldName;
          }
        }).filter((item)=>item);
        this.linePublishList = res.content.map((item)=>{
          if (item.PublishTypeCode === "UPDATE" && item.displayLineNum) {
            return item.PublishFieldName;
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
