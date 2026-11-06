<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.receipt.view.title.baseInfo').$D('发货信息')">
        <!-- <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div> -->
        <!-- <div style="padding-top: 16px;"> -->
        <srm-list :scrollable="false" :data-set="headerDs" :columns="getHeaderColumns" />
        <!-- </div> -->
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.receipt.view.title.lineInfos').$D('物料行信息')">
        <srm-button v-if="parameters.type === '1'" class="line-button" @click="onLineOpenClick()">
          {{ $T("scux.receipt.view.button.batch.editMany").$D("批量编辑") }}
        </srm-button>
        <srm-list :scrollable="false" :data-set="lineDs" :columns="getLineColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import jiaduMixin from "./jiaduMixin";
import { toSave } from "./api";
import { detailLineDs, detailHeaderDs } from "./dataSource";

export default {
  modules: ["scux.receipt", "hipspfm.workFlow", "hzero.common", "scux.receipt.created"],
  name: "JiaDuReceiptApproval",
  mixins: [jiaduMixin],
  inject: {
    approvalDetail: {
      default: null
    }
  },
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      lineDs: new DataSet(detailLineDs(this.parameters.type)),
      headerDs: new DataSet(detailHeaderDs(this.parameters.type)),
      invLovDs: { inventoryCode: null, inventoryName: null },
      approvalInfo: [],
    };
  },
  beforeMount() {
    // this.headerDs.create({});
    this.lineDs.create({});
  },
  mounted() {
    this.headerDs.addPathParameter("asnSignHeaderId", this.changeReqId);
    this.headerDs.refresh();
    this.lineDs.addPathParameter("asnSignHeaderId", this.changeReqId);
    this.lineDs.refresh();
  },
  afterMount() {
  },
  methods: {
    beforeApprove(approveResult) {
      return new Promise((resolve, reject) => {
        // 审批通过
        if (approveResult === "Approved") {
          const headerInfo = this.headerDs.toData()[0];
          if (this.parameters.type === "1") {
            let validateFlag = [];
            const lineData = this.lineDs.toData();
            validateFlag = lineData.map((item) => item.inventoryCode);
            if (validateFlag.includes(null)) {
              return reject(false);
            }
          } else {
            const { attributeVarchar7 } = headerInfo;
            if (!attributeVarchar7) {
              this.$notification.open({
                message: this.$T("scux.receipt.created.submit.all.valte").$D("请输入必输项!"),
                class: "notification"
              });
              return reject(false);
            }
          }
          toSave({
            ...headerInfo,
            lineList: this.lineDs.toData(),
          }).then((res) => {
            if (res && res.failed) {
              reject(false);
            }
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    },
    getInvColumns() {
      return [
        {
          fieldCode: "inventoryCode",
          fieldType: "LOV",
          fieldName: $T("scux.receipt.model.receipt.inventoryName").$D("子库"),
          lovCode: "SCUX.PCI.INVENTORY",
          displayField: "inventoryName",
          subDisplayField: "inventoryCode",
          options: {
            valueField: "inventoryCode",
            displayField: "inventoryName",
            subDisplayField: "inventoryCode",
            queryParams: {
              ouId: this.lineDs.toData()[0] ? this.lineDs.toData()[0].ouId : null,
            },
          },
        },
      ];
    },
    //打开批量维护弹窗
    onLineOpenClick() {
      this.detailPopup = this.$popup({
        title: $T("scux.receipt.model.receipt.batchMaintenance").$D("批量维护"),
        showHeader: true,
        showClose: true,
        showBack: true,
        position: "bottom",
        height: "50%",
        content: <div class="create-receive-detail-define"><CustomizeDetail ref="testVal"
          needPadding={true}
          dataSource={this.invLovDs}
          columns={this.getInvColumns()}
        />
          <div class="create-receive-detail-define-button">
            <srm-button onClick={this.onSubmit} fill size="x-large" full-width type="primary">{this.$T("hzero.common.button.ok").$D("确定")}</srm-button>
          </div>
        </div>,
      });
    },
    onSubmit() {
      this.lineDs.data.forEach((item) => {
        if (this.invLovDs.inventoryCode) {
          item.inventoryCode = this.invLovDs.inventoryCode;
          item.inventoryName = this.invLovDs.inventoryName;
        }
      });
      toSave({
        ...this.headerDs.toData()[0],
        lineList: this.lineDs.toData(),
      }).then((res) => {
        if (res) {
          this.lineDs.refresh();
        }
      });
      this.detailPopup.closePopup();
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

.line-button {
  display: flex;
  margin-top: 18px;
  height: 24px;
  z-index: 999;
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
