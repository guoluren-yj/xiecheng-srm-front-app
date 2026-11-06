<template>
  <div class="create-receive-detail-container">
    <div class="create-receive-detail-scroll-el">
      <srm-detail-head ref="headInfoHeight" :columns="getHeaderColumns()" :data-source="headDataSet.data[0]?headDataSet.data[0]:{}">
        <div>
          <!-- 等dataSet加载完再判断 -->
          <srm-button-group
            v-if="acceptHeaderId"
            :buttons="getTopBtn"
            class="override-btn-group"/>
        </div>
      </srm-detail-head>
      <srm-scroll-tab >
        <srm-scroll-tab-item :label="$T('scux.view.title.detail.basicInfo').$D('基础信息')">
          <div>
            <srm-form style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getBasicColumns(editor)"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('scux.view.title.detail.acceptanceInfo').$D('本次验收信息')">
          <div>
            <srm-form style="padding:0 15px 10px 15px;min-height: 200px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getAccColumns(editor)"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('scux.view.title.detail.orderAcceptanceInfo').$D('订单验收信息')">
          <div>
            <srm-form style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getAccOrderColumns(editor)"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('cux.view.title.detail.lineInfo').$D('验收单行信息')" :show-title="false">
          <srm-flex style="background:#f0f2f5;height: 54px " justify="between">
            <div style="margin-left: 15px ;font-family: PingFangSC-Semibold;font-size: 16px;color: #333333;font-weight: 600;">{{ $T('cux.view.title.detail.lineInfo').$D('验收单行信息') }}</div>
          </srm-flex>
          <srm-list v-if="editor"
                    height="auto"
                    :show-bottom-bar="false"
                    :scrollable="false"
                    :data-set="lineDataSet"
                    :columns="getLineColumns(editor)"
                    @itemClick="clickDetailLineInfo(true)"/>
        </srm-scroll-tab-item>
        <!-- 评价 -->
        <srm-scroll-tab-item :label="$T('scux.acceptBench.model.view.title.inventoryDetails').$D('验收/抽检评价')">
          <srm-form style="padding:0 15px 0 15px;min-height: 20px;margin-bottom: 0px;" :data-set="headDataSet" :columns="getAcceptanceColumns(editor)"/>
          <srm-list v-if="editor"
                    height="auto"
                    :scrollable="false"
                    :show-bottom-bar="false"
                    :data-set="scoreDataSet"
                    :columns="getScoreColumns(editor)"/>
        </srm-scroll-tab-item>
        <!-- 附件 -->
        <srm-scroll-tab-item :label="$T('scux.acceptBench.attachment.uploadAttachmentOwn').$D('附件')">
          <srm-list :scrollable="false"
                    :data-set="headDataSet"
                    :columns="getAttchColumns(editor)"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <srm-bottom-handler :btn-arr="getButtons" type="tooltip">
      <div v-if="(headDataSet.data[0] && headDataSet.data[0]['acceptStatus'] ==='NEW' && editor ==='1')"
           slot="left"
           style="height: 48px;width: 48px;display: flex;justify-content: center;align-items: center;margin-right: 10px"
           @click="deleteRecord">
        <em class="srm-icon icon-trash" style="font-size: 24px;color: #cbcbcb"/>
      </div>
    </srm-bottom-handler>
    <!--    使用动态返回弹窗，会导致内部样式渲染延迟，此处直接构造节点，在页面加载的时候渲染节点，控制其显示或者隐藏 -->
    <srm-popup :visible="scorePopupFlag" width="100%" :title="$T('scux.acceptBench.model.view.title.inventoryDetails').$D('验收/抽检评价')" :show-header="true" :show-back="true" :show-close="true" position="right" :before-close="scorePopupCloseBefore">
      <srm-list :columns="getScoreColumns()" :data-set="scoreDataSet"/>
    </srm-popup>
    <srm-popup
      position="bottom"
      :visible="showCancelPop"
      :title="$T('scux.acceptBench.model.view.cancelReason').$D('取消原因')"
      :show-header="true"
      :height="'80%'"
      :on-close="()=>showCancelPop=false">
      <srm-form
        style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;"
        :data-set="remarkDataSet"
        :columns="getCancelColumns()"/>
      <srm-bottom-handler :btn-arr="getCavcelButtons" type="tooltip"/>
    </srm-popup>
    <!-- 行明细信息 -->
    <srm-popup :visible="lineVisible" position="right" :show-header="false" @onClose="clickDetailLineInfo(false)">
      <srm-form customize-type="detail" :columns="getLineDetailColumns(editor)" :data-set="lineDataSet" />
    </srm-popup>
    <!--    操作记录 -->
    <history-record
      v-model="operationPopupFlag"
      :title="$T('smbl.common.message.OperationRecord').$D('操作记录')"
      operator-field-name="processUserName"
      operation-meaning-field-name="process"
      process-date-field-name="processDate"
      process-remark-field-name="processRemark"
      :action-data="operationRecord"
      :loading="operationPopupLoadingFlag"
      :remark-label="$T('smbl.common.view.operation.show').$D('操作说明')"/>
    <!--    审批记录 -->
    <history-record
      v-model="approvePopupFlag"
      :title="$T('smbl.common.button.taskDetail.record').$D('审批记录')"
      operator-field-name="assigneeName"
      operation-meaning-field-name="action"
      process-date-field-name="startTime"
      process-remark-field-name="comment"
      :loading="approvePopupLoadingFlag"
      :action-data="approveRecord"/>
  </div>
</template>
<script>
import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import moment from "moment";
// import uuid from "uuid";
import HistoryRecord from "@/components/HistoryRecord";
import { receiveHeaderDs } from "../datasource/receiveHeaderDS";
import { receiveLineDs } from "../datasource/receiveLineDS";
import { scoreDs } from "../datasource/scoreDS";
import { remarkDS } from "../datasource/remarkDS";
import { getOperationRecord, save, submit, deleted, cancelApi, queryDepApi, getHeaderAttachmentUuidApi, getApproveRecord } from "../api";
// import Vue from "vue";
import Mixin from "../mixins/DetailColumns";
// import HistoryRecordTiled from "../../../components/HistoryRecordTiled.vue";
// import ReceiverWorkplaceDetailMethod from "../../CUX_PART/Method/ReceiverWorkplaceDetailMethod";

export default {
  name: "OrderReceipWorkbenchDetail",
  modules: [ "hzero.common", "smbl.common", "sinv.receiptExecution", "sinv.receipWorkbench", "hipspfm.common", "scux.acceptBench", "sinv.receiptWorkbench", "scux.view", "cux.view", "sinv.common", "hwfp.common", "slod.common", "smbl.workFlow" ],
  //   extends: ReceiverWorkplaceDetailMethod,
  components:{ HistoryRecord },
  mixins: [ Mixin ],
  data() {
    return {
      showCancelPop: false,
      autoReceiveLocationAddress: null,
      isDoubleUnit:0,
      acceptHeaderId: null,
      headDataSet: new DataSet(receiveHeaderDs(this)),
      lineDataSet:new DataSet(receiveLineDs(this)),
      remarkDataSet:  new DataSet(remarkDS(this)),
      scoreDataSet: new DataSet(scoreDs(this)),
      defineData:{ trxDate:null, invOrganizationId:null, invOrganizationSameFlag:true, invOrganizationCode:null, inventoryId:null, inventorySameFlag:true, inventoryCode:null, inventoryName:null, locatorId:null, locationName:null },
      lineEditFlag:false,
      lineEditButton: this.$T("smbl.common.view.button.edit").$D("编辑"),
      showBottom:true,
      scorePopupFlag:false,
      operationRecord:[],
      operationPopupFlag:false,
      operationPopupLoadingFlag:false,
      operationColorMap: {
        "30_REJECTED": "danger",
        "10_NEW": "primary",
      },
      actionColorMap: {
        Approved: "success",
        Rejected: "danger",
        Delegate: "info",
        AddSign: "info",
        ApproveAndAddSign: "info",
      },
      approveResultMap: {
        Approved: "Approved",
        Rejected: "Rejected",
        AddSign: "Approved",
        ApproveAndAddSign: "Approved",
      },
      approvePopupFlag:false,
      approvePopupLoadingFlag:false,
      approveRecord:[],
      actionMeaningMap: {
        Approved: "Approved",
        Rejected: "Rejected",
        AddSign: "Approved",
        ApproveAndAddSign: "Approved",
      },
      returnFlag:0,
      nodeConfigIndexAbc:"",
      cacheKey:"",
      checkReceivePopupFlag:false,
      checkReceiveList:[],
      batchHandlePopupFlag:false,
      batchCount:0,
      batchCheckAllFlag:false,
      batchAction:"",
      editor: null,
      creation: "0",
      lineVisible: false,
      totalScore: null,
    };
  },
  computed:{
    getTenantNum() {
      return SrmUtil.getTenantNum();
    },
    batchButtonDisable() {
      let flag = true;
      if (this.checkReceiveList) {
        this.checkReceiveList.forEach((o) => {
          o.children.forEach((p) => {
            if (p["checkFlag"]) {
              flag = false;
            }
          });
        });
      }
      return flag;
    },
    getTopBtn() {
      return [
        {
          name: "estimate",
          text: this.$T("smbl.common.data.estimate").$D("单据评价"),
          type: "warn",
          size: "small",
          bordered: true,
          visible: true,
          icon: "icon-brand-messenger",
          callback: () => {
            this.scorePopupOpen();
          }
        },
        {
          name: "operating",
          text: this.$T("sinv.receipWorkbench.model.receipt.operating").$D("操作记录"),
          type: "primary",
          size: "small",
          bordered: true,
          visible: true,
          icon: "icon-clock",
          callback: () => {
            this.onOperationPopup();
          }
        },
        {
          name: "approved",
          text: this.$T("sinv.receiptExecution.model.receipt.approved").$D("审批记录"),
          type: "primary",
          size: "small",
          bordered: true,
          visible: true,
          icon: "icon-clock",
          callback: () => {
            this.onApprovePopup();
          }
        },
      ];
    },
    getButtons() {
      const { acceptStatus, cancelRemark = null } = this?.headDataSet?.data[0] || {};
      if (acceptStatus === "NEW" && this.editor === "1") {
        return [
          {
            text: $T("hzero.common.view.button.save").$D("保存"),
            bordered: true,
            handler: () => {
              this.saveOrSubmitbuildData("save");
            },
          },
          {
            text: $T("hzero.common.view.button.submit").$D("提交"),
            fill: true,
            handler: () => {
              this.saveOrSubmitbuildData("submit");
            },
          },
        ];
      } else if ([ "FINISHED" ].includes(acceptStatus)) {
        return [
          {
            text: $T("hzero.common.view.button.cancel").$D("取消"),
            fill: true,
            handler: () => {
              this.remarkDataSet.create({ cancelRemark: cancelRemark || null });
              this.showCancelPop = true;
            },
          },
        ];
      }
      if (this.creation === "1") {
        return [
          {
            text: $T("hzero.common.view.button.save").$D("保存"),
            fill: true,
            handler: () => {
              this.saveOrSubmitbuildData("save");
            },
          },
        ];
      }
      return [];
    },
    getCavcelButtons() {
      return [
        {
          text: $T("hzero.common.view.view.button").$D("取消"),
          bordered: true,
          handler: () => {
            this.showCancelPop = false;
          },
        },
        {
          text: $T("scux.acceptBench.model.view.soure").$D("确定"),
          fill: true,
          handler: () => {
            this.onHandleSoure();
          },
        },
      ];
    },
  },
  async beforeMount() {
    const { acceptHeaderId, creation, editor } = this.$route.query;
    this.editor = String(editor);
    this.creation = String(creation);
    this.acceptHeaderId = acceptHeaderId;
    this.refresh();
  },
  mounted() {
  },
  methods: {
    scorePopupOpen() {
      this.scorePopupFlag = true;
    },
    scorePopupCloseBefore() {
      if (this.scoreDataSet.dirty) {
        this.$dialog({
          content: this.$T("smbl.common.view.message.nowDataNotSave").$D("当前数据未保存，继续此操作将造成数据丢失，是否继续？"),
          onOk: () => {
            this.scoreDataSet.refresh();
            this.scorePopupFlag = !this.scorePopupFlag;
          },
          onCancel: () => {
            console.log("onCancel");
          }
        });
      } else {
        this.scorePopupFlag = false;
        return true;
      }
      return false;
    },
    refresh() {
      this.headDataSet.addPathParameter("acceptHeaderId", this.acceptHeaderId);
      this.lineDataSet.addPathParameter("acceptHeaderId", this.acceptHeaderId);
      // 新建进入的不查询
      if (this.creation === "1") {
        queryDepApi().then((res) => {
          this.headDataSet.create({ acceptDate: moment().format("YYYY-MM-DD 00:00:00"), approveEmployeeId: "", ...res });
        });
        return;
      }
      this.scoreDataSet.create({});
      this.scoreDataSet.addPathParameter("acceptHeaderId", this.acceptHeaderId);
      this.headDataSet.refresh();
      this.scoreDataSet.refresh();
      //行数据对头数据有依赖，行数据放到headDataSet查询后回调事件执行
      // this.lineDataSet.addPathParameter("acceptHeaderId", this.acceptHeaderId);
      this.lineDataSet.refresh();
    },
    // 删除
    async deleteRecord() {
      const body = { ...this.headDataSet?.data[0] || {}, ldjtAcceptLineList: this.lineDataSet?.toData() || [], ldjtAcceptScoreList: this.scoreDataSet?.toData() || [] };
      try {
        this.$loading.show();
        const res = await deleted(body);
        if (!res.failed) {
          this.$notification.open({
            message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
            duration: 1000,
          });
          this.$router.back();
        } else {
          this.$notification.open({
            message: res.message,
            duration: 2000,
          });
        }
      } finally {
        this.$loading.hide();
      }
    },
    //打开操作记录
    onOperationPopup() {
      this.operationPopupFlag = true;
      this.operationPopupLoadingFlag = true;
      getOperationRecord(this.acceptHeaderId).then((res) => {
        if (res.length > 0) {
          this.operationRecord = [];
          res.forEach((item) => {
            item.process = { text:item.processStatusMeaning, type:this.operationColorMap[item.processStatus] || "success" };
            this.operationRecord.push(item);
          });
        }
        this.operationPopupLoadingFlag = false;
      });
      this.operationPopupLoadingFlag = false;
    },
    //打开审批记录
    onApprovePopup() {
      this.approvePopupFlag = true;
      this.approvePopupLoadingFlag = true;
      getApproveRecord(this.acceptHeaderId).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          this.approveRecord = [];
          res[res?.length - 1].historicTaskExtList.forEach((item) => {
            const { name, action, actType, nodeStatus } = item;
            let nodeName = name;
            if (actType === "startEvent") {
              nodeName = this.$T("hwfp.common.status.start").$D("开始");
            } else if (actType === "endEvent") {
              nodeName = this.$T("hwfp.common.status.end").$D("结束");
            } else if (!action && !name) {
              nodeName = this.$T("hwfp.common.view.message.approvaling").$D("审批中");
            } else {
              // let text = this.actionMeaningMap[item.action] || this.$T("hwfp.common.view.message.approvaling").$D("审批中");
              let text = nodeStatus || this.$T("hwfp.common.view.message.approvaling").$D("审批中");
              let type = this.actionColorMap[item.action] || "info";
              item.action = { type, text };
            }
            item.nodeName = nodeName;
            this.approveRecord.push(item);
          });
        }
        this.approvePopupLoadingFlag = false;
      });
    },
    //沟通提交和保存数据
    async saveOrSubmitbuildData(type) {
      const validHeadFlag = this.headDataSet.validate();
      const validLineFlag = this.lineDataSet.validate();
      const validourceFlag = this.scoreDataSet.validate();
      if ((!validHeadFlag || !validourceFlag || !validLineFlag) && type !== "delete") {
        return;
      }
      const body = { ...this.headDataSet?.data[0] || {}, ldjtAcceptLineList: this.lineDataSet?.toData() || [], ldjtAcceptScoreList: this.scoreDataSet?.toData() || [] };
      try {
        this.$loading.show();
        if (type === "save") {
          const res = await save(body);
          if (res && !res.failed) {
            if (this.creation === "1") {
              this.editor = "1";
              this.creation = "0";
              this.acceptHeaderId = res.acceptHeaderId;
              // this.$router.push({
              //   name: "OrderReceipWorkbenchDetail",
              //   query: {
              //     acceptHeaderId: res.acceptHeaderId,
              //     editor: "1",
              //     creation: "0",
              //   }
              // });
              this.headDataSet.addPathParameter("acceptHeaderId", res.acceptHeaderId);
              this.lineDataSet.addPathParameter("acceptHeaderId", res.acceptHeaderId);
              this.scoreDataSet.addPathParameter("acceptHeaderId", res.acceptHeaderId);
              this.headDataSet.refresh();
              this.lineDataSet.refresh();
              this.scoreDataSet.refresh();
              return;
            }
            this.refresh();
            this.$notification.open({
              message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
              duration: 1000,
            });
          } else {
            this.$notification.open({
              message: res.message,
              duration: 2000,
            });
          }
        } else if (type === "submit") {
          const res = await submit(body);
          if (!res?.failed) {
            this.$notification.open({
              message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
              duration: 1000,
            });
            this.$router.back();
          } else {
            this.$notification.open({
              message: res.message,
              duration: 2000,
            });
          }
        }
      } finally {
        this.$loading.hide();
      }
    },
    //头字段
    getHeaderColumns() {
      return [ {
        fieldCode: "acceptNum",
      }, {
        fieldCode: "creationName",
        render:(val) => <span>{$T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人") + ": " + val}</span>
      } ];
    },
    // 确定取消的原因
    async onHandleSoure() {
      const validHeadFlag = this.remarkDataSet.validate();
      if (!validHeadFlag) {
        return;
      }
      const data = {
        ...this.headDataSet?.data[0] || {},
        ...this.remarkDataSet?.data[0] || {},
      };
      console.log(data, "onHandleSoure");
      try {
        this.$loading.show();
        cancelApi(data).then(() => {
          this.refresh();
        });
      } finally {
        this.showCancelPop = false;
        this.$loading.hide();
      }
    },
    // 附件上传成功后调用保存uuid
    getSaveAttachmentUuid() {
      const data = { ...this.headDataSet.toData()[0] };
      let that = this;
      getHeaderAttachmentUuidApi({
        asnHeaderId: data?.acceptHeaderId,
        objectVersionNumber: data?.objectVersionNumber,
        _token: data?._token,
        purchaseAttachmentUuid: data?.acceptAttachUuid,
      }).then((res) => {
        if (res && !res.failed) {
          that.commonDataSet.reset();
          that.commonDataSet.setData([ {
            ...data,
            purchaseAttachmentUuid: res?.acceptAttachUuid,
            objectVersionNumber: res?.objectVersionNumber,
          } ]);
        }
      });
    },
    clickDetailLineInfo(flag) {
      this.lineVisible = flag;
    },
    onTotalScoreChange() {
      const ldjtAcceptScoreList = this.scoreDataSet?.toData() || [];
      const totalAll = ldjtAcceptScoreList?.map((item) => {
        if (item?.score) {
          return Number(item.score);
        }
        return 0;

      });
      const sum = totalAll?.reduce((accumulator, currentValue) => accumulator + currentValue);
      this.headDataSet?.current?.set("totalScore", sum);
    }
  }
};
</script>

  <style lang="stylus" scoped>
  @import "~srm-mobile-ui/src/style/var.styl"
  .create-receive-detail-container {
    height 100vh;
    .create-receive-detail-scroll-el {
      height 100%;
      overflow-y scroll;
      overflow-x hidden;
      padding-bottom 80px;
      .create-receive-detail-button {
        margin-right 10px;
      }
      .override-btn-group {
        display: flex;
        >>> .srm-button {
          margin-right: 10px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  .create-receive-detail-define{
    height:100%;
    .create-receive-detail-define-button{
      position:relative;
      top:30px;
      margin-left:15px;
      margin-right:15px;
    }
  }
  .create-receive-detail-receive-check{
    .create-receive-detail-receive-check-title{
      height: 32px;
      background: #F6F6F6;
      align-items: center;
      display: flex;
      padding-left: 15px ;
      ont-family: PingFangSC-Medium;
      font-size: 12px;
      color: #333333;
      line-height: 16px;
      font-weight: 500;
    }
    .create-receive-detail-receive-check-list{
      height: 54px;
      align-items: center;
      display: flex;
      padding-left: 15px;
      border-bottom: #F6F6F6 solid 1px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #333333;
      //line-height: 22px;
      font-weight: 400;
    }
  }
  >>> .srm-upload{
    color:var(--font-color-white);
  }
  </style>
