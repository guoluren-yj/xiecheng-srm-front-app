<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup v-if="value" class="FullPop" style="height: 100%;width:100%" position="right">
    <div class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/icon_screenlist_delete_normal@3x.png" class="image-black-default" >
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('ssrc.inquiryHall.view.message.tab.allQuotationDetails').$D('供应商报价明细') }}
        </div>
      </hips-nav-bar>
      <div style="height: 100%" class="language-class-ul-li">
        <ul>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.company').$D('公司') }}</span>
            <span>{{ supplierQuotationDetail.companyName }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inqueryHall.categoryName').$D('物料类别') }}</span>
            <span>{{ supplierQuotationDetail.categoryName }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.onThePlatform').$D('投放平台') }}</span>
            <span>{{ supplierQuotationDetail.lineBrand }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.isSuggestedFlag').$D('是否选用') }}</span>
            <span>{{ supplierQuotationDetail.suggestedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(supplierQuotationDetail.suggestedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.taxInclude').$D('是否含税') }}</span>
            <span>{{ supplierQuotationDetail.taxIncludedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(supplierQuotationDetail.taxIncludedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.taxRate').$D('税率（%）') }}</span>
            <span>{{ supplierQuotationDetail.taxRate }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.unitPrice').$D('单价') }}</span>
            <span>{{ supplierQuotationDetail.validQuotationPrice }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.linePrice').$D('行金额') }}</span>
            <span>{{ supplierQuotationDetail.totalPrice }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity').$D('可供数量') }}</span>
            <span>{{ supplierQuotationDetail.validQuotationQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.allottedQuantity').$D('分配数量') }}</span>
            <span>{{ supplierQuotationDetail.allottedQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.reason').$D('选用理由') }}</span>
            <span>{{ supplierQuotationDetail.suggestedRemark }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.termsOfPayment').$D('付款条件') }}</span>
            <span>{{ supplierQuotationDetail.attributeVarchar1 }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.qVFrom').$D('报价有效期从') }}</span>
            <span>{{ supplierQuotationDetail.validExpiryDateFrom|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.qVTo').$D('报价有效期至') }}</span>
            <span>{{ supplierQuotationDetail.validExpiryDateTo|CalcDate }}</span>
          </li>

          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.maximumPrice').$D('最高限价') }}</span>
            <span>{{ supplierQuotationDetail.maxLimitPrice }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.kanLiPrice').$D('刊例价') }}</span>
            <span>{{ supplierQuotationDetail.attributeDecimal1 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.mediaDiscount').$D('媒体折扣') }}</span>
            <span>{{ supplierQuotationDetail.attributeDecimal2 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.netPricePerMediaUnit').$D('媒体单位净价') }}</span>
            <span>{{ supplierQuotationDetail.attributeDecimal3 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.rebates').$D('返点') }}</span>
            <span>{{ supplierQuotationDetail.attributeDecimal4 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.theServiceFee').$D('服务费') }}</span>
            <span>{{ supplierQuotationDetail.attributeDecimal5 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.dateOfDemand-from').$D('需求日期-起') }}</span>
            <span>{{ supplierQuotationDetail.demandDate }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.pricingApproval.model.line.dateOfDemand-to').$D('需求日期-至') }}</span>
            <span>{{ supplierQuotationDetail.attributeDate1 }}</span>
          </li>

          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.quotationStatus').$D('报价状态') }}</span>
            <span>{{ supplierQuotationDetail.quotationLineStatusMeaning }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.referencePrice').$D('参考价') }}</span>
            <span>{{ supplierQuotationDetail.referencePrice }}</span>
          </li>
          <li class="language-attachment">
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.quotationDetail').$D('报价明细') }}</span>
            <span
              v-if="supplierQuotationDetail.quotationDetailFlag"
              class="font-blue"
              @click="showQuotationDetailPop(supplierQuotationDetail)">
              {{ $T('hipspfm.pricingApproval.view.message.title.checkTheQuotationDetails').$D('查看报价明细') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
            <span v-else class="font-gray">
              {{ $T('hipspfm.pricingApproval.view.message.title.checkTheQuotationDetails').$D('查看报价明细') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
          </li>
          <li class="language-attachment">
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.supplierLineAttachment').$D('供应商行附件') }}</span>
            <span
              v-if="supplierQuotationDetail.attachmentUuid"
              class="font-blue"
              @click="showFilePop(supplierQuotationDetail.attachmentUuid||uuid)">
              {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
            <span v-else class="font-gray">
              {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
              <img
                class="image-gray-default"
                src="@/assets/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <step-quotation-detail
      v-model="stepQuotationDetailPop"
      :step-quotation-detail="stepQuotationDetail"/>
    <quotation-detail
      v-if="quotationDetailPop"
      v-model="quotationDetailPop"
      :supplier-quotation-detail="quotationDetail"/>
  </hips-popup>
</template>

<script>
import { View, Input, Popup, NavBar } from "hips";
import uuid from "uuid";
import StepQuotationDetail from "./StepQuotationDetail";
import QuotationDetail from "./Quotation";
export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.pricingApproval", "hipspfm.common", "ssrc.supplierQuotation" ],
  name: "SupplierQuotationDetail",
  components: {
    StepQuotationDetail,
    QuotationDetail,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    supplierQuotationDetail: {
      type: Object,
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      uuid: "",
      // filePopup:false,
      stepQuotationDetail: {},
      stepQuotationDetailPop: false,
      quotationEchartsPop: false,
      quotationDetailPop:false,
      quotationDetail:{}
    };
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    showStepQuotationDetail(data) {
      this.stepQuotationDetail = data;
      this.stepQuotationDetailPop = !this.stepQuotationDetailPop;
    },
    showQuotationDetailPop(data) {
      this.quotationDetail = data;
      this.quotationDetailPop = !this.quotationDetailPop;
    }
    // showQuotationEcharts(data){
    //   // this.quotationEcharts = data;
    //   this.quotationEchartsPop = !this.quotationEchartsPop;
    // }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}

.font-gray {
  color: var(--color-font-default-e) !important;
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
    line-height: calc(26px + constant(safe-area-inset-top));
    line-height: calc(26px + env(safe-area-inset-top));
    font-weight: 700;
  }
  // .lineHead {
  //   padding: 8px 20px 12px;
  //   background-color: var(--color-font-default-d);
  //   font-family: 'PingFangSC-Medium';
  //   color: var(--color-font-default);
  //   font-size: 16px;
  //   line-height: 24px;
  //   border-bottom: 8px solid var(--color-border-default);

  //   li {
  //     padding: 0;
  //     margin-bottom: 9px;
  //     height: 24px;
  //     display: flex;
  //     color: var(--color-font-default-e);
  //   }

  //   p {
  //     span {
  //       color: var(--color-font-default);
  //       line-height: 24px;
  //       font-size: 16px;
  //       font-weight: 600;
  //     }
  //   }
  // }

  // .lineHead :nth-child(2) {
  //   margin-bottom: 8px;
  // }
}
</style>
