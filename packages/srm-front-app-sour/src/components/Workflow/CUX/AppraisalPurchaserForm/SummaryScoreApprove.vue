<script>
import { $T } from "srm-mobile-ui";
import common from "./mixins/common";
import { scoreResultDsColumns } from "./datasource/getScoreResultDS";
import { basicColumns, attachmentColumns } from "./datasource/getBasicDS";
import { appraisalAttachmentColumns } from "./datasource/getAttachmentDS";

export default {
  name:"SummaryScoreApprove",
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
            columns={scoreResultDsColumns(this)}/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item label={$T("sslm.common.model.evaluation.appraisalAttachment").$D("考评附件")} key="appraisalAttachment">
          <srm-list
            scrollable={false}
            data-set={this.attachmentDs}
            columns={appraisalAttachmentColumns(this)}/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item label={$T("hzero.common.upload.modal.title").$D("附件")} key="attachment">
          <srm-form data-set={this.basicDs} columns={attachmentColumns} class="basic-attachment"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    );
  }
};
</script>
<style lang="stylus" scoped>
.basic-attachment{
  min-height: auto;
  >>> .attachment-uuid-field{
    height: 30px;
    .srm-icon.icon-other{
      color: #febf43;
      font-size: 28px;
    }
    .srm-attachment-button{
      margin-left:8px;
      flex-grow: 1;
      display:flex;
      .srm-button{
        flex-grow: 1;
        text-align: left;
        font-weight: 400;
        .srm-button-text{
          font-size: 14px;
          color: #333;
          font-weight: 400;
          width: 100%;
        }
      }
    }
  }
}
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