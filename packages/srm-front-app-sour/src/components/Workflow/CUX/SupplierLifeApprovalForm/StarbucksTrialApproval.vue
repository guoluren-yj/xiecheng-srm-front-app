<!--
 * StarbucksTrialApproval - 直采预审评估工作流
 * @Date: 2022-11-16 16:06:46
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
-->
<script>
import { $T } from "srm-mobile-ui";
import common from "./mixins/common";
import { saveQualified } from "./api/starbucksSupplierLife";

export default {
  name: "StarbucksTrialApproval",
  modules: [ "scux.supplierQuery", "scux.starbucks", "hzero.common", "hipspfm.common", "smbl.common", "sslm.commonApplication", "sslm.common" ],
  mixins: [ common ],
  methods:{
    // 审批前调用保存
    beforeApprove() {
      return new Promise((resolve, reject) => {
        const validateFlag = this.trialResultsDs.validate();
        if (!validateFlag) {
          reject(false);
        } else {
          const qualifiedHeader = this.basicInfoDs.current.data; // 基础信息
          const preData = this.trialResultsDs.data;
          saveQualified({
            ...qualifiedHeader,
            kpiEvalTplIndRespList: preData
          }).then((response) => {
            if (response.requisitionId) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        }
      });
    }
  },
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
          <srm-scroll-tab-item label={$T("scux.starbucks.view.supplierQuery.trialResults").$D("预审评估")} key="trialResults" >
            <srm-list scrollable={false} data-set={this.trialResultsDs} columns={this.getTrialResultsColumns}/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={$T("hzero.common.upload.modal.title").$D("附件")} key="attachment">
            <srm-list scrollable={false} data-set={this.attachmentDs} columns={this.getattachmentColumns}/>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
        <srm-popup
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