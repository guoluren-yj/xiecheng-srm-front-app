<template>
  <div class="card">
    <customize
      :columns="getColumns"
      :data-source="info" type="list"
      :need-padding="false"/>

    <srm-popup :visible.sync="visible" :title="$T(
      'scux.procurementDecisionReview.view.title.procurementProgrammeReview'
    ).$D('采购方案评审表')" height="80%" rounded>
      <purchasing-scheme-approve-detail-content v-if="visible" :id="schemeReviewId"/>
    </srm-popup>
  </div>
</template>

<script>
/**
 * 组件使用
 * id：采购决议id
    <srm-popup :visible.sync="visibleItem" title="采购决议" height="100%" show-back>
        <ProcurementDecision
            :id="'__-R7yp8tCU9fFjw3WUj4Ra8w-__'" />
    </srm-popup>
 */
import { getProcurementDecisionApi } from "../api";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import PurchasingSchemeApproveDetailContent from "./PurchasingSchemeApproveDetailContent";
export default {
  modules: [ "scux.procurementDecisionReview", "ssrc.inquiryHall", "spcm.common", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "hipspfm.common" ],
  name: "ProcurementDecision",
  components: {
    PurchasingSchemeApproveDetailContent,
  },
  props: {
    id: {
      type: String,
      // default: '__-R7yp8tCU9fFjw3WUj4Ra8w-__'
    }
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

      this.getField("purchase_resolution").map((res) => {
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
    this.getBidEvaluation();
  },
  methods: {
    async getBidEvaluation() {
      await getProcurementDecisionApi(this.id).then((res) => {
        this.info = { ...res };
      });
    },
    // 获取自定义配置code
    getField(key) {
      const fieldColumns = {
        "purchase_resolution": [
          [ "decision_reviewNumber", "decisionReviewNumber", "scux.procurementDecisionReview.model.decisionReviewNumber", 1 ],
          [ "review_description", "reviewDescription", "scux.procurementDecisionReview.model.decisionDesc", 2 ],
          [ "material_name", "materialName", "scux.procurementDecisionReview.model.materialName", 3 ],
          [ "procurement_strategyMeaning", "procurementStrategyMeaning", "scux.procurementDecisionReview.model.procurementStrategyMeaning", 4 ],
          [ "purchase_amount", "purchaseAmount", "scux.procurementDecisionReview.model.procurementAmount", 5 ],
          [ "urgency_procurementFlagMeaning", "urgencyProcurementFlagMeaning", "scux.procurementDecisionReview.model.urgencyProcurementFlagMeaning", 6 ],
          [ "scheme_reviewNumber", "schemeReviewNumber", "scux.procurementDecisionReview.model.schemeReviewNumber", 7 ],
          [ "category_manager", "categoryManager", "scux.procurementDecisionReview.model.categoryManager", 8 ],
          [ "filed-address", "filedAddress", "scux.procurementDecisionReview.model.coreAttachment", 9 ],
          [ "attachment_uuid", "attachmentUuid", "scux.procurementDecisionReview.model.attachmentInfo", 10 ],
          [ "newSupplier_Illustrate", "newSupplierIllustrate", "scux.procurementDecisionReview.model.ProcessAddedSupplierDescription", 11 ],
          [ "remark", "remark", "scux.procurementDecisionReview.model.relatedInstructions", 12 ],
          [ "bidding", "bidding", "", 13 ],
        ]
      };

      return fieldColumns[key] || [];
    },
    renderByField(field, attachId = "") {
      if (!field) {
        return {};
      }
      if (field === "material_name") {
        return {
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.materialName").$D("物资名称")}：</span>
            <span>{val}</span>
          </srm-flex>,
        };
      }
      if (field === "review_description") {
        return {
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.decisionDesc").$D("决议描述")}：</span>
            <span>{val}</span>
          </srm-flex>,
        };
      }
      if (field === "attachment_uuid") {
        return {
          render: (val) =>
            <SrmUpload
              showIcon={false}
              color="var(--color-other-default-b)"
              descTitle={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              attachmentUuid={val} />
        };
      }
      if (field === "newSupplier_Illustrate") {
        return {
          fieldType: "EMPTY",
          fieldName: this.$T("scux.procurementDecisionReview.model.ProcessAddedSupplierDescription").$D("过程新增供应商说明"),
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.ProcessAddedSupplierDescription").$D("过程新增供应商说明")}：</span>
            {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
          </srm-flex>
        };
      }
      if (field === "filed-address") {
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
      if (field === "remark") {
        return {
          fieldType: "EMPTY",
          fieldName: this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明"),
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明")}：</span>
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
                  <th>{this.$T("scux.procurementDecisionReview.model.winningSupplier").$D("中标供应商")}</th>
                  <th>{this.$T("scux.procurementDecisionReview.model.bidPrice").$D("中标金额")}</th>
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
    async showCoreAttachment(fileUrl, item) {
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
  padding 10px 15px 12px 15px;
  background: var(--color-bg-default);
}
table{
  width:100%;
}
table,table tr th, table tr td {
  border:1px solid #1f1f1f;
  text-align: center;
  }
</style>