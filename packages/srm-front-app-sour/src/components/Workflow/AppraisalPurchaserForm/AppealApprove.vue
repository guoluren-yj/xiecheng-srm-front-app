<!--
 * @Date: 2024-08-30 11:17:03
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
-->
<script>
import { $T } from "srm-mobile-ui";
import common from "./mixins/common";
import { scoreResultDsColumns } from "./datasource/getScoreResultDS";
import { basicColumns } from "./datasource/getBasicDS";
import { appraisalAttachmentColumns } from "./datasource/getAttachmentDS";

export default {
  name:"AppealApprove",
  mixins: [ common ],
  modules: [ "sslm.common", "sslm.supplierDocManage", "hzero.common", "smbl.common", "sslm.scoreLevel", "sslm.evaluationQuery", "sslm.siteInvestigateReport", "spfm.supplierKpiIndicator" ],
  render() {
    return (
      <srm-scroll-tab>
        <srm-scroll-tab-item label={$T("sslm.common.view.title.baseInfo").$D("基础信息")} key="baseInfo">
          <srm-form data-set={this.basicDs} columns={basicColumns()} />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item label={$T("sslm.common.view.title.scoreResult").$D("评分结果")} key="scoreResult">
          <srm-list
            scrollable={false}
            data-set={this.scoreResultDs}
            columns={scoreResultDsColumns(this, "APPEAL")}/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item label={$T("sslm.common.model.evaluation.appraisalAttachment").$D("考评附件")} key="appraisalAttachment">
          <srm-list
            scrollable={false}
            data-set={this.attachmentDs}
            columns={appraisalAttachmentColumns(this)}/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    );
  }
};
</script>
<style lang="stylus" scoped>
.execution-document{
  .execution-document-title{
    padding: 10px 15px;
    color: #333333;
    font-size:12px;
    line-height: 16px;
    font-weight: 600;
    border-top: solid 1px #f6f6f6;
    border-bottom: solid 1px #F6F6F6;
  }
}
  </style>