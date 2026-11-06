<!-- 供应商评估工作台-报告打分详情页 -->
<template>
  <div>
    <div class="srm-detail-maintain">
      <div class="srm-detail-wrap-header">
        <!-- 头信息 -->
        <srm-detail-head :data-source="basicInfo" :columns="getHeaderColumns">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <srm-flex justify="between">
              <div style="display: flex; flex-direction: column; flex: 1">
                <span style="font-size: 12px; color: #868D9C; font-weight: 400; padding: 5px 0;">
                  {{ scoreFlag ? $T("sslm.purchaserEvaluationDetail.form.label.progress").$D("评估进度") : $T("sslm.purchaserEvaluationDetail.form.label.finalScore").$D("最后得分") }}
                </span>
                <span :style="{fontSize: '16px', color: '#1D2129', fontWeight: 600, minHeight: '20px', padding: !scoreFlag ? '2px 0 0' : '4px 0 0'}">
                  {{ scoreFlag ? `${summaryInfo.finishScoreCount}/${summaryInfo.totalScoreCount}` || 0 : basicInfo.finalScore }}
                </span>
              </div>
              <div style="height: 20px; width: 1px; border: 0.5px solid #E5E7EC;" />
              <div style="display: flex; flex-direction: column; flex: 1; margin-left: 16px">
                <span style="font-size: 12px; color: #868D9C; font-weight: 400; padding: 5px 0;">
                  {{ scoreFlag ? $T("sslm.purchaserEvaluationDetail.form.label.sumScore").$D("评分人汇总得分") : $T("sslm.purchaserEvaluationDetail.form.label.resultsFlag").$D("评估结果") }}
                </span>
                <span :style="{fontSize: '16px', color: '#1D2129', fontWeight: 600, minHeight: '20px', padding: !scoreFlag ? '2px 0 0' : '4px 0 0'}">
                  {{ scoreFlag ? summaryInfo.sumScore || 0 : basicInfo.resultsFlagMeaning }}
                </span>
              </div>
              <div style="height: 20px; width: 1px; border: 0.5px solid #E5E7EC;" />
              <div style="display: flex; flex-direction: column; flex: 1; margin-left: 16px">
                <span style="font-size: 12px; color: #868D9C; font-weight: 400; padding: 5px 0;">
                  {{ scoreFlag ? $T("sslm.purchaserEvaluationDetail.form.label.scoreUserName").$D("评分人名称") : $T("sslm.purchaserEvaluationDetail.form.label.level").$D("等级") }}
                </span>
                <span :style="{fontSize: '16px', color: '#1D2129', fontWeight: 600, minHeight: '20px', padding: !scoreFlag ? '2px 0 0' : '4px 0 0'}">
                  {{ scoreFlag ? summaryInfo.respUserName : basicInfo.grade }}
                </span>
              </div>
            </srm-flex>
            <srm-flex v-if="scoreFlag">
              <span style="font-size: 12px; color: #868D9C; font-weight: 400; padding-top: 16px;">{{ $T("sslm.purchaserEvaluationDetail.view.header.viewTitle").$D("查看评估报告") }}</span>
              <em class="button srm-icon icon-caret-right" style="color: #868D9C; padding-top: 16px;" @click="goToTenantDetail"/>
            </srm-flex>
          </div>
        </srm-detail-head>
      </div>
      <!-- 筛选器 -->
      <div class="srm-wrap-filter">
        <div class="srm-filter-search">
          <srm-search
            v-model="filterMap.indicatorMap"
            :field="{ fieldCode: 'indicatorName', fieldType: 'TEXT'}"
            :placeholder="$T('sslm.purchaserEvaluationDetail.table.column.label.indicatorName').$D('评估项目名称')"
            @search="handFilter"/>
        </div>
        <div class="srm-filter-dropdown">
          <srm-flex class="filter-item-box" justify="between">
            <srm-flex-item :flex="1">
              <srm-dropdown-box :visible.sync="showDropTypeDown" value="todo" :text="filterMap.indicatorTypeName">
                <srm-flex direction="column">
                  <div v-for="(scoreItem, index) in scoreTypeList" :key="index">
                    <div style="height: 52px; font-size: 14px; color: #333333; font-weight: 400; line-height: 20px; padding: 16px">
                      <srm-button type="info" plain @click="onScoreType(scoreItem)">{{ scoreItem.meaning }}</srm-button>
                    </div>
                  </div>
                </srm-flex>
              </srm-dropdown-box>
            </srm-flex-item>
            <srm-flex-item :flex="1">
              <srm-dropdown-box :visible.sync="showDropRangeDown" value="todo" :text="$T('sslm.purchaserEvaluationDetail.tabs.content.scoringRange').$D('得分范围')">
                <div style="display: flex; height: 52px; align-items: center; padding: 0 21px; font-size: 14px; color: #AFAFAF;">
                  <div style="flex: 1">
                    <srm-input-field
                      v-model="filterMap.indicatorScoreFrom"
                      :placeholder="$T('sslm.purchaserEvaluationDetail.table.column.label.scoreFrom').$D('得分从')"
                      :show-icon="showIcon"
                      :disabled="filterMap.writeScoreFlag || filterMap.indicatorAbandonFlag"
                      type="Number"
                      @blur="onBlur"
                      @clear="onBlur"/>
                  </div>
                  <div style="padding: 5px">~</div>
                  <div style="flex: 1">
                    <srm-input-field
                      v-model="filterMap.indicatorScoreTo"
                      :placeholder="$T('sslm.purchaserEvaluationDetail.table.column.label.scoreTo').$D('得分至')"
                      type="Number"
                      :disabled="filterMap.writeScoreFlag || filterMap.indicatorAbandonFlag"
                      @blur="onBlur"
                      @clear="onBlur"/>
                  </div>
                </div>
                <div v-if="scoreFlag" class="srm-division"/>
                <div v-if="scoreFlag" style="padding: 16px 20px">
                  <srm-switch-field type="primary" size="mid" :value="filterMap.writeScoreFlag" @inputChange="handWriteScore">
                    <span slot="left">{{ $T('sslm.purchaserEvaluationDetail.table.column.label.displayedUnscoredIndicators').$D('仅展示未评分指标') }}</span>
                  </srm-switch-field>
                </div>
                <div v-if="basicInfo.abandonFlag" class="srm-division"/>
                <div v-if="basicInfo.abandonFlag" style="padding: 16px 20px">
                  <srm-switch-field type="primary" size="mid" :value="filterMap.indicatorAbandonFlag" @inputChange="handAbandonIndicator">
                    <span slot="left">{{ $T('sslm.purchaserEvaluationDetail.table.column.label.displayedAbandonIndicators').$D('仅展示已放弃指标') }}</span>
                  </srm-switch-field>
                </div>
              </srm-dropdown-box>
            </srm-flex-item>
          </srm-flex>
        </div>
        <div class="srm-filter-search-division"/>
      </div>
      <!-- 维度切换 -->
      <div v-if="!scoreFlag" class="srm-content-top">
        <div class="srm-content-top-dimen">
          <srm-button
            :style="dimen === dimenTab.scorer ? 'background: white;' : 'background: #F7F8FA; color:#4E5769;'"
            type="info"
            @click="handDimenChange(dimenTab.scorer)">
            <span style="font-size: 10px"> {{ $T('sslm.purchaserEvaluationDetail.modal.title.scorer').$D('评分人') }} </span>
          </srm-button>
          <srm-button
            :style="dimen === dimenTab.element ? 'background: white' : 'background: #F7F8FA; color:#4E5769'"
            type="info"
            @click="handDimenChange(dimenTab.element)">
            <span style="font-size: 10px"> {{ $T('sslm.purchaserEvaluationDetail.modal.title.scoringElement').$D('评分要素') }} </span>
          </srm-button>
        </div>
        <div v-if="dimen === dimenTab.scorer" class="srm-content-top-dropdown">
          <srm-dropdown-box type="tooltip" :text="scoreFilter.name" :show-arrow="true" @select="handScoreSelect">
            <srm-flex direction="column">
              <div v-for="(score, index) in scoreList" :key="index">
                <srm-dropdown-item :value="score.id" :text="score.realName"/>
              </div>
            </srm-flex>
          </srm-dropdown-box>
        </div>
      </div>
      <!-- 评估项目信息滑块 -->
      <div class="srm-wrap-scoll-card">
        <scoll-card v-if="assessmentInfo" :data-list="assessmentInfo" :activite-tab="activiteTab" :score-flag="scoreFlag" @handClick="handCardClick" @onClickAll="onCardClickAll"/>
      </div>
      <!-- 评估项目内容 -->
      <div v-if="assessmentChildrenInfo" class="srm-wrap-content" >
        <div class="srm-content-division"/>
        <div v-for="(item,index) in assessmentChildrenInfo" :key="index">
          <div class="card-personalized">
            <customize :columns="getAssessmentColumns(item)" :data-source="item" code="SMBL.PUR_EVALUATION_WORKBENCH.SCORE.DETAIL.ASSESSMENT"/>
          </div>
          <div class="srm-content-bottom"/>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="isEdit && scoreFlag && bottomBtn.length > 0" :btn-arr="bottomBtn"/>
  </div>
</template>

<script>
import scoreDetailMix from "../mixins/scoreDetailMix";
import ScollCard from "../component/ScollCard";
import SrmDropdownBox from "../component/SrmDropdownBox.vue";
import { forEach, isNil, isEmpty } from "lodash";
import {
  getBasicInfoApi,
  getSummaryInfoApi,
  getAssessmentelEmentApi,
  getAssessmentScoreApi,
  getAssessmentApi,
  getLovListApi,
  getLovApi,
  saveFillingScore,
  submitFillingScore,
  batchCancel,
  queryCustomizeApi,
} from "../api";
import { SrmUtil, DataSet } from "srm-mobile-ui";
import { commonDs } from "../datasource/detailDs";
import uuid from "uuid";

export default {
  modules: [ "sslm.purchaserEvaluationDetail", "sslm.purchaserEvaluation", "smbl.common", "sslm.common", "hzero.common" ],
  name: "PurEvaluationScoreDetail",
  components: { ScollCard, SrmDropdownBox },
  mixins: [ scoreDetailMix ],
  props:{
    propEvalHeaderId: {
      type: String,
      default: "",
    },
    propStatus: {
      type: String,
      default: "",
    },
    propSource: {
      type: String,
      default: "",
    },
    propScorerId: {
      type: String,
      default: "",
    },
    propScorerName: {
      type: String,
      default: "",
    },
    propFlag: {
      type: String,
      default: "",
    }
  },
  data() {
    const { evalHeaderId, status, source, scorerId, scorerName, flag } = this.$route?.query || {};
    const defaultSource = this.propSource || source;
    // 判断来源页面：汇总完成：manage ｜ allScore：打分列表-全部
    const isScore = ![ "manage", "allScore" ].includes(defaultSource);
    const apiType = [ "manage" ].includes(defaultSource) ? "element" : "scorer";
    const defaultDimen = [ "manage" ].includes(defaultSource) ? "element" : "scorer";
    const defaultFlag = this.propFlag || flag;
    const viewScoreFlag = [ "manage" ].includes(defaultSource);
    return {
      flag: defaultFlag,
      activiteTab: 0, // 默认激活的卡片
      activiteData: {}, // 激活卡片数据
      // 维度值
      dimenTab: {
        scorer: "scorer", // 评分人:scorer
        element: "element", // 评分要素：element
      },
      source: defaultSource, // 来源页面
      dimen: defaultDimen, // 默认维度
      viewScoreFlag: viewScoreFlag, // 查看评分
      apiType: apiType, // 调用查询接口类型
      scoreFlag: isScore, // 打分页面标识，true: 评分页面，页面显示评分人汇总信息，评估进度信息，不可切换维度｜false：查看评分页面，显示基本评估结果信息，可切换维度
      evalHeaderId: this.propEvalHeaderId || evalHeaderId, // 单据头id
      isEdit: this.propStatus && this.propStatus !== "view" || status && status !== "view" || false,
      basicInfo: {}, // 基础信息
      summaryInfo: {}, // 评分人汇总信息
      showIcon: false, //输入框隐藏编辑图标
      showDropTypeDown: false,
      showDropRangeDown: false,
      showDropScorerDown: false,
      scoreTypeMap: {}, // 评分方式翻译,
      scoreTypeList: [], // 评分方式值集,
      scoreList: [], // 评分人
      assessmentInfo: [],
      assessmentChildrenInfo: {},
      openSiteLocation: false, // 开启现场定位
      acquireLocationFlag: false, // 正在获取定位
      submitScoreInfo: {}, // 提交评分弹窗信息
      scoreFilter: {
        name: this.propScorerName || scorerName,
        id: this.propScorerId || scorerId,
      }, // 默认评分人
      filterMap: {
        indicatorMap: {}, // 评估项目名称
        indicatorType: "ALL", //评分类型
        indicatorTypeName: this.$T("sslm.purchaserEvaluation.tabs.content.tabPaneScoreAll").$D("全部"),
        indicatorScoreFrom: null, // 得分范围
        indicatorScoreTo: null,
        writeScoreFlag: false,
        indicatorAbandonFlag: false,
      }, // 筛选条件
    };
  },
  computed: {
    // 北京鱼道天下标准二开
    isYnzyqCux() {
      return SrmUtil.getTenantNum() === "SRM-YNZYQ"; // 北京鱼道天下供应链管理有限公司
    },
    getCardColumns() {
      const columns = [
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
        },
      ];
      return columns;
    },
    getScoreColumns() {
      const columns = [
        this.openSiteLocation && {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.siteLocation").$D("现场定位"),
          fieldCode: "siteLocation",
          fieldType: "TEXT",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{ record.siteLocation }</span>
            <span slot="right">
              <srm-button type="primary" plain rect onClick={() => this.getLocation(this.openSiteLocation)}>
                {this.acquireLocationFlag ? this.$T("sslm.purchaserEvaluationDetail.table.column.label.acquireLocation").$D("正在获取定位") : this.$T("sslm.purchaserEvaluationDetail.table.column.label.reacquireLocation").$D("重新获取定位")}
              </srm-button>
            </span>
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sslm.common.model.field.raterOpinion").$D("评分人意见"),
          fieldCode: "respUserRemark",
          fieldType: "TEXT_AREA",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.view.content.internalAttachment").$D("内部附件"),
          fieldCode: "internalAttachmentUuid",
          fieldType: "UPLOAD",
          canUpload: true,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.view.content.externalAttachment").$D("外部附件"),
          fieldCode: "externalAttachmentUuid",
          fieldType: "UPLOAD",
          canUpload: true,
        },
      ].filter(Boolean);
      return columns;
    },
    // 底部按钮
    bottomBtn() {
      return [
        {
          type: "primary",
          fill: false,
          bordered: true,
          title: this.$T("hzero.common.button.save").$D("保存"),
          handler: () => this.handleSave()
        },
        {
          type: "primary",
          fill: true,
          title: this.$T("hzero.common.button.submit").$D("提交"),
          handler: () => this.handleSubmit()
        },
      ];
    },
  },
  async mounted() {
    this.init();
  },
  methods: {
    // 提交评分回调
    submitScoreHandle() {
      const { siteLocation, respUserRemark, internalAttachmentUuid, externalAttachmentUuid } = this.submitScoreInfo;
      const params = this.getSaveParams();
      Object.assign(params, { internalAttachmentUuid, externalAttachmentUuid });
      Object.assign(params.siteEvalRespHeader, { siteLocation, respUserRemark });
      this.$loading.show();
      submitFillingScore(params).then((res) => {
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          this.$router.push({
            name: "PurEvaluationList",
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    /**
     * 获取个性化字段配置信息
     * data: 个性化数据
     * unitCode：单元编码
     * field：字段编码
     */
    getFieldProperty(data, unitCode, field) {
      let property = {};
      if (data && data[unitCode]) {
        const unitCodeData = data[unitCode];
        forEach(unitCodeData.fields || [], (fiel) => {
          if (fiel.fieldCode === field) {
            property = fiel;
          }
        });
      }
      return property;
    },
    getSaveParams() {
      const assessmentChildren = this.assessmentChildrenInfo.map((record) => {
        const { indicatorType } = record || {};
        // 当前评分人信息(child数据中无评分人信息，需要自行拼接)
        const curSiteEvalLineResp = record?.siteEvalLineResp || {};
        const convertMap = {
          respUserId: record.respUserId || curSiteEvalLineResp.respUserId,
          objectVersionNumber: record.respObjectVersionNumber || curSiteEvalLineResp.objectVersionNumber,
          score: record.respScore || null,
          evalTplIndOptId: indicatorType === "OPT" ? record.respEvalTplIndOptId || null : null,
          isVeto: indicatorType === "VETO" ? !isEmpty(record.respIsVeto) ? Number(record.respIsVeto) : null : null,
          isStandard: indicatorType === "TICK" ? !isEmpty(record.respIsStandard) ? Number(record.respIsStandard) : null : null,
          scoreAttachmentUuid: record.respScoreAttachmentUuid || null,
          respRemarks: record.respRespRemarks || null,
        };
        const newParams = {
          ...record.siteEvalLineResp,
          ...record,
          ...convertMap,
        };
        return newParams;
      });
      const saveUnitCode = [
        "SSLM.PURCHASER_ASSESS_DETAIL.IN_ATT_FORM",
        "SSLM.PURCHASER_ASSESS_DETAIL.EX_ATT_FORM",
        "SSLM.PURCHASER_ASSESS_DETAIL.SCORE_INFORMATION",
      ];
      const params = {
        ...this.basicInfo,
        siteEvalRespHeader: this.summaryInfo,
        siteEvalLineResps: assessmentChildren,
        customizeUnitCode: saveUnitCode.join(","),
      };
      return params;
    },
    // 保存
    handleSave(isBottomSave = true, activiteTab) {
      const { siteLocation, respUserRemark, internalAttachmentUuid, externalAttachmentUuid } = this.submitScoreInfo;
      const params = this.getSaveParams();
      Object.assign(params, { internalAttachmentUuid, externalAttachmentUuid });
      Object.assign(params.siteEvalRespHeader, { siteLocation, respUserRemark });
      // 基于标准二开
      if (this.isYnzyqCux) {
        this.ynzyqCuxSave(params, isBottomSave, activiteTab);
        return true;
      }
      this.save(params, isBottomSave, activiteTab);
    },
    save(params, isBottomSave, activiteTab) {
      saveFillingScore(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          if (isBottomSave) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
          }
          this.handFilter({}, isNil(activiteTab) ? this.activiteTab : activiteTab);
        }
      });
    },
    // 提交
    handleSubmit() {
      this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.message.title.submitScore").$D("提交评分"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "80vh",
        rounded: true,
        content: <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", paddingBottom: "20px" }}>
          <customize-detail
            style="padding: 0 15px"
            columns={this.getScoreColumns}
            dataSource={this.submitScoreInfo}/>
          <srm-flex style={{ padding: "8px 20px" }}>
            <srm-button size="large" fill full-width type="primary" onClick={() => this.submitScoreHandle()}>{ this.$T("sslm.purchaserEvaluationDetail.message.title.submitScore").$D("提交评分") }</srm-button>
          </srm-flex>
        </div>,
      });
    },
    // 放弃评分
    handleAbandonScore(record) {
      const saveParams = this.getSaveParams();
      const convertMap = {
        score: record.respScore,
        evalTplIndOptId: record.respEvalTplIndOptId,
        isVeto:record.respIsVeto,
        isStandard: record.respIsStandard,
        scoreAttachmentUuid: record.respScoreAttachmentUuid,
        respRemarks: record.respRespRemarks,
      };
      Object.assign(record, record.siteEvalLineResp, convertMap);
      const { evalLineRespId } = record;
      const params = {
        evalHeaderId: this.evalHeaderId,
        selectAllFlag: 0,
        evalLineRespIds: [ evalLineRespId ],
        siteEvalLineResps: [ record ],
        siteEvalHeader: saveParams, // 保存数据
      };
      // eslint-disable-next-line consistent-this
      const _that = this;
      this.$dialog({
        content: this.$T("smbl.common.message.confirm.abandon").$D("确认放弃吗?"),
        closable: false,
        onOk() {
          this.$loading.show();
          batchCancel(params).then((res) => {
            if (res && !res.failed) {
              this.$notification.open({
                message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                description: "",
                class: "notification"
              });
              _that.handFilter({}, _that.activiteTab);
            }
          }).finally(() => {
            this.$loading.hide();
          });
        }
      });
    },
    // 评分人回调
    handScoreSelect(val) {
      const params = {
        scorerId: val,
      };
      this.handFilter(params);
    },
    // 评分维度回调
    handDimenChange(val) {
      this.dimen = val;
      this.handFilter();
    },
    // 评估打分类型回调
    onScoreType(record) {
      const { meaning, value } = record || {};
      this.filterMap.indicatorType = value;
      this.filterMap.indicatorTypeName = meaning;
      this.handFilter();
      this.showDropTypeDown = false;
    },
    // 得分范围回调
    onBlur() {
      this.handFilter();
    },
    // 仅展示未评分指标回调
    handWriteScore(value) {
      this.filterMap.indicatorScoreFrom = null;
      this.filterMap.indicatorScoreTo = null;
      if (value) {
        this.filterMap.indicatorAbandonFlag = false;
      }
      this.filterMap.writeScoreFlag = value;
      this.handFilter();
    },
    // 仅展示已放弃指标回调
    handAbandonIndicator(value) {
      this.filterMap.indicatorScoreFrom = null;
      this.filterMap.indicatorScoreTo = null;
      if (value) {
        this.filterMap.writeScoreFlag = false;
      }
      this.filterMap.indicatorAbandonFlag = value;
      this.handFilter();
    },
    /**
     *  处理筛选
     * params:查询参数
     * activiteTab：默认激活页签
     **/
    async handFilter(params, activiteTab = 0) {
      let responseData = [];
      // eslint-disable-next-line no-unused-vars
      const { indicatorMap, indicatorType, indicatorTypeName, indicatorScoreFrom, indicatorScoreTo, writeScoreFlag, indicatorAbandonFlag, ...otherFilter } = this.filterMap || {};
      // 管理/打分界面得分范围传参不同，需要区分
      const payload = {
        // code: Number(this.flag) ? "UN_COMPLETE" : "COMPLETED",
        evalHeaderId:this.evalHeaderId,
        scorerId: this.dimen === this.dimenTab.scorer ? this.scoreFilter.id : null, // 评分人维度需要传id
        indicatorName: indicatorMap.indicatorName,
        indicatorType: indicatorType === "ALL" ? null : indicatorType,
        [this.source === "manage" ? "indicatorScoreFrom" : "respScoreFrom"]: indicatorScoreFrom,
        [this.source === "manage" ? "indicatorScoreTo" : "respScoreTo"]: indicatorScoreTo,
        writeScoreFlag: writeScoreFlag ? "0" : "1", // 查询没有填制得分的指标给“0”
        indicatorAbandonFlag: indicatorAbandonFlag ? this.dimen === this.dimenTab.scorer ? "1" : "2" : "0", // 查询放弃指标给“1”
        ...otherFilter,
        ...params,
      };
      this.$loading.show();
      // 评分维度
      if (this.dimen === this.dimenTab.scorer) {
        await getAssessmentScoreApi(payload).then((res) => {
          if (res && !res.failed) {
            responseData = res;
          }
        });
      } else if (this.dimen === this.dimenTab.element) {
        await getAssessmentelEmentApi(payload).then((res) => {
          if (res && !res.failed) {
            responseData = res;
          }
        });
      }
      if (this.scoreFlag) {
        // 评分人汇总信息
        await getSummaryInfoApi(this.evalHeaderId, { submitUserId: this.scoreFilter.id }).then((res) => {
          if (res && !res.failed) {
            this.summaryInfo = res;
            this.submitScoreInfo.siteLocation = res.siteLocation; // 现场定位
            this.submitScoreInfo.respUserRemark = res.respUserRemark; // 评分人意见
          }
        });
      }
      // 每次切换维度，激活第一个卡片
      this.activiteTab = activiteTab || 0;
      const childData = responseData[`${activiteTab}`] ? responseData[`${activiteTab}`]?.children || [ responseData[`${activiteTab}`] ] : [];
      const childDataList = this.handleChildData(childData);
      this.assessmentChildrenInfo = childDataList;
      this.assessmentInfo = responseData;
      this.$loading.hide();
    },
    // 处理末级指标数据
    handleChildData(data = []) {
      let dataList = [];
      dataList = data.map((dataItem) => {
        const { respScore, defaultScore, indicatorType } = dataItem || {};
        let scoreTemp = respScore;
        if (dataItem && indicatorType === "SCORE" && isNil(respScore)) {
          // 分数赋默认得分
          scoreTemp = dataItem.completeFlag === 4 ? respScore : defaultScore;
        }
        return { ...dataItem, respScore: scoreTemp };
      });
      return dataList;
    },
    // 卡片点击回调
    async handCardClick(record, activite) {
      if (this.scoreFlag) {
        await this.handleSave(false, activite);
      } else {
        this.activiteData = record;
        const childData = record?.children || [ record ] || [];
        const childDataList = this.handleChildData(childData);
        this.assessmentChildrenInfo = childDataList;
        this.activiteTab = activite;
      }
    },
    // 全部操作
    onCardClickAll(data, srmCardScrollTo) {
      const cardDs = new DataSet(commonDs());
      cardDs.setData(data || []);
      this.allCardRef = this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "60vh",
        rounded: true,
        content: <srm-list
          columns={this.getCardColumns}
          dataSet={cardDs}
          onItemClick={(item, index, list) => this.handleItemClick(item, index, list, srmCardScrollTo)}/>,
      });
    },
    // 全部操作卡片点击回调
    handleItemClick(item, index, list, srmCardScrollTo) {
      const curRecord = item.data || {};
      // 切换卡片
      this.handCardClick(curRecord, index);
      // 设置卡片滑动
      srmCardScrollTo(index);
      this.allCardRef.closePopup();
    },
    // 跳转详情页管理详情页
    goToTenantDetail() {
      const { evalHeaderId } = this.basicInfo || {};
      this.$router.push({
        name: "PurEvaluationManageDetail",
        query: {
          evalHeaderId: evalHeaderId,
          status: "view",
        },
      });
    },
    // 获取定位信息
    async getLocation(openSiteLocation) {
      if (openSiteLocation) {
        this.$loading.show();
        this.acquireLocationFlag = true;
        const location = await this.$geoLocation().then((locationRes) => locationRes).catch(() => false);
        console.log("location", location);
        if (location) {
          const { province = "", city = "", addr = "" } = location;
          const address = `${province} ${city} ${addr}`;
          this.submitScoreInfo.siteLocation = address;
          this.$notification.open({
            message: this.$T("sslm.purchaserEvaluationDetail.view.message.locationSuccess").$D("获取定位成功"),
            description: "",
            class: "notification"
          });
        }
        this.acquireLocationFlag = false;
        this.$loading.hide();
      }
    },
    //初始化页面，获取基础信息、评估阶段
    async init() {
      this.$loading.show();
      // 基本信息
      await getBasicInfoApi(this.evalHeaderId).then((res) => {
        if (res && !res.failed) {
          this.basicInfo = res;
          this.submitScoreInfo.internalAttachmentUuid = res.internalAttachmentUuid || uuid(); // 内部附件
          this.submitScoreInfo.externalAttachmentUuid = res.externalAttachmentUuid || uuid(); // 外部附件
        }
      });
      if (this.scoreFlag) {
        // 评分人汇总信息
        await getSummaryInfoApi(this.evalHeaderId, { submitUserId: this.scoreFilter.id }).then((res) => {
          if (res && !res.failed) {
            this.summaryInfo = res;
            this.submitScoreInfo.siteLocation = res.siteLocation; // 现场定位
            this.submitScoreInfo.respUserRemark = res.respUserRemark; // 评分人意见
          }
        });
        // 查询是否开启定位配置
        const unitCode = [ "SMBL.PUR_EVALUATION_WORKBENCH.SCORE.SUM_INFORMATION" ];
        await queryCustomizeApi(unitCode).then(async (res) => {
          if (res && !res.failed) {
            const siteLocationfiel = {
              unitCode: "SMBL.PUR_EVALUATION_WORKBENCH.SCORE.SUM_INFORMATION",
              fieldCode: "siteLocation",
            };
            const fieldProperty = this.getFieldProperty(res, siteLocationfiel.unitCode, siteLocationfiel.fieldCode);
            const openSiteLocation = fieldProperty.visible === 1;
            // 初始化页面，是否进行定位
            const initLocationFlag = this.isEdit && this.scoreFlag && fieldProperty.visible === 1 && isNil(this.summaryInfo.siteLocation);
            this.openSiteLocation = openSiteLocation;
            this.getLocation(initLocationFlag);
          }
        });
      }
      // 查询指标信息
      await getAssessmentApi({
        evalHeaderId:this.evalHeaderId,
        scorerId: this.scoreFilter.id,
        apiType: this.apiType,
        // code: Number(this.flag) ? "UN_COMPLETE" : "COMPLETED",
      }).then((res) => {
        if (res && !res.failed) {
          // 若指标没有下级，当前行作为子集
          const childData = res[0] ? res[0].children || [ res[0] ] : [];
          const childDataList = this.handleChildData(childData);
          this.activiteData = res[0];
          this.assessmentChildrenInfo = childDataList;
          this.assessmentInfo = res;
        }
      });
      // 评分类型值集
      const lovCode = {
        scoreType: "SSLM.KPI_INDICATOR_TYPE",
      };
      await getLovListApi(lovCode).then((res) => {
        if (res && !res.failed) {
          const { scoreType } = res || {};
          const allItem = {
            meaning: this.$T("smbl.common.view.all").$D("全部"),
            orderSeq: 0,
            value: "ALL",
          };
          this.scoreTypeList = scoreType;
          this.scoreTypeList.unshift(allItem);
          this.scoreTypeMap = {};
          forEach(this.scoreTypeList || [], (item) => {
            this.scoreTypeMap[item.value] = item.meaning;
          });
        }
      });
      // 评分人值集
      const scoreLovParams = {
        lovCode: "SSLM.SITE_EVAL.INDICATOR_RESP",
        tenantId: SrmUtil.getTenantId(),
        evalHeaderId: this.evalHeaderId,
      };
      await getLovApi(scoreLovParams).then((res) => {
        if (res && !res.failed) {
          if (!this.scoreFilter.id) {
            const { id, realName } = res[0] || {};
            // 评分人接口第一个为默认评分人
            const defaultScore = {
              id: id,
              name: realName,
            };
            this.scoreFilter = defaultScore;
          }
          this.scoreList = res;
        }
      });
      this.$loading.hide();
    },
    // 基于标准二开方法
    ynzyqCuxSave(params, isBottomSave, activiteTab) {
      // eslint-disable-next-line consistent-this
      const _that = this;
      if (isBottomSave) {
        this.$dialog({
          content: this.$T("sslm.purchaserEvaluationDetail.message.saveTip").$D("是否将指标评分备注写入评分人意见"),
          closable: false,
          okText: this.$T("sslm.purchaserEvaluationDetail.message.save.okText").$D("写入并保存"),
          cancelText: this.$T("sslm.purchaserEvaluationDetail.message.save.cancelText").$D("仅保存"),
          onOk() {
            _that.save({ ...params, attributeTinyint1:1 }, isBottomSave, activiteTab);
          },
          onCancel() {
            _that.save(params, isBottomSave, activiteTab);
          }
        });
      } else {
        _that.save(params, isBottomSave, activiteTab);
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
.srm-detail-maintain {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  background: #F6F6F6
  .srm-detail-wrap-header {
    .srm-detail-head {
      >>> .srm-detail-head-slot {
        padding: 16px;
      }
    }
  }
  .srm-wrap-filter {
    position: sticky;
    top: 0;
    background: white;
    z-index: 999;
    .srm-filter-search {
      height: 60px;
      padding: 12px 15px;
    }
    .srm-filter-dropdown {
      height: 44px;
      .filter-item-box {
        .filter-item-scoring-range {
          display: flex;
        }
      }
    }
    .srm-filter-search-division {
      height: 8px;
      background: #F6F6F6;
    }
  }
  .srm-wrap-scoll-card {
    position: sticky;
    top: 110px;
    background: white;
    z-index: 999;
  }
  .srm-content-top {
    display: flex;
    height: 52px;
    justify-content: space-between;
    align-items: center;
    padding: 16px 15px 1px;
    background: white;
    .srm-content-top-dimen {
      line-height: 27px;
      background: #F7F8FA;
      border-radius: 14px;
      padding: 2px;
      >>>.srm-button-mid {
        padding: 4px 8px;
      }
      >>>.srm-button-text {
        font-size: 10px;
      }
    }
    .srm-content-top-dropdown {
      >>>.srm-button {
        background: white;
      }
      >>>.srm-dropdown-button-text {
        font-size: 13px;
      }
    }
  }
  .srm-wrap-content {
    .srm-content-division {
      height: 2px;
      background: #F6F6F6;
    }
      .srm-content-bottom {
      height: 8px;
      background: #f6f6f6
    }
    >>>.srm-scroll-tab-bar-box {
      height: 0;
    }
  }
}
.srm-score-mark-wrap {
  height: 68px;
  padding: 12px 0;
  width: 100%;
  .srm-score-mark-header {
    font-size: 12px;
    color: #868D9C;
    letter-spacing: 0;
    line-height: 18px;
    font-weight: 400;
  }
  .srm-score-mark-content {
    font-size: 16px;
    color: #1D2129;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
    margin-top: 4px;
  }
}
.srm-score-checkbox-wrap {
  padding: 12px 0;
  width: 100%;
  .srm-score-checkbox-header {
    font-size: 12px;
    color: #868D9C;
    letter-spacing: 0;
    line-height: 18px;
    font-weight: 400;
  }
  .srm-score-checkbox-content {
    >>>.srm-check-box-button{
      position: '';
    }
  }
}

.srm-check-box-input {
  opacity 0;
}

.srm-line-remark {
  width: 100%
  .srm-line-content {
    fontSize: 12px;
    color: #868D9C;
    font-weight: 400;
    padding-bottom: 2px;
  }
  .srm-line-division {
    height: 1px;
    background: #F6F6F6;
    width: 100%;
  }
}

.card-personalized {
  width: 100%;
  color: #666666;
  padding 15px;
  background: var(--color-bg-default);

  .card-first-single {
    text-align: left;
    font-size: 16px;
    color: var(--color-font-default, #1b1e2b);
    font-weight: bold;
    padding: 12px 0;
  }

  .card-first-between {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

    .line-code {
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }
}

.srm-division {
  height: 1px;
  background: #F6F6F6;
  width: 100%;
}
</style>
