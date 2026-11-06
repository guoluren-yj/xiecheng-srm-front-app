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
        <div ref="headInfo" class="infoContent headInfo">
          <h3>{{ $T("spfm.approval.view.message.title.regInfo").$D("登记信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplier.message.supplier.noRegisterInfo").$D("暂无登记信息") }}</span>
          </div>
          <div v-else>
            <div class="headCompany">
              <span class="block"/>
              <span class="code">{{ $T("hipspfm.supplier.message.supplier.shortName").$D("公司简称") }}：{{ basic.shortName }}</span>
            </div>
            <ul>
              <li>
                <span>{{ $T("spfm.approval.model.legal.registeredRegionName").$D("注册地址") }}：{{ basic.addressDetail }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.approval.model.legal.registeredCountryName").$D("注册国家") }}：{{ basic.registeredCountryName }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.approval.model.legal.buildDate").$D("成立日期") }}：{{ basic.buildDate }}</span>
                <span>{{ $T("spfm.approval.model.legal.domesticForeignRelation").$D("境内外关系") }}：{{ basic.domesticForeignRelation == '1' ? $T("hipspfm.supplier.message.supplier.territory").$D("境内") : (basic.domesticForeignRelation == '0' ? $T("hipspfm.supplier.message.supplier.abroad").$D("境外") : '') }}</span>
              </li>
              <li>
                <span>{{ $T("spfm.approval.model.legal.licenceEndDate").$D("经营期限") }}：{{ basic.longTermFlag == '1' ? $T("spfm.approval.model.legal.longTermFlag").$D("长期") : (basic.longTermFlag == '0' ? basic.licenceEndDate : '') }}</span>
                <span>{{ $T("spfm.approval.model.legal.licenceUrl").$D("营业执照扫描件") }}：
                  <span v-if="basic.licenceUrl" class="preview" @click="handlePreview(basic.licenceUrl)">{{ $T("hipspfm.common.message.preview").$D("预览") }}</span>
                  <span v-else style="color:var(--color-font-default-b)" class="">{{ $T("hipspfm.common.message.preview").$D("预览") }}</span></span>
              </li>
              <li>
                <span>{{ $T("spfm.approval.model.legal.taxpayerType").$D("纳税人标识") }}：{{ basic.taxpayerTypeMeaning }}</span>
              </li>
              <li>
                <span>D-U-N-S: {{ basic.dunsCode }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("spfm.approval.model.legal.businessScope").$D("经营范围") }}：{{ basic.businessScope }}</span>
              <span>
                <srm-tooltip v-if="basic.businessScope" placement="left" :title="basic.businessScope" >
                  <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default" >
                </srm-tooltip>
              </span>
            </div>
          </div>
        </div>
        <div ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T("spfm.approval.view.message.title.businessInfo").$D("业务信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplier.message.title.noBusinessInfo").$D("暂无业务信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T("spfm.approval.model.business.primaryIdentity").$D("主要身份") }}：</span>
              <span v-if="headInfo.business.purchaseFlag == 1 && headInfo.business.saleFlag == 1">{{ $T("spfm.approval.model.business.primaryIdentity.purchaseFlag").$D("我要销售") }}/{{ $T("spfm.approval.model.business.primaryIdentity.saleFlag").$D("我要采购") }}</span>
              <span v-else>{{ headInfo.business.saleFlag == 1 ? $T("spfm.approval.model.business.primaryIdentity.purchaseFlag").$D("我要销售"): (headInfo.business.purchaseFlag == 1 ? $T("spfm.approval.model.business.primaryIdentity.saleFlag").$D("我要采购") : '') }}</span>
            </li>
            <li>
              <span>{{ $T("spfm.approval.model.business.businessNature").$D("经营性质") }}：</span>
              <span>{{ businessNature }}</span>
            </li>
            <li>
              <span>{{ $T("spfm.approval.model.business.industryList").$D("行业类型") }}：</span>
              <span v-text="merge(headInfo.business.industryList,'industryName')"/>
              <srm-tooltip v-if="headInfo.business.industryList" placement="left" :title="merge(headInfo.business.industryList,'industryName')" >
                <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default" >
              </srm-tooltip>
            </li>
            <li>
              <span>{{ $T("spfm.approval.model.business.industryCategoryList").$D("主营品类") }}：</span>
              <span v-text="merge(headInfo.business.industryCategoryList,'categoryName')"/>
            </li>
            <li>
              <span>{{ $T("spfm.approval.model.business.website").$D("公司官网") }}：</span>
              <span>{{ headInfo.business.website }}</span>
            </li>
            <li>
              <span>{{ $T("spfm.approval.model.business.description").$D("公司简介") }}：</span>
              <span>{{ headInfo.business.description }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.common.message.company").$D("公司") }}logo：</span>
              <span v-if="headInfo.business.logoUrl" class="preview" @click="handlePreview(headInfo.business.logoUrl)">{{ $T("hipspfm.supplier.message.preview").$D("预览") }}</span>
              <span v-else style="color:var(--color-font-default-b)" class="">{{ $T("hipspfm.supplier.message.preview").$D("预览") }}</span>
            </li>
          </ul>
        </div>

        <div ref="contacts" class="infoContent headInfo contacts">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierContact").$D("联系人") }}</h3>
          <div v-if="JSON.stringify(contactList) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierContact").$D("暂无联系人信息") }}</span>
          </div>
          <div v-else class="itemBottom">
            <div
              v-for="(item,index) in contactList"
              :key="index"
              @click="showLineInfoDetail(item)">
              <span class="headCompany">
                <span v-if="item.gender === 0" class="headImg">
                  <img class="image-red-default" src="@/assets/icon_list_women_normal@3x.png" alt="wowenHeadImg" >
                </span>
                <span v-else class="headImg">
                  <img class="image-blue-default" src="@/assets/icon_list_man_normal@3x.png" alt="manHeadImg" >
                </span>
                <span class="code">
                  <span class="materiel-name">{{ item.name }}</span>
                </span>
              </span>
              <ul>
                <li>
                  <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.mobilephone").$D("手机号码") }}：{{ item.mobilephone }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.mail").$D("邮箱") }}：{{ item.mail }}</span>
                </li>
              </ul>
              <span class="footInfo concat-status-foot">
                <span>
                  {{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态") }}：
                  <span
                    v-if="item.enabledFlag === 1"
                    class="font-blue">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}</span>
                  <span v-else-if="item.enabledFlag === 0" class="font-red">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }}</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div ref="enterpriseAttachment" class="infoContent headInfo enterpriseAttachment">
          <h3>{{ $T("spfm.enterprise.view.message.attachment").$D("附件信息") }}</h3>
          <div v-if="JSON.stringify(headInfo.attachmentList) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.message.noAttachment").$D("暂无附件") }}</span>
          </div>
          <div v-for="(item,index) in headInfo.attachmentList" v-else :key="index">
            <div class="headCompany">
              <span class="block"/>
              <span class="code width-wrap">{{ $T("sslm.supplierDetail.model.supplierDetail.description").$D("附件描述") }}：{{ item.description }}</span>
            </div>
            <ul >
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.attachmentType").$D("附件类型") }}：{{ item.attachmentType }}</span>
                <span>
                  {{ $T("sslm.supplierDetail.model.supplierDetail.attachmentMessage").$D("附件信息") }}：
                  <span
                    class="font-blue"
                    @click="showFilePop(item.attachmentUuid||uuid)">{{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.endDate").$D("文件到期日") }}：{{ item.endDate }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.addressDetail").$D("最后上传日") }}：{{ item.uploadDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <contacts-detail
      v-model="showContactsDetail"
      :line-info-detail="lineInfoDetail"/>
    <attached-file v-model="lineFilePopup" :attachment-uuid="attachmentUUID" />
  </section>
</template>

<script>
import BScroll from "better-scroll";
import ContactsDetail from "./ContactsDetail";
import uuid from "uuid";
import AttachedFile from "@/components/File/AttachedFile";
import { NavBar } from "hips";

export default {
  modules: [ "spfm.approval", "sslm.supplierDetail", "spfm.enterprise", "spfm.disposeInvite", "hipspfm.supplier", "hipspfm.common", "hipspfm.supplierLifeCycle" ],
  name: "TabScroll",
  components: {
    AttachedFile,
    ContactsDetail,
    [NavBar.name]: NavBar,
  },
  props: {
    headInfo: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      scroll: "",
      show: false,
      navIndex: 0,
      contentLenArr: [],
      previewVisible:false,
      previewImg:"",
      basic: "",
      business : "",
      uuid: "",
      businessNature : "", // 经营性质
      contactList:[],
      showContactsDetail:false,
      lineInfoDetail:{},
      lineFilePopup:false,
      attachmentUUID:"",
    };
  },
  computed: {
    isMallOrder() {
      return this.headInfo.asnTypeCode === "E_COMMERCE_DELIVERY_LIST";
    },
    navArr() {
      return [ this.$T("spfm.approval.view.message.title.regInfo").$D("登记信息"),
        this.$T("spfm.approval.view.message.title.businessInfo").$D("业务信息"),
        this.$T("sslm.supplierDetail.view.message.title.supplierContact").$D("联系人"),
        this.$T("spfm.enterprise.view.message.attachment").$D("附件信息"), ];
    }
  },
  mounted() {
    this.basic = this.headInfo.basic;
    this.business = this.headInfo.business;
    this.contactList = this.headInfo.contactList;
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);

      this.contentLenArr = [
        this.$refs.headInfo.offsetHeight,
        this.$refs.lineInfo.offsetHeight,
        this.$refs.contacts.offsetHeight,
        this.$refs.enterpriseAttachment.offsetHeight,
      ];
      const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 430;
      this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
      this.scroll.refresh();
    });
    let arr = [];
    if (this.headInfo.business.manufacturerFlag == 1) {
      arr.push(this.$T("spfm.approval.model.business.businessNature.manufuctuerFlag").$D("制造商"));
    }
    if (this.headInfo.business.traderFlag == 1) {
      arr.push(this.$T("spfm.approval.model.business.businessNature.traderFlag").$D("贸易商"));
    }
    if (this.headInfo.business.servicerFlag == 1) {
      arr.push(this.$T("spfm.approval.model.business.businessNature.servicerFlag").$D("服务商"));
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
    this.uuid = uuid();
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
    merge:function(val, industryName) {
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
    showLineInfoDetail(item) {
      this.showContactsDetail = true;
      this.lineInfoDetail = item;
    },
    showFilePop(attachmentUUID) {
      if (typeof attachmentUUID === "string") {
        this.attachmentUUID = attachmentUUID;
      }
      setTimeout(() => {
        this.lineFilePopup = !this.lineFilePopup;
      }, 200);
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
    handlePreview(val) {
      const downApi = "/hfle/v1/files/redirect-url";
      this.previewImg = this.buildImgUrl(val, "private-bucket", downApi);
      this.$previewImage([ this.previewImg ]);
    },
  }
};
</script>

<style lang="stylus" scoped>
.mainDetail {
  .font-blue {
    color: var(--color-other-default-b) !important;
  }
  .noContent{
    height:78px;
    padding-left:20px;
    span{
      position relative
      top:16px;
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
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .preview{
          color:var(--color-other-default-b) !important;
        }
        h3 {
          padding: 15px 20px;
          font-size: 20px;
          color:var(--color-font-default);
          line-height: 28px;
          font-weight: 600;
          background: var(--color-bg-default-b);
        }
        .footInfo{
          padding:12px 15px 12px 20px;
          border-bottom:8px solid var(--color-border-default);
          font-family : PingFangSC-Medium;
          color:var(--color-font-default);
          font-size: 14px;
          font-weight:bold;
          display:flex;

          span:nth-child(1) {
            line-height : 22px;
            width:90%;
            margin-right:15px;
            overflow hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
          }
        }

        .headCompany  {
          display: flex;
          flex-direction: row;
          padding-bottom:11px;
          margin:14px 0 3px 20px;
          border-bottom:1px solid var(--color-border-default);
          padding-right:20px;
          // line-height: 26px;

          span:nth-child(3) {
            color: var(--color-font-default-e) ;
            font-size: 14px;
            position:absolute;
            right:20px;
            line-height :22px;
          }
          .block{
            width:6px;
            height:14px;
            border-radius:1px;
            background-color : var(--color-other-default-b);
            margin:4px 10px 0 0;
          }
          .code{
            font-weight:bold;
            font-size: 16px;
            color:var(--color-font-default);
            line-height : 24px;
          }
        }

        .headImg {
            height: 20px;

            img {
              width: 20px;
              height: 20px;
            }

            margin-right: 8px;
        }
        .concat-status-foot {
          span {
            font-weight: normal;
          }
        }
        ul {
          padding-left:20px;

          li:nth-last-child(1){
            padding-bottom:11px;
            border-bottom:1px solid var(--color-border-default);
            margin-bottom: 0;
          }
          li {
            display: flex;
            align-items: center;
            padding: 10px 20px 0 0;
            margin-bottom: 2px;

            span {
              flex:1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;
            }
          }

          }

      }
      .lineInfo{
        & ul li{
          margin-bottom:8px;
          padding:8px 10px 15px 0;
          border-bottom:1px solid var(--color-border-default);
          align-items:baseline;
          span{
            flex:none;
          }
          span:nth-child(2){
            margin-left:5%;
            width:68%;
            color:var(--color-font-default-b);
            word-break: break-all;
          }
        }
        & ul li:nth-child(1){
          padding:20px 20px 11px 0;
        }
        & ul li:nth-child(3) span:nth-child(2) {
          word-break:break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp:3;
          -webkit-box-orient: vertical;
        }
      }

    }
  }
}
.moreInfo{
  align-self:flex-end;
  width:18.3px;
  height:18.3px;

}

</style>
