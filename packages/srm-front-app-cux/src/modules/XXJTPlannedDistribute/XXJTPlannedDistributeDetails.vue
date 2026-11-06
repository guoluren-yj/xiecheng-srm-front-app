<template>
  <div>
    <div style="height: calc(100vh - 20vw); overflow-y: auto">
      <srm-form :data-set="headerDataDs" theme="fill" :columns="getColumns" />
      <srm-bottom-handler v-if="headerDataDs.data[0]" :btn-arr="bottomBtn()" type="tooltip" />
    </div>

    <history-record
      v-model="operationPopup"
      :action-data="approvalRecords"
      operation-meaning-field-name="action"
      operator-field-name="createdByMeaning"
      process-date-field-name="creationDate"
      process-remark-field-name="modifyBefore"
      process-remark-info-field-name="modifyAfter" />
  </div>
</template>

<script>
import { DataSet, $T, SrmForm } from "srm-mobile-ui";

import { headerDs, distributeDs } from "./dataSource/index";
import { fetchSubmitInspection, hisToryApi } from "./api/index";
import HistoryRecord from "@/components/HistoryRecord";

export default {
  modules: [ "scux.XXJTPlannedDistribute" ],
  name: "XXJTPlannedDistributeDetails",
  components: { HistoryRecord },
  data() {
    const {
      app: {
        _route: {
          query: { biddingNum },
        },
      },
    } = this.$router;
    return {
      headerDataDs: new DataSet(headerDs(this)),
      biddingNum,
      operationPopup: false, //操作记录弹框
      approvalRecords: [], //操作记录数据
    };
  },
  computed: {
    getColumns() {
      return [ {
        fieldCode: "biddingNum",
      },
      {
        fieldCode: "ouName",
      },
      {
        fieldCode: "subjectName",
      },
      {
        fieldCode: "biddStatusMeaning",
      },
      {
        fieldCode: "sectorMeaning",
      },
      {
        fieldCode: "opeOrInfMeaning",
      },
      {
        fieldCode: "bidCatMeaning",
      },
      {
        fieldCode: "targetTypeMeaning",
      },
      {
        fieldCode: "biddingPlanTime",
      },
      {
        fieldCode: "budgetAmout",
      },
      {
        fieldCode: "budgetSourceMeaning",
      },
      {
        fieldCode: "createdByMeaning",
      },
      {
        fieldCode: "projectManager",
      },
      {
        fieldCode: "bidPlaceMeaning",
      },
      {
        fieldCode: "planMonth",
      },
      {
        fieldCode: "planTypeMeaning",
      },
      {
        fieldCode: "displayPrNumsMeaning",
      },
      {
        fieldCode: "remark",
      },
      {
        fieldCode: "unitCodeMeaning",
      },
      {
        fieldCode: "employeeName",
      },
      {
        fieldCode: "reviewComments",
      }, {
        fieldCode: "operatingrecord",
        render: (_, record) =>
          <a
            style="color:#276EF1;"
            onClick={() => this.handleLook(record)}
          >
            {$T("scux.XXJTPlannedDistribute.button.look").$D("查看")}
          </a>
        ,
      }, ];

    },
  },
  beforeMount() {
    this.headerDataDs.setQueryParameter({ biddingNum: this.biddingNum });
    this.headerDataDs.refresh();
  },
  mounted() {
  },
  methods: {
    getDistributeColumns() {
      return [
        {
          fieldCode: "unitIdLov",
        },
        {
          fieldCode: "employeeIdLov",
        },
      ];
    },
    async handleReturnInspection(type) {
      if (type === "return") {
        this.$dialog({
          content: $T("scux.XXJTPlannedDistribute.view.message.returnInspection").$D("是否确认退回计划至计划提报人进行修改？"),
          onOk: async () => {
            const formData = this.headerDataDs.current.data;
            this.$loading.show();
            try {
              const res = await fetchSubmitInspection([ { ...formData, actionType: type } ]);
              if (res && !res.failed) {
                this.$router.replace({
                  name: "XXJTPlannedDistribute",
                });
              }
            } finally {
              this.$loading.hide();
            }
          },
        });
      } else {
        const formData = this.headerDataDs.current.data;
        const { unitCode, unitName, unitCodeMeaning } = formData || {};
        const distributeDataDs = new DataSet(distributeDs());
        distributeDataDs.create({ unitIdLov: unitCodeMeaning, unitCode, unitName });
        this.$dialog({
          title: $T("scux.XXJTPlannedDistribute.view.title.distribute").$D("招标计划分配"),
          content: <SrmForm dataSet={distributeDataDs} columns={this.getDistributeColumns()} />,
          onOk: async () => {
            const validateFlag = distributeDataDs.validate();
            if (validateFlag) {
              const currentData = distributeDataDs.data[0];
              const { employeeIdLov, employeeIdLovMeaning, unitIdLov } = currentData || {};
              this.$loading.show();
              try {
                const res = await fetchSubmitInspection([ { ...formData, employeeId: employeeIdLov, employeeName: employeeIdLovMeaning, unitCode: unitIdLov, unitName: currentData.unitName, actionType: type } ]);
                if (res && !res.failed) {
                  this.$router.replace({
                    name: "XXJTPlannedDistribute",
                  });
                }
              } finally {
                this.$loading.hide();
              }
            } else {
              this.$notification.open({
                message: $T("scux.XXJTPlannedDistribute.message.requestMessage").$D("请填写必填项"),
                class: "notification"
              });
            }
          },
        });
      }
    },
    bottomBtn() {
      return [ {
        text: $T("scux.XXJTPlannedDistribute.button.returnInspection").$D("退回至修改"),
        type: "primary",
        bordered: true,
        visible: true,
        handler: () => {
          this.handleReturnInspection("return");
        }
      }, {
        text: $T("scux.XXJTPlannedDistribute.button.allocation").$D("分配"),
        type: "primary",
        fill: true,
        bordered: true,
        visible: true,
        handler: () => {
          this.handleReturnInspection("distribution");
        }
      }, ];

    },
    // 操作记录
    handleLook(record) {
      this.operationPopup = !this.operationPopup;
      const { id } = record;
      const dwparams = {
        dataId: id,
        page: 0,
        size: 10,
      };
      hisToryApi(dwparams).then((res) => {
        if (res && !res.failed) {
          const data = res.content || [];
          this.approvalRecords = data;
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.create-receive-detail-scroll-el {
    height 100%;
    overflow-y scroll;
    overflow-x hidden;
     padding-bottom 35px;
    .create-receive-detail-button {
      margin-right 10px;
    }
  }
.line-filter {
  display flex;
  justify-content space-between;
  color var(--font-color-primary);
  font-size 18px;
  font-weight 600;
  padding 13px;
}
.srm-list-inspection-line {
  white-space break-spaces;
}

</style>
