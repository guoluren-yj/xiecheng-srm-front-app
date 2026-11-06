<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <NavHead
      :title="
        $T(
          'small.mallProtocolManagement.model.purchaseAgreement'
        ).$D('采购协议')
      "
      @goBack="goBack"/>
    <SrmList
      :data-set="dataSet"
      :columns="getColumns()"
      :buttons="getButtons()"
      @itemClick="toDetail"/>
  </div>
</template>

<script>
import { JsBridge, DataSet } from "srm-mobile-ui";
import indexDS from "../datasource/terminationIndexDS";
import { adoptApi, rejectApi } from "../api/index";
import { previewFile } from "srm-mobile-ui/src/utils";

export default {
  modules: [ "hipspfm.workFlow","sprm.common","scux.analysisConfirm","scux.commercialTermsPre","scux.purchaseRecordApproval","smpc.common","hipspfm.common","sinv.deliveryApproved","hipspfm.Approved","small.mallProtocolManagement","smbl.common","scux.soQuery","ssta.costSheet","scux.procurementDecisionReview","scux.bidEvaluationReport","spcm.common","scux.myModoList","spcm.contractChange","sodr.common" ],
  name: "PurchasingAgreementApproveList",
  components: {},
  data() {
    return {
      dataSource: indexDS(this),
      dataSet: new DataSet(indexDS(this)),
      chooseParams:[],
      approvedRemark:"审批拒绝"
    };
  },
  mounted() {
  },

  methods: {
    //退出子应用
    goBack() {
      this.$router.back();
    },
    getColumns() {
      return [
        {
          fieldCode: "pcNum",
          fieldType: "EMPTY",
          render: (val) => {
            // {this.$T("sprm.common.model.common.contractName").$D("协议名称")}：
            return <SrmListHeader>
              <span style="font-weight: bold; color: #333333;">{val}</span>
            </SrmListHeader>;
          }
        },
        {
          fieldCode: "pcName",
          fieldType: "EMPTY",
          render: (val, record) => {
            return <srm-flex>
              <span on-click={(e) => {
                e.stopPropagation();
                this.toDetail(record);
              }}
              style="flex-shrink: 0; align-self: flex-start;">{this.$T("sprm.common.model.common.contractName").$D("协议名称")}：</span>
              <span on-click={(e) => {
                e.stopPropagation();
                this.toDetail(record);
              }}
              style="color: #276ef1">{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldCode: "processRemark",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("spcm.contractChange.view.message.terminationReason").$D("终止原因")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "productName",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.analysisConfirm.model.brandName").$D("品名")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldCode: "contractAmount",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters.thousandBitSeparator(val);
          },
        },
        {
          fieldCode: "applicationUserName",
          fieldName: this.$T("scux.analysisConfirm.model.applicationUserName").$D("申请人手机号"),
          render: (val) => {
            const currentVal = val?.split("-");
            return (
              <srm-flex>
                {currentVal && currentVal[1]}
              </srm-flex>
            );
          }
        },
        {
          fieldCode: "currencyDescription",
        },
        {
          fieldCode:"electricalSignatureAttachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={
                    this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                      "相关附件"
                    )
                  }
                  desc-title={
                    this.$T("scux.purchaseRecordApproval.view.button.uploadview").$D("附件查看")
                  }
                />
              </div>
            );
          },
          callBack: () => {

          },
        },
        {
          fieldCode:"contractFileUrl",
          render: (val, item) => <div style="color: var(--color-other-default-b); font-size: 14px;" on-click={(e) => {
            e.stopPropagation();
            this.showContractAttachment(val, item.contractFileUrl);
          }}>
            <span>{ this.$T("scux.purchaseRecordApproval.button.viewAttachments").$D("附件查看") }</span>
            <span>{ val && item.contractFileUrl ? "(1)" : "(0)" }</span>
          </div>
        },
        {
          fieldCode:"purchaserAttachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={
                    this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                      "相关附件"
                    )
                  }
                  desc-title={
                    this.$T("scux.purchaseRecordApproval.view.button.uploadview").$D("附件查看")
                  }
                />
              </div>
            );
          },
          callBack: () => {

          },
        },
        {
          fieldCode: "schemeIdMeaning",
          render: (val, item) => {
            return <span style="color:#276EF1" on-click={(e) => {
              e.stopPropagation();
              this.toSchemeReviewDetail(item);
            }}>{val}</span>;
          }
        },
        {
          fieldCode: "decisionIdMeaning",
          render: (val, item) => {
            return <span style="color:#276EF1" on-click={(e) => {
              e.stopPropagation();
              this.toDecisionDetail(item);
            }}>{val}</span>;
          }
        },
        {
          fieldCode: "evaluationIdMeaning",
          render: (val, item) => {
            return <span style="color:#276EF1" on-click={(e) => {
              e.stopPropagation();
              this.toBidReportDetail(item);
            }}>{val}</span>;
          }
        },
        {
          fieldCode: "frameworkContractNumber",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.myModoList.model.frameworkContractNumber").$D("框架合同")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldCode: "mainPcNum",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("sodr.common.model.common.mainPcNum").$D("主协议编号")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldCode: "remark",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("smpc.common.excel.remark").$D("备注")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
      ];
    },
    //跳转评分详情
    toDetail(data) {
      data["mobileTerminationFlag"] = true;
      this.$router.push({ "name": "PurchasingAgreementApproveDetail", query: {
        taskId: data.currentTaskId,
        processInstanceId: data.processInstanceId,
        info: JSON.stringify(data),
      }, });
    },
    toSchemeReviewDetail(item) {
      this.$router.push({ "name": "HY_ProcurementSchemeDetail", query: { schemeReviewId: item.schemeId } });
    },
    toDecisionDetail(item) {
      this.$router.push({ "name": "HY_ProcurementDecisionDetail", query: { decisionReviewId: item.decisionId } });
    },
    toBidReportDetail(item) {
      this.$router.push({ "name": "HY_ProcurementEvaluationReportDetail", query: { evaluationReviewId: item.evaluationId } });
    },
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.common.button.approvalReject").$D("审批拒绝"),
          type: "danger",
          visible: () => {
            return true;
          },
          disabled: (checkedList) => {
            return checkedList.length === 0;
          },
          callback: (checkedList, data, list) => {
            this.$confirm({
              title: this.$T("sinv.deliveryApproved.model.deliveryApproved.approveRemark").$D("审批意见"),
              onOk: (remark, close) => {
                close();
                this.refuseRemark = remark;
                this.clickReject(checkedList, list);
              }
            });
          },
        },
        {
          text: this.$T("hipspfm.common.button.approved").$D("审批通过"),
          fill: true,
          visible: () => {
            return true;
          },
          disabled: (checkedList) => {
            return checkedList.length === 0;
          },
          callback: (checkedList, data, list) => {
            this.clickAdopt(checkedList, list);
          },
        },
      ];
    },
    //点击通过
    clickAdopt(checkedList, list) {
      const that = this;

      this.$dialog({
        content:
          this.$T("hipspfm.Approved.validation.message.pass").$D(
            "是否确认审批通过"
          ) + "？",
        closable: false,
        onOk() {
          that.adoptList(checkedList, list);
        },
      });
    },
    adoptList(checkedList) {
      this.chooseParams = checkedList.map((item) => {
        let approvedRemark = "审批通过";

        return {
          action: "complete",
          comment: approvedRemark,
          currentTaskId: item.data.currentTaskId,
          processDefinitionId: item.data.processDefinitionId,
          processInstanceId: item.data.processInstanceId,
          processName: item.data.processName,
          variables: [ {
            name: "approveResult",
            value: "Approved",
          }, {
            name: "comment",
            value: approvedRemark
          } ],
        };
      });
      this.$loading.show();
      adoptApi(this.chooseParams)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.common.view.validation.approvelSuccess"
              ).$D("审批通过成功"),
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
            this.dataSet.refresh();
          }
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    //点击拒绝
    clickReject(checkedList, list) {
      this.rejectList(checkedList, list);
    },
    //确认拒绝
    rejectList(checkedList) {
      this.chooseParams = checkedList.map((item) => {
        return {
          action: "complete",
          comment: this.approvedRemark,
          currentTaskId: item.data.currentTaskId,
          processDefinitionId: item.data.processDefinitionId,
          processInstanceId: item.data.processInstanceId,
          processName: item.data.processName,
          variables: [ {
            name: "approveResult",
            value: "Rejected",
          }, {
            name: "comment",
            value: this.approvedRemark
          } ],
        };
      });
      this.$loading.show();
      rejectApi(this.chooseParams)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.common.view.validation.rejectSuccess"
              ).$D("审批拒绝成功"),
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
            this.dataSet.refresh();
          }
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    // 显示用章文本附件
    async showContractAttachment(uuid, fileAdress) {
      if (!uuid || !fileAdress) {
        return;
      }
      const that = this;
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileAdress,
        fileName: uuid,
        downloadUrl:that.buildImgUrl(fileAdress, "private-bucket"),
        showDownbtn:true,
        vm:that
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
>>> .noWrap>div {
  display: flex;
}

>>> .srm-upload {
  width: auto;
}
>>> .srm-list-search-line-cancel {
  display: none !important;
}
</style>
