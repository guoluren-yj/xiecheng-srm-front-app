<script>
import { $T, DataSet } from "srm-mobile-ui";
import common from "./mixins/common";
import { fetchBasic } from "./api";
import { getIndicatorDS, getIndicatorColumns } from "./datasource/getIndicatorDS";
import { getParticipSupplierDs, getParticipSupplierColumns } from "./datasource/getParticipSupplierDS";
import { basicColumns, personFormColumns, participSupplierFormColumns } from "./datasource/getBasicDS";
import { getPersonDs, getPersonColumns } from "./datasource/getPersonDS";

export default {
  name:"NewApprove",
  mixins: [ common ],
  modules: [ "sslm.common", "sslm.supplierDocManage", "hzero.common", "smbl.common", "sslm.scoreLevel", "sslm.evaluationQuery", "sslm.siteInvestigateReport", "spfm.supplierKpiIndicator", "sslm.supplierKpiIndicator", "sslm.common" ],
  data() {
    const { evalHeaderId, evalGranularity } = this.parameters;
    return {
      basicData:{},
      evalRespRule:null,
      personDs: null,
      indicatorDs: new DataSet(getIndicatorDS({ evalHeaderId })),
      participSupplierDs: new DataSet(getParticipSupplierDs({ evalHeaderId, evalGranularity })),
    };
  },
  mounted() {
    this.handleInit();
  },
  methods:{
    handleInit() {
      this.$loading.show();
      fetchBasic({
        evalHeaderId: this.evalHeaderId
      }).then((response) => {
        if (response && !response.failed) {
          this.basicData = response;
          this.evalRespRule = response.evalRespRule;
          this.personDs = new DataSet(getPersonDs({ evalHeaderId:this.evalHeaderId, evalRespRule: response.evalRespRule }));
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 查看下级指标
    viewChildIndicators(data) {
      const dataSource = data.children;
      this.$popup({
        title: $T("sslm.common.model.field.childIndicators").$D("下级指标"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:
        dataSource.map((n) =>
          <div>
            <Customize
              needPadding
              dataSource={n}
              columns={getIndicatorColumns(this, "child")}/>
            <div style={{ height:"2px", background:"#f6f6f6" }}/>
          </div>
        )
        ,
      });
    },
    // 查看下级评分指标
    viewScoreChildIndicators(data) {
      const dataSource = data.children;
      this.$popup({
        title: $T("sslm.common.model.field.childIndicators").$D("下级指标"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content:
        dataSource.map((n) =>
          <div>
            <Customize
              needPadding
              dataSource={n}
              columns={getPersonColumns(this)}/>
            <div style={{ height:"2px", background:"#f6f6f6" }}/>
          </div>
        )
        ,
      });
    }
  },
  render() {
    return (
      <srm-scroll-tab>
        <srm-scroll-tab-item label={$T("sslm.common.view.title.baseInfo").$D("基础信息")} key="baseInfo">
          <Customize needPadding dataSource={this.basicData} columns={basicColumns()}/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item label={$T("sslm.supplierDocManage.model.evalDocManage.scoreVendor").$D("参评供应商")} key="scoreVendor">
          <Customize needPadding dataSource={this.basicData} columns={participSupplierFormColumns()} class="score-scroll-tab-form"/>
          <srm-list
            scrollable={false}
            data-set={this.participSupplierDs}
            columns={getParticipSupplierColumns(this.evalGranularity)}/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item label={$T("sslm.common.model.archiveFilled.evaluationIndex").$D("考评指标")} key="evaluationIndicator">
          <srm-list
            scrollable={false}
            data-set={this.indicatorDs}
            columns={getIndicatorColumns(this)}/>
        </srm-scroll-tab-item>
        {this.personDs &&
          <srm-scroll-tab-item label={$T("sslm.supplierDocManage.model.docManage.evaluationPerson").$D("评分人")} key="evaluationPerson">
            <Customize needPadding dataSource={this.basicData} columns={personFormColumns()} class="score-scroll-tab-form"/>
            <srm-list
              scrollable={false}
              data-set={this.personDs}
              columns={getPersonColumns(this)}/>
          </srm-scroll-tab-item>
        }
      </srm-scroll-tab>
    );
  }
};
</script>
<style lang="stylus" scoped>
.score-scroll-tab-form{
  border-bottom: 2px solid var(--background-color-empty-second);
}
  </style>