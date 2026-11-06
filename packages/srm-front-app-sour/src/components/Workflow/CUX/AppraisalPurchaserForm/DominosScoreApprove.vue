<!--
 * @Date: 2024-08-15 14:42:16
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
-->
<script>
import { $T, DataSet } from "srm-mobile-ui";
import { head } from "lodash";
import common from "./mixins/common";
import { scoreBasicColumns } from "./datasource/getBasicDS";
import { appraisalAttachmentColumns } from "./datasource/getAttachmentDS";
import { getScoreInfoDs, getScoreInfoColumns, getAllCardColumns, approveSave } from "./datasource/getScoreInfoDs";
import ItemScrollCard from "./components/ItemScrollCard.vue";
import { fetchDimensionList } from "./api";

const customizeUnitCode = [
    'SSLM.SCORING_WORKBENCH_DETAIL.BASIC',
    'SSLM.SCORING_WORKBENCH_DETAIL.SCORE_LIST',
    'SSLM.SCORING_WORKBENCH_DETAIL.SCORE_SEARCH_BAR',
  ].join();

export default {
  name:"ScoreApprove",
  mixins: [ common ],
  modules: [ "sslm.supplierDocManage", "sslm.appraisalScore", "sslm.common", "smbl.common", "hzero.common", "sslm.scoreLevel", "sslm.evaluationQuery", "sslm.siteInvestigateReport", "spfm.supplierKpiIndicator" ],
  data() {
    return {
      showShadow: false,
      supplierDimension: true, // 评分维度为供应商维度
      itemScrollCardData:[],
      activeCard: 0, //当前激活的card
    };
  },
  beforeMount() {
    this.attachmentDs.setQueryParameter({
      evalHeaderId: this.evalHeaderId,
      uploadUserId: this.submitUserId,
      submitUserId: this.submitUserId,
    });
  },
  mounted() {
    this.init();
    const scrollEl = document.getElementsByClassName("approval-detail-scroll-el")[0];
    if (scrollEl) {
      scrollEl.addEventListener("scroll", this.handleScroll);
    }
  },
  methods:{
    // 查询滚动卡片的值，并查询初始评分信息
    init() {
      this.$loading.show();
      const dimension = this.supplierDimension ? "SU" : this.evalGranularity === "SU+CA" ? "CA" : "IT";
      fetchDimensionList({
        dimension,
        evalHeaderId:this.evalHeaderId,
        submitUserId:this.submitUserId,
      }).then((res) => {
        if (res && !res.failed) {
          this.itemScrollCardData = res;
          this.queryScoreData(head(res), dimension);
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    handleScroll() {
      this.showShadow = this.$refs.dimensionContainer?.getBoundingClientRect()?.top <= 0;
    },
    // 查询评分信息
    queryScoreData(data, dimension) {
      const queryParamsKey = {
        SU: "supplierId",
        CA: "categoryId",
        IT: "itemId",
      };
      const queryKey = queryParamsKey[dimension];
      const queryValue = data[queryKey];
      this.scoreInfoDs.setQueryParameter({
        submitUserId: this.submitUserId,
        customizeUnitCode: [
          "SSLM.SCORING_WORKBENCH_DETAIL.SCORE_SEARCH_BAR",
          "SSLM.SCORING_WORKBENCH_DETAIL.SCORE_LIST"
        ].join(","),
        [queryKey]: queryValue,
      });
      this.scoreInfoDs.refresh();
    },
    // 改变评分维度
    changeDimension(flag) {
      if (this.supplierDimension !== flag) {
        this.supplierDimension = flag;
        this.activeCard = 0;// 维度改变时，重置底下激活的卡片
        this.init();
      }
    },
    // 卡片点击回调
    handCardClick(record, activite) {
      if (this.activeCard !== activite) {
        this.activeCard = activite;
        const dimension = this.supplierDimension ? "SU" : this.evalGranularity === "SU+CA" ? "CA" : "IT";
        this.queryScoreData(record, dimension);
      }
    },
    // 全部卡片item点击回调
    handleItemClick(item, index, cardScrollTo) {
      this.handCardClick(item.data, index);
      this.allCardPopup.closePopup();
      cardScrollTo(index);
    },
    // 卡片中全部按钮回调
    handleClickAll(cardScrollTo) {
      const allCardDs = new DataSet(getScoreInfoDs({ evalHeaderId:this.evalHeaderId, }));
      allCardDs.setData(this.itemScrollCardData || []);
      this.allCardPopup = this.$popup({
        title: this.supplierDimension ?
          $T("sslm.common.view.supplier.supplierCompany").$D("供应商") :
          $T("sslm.appraisalScore.view.message.materialCategory").$D("物料品类"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "60vh",
        rounded: true,
        content: <srm-list
          dataSet={allCardDs}
          scrollable={false}
          columns={getAllCardColumns(this.evalGranularity, this.supplierDimension)}
          onItemClick={(item, index) => this.handleItemClick(item, index, cardScrollTo)}/>,
      });
    },
    // 获取保存参数
    async getSaveParams() {
      const validateFlag =
        (await this.basicDs.validate()) && (await this.scoreInfoDs.validate());
      if (validateFlag) {
        const scoreInfo = this.scoreInfoDs?.toData();
        const basicInfo = this.basicDs?.current?.data || {};
        return {
          ...basicInfo,
          customizeUnitCode,
          // kpiEvalHeaderAttList,
          kpiEvalDetailLineDTOPage: {
            content: scoreInfo,
          },
        };
      }
    },
    // 审批前调用保存
    beforeApprove(approveResult) {
      return new Promise(async (resolve, reject) => {
        if (approveResult === 'Approved') {
          const  saveParams = await this.getSaveParams();
          if (saveParams) {
            const res = await approveSave(saveParams);
            if (res && res.failed) {
              this.$notification.open({
                message: res.message,
                description: "",
                class: "notification"
              });
              reject();
              return false;
            } else {
               resolve(true);
            };
          } else {
            reject();
            return false;
          };
        } else {
          resolve(true);
        }
      });
    }
  },
  render() {
    return (
      <div class="score-approve-wrap" onClick={async () => console.log('11',await this.getSaveParams())}>
        {/** 基础信息 */}
        <srm-form data-set={this.basicDs} columns={scoreBasicColumns} />
        {/** 维度 */}
        <div ref="dimensionContainer" class="dimension-container" style={ { boxShadow: this.showShadow ? "0 2px 4px 0 rgba(0, 0, 0, 0.15)" : "none" } }>
          {this.evalGranularity !== "SU" &&
          <div class="dimension-wrap">
            <div class="dimension-switch">
              <span class={this.supplierDimension ? "active" : ""} onClick={() => this.changeDimension(true)}>
                { $T("sslm.common.view.supplier.supplierCompany").$D("供应商") }
              </span>
              <span class={this.supplierDimension ? "" : "active"} onClick={() => this.changeDimension(false)}>
                { $T("sslm.appraisalScore.view.message.materialCategory").$D("物料品类") }
              </span>
            </div>
          </div>}
          <ItemScrollCard
            activeCard={this.activeCard}
            handClick={this.handCardClick}
            dataList={this.itemScrollCardData}
            handleClickAll={this.handleClickAll}
            evalGranularity={this.evalGranularity}
            supplierDimension={this.supplierDimension}
          />
        </div>
        {/** 评分信息 */}
        <div>
          <div class="custmize-tab-title">
            {$T("sslm.common.view.message.gradInfo").$D("评分信息")}
          </div>
          <div>
            <srm-list scrollable={false} dataSet={this.scoreInfoDs} columns={getScoreInfoColumns(this.evalGranularity, this.supplierDimension)}/>
          </div>
        </div>
        {/** 附件 */}
        <div>
          <div class="custmize-tab-title">
            {$T("hzero.common.upload.modal.title").$D("附件")}
          </div>
          <srm-list
            scrollable={false}
            data-set={this.attachmentDs}
            columns={appraisalAttachmentColumns(this)}/>
        </div>
      </div>
    );
  },
};
</script>
<style lang="stylus" scoped>
.score-approve-wrap{
  background: #F7F8FA !important;
  >>> .srm-form{
    background: #fff;
  }
  .dimension-container{
     margin-top: 4px;
     background: #fff;
     padding: 15px 0 15px 15px;
     position: sticky;
     top: 0;
     z-index 100;
    .dimension-wrap{
     display: flex;
     margin-bottom: 8px;
    .dimension-switch{
      display: flex;
      justify-content: center;
      align-content: center;
      background: #F7F8FA;
      border-radius: 14px;
      font-size: 10px;
      color: #4E5769;
      line-height: 14px;
      cursor: pointer;
      span{
        padding: 6px 10px;
      }
      .active{
        border-radius: 11px;
        background: #fff;
        color: #1D2129;
        font-weight: 600;
        margin: 2px;
        padding: 4px 8px;
      }
    }
  }
  }
  .custmize-tab-title{
    font-size: 14px;
    color: #333;
    line-height: 20px;
    font-weight: 600;
    padding: 10px 15px;
  }
}
  </style>