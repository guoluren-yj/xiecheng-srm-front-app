<template>
  <hips-popup v-model="value" class="FullPop" style="height:100%;width:100%" position="bottom">
    <div class="orderLineDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/Comp/icon_navigationbars_off_normal@3x.png" >
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('hipspfm.workFlowCata.model.common.purchaseLineInfo').$D('采购申请明细信息') }}
        </div>
      </hips-nav-bar>
      <section class="headInfo">
        <li class="lineNum">
          <span>{{ $T('sprm.common.model.common.lineNumber').$D('行号') }}：{{ lineInfoDetail.lineNum }}</span>
        </li>
        <li>
          <span>{{ $T('sprm.common.model.common.productNum').$D('商品编码') }}：{{ lineInfoDetail.productNum }}</span>
        </li>
        <li>
          <span>{{ $T('sprm.common.model.common.productName').$D('商品名称') }}：{{ lineInfoDetail.productName }}</span>
        </li>
      </section>

      <div class="prequalification-detail language-class-ul-li">
        <ul>
          <li>
            <span>{{ $T('sprm.common.model.common.catalogName').$D('商品目录') }}：</span>
            <span>{{ lineInfoDetail.catalogName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.itemName').$D('物料名称') }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.itemCode').$D('物料编码') }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.application').$D('应用') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar1 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.materialScience').$D('材料') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar2 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.surfaceTreatment').$D('表面处理') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar3 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.annualConsumption').$D('年用量') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar4 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.requirements').$D('测试/验收要求') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar5 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.standard').$D('包装标准') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar6 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.productNumber').$D('供应商/客户产品编号') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar7 }}</span>
          </li>
          <li>
            <span>{{ $T('entity.supplier.name').$D('供应商名称') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar11 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.category').$D('类别代码') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar8 }}</span>
          </li>
          <li>
            <span>{{ $T('hipspfm.workFlowCata.model.common.categoryName').$D('类别名称') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar10 }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.sumProject').$D('总账科目') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar9 }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.categoryName').$D('物料分类') }}：</span>
            <span>{{ lineInfoDetail.categoryName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.uomName').$D('单位') }}：</span>
            <span>{{ lineInfoDetail.uomCode }}/{{ lineInfoDetail.uomName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.quantity').$D('数量') }}：</span>
            <span>{{ lineInfoDetail.quantity }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.taxType').$D('税种') }}：</span>
            <span>{{ lineInfoDetail.taxCode }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.taxRate').$D('税率') }}(%)：</span>
            <span>{{ lineInfoDetail.taxRate?lineInfoDetail.taxRate:'0' }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.currencyCode').$D('币种') }}：</span>
            <span>{{ lineInfoDetail.currencyCode }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.taxIncludedUnitPrice').$D('预估单价（含税）') }}：</span>
            <span>{{ lineInfoDetail.taxIncludedUnitPrice|CalcMoney }}</span>
          </li>
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.budgetIoFlag').$D('预算外标识') }}：</span>
            <span>{{ lineInfoDetail.budgetIoFlag == 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
          </li> -->
          <li>
            <span>{{ $T('sprm.common.model.common.linePrice').$D('行金额') }}：</span>
            <span>{{ lineInfoDetail.taxIncludedLineAmount|CalcMoney }}</span>
          </li>
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.taxIncludedUnitPrice').$D('预算单价(含税)') }}：</span>
            <span>{{ lineInfoDetail.displayPrLineNum }}</span>
          </li> -->
          <li>
            <span>{{ $T('sprm.common.model.common.neededDate').$D('需求日期') }}：</span>
            <span>{{ lineInfoDetail.neededDate | CalcDate }}</span>
          </li>
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.costCenter').$D('成本中心') }}：</span>
            <span>{{ lineInfoDetail.displayPrNum }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.sumProject').$D('总账科目') }}：</span>
            <span>{{ lineInfoDetail.displayPrLineNum }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.wbs').$D('WBS元素') }}：</span>
            <span>{{ lineInfoDetail.wbs }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.companyName').$D('公司') }}：</span>
            <span>{{ lineInfoDetail.companyName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.companyTeam').$D('采购组织') }}：</span>
            <span>{{ lineInfoDetail.purchaseOrgName }}</span>
          </li> -->
          <li>
            <span>{{ $T('sprm.common.model.common.purchaseAgentName').$D('采购员') }}：</span>
            <span>{{ lineInfoDetail.purchaseAgentName }}</span>
          </li>
          <!-- <li>
            <span>{{ $T('entity.supplier.tag').$D('供应商') }}：</span>
            <span>{{ lineInfoDetail.supplierCompanyName }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.contractNum').$D('协议编号') }}：</span>
            <span>{{ lineInfoDetail.displayPrLineNum }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.applicant').$D('申请人') }}：</span>
            <span>{{ lineInfoDetail.prRequestedName }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.moneyPayPart').$D('费用承担部门') }}：</span>
            <span>{{ lineInfoDetail.expBearDep }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.purchaseReqCreation.model.common.lastPurPrice').$D('上次采购单价') }}：</span>
            <span>{{ lineInfoDetail.displayPrNum }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.purchaseReqInquiry.model.common.historicalInquirySheet').$D('历史询价单') }}：</span>
            <span>{{ lineInfoDetail.displayPrLineNum }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.inpaperNum').$D('内部订单号') }}：</span>
            <span>{{ lineInfoDetail.innerPoNum }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.itemModel').$D('型号') }}：</span>
            <span>{{ lineInfoDetail.displayPrLineNum }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.itemSpecs').$D('规格') }}：</span>
            <span>{{ lineInfoDetail.displayPrNum }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.quantityStandard').$D('质量标准') }}：</span>
            <span>{{ lineInfoDetail.displayPrLineNum }}</span>
          </li> -->
          <li>
            <span>{{ $T('hipspfm.common.message.remark').$D('备注') }}：</span>
            <span>{{ lineInfoDetail.remark }}</span>
          </li>
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.class').$D('属性') }}：</span>
            <span>{{ lineInfoDetail.itemPropertiesMeaning }}</span>
          </li> -->
          <!-- <li>
            <span>{{ $T('sprm.common.model.common.takeman').$D('验收人') }}：</span>
            <span>{{ lineInfoDetail.accepterUserName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.keepMan').$D('保管人') }}：</span>
            <span>{{ lineInfoDetail.keeperUserName }}</span>
          </li>
          <li>
            <span>{{ $T('sprm.common.model.common.address').$D('地点') }}：</span>
            <span>{{ lineInfoDetail.addressMeaning }}</span>
          </li> -->
          <li class="language-attachment">
            <span>{{ $T('entity.attachment.tag').$D('附件') }}：</span>
            <span
              v-if="lineInfoDetail.attachmentUuid"
              class="font-blue"
              @click="showFilePop(lineInfoDetail.attachmentUuid||uuid)">
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
  </hips-popup>
</template>

<script>
import { View, NavBar, Input, Popup } from "hips";
import uuid from "uuid";
export default {
  modules: [ "hipspfm.workFlowCata","sprm.common","hipspfm.common","entity.supplier","entity.attachment" ],
  name: "YHL-CataReqLineDetail",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    lineInfoDetail: {
      type: Object
    },
    showFilePop:{
      type: Function
    }
  },
  data() {
    return {
      uuid: "",
    };
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue{
   color:var(--color-other-default-b) !important;
}
.orderLineDetail {
  height: 100%;
  position: relative;

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
    padding: 12px 20px 12px 20px;
    border-bottom: solid 8px var(--color-border-default);

    li {
      display: flex;
      margin-bottom: 4px;
      justify-content: space-between;
      font-weight bold
      span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        display: inline-block;
        color: var(--color-font-default);
        line-height: 24px;

        &:nth-child(1) {
          // font-weight: 700;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .lineNum {
      span {
        font-size: 16px;
        color: var(--color-font-default-e);
      }
    }
  }

  .prequalification-detail {
    height: calc(100vh - 176px);
  }
}
</style>
