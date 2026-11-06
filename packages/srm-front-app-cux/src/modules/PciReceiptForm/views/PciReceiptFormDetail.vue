<!-- eslint-disable rulesdir/no_hips -->
<template>
  <div ref="priceExecute" class="price-execute-approval">
    <div slot="right" class="right-button">
      <span>
        <img class="image-black-default" src="@/assets/4.0/Navigation bar_delete_normal@3x.png" alt @click="goBack">&nbsp;&nbsp;
        <span>{{ $T('scux.receipt.created.view.title').$D('收货单') }}</span>
      </span>
    </div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.receipt.model.receipt.attachmentUuids').$D('附件')">
        <srm-attachment
          :attachment-uuid="attachmentUuid"
          display-type="grid"
          :cols="3"
          :readonly="headerInfo.signStatus !== 'NEW_RECEIVE' && headerInfo.signStatus !== 'REJECT'"
          @fileUpload="onFileListChange" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.receipt.view.title.baseInfo').$D('发货信息')">
        <srm-list
          :scrollable="false"
          :data-set="headerDs"
          :columns="getHeaderColumns"/>
        <!-- </div> -->
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.receipt.view.title.lineInfos').$D('物料行信息')">
        <srm-list
          :scrollable="false"
          :data-set="lineDs"
          :columns="getLineColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  <!-- <div slot="left" class="left-button" @click="goBack">
      <img
        src="../../../assets/4.0/icon_Navigation bar_left_default b@3x.png"
        class="image-black-default">
      {{ $T('scux.receipt.created.view.title').$D('收货单') }}
    </div> -->
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { toSave } from "../api";
import { headerDs, lineDs } from "../dataSource";
import uuid from "uuid";

export default {
  modules: [ "scux.receipt", "hipspfm.workFlow", "hzero.common", "scux.receipt.created", "hipspfm.invoiceInspection" ],
  name: "PciReceiptFormDetail",
  data() {
    const {
      app: {
        _route: {
          query: { asnSignHeaderId, tenantId },
        },
      },
    } = this.$router;
    return {
      lineDs: new DataSet(lineDs(tenantId)),
      headerDs: new DataSet(headerDs(tenantId)),
      asnSignHeaderId,
      tenantId,
      headerInfo: {},
      attachmentUuid: "",
    };
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldName: $T("scux.receipt.model.receipt.asnNum").$D("送货单号"),
          fieldCode: "asnNum",
        },
        {
          fieldName: $T("scux.receipt.model.receipt.signNum").$D("收货单号"),
          fieldCode: "signNum",
        },
        // {
        //   fieldName: $T("scux.receipt.model.receipt.attachmentUuids").$D("附件"),
        //   fieldCode: "attachmentUuid",
        //   render: (val) =>
        //     <srm-upload
        //       attachmentUuid={val}
        //       show-icon
        //       color="var(--color-other-default-b)"
        //       desc-title={$T("scux.receipt.model.receipt.attachmentUuids").$D("附件")}
        //       onClose={() => console.log(val)}
        //     />,
        // },
        {
          fieldName: $T("scux.receipt.model.receipt.supplierName").$D("供应商名称"),
          fieldCode: "supplierName",
        },
        {
          fieldName: $T("scux.receipt.model.receipt.shipDate").$D("发货日期"),
          fieldCode: "shipDate",
        },
        {
          fieldName: $T("scux.receipt.model.receipt.asnAddressType").$D("送货地类型"),
          fieldCode: "asnAddressTypeMeaning",
        },
        this.headerInfo?.asnAddressType === "goods_to_the_outsourcing" && {
          fieldName: $T("scux.receipt.model.receipt.factoryName").$D("外协厂名称"),
          fieldCode: "attributeVarchar27",
        },
        {
          fieldName: $T("scux.receipt.model.receipt.createName").$D("创建人"),
          fieldCode: "createName",
        },
        {
          fieldName: $T("scux.receipt.model.receipt.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: $T("scux.receipt.model.receipt.signStatus").$D("状态"),
          fieldCode: "signStatusMeaning",
        },
        {
          fieldName: $T("scux.receipt.model.receipt.signRemark").$D("备注"),
          fieldCode: "signRemark",
        },
      ];
    },
    getLineColumns() {
      return [
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "asnLineNum",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "quantity",
        },
        {
          fieldCode: "receiveQuantity",
        },
        {
          fieldCode: "signDate",
        },
        {
          fieldCode: "inventoryName",
        },
        {
          fieldCode: "productNum",
        },
        {
          fieldCode: "productName",
        },
        {
          fieldCode: "ouName",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "srmRcvTrxNum",
        },
        {
          fieldCode: "srmRcvTrxLineNum",
        },
        {
          fieldCode: "signRemark",
        },
      ];
    }
  },
  beforeMount() {
    // this.headerDs.create({});
    // this.lineDs.create({});
  },
  mounted() {
    this.headerDs.addPathParameter("asnSignHeaderId", this.asnSignHeaderId);
    this.headerDs.refresh().then(() => {
      this.headerInfo = this.headerDs.toData()[0] || {};
      this.attachmentUuid = this.headerDs.toData()[0]?.attachmentUuid ? this.headerDs.toData()[0]?.attachmentUuid : uuid();
    });
    this.lineDs.addPathParameter("asnSignHeaderId", this.asnSignHeaderId);
    this.lineDs.refresh();
  },
  afterMount() {
  },
  methods: {
    onFileListChange() {
      const lineList = this.lineDs.toData();
      toSave({
        ...this.headerInfo,
        attachmentUuid: this.attachmentUuid,
        lineList,
      }, this.tenantId).then((res) => {
        if (res && !res.failed) {
          this.$notification.open({
            message: $T(
              "hzero.common.notification.success.save"
            ).$D("保存成功"),
            class: "notification",
          });
          this.headerDs.refresh();
        }
      });
    },
    goBack() {
      this.$router.push({
        name: "PciReceiptForm",
        query: { asnSignHeaderId: this.asnSignHeaderId },
      });
    }
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      height: 32px;
      background: var(--color-bg-default);
      // border: 1px solid var(--color-border-default);
      border-radius: 18px;
      color: #000;
    }

    img {
      height: 18px;
      width: 18px;
    }
  }

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

.create-receive-detail-define{
  height:100%;
  .create-receive-detail-define-button{
    position:relative;
    top:30px;
    margin-left:15px;
    margin-right:15px;
  }
}
</style>
