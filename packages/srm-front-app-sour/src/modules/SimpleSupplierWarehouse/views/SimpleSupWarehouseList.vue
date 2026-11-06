<template>
  <div>
    <div style="height: 100vh">
      <nav-head :title="$T('sslm.supplierWarehouse.view.title.simpleSupplierWarehouse').$D('简易供应商入库及变更')" @goBack="goBack" />
      <srm-list :data-set="dataSet" :columns="getColumns" customize-code="SMBL.SIMPLE_SUP_WAREHOUSE.LIST" @itemClick="goToDetail">
        <srm-flex slot="bottom" class="round-btn-box" justify="end">
          <srm-button class="round-btn" size="x-large" circle type="primary" fill
                      @click="openPopup">
            <em class="srm-icon icon-plus"/>
          </srm-button>
        </srm-flex>
      </srm-list>
    </div>
    <!-- 历史记录 -->
    <srm-popup :visible.sync="historyPop"
               :title="$T('sslm.supplierWarehouse.view.title.historyRecords').$D('历史记录')"
               height="100%">
      <srm-list
        v-if="historyPop"
        :data-set="historyDataSet"
        :columns="getHistoryColumnsInfo"/>
    </srm-popup>
    <!-- 新建 -->
    <srm-popup :visible.sync="creatDataPop"
               height="100%"
               width="80%"
               position="right">
      <div class="srm-creat-div">
        <customize-detail ref="creatDataRef" style="padding: 0 15px" :columns="creatDataInfo" :data-source="creatDataInfos"/>
        <srm-bottom-handler width="80%" :btn-arr="getBtnArr" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import indexDS from "../datasource/indexDS";
import { historyDataSet } from "../datasource/tabsInfoDS";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { deleteSupplierInfoApi, changeVerifyApi } from "../api/index";
export default {
  modules: [ "sslm.supplierWarehouse", "smbl.wideArea", "sslm.common", "smbl.common" ],
  name: "SimpleSupWarehouseList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
      historyDataSet:{},
      historyPop:false, // 历史记录Pop
      creatDataPop:false,
      historyBtnShowFlag:false,
      editBtnShowFlag:false,
      deleteBtnShowFlag:false,
      changeBtnShowFlag:false,
      creatDataInfos:{
        reqTypeCode:"",
        reqTypeCodeMeaning:"",
        supplierId:"",
        supplierName:"",
      },
      changeFlag:false,
    };
  },
  computed: {
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          handler: () => this.openPopup()
        },
        {
          title: this.$T("smbl.common.button.confirm").$D("确定"),
          handler: () => this.confirm(),
          fill: true
        },
      ];
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "reqNumber",
          fieldType: "EMPTY",
          render: (val, record) => {
            const reqStatusColor = record.reqStatus === "NEW" ? "#3095F2" : record.reqStatus === "REJECTED" ? "#F56649" : "#47B881";
            return <SrmListHeader>
              <span>{record.reqNumber}</span>
              <span slot="right" class={"item-num"} style={{ color:reqStatusColor }}> {record.reqStatusMeaning} </span>
            </SrmListHeader>;
          }
        },
        {
          fieldCode: "supplierName",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
        },
        {
          fieldCode: "reqTypeCodeMeaning",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
        },
        {
          fieldCode: "creator",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.creator").$D("创建人"),
        },
        {
          fieldCode: "creationDate",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.creationTime").$D("创建时间"),
        },
        {
          formRow: 99999,
          fieldType: "EMPTY",
          render: (val, record) => {
            const getUserId = SrmUtil.getUserInfo().id;
            const historyBtnShowFlag = [ "APPROVED" ].includes(record.reqStatus);
            const changeBtnShowFlag = [ "APPROVED" ].includes(record.reqStatus);
            const editBtnShowFlag = [ "NEW", "REJECTED" ].includes(record.reqStatus) && getUserId === record.createdBy;
            const deleteBtnShowFlag = [ "NEW", "REJECTED" ].includes(record.reqStatus) && getUserId === record.createdBy;
            return <srm-flex justify="end">
              { historyBtnShowFlag && <srm-button style="margin-right: 5px" type="primary" bordered onClick={() => this.showHistory(record)}> { this.$T("sslm.supplierWarehouse.view.btn.historyRecords").$D("历史记录") } </srm-button> }
              { changeBtnShowFlag && <srm-button style="margin-right: 5px" type="primary" fill onClick={() => this.goToDetailChange(record)}> { this.$T("sslm.supplierWarehouse.view.btn.changeInfo").$D("变更信息") } </srm-button> }
              { deleteBtnShowFlag && <srm-button style="margin-right: 5px" type="primary" bordered onClick={() => this.clickDelete(record)}> { this.$T("smbl.common.button.delete").$D("删除") } </srm-button> }
              { editBtnShowFlag && <srm-button style="margin-right: 5px" type="primary" fill onClick={() => this.goToDetailEdit(record, "edit")}> { this.$T("sslm.common.model.option.maintain").$D("编辑") } </srm-button> }
            </srm-flex>;
          }
        },
      ];
    },
    getHistoryColumnsInfo() {
      return [
        {
          fieldCode: "reqNumber",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.applyNum").$D("申请单号"),
          render: (val, record) => <srm-flex>
            <srm-button type="primary" plain rect onClick={() => this.goToDetailFromHistroy(record)}> { val } </srm-button>
          </srm-flex>
        },
        {
          fieldCode: "lastUpdateDate",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.lastChangeTime").$D("最近变更时间"),
        },
        {
          fieldCode: "creator",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.originator").$D("变更人"),
        },
      ];
    },
    creatDataInfo() {
      return [
        {
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
          fieldCode: "reqTypeCode",
          fieldType: "SELECT",
          lovCode: "SSLM.EXTERNAL_SUP_REQ_TYPE",
          displayField: "reqTypeCodeMeaning",
          required:true,
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
          },
        },
        {
          fieldCode: "supplierId",
          fieldName: this.$T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商"),
          fieldType: "LOV",
          lovCode: "SSLM.UNLINKED_EXT_SUPPLIER",
          displayField: "supplierName",
          required:() => this.creatDataInfos.reqTypeCode === "SUP_UPDATE_REQ",
          disabled:() => this.creatDataInfos.reqTypeCode === "SUP_NEW_REQ",
          options: {
            displayField: "supplierName",
            subDisplayField: "supplierNum",
            valueField: "supplierId",
          },
        },
      ];
    }
  },
  mounted () {},
  methods: {
    // 校验供应商是否可变更
    async changeVerify(supplierId) {
      this.changeFlag = false;
      await changeVerifyApi(supplierId).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: res.message,
            class: "notification",
            duration: 3
          });
          this.changeFlag = false;
        } else {
          this.changeFlag = true;
        }
      });
    },
    // 确定操作
    async confirm() {
      // 校验必输
      if (!this.$refs.creatDataRef.validate()) {
        return;
      }
      //新增供应商:SUP_NEW_REQ
      //变更信息:SUP_UPDATE_REQ
      if (this.creatDataInfos.reqTypeCode === "SUP_NEW_REQ") {
        this.goToDetailEdit("", "new");
      } else if (this.creatDataInfos.reqTypeCode === "SUP_UPDATE_REQ") {
        await this.changeVerify(this.creatDataInfos.supplierId);
        if (this.changeFlag) {
          this.goToDetailChange(this.creatDataInfos);
        }
      }
    },
    // 打开新建弹窗
    openPopup() {
      this.creatDataPop = !this.creatDataPop;
    },
    // 点击删除l
    clickDelete(record) {
      const that = this;
      this.$dialog({
        content: this.$T("smbl.common.message.confirm.delete").$D("确认删除吗？"),
        closable: false,
        onOk() {
          that.delete(record);
        }
      });
    },
    // 删除
    delete(record) {
      const params = [];
      params.push(record);
      const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.LIST";
      this.$loading.show();
      deleteSupplierInfoApi(params, customizeUnitCode).then(() => {
        this.$notification.open({
          message: this.$T("smbl.common.message.operateSuccess").$D(
            "操作成功"
          ),
          duration: 1000,
        });
        this.$loading.hide();
        // 刷新数据
        this.dataSet.refresh();
      });
    },
    goToDetail(item = {}) {
      const { data } = item;
      this.$router.push({
        name: "SimpleSupWarehouseDetail",
        query: { extSupplierReqId:data.extSupplierReqId }
      });
    },
    goToDetailFromHistroy(record) {
      this.$router.push({
        name: "SimpleSupWarehouseDetail",
        query: { extSupplierReqId:record.extSupplierReqId }
      });
    },
    // 跳转变更页
    goToDetailChange(record) {
      if (record.linkId) {
        this.$notification.open({
          message: this.$T("sslm.common.view.message.changeInfoWarning").$D(
            "该供应商已在平台注册，如需修改信息请联系供应商发起信息变更"
          ),
          duration: 1000,
        });
      } else {
        this.creatDataPop = false;
        setTimeout(() => this.$router.push({
          name: "SimpleSupWarehouseDetailChange",
          query: {
            supplierId:record.supplierId
          }
        }), 600);
      }
    },
    // 跳转编辑页
    goToDetailEdit(record, operationType) {
      this.creatDataPop = false;
      setTimeout(() => this.$router.push({
        name: "SimpleSupWarehouseDetailAdd",
        query: {
          extSupplierReqId:record.extSupplierReqId,
          operationType:operationType
        }
      }), 600);
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    // 历史记录
    showHistory(record) {
      this.historyDataSet = new DataSet(historyDataSet(record.supplierId));
      this.historyDataSet.refresh();
      this.historyPop = !this.historyPop;
    },
  },
};
</script>

<style lang="stylus" scoped>
.round-btn-box {
  background transparent;
  padding-bottom 60px;
  padding-right 15px;
}
</style>
