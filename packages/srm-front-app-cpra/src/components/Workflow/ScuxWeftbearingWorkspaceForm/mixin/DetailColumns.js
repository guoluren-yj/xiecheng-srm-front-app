import { $T } from "srm-mobile-ui";
export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getBasicColumns() {
      const formColumns = [
        {
          fieldCode: "serviceFeeSettleNum",
          formRow: 1,
        },
        {
          fieldCode: "associateNum",
          formRow: 2,
        },
        {
          fieldCode: "title",
          formRow: 3,
        },
        {
          fieldCode: "statusMeaning",
          formRow: 4,
        },
        {
          fieldCode: "biddingPlanNum",
          formRow: 5,
        },
        {
          fieldCode: "tendereeMeaning",
          formRow: 6,
        },
        {
          fieldCode: "subjectName",
          formRow: 7,
        },
        {
          fieldCode: "subjectTypeMeaning",
          formRow: 8,
        },
        {
          fieldCode: "projectCompanyIdMeaning",
          formRow: 9,
        },
        // {
        //   fieldCode: "specialSurrenderFlag",
        //   formRow: 6,
        // },
        {
          fieldCode: "illustrate",
          formRow: 10,
        },
        // {
        //   fieldCode: "refundSituation",
        //   formRow: 7,
        // },
        // {
        //   fieldCode: "serviceFeeCollection",
        //   formRow: 7,
        // },
      ];
      return formColumns;
    },
    //结算行信息
    getLineInfoColumns() {
      const lineColumns = [
        {
          fieldCode: "lineNum",
          formRow: 1,
        },
        {
          fieldCode: "bidWinner",
          formRow: 2,
        },
        {
          fieldCode: "pcNum",
          formRow: 3,
        },
        {
          fieldCode: "oneTimeChargeFlagMeaning",
          formRow: 4,
        },
        {
          fieldCode: "pcAmountSum",
          formRow: 5,
        },
        {
          fieldCode: "serviceFeeAmonutSum",
          formRow: 6,
        },
        {
          fieldCode: "isSettledFlagMeaning",
          formRow: 7,
        },
      ];
      return lineColumns;
    },
    //财务信息
    getSstaColumns() {
      const formColumns = [
        {
          fieldCode: "refundSituationMeaning",
          formRow: 1,
        },
        {
          fieldCode: "serviceFeeCollectionMeaning",
          formRow: 2,
        },
      ];
      return formColumns;
    },
    //hetong信息
    getPcInfoColumns() {
      const lineColumns = [
        {
          fieldCode: "lineNum",
          formRow: 1,
        },
        {
          fieldCode: "bidWinner",
          formRow: 2,
        },
        {
          fieldCode: "pcNum",
          formRow: 3,
        },
        {
          fieldCode: "pcAmount",
          formRow: 4,
        },
        {
          fieldCode: "executedAmount",
          formRow: 5,
        },
        {
          fieldCode: "poAmount",
          formRow: 6,
        },
        {
          fieldCode: "invoiceAmount",
          formRow: 7,
        },
        {
          fieldCode: "executedTime",
          formRow: 8,
        },
      ];
      return lineColumns;
    },
    getAttrmentchColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "attachmentUuid",
          render: (val, item) =>
            <SrmFlex
              class="attachment"
              justify="between"
              nativeOnClick={() => {
                this.$attachment({
                  onFileUpload: () => this.getSaveAttachmentUuid(item),
                  attachments: [
                    {
                      attachmentUuid: item.attachmentUuid,
                      bucketName: "public-bucket",
                      title: $T(
                        "small.common.model.common.cuxxiexinattachmentUuid"
                      ).$D("支撑性文件"),
                      displayType: "list", // grid
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none", //fixed
                      showTotal: true,
                    },
                  ],
                });
              }}
            >
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <srm-button type="primary" plain>
                  {$T("small.common.model.common.cuxxiexinattachmentUuid").$D(
                    "支撑性文件"
                  )}
                </srm-button>
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>,
          formRow: 10,
        },
      ];
    },
    getOprationColumns() {
      const lineColumns = [
        {
          fieldCode: "processUserIdMeaning",
          formRow: 1,
        },
        {
          fieldCode: "processDate",
          formRow: 2,
        },
        {
          fieldCode: "processActionMeaning",
          formRow: 3,
        },
      ];
      return lineColumns;
    },
    getApprovalColumns() {
      const lineColumns = [
        {
          fieldCode: "startTime",
          formRow: 1,
        },
        {
          fieldCode: "nodeStatus",
          formRow: 2,
        },
        {
          fieldCode: "name",
          formRow: 3,
        },
        {
          fieldCode: "assigneeName",
          formRow: 4,
        },
        {
          fieldCode: "comment",
          formRow: 5,
        },
      ];
      return lineColumns;
    },
  },
};
