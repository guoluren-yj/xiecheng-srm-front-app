<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet" :columns="getColumns" @itemClick="goToDetail"/>
    <srm-popup
      :visible="linkFlag"
      height="100vh"
      position="bottom"
      :show-header="false"
      @onClose="linkPr(false)">
      <srm-form customize-type="detail" :columns="getLinkColumns" :data-set="setLinkDataSet" />
      <srm-bottom-handler :data-set="setLinkDataSet" :btn-arr="getLinkButtons"/>
    </srm-popup>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import setLinkDS from "../datasource/setLinkDS";
import { getSureApi, getQueryInfoApi } from "../api";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "sinv.purchaserDelivery", "sinv.purchaseReception", "sinv.common", "entity.supplier", "scux.commercialTermsPre", "slod.common", "hzero.common" ],
  name: "DeliveryBillQueryList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
      setLinkDataSet: new DataSet(setLinkDS()),
      linkFlag: false,
      linkItem: {},
    };
  },
  computed: {
    getColumns() {
      return [ {
        formRow: 0,
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          <span>{item.asnNum}</span>
          <span slot="right">{item.attributeVarchar21Meaning}</span>
        </SrmListHeader>
      }, {
        formRow: 1,
        fieldCode: "link",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          <SrmButton
            onClick={() => {
              this.linkPr(true, item);
            }}
            plain rect style={{ fontWeight: "bold" }} type="primary">
            {this.$T("sinv.common.model.common.linkAttrment").$D("通知上传附件")}
          </SrmButton>
        </SrmListHeader>
      },
      {
        fieldName: this.$T("entity.supplier.tag").$D("供应商"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: this.$T("sinv.common.model.common.organizationName").$D("收货组织"),
        fieldCode: "organizationName",
      },
      {
        fieldName: this.$T("sinv.common.model.common.expectedArriveTime").$D("预计到货时间"),
        fieldCode: "expectedArriveDate",
      } ];
    },
    getLinkColumns() {
      return [
        { fieldCode: "userName", editor: true },
        { fieldCode: "mobilephone", editor: true },
      ];
    },
    getLinkButtons() {
      return [
        {
          text: this.$T("hzero.common.button.sure").$D("确定"),
          fill: true,
          handler: this.linkSave,
        },
      ];
    }
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      // const { asnHeaderId, organizationName, purchaseAgentName } = data;
      const { asnHeaderId, purchaseAgentName } = data;

      this.$router.push({
        name: "CuxDetailDocument",
        query: { asnHeaderId, purchaseAgentName }
        // query: { asnHeaderId, organizationName, purchaseAgentName }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    linkPr(flag, item) {
      if (![ "REJECT", "NEW_RECEIVE" ].includes(item?.attributeVarchar21) && flag) {
        this.$notification.open({
          message: this.$T("sinv.common.model.common.linkValidateMessage").$D("收货执行需要为新建或者拒绝状态才可发送"),
          duration: 500,
        });
        return;
      }
      if (flag) {
        getQueryInfoApi(item.asnHeaderId).then((res) => {
          this.setLinkDataSet.create({});
          this.linkItem = { ...item, ...res };
        });
      } else {
        this.linkItem = {};
      }
      this.linkFlag = flag;
    },
    linkSave() {
      const data = this.linkItem;
      const flag = this.setLinkDataSet.validate();
      const _obj = this.setLinkDataSet.toData()[0] || {};
      const params = { ..._obj, asnHeaderId: data?.asnHeaderId, asnSignHeaderId: data?.asnSignHeaderId, signNum: data?.signNum };
      if (flag) {
        this.$loading.show();
        getSureApi(params).then(() => {
          this.$notification.open({
            message: this.$T("slod.common.view.message.optionSuccess").$D("操作成功"),
            duration: 1000,
          });
          this.linkPr(false);
        }).finally(() => {
          this.$loading.hide();
        });
      }
    }
  },
};
</script>

<style lang="stylus" scoped>

</style>
