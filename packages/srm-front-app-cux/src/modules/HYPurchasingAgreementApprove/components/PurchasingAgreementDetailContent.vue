<template>
  <div class="card">
    <customize
      :columns="getColumns"
      :data-source="info"
      type="list"
      :need-padding="false"/>

    <srm-popup
      :visible.sync="schemeVisible"
      :title="$T(
        'scux.procurementDecisionReview.view.title.procurementProgrammeReview'
      ).$D('采购方案评审表')"
      height="80%"
      rounded>
      <purchasing-scheme-approve-detail-content
        v-if="schemeVisible"
        :id="schemeReviewId"/>
    </srm-popup>
    <srm-popup
      :visible.sync="decisionVisible"
      :title="$T('scux.procurementDecisionReview.model.reviewDescriptionD').$D('采购决议审批')"
      height="80%"
      rounded>
      <procurement-decision v-if="decisionVisible" :id="decisionId" />
    </srm-popup>
    <srm-popup
      :visible.sync="evaluationVisible"
      :title="$T('scux.procurementDecisionReview.model.bidEvaluationReport').$D('评标报告审批')"
      height="80%"
      rounded>
      <bid-evaluation-report v-if="evaluationVisible" :id="evaluationId" />
    </srm-popup>
    <srm-popup :visible.sync="visible" :title="$T(
      'scux.procurementDecisionReview.model.frameworkContract'
    ).$D('框架合同')" rounded>
      <srm-list
        :data-set="frameworkContractDs"
        :columns="getContractColumns()"/>
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
import { getPurchasingAgreementApi, getAttachmentFilesApi, getAgreementTerminationApi } from "../api";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import PurchasingSchemeApproveDetailContent from "./PurchasingSchemeApproveDetailContent";
import ProcurementDecision from "./ProcurementDecision";
import BidEvaluationReport from "./BidEvaluationReport";
import { DataSet } from "srm-mobile-ui";
import { frameworkContractDs } from "../datasource/contractDs";
export default {
  modules: [ "sprm.common", "scux.analysisConfirm", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "smpc.common", "smbl.common", "scux.procurementDecisionReview", "spcm.common", "ssrc.inquiryHall", "scux.bidEvaluationReport", "spcm.contractChange", "hipspfm.common", "ssta.costSheet" ],
  name: "PurchasingAgreementDetailContent",
  components: {
    PurchasingSchemeApproveDetailContent,
    ProcurementDecision,
    BidEvaluationReport,
  },
  props: {
    id: {
      type: String,
      // default: '__-R7yp8tCU9fFjw3WUj4Ra8w-__'
    },
    mobileTerminationFlag: {
      type: Boolean,
      // default: '__-R7yp8tCU9fFjw3WUj4Ra8w-__'
    }
  },
  data() {
    return {
      info: {},
      schemeReviewId: "",
      decisionId: "",
      evaluationId: "",
      schemeVisible: false,
      decisionVisible: false,
      evaluationVisible: false,
      frameworkContractDs : new DataSet(frameworkContractDs(this)),
      visible: false,
    };
  },
  computed: {
    getColumns() {
      let columns = [];

      this.getField("purchase_agreement").map((res) => {
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
    },
  },
  mounted() {
    this.getPurchasingAgreement();
  },
  methods: {
    getContractColumns() {
      return [
        {
          fieldCode: "pcName",
        },
        {
          fieldCode: "pcNum",
        },
      ];
    },
    getPurchasingAgreement() {
      this.$loading.show();
      //如果是协议终止进入
      if (this.mobileTerminationFlag) {
        getAgreementTerminationApi(this.id).then((res) => {
          this.info = res.content[0];
        }).catch((e) => {
          console.info(e);
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        getPurchasingAgreementApi(this.id).then((res) => {
          this.info = res.content[0];
        }).catch((e) => {
          console.info(e);
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    // 获取自定义配置code
    getField(key) {
      const fieldColumns = {
        "purchase_agreement": [
          [ "pc_num", "pcNum", "spcm.common.model.common.pcNum", 10 ],
          [ "pc_name", "pcName", "sprm.common.model.common.contractName", 20 ],
          [ "company_name", "companyName", "smbl.common.view.queryCompanyName", 30 ],
          [
            "supplier_companyName",
            "supplierCompanyName",
            "scux.procurementDecisionReview.model.scux.soQuery.model.soQuery.supplierCompanyName",
            40,
          ],
          [ "product_name", "productName", "scux.analysisConfirm.model.brandName", 50 ],
          [
            "contract_amount",
            "contractAmount",
            "ssta.costSheet.model.costSheet.Amounts",
            60,
          ],
          [
            "currency-description",
            "currencyDescription",
            "sprm.common.model.common.currency",
            70,
          ],
          [
            "electrical_signatureAttachmentUuid",
            "electricalSignatureAttachmentUuid",
            "scux.procurementDecisionReview.model.sealAttatchment",
            80,
          ],
          [
            "contract-fileUrl",
            "contractFileUrl",
            "scux.procurementDecisionReview.model.contractFileUrl",
            90,
          ],
          [
            "purchaser_attachmentUuid",
            "purchaserAttachmentUuid",
            "scux.procurementDecisionReview.model.unsealAttatchment",
            100,
          ],
          [
            "scheme_idMeaning",
            "schemeIdMeaning",
            "scux.procurementDecisionReview.model.schemeReviewIdLov",
            110,
          ],
          [
            "decision_idMeaning",
            "decisionIdMeaning",
            "scux.procurementDecisionReview.model.decisionReviewNumber",
            120,
          ],
          [
            "evaluation_idMeaning",
            "evaluationIdMeaning",
            "scux.bidEvaluationReport.view.title.bidEvaluationReport",
            130,
          ],
          [
            "framework_contractNumber",
            "frameworkContractNumber",
            "scux.bidEvaluationReport.view.title.frameworkContract",
            140,
          ],
          [
            "main_pcNum",
            "mainPcNum",
            "scux.bidEvaluationReport.view.title.mainPcNum",
            150,
          ],
          [ "remark", "remark", "smpc.common.excel.remark", 160 ],
          [
            "purchase_agent",
            "purchaseAgent",
            "sqam.common.model.8d.purchaseAgentName",
            170,
          ],
          [ "unit_name", "unitName", "sprm.common.modal.unitName", 180 ],
          [ "creation_date", "creationDate", "sqam.common.model.8d.creationDate", 190 ],
          [
            "start_dateActive",
            "startDateActive",
            "sqam.common.model.agreement.startDate",
            200,
          ],
        ],
      };
      if (this.mobileTerminationFlag) {
        fieldColumns["purchase_agreement"].push([ "process_remark", "processRemark", "spcm.contractChange.view.message.terminationReason", 25 ]);
      }

      return fieldColumns[key] || [];
    },
    renderByField(field, attachId = "") {
      if (!field) {
        return {};
      }
      if (field === "pc_name") {
        return {
          fieldType: "EMPTY",
          render: (val, record) =>
            <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">
                {this.$T("sprm.common.model.common.contractName").$D(
                  "协议名称"
                )}
                  ：
              </span>
              <span style={{ color: !this.mobileTerminationFlag && (record.supplementFlag || record.mainPcNum) ? "red" : "#1F1F1F" }}>{val}</span>
            </srm-flex>
          ,
        };
      }
      //TODO 不建议使用中文作为精确筛选关键字，后期需要进行修改，当前按照之前的开发者开发形势进行开发
      if (field === "process_remark") {
        return {
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("spcm.contractChange.view.message.terminationReason").$D("终止原因")}：</span>
            <span>{val}</span>
          </srm-flex>
        };
      }
      if (field === "product_name") {
        return {
          fieldType: "EMPTY",
          render: (val) =>
            <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">
                {this.$T("scux.analysisConfirm.model.brandName").$D("品名")}：
              </span>
              <span>{val}</span>
            </srm-flex>
          ,
        };
      }
      if (field === "contract_amount") {
        return {
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        };
      }
      if (field === "electrical_signatureAttachmentUuid") {
        return {
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-icon={false}
                color="#276EF1"
                title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "scux.purchaseRecordApproval.view.button.uploadview"
                ).$D("附件查看")}
              />
            </div>
          ,
        };
      }
      if (field === "contract-fileUrl") {
        return {
          render: (val, item) =>
            <div
              style="color: var(--color-other-default-b); font-size: 14px;"
              on-click={(e) => {
                e.stopPropagation();
                this.showContractAttachment(val, item.contractFileUrl);
              }}
            >
              <span>
                {this.$T(
                  "scux.purchaseRecordApproval.button.viewAttachments"
                ).$D("附件查看")}
              </span>
              <span>{val && item.contractFileUrl ? "(1)" : "(0)"}</span>
            </div>
          ,
        };
      }
      if (field === "purchaser_attachmentUuid") {
        return {
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-icon={false}
                color="#276EF1"
                title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "scux.purchaseRecordApproval.view.button.uploadview"
                ).$D("附件查看")}
              />
            </div>
          ,
        };
      }
      if (field === "scheme_idMeaning") {
        return {
          render: (val) =>
            <span style="color: var(--color-other-default-b);">{val}</span>,
          callBack: (record) => {
            this.openPop(attachId, record);
          },
        };
      }
      if (field === "decision_idMeaning") {
        return {
          render: (val) =>
            <span style="color: var(--color-other-default-b);">{val}</span>,
          callBack: (record) => {
            this.openPop(attachId, record);
          },
        };
      }
      if (field === "evaluation_idMeaning") {
        return {
          render: (val) =>
            <span style="color: var(--color-other-default-b);">{val}</span>,
          callBack: (record) => {
            this.openPop(attachId, record);
          },
        };
      }
      if (field === "remark") {
        return {
          fieldType: "EMPTY",
          fieldName: this.$T("smpc.common.excel.remark").$D("备注"),
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">
              {this.$T("smpc.common.excel.remark").$D("备注")}：
            </span>
            {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
          </srm-flex>
        };
      }
      if (field === "framework_contractNumber") {
        return {
          render: (val) => <span style="flex-shrink: 0; align-self: flex-start;" on-click={(e) => {
            e.stopPropagation();
            this.frameworkContractDs.reset();
            this.frameworkContractDs.setQueryParameter({ contractIds: val });
            this.frameworkContractDs.query();
            this.visible = true;
          }}>{val}</span>
        };
      }
      return {};
    },
    // 打开其他弹框
    openPop(name, item) {
      switch (name) {
      case "schemeIdMeaning":
        this.schemeReviewId = String(item.schemeId);
        this.schemeVisible = true;
        break;
      case "decisionIdMeaning":
        this.decisionId = String(item.decisionId);
        this.decisionVisible = true;
        break;
      case "evaluationIdMeaning":
        this.evaluationId = String(item.evaluationId);
        this.evaluationVisible = true;
        break;
      default:
        break;
      }
    },
    async showCoreAttachment(val, item) {
      if (!val) {
        return;
      }
      let response = await getAttachmentFilesApi(val);

      if (response.length === 0) {
        // 没有附件//"coreAttachmentUuid",
        item.coreAttachmentUuid = null;
        this.$notification.open({
          message: this.$T("smbl.common.view.message.noFile").$D(
            "文件不存在！"
          ),
          description: "",
          class: "notification",
          duration: 3,
        });
        return;
      }
      previewFile(response[0]);
    },
    // 显示用章文本附件
    async showContractAttachment(uuid, fileAdress) {
      if (!uuid || !fileAdress) {
        return;
      }
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileAdress,
        fileName: uuid,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.card {
  width: 100%;
  color: #333333;
  padding: 10px 15px 12px 15px;
  background: var(--color-bg-default);
}
</style>