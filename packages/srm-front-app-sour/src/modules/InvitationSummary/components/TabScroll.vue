<template>
  <section v-if="headInfo" class="mainDetail">
    <div class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in navArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="changeNav(index)">
          {{ item }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <div v-if="showHeadInfo" ref="headInfo" class="infoContent headInfo">
          <h3>{{ $T("spfm.disposeInvite.view.message.registerInfo").$D("登记信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.disposeInvite.view.message.noRegisterInfo").$D("暂无登记信息") }}</span>
          </div>
          <div v-else>
            <div class="headCompany">
              <span class="block"/>
              <span class="code">{{ basic.companyName }}</span>
            </div>
            <ul>
              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.companyTypeMeaning").$D("公司类型") }}：{{ basic.companyTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.registeredCountryName").$D("注册国家") }}：{{ basic.registeredCountryName }}</span>
              </li>

              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.registeredCapital").$D("注册资本") }}：{{ basic.registeredCapital ? CalcMicrometer(basic.registeredCapital)+$T("hipspfm.common.message.tenThousandYuan").$D("万元") : $T("hipspfm.common.currency.none").$D("无") }}</span>
                <span>{{ $T("spfm.disposeInvite.view.message.legalRepName").$D("法定代表人") }}：{{ basic.legalRepName }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.buildDate").$D("成立日期") }}：{{ basic.buildDate }}</span>
                <span>{{ $T("spfm.disposeInvite.view.message.domesticForeignRelation").$D("境内外关系") }}：{{ basic.domesticForeignRelation == '1' ? $T("spfm.disposeInvite.view.message.domestic").$D("境内") : (basic.domesticForeignRelation == '0' ? $T("spfm.disposeInvite.view.message.overseas").$D("境外") : '') }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.licenceEndDate").$D("营业期限") }}：{{ basic.longTermFlag == '1' ? $T("spfm.disposeInvite.view.message.longTerm").$D("长期") : (basic.longTermFlag == '0' ? basic.licenceEndDate : '') }}</span>
                <span>
                  {{ $T("spfm.disposeInvite.view.message.licenceUrl").$D("营业执照扫描件") }}：
                  <span
                    v-if="basic.licenceUrl"
                    class="preview"
                    @click="downloadlFileHandler(basic.licenceUrl)">{{ $T("hipspfm.disposeInvite.view.button.download").$D("下载") }}</span>
                  <span
                    v-else
                    style="color:var(--color-font-default-b)"
                    class>{{ $T("hipspfm.disposeInvite.view.button.download").$D("下载") }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.taxpayerTypeMeaning").$D("纳税人标识") }}：{{ basic.taxpayerTypeMeaning }}</span>
                <span>D-U-N-S: {{ basic.dunsCode }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.registeredRegionName").$D("注册地址") }}：{{ basic.registeredRegionName }} {{ basic.addressDetail }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.disposeInvite.view.message.businessScope").$D("经营范围") }}：{{ basic.businessScope }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="showHeadInfo" ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T("spfm.disposeInvite.view.message.business").$D("业务信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.disposeInvite.view.message.noBusiness").$D("暂无业务信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T("spfm.disposeInvite.view.message.mainIdentity").$D("主要身份") }}：</span>
              <span
                v-if="headInfo.business.purchaseFlag == 1 && headInfo.business.saleFlag == 1">{{ $T("spfm.disposeInvite.view.message.sale").$D("我要销售") }}/{{ $T("spfm.disposeInvite.view.message.purchase").$D("我要采购") }}</span>
              <span
                v-else>{{ headInfo.business.saleFlag == 1 ? $T("spfm.disposeInvite.view.message.sale").$D("我要销售"): (headInfo.business.purchaseFlag == 1 ? $T("spfm.disposeInvite.view.message.purchase").$D("我要采购") : '') }}</span>
            </li>
            <li>
              <span>{{ $T("spfm.disposeInvite.view.message.businessNature").$D("经营性质") }}：</span>
              <span>{{ businessNature }}</span>
            </li>
            <li>
              <span>{{ $T("spfm.disposeInvite.view.message.industryType").$D("行业类型") }}：</span>
              <span v-text="merge(headInfo.business.industryList,'industryName')"/>

              <srm-tooltip
                v-if="headInfo.business.industryList"
                placement="left"
                :title="merge(headInfo.business.industryList,'industryName')">
                <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default" >
              </srm-tooltip>
            </li>
            <li>
              <span>{{ $T("spfm.disposeInvite.view.message.mainCategory").$D("主营品类") }}：</span>
              <span v-text="merge(headInfo.business.industryCategoryList,'categoryName')"/>
            </li>
            <li>
              <span>{{ $T("spfm.disposeInvite.view.message.website").$D("公司官网") }}：</span>
              <span>{{ headInfo.business.website }}</span>
            </li>
            <li>
              <span>{{ $T("spfm.disposeInvite.view.message.description").$D("公司简介") }}：</span>
              <span>{{ headInfo.business.description }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.disposeInvite.view.message.companyLoGo").$D("公司logo") }}：</span>
              <span
                v-if="headInfo.business.logoUrl"
                class="preview"
                @click="downloadlFileHandler(headInfo.business.logoUrl)">{{ $T("hipspfm.disposeInvite.view.button.download").$D("下载") }}</span>
              <span
                v-else
                style="color:var(--color-font-default-b)">{{ $T("hipspfm.disposeInvite.view.button.download").$D("下载") }}</span>
            </li>
          </ul>
        </div>

        <div v-if="showOtherInfo" ref="otherInfo" class="infoContent">
          <h3>{{ $T("spfm.disposeInvite.view.message.investigateTemplate").$D("调查表") }}</h3>
          <div class="noContent">
            <span>{{ $T("hipspfm.disposeInvite.validation.message.lookInvestigateTemplate").$D("请前往PC端查看调查表信息！") }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { NavBar } from "hips";
import BScroll from "better-scroll";
import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";

export default {
  modules: [ "spfm.disposeInvite", "smbl.common", "hipspfm.disposeInvite", "hipspfm.common" ],
  name: "TabScroll",
  components: {
    [NavBar.name]: NavBar
  },
  props: {
    headInfo: {
      type: Object,
      default: {}
    },
    showTabInfo: {
      // 是否展示业务信息等
      type: Boolean,
      default: false
    },
    showQuestionnaire: {
      // 是否展示调查表
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: "",
      show: false,
      navIndex: 0,
      contentLenArr: [],
      navArr: [],
      previewImg: "",
      basic: "",
      business: "",
      businessNature: "", // 经营性质
      showHeadInfo: false,
      showOtherInfo: false
    };
  },
  mounted() {
    this.basic = this.headInfo.basic;
    this.business = this.headInfo.business;
    if (
      this.showTabInfo &&
      this.headInfo &&
      JSON.stringify(this.headInfo) !== "{}"
    ) {
      this.showHeadInfo = true;
      this.navArr.push(
        this.$T("spfm.disposeInvite.view.message.registerInfo").$D("登记信息")
      );
      this.navArr.push(
        this.$T("spfm.disposeInvite.view.message.business").$D("业务信息")
      );
    }
    if (this.showQuestionnaire) {
      this.showOtherInfo = true;
      this.navArr.push(
        this.$T("spfm.disposeInvite.view.message.investigateTemplate").$D(
          "调查表"
        )
      );
    }
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      if (this.showHeadInfo) {
        this.contentLenArr.push(this.$refs.headInfo.offsetHeight);
        this.contentLenArr.push(this.$refs.lineInfo.offsetHeight);
      }
      if (this.showOtherInfo) {
        this.contentLenArr.push(this.$refs.otherInfo.offsetHeight);
      }
      this.scroll.on("scroll", this.handlerScroll);
      const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 430;
      this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
      this.scroll.refresh();
    });
    this.getBusinessNature();
  },
  methods: {
    // 切换tab
    changeNav(index) {
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;
      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 600, "bounce");
      });
      this.navIndex = index;
    },
    merge: function(val, industryName) {
      let arr = [];
      if (industryName == "industryName") {
        val.forEach((element) => {
          arr.push(element.industryName);
        });
      } else if (industryName == "categoryName") {
        val.forEach((element) => {
          arr.push(element.categoryName);
        });
      }
      val = arr.join("/");
      return val;
    },
    getBusinessNature() {
      let arr = [];
      if (this.headInfo.business.manufacturerFlag == 1) {
        arr.push(
          this.$T("spfm.disposeInvite.view.message.manufacturer").$D("制造商")
        );
      }
      if (this.headInfo.business.traderFlag == 1) {
        arr.push(
          this.$T("spfm.disposeInvite.view.message.trader").$D("贸易商")
        );
      }
      if (this.headInfo.business.servicerFlag == 1) {
        arr.push(
          this.$T("spfm.disposeInvite.view.message.servicer").$D("服务商")
        );
      }
      if (this.headInfo.business.agentFlag == 1) {
        arr.push(
          this.$T("spfm.disposeInvite.view.message.agent").$D("代理商")
        );
      }
      if (arr.length > 1) {
        this.businessNature = arr.join("/");
      } else if (arr.length == 1) {
        this.businessNature = arr[0];
      }
    },
    CalcMicrometer(value) {
      if (typeof value !== "undefined" && typeof value !== "object") {
        return String(value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      }
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      const len1 = -this.contentLenArr[0];
      const len2 = len1 - this.contentLenArr[1];
      const len3 = len2 - this.contentLenArr[2];
      if (y > len1 && y < 100) {
        this.navIndex = 0;
      } else if (y > len2 && y <= len1) {
        this.navIndex = 1;
      } else if (y > len3 && y <= len2) {
        this.navIndex = 2;
      } else {
        this.navIndex = 3;
      }
    },
    // buildImgUrl(fileUrl,bucketName) {
    //   const baseUrl = process.env.VUE_APP_BASE_URL;
    //   const downApi = `/hfle/v1/${window.localStorage.organizationId}/files/download`;
    //   const access_token = window.localStorage.getItem("user-token");
    //   const url =  encodeURIComponent(fileUrl);
    //   return `${baseUrl + downApi}?access_token=${access_token}&bucketName=${bucketName}&url=${url}`;
    // },
    handlePreview(val) {
      this.previewImg = this.buildImgUrl(val, "private-bucket");
      this.$previewImage([ this.previewImg ]);
    },
    downloadlFileHandler(fileUrl) {
      try {
        const downloadUrl = this.buildImgUrl(fileUrl, "private-bucket");
        downloadFile(downloadUrl);
      } catch (e) {
        this.downloadlFile(fileUrl, "private-bucket");
      }
    },
    downloadlFile(fileUrl, bucketName) {
      const downloadUrl = this.buildImgUrl(fileUrl, bucketName);
      if (!this.isWeChat()) {
        let iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.style.height = 0;
        iframe.src = downloadUrl;
        document.body.appendChild(iframe);
        setTimeout(() => iframe.remove(), 100000);
      } else {
        this.$copyText(downloadUrl).then(() => {
          alert(this.$T("smbl.common.view.copy.success.tips").$D("复制成功, 请在浏览器中下载"));
        }, (err) => {
          alert(this.$T("smbl.common.view.copy.error").$D("复制失败"));
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.mainDetail {
  .noContent {
    height: 78px;
    padding-left: 20px;

    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color:var(--color-font-default-b);
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
        color:var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color:var(--color-font-default);
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
      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview {
          color: var(--color-other-default-b) !important;
        }

        h3 {
          padding: 20px 20px 12px;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background:var(--color-bg-default-b);
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding: 11px 20px 11px 0;
          margin: 4px 0 0 20px;
          border-bottom:1px solid var(--color-border-default);

          span:nth-child(3) {
            color: var(--color-font-default-e);
            font-size: 14px;
            position: absolute;
            right: 20px;
            line-height: 22px;
          }

          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: var(--color-other-default-b);
            margin: 4px 10px 0 0;
          }

          .code {
            font-weight: bold;
            font-size: 16px;
            color:var(--color-font-default);
            line-height: 24px;
          }
        }

        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 13px;
          }

          li:nth-child(1) {
            padding-top: 13px;
          }

          li {
            display: flex;
            align-items: center;
            padding: 12px 20px 0 0;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;
            }
          }
        }
      }

      .lineInfo {
        & ul li {
          margin-bottom: 8px;
          padding: 8px 10px 15px 0;
          border-bottom:1px solid var(--color-border-default);
          align-items: baseline;

          span {
            flex: none;
          }

          span:nth-child(2) {
            margin-left: 5%;
            width: 68%;
            color:var(--color-font-default-b);
          }
          span:nth-child(2){
            margin-left:5%;
            width:68%;
            color:var(--color-font-default-b);
            word-break: break-all;
          }
        }

        & ul li:nth-child(1) {
          padding: 20px 20px 11px 0;
        }

        & ul li:nth-child(3) span:nth-child(2) {
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}

.moreInfo {
  align-self: flex-end;
  width: 18.3px;
  height: 18.3px;
}

.lineInfoDetail {
  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  background: #FAFBFC;
  height: 100%;

  div {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      color:var(--color-font-default);

      span {
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(3) {
        margin-bottom: 0;
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color:var(--color-font-default);
      line-height: 24px;
      // font-font-weight: bold;
    }
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 6px 20px;
    margin-bottom: 2px;

    // background: #FAFBFC;
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color:var(--color-font-default);
      line-height: 22px;

      &:nth-child(2) {
        color:var(--color-font-default-b);
        display: inline-block;
        width: 60%;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}
</style>
