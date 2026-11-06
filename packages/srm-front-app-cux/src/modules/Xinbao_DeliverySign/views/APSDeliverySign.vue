<template>
  <div style="height: 100vh" class="aps-delivery-sign">
    <NavHead
      :title="$T('smbl.common.view.title.deliverySign').$D('送货签到')"
      @goTop="goTop"
      @goClose="goClose"
      @goBack="goBack"/>
    <div class="delivery-selection">
      <!--分公司-->
      <srm-lov-field
        v-model="companyId"
        code="SINV.ASN_CUSTOMER"
        :placeholder="
          $T('smbl.common.view.selectSubCompany').$D('请选择分公司')
        "
        theme="fill"
        :options="{
          queryField: 'companyName',
          displayField: 'companyName',
          subDisplayField: 'companyNum',
        }"
        @inputChange="onSelectedCompany">
        <span slot="left">{{ $T("smbl.common.view.subCompany").$D("分公司") }}：</span>
      </srm-lov-field>
      <div class="bottom">
        <div class="left">
          <!--制单日期--->
          <srm-calendar-field
            placeholder=""
            @inputChange="onSelectedMakeOrderDate">
            <span slot="left">{{
              $T("scux.longNotReconciled.model.creationDate").$D("制单日期")
            }}:</span>
          </srm-calendar-field>
        </div>
      </div>
    </div>
    <!-- 物料详情 -->
    <div class="material-detail">
      <div v-if="marterialDetailList.length>0" class="material-content">
        <hips-collapse v-model="activeNames">
          <hips-collapse-item v-for="(item,index) in marterialDetailList" :key="index" :name="index">
            <div slot="title"> <srm-checkbox v-model="item.checked" @click.native.stop>{{ item.asnNum }}</srm-checkbox></div>
            <div slot="right-icon" style="line-height:54px"><span :class="activeNames.includes(index)?arrowIconDown:arrowIconRight"/></div>
            <span class="material-name">{{ item.lineInfo.itemName }}</span>
            <span class="material-code">{{
              $T("scux.purchaseRecordApproval.model.materialsCode").$D(
                "物料编码"
              )
            }}:{{ item.lineInfo.itemCode }}</span>
            <div class="number-detail">
              <span class="order-number">{{
                $T("smbl.common.view.purchasePoNum").$D("采购单号")
              }}：{{ item.lineInfo.displayPoNum }}</span>
              <span class="line-number">{{ $T("scux.sendBill.model.lineNum").$D("行号") }}:{{ item.lineInfo.asnLineNum }}</span>
            </div>
          </hips-collapse-item>
        </hips-collapse>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div v-if="marterialDetailList.length>0" style="position:fixed;bottom:10px">
      <BottomHandler :btn-arr="getBtnArr" />
      <srm-checkbox v-model="isSelectAll" style="margin:0 0 10px 10px">{{ $T("smbl.common.button.selectAll").$D("全选") }}</srm-checkbox>
    </div>
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import BottomHandler from "@/components/V5/BottomHandler";
import { SrmLovField, SrmCalendarField, SrmCheckbox } from "srm-mobile-ui";
import {
  Collapse, CollapseItem,Icon
} from "hips";
import { getMaintainDeliveryListApi,getMaterialLineInfoApi,deliverySubmitApi } from "../api/index";
export default {
  modules: [ "smbl.common","scux.longNotReconciled","scux.purchaseRecordApproval","scux.sendBill" ],
  name: "APSDeliverySign",
  components: {
    NavHead,
    SrmLovField,
    SrmCalendarField,
    SrmCheckbox,
    BottomHandler,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Icon.name]: Icon,
  },
  data() {
    return {
      companyId: "",//公司ID
      makeOrderDate: "",//制单日期
      marterialDetailList:[],//物料详情列表
      activeNames:[],//选中订单列表names
      arrowIconRight:"srm-icon icon-chevron-right",//右箭头class
      arrowIconDown:"srm-icon icon-chevron-down",//下箭头class
    };
  },
  computed: {
    //选中列表项的数量
    checkedSize() {
      return this.marterialDetailList.reduce((pre,item)=> pre + (item.checked ? 1 : 0),0);
    },
    //选中列表项的数据
    checkedList() {
      return this.marterialDetailList.filter((item)=>{
        return item.checked;
      });
    },
    //是否全部选中
    isSelectAll: {
      get() {
        // eslint-disable-next-line eqeqeq
        return this.marterialDetailList.length > 0 && this.marterialDetailList.length == this.checkedSize;
      },
      set(value) {
        this.selectAllOrNotAll(value);
      }
    },
    //底部按钮
    getBtnArr() {
      const arr = [
        {
          title: this.$T("smbl.common.button.confirm").$D("确定"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          handler: () => {
            if (this.checkedSize > 0) {
              const that = this;

              this.$hips.dialog.confirm({
                closable: false,
                title: this.$T("smbl.common.message.tip").$D("提示"),
                content: this.$T(
                  "smbl.common.message.confirm.preOrder"
                ).$D("确认发起预约吗"),
                okText: this.$T("smbl.common.button.confirm").$D("确定"),
                cancelText: this.$T("smbl.common.view.button.cancel").$D(
                  "取消"
                ),
                onOk() {
                  that.deliverySubmit();
                },
                onCancel() {
                  // on cancel
                },
              });
            } else {
              this.$hips.dialog.alert({
                title: this.$T("smbl.common.message.tip").$D("提示"),
                content:this.$T("smbl.common.message.selectPreOrder").$D("请先选择需要预约的订单"),
                okText: this.$T("smbl.common.button.confirm").$D("确定"),
                closable: false,
                onOk() {
                },
              });
            }
          },
        },
      ];

      return arr;
    },
  },
  methods: {
    //选中公司的回调函数
    onSelectedCompany(val) {
      this.companyId = val;
      this.makeOrderDate && this.fetchMaintainData();
    },
    //选中送货时间的回调
    onSelectedMakeOrderDate(val) {
      this.makeOrderDate = val;
      this.companyId && this.fetchMaintainData();
    },
    // 请求维护送货单数据
    fetchMaintainData() {
      const params = {
        companyId: this.companyId, //客户
        creationDateFrom: this.makeOrderDate ? `${this.makeOrderDate} 00:00:00` : "", //创建日期从
        creationDateTo: this.makeOrderDate ? `${this.makeOrderDate} 00:00:00` : "", //创建日期至
        supplierTenantId: window.localStorage.supplierTenantId, //供应商租户ID
      };

      this.loadings = true;
      this.$loading.show();
      getMaintainDeliveryListApi(params).then(async (res) => {
        // eslint-disable-next-line no-unused-vars
        for (let item of res.content) {
          item.checked = false;
          item.shipDate = item.shipDate + " 00:00:00";
          // eslint-disable-next-line no-shadow
          await getMaterialLineInfoApi(item.asnHeaderId).then((res)=>{
            item.lineInfo = res[0];
          });
        }
        this.marterialDetailList = res.content;
        this.loadings = false;
        this.$loading.hide();
      });
    },
    //送货单提交
    async deliverySubmit() {
      await deliverySubmitApi(this.checkedList).then(()=>{
        this.fetchMaintainData();
        this.$notification.open({
          message:this.$T("smbl.common.message.preOrderComplete").$D("预约完成"),
          key,
          class: "notification"
        });
      });
    },
    //全选按钮的操作
    selectAllOrNotAll(isChecked) {
      this.marterialDetailList.forEach((item)=>{
        item.checked = isChecked;
      });
    },
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        // eslint-disable-next-line no-undef
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.tab-active-color {
  color: var(--color-other-default-b) !important;
}

>>> .delivery-selection>.srm-field-wrapper-container {
  .srm-field-wrapper {
    background: #f6f6f6;

    .srm-lov-placeholder {
      color: #afafaf;
    }
  }
}

>>> .srm-field-wrapper-empty {
  background: #eff3fe;
}

>>> .srm-field-wrapper-container {
  margin-bottom: 12px;

  .srm-field-wrapper {
    height: 40px;

    .srm-lov-placeholder, .srm-date-placeholder {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #333;
    }

    .icon-chevron-right::before {
      color: #afafaf;
    }
  }
}

>>> .srm-button-fill-primary {
  position: fixed;
  right: 15px;
}
>>> .bottom-handler{
  justify-content: flex-end;
}
>>>.bottom-handler  .btn-item{
  flex:0;
  flex-basis :60px;
  height:36px;
  line-height :10px;
}
>>> .srm-check-box{
  width:auto;
}

>>> .hips-collapse{
  position :static;
}
>>> .hips-icon-arrow{
  color: #afafaf;
}
>>> .hips-collapse-item{
   border-bottom:1px solid #F6F6F6;
}
>>> .hips-cell{
  height:100%;
  padding:0 15px;
  box-sizing: border-box;
}
>>> .hips-cell__title div{
  height:100%;
  display:flex;
}
>>> .icon-chevron-right:before,.icon-chevron-down:before {
    font-size: 20px;
    color: #afafaf;
  }
>>> .hips-collapse-item__content{
    padding-left: 30px;
    display: flex;
    flex-direction: column;
}
>>> .hips-collapse-item__wrapper{
  height :100%;
}
>>> .material-code{
  margin-bottom :0;
}
>>> .srm-check-box-content{
  margin-left :8px;
}
>>> .srm-check-box-button-checked{
  line-height :18px;
}
.order-card {
  padding: 16px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #F6F6F6;

  .display-ponum {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }
}

.aps-delivery-sign {
  background: #f0f2f5;
  overflow: scroll;

  .delivery-selection {
    box-sizing: border-box;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding: 16px 15px 16px 15px;
    background-color: var(--color-bg-default);

    .bottom {
      display: flex;
      justify-content: space-between;

      .left {
        flex: 1;
      }
    }

    span {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #333333;
      margin-left: 12px;
      margin-right: 5px;
    }
  }

  .material-detail {
    background: var(--color-bg-default);

    .material-content {
      display: flex;
      flex-direction: column;

      span {
        font-size: 14px;
        color: #1f1f1f;
        margin-bottom: 12px;

        &.material-name {
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
        }

        &.material-code {
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
        }
      }

      .number-detail {
        box-sizing: border-box;
        line-height: 20px;
        display: flex;
        flex-direction: column;

        span {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #1f1f1f;

          &.line-number {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
