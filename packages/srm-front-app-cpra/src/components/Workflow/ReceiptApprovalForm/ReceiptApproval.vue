<template>
  <section v-if="loading" class="mainDetail">
    <div ref="wrapper" class="contentWrap wrapper">
      <srm-scroll-tab class="content" >
        <srm-scroll-tab-item :label="$T('sinv.common.model.common.acceptanceHedaer').$D('验收单头信息')">
          <div ref="headInfo" class="infoContent headInfo">
            <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
              <span>{{ $T("hipspfm.workFlowReceipt.view.message.noReceiptHeadInfo").$D("暂无验收单头信息") }}</span>
            </div>
            <ul v-else>
              <!-- 个性化组件替换后的代码 -->
              <customize :columns="getHeadColumns" :data-source="headInfo" type="list" code="SMBL.WORKFLOW.RECEIPT_APPROVAL.HEAD" />
            </ul>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('sinv.common.model.common.acceptanceLine').$D('验收单行信息')">
          <div ref="lineInfo" class="infoContent lineInfo">
            <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.workFlowReceipt.view.message.noAcceptanceLine").$D("暂无验收单行信息") }}</span>
            </div>
            <div>
              <div v-for="(item,index) in lineInfo" :key="index" @click="showLineInfoDetail(item)">
                <!-- <div @click="showLineInfoDetail()"> -->
                <div class="headCompany">
                  <span class="block"/>
                  <span class="code">
                    <span class="materiel-name">{{ item.itemName }}</span>
                    <span>{{ $T("sinv.common.model.common.asnLineNum").$D("行号") }}：{{ item.lineNum }}</span>
                  </span>
                </div>
                <ul>
                  <!-- 个性化改造 -->
                  <customize :columns="getLineColumns" :data-source="item" type="list" code="SMBL.WORKFLOW.RECEIPT_APPROVAL.LINE" />
                </ul>
                <div class="footInfo">
                  <span>{{ $T("sinv.common.model.common.acceptOpinionCodeMeaning").$D("验收意见") }}:</span>
                  <span>{{ item.acceptOpinionCodeMeaning }}</span>
                </div>
              </div>
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 行信息详情弹窗 -->
    <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="bottom">
      <section class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closeLineInfoDetail">
            <img class="image-gray-default" src="@/assets/Comp/icon_close_normal@3x.png" alt >
          </div>
          <div slot="center" class="header">{{ $T("hipspfm.workFlowReceipt.view.title.acceptanceDeatil").$D("验收单明细") }}</div>
        </hips-nav-bar>
        <div class="lineHead">
          <li>
            <span>
              <span>{{ $T("sinv.common.model.common.asnLineNum").$D("行号") }}: {{ lineInfoDetail.lineNum }}</span>
            </span>
          </li>
          <p>
            <span>{{ $T("sinv.common.model.common.itemCode").$D("物料编码") }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T("sinv.common.model.common.itemName").$D("物料名称") }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div v-if="headInfo.sourceCode == 'CONTRACT' || headInfo.sourceCode == ''" class="lineBody">
          <customize-detail :columns="getLineDetailColumns" :data-source="lineInfoDetail" type="list" code="SMBL.WORKFLOW.RECEIPT_APPROVAL.LINE_DETAIL" />
          <div class="line-div">
            <span class="line-block"/>
          </div>
        </div>
      </section>
    </hips-popup>
  </section>
</template>

<script>
import uuid from "uuid";
import { Popup, NavBar } from "hips";
import {
  getReceiptOrderHeadInfoApi,
  getReceiptOrderLineInfoApi,
} from "./api";

export default {
  modules: [ "hipspfm.workFlowReceipt", "sinv.common", "entity.item" ],
  name: "ReceiptApproval",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  filters: {
    calculatePeople: function(data) {
      if (data && data.length > 1) {
        return data.join(",");
      } else if (data && data.length === 1) {
        return data[0];
      }
      return "";

    }
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      loading:false,
      scroll: "",
      show: false,
      navIndex: 0,
      lineInfoDetail: {},
    };
  },
  computed:{
    getHeadColumns() {
      let columns = [
        {
          fieldName: this.$T("sinv.common.model.common.acceptanceNum").$D("验收单号"),
          fieldCode: "acceptListNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.clientCompany").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.supplierCompanyName").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.acceptanceType").$D("验收类型"),
          fieldCode: "acceptListTypeName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.acceptanceSourceNum").$D("验收单据来源"),
          fieldCode: "sourceCodeMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.creator").$D("创建人"),
          fieldCode: "createByName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.acceptanceCreator").$D("验收人"),
          fieldCode: "acceptorNameList",
          render: (val) => val.toString()
        },
        {
          fieldName: this.$T("sinv.common.model.common.acceptDate").$D("验收日期"),
          fieldCode: "acceptDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.acceptanceDeatil").$D("验收详细情况"),
          fieldCode: "acceptDetails",
        }
      ];
      return columns;
    },
    getLineColumns() {
      return [
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.common.model.common.acceptQuantity").$D("本次验收数量"),
          fieldCode: "acceptQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
          fieldCode: "uomName",
        }
      ];
    },
    getLineDetailColumns() {
      let columns = [];
      columns.push({
        fieldName: this.$T("hipspfm.workFlowReceipt.model.workFlowReceipt.pcNum").$D("协议编号"),
        fieldCode: "pcNum",
      });
      columns.push({
        fieldName: this.$T("hipspfm.workFlowReceipt.model.workFlowReceipt.pcName").$D("协议名称"),
        fieldCode: "pcName",
      });
      columns.push({
        fieldName: this.$T("entity.item.type").$D("物料类别"),
        fieldCode: "itemCategoryName",
      });
      columns.push({
        fieldName: this.$T("sinv.common.model.common.unit").$D("单位"),
        fieldCode: "uomName",
      });
      columns.push({
        fieldName: this.$T("sinv.common.model.common.quantity").$D("数量"),
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
      });
      columns.push({
        fieldName: this.$T("sinv.common.model.common.acceptQuantity").$D("本次验收数量"),
        fieldCode: "acceptQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
      });
      columns.push({
        fieldName: this.$T("sinv.common.model.common.acceptOpinionCodeMeaning").$D("验收意见"),
        fieldCode: "acceptOpinionCodeMeaning",
      });
      columns.push({
        fieldName: this.$T("hipspfm.workFlowReceipt.model.workFlowReceipt.pcTypeName").$D("协议类型"),
        fieldCode: "pcTypeName",
      });
      columns.push({
        fieldName: this.$T("hipspfm.workFlowReceipt.model.workFlowReceipt.modelA").$D("规格"),
        fieldCode: "model",
      });
      columns.push({
        fieldName: this.$T("hipspfm.workFlowReceipt.model.workFlowReceipt.modelB").$D("型号"),
        fieldCode: "model",
      });
      columns.push({
        fieldName: this.$T("hipspfm.workFlowReceipt.model.workFlowReceipt.deliverDate").$D("交付日期"),
        fieldCode: "deliverDate",
      });
      columns.push({
        fieldName: this.$T("sinv.common.model.common.remark").$D("备注"),
        fieldCode: "remark",
      });

      return columns;
    }
  },
  watch: {},
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getReceiptOrderHead();
        await this.getReceiptOrderLine();
        this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowReceipt.view.title.receiptApproval").$D("验收单审批"));
  },
  methods: {
    // 获取验收单头信息
    async getReceiptOrderHead() {
      await getReceiptOrderHeadInfoApi(this.changeReqId).then((res) => {
        console.log("headinfo test ...", res);
        this.headInfo = res || {};
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        this.$emit("GetAttachmentUuid", attachmentUuid);
      });
    },
    //获取验收单行信息
    async getReceiptOrderLine() {
      await getReceiptOrderLineInfoApi(this.changeReqId).then((res) => {
        if (res && !res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.show = true;
      }, 150);
    },
    closeLineInfoDetail() {
      this.show = false;
    },
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color: var(--color-font-default);
}

.closeFont {
  color: #414660 !important;
  border-color: #414660 !important;
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #82879E;
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color: var(--color-font-default);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
          content: '';
        }
      }
    }
  }

  .contentWrap {
    font-family: PingFangSC-Medium;
    .content {
      .headInfo {
        ul {
          padding-left: 20px;
          margin-bottom: 12px;
          font-family: auto;
        }
        >>> .customize-item-field {
          color: var(--color-font-default);
        }
      }

      .moreInfo {
        align-self: flex-end;
        width: 18.3px;
        height: 18.3px;
      }

      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 235px;
        }

        .materialCode {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
          font-size: 14px;
          display: flex;
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            width: 80px;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 11px;
          margin: 14px 0 3px 20px;
          border-bottom: 1px solid var(--color-border-default);
          padding-right: 20px;

          // line-height: 26px;
          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: #00CFC2;
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color: var(--color-font-default);
            line-height: 24px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-font-default-e);
              text-align: right;
              line-height: 22px;
              font-weight: bold;
            }
          }
        }
      }

      .lineInfo {
        ul {
          padding-left: 20px;
          font-family: auto;

          // li:nth-last-child(1) {
          //   padding-bottom: 11px;
          //   border-bottom: 1px solid var(--color-border-default);
          // }

          // li {
          //   display: flex;
          //   align-items: center;
          //   padding: 9px 20px 0 0;
          //   margin-bottom: 2px;

          //   span {
          //     flex: 1;
          //     font-family: PingFangSC-Regular;
          //     font-size: 14px;
          //     color: var(--color-font-default);
          //     line-height: 22px;
          //   }
          // }
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FFFFFF;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .left-button {
    // margin-left: 20px;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: #fff;
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color: var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  .lineBody {
    background-color: #FFFFFF;
    overflow: auto;
    padding-left: 20px;

    // li {
    //   display: flex;
    //   padding: 20px 20px 11px 0;
    //   margin-bottom: 2px;
    //   margin-left: 20px;
    //   border-bottom: 1px solid var(--color-border-default);

    //   &:nth-of-type(1) {
    //     padding-top: 20px;
    //   }

    //   span {
    //     font-family: PingFangSC-Regular;
    //     font-size: 14px;
    //     color: var(--color-font-default);
    //     line-height: 22px;

    //     &:nth-child(1) {
    //       width: 98px;
    //     }

    //     &:nth-child(2) {
    //       color: #82879E;
    //       display: inline-block;
    //       width: 237px;
    //       text-align: left;
    //       word-wrap: break-word;
    //       word-break: break-all;

    //       img {
    //         width: 12px;
    //         height: 12px;
    //         float: right;
    //         margin-top: 4px;
    //       }
    //     }
    //   }
    // }

    .line-div {
      height: 34px;
      display: flex;
      justify-content: center;

      .line-block {
        width: 35.7%;
        height: 6px;
        // border-radius:100px;
        // background-color : #000000;
        position: relative;
        bottom: -18px;
      }
    }
  }
}

.invite {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  background: #FFFFFF;
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    font-weight: bold;
    border-right: 1px solid var(--color-border-default);
    font-family: PingFangSC-Medium;
    font-size: 18px;
    letter-spacing: 0.34px;
  }

  span:nth-child(1) {
    color: #82879E;
  }

  span:nth-child(2) {
    color: #FF6B6B;
  }

  span:nth-child(3) {
    color: #00CFC2;
  }
}
</style>
