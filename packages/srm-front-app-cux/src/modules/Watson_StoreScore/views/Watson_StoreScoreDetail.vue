<template>
  <div>
    <srm-tooltip class="tooltip-content" :title="$T('scux.common.view.scoringRoules').$D(`N/A- 不参与评分;\n1分- 差（不符合公司要求）;2分- 一般（部分达到公司要求）;3分- 合格（达到公司要求）;4分- 比较好（部分超出公司要求）;5分- 很好（超出公司要求）`)" placement="top">
      <srm-button size="small" type="info">{{ $T("scux.common.button.scoringRoules").$D("评分规则") }}</srm-button>
    </srm-tooltip>
    <div style="height: calc(100vh - 124px); overflow: scroll">
      <div style="padding: 10px 15px 0px 15px">
        <srm-search
          v-model="lovParams"
          :field="[
            {
              fieldType: 'TEXT',
              fieldCode: 'supplierName',
              fieldName: $T('scux.common.model.list.supplier').$D('供应商'),
            },
          ]"
          :placeholder="$T('scux.common.model.list.supplier').$D('供应商')"
          @search="handleSearch"
          @clear="handleSearch"/>
      </div>
      <div v-for="(item) in data" :key="item.poLineId" class="score-container">
        <div v-if="(item.orderScore.includes(1)||item.orderScore.includes(2))&&(!item.remarks||item.fileList.length === 0)" class="error-msg" >
          <span>
            {{ $T("scux.common.view.message.span.scoreBelow").$D("评分低于3分需要") }}  {{ !item.remarks ? $T("sslm.common.view.message.rate").$D("上传评论") : '' }} {{ item.fileList.length === 0 ? $T("sslm.common.view.message.upload").$D("上传附件") : '' }}</span>
        </div>
        <div class="score-content">
          <srm-list-header>
            <span>{{ item.categorySecondaryName }}</span>
          </srm-list-header>
          <srm-flex direction="column" align="start">
            <srm-flex-item flex="1" style="margin-bottom: 10px;">
              <span style="font-size: 14px;color: #333333;">{{ item.categoryThreeName }}</span>
              <a style="font-size: 12px;padding-left: 8px;" @click="scoreOrder(item)">{{ $T("scux.common.view.message.span.orderDetails").$D("订单详情") }}</a>
            </srm-flex-item>
            <srm-flex-item flex="1" style="margin-bottom: 16px;">
              <span style="font-size: 14px;color: #333333;">{{ item.supplierName }} - {{ item.orderNumber }}</span>
            </srm-flex-item>
          </srm-flex>
          <div class="score-list">
            <div class="score-left">
              <srm-checkbox-group v-model="item.orderScore"
                                  class="override-check-group"
                                  :selection="Number(1)">
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
import orderDs from "../datasource/orderDs";
import Rate from "../component/rate.vue";
import uuid from "uuid";
import { $T, DataSet } from "srm-mobile-ui";
import { getDataByCeApi } from "../api";
export default {
  modules: [ "smbl.common", "scux.common", "sslm.common", "sinv.common", "hipspfm.common" ],
  name: "WatsonStoreScoreDetail",
  components: { Rate },
  props: {
    list: {
      type: Array
    },
    title: {
      type: String,
    },
    attributeVarchar10: {
      type: String,
    },
  },
  data() {
    return {
      data: [],
      orderDs: new DataSet(orderDs()),
      scorePop: false,
      visible: false,
      rataData: {},
      editData: {},
      lovParams: {
        supplierName: "",
      },
      timer: null,
    };
  },
  watch: {
    data: {
      handler(val) {
        let item = [];
        let f = false;
        val.map((res) => {
          if (res["orderScoreCopy"][0] === 0 && res["orderScoreCopy"][0] !== res["orderScore"][0]) {
            item.push({
              ...res,
              orderScoreCopy: [ ...res["orderScore"] ]
            });
            f = true;
          } else if (res["orderScoreCopy"][0] !== 0 &&
            res["orderScore"][0] !== 0 &&
            res["orderScoreCopy"][0] !== res["orderScore"][0] ||
            res["orderScore"][0] === 0 && res["orderScoreCopy"][0] !== 0) {
            item.push({
              ...res,
              orderScoreCopy: [ ...res["orderScore"] ],
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
    getData() {
      this.$loading.show();
      getDataByCeApi({
        attributeVarchar10: this.attributeVarchar10,
        orderScore: "N/A",
        ...this.lovParams,
      }).then((res) => {
        let list = this.jsonByData(res.content);
        this.$loading.hide();
        this.data = [ ...list ];
      }).finally(() => {
        this.timer = null;
        this.$loading.hide();
      });
    },
    // 防抖搜索
    handleSearch() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(this.getData, 600);
    },
    jsonByData(list) {
      let dd = [];
      list.map((res) => {
        if (res.poLineList && res.poLineList.length > 0) {
          res.poLineList.map((item) => {
            dd.push({
              scoreNumber: res.scoreNumber || "",
              scoreType: "2",
              poHeaderId: res.poHeaderId || "",
              orderNumber: res.poNum || "",
              supplierId: res.supplierId || "",
              supplierCode: res.supplierCode || "",
              supplierName: res.supplierName || "",
              releaseDate: res.releasedDate || "",
              poLineId: item.poLineId || "",
              categorySecondary: item.categoryBySecondCode || "",
              categorySecondaryName: item.categoryBySecondName || "",
              categoryThree: item.categoryByThirdCode || "",
              categoryThreeName: item.categoryByThirdName || "",
              attachmentUuid: item.attachmentUUID || uuid(),
              remarks: "",
              orderScore: [ 0 ],
              orderScoreCopy: [ 0 ],
              fileList: [],
            });
          });
        }
      });
      return dd;
    },
    async scoreOrder(item) {
      this.orderDs.setQueryParameter({
        poNum: item.orderNumber,
        categoryName: item.categoryThreeName,
        organizationName: item.organizationName,
      });
      this.detailPop = this.$popup({
        title: `${item.categorySecondaryName}-${item.categoryThreeName}`,
        showHeader: true,
        showClose: true,
        showBack: true,
        height: "100vh",
        position: "right",
        onClose: () => {
          this.orderVisible = false;
          this.orderDs.setData([]);
        },
        content:
          <SrmList dataSet={this.orderDs} columns={this.getColumns()} />
      });
    },
    getColumns() {
      return [
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "quantity",
        },
      ];
    },
    async score(item) {
      this.visible = true;
      this.rataData = { ...item };
    },
    closePop(name = "") {
      this.visible = false;
      let list = [];
      if (name === "save") {
        this.data.map((item) => {
          if (item.poLineId === this.rataData.poLineId) {
            list.push({
              ...this.rataData,
              ...this.editData,
            });
          } else {
            item["orderScoreCopy"] = [ ...item["orderScore"] ];
            list.push(item);
          }
        });
        this.data = [ ...list ];
        this.rataData = {};
      } else {
        this.data.map((item) => {
          if (item.poLineId === this.rataData.poLineId) {
            if (this.editData["fileList"].length === 0 && this.editData["attachmentUuid"] === this.rataData["attachmentUuid"]) {
              list.push({
                ...this.rataData,
                fileList: [],
              });
            } else {
              item["orderScoreCopy"] = [ ...item["orderScore"] ];
              list.push(item);
            }
          } else {
            item["orderScoreCopy"] = [ ...item["orderScore"] ];
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
        if (item.orderScore[0] === 1 || item.orderScore[0] === 2) {
          if (!item.remarks || item.fileList.length === 0) {
            flag = true;
          }
          if (item.remarks && item.fileList.length !== 0) {
            params.push({
              scoreNumber: item.scoreNumber || "",
              scoreType: item.scoreType || "",
              poHeaderId: item.poHeaderId || "",
              orderNumber: item.orderNumber || "",
              supplierId: item.supplierId || "",
              supplierCode: item.supplierCode || "",
              supplierName: item.supplierName || "",
              releaseDate: item.releaseDate || "",
              poLineId: item.poLineId || "",
              categorySecondary: item.categorySecondary || "",
              categorySecondaryName: item.categorySecondaryName || "",
              categoryThree: item.categoryThree || "",
              categoryThreeName: item.categoryThreeName || "",
              attachmentUuid: item.attachmentUuid || "",
              remarks: item.remarks || "",
              orderScore: String(item.orderScore[0]),
            });
          }
        } else if (item.orderScore[0] > 2) {
          params.push({
            scoreNumber: item.scoreNumber || "",
            scoreType: item.scoreType || "",
            poHeaderId: item.poHeaderId || "",
            orderNumber: item.orderNumber || "",
            supplierId: item.supplierId || "",
            supplierCode: item.supplierCode || "",
            supplierName: item.supplierName || "",
            releaseDate: item.releaseDate || "",
            poLineId: item.poLineId || "",
            categorySecondary: item.categorySecondary || "",
            categorySecondaryName: item.categorySecondaryName || "",
            categoryThree: item.categoryThree || "",
            categoryThreeName: item.categoryThreeName || "",
            attachmentUuid: item.attachmentUuid || "",
            remarks: item.remarks || "",
            orderScore: String(item.orderScore[0]),
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
          let errMsg = [];
          if (res && res.length > 0) {
            res.map((item) => {
              if (item.errorFlag === 1) {
                errMsg.push(item.errorMessage);
              } else {
                let index = this.data.findIndex((val) => val.poLineId === item.poLineId);
                if (index > -1) {
                  this.data.splice(index, 1);
                }
              }
            });
          }
          if (errMsg.length > 0) {
            this.$notification.open({
              message: errMsg.join(","),
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
    padding-top: 16px;
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