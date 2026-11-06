<!-- 分配评分人组件 -->
<template>
  <div>
    <srm-list
      :data-set="scorerDs"
      :columns="getListColumns"
      customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASSIGNED"
      @itemClick="onListItemClick"/>
    <div style="margin-bottom: 80px;"/>
    <srm-list-bottom-bar :data-set="scorerDs" :buttons="getBottomBarButtons()"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { getScorerDs, commonDs } from "./datasource/assignedRateryDs";
import { saveAssessmentApi, batchSaveGraderApi } from "../api";
import { forEach, isNil } from "lodash";

export default {
  modules: [ "sslm.common", "smbl.common", "sslm.purchaserEvaluation", "hzero.common", "sslm.purchaserEvaluationDetail", "hipspfm.common" ],
  name: "AssignedRater",
  props: {
    evalHeaderId: {
      type: String,
      default: null,
    },
    batchFlag: {
      type: Boolean,
      default: false,
    },
    basicDs: {
      type: Object,
      default: () => {},
    },
    curRecord: {
      type: Object,
      default: () => {},
    },
    assessmentDs:{
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      scorerDs: this.batchFlag ? new DataSet(getScorerDs(this.evalHeaderId)) : new DataSet(commonDs()),
    };
  },
  computed: {
    getListColumns() {
      // 平均式计算
      const { averageFlag } = this.basicDs.current.data;
      return [
        {
          formRow: 0,
          fieldCode: "realName",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{record.member || val}</span>
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.scoreTable.label.loginName").$D("子账户"),
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.scoreTable.label.userDepartment").$D("部门"),
          fieldCode: "userDepartment",
          render:(val, record) => record.department || val,
        },
        !averageFlag && {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.scoreTable.label.respWeight").$D("评分人权重(%)"),
          fieldCode: "respWeight",
          fieldType: "INPUT_NUMBER",
          required: !averageFlag,
        },
      ].filter(Boolean);
    },
  },
  mounted() {
    if (!this.batchFlag) {
      const { siteEvalLineResps } = this.curRecord || {};
      this.scorerDs.setData(siteEvalLineResps || []);
      // 默认勾选处理
      const selectList = this.scorerDs?.records?.filter((e) => e.data.isSelect) || [];
      this.scorerDs.select(selectList);
    }
  },
  methods: {
    // 列表跳转
    // eslint-disable-next-line no-unused-vars
    onListItemClick(record) {
      // console.log("record", record);
    },
    // 关闭分配评分人弹窗
    closePop() {
      this.$emit("closePop", this.batchFlag);
    },
    // 递归获取全部下级数据
    // parentFlag：数据是否包含在 data 对象中
    getChildParams(selected) {
      const paramsList = [];
      forEach(selected, (item) => {
        const recursionData = (e, parentFlag) => {
          if (parentFlag) {
            if (e.data && isNil(e.data.children)) {
              // 排除系统计算
              if (![ "SYSTEM" ].includes(e.data.scoreType)) {
                paramsList.push(e.data.evalLineId);
              }
            } else if (e.data && !isNil(e.data.children)) {
              forEach(e.data.children, (child) => {
                recursionData(child);
              });
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (e && isNil(e.children)) {
              // 排除系统计算
              if (![ "SYSTEM" ].includes(e.scoreType)) {
                paramsList.push(e.evalLineId);
              }
            } else if (e && !isNil(e.children)) {
              forEach(e.children, (child) => {
                recursionData(child);
              });
            }
          }
        };
        recursionData(item, true);
      });
      return paramsList;
    },
    // 评分人分配回调
    handleAssignedRater(selected) {
      if (!this.scorerDs.validateRecord(selected)) {
        return;
      }
      if (this.batchFlag) {
        // 选择的评分人-打分数据
        const evalResps = selected.map((e) => {
          const { userId, ...other } = e?.data || {};
          const evalRespsLine = { ...other, respUserId: userId };
          return evalRespsLine;
        });
        // 批量勾选的子级数据
        const selectChildIds = this.getChildParams(this.assessmentDs.selected);
        const params = {
          evalLineIds: selectChildIds,
          siteEvalLineResps: evalResps,
        };
        this.$loading.show();
        batchSaveGraderApi(params).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            this.closePop();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        const saveHeaderData = this.basicDs.toData()[0] || {}; // 基础信息
        const evalResps = selected.map((e) => {
          // eslint-disable-next-line no-unused-vars
          const { evalLineRespId, userId, ...other } = e?.data || {};
          const evalRespsLine = { ...other, evalLineId: this.curRecord.evalLineId };
          return evalRespsLine;
        }); // 选择的评分人
        // 已选择评分人id
        const respUserIds = selected.map((e) => e?.data?.respUserId);
        // 处理选中标识
        const newDataSource = this.scorerDs.data.map((data) => ({
          ...data,
          isSelect: respUserIds.includes(data.respUserId) ? 1 : 0,
        }));
        const curSiteEvalLine = this.curRecord; // 当前的评估信息行
        Object.assign(curSiteEvalLine, { evalResps: evalResps, siteEvalLineResps: newDataSource });
        const siteEvalLineList = [ curSiteEvalLine ] || {};
        const params = {
          ...saveHeaderData,
          siteEvalLineList,
        };
        this.$loading.show();
        saveAssessmentApi(params).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            this.closePop();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    // 底部按钮
    getBottomBarButtons() {
      return [
        {
          text: this.$T("hzero.common.button.ok").$D("确定"),
          type: "primary",
          disabled: (selected) => selected.length === 0,
          callback: (selected) => this.handleAssignedRater(selected),
        },
      ];
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
