<template>
  <div class="detail-container">
    <srm-scroll-tab ref="tab" content-scroll>
      <srm-scroll-tab-item :label="$T('sslm.evaluationRecord.model.evaluationDocManage.baseInfo').$D('基本信息')">
        <srm-form
          v-loading="!lineDataSet.isReady()"
          :data-set="headerDataSet"
          :columns="getDetailHeaderColumns()"
          show-default-detail
          customize-code="SMBL.EVALUATE_ARCHIVES.MANAGE_DETAIL_HEADER"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplierDocManage.model.evalDocManage.scoreVendor').$D('参评供应商')"
                           :show-title="false">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ $T('sslm.supplierDocManage.model.evalDocManage.scoreVendor').$D('参评供应商') }}

          <div v-if="!supplierDataSet.editFlag" class="list-tool-tab">
            <div v-if="headerStatus === 'NEW'&&!readOnly" class="srm-icon icon-edit" @click="toggleSupplierEdit('edit')"/>
            <div class="srm-icon icon-filter" @click="showSupplierFilter = !showSupplierFilter"/>
          </div>
          <srm-button v-else plain rect @click="toggleSupplierEdit('cancel')">
            {{ $T("smbl.common.button.cancel").$D("取消") }}
          </srm-button>
        </div>
        <srm-list
          :data-set="supplierDataSet"
          :columns="getSupplierColumns()"
          :show-bottom-bar="false"
          :scrollable="false"
          customize-code="SMBL.EVALUATE_ARCHIVES.MANAGE_SUPPLIER"/>
        <srm-filter v-model="showSupplierFilter" :data-set="supplierDataSet"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplierDocManage.model.evalDocManage.scoreDetail').$D('评分明细')"
                           :show-title="false">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ $T('sslm.supplierDocManage.model.evalDocManage.scoreDetail').$D('评分明细') }}
          <div v-if="!scoreDetailDataSet.editFlag" class="list-tool-tab">
            <div v-if="headerStatus === 'NEW' && !readOnly" class="srm-icon icon-edit" @click="toggleScoreDetailEdit"/>
            <div v-if="headerDataSet.current && headerDataSet.current.get('checkDetailFlag') && headerStatus === 'FINAL_COLLECTED'&& !readOnly"
                 class="srm-icon icon-save" @click="scoreDetailDataSet.submit()"/>
            <div class="srm-icon icon-filter" @click="showScoreDetailFilter = !showScoreDetailFilter"/>
          </div>
          <srm-button v-else plain rect @click="toggleScoreDetailEdit">
            {{ $T("smbl.common.button.cancel").$D("取消") }}
          </srm-button>
        </div>
        <srm-list
          :data-set="scoreDetailDataSet"
          :columns="getScoreDetailColumns()"
          :scrollable="false"
          :show-bottom-bar="false"
          customize-code="SMBL.EVALUATE_ARCHIVES.MANAGE_SCORE_DETAIL"/>
        <srm-filter v-model="showScoreDetailFilter" :data-set="scoreDetailDataSet"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.supplierDocManage.model.evalDocManage.scoreSum').$D('评分汇总')"
                           :show-title="false">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ $T('sslm.supplierDocManage.model.evalDocManage.scoreSum').$D('评分汇总') }}
          <div class="list-tool-tab">
            <div v-if="headerStatus === 'FINAL_COLLECTED' && !readOnly" class="srm-icon icon-save" @click="saveScoreSum"/>
            <div class="srm-icon icon-filter" @click="showScoreSumFilter = !showScoreSumFilter"/>
          </div>
        </div>
        <srm-list
          :data-set="lineDataSet"
          :columns="getDetailLineColumns()"
          :scrollable="false"
          :show-bottom-bar="false"
          customize-code="SMBL.EVALUATE_ARCHIVES.MANAGE_DETAIL_LINE"
          @itemClick="onLineItemClick"/>
        <srm-filter v-model="showScoreSumFilter" :data-set="lineDataSet"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="[ 'FINAL_COLLECTED', 'APPROVING', 'PUBLISHED', 'COMPLETED' ].includes(headerStatus) && relatedProblemDataSet.isReady() && relatedProblemDataSet.records.length"
        :label="$T('sslm.common.view.tabs.qectificationDoc').$D('关联整改单据')">
        <srm-list
          :data-set="relatedProblemDataSet"
          :columns="getRelatedProblemColumns()"
          :scrollable="false"
          :show-bottom-bar="false"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smbl.common.message.OperationRecord').$D('操作记录')">
        <history-record-tiled
          :action-data="evalHistory"
          process-date-field-name="operatedDate"
          operator-field-name="operatedName"
          process-remark-field-name="operatedRemark"
          operation-meaning-field-name="operationCodeMeaning"/>
      </srm-scroll-tab-item>
      <srm-flex style="height: 74px"/>
    </srm-scroll-tab>
    <div v-if="!readOnly">
      <srm-bottom-handler v-if="headerDataSet.current && showDetailBottom && getButtons().length"
                          :btn-arr="getButtons()"/>
      <srm-list-bottom-bar :data-set="scoreDetailDataSet" :buttons="getScoreDetailButtons()"/>
      <srm-list-bottom-bar :data-set="supplierDataSet" :buttons="getSupplierButtons()"/>
    </div>
  </div>
</template>

<script>

import { DataSet, SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import { isEmpty } from "lodash";
import supplierDS from "../datasource/supplierDS";
import manageLineDS from "../datasource/manageLineDS";
import scoreDetailDS from "../datasource/scoreDetailDS";
import relatedProblemDS from "../datasource/relatedProblemDS";
import headerMixin from "../mixins";
import { execEvalApi, createProblem, finalCollect, approvalSubmit, publish, getEvalHistory } from "../api";
import IndicatorEdit from "../components/IndicatorEdit";
import ScorerEdit from "../components/ScorerEdit";
import ScorerView from "../components/ScorerView";
import EvalProcessView from "../components/EvalProcessView";
import CreateSupplier from "../components/CreateSupplier";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import SupplierCategory from "../components/SupplierCategory";
import SupplierItem from "../components/SupplierItem";
import SummaryScore from "../components/SummaryScore";
import BackToEval from "../components/BackToEval";

export default {
  name: "EvaluateArchivesFillDetail",
  components: { HistoryRecordTiled },
  modules: [ "sslm.evaluationRecord", "sslm.common", "sslm.supplierDocManage", "smbl.common", "sslm.supplierManage", "sslm.siteEvalHeader", "sslm.commonApplication", "sslm.workbench", "sslm.evaluationTemplate", "sslm.siteInvestigateReport", "sslm.supplierReview" ],
  mixins: [ headerMixin ],
  props:{
    evalHeaderId:{
      type:String | Number,
      default: null,
    },
    evalGranularity:{
      type:String,
      default: null,
    },
    readOnly:{
      type: Boolean,
      default:false,
    }
  },
  data() {
    const newEvalHeaderId = this.evalHeaderId || this.$route && this.$route.query && this.$route.query.evalHeaderId;
    const newEvalGranularity = this.evalGranularity || this.$route && this.$route.query && this.$route.query.evalGranularity;
    return {
      lineDataSet: new DataSet(manageLineDS(newEvalGranularity, newEvalHeaderId, this.lineDataSetAfterQuery, this.lineDataSetBeforeUpdate, this.lineDataSetBeforeSubmit)),
      supplierDataSet: new DataSet(supplierDS(newEvalGranularity, newEvalHeaderId, this.supplierDataSetAfterDelete)),
      scoreDetailDataSet: new DataSet(scoreDetailDS(newEvalGranularity, newEvalHeaderId)),
      relatedProblemDataSet: new DataSet(relatedProblemDS(newEvalHeaderId)),
      kpiMethod: {},
      indicatorType: {},
      showScoreDetailFilter: false,
      showSupplierFilter: false,
      showScoreSumFilter: false,
      showDetailBottom: true,
      evalHistory: [],
      headerStatus: null,
    };
  },
  computed: {},
  watch: {
    headerStatus() {
    }
  },
  beforeMount() {
    const newEvalHeaderId = this.evalHeaderId || this.$route && this.$route.query && this.$route.query.evalHeaderId;
    this.lineDataSet.addPathParameter("evalHeaderId", newEvalHeaderId);
    this.lineDataSet.addPathParameter("tenantId", SrmUtil.getTenantId());
    this.lineDataSet.addQueryFieldParameter("supplierId", "evalHeaderId", newEvalHeaderId);
    SrmUtil.getValueSetBatch({ kpiMethod: "SSLM.KPI_EVAL_METHOD", indicatorType: "SSLM.KPI_INDICATOR_TYPE" }, this);
    getEvalHistory(newEvalHeaderId).then((res) => {
      this.evalHistory = res && res.content ? res.content : [];
    });
    this.relatedProblemDataSet.refresh();
  },
  methods: {
    supplierDataSetAfterDelete() {
      this.scoreDetailDataSet.refresh();
      this.lineDataSet.refresh();
    },
    lineDataSetBeforeUpdate(ds, data) {
      const headerData = this.headerDataSet.current.data;
      headerData.kpiEvalDetailLineDTOPage && (headerData.kpiEvalDetailLineDTOPage.content = data);
      return headerData;
    },
    lineDataSetBeforeSubmit(ds, data) {
      const headerData = this.headerDataSet.current.data;
      headerData.kpiEvalDetailLineDTOPage && (headerData.kpiEvalDetailLineDTOPage.content = data);
      return headerData;
    },
    lineDataSetAfterQuery(ds, data) {
      this.headerDataSet.reset();
      this.headerDataSet.setData(data || []);
      this.headerDataSet.locate(0);
      this.headerStatus = this.headerDataSet.current.get("evalStatus");
      const evalGranularity = this.headerDataSet.current.get("evalGranularity");
      this.headerDataSet.current.set("defaultGroup", this.defaultGroup);
      this.$nextTick(() => {
        this.lineDataSet.records.forEach((record) => {
          const evalTplIndOptId = record.getField("evalTplIndOptId");
          evalTplIndOptId.addLovParam("evalTplIndId", record.get("evalTplIndId"));
          const scorerAttachmentUuid = record.get("scorerAttachmentUuid");
          if (!scorerAttachmentUuid) {
            record.setField("scorerAttachmentUuid", uuid());
          }
          record.setField("evalGranularity", evalGranularity);
        });
      });
      ds.isList = true;
      return data[0] && data[0].kpiEvalDetailLineDTOPage && data[0].kpiEvalDetailLineDTOPage.content || [];
    },
    getButtons() {
      const buttons = [];
      const evalHeaderId = this.headerDataSet.current.get("evalHeaderId");
      // const save = {
      //   title: this.$T("smbl.common.button.save").$D("保存"),
      //   type: "primary",
      //   handler: () => {
      //     this.$loading.show();
      //     this.lineDataSet.updateRecords(this.lineDataSet.records)
      //       .then(() => this.lineDataSet.refresh())
      //       .finally(() => this.$loading.hide());
      //   },
      // };
      const saveHeader = {
        title: this.$T("smbl.common.button.save").$D("保存"),
        type: "primary",
        handler: async () => {
          this.$loading.show();
          await this.saveScoreVendor(false);
          await this.headerDataSet.updateRecords(this.headerDataSet.records)
            .then(() => this.lineDataSet.refresh())
            .finally(() => this.$loading.hide());
        },
      };
      const submit = {
        title: this.$T("sslm.commonApplication.view.button.submitReview").$D("提交审批"),
        type: "primary",
        fill: true,
        handler: () => {
          let autoPushVendorFlag = 1;
          this.$dialog({
            title: this.$T("sslm.supplierDocManage.view.modal.confirmSubmit").$D("确认提交？"),
            content: <SrmFlex>
              <div style="padding-right: 16px;">
                {this.$T("sslm.supplierDocManage.view.modal.submitMessage").$D("审批通过后是否自动将考评结果发布至供应商？")}
              </div>
              <SrmSwitch v-model={autoPushVendorFlag}/>
            </SrmFlex>,
            onOk: () => {
              this.$loading.show();
              approvalSubmit(evalHeaderId, autoPushVendorFlag).then((res) => {
                if (res && !res.failed) {
                  this.lineDataSet.refresh();
                  this.scoreDetailDataSet.refresh();
                }
              }).finally(() => this.$loading.hide());
            }
          });
        },
      };
      const execEval = {
        title: this.$T("sslm.supplierDocManage.view.button.execute").$D("执行评分"),
        type: "primary",
        fill: true,
        handler: () => {
          this.$loading.show();
          this.headerDataSet.updateRecords(this.headerDataSet.records)
            .then(() => {
              execEvalApi(evalHeaderId).then((res) => {
                if (res && !res.failed) {
                  this.$router.back();
                }
              }).finally(() => this.$loading.hide());
            }).catch(() => this.$loading.hide());
        },
      };
      const deleteHeader = {
        text: this.$T("sslm.supplierDocManage.view.button.invalid").$D("废弃"),
        type: "danger",
        handler: () => {
          this.headerDataSet.removeRecords([ this.headerDataSet.current ]).then(() => {
            this.$router.back();
          });
        },
      };
      // eslint-disable-next-line no-unused-vars
      const createProblemButton = {
        title: this.$T("sslm.supplierDocManage.view.button.qualityRectification").$D("发起质量整改"),
        type: "primary",
        handler: () => {
          if (!this.lineDataSet.selected.length) {
            this.$notification.open({
              message: this.$T("sslm.supplierDocManage.view.message.scoreSumAtLeastOne").$D("请至少选择一条评分汇总"),
            });
            return;
          }
          this.$loading.show();
          createProblem(evalHeaderId, this.lineDataSet.selected.map((r) => r.get("evalLineId")))
            .then((res) => {
              if (res && !res.failed) {
                this.$router.back();
              }
            })
            .finally(() => this.$loading.hide());
        },
      };
      const backToEval = {
        text: this.$T("sslm.supplierDocManage.view.button.backScore").$D("退回评分"),
        type: "primary",
        handler: () => {
          const popup = this.$popup({
            position: "right",
            height: "100%",
            width: "100%",
            content: <BackToEval
              evalHeaderId={evalHeaderId}
              onConfirm={() => {
                popup.closePopup();
                this.lineDataSet.refresh();
                this.scoreDetailDataSet.refresh();
              }}
              onCancel={() => popup.closePopup()}/>
          });
        },
      };
      const sumEval = {
        text: this.$T("sslm.supplierDocManage.view.button.sum").$D("汇总统计"),
        type: "primary",
        fill: true,
        handler: () => {
          const abandonedFlag = this.headerDataSet.current.get("abandonedFlag");
          const doSumScore = () => {
            this.$loading.show();
            finalCollect(evalHeaderId).then((res) => {
              if (res && !res.failed) {
                this.lineDataSet.refresh();
              }
            }).finally(() => this.$loading.hide());
          };
          if (abandonedFlag) {
            this.$dialog({
              title: this.$T("sslm.supplierDocManage.view.modal.confirmSummary").$D("确认汇总？"),
              content: this.$T("sslm.supplierDocManage.view.modal.confirmSummaryContent").$D("存在评分人放弃评分，请确认是否继续汇总？"),
              onOk: doSumScore
            });
          } else {
            doSumScore();
          }
        },
      };
      const publishEval = {
        text: this.$T("sslm.supplierDocManage.view.button.release").$D("发布"),
        type: "primary",
        fill: true,
        handler: () => {
          this.$dialog({
            title: this.$T("sslm.supplierDocManage.view.modal.confirmRelease").$D("确认发布？"),
            content: this.$T("sslm.supplierDocManage.view.modal.confirmReleaseContent").$D("发布后分数将分别公布至参评供应商查看，确定发布吗？"),
            onOk: () => {
              this.$loading.show();
              publish(evalHeaderId).then((res) => {
                if (res && !res.failed) {
                  this.lineDataSet.refresh();
                }
              }).finally(() => this.$loading.hide());
            }
          });
        },
      };
      const headerStatus = this.headerDataSet.current.get("evalStatus");
      switch (headerStatus) {
      case "NEW":
        //新建
        buttons.push(saveHeader);
        buttons.push(execEval);
        buttons.push(deleteHeader);
        break;
      case "SYSTEM_PROCESSING":
        //计算中
        buttons.push(deleteHeader);
        buttons.push(execEval);
        break;
      case "SYSTEM_COMPLETE":
        //计算成功
        buttons.push(deleteHeader);
        buttons.push(execEval);
        break;
      case "SYSTEM_FAIL":
        //计算失败
        buttons.push(deleteHeader);
        buttons.push(execEval);
        break;
      case "MANUAL_EVALUATING":
        //评分中
        buttons.push(backToEval);
        break;
      case "MANUAL_COMPLETE":
        //评分完成
        buttons.push(backToEval);
        buttons.push(sumEval);
        buttons.push(deleteHeader);
        break;
      case "FINAL_COLLECTED":
        //汇总完成
        buttons.push(backToEval);
        buttons.push(submit);
        //buttons.push(createProblemButton);
        buttons.push(deleteHeader);
        break;
      case "APPROVING":
        //审批中
        //buttons.push(createProblemButton);
        break;
      case "PUBLISHED":
        //已发布
        //buttons.push(createProblemButton);
        break;
      case "COMPLETED":
        //已完成
        //buttons.push(createProblemButton);
        buttons.push(publishEval);
        break;
      case "MANUAL_EVALUATING_COMPLETE":
        //已完成
        break;
      case "REJECTED":
        buttons.push(submit);
        break;
      default:
        break;
      }
      return buttons;
    },
    getSupplierColumns() {
      const headerStatus = this.headerDataSet.current && this.headerDataSet.current.get("evalStatus");
      const evalGranularity = this.headerDataSet.current && this.headerDataSet.current.get("evalGranularity");
      return [
        {
          formRow: 1,
          fieldCode: "supplierNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={false}>{val}</SrmListHeader>,
        },
        {
          formRow: 2,
          fieldCode: "supplierName",
        },
        {
          formRow: 3,
          fieldCode: "categoryIds",
          visible: evalGranularity === "SU+CA",
          render: (val, item) => {
            if ("NEW" === headerStatus && !this.readOnly) {
              if (this.supplierDataSet.editFlag) {
                return <SrmButton plain rect onClick={() => this.editSupplierCategory(item)}>{this.$T("smbl.common.button.edit").$D("编辑")}</SrmButton>;
              }
              return this.$T("smbl.common.button.edit").$D("编辑");
            }
            return <SrmButton plain rect onClick={() => this.editSupplierCategory(item)}>
              {this.$T("smbl.common.button.view").$D("查看")}
            </SrmButton>;
          },
        },
        {
          formRow: 30,
          fieldCode: "itemIds",
          visible: evalGranularity === "SU+IT",
          render: (val, item) => {
            if ("NEW" === headerStatus && !this.readOnly) {
              if (this.supplierDataSet.editFlag) {
                return <SrmButton plain rect onClick={() => this.editSupplierItem(item)}>{this.$T("smbl.common.button.edit").$D("编辑")}</SrmButton>;
              }
              return this.$T("smbl.common.button.edit").$D("编辑");
            }
            return <SrmButton plain rect onClick={() => this.editSupplierItem(item)}>
              {this.$T("smbl.common.button.view").$D("查看")}
            </SrmButton>;
          },
        },
      ];
    },
    toggleSupplierEdit(type) {
      let flag = true;
      const updateData = this.supplierDataSet.records.filter((r) => r.get("_status") || r.get("categoryVOS") || r.get("itemVOS"));
      if (type === "cancel" && !isEmpty(updateData)) {
        flag = this.saveScoreVendor();
      }
      if (flag) {
        this.supplierDataSet.editFlag = !this.supplierDataSet.editFlag;
        this.showDetailBottom = !this.supplierDataSet.editFlag;
        this.scoreDetailDataSet.editFlag = false;
      }
    },
    saveScoreVendor(refreshFlag = true) {
      const headerStatus = this.headerDataSet.current && this.headerDataSet.current.get("evalStatus");
      const evalGranularity = this.headerDataSet.current && this.headerDataSet.current.get("evalGranularity");
      if ("NEW" === headerStatus && evalGranularity !== "SU") {
        const update = this.supplierDataSet.records;
        // eslint-disable-next-line no-unused-vars
        for (let r in update) {
          if (evalGranularity === "SU+CA") {
            // 判断是否要校验参评品类,新增数据｜打开品类选择数据 需要校验
            const categoryVOS = update[r].get("categoryVOS");
            const checkFlag = update[r].get("_status") && isEmpty(categoryVOS) || categoryVOS && isEmpty(categoryVOS);
            if (checkFlag) {
              this.$notification.open({
                message: update[r].get("supplierName") + this.$T("sslm.supplierDocManage.view.message.noCategoryVos").$D("参评品类不能为空!"),
              });
              return false;
            }
          } else if (evalGranularity === "SU+IT") {
            // 判断是否要校验参评物料,新增数据｜打开品类选择数据 需要校验
            const itemVOS = update[r].get("itemVOS");
            const itemInsertVOS = itemVOS && itemVOS.filter((e) => e.insertFlag === 1);
            const checkFlag = update[r].get("_status") && isEmpty(itemVOS) || itemVOS && isEmpty(itemInsertVOS);
            if (checkFlag) {
              this.$notification.open({
                message: update[r].get("supplierName") + this.$T("sslm.supplierDocManage.view.message.noItemVos").$D("参评物料不能为空!"),
              });
              return false;
            }
          }
        }
      }
      this.supplierDataSet.update().finally(() => {
        if (refreshFlag) {
          this.scoreDetailDataSet.refresh();
          this.lineDataSet.refresh();
        }
      });
      return true;
    },
    getSupplierButtons() {
      return [
        "delete",
        {
          text: this.$T("smbl.common.button.save").$D("保存"),
          type: "primary",
          visible: true,
          callback: () => {
            this.saveScoreVendor();
          }
        },
        {
          text: this.$T("smbl.common.button.create").$D("创建"),
          type: "primary",
          visible: true,
          fill: true,
          callback: () => {
            const newEvalHeaderId = this.$route && this.$route.query && this.$route.query.evalHeaderId || this.evalHeaderId;
            const exist = this.supplierDataSet.records.map((record) => record.get("supplierId"));
            const popup = this.$popup({
              showHeader: false,
              position: "right",
              height: "100%",
              width: "100%",
              content: <CreateSupplier
                evalHeaderId={newEvalHeaderId}
                exist={exist}
                onCancel={() => popup.closePopup()}
                onSubmit={(data) => {
                  popup.closePopup();
                  data.forEach((e) => {
                    this.supplierDataSet.create({
                      erpSupplierName: e.erpSupplierName,
                      erpSupplierNum: e.erpSupplierNum,
                      supplierId: e.supplierCompanyId,
                      supplierName: e.companyName,
                      supplierNum: e.companyNum,
                      supplierTenantId: e.supplierTenantId,
                    }, this.supplierDataSet.records.length);
                  });
                }}/>,
            });
          },
        },
      ];
    },
    editSupplierItem(item) {
      const newEvalHeaderId = this.$route && this.$route.query && this.$route.query.evalHeaderId || this.evalHeaderId;
      const supplierId = item.supplierId;
      const headerStatus = this.headerDataSet.current && this.headerDataSet.current.get("evalStatus");
      // 选中的参评物料
      const { itemVOS: selectedItemVOS } = item;
      const popup = this.$popup({
        showHeader: false,
        position: "right",
        height: "100%",
        width: "100%",
        content: <SupplierItem
          selectedItemVOS={selectedItemVOS}
          editFlag={headerStatus === "NEW"}
          evalHeaderId={newEvalHeaderId}
          supplierId={supplierId}
          onCancel={() => popup.closePopup()}
          onSubmit={(itemVOS) => {
            popup.closePopup();
            if (headerStatus === "NEW") {
              this.supplierDataSet.current.set("itemVOS", itemVOS);
            }
          }}/>,
      });
    },
    editSupplierCategory(item) {
      const newEvalHeaderId = this.$route && this.$route.query && this.$route.query.evalHeaderId || this.evalHeaderId;
      const supplierId = item.supplierId;
      const headerStatus = this.headerDataSet.current && this.headerDataSet.current.get("evalStatus");
      // 选中的参评品类
      const { categoryVOS: selectedCategoryVOS } = item;
      const popup = this.$popup({
        showHeader: false,
        position: "right",
        height: "100%",
        width: "100%",
        content: <SupplierCategory
          selectedCategoryVOS={selectedCategoryVOS}
          editFlag={headerStatus === "NEW"}
          evalHeaderId={newEvalHeaderId}
          supplierId={supplierId}
          onCancel={() => popup.closePopup()}
          onSubmit={(categoryVOS) => {
            popup.closePopup();
            if (headerStatus === "NEW") {
              this.supplierDataSet.current.set("categoryVOS", categoryVOS);
            }
          }}/>,
      });
    },
    toggleScoreDetailEdit() {
      this.scoreDetailDataSet.editFlag = !this.scoreDetailDataSet.editFlag;
      this.showDetailBottom = !this.scoreDetailDataSet.editFlag;
      this.supplierDataSet.editFlag = false;
    },
    getScoreDetailButtons() {
      return [
        {
          text: this.$T("sslm.supplierDocManage.view.button.batchMaintenanceRaters").$D("批量编辑评分人"),
          type: "primary",
          visible: true,
          disabled: (selected) => selected.length === 0,
          callback: () => this.showScorer(true),
        },
        {
          text: this.$T("sslm.supplierDocManage.view.button.indicatorMaintain").$D("指标维护"),
          type: "primary",
          visible: true,
          fill: true,
          callback: () => {
            const newEvalHeaderId = this.$route && this.$route.query && this.$route.query.evalHeaderId || this.evalHeaderId;
            const popup = this.$popup({
              showHeader: false,
              position: "right",
              height: "100%",
              width: "100%",
              content: <IndicatorEdit
                evalHeaderId={newEvalHeaderId}
                onSubmit={() => popup.closePopup()}
                onCancel={() => popup.closePopup()}/>,
            });
          },
        },
      ];
    },
    getScoreDetailColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "supplierName",
          fieldType: "EMPTY",
          render: (val) => <srm-list-header showOpenTag={false}>{val || "-"}</srm-list-header>,
        },
        { formRow: 10, fieldCode: "supplierNum", },
        { formRow: 20, fieldCode: "categoryName", },
        { formRow: 20, fieldCode: "itemName", },
        { formRow: 30, fieldCode: "indicatorName", },
        { formRow: 40, fieldCode: "indicatorCode", },
        { formRow: 50, fieldCode: "evalStandard", },
        { formRow: 50, fieldCode: "indicatorType", render: (val) => this.indicatorType[val] || val },
        { formRow: 60, fieldCode: "scoreTypeMeaning", },
        {
          formRow: 60,
          fieldCode: "scorer",
          render: (val, item) => item.scoreType === "MANUAL" ?
            <SrmButton plain rect onClick={() => this.showScorer()}>
              {this.$T("sslm.supplierDocManage.model.docManage.evaluationPersonInfo").$D("评分人信息")}
            </SrmButton> :
            item.scoreTypeMeaning
        },
        { formRow: 70, fieldCode: "systemMessage", },
        {
          formRow: 80,
          fieldCode: "completeFlagMeaning",
          render: (val, item) => item.completeFlag ? <SrmButton
            plain rect
            onClick={() => item.scoreType === "SYSTEM" ? this.viewEvalProcess() : this.viewScorer()}>
            {item.processStatusMeaning || val || "-"}
          </SrmButton> : item.processStatusMeaning || val || "-"
        },
        { formRow: 80, fieldCode: "evalWeight", },
        { formRow: 90, fieldCode: "finalScore", },
        { formRow: 90, fieldCode: "defaultScore", },
        { formRow: 95, fieldCode: "checkDetailScore", },
        { formRow: 96, fieldCode: "dtlRemark", },
        { formRow: 100, fieldCode: "scoreFrom", },
        { formRow: 100, fieldCode: "scoreTo", },
        { formRow: 110, fieldCode: "remark", },
      ];
    },
    viewEvalProcess() {
      const evalDtlId = this.scoreDetailDataSet.current.get("evalDtlId");
      this.$popup({
        showHeader: true,
        showClose: true,
        rounded: true,
        title: this.$T("sslm.common.view.title.paramQuery").$D("参数值查询"),
        height: "70%",
        width: "100%",
        content: <EvalProcessView evalDtlId={evalDtlId}/>
      });
    },
    viewScorer() {
      const evalDtlId = this.scoreDetailDataSet.current.get("evalDtlId");
      const newEvalHeaderId = this.$route && this.$route.query && this.$route.query.evalHeaderId || this.evalHeaderId;
      this.$popup({
        showHeader: false,
        height: "100%",
        width: "100%",
        position: "right",
        content: <ScorerView
          evalHeaderId={newEvalHeaderId}
          evalDtlId={evalDtlId}/>
      });
    },
    showScorer(batchFlag = false) {
      const evalDtlId = this.scoreDetailDataSet.current.get("evalDtlId");
      const averageFlag = this.headerDataSet.current.get("averageFlag");
      const evalDtlIds = this.scoreDetailDataSet.selected.map((r) => r.get("evalDtlId"));
      const newEvalHeaderId = this.$route && this.$route.query && this.$route.query.evalHeaderId || this.evalHeaderId;
      const selectAllFlag = this.scoreDetailDataSet.selected.length === this.scoreDetailDataSet.records.length;
      const popup = this.$popup({
        showHeader: false,
        height: "100%",
        width: "100%",
        position: "right",
        content: <ScorerEdit
          evalHeaderId={newEvalHeaderId}
          evalDtlId={batchFlag ? null : evalDtlId}
          evalDtlIds={batchFlag ? evalDtlIds : null}
          selectAllFlag={selectAllFlag}
          averageFlag={averageFlag}
          editFlag={this.headerStatus === "NEW" && !this.readOnly}
          onSave={() => popup.closePopup()}/>
      });
    },
    saveScoreSum() {
      this.lineDataSet.updateRecords(this.lineDataSet.records);
    },
    getRelatedProblemColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "problemNum",
          fieldType: "EMPTY",
          render: (val) => <srm-list-header>{val}</srm-list-header>,
        },
        { formRow: 10, fieldCode: "problemStatusMeaning", },
        { formRow: 20, fieldCode: "problemTitle", },
      ];
    },
    getDetailLineColumns() {
      const current = this.headerDataSet.current;
      const evalStatus = current && current.get("evalStatus");
      return [
        {
          formRow: 1,
          fieldCode: "supplierNum",
          fieldType: "EMPTY",
          render: (val) => <srm-list-header>{val}</srm-list-header>,
        },
        { formRow: 10, fieldCode: "supplierName", },
        // { formRow: 20, fieldCode: "erpSupplierNum", },
        // { formRow: 30, fieldCode: "erpSupplierName", },
        { formRow: 40, fieldCode: "categoryName", },
        { formRow: 40, fieldCode: "itemName", },
        {
          formRow: 50,
          fieldCode: "lineScore",
          render: (val) => (val || val === 0) && <SrmButton plain rect onClick={this.showSummaryScore}>{val}</SrmButton>
        },
        { formRow: 60, fieldCode: "suggestStrategies", editor: evalStatus === "FINAL_COLLECTED" },
        { formRow: 70, fieldCode: "levelCode", },
        { formRow: 80, fieldCode: "rankNum", },
      ];
    },
    showSummaryScore() {
      const current = this.scoreDetailDataSet.current;
      const evalLineId = current.get("evalLineId");
      const evalDesc = current.get("supplierName") + "+" + current.get("categoryName");
      //汇总得分
      this.$popup({
        showHeader: false,
        position: "right",
        width: "100%",
        height: "100%",
        content: <SummaryScore evalLineId={evalLineId} evalDesc={evalDesc}/>
      });
    },
    onLineItemClick() {
      const columns = this.getDetailLineColumns();
      columns[0] = {
        formRow: 1,
        fieldCode: "supplierNum",
        fieldType: "TEXT",
      };
      const popup = this.$popup({
        showHeader: false,
        position: "right",
        width: "100%",
        height: "100%",
        content: <SrmForm
          customizeType="detail"
          dataSet={this.lineDataSet}
          columns={columns}
          buttons={[ {
            text: this.$T("smbl.common.button.confirm").$D("确定"),
            type: "primary",
            handler: () => popup.closePopup(),
          } ]}
        />
      });
    },
    getDetailHeaderColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (val, item) => <srm-list-header>
            {val}
            <SrmButton slot="right" style={{ fontWeight: "bold" }} plain rect>{item.evalStatusMeaning}</SrmButton>
          </srm-list-header>,
        },
        { formRow: 10, fieldCode: "evalName", },
        { formRow: 20, fieldCode: "evalTplName", },
        { formRow: 30, fieldCode: "kpiMethod", render: (val) => this.kpiMethod[val] || val },
        { formRow: 35, fieldCode: "evalCycle", },
        { formRow: 40, fieldCode: "evalDateFrom", },
        { formRow: 45, fieldCode: "evalDateTo", },
        { formRow: 50, fieldCode: "evalDimension", },
        { formRow: 60, fieldCode: "evalDimensionValue", },
        { formRow: 70, fieldCode: "processUserName", },
        { formRow: 80, fieldCode: "creationDate", },
        { formRow: 81, fieldCode: "trxLineFlag", },
        { formRow: 82, fieldCode: "docType", },
        { formRow: 83, fieldCode: "docNum", },
        { formRow: 84, fieldCode: "itemCategoryNames", },
        { formRow: 85, fieldCode: "categoryDescriptions", },
        { formRow: 85, fieldCode: "cooperationDays", },
        { formRow: 90, fieldCode: "autoPushVendorFlageMeaning", },
        { formRow: 100, fieldCode: "evalRuleRemark", },
        { formRow: 110, fieldCode: "remark", },
        { formRow: 120, fieldCode: "processUnitId", },
        {
          formRow: 130,
          fieldCode: "totalAttachment",
          render: (val) => <SrmButton plain rect onClick={() => this.openHeaderAttachment(true)}>
            {this.$T("smbl.common.button.viewAttachment").$D("查看附件")}({this.attachmentDataSet.totalCount || val || 0})
          </SrmButton>,
        },
      ];
    },
  }
};
</script>

<style lang="stylus" scoped>
.detail-container {
  height 100vh;
}

.line-filter {
  display flex;
  justify-content space-between;

  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
  }
}

.list-tool-tab {
  display flex;

  .srm-icon {
    margin-left 10px;
  }
}
</style>
