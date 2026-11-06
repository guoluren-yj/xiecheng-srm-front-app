<template>
    <div class="bench-price-approval-form">
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item class="infoContent" :label="$T('scux.view.title.detail.basicInfo').$D('基础信息')">
          <div class="baseInfo">
            <customize v-if="baseInfoColumns.length" :data-source="benchPriceBaseInfo" :columns="baseInfoColumns"/>
          </div>
          <div style="text-align: right; margin-bottom: 8px;">
            <srm-button
              type="danger"
              @click="handleSave">
              {{ $T("ssrc.maintainBPrice.model.maintainBPrice.aux.saveBtn").$D("保存(修改后必点)") }}
            </srm-button>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item class="infoContent lineInfo" :label="$T('scux.material.view.title.lineInfos').$D('行信息')">
          <div v-if="!benchPriceLineInfo || !benchPriceLineInfo.length" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
          </div>
          <div v-for="(item, index) in benchPriceLineInfo" :key="index" class="card-personalized">
            <div class="line line-border">
              <customize :columns="lineInfoColumns" :data-source="item" />
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </template>
  
<script>
  import { SrmUtil, $T, SrmTextField } from "srm-mobile-ui";
  import { getDetailBase, getDetailLine, toApprovalSave } from "./api/AuxBenchPriceMaintainApproval.js";
  import NumberField from "./NumberField.vue";
  export default {
    modules: [
      "hzero.common",
      "scux.acceptBench",
      "scux.tenderPlanSummary",
      "scux.view",
      "scux.tenderPlanReport",
      "scux.supplierReview",
      "scux.material",
      "hipspfm.common",
      "ssrc.common",
      "ssrc.maintainBPrice",
    ],
    name: "AuxBenchPriceMaintainApproval",
    components: { SrmTextField, NumberField },
    props: {
      changeReqId: {
        type: String | Number,
        default: null,
      },
    },
    data() {
      return {
        planId: this.changeReqId,
        benchPriceBaseInfo: {},
        benchPriceLineInfo: [],
        baseInfoColumns: [],
        lineInfoColumns: [],
        editFlag: 'form',
      };
    },
    mounted() {
      this.$emit("GetApprovalTitle", this.$T("ssrc.maintainBPrice.model.maintainBPrice.approval").$D("基准价审批"));
      this.fetchDetailBaseInfo();
    },
    methods: {
      handleNumberChange(val,benchmarkLineId){
        let sum=0;
        this.benchPriceLineInfo.map(item=>{
          if(item.benchmarkLineId === benchmarkLineId){
            item.confirmAmount = Number(val || 0);
            sum+=Number(val || 0)*(Number(item.rfxQuantity || 0));
          }else {
            sum+=Number(item.confirmAmount || 0)*(Number(item.rfxQuantity || 0));
          }
        })
        this.benchPriceBaseInfo={...this.benchPriceBaseInfo,confirmAmount:sum};
      },
      fetchDetailBaseInfo() {
        this.$loading.show();
        getDetailBase(this.planId).then((res) => {
          if (res && !res.failed) {
            this.benchPriceBaseInfo = res;
          }
        }).finally(() => {
          this.$loading.hide();
          this.fetchDetailLine();
        });
      },
      fetchDetailLine() {
        this.$loading.show();
        getDetailLine(this.planId).then((res) => {
          if (res && !res.failed) {
            this.benchPriceLineInfo = res || [];
            const tableFlag = this.benchPriceLineInfo.some(item => item.benchmarkPrice);
            this.editFlag = tableFlag ? 'table': 'form';
          }
        }).finally(() => {
          this.$loading.hide();
          this.baseInfoColumns = this.getBaseInfoColumns();
          this.lineInfoColumns = this.getLineInfoColumns();
        });
      },
      getBaseInfoColumns() {
        return [
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.summary").$D("摘要说明"),
            fieldCode: "summary",
            formRow: 1,
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.tenderFlag").$D("董权招标"),
            fieldCode: "tenderFlag",
            formRow: 2,
            formCol: 1,
            render: (val) => <span>{[1,'1'].includes(val)  ? "是" : "否"}</span>
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.aux.increase").$D("增降基准"),
            fieldCode: "increase",
            formRow: 2,
            formCol: 2,
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.fluctuationRange").$D("增降幅度%"),
            fieldCode: "fluctuationRange",
            formRow: 3,
            formCol: 1,
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.confirmTotalPrice").$D("确认总额(元)"),
            fieldCode: "confirmAmount",
            formRow: 3,
            formCol: 2,
            fieldType: "INPUT_NUMBER",
            editor: this.editFlag === 'form',
            required: this.editFlag === 'form',
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.startPriceTotals").$D("发起总额(元)"),
            fieldCode: "benchmarkPrice",
            formRow: 4,
            formCol: 1,
            fieldType: "EMPTY",
            render: (val) => <srm-flex>
                <span >发起总额<span style="color:red;">(元)</span>：</span>
                <span>{val}</span>
            </srm-flex>
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.estimatedAmount").$D("预估金额(元)"),
            fieldCode: "estimatedAmount",
            formRow: 4,
            formCol: 2,
            fieldType: "EMPTY",
            render: (val) => <srm-flex>
                <span >预估金额<span style="color:red;">(元)</span>：</span>
                <span>{val}</span>
            </srm-flex>
          },
          {
            // fieldName: 'priceConfirm',
            fieldCode: "priceConfirm",
            formRow: 5,
            fieldType: "EMPTY", // 空组件，可以自定义render，不会保留标签
            render: () => <srm-flex>
              <span style="color:red;">
                {this.$T("ssrc.maintainBPrice.model.maintainBPrice.aux.tipInfo").$D("【基准价确认】总额或单价可在带出的数据（发起金额）基础上修改后必须先保存再提交！")}
              </span>
            </srm-flex>
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.attachmentUuid").$D("附件"),
            fieldCode: "attachmentUuid",
            formRow: 6,
            fieldType: "UPLOAD",
            bucketName: "private-bucket",
            bucketDirectory: 'ssrc-rfx-rfxitem',
            canUpload: true,
          },
        ];
      },
      getLineInfoColumns() {
        return [
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.lineNum").$D("行号"),
            fieldCode: "rfxLineItemNum",
            formRow: 1,
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.itemCode").$D("标的编码"),
            fieldCode: "itemCode",
            formRow: 2,
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.itemName").$D("标的名称"),
            fieldCode: "itemName",
            formRow: 2,
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.benchmarkPrice").$D("基准价发起(元)"),
            fieldCode: "benchmarkPrice",
            formRow: 3,
            fieldType: "EMPTY",
            render: (val) => <srm-flex>
                <span >基准价发起<span style="color:red;">(元)</span>：</span>
                <span>{val}</span>
            </srm-flex>
          },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.confirmBenchmarkPrice").$D("基准价确认(元)"),
            fieldCode: "confirmAmount",
            formRow: 4,
            // fieldType: "INPUT_NUMBER",
            // editor: this.editFlag === 'table',
            required: this.editFlag === 'table',
            render:(val,item) => {
              return <NumberField editFlag={this.editFlag} val={val} item={item} handleNumberChange={this.handleNumberChange} />
            },
          },
          // {
          //   fieldName: '需求数量',
          //   fieldCode: "rfxQuantity",
          //   formRow: 6,
          // },
          {
            fieldName: this.$T("ssrc.maintainBPrice.model.maintainBPrice.approverRemark").$D("发起人备注"),
            fieldCode: "remark",
            formRow: 5,
          },
        ];
      },
      handleSave() {
        let flag = true;
        if (this.editFlag === 'form') {
            flag = ![null, undefined].includes(this.benchPriceBaseInfo.confirmAmount);
        } else if (this.editFlag === 'table') {
            flag = this.benchPriceLineInfo.every(item => ![null, undefined].includes(item.confirmAmount));
        }
        if (!flag) {
          this.$notification.open({ message: "请填写必填项", duration: 1000, });
          return;
        } 
        const dataInfo = {
            benchmark: this.benchPriceBaseInfo,
            benchmarkLineList: this.benchPriceLineInfo,
            organizationId: SrmUtil.getTenantId(),
            rfxHeaderId: this.changeReqId,
        };
        toApprovalSave(dataInfo).then((res) => {
            if (res && res.failed) {
              this.$notification.open({ message: res.message || "保存失败", duration: 1000, });
            } else {
              this.fetchDetailBaseInfo();
              this.$notification.open({ message: "保存成功", duration: 1000, });
            }
        });
      },
      // beforeApprove(approveResult) {
      // return new Promise(async(resolve, reject) => {
      //   // 审批通过
      //   if (approveResult === "Approved") {
      //   let flag = true;
      //   if (this.editFlag === 'form') {
      //       flag = ![null, undefined].includes(this.benchPriceBaseInfo.confirmAmount);
      //   } else if (this.editFlag === 'table') {
      //       flag = this.benchPriceLineInfo.every(item => ![null, undefined].includes(item.confirmAmount));
      //   }
      //   if (!flag) {
      //     reject(false);
      //   } 
      //   const dataInfo = {
      //       benchmark: this.benchPriceBaseInfo,
      //       benchmarkLineList: this.benchPriceLineInfo,
      //       organizationId: SrmUtil.getTenantId(),
      //       rfxHeaderId: this.changeReqId,
      //     };
      //     toApprovalSave(dataInfo).then((res) => {
      //       if (res && res.failed) {
      //         reject(false);
      //       }
      //       resolve(true);
      //     });
      //   } else {
      //     resolve(true);
      //   }
      // });
      // },
    }
  };
  </script>
  
<style lang="stylus" scoped>
  .bench-price-approval-form {
    padding 16px;
    font-size 14px;
    background white;
  }
  
  .title-bold {
    margin-top 15px;
    color #333;
    font-weight 700;
    font-family: PingFangSC-Regular;
  }
  
  .content {
    .infoContent {
      h3 {
        padding: 20px 20px 12px;
        font-size: 18px;
        color: var(--color-font-default);
        line-height: 26.1px;
        font-weight: 700;
        background: var(--color-bg-default-b);
      }
    }
  
    .baseInfo {
      padding 12px 15px;
    }
  
    .lineInfo {
      ul {
        padding-left: 20px;
  
        li:nth-last-child(1) {
          padding-bottom: 11px;
          border-bottom: 1px solid var(--color-border-default);
        }
  
        li {
          display: flex;
          align-items: center;
          padding: 9px 20px 0 0;
          margin-bottom: 2px;
  
          span {
            flex: 1;
            // font-family: PingFangSC-Regular;
            font-size: 14px;
            color: var(--color-font-default, #1b1e2b);
            line-height: 22px;
          }
        }
      }
    }
  }
  .card-personalized {
    width: 100%;
    color: #666666;
    background: var(--color-bg-default);
  
    .card-first-single {
      text-align: left;
      font-size: 14px;
      color: var(--color-font-default);
      font-weight: bold;
      line-height: 22px;
    }
  
    .card-first-between {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
  
      .line-code {
        text-align: left;
        font-size: 16px;
        color: var(--color-font-default, #1b1e2b);
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 235px;
      }
  
      .line-num {
        font-size: 14px;
        color: #C6CAD6;
      }
    }
  }
  .noContent {
    height: 78px;
    padding-left: 20px;
  
    span {
      position: relative;
      top: 16px;
      // font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-font-default-b);
      letter-spacing: 0;
      line-height: 22px;
    }
  }
  .line {
    padding 12px 15px;
    background-color: #F6F6F6;
    margin: 10px 0;
  }
  .line-border {
    border-bottom: 1px dashed black;
  }
  .label-red {
    color: red;
  }
  
  </style>
  