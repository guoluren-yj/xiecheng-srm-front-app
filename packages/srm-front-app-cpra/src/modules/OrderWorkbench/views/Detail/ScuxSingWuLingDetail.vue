<template>
  <!-- 订单工作台 -->
  <div class="detail-container">
    <srm-scroll-tab>
      <!-- 订单基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="basicInfoDataSet"
          :columns="getColumns('basicInfo')"
        />
      </srm-scroll-tab-item>
      <!-- 采购方及采买组织信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('organization')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="basicInfoDataSet"
          :columns="getColumns('organization')"
        />
      </srm-scroll-tab-item>
      <!-- 订单明细信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('detailInfo')">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :show-bottom-bar="false"
          :data-set="detailInfoDataSet"
          :columns="getColumns('detailInfo')"
        />
      </srm-scroll-tab-item>
      <div style="height: 74px" />
    </srm-scroll-tab>
    <!-- 详情按钮 -->
    <srm-bottom-handler :btn-arr="getButtons()" type="tooltip" />
  </div>
</template>

<script>
import { queryDoubleUomConfigApi, cuxBatchSilentSigning } from "../../api";
import { DataSet, $T } from "srm-mobile-ui";
import { STATUS_COLOR_MAP, amountRender } from "../../components/utils/index";
import { basicInfoDs, lineDs } from "../../datasource/detail/all";
export default {
  modules: [
    "sodr.workspace",
    "sodr.common",
    "hipspfm.common",
    "smbl.common",
    "hzero.common",
    "sprm.common",
    "sinv.receiptWorkbench",
    "sinv.receiptExecution",
    "sinv.receipWorkbench",
    "sodr.sendOrder",
  ],
  name: "AllDetail",
  props: {
    parameters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      poHeaderId: null,
      basicInfoDataSet: new DataSet(basicInfoDs()), // 订单基础信息
      detailInfoDataSet: new DataSet(lineDs()), // 订单明细信息
      operatingData: [], // 操作记录
      isDoubleUnit: false,
      bySourceCode: true,
    };
  },
  computed: {
    headerInfo() {
      return (
        (this.basicInfoDataSet.current &&
          this.basicInfoDataSet.current.toData()) ||
        {}
      );
    },
  },
  beforeMount() {
    this.type = this.$route.query.type || this.parameters.type;
    this.poHeaderId =
      this.$route.query.poHeaderId || this.parameters.poHeaderId || "";
  },
  mounted() {
    // 编辑/详情
    if (this.poHeaderId) {
      this.init();
    } else {
      this.showPage = false;
      this.$notification.open({
        message: $T("hzero.common.notification.noShow.tips").$D(
          "该单据当前状态不可查看"
        ),
      });
    }
  },
  methods: {
    async init() {
      try {
        this.getPoHeader();
        this.getPoLine();
        await this.queryDoubleUomConfig();
      } catch (error) {
        this.$notification.open({
          message: error,
        });
      }
    },
    // 获取业务规则定义-双单位配置
    async queryDoubleUomConfig() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
    //返回上一页
    goBack() {
      this.$router.back();
    },
    boolRender(val) {
      return Number(val) === 1
        ? this.$T("hipspfm.common.status.yes").$D("是")
        : this.$T("hipspfm.common.status.no").$D("否");
    },
    // 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        basicInfo: $T("sodr.workspace.view.panel.orderBasicInfo").$D(
          "订单基础信息"
        ),
        organization: $T("sodr.workspace.view.panel.organization").$D(
          "交易方及采买组织信息"
        ),
        detailInfo: $T("sodr.workspace.view.panel.detailInfo").$D(
          "订单明细信息"
        ),
      };
      return languageList[key] || key;
    },
    // 查询头信息
    async getPoHeader() {
      this.basicInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.basicInfoDataSet.setQueryParameter({
        camp: 1,
        poHeaderId: this.poHeaderId,
        poEntryPoint: "PURCHASE_PO_DETAIL",
        customizeUnitCode: "SODR.WORKSPACE_TOBESIGNED_DETAIL.BASICINFO",
      });
      this.basicInfoDataSet.refresh();
      this.unreadCount = this.headerInfo.unreadCount;
    },
    // 查询行信息
    async getPoLine() {
      this.detailInfoDataSet.addPathParameter("poHeaderId", this.poHeaderId);
      this.detailInfoDataSet.setQueryParameter({
        camp: 2,
        sortType: 0,
        poEntryPoint: "PURCHASE_PO_DETAIL",
        customizeUnitCode: "SODR.WORKSPACE_TOBESIGNED_DETAIL.DETAILINFO",
      });
      this.detailInfoDataSet.refresh();
    },
    getColumns(name) {
      switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "displayPoNum",
              fieldType: "EMPTY",
              render: (val, item) => (
                <SrmListHeader>
                  <span>{item.displayPoNum || "-"}</span>
                </SrmListHeader>
              ),
            },
            {
              fieldCode: "custItemNameDetail",
              fieldName: this.$T("").$D("物料描述"),
              render: (val, item) =>
                item.sourceCode === "SRM" ? (
                  <span>物料及耗材一批</span>
                ) : (
                  item.attributeLongtext11
                ),
            },
            {
              fieldCode: "creationDate",
              fieldName: this.$T("").$D("创建时间"),
            },
            {
              fieldCode: "amount",
              fieldName: this.$T("").$D("不含税总计"),
            },
            {
              fieldCode: "taxIncludeAmount",
              fieldName: this.$T("").$D("含税总金额"),
            },
            {
              fieldCode: "currencyCode",
              fieldName: this.$T("").$D("币种"),
            },
            {
              fieldCode: "termsName",
              fieldName: this.$T("").$D("付款条件"),
            },
          ];
        case "organization":
          return [
            {
              fieldCode: "companyName",
              fieldType: "EMPTY",
              fieldName: this.$T("").$D("公司"),
              render: (val, item) => (
                <SrmListHeader>
                  <span>公司:</span>
                  <span>{item.companyName || "-"}</span>
                </SrmListHeader>
              ),
            },
            {
              fieldCode: "supplierName",
              fieldName: this.$T("").$D("供应商"),
            },
            {
              fieldCode: "agentName",
              fieldName: this.$T("").$D("采购员"),
            },
          ];
        case "detailInfo":
          return [
            {
              formRow: 10,
              fieldCode: "displayLineNum",
              // fieldName: $T("sodr.workspace.model.common.displayLineNum").$D("行号"),
              fieldType: "EMPTY",
              render: (val, item) => (
                <SrmListHeader>
                  <span>{val || "-"}</span>
                  <SrmButton
                    rect
                    plain
                    slot="right"
                    style={{ fontWeight: "bold" }}
                    type={STATUS_COLOR_MAP[item.statusCode]}
                  >
                    {item.displayStatusMeaning || ""}
                  </SrmButton>
                </SrmListHeader>
              ),
            },
            // {
            //   formRow: 20,
            //   fieldCode: "itemName",
            // },
            {
              formRow: 20,
              fieldCode: "itemCode",
              fieldName: this.$T("").$D("物料编码"),
            },
            {
              formRow: 30,
              fieldCode: "itemName",
              fieldName: this.$T("").$D("物料描述"),
            },
            {
              formRow: 40,
              fieldName: this.$T("").$D("数量"),
              fieldCode: "quantity",
              render: amountRender,
            },
            {
              formRow: 50,
              fieldCode: "taxRate",
              fieldName: this.$T("").$D("税率"),
            },
            {
              formRow: 60,
              fieldCode: "unitPrice",
              fieldName: this.$T("").$D("单价"),
              // render: amountRender,
            },
            {
              formRow: 70,
              fieldCode: "attributeVarchar9",
              fieldName: this.$T("").$D("PR编号"),
            },
          ].filter((i) => i);
        default:
          return [];
      }
    },
    getButtons() {
      return [
        {
          text: "签章",
          fill: true,
          handler: () => {
            this.$loading.show();
            cuxBatchSilentSigning([this.poHeaderId])
              .then((res) => {
                // eslint-disable-next-line no-empty
                if (res && !res.failed) {
                  this.$notification.open({
                    message: this.$T("hzero.common.notification.success").$D(
                      "操作成功"
                    ),
                  });
                  this.goBack();
                }
              })
              .finally(() => {
                this.$loading.hide();
              });
          },
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}

.line-filter {
  .list-tool-tab {
    width: 100px;
    justify-content flex-end;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
    margin-left: 10px;
  }
}

.srm-scroll-tab-message {
  position: relative;
  .message-container{
    height: 60px;
    .message-badge{
      display: inline-block;
      padding: 0 4px;
      height: 18px;
      min-width: 20px;
      line-height: 18px;
      font-weight: 500;
      border-radius: 10px;
      background: #E11900;
      font-family: PingFangSC-Medium;
      font-size: 10px;
      color: #FFFFFF;
    }
    .message-text{
      font-size: 14px;
      margin: 0 10px;
    }
    .srm-icon{
      font-size: 16px;
    }
    .icon-mail {
      color: #276EF1;
    }
  }
}
</style>
