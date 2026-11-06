<template>
  <div>
    <div style="height: 100vh">
      <nav-head :title="$T('ssrc.priceLibraryNew.view.title.priceLibrary').$D('价格库')" @goBack="goBack" />
      <srm-list style="height: 90vh" :data-set="mainPriceDS" :columns="getListColumns" :buttons="getButtons()" customize-code="SMBL.PRICE_POOL_MANAGE.LIST">
        <srm-flex slot="filter" class="filter-item-box" justify="between">
          <srm-flex-item :flex="1">
            <srm-dropdown :text="$T('ssrc.priceLibraryNew.view.title.priceLibrary').$D('价格库')">
              <price-lib-tmpl-category v-if="!priceLibraryPop" :type="priceLibType" :init-category="initCategory" @select="onPriceLibTmplSelect"/>
            </srm-dropdown>
          </srm-flex-item>
          <srm-flex-item :flex="1">
            <srm-dropdown ref="filterDropdown" :text="$T('smbl.common.button.filter').$D('筛选')">
              <srm-flex direction="column">
                <srm-scroll style="width: 100%; height: 50vh" :refreshable="false">
                  <customize-detail :key="curTemplateCode" style="width: 100%; padding: 0 15px" :columns="getFilterColumns" :data-source="filterInfo"/>
                </srm-scroll>
                <srm-blank size="large"/>
                <srm-flex justify="between">
                  <srm-button style="border-radius: 0 !important"
                              plain
                              type="default" full-width rect size="x-large"
                              @click.stop="onFilterReset">
                    {{ $T("smbl.common.button.reset").$D("重置") }}
                  </srm-button>
                  <srm-button style="border-radius: 0 !important"
                              type="primary" fill full-width rect size="x-large"
                              @click.stop="onFilterConfirm">
                    {{ $T("smbl.common.button.confirm").$D("确定") }}
                  </srm-button>
                </srm-flex>
              </srm-flex>
            </srm-dropdown>
          </srm-flex-item>
        </srm-flex>
        <srm-flex slot="bottom" class="round-btn-box" justify="end">
          <srm-button class="round-btn" size="x-large" circle type="primary" fill
                      @click="addPriceLibrary">
            <em class="srm-icon icon-plus"/>
          </srm-button>
        </srm-flex>
      </srm-list>
      <srm-popup
        :visible.sync="priceLibraryPop"
        position="right"
        :show-back="false"
        :height="rightHeight"
        show-close
        :title="$T('ssrc.priceLibraryNew.view.title.priceLibrary').$D('价格库')">
        <srm-flex v-show="popLoading" justify="center" align="center" style="margin-top: 20%;">
          <srm-button :loading="popLoading" size="mid" circle plain/>
        </srm-flex>
        <srm-flex align="start" class="srm-pop-priceLibrary">
          <srm-flex-item flex="1" class="srm-pop-priceLibrary-scroll srm-pop-priceLibrary-scroll-left">
            <srm-checkbox-group v-model="priceLibraryIndex">
              <srm-checkbox v-for="(priceLibrary, index) in priceLibraryList" :key="index"
                            :cancelable="false"
                            :option="priceLibrary" position="right">
                <touch-feedback active-class-name="srm-pop-priceLibrary-item-active">
                  <span class="srm-pop-priceLibrary-document-item">
                    <span class="srm-pop-priceLibrary-document-item-text">
                      {{ priceLibrary.templateName }}
                    </span>
                  </span>
                </touch-feedback>
              </srm-checkbox>
            </srm-checkbox-group>
          </srm-flex-item>
        </srm-flex>
        <srm-bottom-handler :btn-arr="getBtnArr" type="tooltip"/>
      </srm-popup>
    </div>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { commonDs, mainPriceDS } from "../datasource/indexDS";
import PriceLibTmplCategory from "../component/PriceLibTmplCategory";
import Utils from "../utils/util.js";
import {
  getAllPriceLibTmplDimsApi,
  getPriceLibTmplDimsHeaderApi,
  deleteApi,
  issueApi
} from "../api/index";
export default {
  modules: [ "ssrc.priceLibDimension", "ssrc.priceLibraryNew", "ssrc.priceLibrary", "smbl.common" ],
  name: "PricePoolManageList",
  components: { PriceLibTmplCategory },
  data() {
    return {
      priceLibType:"priceLibrary",
      curTemplateCode:"", // 当前价格库模板编码
      curViewCode:"ALL_VIEW", // 当前视图类型编码，暂定：固定为全量视图类型
      initCategory:{}, // 初始化价格库模板
      priceLibTmplDimsList:[], // 全部已发布价格库模板
      priceLibraryList:[],
      priceLibraryIndex:[],
      subPriceLibraryIndex:[],
      mainPriceDS: new DataSet(commonDs()), // 列表页ds
      filterDS: new DataSet(commonDs()), // 筛选页ds
      filterInfo: {},
      getFilterColumns:[], // 模板个性化筛选字段
      getAllPriceLibColumns:[], // 全部模板个性化字段
      priceLibraryPop:true,
      rightHeight: "100%",
      popLoading: true,
      getListColumns:[],
    };
  },
  computed: {
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.ok").$D("确认"),
          fill: true,
          handler: () => this.handlerSelectPriceLibs()
        },
      ];
    },
    // getColumns() {
    //   return [
    //     {
    //       formRow: 0,
    //       fieldCode: "reqNumber",
    //       fieldType: "EMPTY",
    //       render: (val, record) => {
    //         // 审批中:APPROVALING | 审批拒绝:APPROVAL_REJECTED | 撤销:WITHDRAW | 无:NONE | 审批通过:APPROVAL_SUCCESS
    //         const reqStatusColor = [ "APPROVAL_SUCCESS", "APPROVALING" ].includes(record.approvalStatus) ? "#3095F2" : "#F56649";
    //         const approvalStatusMeaning = [ "NONE" ].includes(record.approvalStatus) ? "" : record.approvalStatusMeaning;
    //         return <SrmListHeader>
    //           <span>{this.$T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称")}：{record.itemName}</span>
    //           <span slot="right" class={"item-num"} style={{ color:reqStatusColor }}> {approvalStatusMeaning} </span>
    //         </SrmListHeader>;
    //       }
    //     },
    //     {
    //       fieldCode: "itemIdMeaning",
    //       fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemID").$D("物料ID"),
    //     },
    //     {
    //       fieldCode: "taxIncludedPrice",
    //       fieldName: this.$T("ssrc.priceLibraryNew.model.library.taxIncludedPrice").$D("单价(含税)"),
    //     },
    //     {
    //       fieldCode: "uomIdMeaning",
    //       fieldName: this.$T("ssrc.priceLibrary.model.priceLibrary.uomName").$D("单位"),
    //     },
    //     {
    //       fieldCode: "companyIdMeaning",
    //       fieldName: this.$T("ssrc.priceLibraryNew.model.library.companyIdMeaning").$D("公司"),
    //     },
    //     {
    //       fieldCode: "supplierCompanyIdMeaning",
    //       fieldName: this.$T("ssrc.priceLibraryNew.model.library.supplierCompanyIdMeaning").$D("供应商"),
    //     },
    //     {
    //       fieldCode: "priceLibNumber",
    //       fieldName: this.$T("ssrc.priceLibraryNew.model.library.priceLibNumber").$D("价格编号"),
    //     },
    //     {
    //       formRow: 99999,
    //       fieldType: "EMPTY",
    //       render: (val, record) => <srm-flex justify="end">
    //         { <srm-button style="margin-right: 5px" type="primary" bordered onClick={() => this.clickDeleteOne(record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button> }
    //         { <srm-button style="margin-right: 5px" type="primary" fill onClick={() => this.goToDetailEdit(record)}> { this.$T("smbl.common.button.edit").$D("编辑") } </srm-button> }
    //       </srm-flex>
    //     },
    //   ];
    // },
  },
  watch: {
    type() {
      this.fetchCategoryList();
    },
    priceLibraryIndex(val) {
      this.subPriceLibraryIndex = [];
      if (val && val.length) {
        this.onInitPriceLibTmplSelect(val[0]);
      }
    },
    subPriceLibraryIndex(val) {
      if (val && val.length) {
        this.onInitPriceLibTmplSelect(val[0]);
      }
    }
  },
  beforeMount () {
    this.fetchAllPriceLibInfo();
  },
  mounted() {
    this.rightHeight = "55%";
    let that = this;
    Utils.$on("refreshListDs", function (param) {
      that.refreshDs(param);
    });
  },
  methods: {
    // 选择价格库确认处理
    handlerSelectPriceLibs() {
      this.priceLibraryPop = !this.priceLibraryPop;
      this.priceLibType = "priceLibraryItem";
    },
    // 选择价格库
    onInitPriceLibTmplSelect(category = {}) {
      this.initCategory = {
        templateCode:category.templateCode,
        templateName:category.templateName
      };
    },
    refreshDs() {
      this.mainPriceDS.refresh();
    },
    getButtons() {
      return [
        {
          text: this.$T("smbl.common.button.delete").$D("删除"),
          type: "primary",
          bordered: true,
          visible: () => true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList, data, list) => {
            this.$dialog({
              content: this.$T("smbl.common.message.confirm.delete").$D("确认删除吗？"),
              onOk: () => {
                this.clickDeleteMulti(checkedList, data, list);
              }
            });
          },
        },
        {
          text: this.$T("smbl.common.button.issue").$D("发布"),
          type: "primary",
          fill: true,
          visible: () => true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList, data, list) => {
            this.$dialog({
              content: this.$T("smbl.common.message.confirm.issue").$D("确认发布吗？"),
              onOk: () => {
                this.clickIssueMulti(checkedList, data, list);
              }
            });
          },
        },
      ];
    },
    // 获取价格库信息
    async fetchAllPriceLibInfo() {
      const params = {
        page: 0,
        size: 10000
      };
      this.$loading.show();
      await getAllPriceLibTmplDimsApi(params).then((res) => {
        // templateStatus:RELEASED(已发布状态)
        this.priceLibTmplDimsList = res.content.filter((e) => e.templateStatus === "RELEASED" && e.menuId);
        // 价格库弹窗列表数据
        this.priceLibraryList = this.priceLibTmplDimsList;
        this.priceLibraryIndex = [ this.priceLibraryList[0] ];
        // 设置下拉菜单初始价格库模板
        this.curTemplateCode = this.priceLibTmplDimsList[0]?.templateCode;
        if (!this.curTemplateCode) {
          this.$notification.open({
            message: this.$T("ssrc.priceLibDimension.view.message.noneRelesae").$D("没有已发布的价格库"),
            description: res.message,
            class: "notification",
            duration: 3
          });
          return false;
        }
        this.initCategory = {
          templateCode:this.priceLibTmplDimsList[0].templateCode,
          templateName:this.priceLibTmplDimsList[0].templateName
        };
        // 设置筛选条件
        this.getPriceLibTmplDimsHeaderInfo(this.curTemplateCode);
        // 加载
        this.mainPriceDS = new DataSet(mainPriceDS(this.curTemplateCode, this.curViewCode));
        this.mainPriceDS.refresh();
        this.popLoading = false;
        this.$loading.hide();
      });
    },
    // 切换价格库模板
    async onPriceLibTmplSelect(category = {}) {
      this.curTemplateCode = category.templateCode;
      // 重新设置模板个性化字段、筛选条件
      this.getPriceLibTmplDimsHeaderInfo(this.curTemplateCode);
      // 刷新 mainPriceDS
      this.mainPriceDS = new DataSet(mainPriceDS(this.curTemplateCode, this.curViewCode));
      this.mainPriceDS.refresh();
    },
    // 设置模板个性化字段、筛选条件
    async getPriceLibTmplDimsHeaderInfo(templateCode) {
      this.getFilterColumns = [];
      // 新增页面，获取个性化字段（编辑）
      const params = {
        dimensionType: "BASIC",
        from: "EDIT",
        templateCode: templateCode,
        viewCode: "ALL_VIEW",
      };
      await getPriceLibTmplDimsHeaderApi(params).then((res) => {
        // 【1】查询条件(queryFlag)
        this.getFilterColumns = res
          .filter((e) => e.queryFlag === 1)
          .map((e) => {
            let lovQueryParams = {};
            let lovSubDisplayField = "null";
            let lovSisplayField = "";
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
            // console.log("查询字段：", e.dimensionCode, e.dimensionName, e.fieldWidget, e.sourceCode);
            return {
              fieldCode:e.dimensionCode, // 字段编码
              fieldName:e.dimensionName, // 字段名称
              fieldType:e.fieldWidget, // 字段类型
              displayField:lovSisplayField, // 显示字段
              lovCode:[ "SELECT", "LOV" ].includes(e.fieldWidget) ? e.sourceCode : "",
              options: {
                subDisplayField: lovSubDisplayField,
                queryParams: lovQueryParams
              },
            };
          });
        // 【2】模板个性化字段
        this.getAllPriceLibColumns = res;
        // 【3】列表展示字段
        this.getListColumns = [];
        this.getListColumns = res
          .filter((e) => e.enabledFlag === 1 && e.mobileShowFlag === 1)
          .map((e, index) => {
            let lovQueryParams = {};
            let lovSubDisplayField = "null";
            let lovSisplayField = "";
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
                  // 值集描述字段(税率字段处理)
                  if (eChildren.sourceFromFieldName.lastIndexOf("Rate") > 0) {
                    lovSisplayField = eChildren.sourceFromFieldName;
                  }
                });
              }
            }
            if (index === 0) {
              return {
                fieldCode:e.dimensionCode, // 字段编码
                fieldName:e.dimensionName, // 字段名称
                fieldType: "EMPTY", // 字段类型
                formRow:e.gridSeq, // 行序号
                render: (val, record) => {
                  const dimensionCode = record[e.dimensionCode + "Meaning"] ? record[e.dimensionCode + "Meaning"] : record[e.dimensionCode];
                  return <SrmListHeader showOpenTag={false}>
                    <span>{e.dimensionName}：{ dimensionCode }</span>
                  </SrmListHeader>;
                }
              };
            }
            return {
              fieldCode:e.dimensionCode, // 字段编码
              fieldName:e.dimensionName, // 字段名称
              fieldType:e.fieldWidget, // 字段类型
              displayField:lovSisplayField, // 显示字段
              editor:false, // 是否可编辑(列表页都不可编辑)
              disabled:true,
              visible:Boolean(e.fieldVisible), // 是否可见
              formRow:e.gridSeq, // 行序号
              lovCode:[ "SELECT", "LOV" ].includes(e.fieldWidget) ? e.sourceCode : "",
              defaultValue:[ "SWITCH" ].includes(e.fieldWidget) ? "0" : "",
              options: {
                subDisplayField: lovSubDisplayField,
                queryParams: lovQueryParams
              },
            };

          });
        // 首行渲染
        // this.getListColumns.push({
        //   formRow: 0,
        //   fieldCode: "reqNumber",
        //   fieldType: "EMPTY",
        //   render: (val, record) => {
        //     // 审批中:APPROVALING | 审批拒绝:APPROVAL_REJECTED | 撤销:WITHDRAW | 无:NONE | 审批通过:APPROVAL_SUCCESS
        //     const reqStatusColor = [ "APPROVAL_SUCCESS", "APPROVALING" ].includes(record.approvalStatus) ? "#3095F2" : "#F56649";
        //     const approvalStatusMeaning = [ "NONE" ].includes(record.approvalStatus) ? "" : record.approvalStatusMeaning;
        //     return <SrmListHeader showOpenTag={false}>
        //       <span>{this.$T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称")}：{record.itemIdMeaning}</span>
        //       <span slot="right" class={"item-num"} style={{ color:reqStatusColor }}> {approvalStatusMeaning} </span>
        //     </SrmListHeader>;
        //   }
        // });
        // 尾行渲染
        this.getListColumns.push({
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex justify="end">
            { <srm-button style="margin-right: 5px" type="primary" bordered onClick={() => this.clickDeleteOne(record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button> }
            { <srm-button style="margin-right: 5px" type="primary" fill onClick={() => this.goToDetailEdit(record)}> { this.$T("smbl.common.button.edit").$D("编辑") } </srm-button> }
          </srm-flex>
        });
        // console.log("getListColumns:", this.getListColumns);
      });
      this.filterDS.reset();
    },
    // 重置
    onFilterReset() {
      Object.keys(this.filterInfo).forEach((e) => {
        if (e !== "_defaultValueInitialize") {
          this.mainPriceDS.addQueryParameter(e, null);
        }
      });
      this.filterInfo = {};
    },
    // 确定
    onFilterConfirm() {
      // 添加筛选条件
      Object.keys(this.filterInfo).forEach((e) => {
        if (e !== "_defaultValueInitialize" && this.filterInfo[e] !== null) {
          this.mainPriceDS.addQueryParameter(e, this.filterInfo[e]);
        }
      });
      this.mainPriceDS.refresh();
      this.$refs.filterDropdown.close();
    },
    // 新增价格库行
    addPriceLibrary() {
      this.$router.push({
        name: "PricePoolManageDetail",
        query: {
          templateCode: this.curTemplateCode,
          viewCode:this.curViewCode,
          allCustomColumns: this.getAllPriceLibColumns,
          operationType:"add",
        }
      });
    },
    // 删除
    clickDeleteOne(record) {
      const params = [ record ];
      this.$loading.show();
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
          this.mainPriceDS.refresh();
        }
        this.$loading.hide();
      });
    },
    // 批量删除
    clickDeleteMulti(records) {
      let params = [];
      records.map((e) => {
        params.push(e.data);
      });
      this.$loading.show();
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
          this.mainPriceDS.refresh();
        }
        this.$loading.hide();
      });
    },
    // 批量发布
    clickIssueMulti(records) {
      let params = [];
      records.map((e) => {
        params.push({ templateCode:this.curTemplateCode, ...e.data });
      });
      this.$loading.show();
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
          this.mainPriceDS.refresh();
        }
        this.$loading.hide();
      });
    },
    // 编辑
    goToDetailEdit(record = {}) {
      this.$router.push({
        name: "PricePoolManageDetail",
        query: {
          viewCode:this.curViewCode,
          templateCode: this.curTemplateCode,
          allCustomColumns: this.getAllPriceLibColumns,
          operationType:"edit",
          editCustomData:{ ...record },
        }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>
.round-btn-box {
  background transparent;
  padding: 0 15px 75px 0;
}

.srm-pop-priceLibrary {
  width 100%;
  height 400px;
  padding-bottom: 65px;
  background var(--background-color-empty);
}

.srm-pop-priceLibrary-scroll {
  height: 100%;
  overflow-y: scroll
}

.srm-pop-priceLibrary-scroll-left {
  background var(--background-color-empty);
}

.srm-pop-priceLibrary-document-item {
  display -webkit-box;
  margin-left 10px;
  width 100%;
  font-size: 14px;
  color: var(--font-color-default);
  line-height: 20px;
  background var(--background-color-empty);
  text-align left;
  border-bottom var(--split-line-color-primary) solid 1px
}

.srm-pop-priceLibrary-document-item-text {
  margin 20px 0;
  padding 0 30px 0 10px;
  width 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow hidden;
}

.srm-pop-priceLibrary-item-active {
  color var(--font-color-primary);
  font-weight bold;
  background var(--background-color-empty);
}

.srm-check-box-button-checked + .srm-check-box-content {
  .srm-pop-priceLibrary-document-item-text {
    background var(--background-color-empty);
    color var(--font-color-primary);
    font-weight bold;
  }
}

// >>> .srm-check-box-button {
//   position absolute;
//   right 0;
//   display none;
// }

// >>> .srm-check-box-button-checked {
//   display block;
//   background none;
//   border none;
//   color var(--font-color-primary);
//   font-size 18px;
// }
</style>
