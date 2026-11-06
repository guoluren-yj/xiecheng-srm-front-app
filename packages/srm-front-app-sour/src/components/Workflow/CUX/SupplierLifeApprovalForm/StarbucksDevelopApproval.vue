<!--
 * StarbucksDevelopApproval - 直采开发申请工作流
 * @Date: 2022-11-16 16:06:46
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
-->
<script>
import { $T } from "srm-mobile-ui";
import common from "./mixins/common";

export default {
  name: "StarbucksTrialApproval",
  modules: [ "scux.supplierQuery", "scux.starbucks", "hzero.common", "hipspfm.common", "sslm.commonApplication", "sslm.common" ],
  mixins: [ common ],
  render() {
    return (
      <div>
        <srm-scroll-tab>
          <srm-scroll-tab-item label={$T("scux.starbucks.view.supplierQuery.baseInfo").$D("基础信息")} key="baseInfo">
            <srm-form data-set={this.basicInfoDs} theme="fill" columns={this.getBaseInfoColumns} />
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={$T("scux.starbucks.view.supplierQuery.categories").$D("品类")} key="categories">
            <srm-list
              scrollable={false}
              data-set={this.categoryDs}
              columns={this.getCategoryColumns}
              onItemClick={this.handleCategoryClick}/>
          </srm-scroll-tab-item>
          {this.factoryTabFlag &&
             <srm-scroll-tab-item label={$T("scux.starbucks.view.supplierQuery.factory").$D("工厂")} key="factory">
               <srm-list scrollable={false} data-set={this.factoryDs} columns={this.getFactoryColumns}/>
             </srm-scroll-tab-item>
          }
          <srm-scroll-tab-item label={$T("scux.starbucks.view.supplierQuery.trialResults").$D("预审评估")} key="trialResults">
            <div style={{ padding:"16px 15px" }} onClick={this.handleTrialResultsClick}>
              {this.preDataSource ?
                this.preDataSource.map((data, index) =>
                  <div style={{ marginBottom:"10px" }}>
                    <srm-flex>
                      <srm-flex-item flex="1.9" style={{ marginRight:"10px" }}>
                        <srm-text-field>
                          <span style={{ marginRight:"12px" }}>{data.attributeVarchar5}:</span>
                          <span>{data.attributeVarchar7Meaning}</span>
                        </srm-text-field>
                      </srm-flex-item>
                      <srm-flex-item flex="1">
                        <srm-text-field>
                          <span style={{ marginRight:"12px" }}>{$T("scux.supplierQuery.modal.common.directorLDEvaluate").$D("LD评估")}:</span>
                          <span>{data.attributeVarchar8Meaning}</span>
                        </srm-text-field>
                      </srm-flex-item>
                      <srm-flex-item flex="0.1">
                        {index === 0 && <div class="right-arrow-icon srm-icon icon-chevron-right"/>}
                      </srm-flex-item>
                    </srm-flex>
                  </div>
                ) : <div>{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }</div> }
            </div>
          </srm-scroll-tab-item>
          {this.questionnaireFlag &&
            <srm-scroll-tab-item label={$T("scux.supplierQuery.view.supplierQuery.ecQuestionnaire").$D("EC调查问卷")} key="questionnaire">
              <srm-form data-set={this.ecQuestionnaireDs} columns={this.getEcQuestionnaireColumns} style={{ minHeight:0 }}/>
            </srm-scroll-tab-item>
          }
          <srm-scroll-tab-item label={$T("hzero.common.upload.modal.title").$D("附件")} key="attachment">
            <srm-list scrollable={false} data-set={this.attachmentDs} columns={this.getattachmentColumns}/>
          </srm-scroll-tab-item>
          {
            // <srm-scroll-tab-item label={$T("scux.starbucks.view.supplierQuery.investigation").$D("调查表")} key="investigation">
            //             <srm-list scrollable={false} data-set={this.investigationDs} columns={this.getInvestigationColumns} onItemClick={this.handleInvestigationClick}/>
            //           </srm-scroll-tab-item>
          }
        </srm-scroll-tab>
        <srm-popup // 品类弹框
          show-back
          height="100%"
          position="right"
          show-close={false}
          visible={this.visibleFull}
          beforeClose={this.handleCategoryClick}
          title={$T("scux.starbucks.view.supplierQuery.categories").$D("品类")}>
          <customize-detail
            theme="fill"
            data-source={this.currentCategory}
            columns={this.getCategoryModalColumns}/>
        </srm-popup>
        <srm-popup // 预审评估弹框
          show-back
          height="100%"
          position="right"
          show-close={false}
          visible={this.trialResultsVisible}
          beforeClose={this.handleTrialResultsClick}
          title={$T("scux.starbucks.view.supplierQuery.trialResults").$D("预审评估")}>
          <customize-detail
            theme="fill"
            data-source={this.trialResultsModalData}
            columns={this.trialResultsModalColumns}/>
        </srm-popup>
        {
        //   <srm-popup // 调查表弹框
        //   show-back
        //   height="100%"
        //   position="right"
        //   show-close={false}
        //   visible={this.investigationVisible}
        //   beforeClose={this.handleInvestigationClick}
        //   title={$T("scux.starbucks.view.supplierQuery.investigation").$D("调查表")}>
        //   <customize-detail
        //     theme="fill"
        //     data-source={this.investigationModalData}
        //     columns={this.investigationModalColumns}/>
        // </srm-popup>
        }
      </div>
    );
  }
};
</script>

<style scoped lang="stylus">
  >>> .srm-popup.srm-popup-right{
    background: var(--background-color-empty-second);
  }
  >>> .srm-popup-header{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  >>> .srm-popup-content{
    margin:8px 0;
    padding: 0 16px;
    background: var(--background-color-empty);
  }
  .right-arrow-icon {
    font-weight: 600;
    color: var(--color-success);
  }
  .category-name-wrap {
    overflow: hidden;
    .title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>