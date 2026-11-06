<template>
  <div>
    <div v-if="loading"/>
    <div v-else>
      <nav-head :title="$T('hipspfm.expertScoring.view.message.title.ratingDetail').$D('评分详情')"/>
      <!-- 附件弹窗 -->
      <attached-file v-model="filePopup" :can-upload="false" :attachment-uuid="attachmentUuid" />
      <section class="headInfo">
        <div v-for="(li,index) in headInfo" :key="index" class="area">
          <div class="area-title">
            <customize :need-padding="true" :columns="getTitleInfoColumns" :data-source="li"/>
          </div>
          <srm-checkbox-group v-model="comfirmOrderList" :selection="Infinity">
            <div v-for="(item,indexA) in li.lineInfo" :key="indexA" style="width:100%">
              <div class="card">
                <srm-checkbox :content-selectable="true" :option="{value:item.evaluateScoreIds[0].toString(),disabled:!((showReRate && item.scoreStatus ==='SCORED' && sourceFrom ==='RFX')||(item.scoreStatus ==='SCORED' && sourceFrom ==='BID'))}">
                  <i>{{ item.supplierCompanyName }}</i>
                  <i
                    v-if="item.suggestInvalidFlag !== 0">{{ $T("hipspfm.expertScoring.model.bidHall.invalidTender").$D("无效投标") }}</i>
                </srm-checkbox>
              </div>
              <customize :need-padding="true" :columns="getLineInfoColumns" :data-source="item"/>
            </div>
          </srm-checkbox-group>
        </div>

        <div class="block"/>
      </section>

      <srm-popup
        :title="$T('ssrc.bidHall.view.title.scoreDetail').$D('评分明细')"
        :visible.sync="detailPop"
        rounded
        height="80%"
        position="bottom">
        <div class="supplier-content">
          <div v-for="(li,index) in lineInfoDetail" :key="index">
            <div v-if="li.indicateType ==='SCORE'">
              <customize :need-padding="true" :columns="getScoreInfoColumns" :data-source="li"/>
            </div>

            <div v-if="li.indicateType ==='PASS'">
              <customize :need-padding="true" :columns="getPASSInfoColumns" :data-source="li"/>
            </div>
          </div>
        </div>
      </srm-popup>
    </div>
    <srm-bottom-handler :btn-arr="getBtnArr" />
  </div>
</template>

<script>
import uuid from "uuid";
import AttachedFile from "@/components/File/AttachedFile";
import {
  getSectionExpertApi,
  getSectionRescoreApi,
  getSectionScoreLineApi,
  getSectionExpertLineApi,
  getSettingApi
} from "../api";
export default {
  modules: [ "hipspfm.expertScoring", "hipspfm.common", "ssrc.bidHall", "ssrc.expertScoring" ],
  name: "ReRatingDetail",
  components: {
    AttachedFile,
  },
  data() {
    return {
      comfirmOrderList: [], // 勾选中的值
      detailPop: false, // 评分明细弹出框
      filePopup: false, // 附件
      attachmentUuid: "", // 传到组件中的uuid
      lineInfoDetail: [], // 评分明细
      loading: true, // 加载
      headInfo: [], // 头信息
      sourceFrom: "", //寻源单据来源
      sourceHeaderId: "", //寻源单据头id
      showReRate:false
    };
  },
  computed:{
    getBtnArr() {
      return [
        {
          type:"danger",
          title: this.$T("ssrc.expertScoring.model.expertScoring.restartScore").$D("重新评分"),
          handler: this.reRating
        },
      ];
    },
    getTitleInfoColumns() {
      const columns = [
        {
          fieldCode: "expertName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{record.subAccount }-{val}</span>
              <span slot="right"
                class={record.scoredStatus === "SCORED" ? "font-gray" : "font-orange"}>{record.scoredStatusMeaning}</span>
            </SrmListHeader>
        },
        {
          fieldCode: "teamMeaning",
          fieldType: "EMPTY",
          render: (val) => <srm-tag size="small" type="primary">{val}</srm-tag>
        },
      ];
      return columns;
    },
    getLineInfoColumns() {
      const columns = [
        {
          fieldName:this.$T("ssrc.bidHall.view.title.scoreDetail").$D("评分明细"),
          fieldCode: "scoreDetail",
          render: (val, record) => <i
            class="font-blue"
            onClick={() => this.showDetailPop(record.evaluateScoreIds[0])}>{this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}</i>
        },
        {
          fieldName:this.$T("hipspfm.expertScoring.view.message.attachment").$D("附件"),
          fieldCode: "attachment",
          render: (val, record) => <i
            class="font-blue"
            onClick={() => this.showFilePop(record)}>{this.$T("ssrc.bidHall.view.message.button.view").$D("查看") }</i>
        },
        {
          fieldName:this.$T("hipspfm.expertScoring.view.message.approvalOpinion").$D("审批意见"),
          fieldCode: "remark",
          render: (val) => `${val ? val : this.$T("hipspfm.common.currency.none").$D("无")}`
        },
      ];
      return columns;
    },
    getScoreInfoColumns() {
      const columns = [
        {
          fieldCode: "indicateName",
          fieldType:"EMPTY",
          render: (val) => <SrmListHeader>
            {this.$T("ssrc.expertScoring.model.expertScoring.indicateName").$D("要素名称")}：{val}
          </SrmListHeader>
        },
        {
          fieldName:this.$T("hipspfm.expertScoring.view.message.scoring").$D("打分"),
          fieldCode: "indicScore",
        },
        {
          fieldName:this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          fieldCode: "weight",
          render:(val) => `${val}%`
        },
        {
          fieldCode: "realScore",
          fieldType:"EMPTY",
          render:(val) => <div>
            <span style={ { fontWeight:700 }}>{this.$T("ssrc.bidHall.model.bidHall.realScore").$D("实际得分")} : </span>
            <span style={ { color:"#276ef1" }}>{val}</span>
          </div>
        },
        {
          fieldName:this.$T("hipspfm.expertScoring.view.message.approvalOpinion").$D("审批意见"),
          fieldCode: "remark",
          render: (val) => `${val ? val : this.$T("hipspfm.common.currency.none").$D("无")}`
        },
      ];
      return columns;
    },
    getPASSInfoColumns() {
      const columns = [
        {
          fieldCode: "indicateName",
          fieldType:"EMPTY",
          render: (val) => <SrmListHeader>
            {this.$T("ssrc.expertScoring.model.expertScoring.indicateName").$D("要素名称")}：{val}
          </SrmListHeader>
        },
        {
          fieldCode: "passStatusMeaning",
          fieldType:"EMPTY",
          required:1,
          render:(val, record) => <div>
            <span>{this.$T("hipspfm.expertScoring.validation.message.confirmPass").$D("是否通过")}  : </span>
            <span class={record.passStatus === "APPROVED" ? "font-blue" : "font-red"}>{val}</span>
          </div>
        },
        {
          fieldName:this.$T("hipspfm.expertScoring.view.message.approvalOpinion").$D("审批意见"),
          fieldCode: "remark",
          render: (val) => `${val ? val : this.$T("hipspfm.common.currency.none").$D("无")}`
        },
      ];
      return columns;
    },
  },
  watch: {},
  mounted() {
    const { ["ExpertRating/getExpertRatingList"] : getExpertRatingList } = this.$store.getters;
    this.sourceFrom = getExpertRatingList.sourceFrom;
    this.sourceHeaderId = getExpertRatingList.sourceHeaderId;
    this.fetchData();
    this.getSetting();
  },
  methods: {
    // 展示附件弹出框
    showFilePop(item) {
      this.attachmentUuid = item.attachmentUuid || uuid();
      this.filePopup = !this.filePopup;
    },
    // 展示评分明细弹窗
    showDetailPop(value) {
      this.$loading.show();
      const params = {
        evaluateScoreIds: value
      };
      getSectionScoreLineApi(params).then((res) => {
        this.lineInfoDetail = res.scoreLineList;
        this.$loading.hide();
        this.detailPop = true;
      });
    },
    getSetting() {
      getSettingApi("011106").then((res) => {
        this.showReRate = res["011106"] && Number(res["011106"].settingValue);
      });
    },
    // 获取头信息
    fetchData() {
      this.loading = true;
      this.$loading.show();
      const params = {
        page: 0,
        size: 10
      };
      getSectionExpertApi(params, this.sourceHeaderId, this.sourceFrom).then(
        (res) => {
          this.headInfo = res.content;
          this.fetchLineInfoData();
        }
      );
    },
    wake(index, sourceFrom, sourceHeaderId, evaluateExpertId) {
      return new Promise((resolve) => {
        getSectionExpertLineApi(
          sourceFrom,
          sourceHeaderId,
          evaluateExpertId
        ).then((res) => {
          this.headInfo[index].lineInfo = res;
          resolve();
        });
      });
    },
    // 获取行信息
    fetchLineInfoData() {
      let promiseArr = [];
      this.headInfo.map((item, index) => {
        let temp = this.wake(
          index,
          item.sourceFrom,
          item.sourceHeaderId,
          item.evaluateExpertList[0].evaluateExpertId
        );
        promiseArr.push(temp);
      });
      Promise.all(promiseArr)
        .then(() => {
          this.$loading.hide();
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    reRating() {
      // eslint-disable-next-line consistent-this
      const self = this;
      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.dialog.confirm({
        content:
          this.$T(
            "hipspfm.expertScoring.validation.message.confirmReRating"
          ).$D("确定进行重新评分") + "?",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          if (self.comfirmOrderList.length === 0) {
            self.$notification.open({
              message:self.$T("hipspfm.expertScoring.view.message.selectOneData").$D("请至少勾选一条数据"),
              key,
              class:"notification",
            });
          } else {
            const params = {};
            const ids = self.comfirmOrderList.map((item) => item.value);
            params.evaluateScoreIds = ids;
            getSectionRescoreApi(params).then((res) => {
              if (res && res.failed) {
                self.$notification.open({
                  message:self.$T("hipspfm.expertScoring.view.message.reRatingFailed").$D("重新评分失败"),
                  description: res.message,
                  key,
                  class:"notification",
                });
              } else {
                self.$notification.open({
                  message:self.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
                  class:"notification",
                  key,
                });
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.block {
  height: 89px;
}
.headInfo {
  .area {
    .area-title {
      height: 54px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background: var(--color-bg-default-b);
    }

    .card {
      padding-left:15px;
      padding-bottom:10px;
      padding-top:10px;
      display: flex;
      align-items: center;
    }
  }
}

.font-gray {
  color: var(--color-font-default-e);
}

.font-orange {
  color: var(--color-other-default-c);
}

.font-blue {
  color: var(--color-other-default-b);
}

.font-red {
  color: var(--color-other-default);
}
>>> .srm-check-box-content{
  margin-left:10px;
}
</style>
