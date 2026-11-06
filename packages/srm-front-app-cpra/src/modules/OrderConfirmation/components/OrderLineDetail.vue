<!--eslint-disable-->
<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div slot="left" class="left-button" @click="closeLineInfoDetail">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T('hipspfm.orderConfirmation.view.message.title.orderDetail').$D('订单详情') }}</div>
    </hips-nav-bar>
    <section class="headInfo">
      <li class="lineNum">
        <span>{{ $T('sodr.common.model.common.displayAsnLineNum').$D('行号') }}：{{ lineInfoDetail.lineNum }}</span>
        <span>{{ $T('sodr.common.model.common.displayLineLocationNum').$D('发运号') }}：{{ lineInfoDetail.displayLineLocationNum }}</span>
      </li>
      <li>
        <span>{{ $T('sodr.common.model.common.itemCode').$D('物料编码') }}：{{ lineInfoDetail.itemCode }}</span>
      </li>
      <li>
        <span>{{ $T('sodr.common.model.common.itemName').$D('物料名称') }}：{{ lineInfoDetail.itemName }}</span>
      </li>
    </section>

    <div class="prequalification-detail language-class-ul-li">
      <ul>
        <li class="edit-wrap">
          <span>{{ $T('sodr.common.model.common.unitName').$D('单位') }}</span>
          <span>{{ lineInfoDetail.uomCode }}/{{ lineInfoDetail.uomName }}</span>
        </li>
        <li class="edit-wrap">
          <span>{{ $T('sodr.common.model.number').$D('数量') }}<i class="require-span">*</i></span>
          <span :class="getQuantityClass">
            <hips-input
              v-model="lineInfoDetail.quantity"
              :readonly="!editFlagFunction('QUANTITY', false)"
              :change="lineQuantityChang(lineInfoDetail)"
              type="number">
              <div slot="right" class="img-icon">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </span>
        </li>
        <li>
          <span>{{ $T("sodr.confirmOrder.model.common.originalQuantity").$D("原需求数量") }}</span>
          <span>{{ lineInfoDetail.originalQuantity }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.confirmOrder.model.common.taxedEnteredUnitPrice').$D('原币含税单价') }}</span>
          <span>{{ lineInfoDetail.enteredTaxIncludedPrice|CalcMoney }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.confirmOrder.model.confirmOrder.taxedLineAmount').$D('含税行金额') }}</span>
          <span>{{ lineInfoDetail.taxIncludedLineAmount|CalcMoney }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.confirmOrder.model.confirmOrder.lineAmount').$D('不含税行金额') }}</span>
          <span >{{ lineInfoDetail.lineAmount|CalcMoney }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.common.model.common.taxrate').$D('税率(%)') }}</span>
          <span>{{ lineInfoDetail.taxRate?lineInfoDetail.taxRate:'0' }}</span>
        </li>
        <li>
          <span>{{ $T('odr.confirmOrder.model.common.needByDate').$D('需求日期') }}</span>
          <span>{{ lineInfoDetail.needByDate|CalcDate }}</span>
        </li>
        <li class="promiseDate" @click="showEditDatePop(lineInfoDetail.index)">
          <span>{{ $T('sodr.confirmOrder.model.common.promiseDeliveryDate').$D('承诺交货日期') }}<i class="require-span">*</i></span>
          <span
            v-if="lineInfoDetail.promiseDeliveryDate"
            :class="lineInfoDetail.promiseDeliveryDate===lineInfoDetail.needByDate?'':'redFont'">
            <!-- <span > -->
            {{ lineInfoDetail.promiseDeliveryDate|CalcDate }}
            <!-- </span> -->
            <img
              v-if="lineInfoDetail.promiseDeliveryDate===lineInfoDetail.needByDate"
              class="image-gray-default"
              src="@/assets/icon_list_date_normals@3x.png">
            <img
              v-else
              class="image-red-default"
              src="@/assets/icon_list_date_warning@3x.png">
          </span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1').$D('年级') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar1Meaning }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2').$D('学科') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar2Meaning }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3').$D('课程类别') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar3Meaning }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4').$D('总页码') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar4 }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5').$D('封面用纸') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar5 }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6').$D('封面印色') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar6Meaning }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7').$D('内文用纸') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar7 }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8').$D('内文印色') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar8Meaning }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9').$D('规格尺寸') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar9 }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10').$D('装订方式') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar10Meaning }}</span>
        </li>
        <li v-if="getTenantNum =='SRM-BJHL'">
          <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11').$D('工艺') }}：</span>
          <span>{{ lineInfoDetail.attributeVarchar11 }}</span>
        </li>
        <li class="feedBackInfo" @click.stop="showFeedBackInfoPop(lineInfoDetail.index,lineInfoDetail.feedback)">
          <span>{{ $T('sodr.confirmOrder.model.confirmOrder.feedbacks').$D('反馈信息') }}</span>
          <span>
            {{ lineInfoDetail.feedback?lineInfoDetail.feedback:$T('hipspfm.orderConfirmation.view.message.handlerFeedback').$D('请输入反馈信息') }}
            <img class="image-gray-default" src="@/assets/icon_editor@3x.png" >
          </span>
        </li>
        <li>
          <span>{{ $T('sodr.common.model.common.purchaserRemark').$D('采购方行备注') }}</span>
          <span>{{ lineInfoDetail.remark ? lineInfoDetail.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
        </li>
      </ul>
    </div>
    <!-- 承诺交货日期弹窗 -->
    <date-chooser v-model="showEditDate" :title="$T('sodr.confirmOrder.model.common.promiseDeliveryDate').$D('承诺交货日期')" @submitDate="handleConfirm" />
    <!-- 反馈信息弹窗 -->
    <info-pop v-model="showFeedBackInfo" @confirmInfo="confirmFeedBackInfo"/>
  </hips-view>
</template>

<script>
import {
  View,
  NavBar,
  Input,
} from "hips";
import InfoPop from "@/components/InfoPop";
import DateChooser from "@/components/DateChooser";
import { SrmMath, SrmUtil } from "srm-mobile-ui";
import BigNumber from "bignumber.js";

export default {
  modules: [ "hipspfm.orderConfirmation", "sodr.common", "sodr.confirmOrder", "odr.confirmOrder", "spuc.common", "hipspfm.common" ],
  name: "OrderLineDetail",
  components: {
    InfoPop,
    DateChooser,
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar,
  },
  props: {
    lineInfoDetail: {
      type: Object,
    },
    closeLineInfoDetail: {
      type: Function,
    },
    showFeedBackInfoPop: {
      type: Function,
    },
    handleConfirm: {
      type: Function,
    },
    showEditDatePop: {
      type: Function,
    },
    confirmFeedBackInfo: {
      type: Function,
    },
    lineQuantityChang: {
      type: Function,
    },
    editFlagFunction: {
      type: Function,
    }
  },
  data() {
    return {
      showEditDate: false,
      showFeedBackInfo: false,
    };
  },
  computed: {
    getTenantNum() {
      return SrmUtil.getTenantNum();
    },
    getQuantityClass() {
      return !SrmMath.isZero(SrmMath.minus(new BigNumber(this.lineInfoDetail.quantity), new BigNumber(this.lineInfoDetail.originalQuantity))) ?
        "quantity-span-red" :
        "";
    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
.redFont {
  color: var(--color-other-default) !important;
}
.header {
  font-size: 18px;
  line-height: 26px;
  font-weight: bold;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.headInfo {
  padding: 16px 20px 12px 20px;
  border-bottom: solid 8px var(--color-border-default);

  li {
    display: flex;
    margin-bottom: 8px;
    justify-content: space-between;

    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
      line-height: 24px;

    }
  }

  &:last-child{
    margin-bottom: 0;
  }

  .lineNum{
    span{
      font-size: 16px;
      color: var(--color-font-default-e);
    }
  }
}

>>> .hips-input{
  padding: 0;
}

.prequalification-detail{
  height: calc(100vh - 240px);
  img {
    width: 16px;
    height: 16px;
  }
  .feedBackInfo,.promiseDate {
    span:nth-child(2){
      display: flex;
      justify-content: space-between;
    }
  }
  // padding-left: 20px;
  // ul{
  //   li{
  //     display: flex;
  //     border-bottom:1px solid var(--color-border-default);
  //     padding: 20px 20px 12px 0;
  //     &:last-child {
  //       align-items: center;
  //     }

  //     >>> .hips-input{
  //       width: 209px;
  //       padding: 0;
  //     }

  //     >>> .hips-input__input-value input::-webkit-input-placeholder {
  //       color:var(--color-font-default-b);
  //     }

  //     >>> .hips-input:first-child:after{
  //       border-top: none;
  //     }

  //     span{
  //       font-family: PingFangSC-Regular;
  //       font-size: 14px;
  //       color:var(--color-font-default);
  //       line-height: 22px;
  //       img{
  //         width: 16px;
  //         height: 16px;
  //         float: right;
  //       }
  //     }

  //     .status{
  //       color: var(--color-other-default-c) !important;
  //     }

  //     .edit{
  //       display: flex;
  //       justify-content:  space-between;

  //       span{
  //         color:var(--color-font-default-b);
  //       }

  //       >>> .hips-switch__input {
  //         width: 36px !important;
  //         height: 22px !important;
  //       }
  //       >>> .hips-switch__input:after {
  //         width: 20px !important;
  //         height: 20px !important;
  //       }
  //     }

  //     span:nth-child(1){
  //       width: 28vw;
  //     }
  //     span:nth-child(2){
  //       width: 235px;
  //       color:var(--color-font-default-b);
  //     }

  //     span.fileBtn{
  //       color: var(--color-other-default-b);
  //     }

  //   }

  //   .edit-wrap{
  //     align-items: center;
  //   }
  // }
  .quantity-span-red {
    color: red;
  }
}

</style>
