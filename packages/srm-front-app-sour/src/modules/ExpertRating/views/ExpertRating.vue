<template>
  <div>
    <div v-show="!loading">
      <nav-head :title="$T('hipspfm.expertScoring.view.message.title.ratingDetail').$D('评分详情')"/>
      <div class="container">
        <!-- 附件弹窗 -->
        <attached-file v-if="sourceType==='rating'" v-model="filePopup" :attachment-uuid="headerInfo.attachmentUuid" title="hipspfm.common.message.uploadAttanchment" :can-upload="true"/>
        <attached-file v-else v-model="filePopup" :attachment-uuid="headerInfo.attachmentUuid" />
        <section class="headInfo">
          <div class="area">
            <customize-detail
              :need-padding="true"
              :columns="getHeaderColumns"
              :data-source="headerInfo"/>
          </div>
          <div v-for="(li,index) in lineInfo" :key="index" class="area">
            <customize :need-padding="true" :columns="getIndicateTypeColumns(index)" :data-source="li"/>
            <!-- 打分制 -->
            <div v-if="li.indicateType==='SCORE'" class="area-content">
              <div class="area-label-title">
                <span>{{ li.indicateName }}-{{ li.indicateCode }}</span>
              </div>
              <div v-if="JSON.stringify(li.evaluateScoreLineDetailS)!=='[]'">
                <div
                  v-for="(item,i) in li.evaluateScoreLineDetailS"
                  :key="i"
                  class="area-label-content">
                  <customize :columns="getEvaluateScoreLineDetailColumns" :data-source="item"/>
                </div>
              </div>
              <div v-else>
                <div class="area-label-content">
                  <customize :columns="getNoEvaluateScoreLineDetailColumns" :data-source="li"/>
                </div>
              </div>
              <div class="area-label-footer">
                <srm-tag size="small" type="primary">{{ $T("ssrc.bidHall.model.bidHall.weight").$D("权重") }}：{{ li.weight }}%</srm-tag>
                <span
                  v-if="JSON.stringify(li.evaluateScoreLineDetailS)!=='[]'">{{ $T("ssrc.bidHall.model.bidHall.summary").$D("小计") }}：{{ li.indicScore }}</span>
              </div>
            </div>
            <!-- 通过制 -->
            <div v-else class="area-content">
              <div class="area-label-content">
                <customize :columns="getPassColumns" :data-source="li"/>
              </div>
            </div>
          </div>
        </section>
        <srm-bottom-handler v-if="sourceType==='rating'" :btn-arr="getBtnArr" />
      </div>
    </div>
  </div>
</template>

<script>
import uuid from "uuid";
import AttachedFile from "@/components/File/AttachedFile";
import { numberInputCheck } from "@/utils/index";
import {
  postScoreIndicApi,
  getExpertRatingLineApi,
  getExpertRatingHeaderApi
} from "../api";

export default {
  modules: [ "hipspfm.common", "hipspfm.expertScoring", "ssrc.bidHall", "ssrc.expertScoring", "hipspfm.invoiceInspection", "smbl.common" ],
  name: "ExpertRating",
  components: {
    AttachedFile,
  },
  data() {
    return {
      loading: false,
      filePopup: false, // 附件
      headerInfo: {}, // 单头信息
      lineInfo: [], // 要素信息
      evaluateScoreIds: "", //   评估分数
      supplierId: "", // 供应商公司id
      quotationHeaderId: "", // 报价头id
      sourceFrom: "", //寻源单据编码
      attachmentUUid: "", // 附件
      sourceType: "", //类型
      sourceHeaderId: "", //寻源单据头id
      expertUserId: "", // 专家id
      expertSequenceNum: "", //当前专家轮次
      // passStatus:false, // 通过开关值
      currentSequenceNum: "" //当前评分伦次
    };
  },
  computed: {
    getBtnArr() {
      return [
        {
          type:"primary",
          title: this.$T("hipspfm.common.button.save").$D("保存"),
          handler: this.save
        },
      ];
    },
    getHeaderColumns() {
      const columns = [
        {
          fieldCode: "companyName",
          fieldType: "EMPTY",
          render: (val, record) => <div>
            {record.companyNum ? `${val}（${record.companyNum}）` : val}
          </div>
        },
        {
          fieldName:this.$T("hipspfm.expertScoring.validation.message.invalidTender").$D("建议无效投标"),
          fieldCode: "suggestInvalidFlag",
          fieldType:this.sourceType === "rating" ? "SWITCH" : "TEXT",
          render: (val) => <div class={this.sourceType === "checking" ? "font-red" : ""}>
            {val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")}
          </div>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.attachment").$D("附件"),
          fieldCode: "attachment",
          render: () => <i onClick={this.showFilePop}>
            <img style="width:24px;height:24px" src={require("@/assets/attached_file@3x.png")} />
          </i>
        },
        {
          fieldName: this.$T("hipspfm.expertScoring.view.message.approvalOpinion").$D("审批意见"),
          fieldCode: "expertSuggestion",
          fieldType: "TEXT_AREA",
          disabled:this.sourceType !== "rating",
          placeholder: this.sourceType !== "rating" && !this.headerInfo.expertSuggestion ? this.$T("hipspfm.common.currency.none").$D("无") : this.$T("hipspfm.expertScoring.message.validation.approvedRemark").$D("请输入审核意见")
        },
      ];
      return columns;
    },
    getIndicateTypeColumns() {
      return (index) => {
        const columns = [
          {
            fieldCode: "indicateTypeMeaning",
            fieldType: "EMPTY",
            formRow:0,
            render: (val, record) => <SrmListHeader showOpenTag={false}>
              <span style="margin-right:5px">{val}</span>
              <srm-tag size="small" type="primary">{record.teamMeaning}</srm-tag>
              {record.indicateType === "SCORE" && index === 0 &&
              <span slot="right">{this.$T("ssrc.expertScoring.view.message.aggregate").$D("总计")}：{record.sumIndicScore}</span>
              }
            </SrmListHeader>
          },
        ];
        return columns;
      };

    },
    getEvaluateScoreLineDetailColumns() {
      const columns = [
        {
          fieldCode: "indicateName",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.indicateDetail").$D("要素细项")
        },
        {
          fieldCode: "scoreRange",
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.scoreRange").$D("打分区间"),
          render:(val, record) => <span>[{ record.minScore === null ? "-" : record.minScore},{!record.maxScore ? "-" : record.maxScore}]</span>
        },
        {
          fieldCode: "weight",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          render:(val) => <span>{val}%</span>
        },
        {
          fieldCode: "indicScore",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.supplierScore").$D("供应商分数"),
          fieldType:this.sourceType === "rating" ? "INPUT" : "TEXT",
          disabled:(val, record) => record.calculateType === "AUTO",
          required:1,
          inputChange:(val, record) => this.numberInputCheckDefault(record, "indicScore")
        },
      ];
      return columns;
    },
    getNoEvaluateScoreLineDetailColumns() {
      const columns = [
        {
          fieldCode: "scoreRange",
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.scoreRange").$D("打分区间"),
          render:(val, record) => <span>[{ record.minScore === null ? "-" : record.minScore},{!record.maxScore ? "-" : record.maxScore}]</span>
        },
        {
          fieldCode: "weight",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          render:(val) => <span>{val}%</span>
        },
        {
          fieldCode: "indicScore",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.supplierScore").$D("供应商分数"),
          fieldType:this.sourceType === "rating" ? "INPUT" : "TEXT",
          disabled:(val, record) => record.calculateType === "AUTO",
          required:1,
          inputChange:(val, record) => this.numberInputCheckDefault(record, "indicScore")
        },
        {
          fieldCode: "remark",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.expertSuggestion").$D("专家意见"),
          fieldType:"INPUT",
          visible:this.sourceType === "rating" && this.sourceFrom === "BID"
        },
      ];
      return columns;
    },
    getPassColumns() {
      const columns = [
        {
          fieldCode:"indicateName",
          fieldType:"EMPTY",
          render:(val, record) => <span>{val}-{record.indicateCode}</span>
        },
        {
          fieldCode: "passStatus",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.pass").$D("是否通过"),
          fieldType:this.sourceType === "rating" ? "SWITCH" : "TEXT",
          render:(val, record) => record.passStatusMeaning
        },
        {
          fieldCode: "remark",
          fieldName:this.$T("ssrc.bidHall.model.bidHall.expertSuggestion").$D("专家意见"),
          fieldType:"INPUT",
          visible:this.sourceType === "rating" && this.sourceFrom === "BID"
        },
      ];
      return columns;
    },
    canUpload() {
      if (this.sourceFrom === "rating") {
        return true;
      }
      return false;
    }
  },
  watch: {},
  mounted() {
    const {
      evaluateScoreIds,
      supplierCompanyId,
      quotationHeaderId,
      currentSequenceNum,
      sourceType
    } = this.$route.query;
    this.evaluateScoreIds = evaluateScoreIds[0] || "";
    this.supplierId = supplierCompanyId;
    this.quotationHeaderId = quotationHeaderId;
    this.currentSequenceNum = currentSequenceNum;
    this.sourceType = sourceType;
    const {
      expertSequenceNum,
      sourceHeaderId,
      sourceFrom,
      expertUserId
    } = this.$store.getters["ExpertRating/getExpertRatingList"];
    this.expertSequenceNum = expertSequenceNum;
    this.sourceHeaderId = sourceHeaderId;
    this.sourceFrom = sourceFrom;
    this.expertUserId = expertUserId;
    this.fetchData();
    this.fetchLineInfoData();
  },
  methods: {
    // 展示附件弹出框
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    // 获取头数据
    fetchData() {
      this.loading = true;
      this.$loading.show();
      const params = {
        page: 0,
        size: 10,
        evaluateScoreIds: this.evaluateScoreIds,
        supplierId: this.supplierId
      };
      getExpertRatingHeaderApi(
        params,
        this.quotationHeaderId,
        this.sourceFrom
      ).then((res) => {
        this.headerInfo = res || {};
        this.$loading.hide();
        this.loading = false;
        if (!this.headerInfo.attachmentUuid) {
          this.headerInfo.attachmentUuid = uuid();
        }
      });
    },
    fetchLineInfoData() {
      this.$loading.show();
      const params = {
        expertUserId: this.expertUserId,
        expertSequenceNum: this.expertSequenceNum,
        sourceFrom: this.sourceFrom,
        evaluateScoreIds: this.evaluateScoreIds
      };
      getExpertRatingLineApi(params, this.sourceHeaderId).then((res) => {
        this.lineInfo = res;
        this.lineInfo.map((item) => {
          if (item.passStatus) {
            // eslint-disable-next-line default-case
            switch (item.passStatus) {
            case "APPROVED":
              item.passStatus = true;
              break;
            case "NO_APPROVED":
              item.passStatus = false;
              break;
            }
          } else {
            //为null时默认赋值false
            item.passStatus = false;
          }
        });
        this.$loading.hide();
      });
    },
    save() {
      // indicScore
      let minScoreFlag = false;
      let maxScoreFlag = false;
      // 只有打分制才校验评分区间，所以把打分制过滤出来
      const newLineInfo = this.lineInfo?.filter((n) => n.indicateType === "SCORE") || [];
      newLineInfo.map((item) => {
        if (item.evaluateScoreLineDetailS.length > 0) {
          item.evaluateScoreLineDetailS.map((itemLine) => {
            if (itemLine.minScore && itemLine.minScore !== null && typeof itemLine.minScore !== "undefined") {
              if (itemLine.indicScore < itemLine.minScore) {
                minScoreFlag = true;
              }
            }
            if (itemLine.maxScore && itemLine.maxScore !== null && typeof itemLine.maxScore !== "undefined") {
              if (itemLine.indicScore > itemLine.maxScore) {
                minScoreFlag = true;
              }
            }
          });
        } else {
          if (item.minScore && item.minScore !== null && typeof item.minScore !== "undefined") {
            if (item.indicScore < item.minScore) {
              minScoreFlag = true;
            }
          }
          if (item.maxScore && item.maxScore !== null && typeof item.maxScore !== "undefined") {
            if (item.indicScore > item.maxScore) {
              minScoreFlag = true;
            }
          }
        }

        // if (item.passStatus || !item.passStatus) {
        //   // eslint-disable-next-line default-case
        //   switch (item.passStatus) {
        //   case true:
        //     item.passStatus = "APPROVED";
        //     item.passStatusMeaning = this.$T("hipspfm.common.message.pass").$D("通过");
        //     break;
        //   case false:
        //     item.passStatus = "NO_APPROVED";
        //     item.passStatusMeaning = this.$T("hipspfm.common.message.noPass").$D("不通过");
        //     break;
        //   }
        // }
      });
      if (minScoreFlag || maxScoreFlag) {
        this.$notification.open({
          message: this.$T("smbl.common.validation.noBetweenScoreRange").$D("分数不在打分区间内"),
          key,
          class: "notification",
          duration: 3
        });
        return;
      }
      // delete this.lineInfo.passStatus;
      let params = {
        evaluateScoreDTO: this.headerInfo,
        evaluateScoreLineDTOList: this.lineInfo,
        sourceFrom: this.sourceFrom
      };
      params.evaluateScoreDTO = {
        ...params.evaluateScoreDTO,
        expertUserId: this.expertUserId,
        quotationHeaderId: this.quotationHeaderId,
        currentSequenceNum: this.expertSequenceNum,
        suggestInvalidFlag:this.suggestInvalidFlag ? 1 : 0,
      };
      let verify = true;
      params.evaluateScoreLineDTOList.map((item) => {
        if (JSON.stringify(item.evaluateScoreLineDetailS) !== "[]" && item.evaluateScoreLineDetailS !== null) {
          item.evaluateScoreLineDetailS.map((element) => {
            if (
              item.indicateType === "SCORE" &&
              (element.indicScore === "undefined" ||
                element.indicScore === null || !element.indicScore)
            ) {
              this.$notification.open({
                message: this.$T("hipspfm.common.validation.enterRequired").$D("请填写必填项") + "!",
                key,
                class: "notification",
                duration: 3
              });
              verify = false;
            }
          });
        } else {
          console.log("1234");
          if (
            item.indicateType === "SCORE" &&
            (item.indicScore === "undefined" || item.indicScore === null || !(item.indicScore || item.indicScore === 0))
          ) {
            this.$notification.open({
              message: this.$T("hipspfm.common.validation.enterRequired").$D(
                "请填写必填项"
              ) + "!",
              key,
              class: "notification",
              duration: 3
            });
            verify = false;
          }
        }
      });
      if (verify) {
        this.$notification.open({
          message: this.$T("hipspfm.invoiceInspection.view.message.saving").$D(
            "保存中"
          ),
          description: "",
          key,
          class: "notification",
          duration: 3
        });
        const name = "ExpertRatingDetail";
        const newParams = {
          ...params,
          evaluateScoreLineDTOList: params.evaluateScoreLineDTOList.map((ele) => {
            if (ele.passStatus || ele.passStatus === "true") {
              return {
                ...ele,
                passStatus: "APPROVED",
                passStatusMeaning: this.$T("hipspfm.common.message.pass").$D("通过"),
              };
            }
            return {
              ...ele,
              passStatus: "NO_APPROVED",
              passStatusMeaning: this.$T("hipspfm.common.message.noPass").$D("不通过"),
            };
          })
        };
        postScoreIndicApi(newParams, this.sourceHeaderId).then((res) => {
          if (res.failed) {
            this.$notification.open({
              message: this.$T("smbl.common.message.save.error").$D("保存失败"),
              description: res.message,
              key,
              class: "notification",
              duration: 2
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.save.success").$D("保存成功"),
              key,
              class: "notification",
              duration: 2
            });
            // eslint-disable-next-line consistent-this
            const _this = this;
            setTimeout(() => {
              _this.$router.replace({ name });
            }, 2000);
          }
        });
      }
    },
    numberInputCheckDefault(v, t) {
      numberInputCheck(v, t);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../../style/mixin.styl';
.container{
  height:calc(100vh - 75px);
  overflow:auto;
}
.headInfo {
  .area {
    padding-top: 10px;
    border-bottom: 8px solid var(--color-border-default);
    .area-content {
      .area-label-title {
        margin-bottom: 8px;

        span {
          margin-left: 15px;
          position: relative;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: var(--color-font-default);
          line-height: 20px;
        }
      }
      .area-label-footer {
        display: flex;
        justify-content: space-between;
        padding: 0px 15px 12px 15px;
        align-items: center;

        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 10px;
          color: var(--color-other-default-b);
          line-height: 16px;
          padding: 2px 4px;
          background: var(--color-bg-default-c);
          border-radius: 2px;
          display: inline-block;
          height: 20px;
        }

        span:nth-child(2) {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: var(--color-font-default-b);
          text-align: right;
        }
      }
    }

    .font-red {
      color: var(--color-other-default) !important;
    }
  }
}
.area-label-content {
  margin: 12px 15px;
}
</style>
