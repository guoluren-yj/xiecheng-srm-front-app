<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/back@3x.png"
          class="image-black-default">
      </div>
      <div slot="center" class="header">
        {{ $T('sodr.writeOff.view.title.writeOff').$D('冲销') }}
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="top-section">
        <div>
          {{ $T('spfm.configServer.view.title.supplier').$D('供应商') }}：{{ list[0] && list[0].supplierCompanyName }}
        </div>
        <div>
          {{
            receiveOrderType === 'ASN' ? $T('sodr.common.model.common.slNum').$D('送货单号') : $T('sodr.common.model.common').$D('订单号')
          }}:{{ receiveOrderType === 'ASN' ? (list[0] && list[0].asnNum) : (list[0] && list[0].displayPoNum) }}
        </div>
        <div>
          <span>{{ $T('sodr.writeOff.model.acceptorOperate.people').$D('操作人') }}：</span>
          <span>
            <hips-input v-model="receivedBy"
                        :placeholder="$T('sodr.writeOff.view.write.acceptorOperate.people').$D('请输实际操作人')"
                        type="text"/>
            <img class="img-edit" src="@/assets/Reverse/icon_List_editor_normal@3x.png" alt>
          </span>
        </div>
      </div>
      <div ref="scroll" class="asn-list">
        <div v-for="(item,index) in linesList" :key="index" class="asn-item">
          <ul>
            <li>
              <span>{{ receiveOrderType === 'ASN' ? $T('sodr.writeOff.model.common.asnLineNum').$D('送货单行号') :$T('sodr.writeOff.model.common.orderLineNum').$D('送货单行号') }}: {{ item.displayLineNum }}</span>
              <span>
                <img
                  v-show="linesList.length>1"
                  class="img-edit-delete"
                  src="@/assets/DeliveryBill/icon_editor_deleted_normal@3x.png"
                  alt
                  @click="deleteLine(index)">
              </span>
            </li>
            <customize :columns="getLineColumns" :data-source="item" code="SMBL.REVERSE.DETAIL.LINE"/>
            <!-- <li>
              <span>{{ $T('hipspfm.reverse.model.line.ReceiveNumAndLineNum').$D('接收事务编号|行号') }}：</span>
              <span class="right-text">{{ item.displayTrxNum }}|{{ item.displayTrxLineNum }}</span>
            </li>
            <li>
              <span>{{ $T('sodr.writeOff.model.common.itemDescription').$D('物料名称') }}：</span>
              <span class="right-text">{{ item.itemName }}</span>
            </li>
            <li>
              <span>{{ $T('hipspfm.reverse.model.line.shipQuantityAndUnitName').$D('发货数量|单位') }}</span>
              <span class="right-text">{{ item.shipQuantity }}/{{ item.uomCode }}{{ item.uomName }}</span>
            </li>
            <li>
              <span>{{ $T('sodr.writeOff.model.common.permitReverseQuantity').$D('可冲销数量') }}</span>
              <span class="right-text">{{ item.permitReverseQuantity }}</span>
            </li>
            <li>
              <span>
                {{ $T('sodr.writeOff.model.common.writeOffQuantity').$D('冲销数量') }}
                <i style="color: #FD4B4B;font-size: 14px;">*</i>：
              </span>
              <span>
                <span class="right-text">
                  <hips-input
                    v-model="item.quantity"
                    :placeholder="$T('hipspfm.common.view.message.handlerOffQuantity').$D('请输入冲销数量')"
                    type="text"/>
                </span>
                <img class="img-edit" src="@/assets/Reverse/icon_List_editor_normal@3x.png" alt>
              </span>
            </li>
            <li>
              <span>{{ $T('sodr.common.model.common.inventoryName').$D('库房') }}：</span>
              <span class="right-text">{{ item.inventoryName }}</span>
            </li>
            <li>
              <span>{{ $T('sodr.common.model.common.locationName').$D('库位') }}：</span>
              <span class="right-text">{{ item.locationName }}</span>
            </li>
            <li>
              <span>{{ $T('sodr.writeOff.model.common.lineRemark').$D('行备注') }}：</span>
              <span>
                <span class="right-text">
                  <hips-input v-model="item.remark"
                              :placeholder="$T('hipspfm.common.view.message.handlerLineRemark').$D('可输入行备注')"
                              type="text"/>
                </span>
                <span class="right-img">
                  <img class="img-edit" src="@/assets/Reverse/icon_List_editor_normal@3x.png" alt>
                </span>
              </span>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
    <bottom-handler id="NoNeed" :btn-arr="btnArr" position="absolute"/>
  </hips-view>
</template>

<script>
import { View, Input, NavBar } from "hips";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import BottomHandler from "@/components/BottomHandler";
import { getListDetailApi, reverseApi } from "../api/index";

const storage = window.localStorage;
export default {
  modules: [ "hipspfm.reverse", "smbl.common", "sodr.writeOff", "spfm.configServer", "sodr.common", "hipspfm.common" ],
  name: "ReverseDetail",
  components: {
    BottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar
  },
  data() {
    return {
      linesList: [],
      receiveOrderType: "",
      list: [],
      reverseFlag: false,
      receivedBy: "", //实际操作人
    };
  },
  computed: {
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.reverse.model.line.ReceiveNumAndLineNum").$D("接收事务编号|行号"),
          fieldType: "TEXT",
          fieldCode: "displayTrxNum",
          render: (val, record) => record.displayTrxNum + "|" + record.displayTrxLineNum
        },
        {
          fieldName: this.$T("sodr.writeOff.model.common.itemDescription").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("hipspfm.reverse.model.line.shipQuantityAndUnitName").$D("发货数量|单位"),
          fieldType: "TEXT",
          fieldCode: "shipQuantity",
          render: (val, record) => record.unitCodeIsShow === "1" ? record.shipQuantity + "/" + record.uomCode + "/" + record.uomName : record.shipQuantity + "/" + record.uomName
        },
        {
          fieldName: this.$T("sodr.writeOff.model.common.permitReverseQuantity").$D("可冲销数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "permitReverseQuantity",
        },
        {
          fieldName: this.$T("sodr.writeOff.model.common.writeOffQuantity").$D("冲销数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "quantity",
          required: true,
          placeholder: this.$T("hipspfm.common.view.message.handlerOffQuantity").$D("请输入冲销数量"),
          precision: (val, record) => record.uomPrecision
        },
        {
          fieldName: this.$T("sodr.common.model.common.inventoryName").$D("库房"),
          fieldType: "TEXT",
          fieldCode: "inventoryName",
        },
        {
          fieldName: this.$T("sodr.common.model.common.locationName").$D("库位"),
          fieldType: "TEXT",
          fieldCode: "locationName",
        },
        {
          fieldName: this.$T("sodr.writeOff.model.common.lineRemark").$D("行备注"),
          fieldType: "INPUT",
          fieldCode: "remark",
          placeholder: this.$T("hipspfm.common.view.message.handlerLineRemark").$D("可输入行备注")
        },
      ];

      return columns;
    },
    btnArr() {
      return [
        {
          title: this.$T("hipspfm.reverse.model.common.AllReverse").$D("全部冲销"),
          color: "var(--color-font-default-d)",
          background: this.reverseFlag ? "var(--color-bg-default-f)" : "var(--color-other-default-b)",
          handler: () => {
            this.receiveData();
          }
        }
      ];
    }
  },
  watch: {},
  async mounted() {
    const { list, receiveOrderType } = this.$route.query;
    this.list = list;
    this.receiveOrderType = receiveOrderType;
    try {
      this.$loading.show();
      await this.getListDetail();
      this.loading = true;
      this.$loading.hide();
    } catch (err) {
      this.loading = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    //返回上一页
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //获取详情列表
    async getListDetail() {
      let listId = this.receiveOrderType === "ASN" ?
        this.list.map((item) => item.asnLineId) :
        this.list.map((item) => item.poLineLocationId);
      let params = {
        customizeUnitCode: "SODR.WRITE_OFF_DETAIL.GRID",
        receiveOrderType: this.receiveOrderType,
        lineIds: listId.length > 0 ? listId.join(",") : 0
      };
      this.$loading.show();
      await getListDetailApi(params).then((res) => {
        this.$loading.hide();
        if (res.content) {
          res.content.map((item) => {
            item.quantity = item.permitReverseQuantity;
            item.lineNum = item.displayAsnLineNum;
            this.linesList = res.content;
          });
        }
        //判断详情信息接口是否报错
        if (res.failed) {
          console.log("false", res.failed);
          this.reverseFlag = true;
        } else {
          console.log("success", res.failed);
          this.reverseFlag = false;
        }
      });
    },
    //删除行信息
    deleteLine(index) {
      this.linesList.splice(index, 1);
    },
    //冲销
    receiveData() {
      //详情页数据判断
      if (this.reverseFlag) {
        return;
      }
      this.$loading.show();
      this.linesList.forEach((line) => {
        line.lineNum = line.displayLineNum;
      });
      const params = {
        operator: storage.getItem("userName"),
        supplierName: this.list[0].supplierName,
        asnNum: this.list[0].asnNum,
        receivedBy: this.receivedBy,
        rcvTrxLines: this.linesList,
      };
      reverseApi(params).then((res) => {
        this.$loading.hide();
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            key,
            class: "notification",
            duration: 3
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            key,
            class: "notification",
            duration: 3
          });
          this.goBack();
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.left-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #1B1E2B;
  line-height: 24px;
  font-weight: bold;

  img {
    height: 12.7px;
    width: 15.3px;
    margin-right: 10.7px;
  }
}

.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: 600;
}

.right-button {
  margin-right: 15px;
  z-index: 1;
  color: var(--color-font-default-f);

  span {
    display: flex;
    align-items: center;
    width: 77px;
    height: 32px;
    padding: 7px 10px;
    background: var(--color-bg-default);
    border: 1px solid var(--color-border-default);
    border-radius: 18px;

    i {
      margin: 0px 8px;
    }
  }

  img {
    height: 18px;
    width: 18px;
  }
}

.content {
  .img-edit {
    height: 12.5px;
    width: 12.5px;
  }

  .img-edit-delete {
    height: 16.5px;
    width: 16.5px;
  }

  >>> .hips-input {
    padding: 0 !important;
    height: 20px !important;
    position: static !important;
    text-align: right;

    input {
      font-size: 14px !important;
      text-align: left !important;
      margin-left: 12.5px;
    }
  }

  >>> .hips-input__input-value input::-webkit-input-placeholder {
    color: var(--color-font-default-b) !important;
  }

  .top-section {
    border-bottom: 8px solid #F5F6FA;
    padding: 8px 15px;

    >>> .hips-input {
      width: 70.067vw;
      margin-right: 12px;
    }

    div:nth-child(1) {
      font-family: Alibaba-PuHuiTi-M;
      font-size: 16px;
      color: #1B1E2B;
      line-height: 20px;
      font-weight: bold;
    }

    div:nth-child(2) {
      font-family: Alibaba-PuHuiTi-M;
      font-size: 16px;
      color: #1B1E2B;
      line-height: 20px;
      font-weight: bold;
      margin-top 8px;
    }

    div:nth-child(3) {
      margin-top: 8px;
      font-family: Alibaba-PuHuiTi-R;
      font-size: 14px;
      color: #1B1E2B;
      line-height: 20px;
      display: flex;
      align-items: center;

      span {
        display: flex;
        align-items: center;
      }
    }
  }

  .asn-list {
    overflow: auto;
    height: calc(100vh - 173px);

    .right-text {
      width: 55.067vw;
    }

    .span-left {
      margin-left: 12.5px;
      width: 51.067vw;
    }

    .asn-item {
      border-bottom: 8px solid #F5F6FA;
      padding: 20px 15px;
      ul {
        li {
          font-size: 14px;
          line-height: 20px;
          color: #1B1E2B;
          margin: 20px 0px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          span:nth-child(2) {
            display: flex;
            align-items: center;
          }

          .arrow-right {
            height: 11.8px;
            width: 7.4px;
          }

          &:first-child {
            margin-top: 0;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

  }

}
</style>
