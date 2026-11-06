<template>
  <div class="mould-data-list">
    <srm-list :data-set="dataSet" :columns="getColumns" customize-code="SMBL.MOULD_DATA.LIST" :buttons="getButtons" @itemClick="itemClick">
    </srm-list>
  </div>
</template>

<script>
import { mouldDataListDS } from "../datasource/MouldDataListDs";
import { DataSet, $T } from "srm-mobile-ui";
import { queryInitialStateCorrespondingOperation, queryPageInfo } from "../api/config";
import { approveBatchMould, rejecteBactchMould } from "../api";
export default {
  modules: [ "hzero.common", "siec.mould"],
  name: "MouldData",
  data() {
    return {
      statusConfigId: null,
      dataSet: new DataSet(mouldDataListDS()),
      operationCodes: [], // 状态机初始化按钮
      statusMap: new Map(), // 弹窗状态机状态按钮map
    };
  },
  computed: {
    getButtons() {
      return [
        {
          text: $T("siec.mould.common.button.reject").$D("审批拒绝"),
          bordered: true,
          type: "danger",
          size: "large",
          visible: this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_REJECTED"),
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            console.log(checkedList);
            const flag = checkedList.every((record) => record.get("changeApprovalMethod") === "FUNCTIONAL" && ![1, '1'].includes(record.get("changeButtonNotAvailableFlag")));
            if (!flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            if (checkedList.length === 0) {
              return;
            }
            this.$loading.show();
            rejecteBactchMould(checkedList.map((ele) => ({...ele.toData(), statusConfigId: this.statusConfigId }))).then((res) => {
              if (!res || (res && !res.failed)) {
                this.dataSet.refresh().then(() => {
                  this.$notification.open({
                    message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                    class: "notification"
                  });
                  this.$loading.hide();
                });
              } else {
                this.$loading.hide();
              }
            });
          },
        },
        {
          text: $T("siec.mould.common.button.approve").$D("审批通过"),
          bordered: true,
          fill: true,
          type: "primary",
          size: "large",
          visible: this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_APPROVED"),
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            const flag = checkedList.every((record) => record.get("changeApprovalMethod") === "FUNCTIONAL" && ![1, '1'].includes(record.get("changeButtonNotAvailableFlag")));
            if (!flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            if (checkedList.length === 0) {
              return;
            }
            this.$loading.show();
            approveBatchMould(checkedList.map((ele) => ({...ele.toData(), statusConfigId: this.statusConfigId }))).then((res) => {
              if (!res || (res && !res.failed)) {
                this.dataSet.refresh().then(() => {
                  this.$notification.open({
                    message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                    class: "notification"
                  });
                  this.$loading.hide();
                });
              } else {
                this.$loading.hide();
              }
            });
          },
        },
      ];
    },
    getColumns() {
      return [
        {
          fieldCode: "mouldNum",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>
              {val}
            </span>
          </SrmListHeader>,
        },
        {
          fieldCode: "mouldName",
          fieldName: $T("siec.mould.model.common.mouldName").$D("模具名称"),
        },
        {
          fieldCode: "createdByName",
          fieldName: $T("siec.mould.model.common.createdByName").$D("创建人"),
        },
        {
          fieldCode: "sourcePlatform",
          fieldType: "SELECT",
          lovCode: "SIEC.MOULD_SOURCE_PLATFORM",
          fieldName: $T("siec.mould.model.common.sourcePlatform").$D("模具来源"),
          editor: false,
        },
        {
          fieldCode: "uomName",
          fieldName: $T("siec.mould.model.common.mouldUomName").$D("模具单位"),
        },
        {
          fieldCode: "companyName",
          fieldName: $T("siec.mould.model.common.companyId").$D("模具生产商"),
        },
        {
          fieldCode: "supplierName",
          fieldName: $T("siec.mould.model.common.supplier").$D("外放供应商"),
          render: (val, item) => {
            return item.supplierCompanyName || val;
          },
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("siec.mould.model.common.creationDate").$D("创建日期"),
        },
      ];
    },
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      queryInitialStateCorrespondingOperation({ moduleCode: 'MOULD_MAIN' }).then((res)=>{
        if(res){
          this.statusConfigId = res.statusConfigId;
          const operationCodes = (res.pageOperationList || []).map((item) => item.operationCode);
          this.operationCodes = operationCodes;
          this.queryPageInfo(res.statusConfigId);
          this.dataSet.addPathParameter("statusConfigId", res.statusConfigId);
          this.dataSet.refresh();
        }
      })
    },
    queryPageInfo(statusConfigId){
    try {
      queryPageInfo({ statusConfigId }).then((res)=>{
        const statusMap = new Map();
        if (res) {
          res.statusList.forEach((item) => {
            statusMap.set(
              item.statusCode,
              (item.pageOperationList || []).map((i) => i.operationCode)
            );
          });
          this.statusMap = statusMap;
        }
      });
    } catch (err) {
      console.log(err);
    }
    },
    itemClick(item) {
      // 进入详情
      console.log(item)
      this.$router.push({
        name: "MouldDataDetail",
        params: {
          statusConfigId: this.statusConfigId,
          mouldId: item.data.mouldId,
          operationCodes: this.operationCodes,
          statusMap: this.statusMap,
        }
      });
    },
    refresh() {
      this.dataSet.refresh();
    },
  },
};
</script>

<style lang="stylus" scoped>

.mould-data-list {
  width: 100vw;
  height: 100vh;
}

</style>