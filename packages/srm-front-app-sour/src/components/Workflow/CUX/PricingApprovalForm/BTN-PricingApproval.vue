<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section v-if="headInfo" class="mainDetail">
    <div ref="navWrap" class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in getNavArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="$changeNav(index)">
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <div ref="headInfo" class="infoContent headInfo last-no-border">
          <h3>{{ $T("hipspfm.workFlow.view.message.checkPriceInfo").$D("核价单信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.workFlow.view.message.noCheckPriceInfo").$D("暂无核价单信息") }}</span>
          </div>
          <div v-else @click="showReaultDetail(headInfo)">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">{{ headInfo.companyName }}</span>
            </div>
            <ul>
              <li>
                <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.round").$D("轮次") }}：{{ headInfo.roundNumber }}</span>
              </li>
              <li>
                <span>{{ $T("ssrc.inquiryHall.view.message.button.bidNum").$D("寻源单编号") }}：{{ headInfo.rfxNum }}</span>
              </li>
              <li>
                <span>{{ $T("hipspfm.pricingApproval.model.header.typeOfInquiry").$D("询价单类型") }}：{{ headInfo.attributeVarchar1Meaning }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.inquiryTitle").$D("询价单标题") }}：{{ headInfo.rfxTitle }}</span>
            </div>
          </div>
          <div v-if="JSON.stringify(headInfo) !== '{}'">
            <div @click="toGBarChartPriceCompar">
              <span class="span-title">{{ $T("hipspfm.pricingApproval.view.message.title.PriceComparisonAssistant").$D("比价助手") }}：</span>
              <span class="span-compare">{{ $T("hipspfm.pricingApproval.view.message.title.PriceComparisonAssistant").$D("比价助手") }}</span>
            </div>
          </div>
        </div>

        <div ref="categoryInfo" class="infoContent lineInfo">
          <h3>{{ $T("hipspfm.workFlow.view.message.itemLineInfo").$D("物料行信息") }}</h3>
          <div v-if="JSON.stringify(categoryInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.workFlow.view.message.noItemLineInfo").$D("暂无物料行信息") }}</span>
          </div>
          <div v-else>
            <hips-collapse v-model="activeName">
              <hips-collapse-item v-for="(item,index) in categoryInfo" :key="index" :name="index">
                <div slot="title">
                  <div class="collapse-title-a">
                    <span
                      v-if="item.showAttachment"
                      class="look-file"
                      @click.stop="showFilePop(item.attachmentUuid||uuid)">{{ $T("hipspfm.common.button.viewAttachments").$D("查看附件") }}</span>
                    <span class="head-code">{{ item.itemCode }}-{{ item.itemName }}</span>
                  </div>
                  <div class="collapse-title-b">
                    <span>{{ $T("ssrc.inquiryHall.model.inqueryHall.displayLineNum").$D("行号") }}：{{ item.rfxLineItemNum }}</span>
                    <span>{{ $T("ssrc.inquiryHall.model.inqueryHall.quantity").$D("数量") }}：{{ item.rfxQuantity }}{{ item.uomName }}</span>
                    <span>{{ item.taxIncludedFlag === 1 ? $T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率(%)")+'：'+item.taxRate:(item.taxIncludedFlag === 0?$T("ssrc.inquiryHall.model.inquiryHall.noTaxRate").$D("不含税"):'') }}</span>
                    <span>{{ item.selectionStrategyMeaning }}</span>
                  </div>
                </div>
                <div slot="right-icon" class="right-icon">
                  <img class="image-gray-default" src="@/assets/icon_list_right_normal@3x.png" >
                </div>
                <div>
                  <div
                    v-for="(li,key) in item.quotationDetail"
                    :key="key"
                    class="collapse-info infoContent headInfo"
                    @click="showSupplierQuotationDetail(li)">
                    <div class="headCompany">
                      <span class="block"/>
                      <span class="code">{{ li.companyName }}</span>
                    </div>
                    <ul>
                      <li>
                        <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.isSuggestedFlag").$D("是否选用") }}：{{ li.suggestedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(li.suggestedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
                        <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.taxInclude").$D("是否含税") }}：{{ li.taxIncludedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(li.taxIncludedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
                      </li>
                      <li>
                        <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.unitPrice").$D("单价") }}：{{ li.validQuotationPrice }}</span>
                        <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率(%)") }}：{{ li.taxRate }}</span>
                      </li>
                      <li>
                        <span>{{ $T("hipspfm.pricingApproval.model.line.doesNotTaxTheUnitPrice").$D("未税单价") }}：{{ li.baseNetPrice }}</span>
                      </li>
                      <li>
                        <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量") }}：{{ li.allottedQuantity }}</span>
                      </li>
                      <li>
                        <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.reason").$D("选用理由") }}：{{ li.suggestedRemark }}</span>
                      </li>
                    </ul>
                    <div class="footInfo">
                      <span>{{ $T("ssrc.supplierQuotation.model.supQuo.currentQuotationRemark").$D("报价说明") }}：{{ li.currentQuotationRemark }}</span>
                    </div>
                  </div>
                </div>
              </hips-collapse-item>
            </hips-collapse>
          </div>
        </div>
      </div>
    </div>

    <pricing-result-detail
      v-model="pricingResultDetailPop"
      :change-req-id="changeReqId"
      :pricing-result-detail="pricingResultDetail"
      :show-file-pop="showFilePop"/>

    <b-t-n-supplier-quotation-detail
      v-model="supplierQuotationDetailPop"
      :supplier-quotation-detail="supplierQuotationDetail"
      :show-file-pop="showFilePop"/>
    <srm-popup :visible="chartFlag" :title="$T('hipspfm.pricingApproval.view.message.title.PriceComparisonAssistant').$D('比价助手')" :show-back="true" :show-close="true" height="100%" position="right" @onClose="toGBarChartPriceCompar()">
      <div class="btn-pricing-approval-chart">
        <div class="lineInfoDetail">
          <div class="titleContext">
            <span class="spanFirst">{{ $T("ssrc.inquiryHall.model.inquiryHall.newQuotationPicture").$D("最新报价柱形图") }}</span>
          </div>
          <div class="chart">
            <div id="container"/>
          </div>
        </div>
      </div>
    </srm-popup>
  </section>
</template>

<script>
import uuid from "uuid";
import BScroll from "better-scroll";
import { NavBar, Collapse, CollapseItem, View, Input, Popup } from "hips";
import PricingResultDetail from "./components/PricingResultDetail";
import BTNSupplierQuotationDetail from "./components/BTN-SupplierQuotationDetail";
import {
  getBTNPricingItemInfoApi,
  getPricingOrderHeadApi,
  getPricingSupplierQuotationApi,
  getAttachedFileApi
} from "./api/Sw";
import { Bar } from "@antv/g2plot";

export default {
  modules: [ "hipspfm.workFlow", "hipspfm.pricingApproval", "ssrc.inquiryHall", "hipspfm.common", "ssrc.supplierQuotation" ],
  name: "BTNPricingApproval",
  components: {
    PricingResultDetail,
    BTNSupplierQuotationDetail,
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
  },
  filters: {},
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
      categoryInfo: [], //供应商分类信息
      scroll: "",
      navIndex: 0,
      lengthArr: [],
      contentLenArr: [],
      activeName: [],
      uuid: "",
      filePopup: false,
      pricingResultDetail: {}, // 核价结果明细
      pricingResultDetailPop: false, // 核价结果明细弹窗
      supplierQuotationDetail: {}, // 供应商报价明细
      supplierQuotationDetailPop: false, // 供应商报价明细弹窗
      dataList:[], //比价助手数据集
      roateFlag: true,
      chartFlag:false,
      title:"",
      barName:"",
    };
  },
  computed: {
    getNavArr() {
      let navArr = [
        {
          title: this.$T("hipspfm.workFlow.view.message.checkPriceInfo").$D(
            "核价单信息"
          ),
          ref: "headInfo"
        },
        {
          title: this.$T("hipspfm.workFlow.view.message.itemLineInfo").$D(
            "物料行信息"
          ),
          ref: "categoryInfo"
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
        await this.getPricingOrderHead();
        await this.getPricingItemInfo();
        await this.getMoreData();
        await this.getAttachedFile();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.pricingApproval.view.message.title.checkPriceApproval").$D(
        "寻源核价审批"
      )
    );
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.$refreshScroll();
      this.scroll.on("scroll", this.handlerScroll);
    });
    this.uuid = uuid();
  },
  methods: {
    //跳转比价助手页面
    toGBarChartPriceCompar() {
      //代码整理，删除图表文件GroupeBarChart.vue，代码移至此处
      console.log("toGBarChartPriceCompar", this.chartFlag);
      this.chartFlag = !this.chartFlag;
      // this.title = this.$T("hipspfm.pricingApproval.view.message.title.PriceComparisonAssistant").$D("比价助手");
      // this.barName = this.$T("ssrc.inquiryHall.model.inquiryHall.newQuotationPicture").$D("最新报价柱形图");
      // console.log("toGBarChartPriceCompar", this.dataList);
      // const data = this.dataList;
      // console.log("creat-Chart", data);
      // this.$router.push({
      //   name: "GroupedBarChart",
      //   query: { dataList:this.dataList, title:this.$T("hipspfm.pricingApproval.view.message.title.PriceComparisonAssistant").$D("比价助手"), barName:this.$T("ssrc.inquiryHall.model.inquiryHall.newQuotationPicture").$D("最新报价柱形图") }
      // });
    },
    // 获取核价单头信息
    async getPricingOrderHead() {
      const params = {
        customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.HEADER_INFO"
      };
      await getPricingOrderHeadApi(this.changeReqId, params).then((res) => {
        this.headInfo = res;
        // let attachmentUuid = degradeAttachmentLines;
        this.$emit("GetAttachmentUuid", res.checkAttachmentUuid);
      });
    },
    // 获取核价物料信息
    async getPricingItemInfo() {
      const params = {
        page: 0,
        size: 500,
        rfxHeaderId: this.changeReqId,
        customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ITEM_DTL"
      };
      await getBTNPricingItemInfoApi(params).then((res) => {
        if (res && !res.empty) {
          this.categoryInfo = res.content;
          let length = this.categoryInfo.length - 1;
          const pushIndex = () => {
            this.activeName.push(length);
            if (length <= 0) {
              return;
            }
            length--;
            pushIndex();

          };
          pushIndex();
        }
      });
    },
    //构造柱状图数据
    buildBarData(data) {
      if (data && !data.empty) {
        let element = {
          xData:data.validQuotationPrice,
          // itemCode:item.itemCode+"-"+item.itemName,
          yData:data.itemName,
          name:data.companyName,
        };
        this.dataList.push(element);
        //代码整理，删除图表文件GroupeBarChart.vue，代码移至此处
        const stackedBarPlot = new Bar("container", {
          data:this.dataList,
          isGroup: true,
          xField: "xData",
          yField: "yData",
          seriesField: "name",
          // autoFit:true,
          //柱状图宽度占比 [0-1]
          // barWidthRatio:0.3,
          height:500,
          // 设置颜色
          color: [ "#3473FF", "#FFFF00", "#FC7735", "#00FFFF", "#F709C7", "#00FF00", "#FF0033", "#E6BD1A", "#808080" ],
          // 设置间距
          marginRatio: 0,
          label: {
            autoRotate:true,
            // 可手动配置 label 数据标签位置
            position: "middle", // 'top', 'middle', 'bottom'
            // 可配置附加的布局方法
            layout: [
              // 柱形图数据标签位置自动调整
              { type: "interval-adjust-position" },
              // 数据标签文颜色自动调整
              { type: "adjust-color" },
            ],
          },
        });
        console.log("creatBarChart-success");
        stackedBarPlot.render();
      } else {
        console.log("error-datas", data);
        this.$notification.open({
          message: this.$T("ssrc.inquiryHall.model.inquiryHall.refresh").$D("图表数据构建异常，请重新加载"),
          key,
          class: "notification"
        });
      }
    },
    async getMoreData() {
      let promiseArr = [];
      this.categoryInfo.map((item) => {
        let temp = new Promise((resolve) => {
          const params = {
            page: 0,
            size: 500,
            rfxHeaderId: this.changeReqId,
            rfxLineItemId: item.rfxLineItemId,
            customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ALL_QUOTATION_DETAIL"
          };
          getPricingSupplierQuotationApi(params).then((res) => {
            if (res && !res.empty) {
              item.quotationDetail = res.content;
              //构建比价助手展示数据
              res.content.map((e) => this.buildBarData(e));
              console.log("load-dataList", this.dataList);
            }
            resolve();
          });
        });
        promiseArr.push(temp);
      });
      Promise.all(promiseArr)
        .then(() => {
          this.$forceUpdate();
          this.$refreshScroll();
          this.$loading.hide();
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAttachedFile() {
      let promiseArr = [];
      this.categoryInfo.map((item) => {
        if (item.attachmentUuid) {
          let temp = new Promise((resolve) => {
            getAttachedFileApi(item.attachmentUuid).then((res) => {
              if (res && res.length !== 0) {
                item.showAttachment = true;
              }
              resolve();
            });
          });
          promiseArr.push(temp);
        }
      });
      Promise.all(promiseArr)
        .then(() => {
          this.$forceUpdate();
          this.$refreshScroll();
          this.$loading.hide();
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    },
    showReaultDetail(data) {
      this.pricingResultDetail = data;
      this.pricingResultDetailPop = !this.pricingResultDetailPop;
    },
    showSupplierQuotationDetail(data) {
      this.supplierQuotationDetail = data;
      this.supplierQuotationDetailPop = !this.supplierQuotationDetailPop;
    },
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color: var(--color-font-default);
}

.right-icon {
  display: flex;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
    transition: all 0.3s;
  }

  background-size: 16px;
}

>>> .hips-collapse-item__title .right-icon img {
  -webkit-transform: rotateZ(0) !important;
  transform: rotateZ(0) !important;
}

>>> .hips-collapse-item__title--expanded .right-icon img {
  -webkit-transform: rotateZ(90deg) !important;
  transform: rotateZ(90deg) !important;
}

.closeFont {
  color: var(--color-font-default-c) !important;
  border-color: var(--color-font-default-c) !important;
}

.font-blue {
  color: var(--color-other-default-b);
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    // overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      width: 150%;
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
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    .content {
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
          width: 220px;
        }

        .span-title {
          padding: 3.2vw 4vw 3.2vw 5.333vw;
          border-bottom: 2.133vw solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
          font-size: 3.733vw;
          line-height: 5.867vw;
          font-weight: 600;
        }

        .span-compare {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #3473FF;
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
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            width: auto;
          }

          span:nth-child(2) {
            word-break: break-all;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          margin: 0px 0 3px 20px;
          border-bottom: 1px solid var(--color-border-default);
          padding: 14px 20px 11px 0px;

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

      .headInfo {
        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 13px;
            border-bottom: 1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 12px 20px 0 0;

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

      .lineInfo {
        >>> .hips-cell {
          padding: 17px 20px 13px 20px;
          position: static;
        }

        font-family: PingFangSC-Medium;

        .collapse-title-a {
          margin-bottom: 4px;

          .look-file{
            font-size: 10px;
            color: var(--color-other-default-b);
            line-height: 18px;
            padding: 0px 4px;
            display: inline-block;
            border: 1px solid var(--color-other-default-b);
            border-radius: 2px;
            margin-right: 8px;
          }

         .head-code {
            font-size: 14px;
            color: var(--color-font-default);
            display: inline;
            line-height: 22px;
            font-weight: 700;
            word-break: break-all;
          }
        }

        .collapse-title-b {
          // height: 20px;
          span {
            background: var(--color-bg-default-d,rgba(65,70,96,0.1));
            border-radius: 2px;
            padding: 1px 4px;
            margin-right: 8px;
            display: inline-block;
            font-size: 10px;
            color: var(--color-font-default-c);
            line-height: 18px;
            word-break: break-all;
          }
        }

        .collapse-title-c {
          // height: 20px;
          span {
            background: var(--color-bg-default-d,rgba(65,70,96,0.1));
            border-radius: 2px;
            padding: 1px 4px;
            margin-right: 60px;
            display: inline-block;
            font-size: 10px;
            color: var(--color-font-default-c);
            line-height: 18px;
            word-break: break-all;
          }
        }

        .collapse-info {
          background: var(--color-bg-default);
        }
      }

      .last-no-border {
        div:nth-last-child(1) {
          .footInfo {
            border: none !important;
          }
        }
      }
    }
  }
}
.btn-pricing-approval-chart{
  .lineInfoDetail {
    background:var(--color-bg-default);
    height: 100%;
    display: flex;
    flex-direction: column;

    .titleContext {
      display: flex;
      justify-content: space-between;
      margin-top:20px;
      margin-left: 20px;
      margin-right: 20px;

      .spanFirst {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #1B1E2B;
        text-align: center;
      }

      .spanSecond {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #3473FF;
      }
    }

    .chart {
      margin-top: 20px;
      margin-left: 20px;
      margin-right: 20px;

    }

    .header {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color:var(--color-font-default);
      text-align: center;
      line-height: 26px;
      font-weight: 700;
      padding: 9px 0;
    }

    .lineHead {
      padding: 8px 20px 12px;
      background-color:var(--color-font-default-d);
      font-family: 'PingFangSC-Medium';
      color:var(--color-font-default);
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
          color:var(--color-font-default);
          line-height: 24px;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
