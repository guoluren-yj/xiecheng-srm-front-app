<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-view>
    <div class="content">
      <div class="top-section">
        <div>{{ $T("sinv.common.model.common.supplierCompanyName").$D("供应商") }}：{{ createList[0]&&createList[0].supplierCompanyName }}</div>
        <div>
          <span>{{ $T("sinv.common.model.common.acceptorName").$D("验收人") }}：</span>
          <span>
            <!-- eslint-disable-next-line rulesdir/no_hips -->
            <hips-input :placeholder="$T('sinv.common.view.write.common.acceptorName').$D('请输入验收人')" type="text" />
            <img class="img-edit" src="@/assets/Receive/icon_List_editor_normal@3x.png" alt >
          </span>
        </div>
      </div>
      <div ref="scroll" class="asn-list">
        <div v-for="(item,index) in createList" :key="index" class="asn-item">
          <ul>
            <customize :columns="getLineColumns" :data-source="item" code="SMBL.RECEIVE.DETAIL.LINE"/>
            <li>
              <span>{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：{{ item.displayLineNum }}</span>
              <img
                v-show="createList.length>1"
                src="@/assets/Receive/icon_Form_deleted_error@3x.png"
                alt
                @click="deleteLine(index)">
            </li>
          </ul>
        </div>
      </div>
    </div>
    <lov
      v-if="LovPop"
      v-model="LovPop"
      :code="LovCode"
      :query-params="LovParams"
      @submitValue="GetValue"/>
    <srm-bottom-handler id="NoNeed" :btn-arr="btnArr" position="absolute" />
  </hips-view>
</template>

<script>
import Lov from "@/components/Lov";
import { View, Input, NavBar } from "hips";
import { getListDetailApi, receiveApi } from "../api/index";
export default {
  modules: [ "sinv.purchaseReception", "smbl.common", "sinv.common", "sinv.purchaseReceipt" ],
  name: "ReceiveDetail",
  components: {
    Lov,
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar
  },
  data() {
    return {
      createList: [],
      LovPop: false,
      datePop: false,
      choseedDate: "", //选中的时间
      LovCode: "",
      LovParams: {},
      tempIndex: 0,
      dateIndex: 0,
      tempType: "",
      receiveOrderType: "",
      list: []
    };
  },
  computed: {
    getLineColumns() {
      const columns = [
        {
          fieldName: this.receiveOrderType === "ASN" ? this.$T("sinv.common.model.common.asnNum").$D("送货单号") : this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
          fieldType: "TEXT",
          fieldCode: "asnNum",
          langCode: this.receiveOrderType === "ASN" ? "sinv.common.model.common.asnNum" : "sinv.common.model.common.displayPoNum",
          render: (val, record) => {
            const num = this.receiveOrderType === "ASN" ? record.asnNum : record.displayPoNum;
            return num + " | " + (record.asnLineNum ? record.asnLineNum : record.displayLineNum);
          }
        },
        {
          fieldName: this.$T("sinv.common.model.raw.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.receive.quantity.now").$D("此次接受数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "thisTimeReceiveQuantity",
          required: true,
          placeholder: this.$T("sinv.purchaseReception.view.write.receive.quantity.now").$D("请输入此次接受数量"),
          precision: (val, item) => item.uomPrecision
        },
        {
          fieldName: this.$T("sinv.purchaseReception.model.receive.date").$D("收货日期"),
          fieldCode: "realityReceiveDate",
          fieldType: "DATE",
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.warehose").$D("库房"),
          fieldType: "EMPTY",
          fieldCode: "inventoryName",
          render: (val, item) =>
            <SrmLovField
              size="small"
              theme="fill"
              name={item.inventoryName}
              display={item.inventoryName}
              v-model={item.inventoryName}
              code="SODR.INVENTORY"
              options={{
                queryParams: {
                  organizationId: item.invOrganizationId,
                  enabledFlag: 1
                },
                callback: function ([ lovRecord ]) {
                  item.inventoryId = lovRecord.inventoryId;
                  item.inventoryName = lovRecord.inventoryName;
                },
              }}
              placeholder={ this.$T("sinv.purchaseReception.view.choose.warehose").$D("可选择库房") } >
              <span slot="left" style={{ marginRight: "12px" }}>
                { this.$T("sinv.purchaseReception.view.warehose").$D("库房") }：
              </span>
            </SrmLovField>
          ,
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.location.name").$D("库位"),
          fieldType: "EMPTY",
          fieldCode: "locationName",
          render: (val, item) =>
            <SrmLovField
              size="small"
              theme="fill"
              name={item.locationName}
              display={item.locationName}
              v-model={item.locationName}
              code="HPFM.LOCATION"
              options={{
                queryParams: {
                  inventoryId: item.inventoryId,
                  enabledFlag: 1
                },
                callback: function ([ lovRecord ]) {
                  item.locationId = lovRecord.locationId;
                  item.locationName = lovRecord.locationName;
                },
              }}
              placeholder={ this.$T("sinv.purchaseReception.view.choose.location.name").$D("可选择库位") } >
              <span slot="left" style={{ marginRight: "12px" }}>
                { this.$T("sinv.purchaseReception.view.location.name").$D("库位") }：
              </span>
            </SrmLovField>
          ,
        },
        {
          fieldName: this.$T("sinv.purchaseReception.message.lineRemark").$D("行备注"),
          fieldType: "INPUT",
          fieldCode: "remark",
          placeholder: this.$T("sinv.purchaseReception.view.can.write.lineRemark").$D("可输入行备注"),
        },
      ];

      return columns;
    },
    btnArr() {
      return [
        {
          title: this.$T("sinv.purchaseReception.message.reception").$D("接收过账"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
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
    //回到顶部
    goTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    showLovPop(type, index, invOrganizationId) {
      this.tempIndex = index;
      this.tempType = type;
      // eslint-disable-next-line default-case
      switch (type) {
      case "INVENTORY":
        this.LovCode = "SODR.INVENTORY";
        this.LovParams = {
          enabledFlag: 1,
          lovCode: "SODR.INVENTORY",
          organizationId: invOrganizationId
        };
        this.LovPop = !this.LovPop;
        break;
      case "LOCATION":
        this.LovCode = "HPFM.LOCATION";
        this.LovParams = {
          enabledFlag: 1,
          inventoryId: this.createList[index].inventoryId
        };
        this.LovPop = !this.LovPop;
        break;
      }
    },
    // 获取Lov确定值
    GetValue(val) {
      console.log("GetValue", val);
      // eslint-disable-next-line default-case
      switch (this.tempType) {
      case "INVENTORY":
        this.createList[this.tempIndex].inventoryId = val[0].inventoryId;
        this.createList[this.tempIndex].inventoryName = val[0].inventoryName;
        break;
      case "LOCATION":
        this.createList[this.tempIndex].locationId = val[0].locationId;
        this.createList[this.tempIndex].locationName = val[0].locationName;
        break;
      }
    },
    showDatePop(index) {
      this.dateIndex = index;
      this.datePop = !this.datePop;
    },
    //选择时间
    handleConfirm(value) {
      this.createList[this.dateIndex].realityReceiveDate = value;
      this.datePop = false;
    },
    //获取详情列表
    async getListDetail() {
      const listId =
        this.receiveOrderType === "ASN" ?
          this.list.map((item) => item.asnLineId) :
          this.list.map((item) => item.poLineLocationId);
      const params = {
        receiveOrderType: this.receiveOrderType,
        lineIds: listId.length > 0 ? listId : 0
      };
      this.$loading.show();
      await getListDetailApi(params).then((res) => {
        this.$loading.hide();
        res.content.map((item, index) => {
          item.thisTimeReceiveQuantity = item.canReceiveQuantity;
          item.trxLineNum = index + 1;
        });
        this.createList = res.content;
      });
    },
    //删除行信息
    deleteLine(index) {
      this.createList.splice(index, 1);
    },
    //接收过账
    receiveData() {
      let params = [];
      this.createList.forEach((item) => {
        if (this.receiveOrderType === "ASN") {
          params.push({
            asnLineId: item.asnLineId,
            thisTimeReceiveQuantity: item.thisTimeReceiveQuantity,
            inventoryId: item.inventoryId,
            locationId: item.locationId,
            remark: item.remark,
            trxLineNum: item.trxLineNum,
            realityReceiveDate: item.realityReceiveDate ?
              item.realityReceiveDate + " 00:00:00" :
              ""
          });
        } else {
          params.push({
            poLineLocationId: item.poLineLocationId,
            thisTimeReceiveQuantity: item.thisTimeReceiveQuantity,
            inventoryId: item.inventoryId,
            locationId: item.locationId,
            remark: item.remark,
            trxLineNum: item.trxLineNum,
            realityReceiveDate: item.realityReceiveDate ?
              item.realityReceiveDate + " 00:00:00" :
              ""
          });
        }
      });
      this.$loading.show();
      receiveApi(params, this.receiveOrderType).then((res) => {
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

  >>> .hips-input {
    padding: 0 !important;
    height: 20px !important;
    position: static !important;

    input {
      font-size: 14px !important;
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

    .asn-item {
      border-bottom: 8px solid #F5F6FA;
      padding: 20px 15px;

      ul li {
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
          margin-left: 14px;
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

          span {
            font-size: 10px;
            color: #414660;
            line-height: 22px;
            background: rgba(65, 70, 96, 0.1);
            border-radius: 2px;
            padding: 2px 8px;
          }

          img {
            width: 15px;
            height: 15.6px;
          }
        }
      }
    }
  }
}
</style>
