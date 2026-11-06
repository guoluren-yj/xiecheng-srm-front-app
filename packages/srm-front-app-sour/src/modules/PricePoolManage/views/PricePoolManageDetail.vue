<template>
  <div style="height: 100vh;">
    <srm-scroll style="height: 90vh;" :refreshable="false">
      <!-- 导航 -->
      <nav-head :title="$T('ssrc.priceLibraryNew.view.title.materialPriceMaintenance').$D('编辑物料价格信息')" @goBack="goBack" @goClose="goBack"/>
      <!-- 头信息 -->
      <customize-detail ref="dataSetRef" style="width: 100%; padding: 0 15px" :columns="getCustomColumns" :data-source="customDataInfo"/>
    </srm-scroll>
    <srm-bottom-handler :btn-arr="getBtnArr" type="tooltip"/>
    <srm-popup :visible.sync="ladderFlag"
               position="right"
               show-back
               height="100%"
               :show-close="false"
               :title="$T('ssrc.priceLibraryNew.model.library.ladderQuotation').$D('阶梯报价')">
      <srm-scroll-tab content-scroll :margin-bottom="30">
        <srm-scroll-tab-item :label="$T('smbl.common.view.tab.baseInfo').$D('基础信息')">
          <customize style="width: 100%; padding: 10px 15px" :columns="getLadderBasisInfo" :data-source="ladderBasisInfo" customize-code="SMBL.PRICE_POOL_MANAGE.LADDER_BASIS_INFO"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :show-title="false" :label="$T('ssrc.priceLibrary.view.message.button.ladderPrice').$D('阶梯价格')">
          <div
            class="srm-scroll-tab-item-title"
            style="display: flex; justify-content: space-between">
            {{ $T("ssrc.priceLibrary.view.message.button.ladderPrice").$D("阶梯价格") }}
            <span class="new">
              <em class="srm-icon icon-plus" @click="addLadder"/>
            </span>
          </div>
          <srm-list
            :data-set="ladderLineDs"
            :columns="getLadderLineInfo"
            :scrollable="false"
            customize-code="SMBL.PRICE_POOL_MANAGE.LADDER_LINE_INFO"/>
          <!-- 适配iPhoneX -->
          <div class="bottom-space-view" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
      <srm-bottom-handler :btn-arr="getLadderBtnArr" type="tooltip"/>
    </srm-popup>
  </div>
</template>
<script>

import { saveApi, issueApi, deleteApi, deleteLadderApi, saveLadderApi, getPriceLibMainsApi } from "../api/index";
import { DataSet, SrmMath } from "srm-mobile-ui";
import BigNumber from "bignumber.js";
import { commonDs, laddersDS } from "../datasource/indexDS";
import Utils from "../utils/util.js";

export default {
  modules: [ "smbl.common", "ssrc.priceLibraryNew", "ssrc.priceLibrary" ],
  name: "PricePoolManageDetail",
  components: {
  },
  data() {
    return {
      templateCode:"", // 模板编码
      viewCode:"",
      operationType:"", // 操作类型
      allCustomColumns:[], // 全部个性化字段
      editCustomData:{}, // 编辑页面对象
      priceLibInfo:{}, // 价格库个性化字段对象
      getCustomColumns:[],
      customDataInfo:{},
      ladderFlag:false, // 阶梯报价Pop
      ladderBasisInfo:{}, // 阶梯报价头信息
      ladderLineDs: new DataSet(commonDs()), // 阶梯报价行ds
      inputNetPriceFlag:false, // 未税单价计算控制标识，防止与含税单价计算相互干扰
    };
  },
  computed: {
    getLadderBasisInfo() {
      return [
        {
          fieldCode: "itemName",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称"),
        },
        {
          fieldCode: "itemCategoryIdMeaning",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemCategoryIdMeaning").$D("物料品类"),
        },
        {
          fieldCode: "currencyCodeMeaning",
          fieldName: this.$T("ssrc.priceLibraryNew.view.message.currencyCode").$D("币种"),
        },
        {
          fieldCode: "taxRate",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.taxRate").$D("税率"),
        },
      ];
    },
    getLadderLineInfo() {
      return [
        {
          fieldCode: "ladderLineNum",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderLineNum").$D("行号"),
        },
        {
          fieldCode: "ladderFrom",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderFromRange").$D("数量从(>=) "),
          fieldType: "INPUT_NUMBER",
          required:true
        },
        {
          fieldCode: "ladderTo",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderToRange").$D("数量至(<) "),
          fieldType: "INPUT_NUMBER",
          required:true
        },
        {
          fieldCode: "ladderPrice",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderPrice").$D("单价(含税) "),
        },
        {
          fieldCode: "ladderNetPrice",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderNetPrice").$D("单价(不含税) "),
          fieldType: "INPUT_NUMBER",
          required:true,
          inputChange: (val, record) => {
            this.inputLadderNetPriceFocus(val, record);
          },
        },
        {
          fieldCode: "cumulativeFlag",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.cumulative").$D("是否累计阶梯报价"),
          fieldType: "SWITCH",
          defaultValue:"0",
        },
        {
          fieldCode: "ladderPriceRemark",
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderPriceRemark").$D("备注"),
          fieldType: "INPUT",
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            <srm-button style="margin-right: 5px" type="primary" fill onClick={() => this.deleteLadderCheck(record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button>
          </srm-flex>
        },
      ];
    },
    getLadderBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          handler: () => {
            this.ladderFlag = !this.ladderFlag;
          }
        },
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          handler: () => this.saveLadder(),
          fill: true
        },
      ];
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          handler: () => {
            this.handlerPre("save");
          }
        },
        {
          title: this.$T("smbl.common.button.issue").$D("发布"),
          handler: () => this.handlerPre("issue"),
          fill: true
        },
        {
          title: this.$T("smbl.common.button.delete").$D("删除"),
          handler: () => this.handlerPre("delete")
        },
      ];
    },
  },
  async mounted() {
    this.$loading.show();
    const {
      allCustomColumns,
      editCustomData,
      templateCode,
      operationType,
      viewCode
    } = this.$route.query;
    this.allCustomColumns = allCustomColumns;
    this.templateCode = templateCode;
    this.viewCode = viewCode;
    this.editCustomData = editCustomData || {};
    this.operationType = operationType;
    // 构造个性化Columns
    await this.buildCustomColumns(this.allCustomColumns);
    // 渲染页面数据
    await this.initContact(this.editCustomData);
    this.$loading.hide();
  },
  methods: {
    // 阶梯报价含税单价计算
    inputLadderNetPriceFocus(val, record) {
      const curTaxRate = this.customDataInfo.taxRate;
      // console.log("record:", val, curTaxRate);
      const tempLadderPrice = curTaxRate ? SrmMath.plus(val, SrmMath.times(SrmMath.div(curTaxRate, 100), record.ladderNetPrice)) : new BigNumber(val);
      record.ladderPrice = tempLadderPrice;
      // console.log("tempLadderPrice:", tempLadderPrice);
    },
    // 含税单价计算（编辑未税单价触发）
    inputNetPriceFocus(val, record) {
      const curTaxRate = this.customDataInfo.taxRate;
      // console.log("record:", val, curTaxRate);
      const tempPrice = curTaxRate ? SrmMath.plus(val, SrmMath.times(SrmMath.div(curTaxRate, 100), record.netPrice)) : new BigNumber(val);
      record.taxIncludedPrice = tempPrice;
      // console.log("tempLadderPrice:", tempLadderPrice);
    },
    // 未税单价计算（编辑含税单价触发）
    inputTaxIncludedPriceFocus(val, record) {
      const curTaxRate = this.customDataInfo.taxRate;
      // console.log("record:", val, curTaxRate);
      const tempPrice = curTaxRate ? SrmMath.minus(val, SrmMath.times(SrmMath.div(curTaxRate, 100), record.taxIncludedPrice)) : new BigNumber(val);
      record.netPrice = tempPrice;
      // console.log("tempLadderPrice:", tempLadderPrice);
    },
    // 刷新列表页ds
    refreshListDs() {
      Utils.$emit("refreshListDs", "");
    },
    // 阶梯报价
    toLadderDetail() {
      // 头信息
      this.ladderBasisInfo = this.customDataInfo;
      // 行信息
      this.ladderLineDs.refresh();
      this.ladderFlag = !this.ladderFlag;
    },
    // 新增阶梯报价
    addLadder() {
      this.ladderLineDs.create({
        priceLibId:this.ladderBasisInfo.priceLibId
      }, this.ladderLineDs.data.length);
    },
    // 保存阶梯报价
    saveLadder() {
      if (!this.ladderLineDs.validate()) {
        return;
      }
      const params = this.ladderLineDs.data;
      this.$loading.show();
      saveLadderApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            duration: 1000,
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.save.success").$D("保存成功"),
            duration: 1000,
          });
          this.ladderLineDs.refresh();
        }
        this.$loading.hide();
      });
    },
    // 删除阶梯报价二次确认
    deleteLadderCheck(record) {
      const that = this;
      this.$dialog({
        content:
          this.$T("smbl.common.message.confirm.delete").$D("确认删除吗?"),
        closable: false,
        onOk() {
          that.deleteLadder(record);
        }
      });
    },
    // 删除阶梯报价
    deleteLadder(record) {
      if (typeof record.priceLibLadderId === "undefined") {
        this.ladderLineDs.removeLocalRecords([ this.ladderLineDs.current ]);
      } else {
        const params = [ record ];
        deleteLadderApi(params).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 1000,
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.deleteSuccess").$D("删除成功"),
              duration: 1000,
            });
            this.ladderLineDs.refresh();
          }
        });
      }
    },
    // 渲染页面数据
    initContact(item) {
      this.customDataInfo = { templateCode:this.templateCode, ...this.priceLibInfo, ...item };
      if (this.customDataInfo.priceLibId) {
        // 阶梯报价行信息
        this.ladderLineDs = new DataSet(laddersDS(this.customDataInfo.priceLibId, this.customDataInfo.benchmarkPriceType));
        this.ladderLineDs.refresh();
      }
    },
    // 构造个性化Columns
    buildCustomColumns(lists) {
      this.getCustomColumns = lists
        .filter((e) => e.enabledFlag === 1)
        .map((e) => {
          let renderColumns;
          let inputChangeColumns;
          let lovQueryParams = {};
          let lovSubDisplayField = "null";
          let lovSisplayField = "";
          // 阶梯报价
          if (e.dimensionCode === "ladderQuotation" && e.fieldWidget === "LINK") {
            renderColumns = (val, record) => {
              if (record.ladderQuotationFlag === 1) {
                return <srm-flex>
                  <srm-button type="primary" plain rect onClick={() => this.toLadderDetail()}> {val} </srm-button>
                </srm-flex>;
              }
            };
          } else if (e.dimensionCode === "netPrice" && e.fieldEditable) {
            this.inputNetPriceFlag = true;
            inputChangeColumns = (val, record) => {
              this.inputNetPriceFocus(val, record);
            };
          } else if (e.dimensionCode === "taxIncludedPrice" && e.fieldEditable && !this.inputNetPriceFlag) {
            inputChangeColumns = (val, record) => {
              this.inputTaxIncludedPriceFocus(val, record);
            };
          }

          // 1、处理lov固定传参
          // 2、处理值集显示及赋值
          if ([ "SELECT", "LOV" ].includes(e.fieldWidget)) {
            // 值集描述字段
            lovSisplayField = e.dimensionCode + "Meaning";
            if (e.fieldWidget === "LOV") {
              e.priceLibLovParamList.map((eChildren) => {
                lovQueryParams[eChildren.paramName] = eChildren.paramValue;
              });
              e.priceLibDimMapList.map((eChildren) => {
              // 值集内部（）中显示内容
                if (eChildren.sourceFromFieldName.lastIndexOf("Code") > 0) {
                  lovSubDisplayField = eChildren.sourceFromFieldName || null;
                }
                // 值集描述字段
                // if (eChildren.sourceFromFieldName.lastIndexOf("Name") > 0) {
                //   lovSisplayField = eChildren.sourceFromFieldName || e.dimensionCode + "Meaning";
                // }
                // 值集描述字段(税率字段处理)
                if (eChildren.sourceFromFieldName.lastIndexOf("Rate") > 0) {
                  lovSisplayField = eChildren.sourceFromFieldName;
                }
              });
            }
          }
          return {
            fieldCode:e.dimensionCode, // 字段编码
            fieldName:e.dimensionName, // 字段名称
            fieldType:e.fieldWidget, // 字段类型
            displayField:lovSisplayField, // 显示字段
            // displayField:[ "SELECT", "LOV" ].includes(e.fieldWidget) ? e.dimensionCode + "Meaning" : "", // 显示字段
            editor:Boolean(e.fieldEditable), // 是否可编辑
            // editor:true,
            required:Boolean(e.fieldRequired), // 是否必输
            visible:Boolean(e.fieldVisible), // 是否可见
            formRow:e.gridSeq, // 行序号
            lovCode:[ "SELECT", "LOV" ].includes(e.fieldWidget) ? e.sourceCode : "",
            inputChange: inputChangeColumns || "",
            render: renderColumns || "",
            defaultValue:[ "SWITCH" ].includes(e.fieldWidget) ? "0" : "",
            options: {
              subDisplayField: lovSubDisplayField,
              queryParams: lovQueryParams
            },
          };
        });
      // console.log("this.getCustomColumns:", this.getCustomColumns);
      // 设置个性化对象
      this.getCustomColumns
        .filter((e) => e.visible === 1)
        .map((e) => {
          this.priceLibInfo[e.fieldCode] = "";
        });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    // 保存成功刷新数据
    async refreshPriceLibMains(item) {
      // 构造个性化Columns
      await this.buildCustomColumns(this.allCustomColumns);
      // 渲染页面数据
      await this.initContact(item);
    },
    // 获取全量视图数据
    getPriceLibMains() {
      const params = {
        from: "EDIT",
        templateCode: this.templateCode,
        viewCode: this.viewCode,
        page: 0,
        size: 100000,
      };
      this.$loading.show();
      getPriceLibMainsApi(params).then((res) => {
        const curCustomDataInfo = res.content.filter((e) => e.priceLibId === this.customDataInfo.priceLibId);
        this.refreshPriceLibMains(curCustomDataInfo[0]);
        this.$loading.hide();
      });
    },
    handlerPre(type) {
      this.$loading.show();
      const params = [ this.customDataInfo ];
      if (type === "save" || type === "issue") {
        if (!this.$refs.dataSetRef.validate()) {
          this.$loading.hide();
          return;
        }
      }
      if (type === "save") {
        saveApi(params).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 1000,
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.save.success").$D("保存成功"),
              duration: 1000,
            });
            if (this.operationType === "add") {
              this.$router.back();
              this.refreshListDs();
            } else if (this.operationType === "edit") {
              this.getPriceLibMains();
              this.refreshListDs();
            }
          }
        });
      } else if (type === "issue") {
        issueApi(params).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 1000,
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              duration: 1000,
            });
            this.$router.back();
            this.refreshListDs();
          }
        });
      } else if (type === "delete") {
        deleteApi(params).then((res) => {
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 1000,
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.deleteSuccess").$D("删除成功"),
              duration: 1000,
            });
            this.$router.back();
            this.refreshListDs();
          }
        });
      }

    },
  },
};
</script>

<style lang="stylus" scoped>

.bottom-space-view {
  height: 72px;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}

</style>