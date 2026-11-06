<template>
  <div class="bidding-open">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('ssrc.biddingOpen.view.tab.basicInfo').$D('基本信息')">
        <srm-form :columns="getBaseInfoColumns" :data-set="baseInfoDs" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item class="tabItem" :label="$T('ssrc.biddingOpen.view.tab.biddingDetail').$D('开标详情')">
        <div class="tabItem-text-area">
          <srm-form :data-set="baseInfoDs" :columns="getApplicationColumns" />
        </div>
        <div class="supplier-list">
          <srm-form style="height: 40px;min-height: 0" :data-set="supplierDs" :columns="getSupplierColumns" />
          <srm-list :data-set="supplierDs" :columns="getSupplierHeaderColumns" :clickable="false" :scrollable="false" height="auto" style="height: auto" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- IP重合率弹框 -->
    <srm-popup :visible.sync="visible" :title="$T('ssrc.biddingOpen.view.tab.ipView').$D('IP查看')" @onClose="handleClose">
      <srm-list :data-set="ipCompanyIpRateDs" :columns="getIpCompanyIpRateColumns" />
    </srm-popup>
  </div>
</template>

<script>
import { SrmListHeader, DataSet, $T, SrmTextareaField, SrmList } from "srm-mobile-ui";
import { baseInfoDS, supplierDS, itemLineDS, ipCompanyIpRateDS } from "./store";
export default ({
  modules: [ "ssrc.biddingOpen" ],
  name: "YXBiddingOpenApprovalForm",
  props: {
    changeReqId: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      baseInfoDs: new DataSet(baseInfoDS({ rfxHeaderId: this.changeReqId })),
      supplierDs: new DataSet(supplierDS({ rfxHeaderId: this.changeReqId })),
      itemLineDs: new DataSet(itemLineDS()),
      ipCompanyIpRateDs: new DataSet(ipCompanyIpRateDS({ rfxHeaderId: this.changeReqId })),
      visible: false, // 控制IP重合率弹框
      showDetailValue: {},
    };
  },
  computed: {
    // 基本信息列
    getBaseInfoColumns() {
      const columns = [
        {
          fieldType: "EMPTY",
          fieldCode: "rfxNum",
          render: (val) => <SrmListHeader>
            <div>{val}</div>
          </SrmListHeader>
        },
        {
          fieldType: "TEXT",
          fieldCode: "rfxTitle",
        },
        {
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldType: "TEXT",
          fieldCode: "quotationStartDate",
        },
        {
          fieldType: "TEXT",
          fieldCode: "quotationEndDate",
        },
        {
          fieldType: "TEXT",
          fieldCode: "rfxRemark",
        },
      ];
      return columns;
    },
    // 申请说明
    getApplicationColumns() {
      const columns = [
        {
          fieldType: "EMPTY",
          fieldCode: "attributeLongtext7",
          render: (val) => <span style={{ width: "96vw" }}> <SrmListHeader>
            { $T("ssrc.biddingOpen.view.application.illustrate").$D("申请说明") }:
          </SrmListHeader>
          <SrmTextareaField value={val} editor={false} />
          </span>
        },
      ];
      return columns;
    },
    // 供应商列表
    getSupplierColumns() {
      return [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "",
          render: () => <SrmListHeader>
            { $T("ssrc.biddingOpen.view.application.supplierList").$D("供应商列表") }:
          </SrmListHeader>
        },
        {
          formRow: 0,
          fieldName: this.$T("ssrc.biddingOpen.model.ipCompanyIpRate").$D("IP重合率"),
          render: () => <a style={{ color: "#02A7F0" }} onClick={this.handleModal}>{$T("ssrc.biddingOpen.view.application.view").$D("查看")}</a>
        },
      ];
    },
    // 供应商头
    getSupplierHeaderColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "header",
          render: (val, item) => {
            const lines = this.supplierDs.data.find((e) => e.supplierCompanyId === item.supplierCompanyId);
            const tags = [];
            tags.push(item.quotedCount || 0 + $T("ssrc.biddingOpen.model.line").$D("行"));
            tags.push(item.readFlag ? $T("ssrc.biddingOpen.model.read").$D("已读") : $T("ssrc.biddingOpen.model.noRead").$D("未读"));
            tags.push(item.submitPrequalificationFlag ? $T("ssrc.biddingOpen.model.submitPrequalificationFlag").$D("资格预审") : $T("ssrc.biddingOpen.model.noSubmitPrequalificationFlag").$D("未资格预审"));
            return <div>
              <SrmFlex justify="between" nativeOnClick={() => {
                this.$set(this.showDetailValue, item.supplierCompanyId, !this.showDetailValue[item.supplierCompanyId]);
                if (this.showDetailValue[item.supplierCompanyId]) {
                  this.itemLineDs.setQueryParameter({ rfxHeaderId: this.changeReqId, supplierCompanyId: item.supplierCompanyId });
                  this.itemLineDs.refresh();
                }
              }}>
                <span class="title-bold">{`${item.supplierCompanyNum ? item.supplierCompanyNum + "-" : ""}${item.supplierCompanyName}`}</span>
              </SrmFlex>
              <SrmFlex nativeOnClick={() => {
                this.$set(this.showDetailValue, item.supplierCompanyId, !this.showDetailValue[item.supplierCompanyId]);
                if (this.showDetailValue[item.supplierCompanyId]) {
                  this.itemLineDs.setQueryParameter({ rfxHeaderId: this.changeReqId, supplierCompanyId: item.supplierCompanyId });
                  this.itemLineDs.refresh();
                }
              }}><SrmTagGroup tags={tags} type="info"/></SrmFlex>
              <srm-blank v-show={this.showDetailValue[item.supplierCompanyId]} style="margin: 10px 0;" size="1px" theme="fill"/>
              <SrmFlex v-show={this.showDetailValue[item.supplierCompanyId]} direction="column">
                <Customize dataSource={lines} columns={this.getSupplierListColumns} />
              </SrmFlex>
              <srm-blank v-show={this.showDetailValue[item.supplierCompanyId]} style="margin-top: 16px;" size="1px" theme="fill"/>
              <SrmList style={{ marginLeft: "-15px" }} v-show={this.showDetailValue[item.supplierCompanyId]} dataSet={this.itemLineDs} columns={this.getItemLineColumns} />
            </div>;
          },
        },
      ];
      return columns;
    },
    getSupplierListColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "TEXT",
          fieldCode: "companyIpRate",
          fieldName: $T("ssrc.biddingOpen.model.companyIpRate").$D("重合率"),
        },
        {
          formRow: 0,
          fieldType: "TEXT",
          fieldCode: "readFlag",
          fieldName: $T("ssrc.biddingOpen.model.readFlag").$D("是否已读"),
          render: (val) => <span>{val ? $T("ssrc.biddingOpen.model.yes").$D("是") : $T("ssrc.biddingOpen.model.no").$D("否")}</span>
        },
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldName: $T("ssrc.biddingOpen.model.feedbackStatusMeaning").$D(
            "是否参与"
          ),
          fieldCode: "feedbackStatusMeaning",
        },
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldName: $T("ssrc.biddingOpen.model.quotedCount").$D("报价行数"),
          fieldCode: "quotedCount",
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldName: $T("ssrc.biddingOpen.model.submitPrequalificationFlag").$D(
            "是否资格预审"
          ),
          fieldCode: "submitPrequalificationFlag",
          render: (val) => <span>{val ? $T("ssrc.biddingOpen.model.yes").$D("是") : $T("ssrc.biddingOpen.model.no").$D("否")}</span>
        },
      ];
      return columns;
    },
    getItemLineColumns() {
      const column = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "rfxLineItemNum",
          render: (val, item) => <SrmListHeader>
            {val}:{item.itemCode}-{item.itemName}
          </SrmListHeader>
        },
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldCode: "specifications",
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldCode: "model",
        },
        {
          formRow: 30,
          fieldType: "TEXT",
          fieldCode: "rfxQuantity",
        },
        {
          formRow: 30,
          fieldType: "TEXT",
          fieldCode: "uomName",
        },
      ];
      return column;
    },
    // 重合率表格
    getIpCompanyIpRateColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "companyIpRate",
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            {val}%   {item.supplierCompanyName}
          </SrmListHeader>
        },
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldCode: "supplierCompanyIp",
        },
        {
          formRow: 10,
          fieldType: "TEXT",
          fieldCode: "coincidenceSupplierIp",
        },
        {
          formRow: 20,
          fieldType: "TEXT",
          fieldCode: "coincidenceCompanyName",
        },
      ];
      return columns;
    }
  },
  mounted() {
  },
  methods:{
    // IP重合率点击
    handleModal() {
      this.visible = true;
      this.ipCompanyIpRateDs.refresh();
    },
    // 弹框关闭回调
    handleClose() {
      this.visible = false;
    },
  }
});
</script>

<style lang="stylus" scoped>
.tabItem{
  background: #F1F2F6;

  .tabItem-text-area{
    background: #fff;
  }
}

.supplier-list{
  margin-top: 10px;
  background: #fff;
}

.title-bold {
  width 100%;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-header-flag{
    width: 1.867vw;
    height: 2.667vw;
    background: var(--color-primary);
    position: absolute;
    left: -4vw;
    top: 50%;
    transform: translateY(-50%);
}
</style>
