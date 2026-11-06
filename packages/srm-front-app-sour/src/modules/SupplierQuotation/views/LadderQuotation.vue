<template>
  <div>
    <div>
      <srm-detail-head :data-source="lineData" :columns="getDetailHeadColumns"/>
      <section class="content">
        <srm-list
          :data-set="getDataSet"
          :show-bottom-bar="editCheckStatus"
          :buttons="getBtnArr()"
          :columns="getColumns"/>
      </section>
    </div>
    <srm-bottom-handler v-if="!noParticipateFlag && isStart && !isShowSave" :btn-arr="getBtnSecondArr()" type="tooltip"/>
  </div>
</template>

<script>
import { SrmUtil, DataSet } from "srm-mobile-ui";
import ladderQuotationDS from "../datasource/ladderQuotationDataSet";
import LadderQuotationColumns from "../mixins/LadderQuotationColumns";

export default {
  modules: [ "hipspfm.supplierQuotation", "hipspfm.common", "ssrc.supplierQuotation", "ssrc.inquiryHall", "hzero.common", "sslm.enterpriseInform", "ssrc.common" ],
  name: "LadderQuotation",
  components: {
  },
  mixins: [ LadderQuotationColumns ],
  props: {
    headInfo:{
      type: Object,
      default: () => ({})
    },
    lineData: {
      type: Object,
      default: () => ({})
    },
    doubleUnitFlag: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      quotationLineId: null,
      rfxLineItemId: "",
      itemCode: "",
      itemName: "",
      taxRate: "",
      currencyCode: "",
      lineStatus:"",
      noParticipateFlag:false,
      lineNum: null,
      isStart: false,
      getDataSet:{},
      continuousQuotationFlag: false, //是否可以连续报价
      diyLadderQuotationFlag: false //是否可配置阶段报价
    };
  },
  computed:{
    isUnTaxPriceFlag() {
      return this.headInfo && this.headInfo.priceTypeCode === "NET_PRICE";
    },
    disableTaxPriceFlag() {
      return this.isUnTaxPriceFlag ||
      this.disabledLadderLevel(this.continuousQuotationFlag, this.quotationLineStatus);
    },
    getColumns() {
      if (this.editCheckStatus || this.editUnCheckStatus) {
        return this.getLadderQuotationColumns(true);
      }
      return this.getLadderQuotationColumns();
    },
    //可编辑可勾选状态
    editCheckStatus() {
      return !this.noParticipateFlag && this.diyLadderQuotationFlag && this.isStart;
    },
    //可编辑不可勾选
    editUnCheckStatus() {
      return !this.noParticipateFlag && !this.diyLadderQuotationFlag && this.isStart;
    },
    // 保存按钮显示
    isShowSave() {
      return !this.noParticipateFlag && this.diyLadderQuotationFlag && this.isStart;
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.curryCode").$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.taxRate:").$D("税率"),
          fieldCode: "taxRate",
          render:(val) => val ? <span>{val}%</span> : <span>{val}</span>
        },
      ];

      return columns;
    },
  },
  watch: {
  },
  created() {
    this.initData();
  },
  methods: {
    getBtnSecondArr() {
      return [
        {
          title: this.$T("hzero.common.save").$D("保存"),
          type: "primary",
          bordered: true,
          handler: () => {
            this.saveInfo();
          }
        }
      ];
    },
    // 按钮
    getBtnArr() {
      if (this.editCheckStatus) {
        return [
          {
            type:"primary",
            fill:true,
            text: this.$T("hipspfm.common.button.create").$D("新建"),
            // eslint-disable-next-line no-return-assign
            visible: true,
            callback: this.createList
          },
          {
            type:"danger",
            text: this.$T("hipspfm.common.button.delete").$D("删除"),
            callback: (checkedListData) => {
              this.deleteList(checkedListData);
            },
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
          },
          {
            type: "primary",
            text: this.$T("hzero.common.save").$D("保存"),
            visible: !this.noParticipateFlag && this.isStart,
            callback: () => {
              this.saveInfo();
            },
          }
        ];
      }

    },
    initData() {
      this.lineStatus = this.lineData.lineStatus;
      this.taxRate = this.lineData.taxRate;
      this.taxIncludedFlag = this.lineData.taxIncludedFlag;
      this.noParticipateFlag = this.lineData.noParticipateFlag;
      this.quotationLineStatus = this.lineData.quotationLineStatus; //报价状态
      this.diyLadderQuotationFlag = Boolean(Number(this.lineData.diyLadderQuotationFlag)); //是否自定义阶梯报价
      this.continuousQuotationFlag = Boolean(Number(this.lineData.continuousQuotationFlag)); //是否可以连续报价
      this.quotationLineId = this.lineData.quotationLineId;
      this.rfxLineItemId = this.lineData.rfxLineItemId;
      let lineId = this.noParticipateFlag ? this.rfxLineItemId : this.quotationLineId;
      this.isStart = this.isStartHandler();
      if (this.editCheckStatus) {
        this.getDataSet = new DataSet(ladderQuotationDS(this.noParticipateFlag, lineId, true));
      } else {
        this.getDataSet = new DataSet(ladderQuotationDS(this.noParticipateFlag, lineId, false));
      }
    },
    // 保存阶梯报价信息
    saveInfo() {
      if (!this.getDataSet.validate()) {
        return;
      }
      if (this.getDataSet.data.length) {
        this.getDataSet.submitRecords(this.getDataSet.records).then((res) => {
          if (!res.failed) {
            this.$notification.open({
              message: this.$T("hipspfm.common.message.saveSuccess").$D(
                "保存成功"
              ),
            });
          } else {
            this.$notification.open({
              message: res.message,
            });
          }
        }).catch((e) => {
          console.log(e, "e");
        });
      } else {
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.message.validation.noDataToSave"
          ).$D("没有可保存的数据"),
        });
      }
    },
    // 新建
    createList() {
      this.getDataSet.create({
        cumulativeFlag:0,
        currentLadderPrice:null,
        currentNetLadderPrice:null,
        ladderFrom:null,
        ladderTo:null,
        quotationLineId:this.quotationLineId,
        rfxLadderLineNum:this.getDataSet.records.length + 1,
        tenantId:Number(SrmUtil.getTenantId()),
        _status: "create"
      }, this.getDataSet.records.length);
    },
    // 删除
    async deleteList(checkedListData) {
      let arr = checkedListData.map((item) => {
        const { rfxLadderLineNum } = item.data;
        return rfxLadderLineNum;
      }).sort();
      if (checkedListData.length) {
        let flag = arr[arr.length - 1 ] === this.getDataSet.data[this.getDataSet.data.length - 1].rfxLadderLineNum;
        if (flag && this.isContinuityNum(arr)) {
          this.getDataSet.removeSelect();
        } else {
          this.$notification.open({
            message:
              this.$T(
                "hipspfm.supplierQuotation.message.validation.onlyDeleteTheLastData"
              ).$D("只能从最后一行已保存行开始删除") + "!",
            key,
            class: "notification"
          });
        }
      } else {
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.message.validation.noSelectDeleteLine"
          ).$D("您未选中需要删除的行"),
        });
      }
    },
    // 判断是否可以报价
    isStartHandler() {
      const { quotationStartDate, quotationEndDate } = this.lineData;
      const isStartFlag =
        [ "IN_QUOTATION", "NEW", "BARGAINED" ].includes(
          this.quotationLineStatus
        ) || this.continuousQuotationFlag;
      if (quotationStartDate && quotationEndDate) {
        let flag =
          new Date(quotationStartDate.replace(/-/g, "/")).getTime() < Date.now() &&
          Date.now() < new Date(quotationEndDate.replace(/-/g, "/")).getTime();
        return flag && isStartFlag;
      }
      return isStartFlag;

    },
    //判断是否是从末尾的开始的连续数字
    isContinuityNum(num) {
      let array = [];
      if (num instanceof Array) {
        array = [ ...num ];
      } else {
        array = Array.from(num.toString());//转换为数组
      }
      let i = array[0];
      let isContinuation = true;
      // eslint-disable-next-line no-unused-vars
      for (let e in array) {
        if (array[e] !== i) {
          isContinuation = false;
          break;
        }
        i++;
      }
      return isContinuation;
    },
    disabledLadderLevel(continuousQuotationFlag, quotationLineStatus) {
      // 供应商非连续报价
      if (continuousQuotationFlag === 0 && quotationLineStatus === "SUBMITTED") {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.content {
  background: var(--color-bg-default-b);
  height: calc(100vh - 176px);
}
</style>
