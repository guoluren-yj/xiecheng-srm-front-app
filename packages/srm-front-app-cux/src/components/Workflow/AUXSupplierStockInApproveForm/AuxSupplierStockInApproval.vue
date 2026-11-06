<template>
  <div class="stock-in-approval">
    <div class="head-line" />
    <div class="head">
      <div class="head-row">
        <customize :columns="getHeadColumns" :data-source="headInfo" type="list"/>
      </div>
    </div>
    <div>
      <div style="padding: 16px 15px 0px 16px;">
        <srm-list-header><span>{{ $T("smbl.common.view.rkSupplyInfo").$D("入库供方信息") }}</span></srm-list-header>
      </div>
      <div v-for="(item, index) in poLineList" :key="index" class="line-card">
        <!-- - index仅在此处可以获得 - -->
        <div class="line-company">{{ (index + 1).toString() + "-" + item.supplierCompanyName }}</div>
        <customize :columns="getLineColumns" :data-source="item" type="list"/>
      </div>
    </div>
    <srm-popup :visible.sync="isScoreDetailShowFlag" :title="$T('smbl.common.view.title.scoreDetail').$D('得分明细')" height="80%" rounded>
      <div v-for="(item, index) in scoreItemList" :key="index" class="score-detail-card">
        <customize :columns="getScoreColumns" :data-source="item" type="list"/>
      </div>
      <div class="safe-bottom" />
    </srm-popup>
  </div>
</template>

<script>
import {
  getStockInOrderInfo,
  getStockInLineInfo,
  getLovTypeMeaning,
  getZrLinesDetails,
} from "./api/AuxStockInApprovalApi";
export default {
  modules: [ "scux.supplierAccessManagement", "smbl.common" ],
  name: "AuxSupplierStockInApproval",
  components: {
  },
  props: {
    changeReqId: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      headInfo: {},
      poLineList: [],
      checkTypeValus: [],
      rigidityFlagMeanings: [],
      baselineMeaning: [],
      isScoreDetailShowFlag: false,
      scoreItemList: [],
    };
  },
  computed: {
    getHeadColumns() {
      return [ {
        fieldName: "title",
        fieldType: "EMPTY",
        fieldCode: "title",
        formRow: 1,
        render: () => <srm-list-header>
          <span>{ this.$T("smbl.common.view.rkHeadInfo").$D("入库表头信息") }</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.type").$D("类型"),
        fieldType: "TEXT",
        fieldCode: "typeMeaning",
        formRow: 10,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.createdName").$D("创建人"),
        fieldType: "TEXT",
        fieldCode: "createdName",
        formRow: 10,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.categoryName").$D("品类"),
        fieldType: "TEXT",
        fieldCode: "categoryName",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.classification").$D("分类"),
        fieldType: "TEXT",
        fieldCode: "classificationMeaning",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.attachment").$D("附件"),
        fieldType: "TEXT",
        fieldCode: "attachmentUuid",
        formRow: 30,
        render: (val) => <SrmUpload attachmentUuid={val} class="check-button" showCount={false} showIcon={false} descTitle={"查看"}/>,
      }, ];
    },
    getLineColumns() {
      return [ {
        fieldName: this.$T("scux.supplierAccessManagement.model.categoryName").$D("品类"),
        fieldType: "TEXT",
        fieldCode: "categoryName",
        formRow: 10,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.checkType").$D("校验类型"),
        fieldType: "TEXT",
        fieldCode: "checkType",
        formRow: 10,
        render: (val) => {
          let type = val;
          for (let i = 0; i < this.checkTypeValus.length; i++) {
            const item = this.checkTypeValus[i];
            if (Number(val) === Number(item.value)) {
              type = item.meaning;
              break;
            }
          }
          return type;
        },
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.checkStage").$D("校验阶段"),
        fieldType: "TEXT",
        fieldCode: "checkStageMeaning",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.basicScore").$D("基准分"),
        fieldType: "TEXT",
        fieldCode: "baseScore",
        formRow: 30,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.score").$D("得分"),
        fieldType: "TEXT",
        fieldCode: "score",
        formRow: 30,
        render: (val, item) => <div onclick={
          (e) => {
            e.stopPropagation();
            this.checkScoreDetailAction(item);
          }
        }>
          <span class="scop-number">{item.score}</span>
          <span class="detail-button">{"明细"}</span>
        </div>,
      },
      {
        fieldName: this.$T("scux.supplierAccessManagement.model.passMeaning").$D("是否通过"),
        fieldType: "TEXT",
        fieldCode: "pass",
        formRow: 40,
        render: (val) => <span>{Number(val) ? this.$T("scux.supplierAccessManagement.model.yes").$D("是") : this.$T("scux.supplierAccessManagement.model.no").$D("否")}</span>,
      },
      {
        fieldName: this.$T("scux.supplierAccessManagement.model.attachment").$D("附件"),
        fieldType: "TEXT",
        fieldCode: "attachmentUuid",
        formRow: 40,
        formCol: 20,
        render: (val) => <SrmUpload attachmentUuid={val} class="check-button" showCount={false} showIcon={false} descTitle={"查看"}/>,
      }, ];
    },
    getScoreColumns() {
      return [ {
        fieldName: this.$T("scux.supplierAccessManagement.model.type").$D("类型"),
        fieldType: "EMPTY",
        fieldCode: "ruleDetails",
        formRow: 1,
        render: (val) =>
          // score-type字体14，加粗
          <div class="score-type">{ val }</div>
        ,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.dataName").$D("规则明细"),
        fieldType: "TEXT",
        fieldCode: "dataName",
        formRow: 10,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.rigidityFlag").$D("是否刚性"),
        fieldType: "TEXT",
        fieldCode: "rigidityFlag",
        formRow: 20,
        render: (val) => {
          let rigidity = val;
          for (let i = 0; i < this.rigidityFlagMeanings.length; i++) {
            let item = this.rigidityFlagMeanings[i];
            if (Number(item.value) === Number(val)) {
              rigidity = item.meaning;
              break;
            }
          }
          return rigidity;
        },
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.useFlag").$D("是否适用"),
        fieldType: "TEXT",
        fieldCode: "useFlag",
        formRow: 20,
        render: (val) => val === "Y" ? this.$T("scux.supplierAccessManagement.model.yes").$D("是") : this.$T("scux.supplierAccessManagement.model.no").$D("否"),
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.baseline").$D("底线"),
        fieldType: "TEXT",
        fieldCode: "baseline",
        formRow: 30,
        render: (val) => {
          let baseline = val;
          for (let i = 0; i < this.baselineMeaning.length; i++) {
            let item = this.baselineMeaning[i];
            if (item.value === val) {
              baseline = item.meaning;
              break;
            }
          }
          return baseline;
        },
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.score").$D("得分"),
        fieldType: "TEXT",
        fieldCode: "score",
        formRow: 30,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.actual").$D("实际"),
        fieldType: "TEXT",
        fieldCode: "actualLovVal",
        formRow: 40,
        render: (val, item) => val ? val : item.actual,
      }, {
        fieldName: this.$T("scux.supplierAccessManagement.model.passMeaning").$D("是否通过"),
        fieldType: "TEXT",
        fieldCode: "throughFlag",
        formRow: 40,
        render: (val) => Number(val) === 1 ? this.$T("scux.supplierAccessManagement.model.yes").$D("是") : this.$T("scux.supplierAccessManagement.model.no").$D("否"),
      }, ];
    },
  },
  async mounted() {
    let stockInId = this.changeReqId;

    this.headInfo = await getStockInOrderInfo(stockInId);
    this.checkTypeValus = await getLovTypeMeaning("SCUX.AUX.ZR.CHECK_TYPE");
    this.poLineList = await getStockInLineInfo(stockInId);
    this.rigidityFlagMeanings = await getLovTypeMeaning("SCUX.AUX.SUPPLIER.RIGIDITYFLAG");
    this.baselineMeaning = await getLovTypeMeaning("SCUX.AUX.USEFLAG");
  },
  methods: {
    async checkScoreDetailAction(item) {
      this.scoreItemList = [];
      this.isScoreDetailShowFlag = true;
      let { content } = await getZrLinesDetails(item.auxZrHeaderId);

      this.scoreItemList = content;
    },
  }
};
</script>

<style lang="stylus" scoped>
.stock-in-approval {
  width: 100%;
  height: 100%;

  .head-line {
    width: 100%;
    height: 9px;
  }
  .head-title-content {
    padding-top: 16px;
    line-height: 20px;

    .head-block {
      background-color: var(--color-other-default-b);
      width: 7px;
      height: 10px;
      margin-right: 8px;
    }
    .head-title {
      color: var(--color-font-default);
      font-weight: bold;
      font-size: 14px;
    }
  }

  .head {
    background-color: white;
    width: 100%;
    padding-bottom: 12px;
  }
  .head-row {
    padding: 16px 15px 0px 15px;
  }
  .check-button {
    >>> .srm-upload-title {
      color: var(--color-other-default-b);
      font-size: 14px;
      font-weight: bold;
    }
  }
  .detail-button {
    color: var(--color-other-default-b);
    font-size: 14px;
    font-weight: bold;
  }

  .line-card {
    margin: 15px 15px 0 15px;
    background-color: white;
    padding: 12px 15px;

    .line-company {
      font-size: 14px;
      color: var(--color-font-default);
      font-weight: bold;
      margin-bottom: 10px;
    }
    .scop-number {
      font-size: 14px;
      color: var(--color-font-default);
      margin-right: 8px;
    }
  }
}
.score-detail-card {
  background-color: white;
  margin: 5px 5px 0 5px;
  padding: 8px 15px 12px 15px;
  border-radius: 5px;
  .score-type {
    color: var(--color-font-default);
    font-size: 14px;
    font-weight: bold;
  }
}
.safe-bottom {
  width: 100%;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
>>> .srm-popup-content {
  background-color: #F0F2F5;
  overflow: scroll;
}
</style>
