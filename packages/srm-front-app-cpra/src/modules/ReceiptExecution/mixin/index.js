import {
  getExecLovApi,
  getBatchSetExecApi,
  getBatchSetAllExecApi
} from "../api/index";
import {
  isEmpty
} from "@/utils/index";

export default {
  data() {
    return {
      tenantId: window.localStorage.getItem("tenantId"),
      catalogPop:false, // 选择类型
      catalogAllPop:false, // 全选执行，选择类型
      cataLovCode:"SPUC.SINV_REVERSE_NODE_URL",
      strategyLineIds:"",
      nodeConfigId:"",
      myParams:{}
    };
  },
  computed: {},
  methods: {
    // 获取值
    async GetCatalogValue(val) {
      const { selectArr, nowNode, successF } = this.myParams;

      await this.batchSetExec(selectArr, nowNode, successF, val[0]);
    },
    // 全选执行获取值
    async GetCatalogAllValue(val) {
      const { nowNode, successF } = this.myParams;

      await this.allSetExec(nowNode, successF, val[0]);
    },
    // 执行方法
    // 执行前判断操作
    async handleExceFun(selectArr, nowNode, successF) {
      if (!selectArr.length) {
        this.$notification.open({
          message: this.$T("hipspfm.expertScoring.view.message.selectOneData").$D("请至少勾选一条数据"),
          description: "",
          class: "notification",
        });
        return;
      }
      const listStatus = nowNode.actionCode;
      selectArr.map((item) => {
        const qty = item?.quantity ? Number(item?.quantity) : item?.quantity;
        item.quantity = qty;
      });

      if (listStatus === "DOING") {
        for (let i = 0; i < selectArr.length; i++) {
          // eslint-disable-next-line no-console
          if (!selectArr[i]?.sugRcvStatusCode) {
            this.$notification.open({
              message: this.$T("sinv.receiptExecution.model.receipt.check").$D("策略为必填项"),
              description: "",
              class: "notification",
            });
            return false;
          }
        }
        await this.batchSetExec(selectArr, nowNode, successF);
        return;
      }
      const nodeConfigId = nowNode.nodeConfigId;
      const params = {
        listStatus,
        ...{
          nodeConfigId
        },
        tenantId: this.tenantId,
      };

      if (listStatus === "WAITING") {
        params.lovCode = "SPUC.SINV_MOVE_TYPE";
      } else {
        params.strategyLineIds = `${selectArr.map((i) => i.strategyLineId.toString())},`;
        this.strategyLineIds = params.strategyLineIds;
      }
      this.$loading.show();
      const res = await getExecLovApi(params);

      this.$loading.hide();
      if (res && !res.failed) {
        if (isEmpty(res.content)) {
          this.$notification.open({
            message: this.$T("sinv.receiptExecution.model.receipt.not.transactionType").$D("找不到对应的事务类型"),
            description: "",
            class: "notification",
          });
        } else if (res.totalElements === 1) {
          await this.batchSetExec(selectArr, nowNode, successF, res.content[0]);
        } else {
          if (listStatus === "WAITING") {
            this.cataLovCode = "SPUC.SINV_MOVE_TYPE";
          }
          this.nodeConfigId = nodeConfigId;
          this.catalogPop = true;
          this.myParams = {
            selectArr,
            nowNode,
            successF
          };
        }
        return;
      }

    },
    // 执行接口及操作
    async batchSetExec(selectArr, nowNode, successF, lovRecord = {}) {
      const {
        nodeConfigIndexAbc,
        actionCode: listStatus
      } = nowNode;
      let rev = {};

      if (listStatus === "WAITING") {
        const {
          rcvTypeCode,
          rcvTrxTypeId
        } = lovRecord;

        rev = {
          rcvTypeCode,
          rcvTrxTypeId
        };
      } else if (listStatus === "FINISHED") {
        const {
          nodeConfigId,
          rcvTrxTypeId
        } = lovRecord;

        rev = {
          nodeConfigId,
          rcvTrxTypeId
        };
      }
      const customizeUnitCode = `SINV.RECEIPT_EXECUTE_${listStatus}.${nodeConfigIndexAbc}`;

      this.$loading.show();
      await getBatchSetExecApi(selectArr, listStatus, {
        ...rev,
        customizeUnitCode
      }).then(async (res) => {
        this.$loading.hide();
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
            description: "",
            class: "notification",
          });
          successF(res);
        }
      });
    },
    //全部执行
    async handleAllExceFun(nowNode, successF) {
      const listStatus = nowNode.actionCode;
      const nodeConfigId = nowNode.nodeConfigId;
      const params = {
        listStatus,
        ...{
          nodeConfigId
        },
        tenantId: this.tenantId,
        lovCode: "SPUC.SINV_MOVE_TYPE"
      };

      this.$loading.show();
      const res = await getExecLovApi(params);

      this.$loading.hide();
      if (res && !res.failed) {
        if (isEmpty(res.content)) {
          this.$notification.open({
            message: this.$T("sinv.receiptExecution.model.receipt.not.transactionType").$D("找不到对应的事务类型"),
            description: "",
            class: "notification",
          });
        } else if (res.totalElements === 1) {
          await this.allSetExec(nowNode, successF, res.content[0]);
        } else {
          if (listStatus === "WAITING") {
            this.cataLovCode = "SPUC.SINV_MOVE_TYPE";
          }
          this.nodeConfigId = nodeConfigId;
          this.catalogAllPop = true;
          this.myParams = {
            nowNode,
            successF
          };
        }
        return;
      }
    },
    // 全选执行接口及操作
    async allSetExec(nowNode, successF, lovRecord = {}) {
      const {
        nodeConfigId,
        rcvTrxTypeId
      } = lovRecord;

      const params = {
        customizeUnitCode: "SINV.RECEIPT_EXECUTE_WAITING.L,SINV.RECEIPT_EXECUTE_WAITING.L_FILTER",
        nodeConfigId: nodeConfigId,
        ...this.queryParams,
        allSource:this.searchVal
      };

      // return;
      this.$loading.show();
      await getBatchSetAllExecApi(rcvTrxTypeId, params).then(async (res) => {
        this.$loading.hide();
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
            description: "",
            class: "notification",
          });
          successF(res);
        }
      });
    },
  }
};