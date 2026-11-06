<template>
  <div>
    <section v-if="headInfo" class="mainDetail">
      <div class="navWrap">
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
      <div
        ref="wrapper"
        class="contentWrap wrapper"
        :style="{height: `calc(100vh - ${topHeight}px)`}">
        <div ref="content" class="content">
          <div ref="headInfo" class="infoContent headInfo">
            <h3>{{ $T("hipspfm.workFlowCata.model.common.orderHeaderInfo").$D("采购申请汇总信息") }}</h3>
            <div v-if="JSON.stringify(headInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noOrderHeaderInfo").$D("暂无订单头信息") }}</span>
            </div>
            <div class="card">
              <ul>
                <li class="name-title">
                  <span>{{ $T("sprm.common.model.common.prNum").$D("采购申请编号") }}：{{ headInfo.displayPrNum }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.lotNum").$D("批次号") }}：{{ headInfo.lotNum }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.creationTime").$D("创建日期") }}：{{ headInfo.creationDate }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.amount").$D("申请总额") }}：{{ headInfo.amount|CalcMoney }}</span>
                  <span>{{ $T("sprm.common.model.common.createdName").$D("创建人") }}：{{ headInfo.createByName }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.companyName").$D("公司") }}：{{ headInfo.companyName }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.prSourcePlatform").$D("单据来源") }}：{{ headInfo.prSourcePlatformMeaning }}</span>
                  <span>{{ $T("sprm.common.model.common.prRequestedName").$D("申请人") }}：{{ headInfo.prRequestedName }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.requestDate").$D("申请日期") }}：{{ headInfo.requestDate | CalcDate }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.applyExplain").$D("申请说明") }}：{{ headInfo.remark }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div ref="lineInfo" class="infoContent lineInfo">
            <h3>{{ $T("hipspfm.workFlowCata.model.common.purchaseLineInfo").$D("采购申请明细信息") }}</h3>
            <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
            </div>
            <div v-for="(item,index) in lineInfo"
                 :key="index">
              <div class="headCompany" @click="showLineInfoDetail(item,index)">
                <span class="block"/>
                <span class="code">
                  <span class="materiel-name">{{ item.productName }}（{{ $T("sprm.common.model.common.productName").$D("商品名称") }}）</span>
                  <span>{{ $T("sprm.common.model.common.lineNumber").$D("行号") }}：{{ item.lineNum }}</span>
                </span>
              </div>
              <ul >
                <li>
                  <span>{{ $T('sbud.budgeting.model.budgeting.unitCode').$D('预算部门') }}：{{ item.budgetAccountDeptnoMeaning }}</span>
                  <span>{{ $T('sprm.common.model.common.budgetAccountName').$D('预算科目') }}：{{ item.budgetAccountName }}</span>
                </li>
                <li>
                  <span>{{ $T('ssrc.projectSetup.model.projectSetup.budgetAmount').$D('预算金额') }}：{{ item.budgetAccountPrice }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.itemName").$D("物料名称") }}：{{ item.itemName }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.itemCode").$D("物料编码") }}：{{ item.itemCode }}</span>
                  <span>{{ $T("sprm.common.model.common.categoryName").$D("物料分类") }}：{{ item.categoryName }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.uomName").$D("单位") }}：{{ item.uomCode }}/{{ item.uomName }}</span>
                  <span>{{ $T("sprm.common.model.common.quantity").$D("数量") }}：{{ item.quantity }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.linePrice").$D("行金额") }}：{{ item.taxIncludedLineAmount|CalcMoney }}</span>
                  <span>{{ $T("sprm.common.model.common.currencyCode").$D("币种") }}：{{ item.currencyCode }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.common.model.common.taxRate").$D("税率") }}：{{ item.taxRate }}</span>
                </li>
                <!-- <li @click="seeCode(item)">
                  <srm-flex justify="between">
                    <p>
                      <span>
                        {{ $T("mallf.common.view.card.info").$D("名片信息") }}
                      </span>
                    </p>
                    <p>
                      <span>
                        {{ item.attributeVarchar1 }}
                      </span>
                      <em class="srm-icon icon-chevron-right"/>
                    </p>
                  </srm-flex>
                </li> -->
                <li v-if="item.attributeVarchar1">
                  <span>{{ $T('sprm.purchaseReqCreation.model.sdc.attributeVarchar1').$D('名片姓名') }}：{{ item.attributeVarchar1 }}</span>
                </li>
                <li v-if="item.attributeVarchar1">
                  <span>{{ $T('sprm.purchaseReqCreation.model.sdc.attributeVarchar2').$D('名片手机号') }}：{{ item.attributeVarchar2 }}</span>
                </li>
                <li v-if="item.attributeVarchar1">
                  <span>{{ $T('sprm.purchaseReqCreation.model.sdc.attributeVarchar3').$D('名片邮箱') }}：{{ item.attributeVarchar3 }}</span>
                </li>
                <li v-if="item.attributeVarchar1">
                  <srm-flex justify="between">
                    <p>
                      <span>
                        {{ $T('sprm.purchaseReqCreation.model.sdc.attributeLongtext1').$D('名片筹款二维码') }}
                      </span>
                    </p>
                    <p style="display:flex;align-items: center;" @click="preView(item.attributeLongtext1)">
                      <img v-if="item.attributeLongtext1" :src="item.attributeLongtext1" width="50" height="50">
                      <em class="srm-icon icon-chevron-right"/>
                    </p>
                  </srm-flex>
                </li>
                <li v-if="item.attributeVarchar1">
                  <srm-flex justify="between">
                    <p>
                      <span>
                        {{ $T('sprm.purchaseReqCreation.model.sdc.attributeLongtext2').$D('名片微信二维码') }}
                      </span>
                    </p>
                    <p style="display:flex;align-items: center;" @click="preView(item.attributeLongtext2)">
                      <img v-if="item.attributeLongtext2" :src="item.attributeLongtext2" width="50" height="50">
                      <em class="srm-icon icon-chevron-right"/>
                    </p>
                  </srm-flex>
                </li>
                <li>
                  <span>{{ $T("sprm.purchaseReqCreation.model.sdc.receiveAddress").$D("收货人地址") }}：{{ item.receiveAddress }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.purchaseReqCreation.model.sdc.receiveContactName").$D("收货联系人") }}：{{ item.receiveContactName }}</span>
                </li>
                <li>
                  <span>{{ $T("sprm.purchaseReqCreation.model.sdc.receiveTelNum").$D("收货人联系方式") }}：{{ item.receiveTelNum }}</span>
                </li>
              </ul>
              <div class="footInfo">
                <span>{{ $T("sprm.common.model.common.neededDate").$D("需求日期") }}：</span>
                <span>{{ item.neededDate | CalcDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 行信息详情弹窗 -->
      <CataReqLineDetail v-model="orderLineDetailPopup" :line-info-detail="lineInfoDetail" :show-file-pop="showFilePop"/>

      <srm-popup
        :show-header="false"
        :show-close="false"
        :visible.sync="seeCodePopup"
        position="center"
        width="100%">
        <div class="see-code-popup">
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div class="info">
              <span class="title">{{ codeInfo.attributeVarchar1 }}</span>
              <span>{{ codeInfo.attributeVarchar2 }}</span>
              <span>{{ codeInfo.attributeVarchar3 }}</span>
            </div>
            <div class="close-icon" @click="seeCodePopup=false">
              <em class="srm-icon icon-x"/>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div class="check-span">
              <span>个人信息核对</span>
            </div>
            <div class="code-img">
              <p class="wx-img" @click="preView(codeInfo.attributeLongtext2)">
                <span>微信</span>
                <img height="65" :src="codeInfo.attributeLongtext2">
              </p>
              <p class="ck-img" @click="preView(codeInfo.attributeLongtext1)">
                <span>筹款</span>
                <img height="65" :src="codeInfo.attributeLongtext1">
              </p>
            </div>
          </div>
        </div>
      </srm-popup>
    </section>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { NavBar, Textarea } from "hips";
import CataReqLineDetail from "./components/SDCCataReqLineDetail";
import { getCataReqHeaderApi, getCataReqLineApi } from "./api";
import uuid from "uuid";

export default {
  modules: [ "hipspfm.workFlowCata","hipspfm.common","sprm.common","sbud.budgeting","ssrc.projectSetup","mallf.common","sprm.purchaseReqCreation","hzero.common","hipspfm.workFlow" ],
  name: "SDCCataMallReqApproval",
  components: {
    CataReqLineDetail,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
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
      lineInfo: [],
      codeInfo: {},
      seeCodePopup: false,
    };
  },
  computed: {
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
      "GetApprovalTitle", this.$T("sprm.purchaseReqCreation.view.catelog.approve.submit").$D("目录化需求提交审批")
    );
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3
      });
      this.$refreshScroll();
      this.scroll.on("scroll", this.handlerScroll);
    });
    this.uuid = uuid();
  },
  methods: {
    // 查看名片
    seeCode(res) {
      this.codeInfo = {
        ...res
      };
      this.seeCodePopup = true;
    },
    // 查看图片
    preView(url) {
      if (!url) {
        return;
      }
      this.$previewImage([ url ], { showClose: true });
    },
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
        customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.LINE_CATALOGUE",
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
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    }
  }
};
</script>

<style lang="stylus" scoped>
.see-code-popup {
  position: absolute;
  top: 35%;
  left: 5%;
  height: 220px;
  width: 90%;
  background-color: white;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 20px;;
  justify-content: space-between;
  border: 1px solid #eee;
  .info {
    display: flex;
    flex-direction: column;
    .title {
      font-size: 20px;
      font-weight: 600;
      line-height: 20px;
      margin-bottom: 10px;
    }
    span {
      font-size: 16px;
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
      line-height: 26px;
    }
  }
  .code-img{
    display: flex;
    justify-content: flex-end;
  }
  .check-span {
    display: flex;
    align-items:flex-end;
    height: 80px;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
      color: #afafaf;
      line-height: 20px;
    }
  }
  .wx-img {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right:20px;
    span {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
      line-height: 20px;
    }
  }
  .ck-img {
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
      line-height: 20px;
    }
  }
}
.mainDetail {
  .noContent {
    height: 78px;
    padding-left: 20px;

    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-font-default-b);
      letter-spacing: 0;
      line-height: 22px;
    }
  }

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
          color: var(--color-font-default, #1b1e2b);
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
    // height: calc(100vh - 344px);
    overflow: hidden;

    .content {
      .infoContent {
        h3 {
          padding: 20px 20px 12px;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }
      }

      // .headInfo {
      // ul {
      // padding-left: 20px;
      // }

      // & ul li {
      // margin-bottom: 8px;
      // padding: 9px 10px 14px 0;
      // border-bottom: 1px solid var(--color-border-default);
      // display: flex;
      // align-items: baseline;

      // span {
      // font-family: PingFangSC-Regular;
      // font-size: 14px;
      // color: var(--color-font-default, #1b1e2b);
      // line-height: 22px;
      // }

      // span:nth-child(1) {
      // flex: 0 1 98px;
      // }

      // span:nth-child(2) {
      // flex: 0 1 237px;
      // color: var(--color-font-default-b);
      // }
      // }

      // & ul li:nth-child(1) {
      // padding: 20px 20px 11px 0;

      // span:nth-child(1) {
      // flex: 0 1 98px;
      // }
      // }

      // & ul li:nth-child(1) span:nth-child(2) {
      // // flex: 0 1 190.7px;
      // // word-break:break-word;
      // // overflow: hidden;
      // // text-overflow: ellipsis;
      // // display: -webkit-box;
      // // -webkit-line-clamp:3;
      // // -webkit-box-orient: vertical;
      // }

      // & ul li:nth-last-child(1) {
      // border-bottom: 0;
      // margin-bottom: 1px;
      // }
      // }
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
              color: var(--color-font-default, #1b1e2b);
              line-height: 22px;
            }
          }
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color:var(--color-font-default);
          font-size: 14px;
          line-height: 22px;
          font-weight: 700;

          span:nth-child(1) {
            width: auto;
          }

          span:nth-child(2) {
            word-break: break-all;
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  height: 100%;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  div {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        color: var(--color-font-default-b);
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(2) {
        margin-bottom: 0;

        span {
          color: var(--color-font-default, #1b1e2b);
        }
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      line-height: 24px;
    }
  }

  > li {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    margin-bottom: 2px;

    &:nth-of-type(1) {
      padding-top: 9px;
    }

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default, #1b1e2b);
      line-height: 22px;

      &:nth-child(2) {
        color: var(--color-font-default-b);
        display: inline-block;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.card {
  width: 100%;
  color: #666666;
  background: var(--color-bg-default);

  .card-btn {
    font-size: 12px;
    color: var(--color-other-default-b);
    float: right;
    text-align: right;

    img {
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }

  div {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;

    .code {
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default);
      font-weight: bold;

      .tag {
        display: inline-block;
        width: 6px;
        height: 14px;
        background: var(--color-other-default-b);
        border-radius: 1px;
        margin-right: 8px;
      }

      .place-holder {
        display: inline-block;
        width: 30px;
        height: 100%;
      }
    }

    .noWrap {
      width: 260px;
    }

    .head-num, .line-num {
      span {
        font-size: 14px;
        color: #C6CAD6;
      }
    }
  }

  .sub-single-title {
    padding: 0 20px;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border-default);

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }

  ul {
    padding: 0 5.333vw 8px 5.333vw;

    li {
      display: flex;
      line-height: 32px;
      margin-top: 2px;
      font-size: 14px;
      color: var(--color-font-default);

      &:first-child {
        margin-top: 8px;
      }

      > span {
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);

        .fileBtn {
          color: var(--color-other-default-b);
        }
      }

      > span:nth-child(1) {
        text-align: left;
      }
    }

    .name-title {
      display: flex;
      align-items: center;
      position: relative;

      span:first-child {
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;
        font-weight: bold;
      }

      .name-tag {
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        display: inline-block;
        background: var(--color-bg-default-c);
        border-radius: 2px;
        margin-right: 8px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }

      .item-name {
        line-height: 22px;
        padding: 14px 0;
        font-weight: 700;
      }

      .item-num {
        height: 20px;
        margin-left: 8px;
        padding: 0 4px;
        font-size: 10px;
        color: var(--color-other-default-b);
        line-height: 20px;
        border-radius: 2px;
        background: var(--color-bg-default-c);
      }
    }

    .name-title:before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 14px;
      background: var(--color-other-default-b);
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
>>> .hips-nav-bar__center-slot{
  padding: 0 20px 0 0 !important
}
.headCompany {
  display: flex;
  flex-direction: row;
  padding-bottom: 11px;
  margin: 14px 0 3px 20px;
  border-bottom:1px solid var(--color-border-default);
  padding-right: 20px;
  font-weight:bold
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
    color:var(--color-font-default);
    line-height: 20px;
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
    .materiel-name {
      max-width 230px
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
