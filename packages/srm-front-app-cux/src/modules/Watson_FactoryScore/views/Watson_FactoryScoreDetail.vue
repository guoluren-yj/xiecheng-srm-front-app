<template>
  <div>
    <srm-tooltip class="tooltip-content" :title="$T('scux.common.view.scoringRoules').$D(`N/A- 不参与评分;\n1分- 差（不符合公司要求）;2分- 一般（部分达到公司要求）;3分- 合格（达到公司要求）;4分- 比较好（部分超出公司要求）;5分- 很好（超出公司要求）`)" placement="top">
      <srm-button size="small" type="info">{{ $T("scux.common.button.scoringRoules").$D("评分规则") }}</srm-button>
    </srm-tooltip>
    <div style="height: calc(100vh - 124px); overflow: scroll">
      <div v-for="(item) in data" :key="item.provisionId" class="score-container">
        <div v-if="(item.indexScore.includes(1)||item.indexScore.includes(2))&&(!item.remarks||item.fileList.length === 0)" class="error-msg" >
          <span>
            {{ $T("scux.common.view.message.span.scoreBelow").$D("评分低于3分需要") }} {{ !item.remarks ? $T("sslm.common.view.message.rate").$D("上传评论") : '' }} {{ item.fileList.length === 0 ? $T("sslm.common.view.message.upload").$D("上传附件") : '' }}
          </span>
        </div>
        <div class="score-content">
          <srm-list-header style="margin: 16px 0">
            <span>{{ item.indexName }}</span>
          </srm-list-header>
          <div class="score-list">
            <div class="score-left">
              <srm-checkbox-group v-model="item.indexScore" class="override-check-group" :selection="Number(1)" content-selectable>
                <srm-checkbox :option="Number(0)">N/A</srm-checkbox>
                <srm-checkbox :option="Number(1)">1</srm-checkbox>
                <srm-checkbox :option="Number(2)">2</srm-checkbox>
                <srm-checkbox :option="Number(3)">3</srm-checkbox>
                <srm-checkbox :option="Number(4)">4</srm-checkbox>
                <srm-checkbox :option="Number(5)">5</srm-checkbox>
              </srm-checkbox-group>
            </div>
            <div class="score-right">
              <srm-button size="mid" fill @click="score(item)">
                {{ $T("sinv.common.view.message.button.rate").$D("评价") }}
              </srm-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="position: fixed;bottom: 0px;width: 100%;">
      <srm-button size="x-large" fill bordered @click="scoreStore">
        {{ $T("sinv.common.view.message.button.rate").$D("评价") }}
      </srm-button>
    </div>

    <!-- 评价弹框 -->
    <srm-popup
      :visible.sync="visible"
      :title="title"
      height="100%"
      position="right"
      :show-back="false"
      :show-close="false">
      <slot slot="left" name="left">
        <span @click="closePop('save')">{{ $T("hipspfm.common.button.confirm").$D("确认") }}</span>
      </slot>
      <slot slot="right" name="right">
        <span @click="closePop('')">{{ $T("hipspfm.common.button.close").$D("关闭") }}</span>
      </slot>
      <rate v-if="visible" :data="rataData" @saveRate="save"/>
    </srm-popup>
  </div>
</template>

<script>
import { scoreApi } from "../api";
import Rate from "../component/rate.vue";
import uuid from "uuid";
import { $T } from "srm-mobile-ui";
export default {
  modules: [ "smbl.common", "hipspfm.common", "sinv.common", "sslm.common", "scux.common" ],
  name: "WatsonStoreScoreDetail",
  components: { Rate },
  props: {
    list: {
      type: Array
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      data: [],
      scorePop: false,
      visible: false,
      rataData: {},
      editData: {},
    };
  },
  watch: {
    data: {
      handler(val) {
        let item = [];
        let f = false;
        val.map((res) => {
          if (res["indexScoreCopy"][0] === 0 && res["indexScoreCopy"][0] !== res["indexScore"][0]) {
            item.push({
              ...res,
              indexScoreCopy: [ ...res["indexScore"] ]
            });
            f = true;
          } else if (res["indexScoreCopy"][0] !== 0 &&
            res["indexScore"][0] !== 0 &&
            res["indexScoreCopy"][0] !== res["indexScore"][0] ||
            res["indexScore"][0] === 0 && res["indexScoreCopy"][0] !== 0) {
            item.push({
              ...res,
              indexScoreCopy: [ ...res["indexScore"] ],
              remarks: "",
              fileList: [],
              attachmentUuid: uuid(),
            });
            f = true;
          } else {
            item.push(res);
          }
        });
        if (f) {
          this.data = [ ...item ];
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.data = [ ...this.list ];
  },
  methods: {
    async score(item) {
      this.visible = true;
      this.rataData = { ...item };
    },
    closePop(name = "") {
      this.visible = false;
      let list = [];
      if (name === "save") {
        this.data.map((item) => {
          if (item.provisionId === this.rataData.provisionId && item.indexCode === this.rataData.indexCode) {
            list.push({
              ...this.rataData,
              ...this.editData,
            });
          } else {
            item["indexScoreCopy"] = [ ...item["indexScore"] ];
            list.push(item);
          }
        });
        this.data = [ ...list ];
        this.rataData = {};
      } else {
        this.data.map((item) => {
          if (item.provisionId === this.rataData.provisionId && item.indexCode === this.rataData.indexCode) {
            if (this.editData["fileList"].length === 0 && this.editData["attachmentUuid"] === this.rataData["attachmentUuid"]) {
              list.push({
                ...this.rataData,
                fileList: [],
              });
            } else {
              item["indexScoreCopy"] = [ ...item["indexScore"] ];
              list.push(item);
            }
          } else {
            item["indexScoreCopy"] = [ ...item["indexScore"] ];
            list.push(item);
          }
        });
        this.data = [ ...list ];
        this.rataData = {};
      }
    },
    save(val) {
      this.editData = { ...val };
    },
    scoreStore() {
      let params = [];
      let flag = false;
      this.data.map((item) => {
        // 评分了，未上传评价内容和附近不允许提交评价
        if (item.indexScore[0] === 1 || item.indexScore[0] === 2) {
          if (!item.remarks || item.fileList.length === 0) {
            flag = true;
          }
          if (item.remarks && item.fileList.length !== 0) {
            params.push({
              provisionId: item.provisionId,
              supplierId: item.supplierId || "",
              supplierCode: item.supplierCode || "",
              supplierName: item.supplierName || "",
              tenantId: item.tenantId || "",
              secondCategoryId: item.secondCategoryId || "",
              secondCategoryCode: item.secondCategoryCode || "",
              secondCategoryName: item.secondCategoryName || "",
              indexCode: item.indexCode || "",
              indexName: item.indexName || "",
              categoryScore: item.categoryScore || "", // 品类得分
              remarks: item.remarks || "",
              attachmentUuid: item.attachmentUuid,
              rater: item.rater || "",
              scoreDate: item.scoreDate,
              storeTemplate: item.storeTemplate,
              indexScore: String(item.indexScore[0]), // 指标得分
            });
          }
        } else if (item.indexScore[0] > 2) {
          params.push({
            provisionId: item.provisionId,
            supplierId: item.supplierId || "",
            supplierCode: item.supplierCode || "",
            supplierName: item.supplierName || "",
            tenantId: item.tenantId || "",
            secondCategoryId: item.secondCategoryId || "",
            secondCategoryCode: item.secondCategoryCode || "",
            secondCategoryName: item.secondCategoryName || "",
            indexCode: item.indexCode || "",
            indexName: item.indexName || "",
            categoryScore: item.categoryScore || "", // 品类得分
            remarks: item.remarks || "",
            attachmentUuid: item.attachmentUuid,
            rater: item.rater || "",
            scoreDate: item.scoreDate,
            storeTemplate: item.storeTemplate,
            indexScore: String(item.indexScore[0]), // 指标得分
          });
        }
      });
      if (flag) {
        this.$notification.open({
          message: $T("scux.common.view.message.msgPromptLanguage").$D("您有低于3分的评分未上传备注和附件，请上传"),
          duration: 2000,
        });
        return;
      }
      if (params.length > 0) {
        this.$loading.show();
        scoreApi(params).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 3000,
            });
          } else {
            this.$notification.open({
              message: $T("scux.common.view.message.scoreSuccess").$D("评分成功"),
              duration: 1000,
            });
            setTimeout(() => {
              this.$emit("close");
            }, 500);
          }
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        this.$notification.open({
          message: $T("scux.common.view.message.pleaseScore").$D("请评分"),
          duration: 1000,
        });
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
>>> .customize-item {
  margin-top: 0px !important;
}

.override-check-group {
  flex-direction: row;
  width: 100%;
  >>> .srm-check-box-content {
    margin-left: 6px;
    font-size: 14px;
  }
}
.override-check-group-2 {
  flex-direction: row;
  padding: 24px 0px 24px 19px;
  >>> .srm-check-box-content {
    margin-left: 6px;
    font-size: 14px;
  }
  border-bottom: 8px solid #f5f5f5;
}
.score-container {
  width: 100%;
  .error-msg {
    padding-left: 15px;
    height: 32px;
    width: 100%;
    background: #FFEFED;
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
      color: #E11900;
    }
  }
  .score-content {
    padding-left: 15px;
    // padding-bottom: 15px;
    width: 100%;
    border-bottom: 8px solid #f5f5f5;
    >>> .srm-list-item-card-head-left {
      max-width: 100% !important;
      white-space: pre-wrap !important;
    }
  }

  .score-list {
    border-top: 1px solid #f5f5f5;
    padding: 10px 15px 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // flex: 1;
    .score-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
    }
    .score-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}

.score-word {
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  font-size: 12px;
  color: #333333;
  border-bottom: 1px solid #f5f5f5;
}

.srm-upload-filename {
  font-size 12px;
  margin 5px 5px 0 5px;
  max-width 100%;
  word-break: break-all;
  overflow: hidden;
  white-space nowrap;
  text-overflow ellipsis;
}

.tooltip-content {
  margin-left: 40%;
  margin-right: -40%;
  margin-top: 4px;
}

</style>