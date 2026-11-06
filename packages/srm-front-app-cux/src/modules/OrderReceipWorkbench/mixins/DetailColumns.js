import { SrmButton, SrmUtil, $T } from "srm-mobile-ui";
import { getLovPara } from "../api/index";
export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getBasicColumns(editor) {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              {item.acceptNum}
              <SrmButton
                slot="right"
                plain
                rect
                style={{ fontWeight: "bold" }}
                type="primary"
              >
                {item.acceptStatusMeaning}
              </SrmButton>
            </SrmListHeader>
          ,
        },
        {
          formRow: 20,
          // seq: 10,
          fieldCode: "title",
        },
        // {
        //   formRow: 25,
        //   // seq: 10,
        //   fieldCode: "acceptNum",
        //   editor: editor === "1",
        // },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "companyId",
          editor: editor === "1",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "supplierId",
          // editor: editor === "1",
          render: (val, item) =>
            <span>{item?.supplierName || item?.supplierCompanyName}</span>
          ,
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "displayPoNum",
          editor: editor === "1",
          render: (val, item) =>
            <SrmLovField
              editor={editor === "1"}
              v-model={item.displayPoNum}
              name="displayPoNum"
              code="SCUX.LDJT_ACCEPT_PO"
              theme="fill"
              display={item.displayPoNum}
              placeholder={this.$T("smbl.common.view.pleaseSelect", [
                $T("scux.acceptBench.model.displayPoNum").$D("订单号"),
              ]).$D("请选择{}")}
              options={{
                queryParams: {
                  tenantId: SrmUtil.getTenantId(),
                  companyId: item.companyId,
                  supplierId: item.supplierId,
                  supplierCompanyId: item.supplierCompanyId,
                  purchaseOrgId: item.purchaseOrgId,
                },
                callback: function ([ lovRecord ]) {
                  // 业务审批人没有值是，带出订单号里面的值
                  if (lovRecord.attributeVarchar4) {
                    getLovPara({
                      employeeNum: lovRecord.attributeVarchar4,
                    }).then((res) => {
                      if (res && !res.failed) {
                        item.approveEmployeeId = res.approveEmployeeId;
                        item.employeeNum = res.approveEmployeeNum;
                        item.name = res.approveEmployeeName;
                      }
                    });
                  } else {
                    item.approveEmployeeId = null;
                  }
                  item.attributeLongtext2 = lovRecord.attributeLongtext2;
                  item.supplierCompanyName = lovRecord.supplierCompanyName;
                  item.supplierCompanyId = lovRecord.supplierCompanyId;
                  item.supplierTenantId = lovRecord.supplierTenantId;
                  item.taxIncludeAmount = lovRecord.taxIncludeAmount;
                  item.companyId = lovRecord.companyId;
                  item.companyName = lovRecord.companyName;
                  item.supplierId = lovRecord.supplierId;
                  item.supplierName = lovRecord.supplierName;
                  item.displayPoNum = lovRecord.displayPoNum;
                  item.poHeaderId = lovRecord.poHeaderId;
                  item.currencyCode = lovRecord.currencyCode;
                  item.organizationName = lovRecord.organizationName;
                  item.purchaseOrgId = lovRecord.purchaseOrgId;
                  item.agentName = lovRecord.agentName;
                  item.agentId = lovRecord.agentId;
                  item.termId = lovRecord.termsId;
                  item.stageNum = null;
                  item.stageDesc = null;
                  item.acceptStageCompleteFlag = null;
                  item.acceptTypeCode = null;
                  item.acceptTypeCodeMeaning = null;
                },
                onClear: (ds) => {
                  ds?.current?.setField("approveEmployeeId", null);
                   ds?.current?.setField("name", null);
                  // ds?.current?.setField("purchaseOrgId", null);
                  // ds?.current?.setField("organizationName", null);
                  ds?.current?.setField("agentName", null);
                  ds?.current?.setField("agentId", null);
                  ds?.current?.setField("poHeaderId", null);
                  ds?.current?.setField("stageNum", null);
                  ds?.current?.setField("stageDesc", null);
                  ds?.current?.setField("acceptStageCompleteFlag", null);
                  ds?.current?.setField("acceptTypeCode", null);
                  ds?.current?.setField("acceptTypeCodeMeaning", null);
                },
              }}
            />
          ,
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "taxIncludeAmount",
          editor: editor === "1",
        },
        {
          formRow: 80,
          seq: 10,
          fieldCode: "termMeaning",
          // editor: true,
        },
        {
          formRow: 90,
          seq: 10,
          fieldCode: "currencyCode",
          fieldType: "TEXT",
          editor: editor === "1",
          render: (val, item) => <span>{item.currencyName}</span>,
        },
        {
          formRow: 100,
          seq: 10,
          fieldCode: "stageNum",
          editor: editor === "1",
          render: (val, item) =>
            <SrmLovField
              editor={editor === "1"}
              v-model={item.stageNum}
              name="stageNum"
              code="SCUX_LDJT_QUERY_PLAN_INFO"
              theme="fill"
              display={item.stageDesc}
              placeholder={this.$T("smbl.common.view.pleaseSelect", [
                $T("scux.acceptBench.model.view.stageIdLov").$D("本次验收阶段"),
              ]).$D("请选择{}")}
              options={{
                queryParams: {
                  tenantId: SrmUtil.getTenantId(),
                  sourceCode: "ORDER",
                  sourceDisplayNum: item.displayPoNum,
                  warehousingStageFlag: 0,
                  inspectionStatus: 0,
                },
                callback: function ([ lovRecord ]) {
                  item.stageNum = lovRecord.stageNum;
                  item.stageDesc = lovRecord.stageDesc;
                  item.stageId = lovRecord.stageId;
                  item.acceptStageAmount = lovRecord.stageAmount;
                  item.stageTotalAmount = lovRecord.attributeDecimal2;
                  item.stagePercent = lovRecord.attributeDecimal1;
                  item.acceptOrderAmount = lovRecord.paymentAmount;
                  item.acceptCriteria = lovRecord.attributeLongtext1;
                  item.acceptCriteriaAttachUuid = lovRecord.attributeVarchar1;
                  item.acceptTypeCode = lovRecord?.acceptTypeCode;
                  item.acceptTypeCodeMeaning = lovRecord?.attributeVarchar3;
                },
              }}
            />
          ,
        },
        {
          formRow: 103,
          seq: 10,
          fieldCode: "purchaseOrgId",
          editor: false,
        },
        {
          formRow: 107,
          seq: 10,
          fieldCode: "agentId",
          editor: false,
        },
        {
          formRow: 110,
          seq: 10,
          fieldCode: "creationName",
          editor: editor === "1",
        },
        {
          formRow: 120,
          seq: 10,
          fieldCode: "unitId",
          editor: editor === "1",
        },
        {
          formRow: 130,
          seq: 10,
          fieldCode: "acceptDate",
          editor: editor === "1",
        },
        {
          formRow: 140,
          seq: 10,
          fieldCode: "acceptTypeCode",
          editor: editor === "1",
        },
        {
          formRow: 150,
          seq: 10,
          fieldCode: "approveEmployeeId",
          editor: editor === "1",
          options: {
            displayField: "name",
            subDisplayField: "approveEmployeeId",
            multiple: true,
          },
        },
      ];
    },
    //验收信息
    getAccColumns(editor) {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "acceptStageCompleteFlag",
          editor: editor === "1",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "acceptStageAmount",
          editor: editor === "1",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "stageTotalAmount",
          editor: editor === "1",
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "stagePercent",
          editor: editor === "1",
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "acceptTotalAmount",
          editor: editor === "1",
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "notAcceptStageAmount",
          editor: editor === "1",
        },
      ];
    },
    //订单验收信息
    getAccOrderColumns(editor) {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "acceptProcess",
          editor: editor === "1",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "acceptOrderAmount",
          editor: editor === "1",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "addAcceptProcess",
          editor: editor === "1",
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "addAcceptAmount",
          editor: editor === "1",
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "notAcceptProcess",
          editor: editor === "1",
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "notAcceptOrderAmount",
          editor: editor === "1",
        },
        {
          formRow: 80,
          seq: 10,
          fieldCode: "acceptCriteria",
          editor: editor === "1",
        },
        {
          formRow: 90,
          seq: 10,
          fieldCode: "remark",
          editor: editor === "1",
        },
      ];
    },
    returnFloat(value) {
      const num = value.toString().split(".");
      if (value === 0) {
        return `${value.toString()}.00`;
      } else if (value) {
        if (num.length === 1) {
          const values = `${value.toString()}.00`;
          return values;
        }
        if (num.length > 1) {
          if (num[1].length < 2) {
            const values = `${value.toString()}0`;
            return values;
          }
          const values = Math.floor(value * 100) / 100;
          return values;
        }
      } else {
        return "-";
      }
    },
    //行信息
    getLineColumns(editor) {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              {item.itemName}
              <SrmButton
                slot="right"
                plain
                rect
                style={{ fontWeight: "bold" }}
                type="primary"
              >
                {item.acceptLineNum}
              </SrmButton>
            </SrmListHeader>
          ,
        },
        {
          formRow: 10,
          seq: 10,
          fieldCode: "itemCode",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "acceptTaxIncludedPrice",
          editor: editor === "1",
          fieldType: "INPUT_NUMBER",
          precision: (val, record) => Number(record.defaultPrecision) || 10,
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "taxIncludedPrice",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "acceptAmount",
          editor: editor === "1",
          fieldType: "INPUT_NUMBER",
          precision: (val, record) => Number(record.financialPrecision) || 10,
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "referenceAmount",
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "remark",
          editor: editor === "1",
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "specifications",
        },
        {
          formRow: 80,
          seq: 10,
          fieldCode: "model",
        },
        {
          formRow: 90,
          seq: 10,
          fieldCode: "brand",
        },
        {
          formRow: 100,
          seq: 10,
          fieldCode: "quantity",
          editor: false,
        },
        {
          formRow: 110,
          seq: 10,
          fieldCode: "uomName",
          editor: false,
        },
        {
          formRow: 120,
          seq: 10,
          fieldCode: "taxIncludedLineAmount",
          editor: false,
        },
        // {
        //   formRow: 130,
        //   seq: 10,
        //   fieldCode: "displayPoNum",
        // },
        // {
        //   formRow: 140,
        //   seq: 10,
        //   fieldCode: "displayLineNum",
        // },
        // {
        //   formRow: 150,
        //   seq: 10,
        //   fieldCode: "projectTaskNum",
        // },
        // {
        //   formRow: 160,
        //   seq: 10,
        //   fieldCode: "projectTaskName",
        // },
        // {
        //   formRow: 170,
        //   seq: 10,
        //   fieldCode: "taskName",
        // },
        // {
        //   formRow: 180,
        //   seq: 10,
        //   fieldCode: "taskCode",
        // },
      ];
    },
    //行信息-明细
    getLineDetailColumns(editor) {
      return [
        {
          formRow: 1,
          fieldCode: "acceptLineNum",
        },
        {
          formRow: 5,
          seq: 10,
          fieldCode: "itemCode",
        },
        {
          formRow: 10,
          seq: 10,
          fieldCode: "itemName",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "acceptTaxIncludedPrice",
          editor: editor === "1",
          fieldType: "INPUT_NUMBER",
          precision: (val, record) => Number(record.defaultPrecision) || 10,
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "taxIncludedPrice",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "acceptAmount",
          editor: editor === "1",
          fieldType: "INPUT_NUMBER",
          precision: (val, record) => Number(record.financialPrecision) || 10,
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "referenceAmount",
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "remark",
          editor: editor === "1",
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "specifications",
        },
        {
          formRow: 80,
          seq: 10,
          fieldCode: "model",
        },
        {
          formRow: 90,
          seq: 10,
          fieldCode: "brand",
        },
        {
          formRow: 100,
          seq: 10,
          fieldCode: "quantity",
          editor: false,
        },
        {
          formRow: 110,
          seq: 10,
          fieldCode: "uomName",
          editor: false,
        },
        {
          formRow: 120,
          seq: 10,
          fieldCode: "taxIncludedLineAmount",
          editor: false,
        },
        {
          formRow: 130,
          seq: 10,
          fieldCode: "displayPoNum",
        },
        {
          formRow: 140,
          seq: 10,
          fieldCode: "displayLineNum",
        },
        {
          formRow: 150,
          seq: 10,
          fieldCode: "projectTaskNum",
        },
        {
          formRow: 160,
          seq: 10,
          fieldCode: "projectTaskName",
        },
        {
          formRow: 170,
          seq: 10,
          fieldCode: "taskName",
        },
        {
          formRow: 180,
          seq: 10,
          fieldCode: "taskCode",
        },
      ];
    },
    //分数
    getScoreColumns(editor) {
      return [
        {
          formRow: 10,
          seq: 10,
          fieldCode: "content",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "score",
          editor: editor === "1",
          inputChange: (val, item, field, record) =>
            this.onTotalScoreChange(val, item, field, record),
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "opinion",
          editor: editor === "1",
        },
      ];
    },
    // 取消
    getCancelColumns() {
      return [
        {
          formRow: 1,
          seq: 10,
          fieldCode: "cancelRemark",
        },
      ];
    },
    //附件信息
    getAttchColumns(editor) {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "acceptCriteriaAttachUuid",
          render: (val, item) =>
            <SrmFlex
              class="attachment"
              justify="between"
              nativeOnClick={() => {
                this.$attachment({
                  onFileUpload: () => this.getSaveAttachmentUuid(item),
                  attachments: [
                    {
                      attachmentUuid: item.acceptCriteriaAttachUuid,
                      bucketName: "private-bucket",
                      title: $T(
                        "scux.acceptBench.model.view.acceptCriteriaAttachUuid"
                      ).$D("验收标准附件"),
                      displayType: editor !== 1 ? "list" : "grid",
                      readonly: editor !== 1,
                      showInfo: true,
                      uploadButton: editor === 1 ? "fixed" : "none",
                      showTotal: true,
                    },
                  ],
                });
              }}
            >
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <srm-button type="primary" plain>
                  {$T(
                    "scux.acceptBench.model.view.acceptCriteriaAttachUuid"
                  ).$D("验收标准附件")}
                </srm-button>
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>,
          formRow: 10,
        },
        {
          fieldType: "EMPTY",
          render: () => <srm-blank size="1px" theme="fill" />,
          formRow: 20,
        },
        {
          fieldType: "EMPTY",
          fieldCode: "acceptAttachUuid",
          render: (val, item) =>
            <SrmFlex
              class="attachment"
              justify="between"
              nativeOnClick={() => {
                this.$attachment({
                  // onFileUpload: () => this.getSaveAttachmentUuid(item),
                  attachments: [
                    {
                      attachmentUuid: item.acceptAttachUuid,
                      tenantId: SrmUtil.getTenantId(),
                      bucketName: "private-bucket",
                      title: $T(
                        "scux.acceptBench.model.view.acceptAttachUuid"
                      ).$D("验收附件"),
                      displayType: editor !== "1" ? "list" : "grid",
                      readonly: editor !== "1",
                      showInfo: true,
                      uploadButton: editor !== "1" ? "none" : "fixed",
                      showTotal: true,
                    },
                  ],
                });
              }}
            >
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <srm-button type="primary" plain>
                  {$T("scux.acceptBench.model.view.acceptAttachUuid").$D(
                    "验收附件"
                  )}
                </srm-button>
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>,
          formRow: 30,
        },
      ];
    },
    //验收信息
    getAcceptanceColumns(editor) {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "acceptQuality",
          editor: editor === "1",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "totalScore",
        },
      ];
    },
  },
};
