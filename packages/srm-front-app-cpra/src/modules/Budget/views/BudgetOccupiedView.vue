<template>
    <div class="site-investigation-report-manage">
    <srm-tab-bar display="justify"  @indexChange="tabIndexChange">
      <srm-tab-item :label="this.$T('sbdm.common.model.common.budgetDetailInfo').$D('占用/核销明细')">
        <!-- 报告管理列表 -->
    
        <srm-list  v-if="budgetDetailInfoDs" :data-set="budgetDetailInfoDs" :columns="getDetailColumns"   />
      </srm-tab-item>
      <srm-tab-item :label="this.$T('sbdm.common.model.common.occupiedDetail').$D('占用明细')">
        <!-- 报告填制列表 -->
        <srm-list  v-if="occupiedDetailDs"  :data-set="occupiedDetailDs" :columns="getDetailColumns"/>
      </srm-tab-item>
      <srm-tab-item :label="this.$T('sbdm.common.model.common.appliedDetail').$D('核销明细')">
        <!-- 报告填制列表 -->
        <srm-list  v-if="appliedDetailDs" :data-set="appliedDetailDs" :columns="getDetailColumns" />
      </srm-tab-item>
    </srm-tab-bar>
    </div>
  </template>
  
  <script>
//   import { getBudgetAmount } from "../api/index";
  import { DataSet } from "srm-mobile-ui";
  import { occupiedListDs } from "../datasource/allDataSet";
  export default {
    modules: ["sprm.common", "hipspfm.common", "sprm.purchaseRequest", "sbdm.common", "smbl.common", "hzero.common", "hzero.button"],
    name: "BudgetOccupiedView",
    props: {
      parameters: {
        type: Object,
        default: null,
      },
      budgetLineId:{
        type: String|Number,
        default:''
      },
    },
    data() {
      return {
        budgetDetailInfoDs: null,
        occupiedDetailDs:null,
        appliedDetailDs:null,
        amountState:{},
      };
    },
    computed: {
      // 任务成本-Columns
      getDetailColumns() {
        const adjustList = [
            {
                fieldCode: "documentNum",
                fieldName: this.$T(`sbdm.common.model.common.documentNum`).$D("据编码-行号"),

            },
            {
                fieldCode: "documentTypeMeaning",
                fieldName: this.$T(`sbdm.common.model.common.documentType`).$D("单据类型"),
            },
            {
                fieldCode: "documentDate",
                fieldName: this.$T(`sbdm.common.model.common.documentDate`).$D("占用时间"),
            },
            {
                fieldCode: "amount",
                fieldName: this.$T(`sbdm.common.model.common.occupiedOrAppliedAmount`).$D("占用/核销金额"),
            },
            {
                fieldCode: "incomingIdentityMeaning",
                fieldName: this.$T(`sbdm.common.model.common.incomingIdentityMeaning`).$D("传入标识"),
            },
            {
                fieldCode: "lotNum",
                fieldName: this.$T(`sbdm.common.model.common.lotNum`).$D("批次编码"),
            },
            {
                fieldCode: "parentDocumentNum",
                fieldName: this.$T(`sbdm.common.model.common.parentDocumentNum`).$D("上游单据编码"),
            },
            {
                fieldCode: "operatorName",
                fieldName: this.$T(`sbdm.common.model.common.parentDocumentNum`).$D("上游单据编码"),
            },
            {
                fieldCode: "origBudgetAmount",
                fieldType: 'NUMBER',
                fieldName: this.$T(`sbdm.common.model.common.operatorName`).$D("操作人"),
            },
        ];
        return adjustList
      },
  
    },
    beforeMount() {
    //     console.log(this)
    //   if (this.$attrs?.budgetLineId) {
    //     // 审批页面过来的，不可显示审批按钮
    //     this.budgetLineId = this.parameters.budgetLineId;
    //   } 
      this.requestData();
    },
    methods: {
        tabIndexChange(value){
            console.log(value)
            if(value===0){
                this.budgetDetailInfoDs.query();
            }else if(value===1){
                this.occupiedDetailDs.query();
            }else if(value===2){
                this.appliedDetailDs.query();
            }
        },
      async requestData() {
        this.budgetDetailInfoDs = new DataSet(occupiedListDs(this.budgetLineId,{ dataSources:"all",aggregationMethod:'detail',}));
        this.occupiedDetailDs = new DataSet(occupiedListDs(this.budgetLineId,{dataSources:"occupy", aggregationMethod:'detail', }));
        this.appliedDetailDs = new DataSet(occupiedListDs(this.budgetLineId, {dataSources:"cancellation", aggregationMethod:'detail', }));
        this.budgetDetailInfoDs.query();
      },
    },
  };
  </script>
  
  <style lang="stylus" scoped>

  .site-investigation-report-manage {
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  
  .create-button {
    position: absolute;
    right: 15px;
    bottom: 72px;
    width: 60px;
    height: 60px;
  }
  
  .round-btn {
    padding: 0;
  
    .srm-icon {
      font-size: 28px;
    }
  }
  
  </style>