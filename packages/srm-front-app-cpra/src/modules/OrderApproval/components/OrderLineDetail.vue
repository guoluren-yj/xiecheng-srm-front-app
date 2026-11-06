<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div slot="left" class="left-button" @click="closeLineInfoDetail">
        <img class="image-black-default" src="@/assets/icon_navigationbars_off_normal@3x.png" >
      </div>
      <div slot="center" class="header">{{ $T('hipspfm.orderApproval.view.message.title.orderDetail').$D('订单详情') }}</div>
    </hips-nav-bar>
    <section class="headInfo">
      <li class="lineNum">
        <span>{{ $T('sodr.orderApproval.model.common.displayLineNum').$D('行号') }}：{{ lineInfoDetail.lineNum }}</span>
        <span>{{ $T('sodr.orderApproval.model.common.shipmentNum').$D('发运号') }}：{{ lineInfoDetail.displayLineLocationNum }}</span>
      </li>
      <li>
        <span>{{ $T('sodr.orderApproval.model.common.itemCode').$D('物料编码') }}：{{ lineInfoDetail.itemCode }}</span>
      </li>
      <li>
        <span>{{ $T('sodr.orderApproval.model.common.description').$D('物料名称') }}：{{ lineInfoDetail.itemName }}</span>
      </li>
    </section>

    <div class="prequalification-detail">
      <ul>
        <li class="edit-wrap">
          <span>{{ $T('sodr.orderApproval.model.common.unit').$D('单位') }}：</span>
          <span>{{ lineInfoDetail.uomCode }}/{{ lineInfoDetail.uomName }}</span>
        </li>

        <li>
          <span>{{ $T('sodr.orderApproval.model.common.quantity').$D('数量') }}：</span>
          <span>{{ lineInfoDetail.quantity }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.taxedEnteredUnitPrice').$D('原币含税单价') }}：</span>
          <span>{{ lineInfoDetail.enteredTaxIncludedPrice|CalcMoney }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.taxedLineAmount').$D('含税行金额') }}：</span>
          <span>{{ lineInfoDetail.taxIncludedLineAmount|CalcMoney }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.taxRate').$D('税率') }}(%)：</span>
          <span>{{ lineInfoDetail.taxRate?lineInfoDetail.taxRate:'0' }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.needByDate').$D('需求日期') }}：</span>
          <span>{{ lineInfoDetail.needByDate|CalcDate }}</span>
        </li>
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.committedDeliveryDate').$D('承诺交货日期') }}：</span>
          <span>{{ lineInfoDetail.promiseDeliveryDate|CalcDate }}</span>
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
        <li>
          <span>{{ $T('sodr.orderApproval.model.common.purchaserComments').$D('采购方行备注') }}：</span>
          <span>{{ lineInfoDetail.remark ? lineInfoDetail.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
        </li>
      </ul>
    </div>
  </hips-view>
</template>

<script>
import {
  View,
  NavBar,
  Input,
} from "hips";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.orderApproval", "sodr.orderApproval", "spuc.common", "hipspfm.common" ],
  name: "OrderLineDetail",
  components: {
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
    }
  },
  data() {
    return {
    };
  },
  computed: {
    getTenantNum() {
      return SrmUtil.getTenantNum();
    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
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

      &:nth-child(1) {
        // font-weight: 700;
      }
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

.prequalification-detail{
  // padding-bottom: 49px;
  padding-left: 20px;
  height: calc(100vh - 250px);
  overflow: auto;
  ul{
    li{
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      padding: 20px 20px 12px 0;

      &:last-child {
        align-items: center;
      }

      >>> .hips-input{
        width: 209px;
        padding: 0;
      }

      >>> .hips-input__input-value input::-webkit-input-placeholder {
        color:var(--color-font-default-b);
      }

      >>> .hips-input:first-child:after{
        border-top: none;
      }

      span{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;
        img{
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      .status{
        color: var(--color-other-default-c) !important;
      }

      .edit{
        display: flex;
        justify-content:  space-between;

        span{
          color:var(--color-font-default-b);
        }

        >>> .hips-switch__input {
          width: 36px !important;
          height: 22px !important;
        }
        >>> .hips-switch__input:after {
          width: 20px !important;
          height: 20px !important;
        }
      }

      .edit-input{
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      span:nth-child(1){
        width: 28vw;
      }
      span:nth-child(2){
        width: 237px;
        color:var(--color-font-default-b);
      }

      span.fileBtn{
        color: var(--color-other-default-b);
      }

    }

    .edit-wrap{
      align-items: center;
    }
  }
}

</style>
