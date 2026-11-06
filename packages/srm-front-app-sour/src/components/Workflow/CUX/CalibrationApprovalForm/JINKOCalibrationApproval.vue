<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section class="mainDetail" >
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
        <!-- 基础信息 -->
        <div ref="headInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.tab.baseInfos").$D("基础信息") }}</h3>
          <div class="card">
            <ul>
              <li class="name-title">
                <span>{{ headInfo.companyName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidNum').$D('招标编号') }}：{{ headInfo.bidNum }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidTitle').$D('招标事项') }}：{{ headInfo.bidTitle }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.purceOrgName').$D('采购组织名称') }}：{{ headInfo.purOrganizationName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.quotationType').$D('报价方式') }}：{{ headInfo.quotationTypeMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidType').$D('招标类型') }}：{{ headInfo.bidTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.sourceMethod').$D('寻源方式') }}：{{ headInfo.sourceMethodMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.sourceStage').$D('招标阶段') }}：{{ headInfo.sourceStageMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.subjectMatterRule').$D('标的规则') }}：{{ headInfo.subjectMatterRuleMeaning }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.maxBidNumber').$D('最大中标数') }}：{{ headInfo.maxBidNumber }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.rfxModal').$D('寻源模版') }}：{{ headInfo.templateName }}</span>
              </li>
              <li>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.businessAttachments').$D('商务附件') }}：
                  <span class="fileBtn" @click="showFilePop(headInfo.businessAttachmentUuid)">
                    {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
                  </span>
                </span>
                <span>
                  {{ $T('ssrc.bidHall.model.bidHall.techAttachments').$D('技术附件') }}：
                  <span class="fileBtn" @click="showFilePop(headInfo.techAttachmentUuid)">
                    {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 其它信息 -->
        <div ref="otherInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.model.bidHall.otherSupplementaryIssues").$D("其它信息") }}</h3>
          <div class="card">
            <ul>
              <li class="name-title">
                <span>{{ $T('ssrc.bidHall.model.bidHall.projectCode').$D('项目编号') }}：{{ headInfo.projectNum }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.roundNumber').$D('轮次') }}：{{ headInfo.roundNumber }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.versionNumber').$D('版本') }}：{{ headInfo.versionNumber }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.currencyType').$D('币种') }}：{{ headInfo.currencyCode }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.creationDate').$D('创建日期') }}：{{ headInfo.creationDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidFileExpense').$D('招标文件费') }}：{{ headInfo.bidFileExpense }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidBond').$D('保证金（元）') }}：{{ headInfo.bidBond }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.paymentType').$D('付款方式') }}：{{ headInfo.attributeVarchar5 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.paymentTerm').$D('付款条款') }}：{{ headInfo.attributeVarchar6 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidOpenLocation').$D('开标地点') }}：{{ headInfo.bidOpenLocation }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.common.explorationFlag').$D('是否需要现场踏勘') }}：{{ headInfo.explorationFlag === 1? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
                <span>{{ $T('ssrc.common.explorationDate').$D('踏勘时间') }}：{{ headInfo.explorationDate }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 物料明细 -->
        <div ref="lineInfo" class="infoContent">
          <h3>{{ $T("ssrc.bidHall.view.message.tab.itemDetails").$D("物料明细") }}</h3>
          <div
            v-if="JSON.stringify(materialDetail) === '[]'"
            class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <hips-collapse v-if="headInfo.subjectMatterRule==='PACK'" v-model="activeNames" class="collapse-thine">
            <hips-collapse-item v-for="(item,index) in materialDetail" :key="index" :name="index">
              <div slot="title" >
                <div class="line-head">
                  <span class="line-name noWrap">{{ item.sectionName }}</span>
                  <span class="look-btn" @click.stop="getSupplierAssigned(bidHeaderId,item.bidLineItemId)">
                    {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                    <img class="image-gray-default" src="@/assets/icon_list_right_highlight@3x.png" >
                  </span>
                </div>
                <div class="line-body">
                  <div>
                    <span class="line-code">{{ $T("ssrc.bidHall.model.bidHall.sectionPacNum").$D("标段/包编号") }}:{{ item.sectionNum }}</span>
                    <span class="line-number">{{ $T("ssrc.bidHall.model.bidHall.lineNo").$D("行号") }}:{{ item.bidLineItemNum }}</span>
                  </div>
                  <span class="line-prompt">
                    {{ activeNames.length&&activeNames.join('').includes(index)?
                      $T("hipspfm.bidHall.view.button.hide").$D("收起"):
                      $T("hipspfm.bidHall.view.button.show").$D("展开")
                    }}
                    <img
                      :src="activeNames.length&&activeNames.join('').includes(index)?
                        require('@/assets/icon_list_down_grey_normal@3x.png'):
                        require('@/assets/icon_list_right_grey_normal@3x.png')">
                  </span>
                </div>
              </div>
              <div slot="right-icon" class="right-icon"/>
              <div v-for="(ele,i) in item.children" :key="i" class="card">
                <ul>
                  <li class="name-title">
                    <span>{{ $T('ssrc.bidHall.model.bidHall.itemName').$D('物料名称') }}：{{ ele.itemName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.itemCategory').$D('物料类别') }}：{{ ele.itemCategoryName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.itemCode').$D('物料编码') }}：{{ ele.itemCode }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.common.model.deliveryDate').$D('交期') }}：{{ ele.demandDate|CalcDate }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.quantity').$D('需求数量') }}：{{ ele.bidQuantity }}</span>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ ele.uomName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.costPrice').$D('标底单价') }}：{{ ele.costPrice }}</span>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率%') }}：{{ ele.taxRate }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.modal.inqueryHall.businessUnit').$D('业务实体') }}：{{ ele.ouName }}</span>
                  </li>
                  <li>
                    <span>{{ $T('ssrc.bidHall.model.bidHall.inventoryOrg').$D('库存组织') }}：{{ ele.invOrganizationName }}</span>
                  </li>
                  <!-- <li>
                    <span>{{ $T('ssrc.common.model.purchaseRequest').$D('采购申请') }}：{{ ele.attributeVarchar3 }}</span>
                  </li> -->
                </ul>
              </div>
            </hips-collapse-item>
          </hips-collapse>
          <div v-else class="card">
            <ul v-for="(item,index) in materialDetail" :key="index">
              <li class="name-title">
                <div class="item-name noWrap">
                  {{ $T('ssrc.bidHall.model.bidHall.itemName').$D('物料名称') }}：{{ item.itemName }}
                </div>
                <div class="item-num">{{ $T('ssrc.bidHall.model.bidHall.lineNo').$D('行号') }}：{{ item.bidLineItemNum }}</div>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.itemCategory').$D('物料类别') }}：{{ item.itemCategoryName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.itemCode').$D('物料编码') }}：{{ item.itemCode }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.common.model.deliveryDate').$D('交期') }}：{{ item.demandDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.bidQuantity').$D('需求数量') }}：{{ item.bidQuantity }}</span>
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.unit').$D('单位') }}：{{ item.uomName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.costPrice').$D('标底单价') }}：{{ item.costPrice }}</span>
                <span>{{ $T('ssrc.bidHall.model.bidHall.taxRate').$D('税率%') }}：{{ item.taxRate }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.modal.inqueryHall.businessUnit').$D('业务实体') }}：{{ item.ouName }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.inventoryOrg').$D('库存组织') }}：{{ item.invOrganizationName }}</span>
                <span class="card-btn" @click.stop="getSupplierAssigned(bidHeaderId,item.bidLineItemId)">
                  {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                  <img src="@/assets/icon_list_right_highlight@3x.png" >
                </span>
              </li>
              <!-- <li>
                <span>{{ $T('ssrc.common.model.purchaseRequest').$D('采购申请') }}：{{ item.attributeVarchar3 }}</span>
              </li>
              <li>
                <span>{{ $T('ssrc.bidHall.model.bidHall.lineNum').$D('采购申请行号') }}：{{ item.prLineNum }}</span>
                <span class="card-btn" @click.stop="getSupplierAssigned(bidHeaderId,item.bidLineItemId)">
                  {{ $T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商") }}
                  <img src="@/assets/icon_list_right_highlight@3x.png" />
                </span>
              </li> -->
            </ul>
          </div>
        </div>

        <!-- 投标信息 -->
        <div ref="bidInfo" class="infoContent bidInfo">
          <h3>{{ $T("hipspfm.workFlowbidHall.view.message.tab.bidDetails").$D("投标信息") }}</h3>
          <div v-if="JSON.stringify(bidInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.workFlow.view.message.noItemLineInfo").$D("暂无投标信息") }}</span>
          </div>
          <div v-else>
            <hips-collapse v-model="activeName">
              <hips-collapse-item v-for="(item,index) in bidInfo" :key="index" :name="index">
                <div slot="title">
                  <div class="collapse-title-a">
                    <span>{{ item.itemCode }}-{{ item.itemName }}</span>
                  </div>
                  <div class="collapse-title-b">
                    <span v-if="item.bidLineItemNum">{{ $T("ssrc.bidHall.modal.inEnquiryHall.lineNo.").$D("行号") }}：{{ item.bidLineItemNum }}</span>
                    <span v-if="item.bidQuantity">{{ $T("ssrc.bidHall.modal.inqueryHall.quantity").$D("数量") }}：{{ item.bidQuantity }}{{ item.uomName }}</span>
                    <span v-if="item.taxRate">{{ $T("ssrc.bidHall.model.bidHall.taxRate").$D("税率") }}：{{ item.taxRate }}%</span>
                    <span v-if="item.itemCategoryName">{{ item.itemCategoryName }}</span>
                  </div>
                </div>
                <div slot="right-icon" class="right-icon">
                  <img src="@/assets/icon_list_right_normal@3x.png" >
                </div>
                <div>
                  <div
                    v-for="(li,key) in item.quotationDetail"
                    :key="key"
                    class="collapse-info infoContent headInfo"
                    @click="showBidInfoDetail(li)">
                    <div class="headCompany">
                      <span class="block"/>
                      <span class="code">{{ $T("ssrc.bidHall.model.bidHall.supplierCode").$D("编码") }}：{{ li.supplierCompanyNum }}</span>
                    </div>
                    <ul>
                      <li>
                        <span>{{ $T("ssrc.bidHall.model.bidHall.sumScore").$D("总分") }}：<i class="font-blue">{{ li.sumScore }}</i></span>
                        <span>{{ $T("ssrc.bidHall.model.bidHall.validQuotationPrice").$D("报价单价") }}：{{ li.validQuotationPrice }}</span>
                      </li>
                      <li>
                        <span>{{ $T("ssrc.bidHall.model.bidHall.quotationTotalAmount").$D("报价总金额") }}：{{ li.totalAmountMeaning }}</span>
                        <span>{{ $T("ssrc.bidHall.model.bidHall.wetherWinbid").$D("是否中标") }}：{{ li.suggestedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(li.suggestedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
                      </li>
                      <li>
                        <span>{{ $T("ssrc.bidHall.model.bidHall.allottedQuantity").$D("中标数量") }}：{{ li.allottedQuantity }}</span>
                        <span>{{ $T("ssrc.bidHall.model.bidHall.allottedRatio").$D("中标比例") }}：{{ li.allottedRatioMeaning }}</span>
                      </li>
                      <li>
                        <span>{{ $T('ssrc.common.model.deliveryDate').$D('交期') }}：{{ li.demandDate|CalcDate }}</span>
                      </li>
                      <li>
                        <span>{{ $T('ssrc.common.model.guaranteePeriod').$D('质保期') }}：{{ li.attributeVarchar2 }}</span>
                      </li>
                    </ul>
                    <div class="footInfo">
                      <span>{{ $T("ssrc.bidHall.model.bidHall.supplierCompanyName").$D("名称") }}：{{ li.supplierCompanyName }}</span>
                    </div>
                  </div>
                </div>
              </hips-collapse-item>
            </hips-collapse>
          </div>
        </div>
      </div>
    </div>

    <!-- 行附件弹窗 -->
    <!-- <AttachedFile v-model="filePopup" :attachmentUuid="attachmentUuid"/> -->
    <!-- 供应商信息详情弹窗 -->
    <supplier-info v-model="supplierInfoPop" date-type="supplier" :supplier-assign-info="supplierAssignInfo"/>

    <!-- 招标结果详情弹窗 -->
    <calibration-bid-info-detail
      v-model="calibrationBidInfoDetailPop"
      :calibration-bid-info-detail="calibrationBidInfoDetail"/>
  </section>
</template>

<script>
// 招投标定标页
import BScroll from "better-scroll";
import SupplierInfo from "@/components/BidDetail/SupplierInfo";
import CalibrationBidInfoDetail from "./components/CalibrationBidInfoDetail";
import { Popup, NavBar, Collapse, CollapseItem } from "hips";
// import {
//   getCalibrationOrderHeadApi,
//   getCalibrationMaterialInfoApi,
//   getCalibrationBidInfoApi,
//   getSupplierAssignedApi,
//   getCalibrationSuppliersInfoApi
// } from "../../api/Jin";
import {
  getCalibrationOrderHeadApi,
  getCalibrationMaterialInfoApi,
  getCalibrationBidInfoApi,
  getSupplierAssignedApi,
  getCalibrationSuppliersInfoApi
} from "./api/Jin";
export default {
  modules: [ "ssrc.bidHall", "hipspfm.workFlowbidHall", "hipspfm.common", "hipspfm.bidHall", "ssrc.common", "hipspfm.workFlow", "hipspfm.workFlowbidHal" ],
  name: "CalibrationApproval",
  components: {
    CalibrationBidInfoDetail,
    SupplierInfo,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
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
      materialDetail: [], //物料信息
      bidInfo: [], //投标信息
      scroll: "",
      navScroll: "",
      activeName:[], // 招标
      activeNames: [], // 物料
      supplierCompanyId:"",
      filePopup: false,
      show: false,
      navIndex: 0,
      lengthArr: [],
      contentLenArr: [],
      attachmentUuid: "",
      bidHeaderId: null,
      supplierInfoPop: false,
      supplierAssignInfo: [], //专家分配信息
      calibrationBidInfoDetail:{},
      calibrationBidInfoDetailPop:false
    };
  },
  computed: {
    getNavArr() {
      let navArr = [
        {
          title: this.$T("ssrc.bidHall.view.message.tab.baseInfos").$D("基础信息"),
          ref: "headInfo"
        },
        {
          title: this.$T("ssrc.bidHall.model.bidHall.otherSupplementaryIssues").$D("其它信息"),
          ref: "otherInfo"
        },
        {
          title: this.$T("ssrc.bidHall.view.message.tab.itemDetails").$D("物料明细"),
          ref: "lineInfo"
        },
        {
          title: this.$T("hipspfm.workFlowbidHall.view.message.tab.bidDetails").$D("投标信息"),
          ref: "bidInfo"
        },
      ];
      return navArr;
    }
  },
  watch: {
    // activeNames: {
    //   handler() {
    //     console.log(this.activeNames)
    //     setTimeout(()=>this.refreshScroll(),100)
    //   },
    //   deep: true,
    // },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getCalibrationOrderHead();
        await this.getCalibrationMaterialInfo();
        await this.getCalibrationSuppliersInfo();
        await this.getCalibrationBidInfo();
        await this.getCalibrationBidDetail();
        this.bidHeaderId = this.changeReqId;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowbidHall.view.message.title.calibrationApproval").$D("招标定标结果审批"));
    this.navScroll = new BScroll(this.$refs.navWrap, {
      scrollX: true,
      click: true
    });
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
  },
  methods: {
    // 获取申请头信息
    async getCalibrationOrderHead() {
      const params = {
        customizeUnitCode: "SSRC.BID_HALL_CHECK_PRICE.HEADER,SSRC.BID_HALL_CHECK_PRICE.OTHER_INFO"
      };
      await getCalibrationOrderHeadApi(this.changeReqId, params).then((res) => {
        this.headInfo = res;
        // this.$emit("GetAttachmentUuid", attachmentUuid);
      });
    },
    // 获取物料信息
    async getCalibrationMaterialInfo() {
      const params = {
        page:0,
        size:500
      };
      await getCalibrationMaterialInfoApi(this.changeReqId, params).then((res) => {
        this.materialDetail = res;
      }
      );
    },
    // 获取供应商维度信息
    async getCalibrationSuppliersInfo() {
      const params = {
        bidHeaderId:this.changeReqId,
        organizationId:window.localStorage.getItem("organizationId"),
        page:0,
        size:500
      };
      await getCalibrationSuppliersInfoApi(this.changeReqId, params).then((res) => {
        this.supplierCompanyId = res[0].supplierCompanyId || "";
        if (!this.supplierCompanyId) {
          this.$notification.open({
            message:"supplierCompanyId cannot be empty!",
            key,
            class: "notification"
          });
        }
      });
    },
    // 获取投标信息
    async getCalibrationBidInfo() {
      const params = {
        bidHeaderId:this.changeReqId,
        customizeUnitCode:"SSRC.BID_HALL_CHECK_PRICE.TAB_SUPPLIER",
        supplierCompanyId:this.supplierCompanyId,
        page:0,
        size:500
      };
      await getCalibrationBidInfoApi(params).then((res) => {
        this.bidInfo = res.content;
        let length = this.bidInfo.length - 1;
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
      );
    },
    // 投标展开信息
    async getCalibrationBidDetail() {
      this.$loading.show();
      let promiseArr = [];
      console.log(this.bidInfo);
      this.bidInfo.map((item) => {
        // eslint-disable-next-line no-unused-vars
        let temp = new Promise((resolve, reject) => {
          const params = {
            page: 0,
            size: 500,
            customizeUnitCode:"SSRC.BID_HALL_CHECK_PRICE.TAB_ITEM",
            bidHeaderId: this.changeReqId,
            bidLineItemId: item.bidLineItemId
          };
          // console.log(13);
          getCalibrationBidInfoApi(params).then((res) => {
            if (res && !res.empty) {
              item.quotationDetail = res.content;
              resolve();
            }
          });
        });
        promiseArr.push(temp);
      });
      Promise.all(promiseArr)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          this.$forceUpdate();
          this.$refreshScroll();
          this.$loading.hide();
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取招投标供应商分配信息
    getSupplierAssigned(bidHeaderId, bidLineItemId) {
      getSupplierAssignedApi(bidHeaderId, bidLineItemId).then((res) => {
        this.supplierAssignInfo = res;
        this.supplierInfoPop = true;
        // console.log(this.supplierAssignInfo, "supplierAssignInfo......");
      });
    },
    // 招标信息详情页
    showBidInfoDetail(data) {
      data.bidNum = this.headInfo.bidNum;
      data.bidTitle = this.headInfo.bidTitle;
      this.calibrationBidInfoDetail = data;
      this.calibrationBidInfoDetailPop = !this.calibrationBidInfoDetailPop;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    },
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color:var(--color-font-default);
}
.font-blue {
  color: var(--color-other-default-b) !important;
}
.closeFont {
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c) !important;
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

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    // overflow-x: auto;
    position: relative;
    z-index: 999;

    &::-webkit-scrollbar {
      display: none;
    }

    .navContent {
      width: 200%;
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

>>> .hips-collapse-item__title .right-icon img {
  -webkit-transform: rotateZ(0) !important;
  transform: rotateZ(0) !important;
}

>>> .hips-collapse-item__title--expanded .right-icon img {
  -webkit-transform: rotateZ(90deg) !important;
  transform: rotateZ(90deg) !important;
}

  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    .content {
      .infoContent {
        h3 {
          padding: 20px 20px 12px;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background:var(--color-bg-default-b);
        }

      }
      .noContent {
        height:78px;
        padding-left: 20px;
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
            color: var(--color-font-default,#1b1e2b);
            line-height: 24px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: #C6CAD6;
              text-align: right;
              line-height: 22px;
              font-weight: bold;
            }
          }
        }
    .footInfo {
      padding: 12px 15px 12px 20px;
      border-bottom: 8px solid #F0F2F5;
      font-family: PingFangSC-Medium;
      color: var(--color-font-default,#1b1e2b);
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
              color: var(--color-font-default,#1b1e2b);
              line-height: 22px;
            }
          }
        }
      }
    .bidInfo {
        >>> .hips-cell {
          padding: 17px 20px 13px 20px;
          position: static;
        }

        font-family: PingFangSC-Medium;

        .collapse-title-a {
          margin-bottom: 4px;

          // span:nth-child(1) {
          //   font-size: 10px;
          //   color: var(--color-other-default-b);
          //   line-height: 18px;
          //   padding: 0px 4px;
          //   display: inline-block;
          //   border: 1px solid var(--color-other-default-b);
          //   border-radius: 2px;
          //   margin-right: 8px;
          // }

          span:nth-child(1) {
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

        .collapse-info {
          background: var(--color-bg-default);
        }
      }
  }
}

>>> .hips-cell {
  padding: 14px 20px;
}
.collapse-thine{
  >>> .hips-cell{
      position: static;
      border-bottom:1px solid var(--color-border-default);
  }
  >>> .hips-collapse-item:not(:last-child){
    border-bottom:8px solid var(--color-border-default);
  }
}
.wrap {
  height: auto !important;
  line-height: 24px !important;
}

.line-head{
  display: flex;
  align-items: center;
  justify-content space-between;
  .line-name{
    font-size: 16px;
    color:var(--color-font-default);
    line-height: 24px;
    font-weight: bold;
    display: inline-block;
    // width: 245px;
  }
  .look-btn{
    display: flex;
    align-items: center;
    margin-left: 15px;
    font-size: 12px;
    color: var(--color-other-default-b);
    line-height: 20px;
    img {
      height 16px;
      width 16px;
    }
  }
}
.line-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .line-code {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    padding: 0 4px;
    font-size: 10px;
    color:var(--color-font-default-c);
    border-radius: 2px;
    background:var(--color-bg-default-d,rgba(65,70,96,0.1));
  }
  .line-number {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    margin-left: 8px;
    padding: 0 4px;
    font-size: 10px;
    color: var(--color-other-default-b);
    line-height: 18px;
    border-radius: 2px;
    background:var(--color-bg-default-c);
  }
  .line-prompt {
    display: flex;
    align-items: center;
    font-size: 12px;
    color:var(--color-font-default-b);
    text-align: right;
    line-height: 20px;
    img {
      height: 16px;
      width: 16px;
    }
  }
}

.card:not(:last-child){
  border-bottom: 2.133vw solid var(--color-border-default);
}
.card {
  width: 100%;
  color: #666666;
  background:var(--color-bg-default);
  .card-btn {
    font-size: 12px;
    color: var(--color-other-default-b);
    float: right;
    text-align:right;
    img {
      height 16px;
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
      color:var(--color-font-default);
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

    .noWrap{
      width: 260px;
    }

    .head-num, .line-num {
      span {
        font-size: 14px;
        color: var(--color-font-default-e);
      }
    }
  }
  .sub-single-title{
    padding:0 20px;
    font-size: 16px;
    color:var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display:flex;
    align-items:center;
    border-bottom:1px solid var(--color-border-default);
    .percent{
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
      height: 32px;
      margin-top: 2px;
      font-size: 14px;
      color:var(--color-font-default);

      &:first-child {
        margin-top: 8px;
      }

      > span {
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;

        .fileBtn {
          color: var(--color-other-default-b);
        }
      }

      > span:nth-child(1) {
        text-align: left;
      }

    }

    .name-title {
      // display: block;
      display: flex;
      align-items: center;
      position: relative;
      // border-bottom:1px solid var(--color-border-default);

      span:first-child{
        font-size: 14px;
        color:var(--color-font-default);
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
        background:var(--color-bg-default-c);
        border-radius: 2px;
        margin-right: 8px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }
      .item-name {
          line-height:22px;
          padding:14px 0;
          font-weight:700;
      }
      .item-num {
        height: 20px;
        margin-left: 8px;
        padding: 0 4px;
        font-size: 10px;
        color: var(--color-other-default-b);
        line-height: 20px;
        border-radius: 2px;
        background:var(--color-bg-default-c);
      }
    }

    .name-title:before{
      content: '';
      display: inline-block;
      width: 6px;
      height: 14px;
      background: var(--color-other-default-b);
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%)

    }

  }
}
</style>
