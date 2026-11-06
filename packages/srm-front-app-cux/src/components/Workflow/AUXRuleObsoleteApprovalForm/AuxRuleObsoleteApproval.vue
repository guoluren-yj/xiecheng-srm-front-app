<template>
  <div v-if="Object.keys(headInfo).length" class="rule-obsolete" >
    <div class="base-view">
      <customize class="info-view" :columns="getHeadColumns" :data-source="headInfo" type="list" code=""/>
    </div>
    <div v-if="showTab" class="tab-button-view">
      <div class="tab-button" @click="tabSelectAction"><span class="srm-icon icon-grid" /></div>
    </div>
    <srm-tab v-if="showTab" ref="tabView" style="margin-top: 8px;" no-all @changeTab="changeTabEvent">
      <srm-tab-pane v-for="(item, index) in supplierData" :key="index" :label="tabNameArr[index]">
        <div class="base-view">
          <div style="padding: 0 15px;">
            <srm-list-header>
              <span class="base-view-tit" style="font-size: 14px;"><span class="noWrap">{{ formType ==='ITEM'? (item.itemCode + "-" + item.itemName) :item.rfxTitle }}</span></span>
              <span slot="right" style="color: #333333; font-weight: normal;">
                {{ formType ==='ITEM'? $T("sprm.common.model.common.quantity").$D("数量") : $T("scux.ruleElimination.model.bidHall.attributeTinyint2").$D("末位淘汰") }}：
                {{ formType ==='ITEM'? item.rfxQuantity : item.attributeTinyint2 }}
              </span>
            </srm-list-header>
          </div>
          <div v-for="(dat, datIndex) in supplierLineData" :key="datIndex" class="card">
            <div v-if="dat.attributeTinyint1===1" class="image-content">
              <img src="@/assets/icon_rule_obsolete@3x.png">
            </div>
            <customize :class="{'info-view': true, 'info-view-disable': dat.attributeTinyint1===1}"
                       :columns="formType ==='SESSION' ? getLineColumns(datIndex + 1) : getSupplierLineColumns(datIndex + 1)"
                       :data-source="dat"
                       type="list"
                       code=""/>
          </div>
        </div>
      </srm-tab-pane>
    </srm-tab>
    <div v-else class="total-price-content">
      <div v-for="(dat, datIndex) in supplierLineData" :key="datIndex" class="card">
        <div v-if="dat.attributeTinyint1===1" class="image-content">
          <img src="@/assets/icon_rule_obsolete@3x.png">
        </div>
        <customize :class="{'info-view': true, 'info-view-disable': dat.attributeTinyint1===1}"
                   :columns="getLineColumns(datIndex + 1)"
                   :data-source="dat"
                   type="list"
                   code=""/>
      </div>
    </div>
    <srm-popup :visible.sync="isDetailShowFlag" :title="$T('scux.ruleElimination.model.quotationParticulars').$D('报价详情')" height="80%" rounded>
      <srm-list v-if="isDetailShowFlag" :data-set="modelData" :columns="getQuotationColumns" />
    </srm-popup>
    <srm-popup :visible.sync="isTabSelecterShowFlag" :title="$T('ssrc.common.view.button.selectBidSectionBtn').$D('选择标段')" height="80%" rounded>
      <div v-for="(item, index) in supplierData" :key="index" class="tab-selecter-item" @click="selectTabAtIndex(index)">
        <span :class="{'tab-actived': index === currentTabIndex}">{{ formType ==='ITEM'? tabNameArr[index] + '-标的/' + item.itemName : tabNameArr[index] + '-标段/' + item.rfxTitle }}</span>
        <span v-if="index === currentTabIndex" class="srm-icon icon-check" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { getHeadInfoApi, getSupplierDataApi, getSupplierLineTableDataApi, getQuotationDetailApi, getSessionLineApi, getSessionListApi } from "./api/AuxRuleObsoleteApprovalApi";
import modelDataSet from "./model.js";
export default {
  modules: [ "ssrc.bidHall", "sprm.common", "scux.ruleElimination", "ssrc.common", "smbl.common" ],
  name: "AuxRuleObsoleteApproval",
  components: {},
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    }
  },
  data() {
    return {
      headInfo: {},
      isDetailShowFlag: false,
      isTabSelecterShowFlag: false,
      currentTabIndex: 0,
      supplierData: [], //供应商数据
      supplierLineData: [], //供应商行数据
      currentQuotationData: [], //报价详情数据
      showTab: false,
      modelData: {},
      formType: "",
      tabNameArr: [], //tab名称
      rfxHeaderId: "", //头id
    };
  },
  computed: {
    getHeadColumns() {
      return [ {
        fieldName: "rfxTitle",
        fieldType: "EMPTY",
        fieldCode: "rfxTitle",
        formRow: 1,
        render: (val) => <srm-list-header>
          <span>{ val }</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.bidHall.attributevarchar39Meaning").$D("淘汰规则"),
        fieldType: "TEXT",
        fieldCode: "attributeVarchar39Meaning",
        formRow: 10,
        render: () => this.headInfo.projectLineSectionId ?
          this.headInfo.attributeVarchar38Meaning :
          this.headInfo.attributeVarchar39Meaning,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.bidHall.attributeTinyint2").$D("末位淘汰数量"),
        fieldType: "TEXT",
        fieldCode: "attributeTinyint2",
        formRow: 10,
        visible: this.formType !== "SESSION"
      }, {
        fieldName: this.$T("scux.ruleElimination.model.bidHall.attributeVarchar40").$D("不按规则淘汰说明"),
        fieldType: "TEXT",
        fieldCode: "attributeVarchar40",
        formRow: 20,
      }, ];
    },
    getQuotationColumns() {
      return [ {
        fieldName: this.$T("scux.ruleElimination.model.name").$D("名称"),
        fieldType: "EMPTY",
        fieldCode: "itemName",
        formRow: 10,
        render: (val, record) => <span style="fontWeight: bold">{ (record.itemCode || "") + "-" + record.itemName }</span>,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.validQuotationQuantity").$D("数量"),
        fieldType: "TEXT",
        fieldCode: "validQuotationQuantity",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.validQuotationPrice").$D("报价(元)"),
        fieldType: "TEXT",
        fieldCode: "validQuotationPrice",
        formRow: 20,
      },
      // {
      //   fieldName: "报价附件",
      //   fieldCode: "attachmentUuid",
      //   langCode: "scux.ruleElimination.model.attachmentUuid",
      //   formRow: 30,
      //   render: (val, item) => {
      //     return val && <srm-upload
      //       desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
      //       show-icon={false}
      //       show-count={false}
      //       color={ "#276EF1" }
      //       attachment-uuid={item.attachmentUuid}/>;
      //   },
      // }
      ];
    },
  },
  created() {
    this.getHeadInfo();
  },
  methods: {
    // 按标的
    getSupplierLineColumns(index) {
      return [ {
        fieldName: this.$T("scux.ruleElimination.model.name").$D("名称"),
        fieldType: "EMPTY",
        fieldCode: "customeHeader",
        formRow: 0,
        render: (val, record) => <srm-list-header show-open-tag={false}>
          <span style="fontSize: 14px">{index.toString() + "-" + record.supplierCompanyName}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.validQuotationPrice").$D("报价(元)"),
        fieldType: "TEXT",
        fieldCode: "validQuotationPrice",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.attachmentUuid").$D("报价附件"),
        fieldCode: "businessAttachmentUuid",
        formRow: 20,
        render: (val, item) => val && <srm-upload
          desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
          show-icon={false}
          show-count={true}
          color={ "#276EF1" }
          attachment-uuid={item.businessAttachmentUuid}/>,
      }, ];
    },
    // 按总价
    getLineColumns(index) {
      return [ {
        fieldName: this.$T("scux.ruleElimination.model.name").$D("名称"),
        fieldType: "EMPTY",
        fieldCode: "customeHeader",
        formRow: 0,
        render: (val, record) => <srm-list-header show-open-tag={false}>
          <span style="fontSize: 14px">{index.toString() + "-" + record.supplierCompanyName}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.inquiryHall.supplierPriceAmount").$D("报价总额(元)"),
        fieldType: "TEXT",
        fieldCode: "supplierPriceAmount",
        formRow: 20,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.attachmentUuid").$D("报价附件"),
        fieldCode: "businessAttachmentUuid",
        formRow: 20,
        render: (val, item) => val && <srm-upload
          desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
          show-icon={false}
          show-count={true}
          color={ "#276EF1" }
          attachment-uuid={item.businessAttachmentUuid}/>,
      }, {
        fieldName: this.$T("scux.ruleElimination.model.quotationParticulars").$D("报价详情"),
        fieldType: "TEXT",
        fieldCode: "details",
        formRow: 30,
        render: (val, item) => <div class="check-button" onClick={((e) => {
          e.stopPropagation();
          this.checkQuotationDetail(item);
        })}>{ this.$T("ssrc.bidHall.view.message.button.view").$D("查看") }</div>,
      }, ];
    },
    changeTabEvent(val) {
      // this.currentTabIndex = val.activeKey;
      this.selectTabAtIndex(val.activeKey);
    },
    tabSelectAction() {
      this.isTabSelecterShowFlag = true;
    },
    // 查看报价详情
    checkQuotationDetail(item) {
      // eslint-disable-next-line no-console
      this.modelData = new DataSet(modelDataSet(item.quotationHeaderId));
      setTimeout(() => {
        this.isDetailShowFlag = true;
      }, 0);
      // this.getQuotationDetail(item.rfxLineItemId);
    },
    // 切换tab
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      this.$refs.tabView.activeKey = index;
      this.isTabSelecterShowFlag = false;
      const flag = Object.keys(this.supplierData[index]);
      if (flag.length !== 0) {
        if (this.formType === "ITEM") {
          this.getSupplierLineTableData(this.supplierData[index].rfxLineItemId);
        } else {
          this.getSessionLine(this.supplierData[index].rfxHeaderId);
        }
      }
    },
    // 获取头信息
    getHeadInfo() {
      this.$loading.show();
      getHeadInfoApi(this.changeReqId).then((res = {}) => {
        this.$loading.hide();
        this.headInfo = res;
        this.rfxHeaderId = res.rfxHeaderId;
        const { rfxHeaderId, rfxStatus, sourceProjectId } = res;

        // 区分淘汰规则(标的、标段、淘汰总价)
        if (res.attributeVarchar38 === "SESSION" || res.attributeVarchar39 === "SESSION") { //标段
          this.showTab = true;
          this.formType = "SESSION";
          this.getSessionList(rfxHeaderId, rfxStatus, sourceProjectId);
        } else if (res.attributeVarchar38 === "ITEM" || res.attributeVarchar39 === "ITEM") { //标的
          this.showTab = true;
          this.formType = "ITEM";
          this.getSupplierData();
        } else { //总价
          this.getSessionLine(rfxHeaderId);
        }
      });
    },
    // 按标段
    getSessionList(rfxHeaderId, rfxStatus, sourceProjectId) {
      const params = {
        outFlag: 1,
        rfxStatus,
        rfxHeaderId,
        sourceProjectId,
      };

      this.$loading.show();
      getSessionListApi(params).then(({ content = [] }) => {
        this.$loading.hide();
        this.supplierData = content;
        this.tabNameArr = content.map((v, i) => `标段${i + 1}`);
        this.selectTabAtIndex(0);
      });
    },
    // 获取供应商数据
    getSupplierData() {
      this.$loading.show();
      getSupplierDataApi(this.changeReqId).then(({ content = [] }) => {
        this.$loading.hide();
        this.supplierData = content;
        this.tabNameArr = content.map((v, i) => `标的${i + 1}`);
        this.selectTabAtIndex(0);
      });
    },
    // 获取供应商行数据
    getSupplierLineTableData(rfxLineItemId) {
      this.$loading.show();
      getSupplierLineTableDataApi(rfxLineItemId).then(({ content = [] }) => {
        this.$loading.hide();
        this.supplierLineData = content;
      });
    },
    // 获取报价详情数据
    getQuotationDetail(rfxLineItemId) {
      this.$loading.show();
      getQuotationDetailApi(rfxLineItemId).then(({ content = [] }) => {
        this.$loading.hide();
        this.currentQuotationData = content;
      });
    },
    // 按总价/标段淘汰获取行数据
    getSessionLine(rfxHeaderId) {
      this.$loading.show();
      getSessionLineApi(rfxHeaderId).then(({ content = [] }) => {
        this.$loading.hide();
        this.supplierLineData = content;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.rule-obsolete {
    width: 100%;
}
.base-view {
    background-color: white;
}

.base-view-tit {
  display: flex;
  width: 200px;
}

.info-view {
    overflow: hidden;
    padding: 16px 15px 12px 15px;
    border-bottom: 1px solid #F6F6F6;
    >>> .srm-list-item-card-head-left {
        margin-left: 0px;
    }
}
.check-button {
    color: var(--color-other-default-b);
    font-size: 14px;
    font-weight: bold;
}
.info-view-disable {
    opacity: 0.5;
}
.total-price-content {
  margin-top: 8px;
}
.card {
    position: relative;
    background: #ffffff;
    .image-content {
        position: absolute;
        right: 15px;
        bottom: 5px;
        width: 60px;
        height: 60px;
        z-index: 2;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
>>> .srm-nav-content {
    li {
        padding: 4px 8px;
        border-radius: 12px;
        line-height: 16px;
        margin-left: 12px;
        background-color: clear;
        color: var(--color-font-default);
        &.active {
            background-color: #EFF3FE;
            color: var(--color-other-default-b) !important;
        }
        &.active::before {
            background-color: white;
            height: 0px;
        }
    }
}
>>> .srm-nav-wrap {
    border-bottom: 1px solid var(--color-bg-default-b);
}
.tab-button-view {
    position: relative;
    width: 100%;
    height: 0px;
    overflow: visible;
    z-index: 1000;
    .tab-button {
        position: absolute;
        top: 8px;
        right: 0;
        width: 46px;
        height: 43px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow -2px 0px 4px 0px #3333;
    }
}

>>> .srm-popup-content {
    // background-color: var(--color-bg-default-b);
    overflow: scroll;
    .info-view {
        .customize-item:first-child {
            margin-top: 5px !important;
        }
    }
    .tab-selecter-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--color-font-default);
        line-height: 22px;
        border-bottom: 1px solid var(--color-bg-default-b);
        padding: 16px 15px;
        background-color: white;
        .tab-actived {
            color: var(--color-other-default-b);
        }
        &:last-child {
            margin-bottom: 34px;
        }
        .srm-icon {
            color: var(--color-other-default-b);
        }
    }
}
.quotation-card {
    margin: 0px 5px 0 5px;
    background-color: white;
    border-radius: 5px;
    &:last-child {
        margin-bottom: 34px;
    }
}
</style>
