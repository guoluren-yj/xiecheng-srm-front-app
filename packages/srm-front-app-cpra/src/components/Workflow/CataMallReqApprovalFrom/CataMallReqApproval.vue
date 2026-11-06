<template>
  <div>
    <section v-if="headInfo" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <srm-scroll-tab-item :label="$T('hipspfm.workFlowCata.model.common.orderHeaderInfo').$D('采购申请汇总信息')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="JSON.stringify(headInfo) === '[]'" class="noContent">
                <span>{{ $T("hipspfm.common.view.message.title.noOrderHeaderInfo").$D("暂无订单头信息") }}</span>
              </div>
              <ul v-else style="padding: 16px 15px">
                <customize :columns="getHeaderColumns"
                           :data-source="headInfo"
                           code="SMBL.WORKFLOW.CATA_MALL_REQ.HEADER"/>
              </ul>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item :label="$T('hipspfm.workFlowCata.model.common.purchaseLineInfo').$D('采购申请明细信息')">
            <div ref="lineInfo" class="infoContent lineInfo">
              <div v-if="JSON.stringify(lineInfo) === '[]'" class="noContent">
                <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
              </div>
              <div v-for="(item,index) in lineInfo" :key="index" class="card-personalized" @click="showLineInfoDetail(item,index)">
                <div class="headCompany">
                  <span class="block"/>
                  <span class="code">
                    <span class="materiel-name">{{ item.productName }}（{{ $T("sprm.common.model.common.productName").$D("商品名称") }}）</span>
                    <span>{{ $T("sprm.common.model.common.lineNumber").$D("行号") }}：{{ item.lineNum }}</span>
                  </span>
                </div>
                <ul>
                  <!-- 个性化组件替换后的代码 -->
                  <customize :columns="getLineColumns" :data-source="item"
                             code="SMBL.WORKFLOW.CATA_MALL_REQ.LINE"/>
                </ul>
                <div class="footInfo">
                  <span>{{ $T("sprm.common.model.common.needDate").$D("需求日期") }}:</span>
                  <span>{{ item.neededDate|CalcDate }}</span>
                </div>
              </div>
            </div>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>
      <!-- 行信息详情弹窗 -->
      <cata-req-line-detail v-model="orderLineDetailPopup" :line-info-detail="lineInfoDetail" :show-file-pop="showFilePop"/>
    </section>
  </div>
</template>

<script>
import CataReqLineDetail from "./components/CataReqLineDetail";
import { getCataReqHeaderApi, getCataReqLineApi } from "./api";
import uuid from "uuid";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.workFlowCata", "sprm.purchaseReqCreation", "hipspfm.common", "sprm.common", "entity.organization", "entity.company", "entity.attachment" ],
  name: "CataMallReqApproval",
  components: {
    CataReqLineDetail,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    topHeight: {
      type: Number,
      default: 0
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      uuid:"",
      scroll: "",
      navIndex: 0,
      orderLineDetailPopup: false,
      contentLenArr: [],
      lengthArr: [],
      lineInfoDetail: {},
      currentIndex: "",
      headInfo: {},
      lineInfo: []
    };
  },
  computed: {
    getHeaderColumns() {
      const columns = [
        {
          fieldName: this.$T("sprm.common.model.common.prNum").$D("采购申请编号"),
          fieldType: "TEXT",
          fieldCode: "displayPrNum",
        },
        {
          fieldName: this.$T("sprm.common.model.common.lotNum").$D("批次号"),
          fieldType: "TEXT",
          fieldCode: "lotNum",
        },
        {
          fieldName: this.$T("sprm.common.model.common.sqType").$D("申请类型"),
          fieldType: "TEXT",
          fieldCode: "prTypeName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
          fieldCode: "amount",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.headerPriceHiddenFlag === 1) {
              return item.amountMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createByName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.companyName").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("entity.organization.class.purchase").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purchaseOrgName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaseAgentName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
          fieldType: "TEXT",
          fieldCode: "prSourcePlatformMeaning",
        },
        {
          fieldName: this.$T("sprm.common.model.common.applicant").$D("申请人"),
          fieldType: "TEXT",
          fieldCode: "prRequestedName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.buyType").$D("采购品类"),
          fieldType: "TEXT",
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.requestDate").$D("申请日期"),
          fieldType: "TEXT",
          fieldCode: "requestDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];

      return columns;
    },
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sprm.common.model.common.categoryName").$D("物料分类"),
          fieldType: "TEXT",
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.uomName").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sprm.common.model.common.linePrice").$D("行金额"),
          fieldCode: "taxIncludedLineAmount",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedLineAmountMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价（含税）"),
          fieldCode: "taxIncludedUnitPrice",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedUnitPriceMeaning;
            }
            return Number(SrmUtil.getNumberLocalized(val, length));
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxRate").$D("税率"),
          fieldType: "TEXT",
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sprm.common.model.common.currencyCode").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
        },
      ];

      return columns;
    },
    getNavArr() {
      let navArr = [
        {
          title: this.$T(
            "hipspfm.workFlowCata.model.common.orderHeaderInfo"
          ).$D("采购申请汇总信息"),
          ref: "headInfo"
        },
        {
          title: this.$T("hipspfm.workFlowCata.model.common.purchaseLineInfo").$D(
            "采购申请明细信息"
          ),
          ref: "lineInfo"
        }
      ];
      return navArr;
    }
  },
  watch: {},
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getOrderHeader();
        await this.getOrderLine();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("sprm.purchaseReqCreation.view.catelog.approve.submit").$D("目录化需求提交审批")
    );
    this.uuid = uuid();
  },
  methods: {
    // 显示行信息详情
    showLineInfoDetail(data, index) {
      this.orderLineDetailPopup = true;
      data.index = index;
      this.lineInfoDetail = data;
    },
    //获取订单头信息
    async getOrderHeader() {
      const params = {
        customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.HEADER"
      };
      const headInfo = await getCataReqHeaderApi(this.changeReqId, params);
      this.headInfo = headInfo;
      let attachmentUuid = this.headInfo.attachmentUuid || uuid();
      this.$emit("GetAttachmentUuid", attachmentUuid);
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      const params = {
        customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.SRM_LINE,SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.LINE_ECOMMERCE,SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.SRM_CATALOGUE",
        page: 0,
        size: 1000,
      };
      await getCataReqLineApi(this.changeReqId, params).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
  }
};
</script>

<style scoped lang="stylus">
.blackFont {
  color: var(--color-font-default);
}

.closeFont {
  color: var(--color-font-default-c) !important;
  border-color: var(--color-font-default-c) !important;
}

.mainDetail {
  overflow visible;

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
        color: var(--color-font-default-b);
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
    overflow visible;
    // height: calc(100vh - 260px);

    .content {
      .headInfo {
        ul {
          padding-left: 20px;
        }

        & ul li {
          margin-bottom: 8px;
          padding: 9px 10px 14px 0;
          border-bottom: 1px solid var(--color-border-default);
          display: flex;
          align-items: baseline;

          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: var(--color-font-default);
            line-height: 22px;
          }

          span:nth-child(1) {
            flex: 0 1 126px;
          }

          span:nth-child(2) {
            flex: 0 1 209px;
            color: var(--color-font-default-b);
          }
        }

        & ul li:nth-child(1) {
          padding: 20px 20px 11px 0;

          span:nth-child(1) {
            flex: 0 1 126px;
          }
        }

        & ul li:nth-child(1) span:nth-child(2) {
          flex: 0 1 190.7px;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        & ul li:nth-last-child(1) {
          border-bottom: 0;
          margin-bottom: 1px;
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
            background-color: var(--color-other-default-b);
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

          li:nth-last-child(1) {
            padding-bottom: 11px;
            border-bottom: 1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 9px 20px 0 0;
            margin-bottom: 2px;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: var(--color-font-default);
              line-height: 22px;
            }
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  background: var(--color-bg-default);
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
    background-color: var(--color-font-default-d);
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
    background-color: var(--color-font-default-d);
    overflow: auto;

    ul {
      padding: 20px 20px 11px 20px;
    }

    li {
      display: flex;
      padding: 20px 20px 11px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom: 1px solid var(--color-border-default);

      &:nth-of-type(1) {
        padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;

        &:nth-child(1) {
          width: 122px;
        }

        &:nth-child(2) {
          color: var(--color-font-default-b);
          display: inline-block;
          width: 213px;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;

          img {
            width: 12px;
            height: 12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }

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
</style>
