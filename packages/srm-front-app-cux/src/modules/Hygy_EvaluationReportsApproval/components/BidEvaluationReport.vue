<template>
  <div class="card">
    <customize
      :columns="getColumns"
      :data-source="info"
      type="list"
      :need-padding="false"/>

    <srm-popup
      :visible.sync="visible"
      :title="
        $T(
          'scux.procurementDecisionReview.view.title.procurementProgrammeReview'
        ).$D('采购方案评审表')
      "
      height="80%"
      rounded>
      <purchasing-scheme-approve-detail-content
        v-if="visible"
        :id="schemeReviewId"/>
    </srm-popup>
  </div>
</template>

<script>
/**
 * 组件使用
 * id：评标报告id
    <srm-popup :visible.sync="visible" title="" height="100%" show-back>
        <BidEvaluationReport
            :id="'__-10WBFbO-jpuxs5wfsjN1Cg-__'" />
    </srm-popup>
 */
import { getBidEvaluationApi } from "../api";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import PurchasingSchemeApproveDetailContent from "./PurchasingSchemeApproveDetailContent";
export default {
  modules: [ "scux.bidEvaluationReport", "ssrc.inquiryHall", "scux.procurementDecisionReview", "spcm.common", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "hipspfm.common" ],
  name: "BidEvaluationReport",
  components: {
    PurchasingSchemeApproveDetailContent,
  },
  props: {
    id: {
      type: String,
      // default: '__-10WBFbO-jpuxs5wfsjN1Cg-__'
    },
    changeReqId: {
      type: String,
      // default: '__-10WBFbO-jpuxs5wfsjN1Cg-__'
    },
  },
  data() {
    return {
      info: {},
      schemeReviewId: "",
      visible: false,
    };
  },
  computed: {
    getColumns() {
      let columns = [];

      this.getField("bid_evaluationReport").map((res) => {
        let item = {
          fieldName: res.length > 0 ? res[0] : "",
          fieldCode: res.length > 1 ? res[1] : "",
          langCode: res.length > 2 ? res[2] : "",
          fieldType: "TEXT",
          ...this.renderByField(res[1], res[0]),
          ...this.renderByField(res[0], res[1]),
        };

        if (res.length > 3 && res[3]) {
          item["formRow"] = res[3];
        }
        columns.push(item);
      });
      return columns;
    }
  },
  mounted() {
    // 支持放入审批工作台子应用里面使用
    if (!this.id) {
      // eslint-disable-next-line vue/no-mutating-props
      this.id = this.changeReqId;
    }
    this.getBidEvaluation();
  },
  methods: {
    async getBidEvaluation() {
      await getBidEvaluationApi(this.id).then((res) => {
        this.info = { ...res };
      });
    },
    // 获取自定义配置code
    getField(key) {
      const fieldColumns = {
        "bid_evaluationReport": [
          [ "bid_number", "bidNumber", "scux.bidEvaluationReport.model.bidNumber", 1 ],
          [ "project_name", "projectName", "scux.bidEvaluationReport.model.projectName", 2 ],
          [ "procurement_strategyMeaning", "procurementStrategyMeaning", "scux.bidEvaluationReport.model.procurementStrategyMeaning", 3 ],
          [ "detail_strategyMeaning", "detailStrategyMeaning", "scux.procurementDecisionReview.model.detailStrategyMeaning", 4 ],
          [ "procurement_amount", "procurementAmount", "scux.bidEvaluationReport.model.procurementAmount", 5 ],
          [ "scheme_reviewNumber", "schemeReviewNumber", "scux.bidEvaluationReport.model.schemeReviewNumber", 6 ],
          [ "category_managerName", "categoryManagerName", "scux.bidEvaluationReport.model.categoryManager", 7 ],
          [ "filed_ddress", "filedAddress", "scux.bidEvaluationReport.model.coreAttachment", 8 ],
          [ "upload_uuid", "uploadUuid", "scux.bidEvaluationReport.model.attachmentInfo", 9 ],
          [ "newSupplier_Illustrate", "newSupplierIllustrate", "scux.bidEvaluationReport.model.ProcessAddedSupplierDescription", 10 ],
          [ "related_instructions", "relatedInstructions", "scux.bidEvaluationReport.model.relatedInstructions", 11 ],
          [ "bidding", "bidding", "", 12 ],
        ]
      };

      return fieldColumns[key] || [];
    },
    renderByField(field, attachId = "") {
      if (field === "project_name") {
        return {
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.bidEvaluationReport.model.projectName").$D("项目名称")}：</span>
            <div>{ val }</div>
          </srm-flex>,
        };
      }
      if (field === "upload_uuid") {
        return {
          render: (val) =>
            <SrmUpload
              showIcon={false}
              color="var(--color-other-default-b)"
              descTitle={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              attachmentUuid={val} />
        };
      }
      if (field === "filed_ddress") {
        return {
          render: (val, record) => <div style="color: var(--color-other-default-b); font-size: 14px;" on-click={(e) => {
            e.stopPropagation();
            this.showCoreAttachment(val, record);
          }}>
            <span>{ record.coreAttachmentUuid }</span>
          </div>
        };
      }
      if (field === "scheme_reviewNumber") {
        return {
          render: (val) => <span style="color: var(--color-other-default-b);">
            {val}
          </span>,
          callBack: (record) => {
            this.openPop(attachId, record);
          }
        };
      }
      if (field === "newSupplier_Illustrate") {
        return {
          fieldType: "EMPTY",
          fieldName: this.$T("scux.bidEvaluationReport.model.ProcessAddedSupplierDescription").$D("过程新增供应商说明"),
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.bidEvaluationReport.model.ProcessAddedSupplierDescription").$D("过程新增供应商说明")}：</span>
            {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
          </srm-flex>
        };
      }
      if (field === "related_instructions") {
        return {
          fieldType: "EMPTY",
          fieldName: this.$T("scux.bidEvaluationReport.model.relatedInstructions").$D("相关说明"),
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.bidEvaluationReport.model.relatedInstructions").$D("相关说明")}：</span>
            {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
          </srm-flex>
        };
      }
      if (field === "bidding") {
        return {
          fieldType: "EMPTY",
          render: (val, record) =>
            <srm-flex>
              <table>
                <tr>
                  <th>{this.$T("scux.bidEvaluationReport.model.winningSupplier").$D("中标供应商")}</th>
                  <th>{this.$T("scux.bidEvaluationReport.model.bidPrice").$D("中标金额")}</th>
                </tr>
                {
                  !record.hygyWSupplierDTOList || record.hygyWSupplierDTOList.length === 0 &&
                <tr>
                  <td colspan="2">{this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据")}</td>
                </tr>
                }
                {
                  record.hygyWSupplierDTOList && record.hygyWSupplierDTOList.map((item) => <tr>
                    <td>{item.supplierCompanyName}</td>
                    <td>{item.totalPriceS}</td>
                  </tr>)
                }
              </table>
            </srm-flex>
        };
      }
      return {};
    },
    // 打开其他弹框
    openPop(name, item) {
      switch (name) {
      case "schemeReviewNumber":
        this.schemeReviewId = String(item.schemeReviewId);
        this.visible = true;
        break;
      default:
        break;
      }
    },
    showCoreAttachment(fileUrl, item) {
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileUrl,
        fileName: item.coreAttachmentUuid,
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.card {
  width: 100%;
  color: #333333;
  padding: 10px 15px 12px 15px;
  background: var(--color-bg-default);
  height: calc(100vh - 64.333vw);
  overflow: auto;
}
table{
  width:100%;
}
table,table tr th, table tr td {
  border:1px solid #1f1f1f;
  text-align: center;
  }
</style>
