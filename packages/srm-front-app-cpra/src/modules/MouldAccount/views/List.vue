<template>
  <div class="mould-data-list">
    <srm-list :data-set="dataSet[type]" :columns="getColumns" customize-code="SMBL.MOULD_ACCOUNT.LIST" :buttons="getButtons" @itemClick="itemClick">
      <srm-tab-bar slot="filter"
          :tabs="[
            $T('siec.mould.common.maLedger').$D('模具台账'),
            $T('siec.mould.common.maTransaction').$D('模具异动'),
          ]"
          display="justify"
          :active-index="currentTab"
          @indexChange="onTabIndexChange"/>
    </srm-list>

    <!--  审批意见  -->
    <approve-remark-popup v-model="approvePopupFlag" @onSuccess="approve" :requiredFlag="requiredFlag" />
  </div>
</template>

<script>
import { mouldAccountListDs, mouldAccountChangeListDs } from "../datasource/MouldAccountListDs";
import { DataSet, $T } from "srm-mobile-ui";
import ApproveRemarkPopup from "../components/ApproveRemarkPopup.vue";
import { queryInitialStateCorrespondingOperation, queryPageInfo } from "../api/config";
import { approveBatchMould, rejecteBactchMould } from "../api";
export default {
  modules: [ "hzero.common", "siec.mould"],
  name: "MouldAccount",
  components:{ ApproveRemarkPopup },
  data() {
    return {
      statusConfigId: null,
      // dataSet: new DataSet(mouldAccountListDs()),
      dataSet: {
        normal: new DataSet(mouldAccountListDs()),
        change: new DataSet(mouldAccountChangeListDs()),
      },
      operationCodes: [], // 状态机初始化按钮
      statusMap: new Map(), // 弹窗状态机状态按钮map
      type: "normal",
      currentTab: 0,
      approvePopupFlag: false,
      requiredFlag: false,
      checkedList: [],
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
          visible: this.statusMap.size && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH') && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH').includes("REJECT"),
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            const flag = checkedList.every((record) => record.get("approvalMethod") === "FUNCTIONAL");
            if (!flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            if (checkedList.length === 0) {
              return;
            }
            this.requiredFlag = true;
            this.approvePopupFlag = true;
            this.checkedList = checkedList;
          },
        },
        {
          text: $T("siec.mould.common.button.approve").$D("审批通过"),
          bordered: true,
          fill: true,
          type: "primary",
          size: "large",
          visible: this.statusMap.size && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH') && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH').includes("APPROVED"),
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            const flag = checkedList.every((record) => record.get("approvalMethod") === "FUNCTIONAL");
            if (!flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            if (checkedList.length === 0) {
              return;
            }
            this.requiredFlag = false;
            this.approvePopupFlag = true;
            this.checkedList = checkedList;
          },
        },
      ];
    },
    getColumns() {
      return [
        {
          fieldCode: "maNum",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>
              {val}
            </span>
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={"warn"}>
              {item.maStatusMeaning}
            </SrmButton>
          </SrmListHeader>,
        },
        {
          fieldCode: "mouldNum",
          fieldName: $T("siec.mould.model.common.mouldNum").$D("模具编码"),
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
          lovCode: "SIEC.MOULD_ACCOUNT_SOURCE_PLATFORM",
          fieldName: $T("siec.mould.model.common.sourcePlatform").$D("模具来源"),
          editor: false,
        },
        {
          fieldCode: "uomName",
          fieldName: $T("siec.mould.model.common.mouldUomName").$D("模具单位"),
        },
        {
          fieldCode: "companyName",
          fieldName: $T("siec.mould.model.common.company").$D("公司"),
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T("siec.mould.model.common.supplier").$D("外放供应商"),
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
      queryInitialStateCorrespondingOperation({ moduleCode: 'MOULD_ACCOUNT' }).then((res)=>{
        if(res){
          this.statusConfigId = res.statusConfigId;
          const operationCodes = (res.pageOperationList || []).map((item) => item.operationCode);
          this.operationCodes = operationCodes;
          this.queryPageInfo(res.statusConfigId);
          this.dataSet['normal'].addPathParameter("statusConfigId", res.statusConfigId);
          this.dataSet['change'].addPathParameter("statusConfigId", res.statusConfigId);
          this.dataSet[this.type].refresh();
        }
      })
    },
    onTabIndexChange(index) {
      this.currentTab = index;
      switch (index) {
      case 0:
        this.type = "normal";
        break;
      case 1:
        this.type = "change";
        break;
      default:
        break;
      }
      this.dataSet[this.type].refresh();
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
        name: "MouldAccountDetail",
        params: {
          type: this.type,
          statusConfigId: this.statusConfigId,
          maHeaderId: item.data.maHeaderId,
          operationCodes: this.operationCodes,
          statusMap: this.statusMap,
        }
      });
    },
    approve(approvedRemark) {
      this.$loading.show();
      const request = this.requiredFlag ? rejecteBactchMould : approveBatchMould;
      request({
        approvedRemark,
        body: this.checkedList.map((ele) => ({ ...ele.toData(), statusConfigId: this.statusConfigId })),
      }).then((res) => {
        this.approvePopupFlag = false;
        this.requiredFlag = false;
        if (!res || (res && !res.failed)) {
          this.dataSet[this.type].refresh().then(() => {
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
      // this.dataSet[this.type].refresh();
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