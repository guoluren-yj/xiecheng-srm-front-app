<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { camelCase, snakeCase, isObject } from "lodash";
import {
  getInvestigateConfigPreview,
  getInvestigateDetail,
  getInvestgProcessApi,
  investgRejectApi,
  investgApproveApi,
  investgInviteRejectApi,
  getInvestgListApi,
} from "../api";
import validateReference from "../mixins/validateReference";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { commonDs } from "../datasource/detailDS";

export default {
  modules: [ "sslm.investigCorrelat", "smbl.common", "smbl.workFlow", "sslm.common", "sslm.supplierReview", "sslm.supplierDetail", "sslm.investigationApproval", "hipspfm.common" ],
  name: "InvestigationApprovalDetail",
  components: { HistoryRecordTiled },
  mixins: [ validateReference ],
  data() {
    return {
      investgHeaderId:"",
      investigateTemplateId:"",
      investigateDetail: {},
      investigateConfigLoading: false,
      investigateConfig: {},
      investigateConfigRenderMap: {
        sslmInvestgBasic: this.renderBasic, //基本信息
        sslmInvestgBusiness: this.renderBusiness, //业务信息
        sslmInvestgProservice: this.renderProService, //产品及服务
        sslmInvestgSupplierCate: this.renderSupplierCate, //供应商分类
        sslmInvestgFin: this.renderFinances, //近三年财务状况
        sslmInvestgFinBranch: this.renderFinancesBranches, //分支机构
        sslmInvestgAuth: this.renderAuthes, //资质信息
        sslmInvestgContact: this.renderContacts, //联系人信息
        sslmInvestgAddress: this.renderAddresses, //地址信息
        sslmInvestgBankAccount: this.renderBankAccounts, //开户行信息
        sslmInvestgCustomer: this.renderCustomers, //主要客户情况
        sslmInvestgSubSupplier: this.renderSubSuppliers, //分供方情况
        sslmInvestgEquipment: this.renderEquipments, //设备信息
        sslmInvestgRd: this.renderRds, //研发能力
        sslmInvestgProduce: this.renderProduces, //生产能力
        sslmInvestgQa: this.renderQas, //质保能力
        sslmInvestgCustservice: this.renderCustservices, //售后服务
        sslmInvestgAttachment: this.renderAttachments, //附件信息
        sslmInvestgReserve1: this.renderInvestgReserveTable, //预留表格1
        sslmInvestgReserve2: this.renderInvestgReserveTable, //预留表格2
        sslmInvestgReserve5: this.renderInvestgReserveTable, //预留表格3
        sslmInvestgReserve6: this.renderInvestgReserveTable, //预留表格4
        sslmInvestgReserve7: this.renderInvestgReserveTable, //预留表格5
        sslmInvestgReserve8: this.renderInvestgReserveTable, //预留表格6
        sslmInvestgReserve9: this.renderInvestgReserveTable, //预留表格7
        sslmInvestgReserve3: this.renderInvestgReserveForm, //预留表单1
        sslmInvestgReserve4: this.renderInvestgReserveForm, //预留表单2
        sslmInvestgReserve10: this.renderInvestgReserveForm, //预留表单3
        sslmInvestgReserve11: this.renderInvestgReserveForm, //预留表单4
        sslmInvestgReserve12: this.renderInvestgReserveForm, //预留表单5
        sslmInvestgReserve13: this.renderInvestgReserveForm, //预留表单6
        sslmInvestgReserve14: this.renderInvestgReserveForm, //预留表单7
      },
      basicInfo: null,
      componentMap: {
        Input: "INPUT",
        InputNumber: "INPUT_NUMBER",
        ValueList: "SELECT",
        Lov: "LOV",
        Checkbox: "TEXT",
        Switch: "TEXT",
        TextArea: "TEXT",
      },
      basicDS: null,
      businessDS: null,
      proServiceDS: null,
      supplierCateDS: null,
      financesDS: null,
      financesBranchesDS: null,
      authesDS: null,
      contactsDS: null,
      addressesDS: null,
      bankAccountsDS: null,
      customersDS: null,
      subSuppliersDS: null,
      equipmentsDS: null,
      rdsDS: null,
      producesDS: null,
      qasDS: null,
      custservicesDS: null,
      attachmentsDS: null,
      sslmInvestgReserve1DS:null,
      sslmInvestgReserve2DS:null,
      sslmInvestgReserve3DS:null,
      sslmInvestgReserve4DS:null,
      sslmInvestgReserve5DS:null,
      sslmInvestgReserve6DS:null,
      sslmInvestgReserve7DS:null,
      sslmInvestgReserve8DS:null,
      sslmInvestgReserve9DS:null,
      sslmInvestgReserve10DS:null,
      sslmInvestgReserve11DS:null,
      sslmInvestgReserve12DS:null,
      sslmInvestgReserve13DS:null,
      sslmInvestgReserve14DS:null,
      // 操作记录
      operationRecord: [],
      showApprovePopDs: {},
      showApprovePopInfo:{
        rejectRemark:"", //拒绝原因
        isChangeInvestigate:false, //是否变更调查表
        investigateType:"", //调查表类型
        investigateTemplateId:"", //调查表模版
        remark:"", //调查表模版
      }
    };
  },
  mounted() {
    this.investgHeaderId = this.$route.query.investgHeaderId;
    this.investigateTemplateId = this.$route.query.investigateTemplateId;
    this.fetchDetail();
    this.fetchConfig();
  },
  methods: {
    getshowApprovePopColumns() {
      const columns = [
        {
          fieldName:this.$T("sslm.investigCorrelat.view.message.isChangeInvestigate").$D("是否变更调查表"),
          fieldCode: "isChangeInvestigate",
          fieldType: "SWITCH",
          tips: () => this.$T("sslm.investigCorrelat.view.message.changeWarning").$D("变更调查表模版后，原调查表将被取消作废，供应商需要重新填写新调查表内容。"),
        },
        {
          fieldName:this.$T("sslm.common.model.investiagte.type").$D("调查表类型"),
          fieldCode: "investigateType",
          fieldType: "SELECT",
          lovCode: "SSLM.INVESTIGATE_TYPE",
          displayField: "investigateTypeMeaning",
          required: (val, record) => record.isChangeInvestigate,
          visible: (val, record) => record.isChangeInvestigate,
          options: {
            displayField: "meaning",
            subDisplayField: "value",
            valueField: "value",
            callback:(val, valueField, displayField, ds) => {
              const investigateTemplateId = ds.current && ds.current.getField("investigateTemplateId");
              investigateTemplateId.setLovParam({
                investigateType:val[0].value,
                companyId:this.investigateDetail.companyId,
              });
            }
          }
        },
        {
          fieldName:this.$T("sslm.common.model.investigate.template").$D("调查表模板"),
          fieldCode: "investigateTemplateId",
          fieldType: "LOV",
          lovCode: "SSLM.INVESTIGATE_TEMPLATE_ID",
          displayField: "templateName",
          required: (val, record) => record.isChangeInvestigate,
          visible: (val, record) => record.isChangeInvestigate,
          disabled: (val, record) => !record.investigateType,
          options: {
            displayField: "templateName",
            subDisplayField: "templateCode",
            valueField: "investigateTemplateId",
          }
        },
        {
          fieldName:this.$T("sslm.common.model.investigate.remark").$D("调查说明"),
          fieldCode: "remark",
          fieldType: "INPUT",
          visible: (val, record) => record.isChangeInvestigate,
        },
      ];

      return columns;
    },
    showApprovePop(type, title) {
      this.showApprovePopDs = new DataSet(commonDs());
      this.showApprovePopDs.setData([ this.showApprovePopInfo ] || []);
      this.showApprovePopDs.locate(0);
      this.approvePopup = this.$popup({
        title: title,
        headerAlign: "start",
        height: type === "approvalRefused" ? "80%" : "55%",
        rounded:"true",
        showHeader: false,
        showClose: false,
        showBack: false,
        content: <srm-flex class="approve-form" direction="column">
          <srm-flex class="approve-remark-box" direction="column" align="start">
            <srm-flex>
              <h5>
                { title }
              </h5>
            </srm-flex>
            <srm-textarea-field
              v-model={this.showApprovePopInfo.rejectRemark}
              placeholder={this.$T("smbl.common.view.pleaseInput", [ this.$T("sslm.investigationApproval.view.message.refuseModalTitle").$D("拒绝原因") ]).$D("请输入{}")}
              height={120}
              maxLength={1000}
              required
              clearButton={false}
              showLength={true}
              editButton={false}
              showResizer={false}/>
            <srm-flex style="margin-bottom: 60px;">
              { type === "approvalRefused" && <srm-form customize-type="detail" style="width: 100%; padding: 0 5px" columns={this.getshowApprovePopColumns()} data-set={this.showApprovePopDs}/>}
            </srm-flex>
          </srm-flex>
          <srm-bottom-handler style="position: absolute;" btn-arr={this.getApproveBtnArr(type)} />
        </srm-flex>
      });
    },
    // 按钮
    getBtnArr() {
      const btnArr = [
        {
          title: this.$T("sslm.investigCorrelat.view.button.investigateApprovalRefuse").$D("调查表审批拒绝"),
          handler: () => this.handlerOperation("approvalRefused"),
          fill: false,
          bordered: true,
          type: "danger"
        },
        {
          title: this.$T("smbl.common.button.title.agree").$D("同意"),
          handler: () => this.handlerOperation("agree"),
          fill: true
        },
      ];
      if (this.investigateDetail.triggerByCode === "INVITE") {
        btnArr.push({
          title: this.$T("sslm.investigCorrelat.view.button.inviteRefuse").$D("邀约拒绝"),
          handler: () => this.handlerOperation("inviteRefused"),
          type: "info",
          fill: true
        });
      }
      return btnArr;
    },
    // 弹窗按钮
    getApproveBtnArr(type) {
      const approveBtnArr = [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          handler: () => this.handlerApproveOperation("cancel"),
          type: "info",
          fill: false
        }
      ];
      if (type === "approvalRefused") {
        approveBtnArr.push({
          title: this.$T("sslm.investigCorrelat.view.button.investigateApprovalRefuse").$D("调查表审批拒绝"),
          handler: () => this.handlerApproveOperation("approvalRefused"),
          fill: true,
          bordered: true,
          type: "danger"
        });
      } else if (type === "inviteRefused") {
        approveBtnArr.push({
          title: this.$T("sslm.investigCorrelat.view.button.inviteRefuse").$D("邀约拒绝"),
          handler: () => this.handlerApproveOperation("inviteRefused"),
          fill: true,
          bordered: true,
          type: "danger"
        });
      }
      return approveBtnArr;
    },
    // 详情页底部按钮操作
    handlerOperation(type) {
      // 调查表审批拒绝
      if (type === "approvalRefused") {
        const title = this.$T("sslm.investigCorrelat.view.button.investigateApprovalRefuse").$D("调查表审批拒绝");
        this.showApprovePop(type, title);
      } else if (type === "agree") {
        // 调查表审批同意
        this.$dialog({
          title: this.$T("smbl.common.view.confirmMsg.agree").$D("确认同意？"),
          onOk: () => {
            this.investgApprove();
          }
        });
      } else if (type === "inviteRefused") {
        // 邀约拒绝
        const title = this.$T("sslm.investigCorrelat.view.button.inviteRefuse").$D("邀约拒绝");
        this.showApprovePop(type, title);
      }
    },
    // 按钮弹窗操作
    handlerApproveOperation(type) {
      // 取消
      if (type === "cancel") {
        this.approvePopup.closePopup();
      } else if (type === "approvalRefused") {
        let validateFlag = false;
        if (this.showApprovePopInfo.isChangeInvestigate) {
          validateFlag = this.showApprovePopDs.current.data.investigateType && this.showApprovePopDs.current.data.investigateTemplateId;
        } else {
          validateFlag = true;
        }
        if (!validateFlag) {
          return;
        }
        // 调查表审批拒绝
        this.$dialog({
          title: this.$T("smbl.common.view.confirmMsg.reject").$D("确认拒绝？"),
          // content: this.$T("smbl.common.view.confirmMsg.reject").$D("确认拒绝？"),
          onOk: () => {
            this.investgReject();
          }
        });
      } else if (type === "inviteRefused") {
        // 调查表邀约拒绝
        this.$dialog({
          title: this.$T("smbl.common.view.confirmMsg.reject").$D("确认拒绝？"),
          onOk: () => {
            this.investgInviteReject();
          }
        });
      }

    },
    // 审批同意
    async investgApprove() {
      this.$loading.show();
      const params = this.investigateDetail;
      await investgApproveApi(this.investgHeaderId, params).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
          this.$router.push({ name: "InvestigationApprovalList" });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 审批拒绝
    async investgReject() {
      this.$loading.show();
      const params = this.showApprovePopInfo.isChangeInvestigate ? {
        investgHeaderId: this.investgHeaderId,
        investigateTemplateId: this.showApprovePopInfo.investigateTemplateId,
        investigateType: this.showApprovePopInfo.investigateType,
        rejectRemark: this.showApprovePopInfo.rejectRemark,
        remark: this.showApprovePopInfo.remark,
      } : {
        investgHeaderId: this.investgHeaderId,
        rejectRemark: this.showApprovePopInfo.rejectRemark,
      };
      await investgRejectApi(params).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
          this.$router.push({ name: "InvestigationApprovalList" });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 邀约拒绝
    async investgInviteReject() {
      this.$loading.show();
      const params = {
        investgHeaderId: this.investgHeaderId,
        rejectRemark: this.showApprovePopInfo.rejectRemark,
      };
      await investgInviteRejectApi(params).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
          this.$router.push({ name: "InvestigationApprovalList" });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    async getInvestgProcessInfo() {
      const params = {
        investgHeaderId: this.investgHeaderId,
        organizationId: SrmUtil.getTenantId(),
        page: 0,
        size: 10,
      };
      await getInvestgProcessApi(params).then((res) => {
        this.operationRecord = res.content || [];
      });
    },
    getInvestigateDetailColumns() {
      return [ {
        formRow: 1,
        fieldCode: "companyName",
        fieldName: this.$T("sslm.common.view.company.companyName").$D("公司名称"),
      }, {
        formRow: 2,
        fieldCode: "supplierZhOrEnCompanyNum",
        fieldName: this.$T("sslm.common.model.supplierName").$D("供应商名称"),
      }, {
        formRow: 3,
        fieldCode: "investigateTemplateName",
        fieldName: this.$T("sslm.common.model.investigate.template.name").$D("调查表模板名称"),
      }, {
        formRow: 4,
        fieldCode: "createUserRealName",
        fieldName: this.$T("sslm.common.view.creator.name").$D("创建人"),
      }, {
        formRow: 4,
        fieldCode: "unitName",
        fieldName: this.$T("sslm.common.view.creator.unitName").$D("创建人部门"),
      }, {
        formRow: 5,
        fieldCode: "releaseDate",
        fieldName: this.$T("sslm.supplierReview.model.supplierReview.processDate").$D("发布日期"),
      }, {
        formRow: 6,
        fieldCode: "submitDate",
        fieldName: this.$T("sslm.common.view.message.submitDate").$D("提交时间"),
      }, {
        formRow: 8,
        fieldCode: "remark",
        fieldName: this.$T("sslm.common.model.investigate.remark").$D("调查说明"),
      }, {
        formRow: 9,
        fieldCode: "partnerRemark",
        fieldName: this.$T("sslm.common.model.feedback.remark").$D("反馈备注"),
      }, ];
    },
    fetchDetail() {
      this.$loading.show();
      getInvestigateDetail(this.investgHeaderId).then((res) => {
        this.investigateDetail = res || {};
      }).finally(() => {
        this.$loading.hide();
      });
      this.getInvestgProcessInfo();
    },
    fetchConfig() {
      this.investigateConfigLoading = true;
      getInvestigateConfigPreview(this.investigateTemplateId).then((res = {}) => {
        const investigateConfigHeaders = res.investigateConfigHeaders || [];
        // 获取配置
        this.config = this.dealConfigData(res);
        const newInvestigateConfigHeaders = [];
        for (let i = 0; i < investigateConfigHeaders.length; i++) {
          let header = investigateConfigHeaders[i];
          const next = i < investigateConfigHeaders.length - 1 && investigateConfigHeaders[i + 1];
          // 目前仅【产品及服务】【联系人及地址】存在分组
          if (header.configName === "sslmInvestgProservice" && next.configName === "sslmInvestgSupplierCate") {
            header = {
              configDescription: header.configDescription, //产品及服务
              children: [ header, next ]
            };
            i++;
          }
          if (header.configName === "sslmInvestgContact" && next.configName === "sslmInvestgAddress") {
            header = {
              configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgContact").$D("联系人及地址"),
              children: [ header, next ]
            };
            i++;
          }
          // if (header.configName === "sslmInvestgFin" && next.configName === "sslmInvestgFinBranch") {
          //   header = {
          //     configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgFin").$D("财务状况"),
          //     children: [ header, next ]
          //   };
          //   i++;
          // }
          // if (header.configName === "sslmInvestgCustomer" && next.configName === "sslmInvestgSubSupplier") {
          //   header = {
          //     configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgCustomer").$D("合作伙伴"),
          //     children: [ header, next ]
          //   };
          //   i++;
          // }
          // if (header.configName === "sslmInvestgRd" && next.configName === "sslmInvestgProduce") {
          //   header = {
          //     configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgRd").$D("研发和生产"),
          //     children: [ header, next ]
          //   };
          //   i++;
          // }
          // if (header.configName === "sslmInvestgQa" && next.configName === "sslmInvestgCustservice") {
          //   header = {
          //     configDescription: this.$T("sslm.supplierDetail.view.sslmInvestgQa").$D("质保与售后"),
          //     children: [ header, next ]
          //   };
          //   i++;
          // }
          newInvestigateConfigHeaders.push(header);
          res.investigateConfigHeaders = newInvestigateConfigHeaders;
        }
        this.investigateConfig = res;
        // console.log("this.investigateConfig:", this.investigateConfig);
      }).finally(() => {
        this.investigateConfigLoading = false;
      });
    },
    checkUploadUrlType(investgCfLineId, investigateConfigComponents) {
      const investigateConfig = investigateConfigComponents.filter((e) => e.investgCfLineId === investgCfLineId && e.attributeName === "isAttachmentUrl");
      return investigateConfig[0] ? investigateConfig[0].attributeValue : false;
    },
    getCustomColumns(investgCfHeaderId) {
      return this.investigateConfig.investigateConfigLines
        .filter((e) => e.investgCfHeaderId === investgCfHeaderId)
        .map((e) => {
          let isUploadUrlFlag = false;
          // 校验是否开启url上传模式
          if (e.componentType === "Upload") {
            isUploadUrlFlag = this.checkUploadUrlType(e.investgCfLineId, this.investigateConfig.investigateConfigComponents);
          }
          if (isUploadUrlFlag) {
            return {
              fieldCode: camelCase(e.fieldCode),
              fieldName: e.fieldDescription,
              render: (val, item) =>
                <span style="color: var(--color-other-default-b);"
                  on-click={(n) => {
                    n.stopPropagation();
                    // eslint-disable-next-line no-undef
                    let attachmentList = item.attachment;
                    this.$showFileList({
                      fileList: attachmentList.map((attachment) => ({
                        fileUrl: attachment.attachmentUrl,
                        fileName: attachment.attachmentDesc,
                        fileSize: attachment.attachmentSize,
                        creationDate: attachment.creationDate,
                        bucketName: "private-bucket",
                      }))
                    });
                  }}>
                  { this.$T("hipspfm.common.message.title.viewAttachment").$D("附件查看") }
                </span>,
            };
          }
          const fieldCode = camelCase(e.fieldCode);
          return {
            fieldCode,
            fieldType: this.componentMap[e.componentType] || snakeCase(e.componentType).toUpperCase(),
            fieldName: e.fieldDescription,
            editor: false,
            render: [ "Checkbox", "Switch" ].includes(e.componentType) ? (val) => {
              if (Number(val)) {
                return this.$T("smbl.common.view.yes").$D("是");
              }
              return this.$T("smbl.common.view.no").$D("否");
            } : [ "TransferLov" ].includes(e.componentType) ? (_, data) => {
              let meaning = data[`${fieldCode}Meaning`] || "";
              if (isObject(meaning)) {
                meaning = Object.values(meaning).join("、");
              }
              return meaning;
            } : null,
          };

        });
    },
    getDefaultDataSet(queryUrl, columns) {
      const config = {
        autoQuery: true,
        selection: Infinity,
        pageSize: 10,
        editable: false,
        enableQuery: false,
        showTotalCount: false,
        queryParameter: { tenantId: SrmUtil.getTenantId() },
        pathParameter: { tenantId: SrmUtil.getTenantId() },
        fields: columns,
        events: {},
        transport: {
          read: {
            url: queryUrl,
            method: "get",
          },
        },
      };
      return new DataSet(config);
    },
    openDetailPopup(dataSet, columns) {
      this.$popup({
        title: this.$T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={columns}
          dataSet={dataSet}/>,
      });
    },
    renderBasic(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.basicDS && (this.basicDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-basics", columns));
      this.basicDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.basicDS.data, "sslmInvestgBasic");
      return <SrmForm
        dataSet={this.basicDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.basicDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderBusiness(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.businessDS && (this.businessDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-businesses", columns));
      this.businessDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.businessDS.data, "sslmInvestgBusiness");
      return <SrmForm
        dataSet={this.businessDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.businessDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderProService(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.proServiceDS && (this.proServiceDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-proservices/page", columns));
      this.proServiceDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.proServiceDS.data, "sslmInvestgProservice");
      return <SrmList
        scrollable={false}
        dataSet={this.proServiceDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.proServiceDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderSupplierCate(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.supplierCateDS && (this.supplierCateDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investg-supplier-cates", columns));
      this.supplierCateDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.supplierCateDS.data, "sslmInvestgSupplierCate");
      return <SrmList
        scrollable={false}
        dataSet={this.supplierCateDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.supplierCateDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderFinances(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.financesDS && (this.financesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-finances", columns));
      this.financesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.financesDS.data, "sslmInvestgFin");
      return <SrmList
        scrollable={false}
        dataSet={this.financesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.financesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderFinancesBranches(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.financesBranchesDS) {
        this.financesBranchesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-finances-branchs", columns);
        this.financesBranchesDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.mobilephone = `${e.internationalTelMeaning}|${e.mobilephone}`;
          });
        };
      }
      // !this.financesBranchesDS && (this.financesBranchesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-finances-branchs", columns));
      this.financesBranchesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.financesBranchesDS.data, "sslmInvestgFinBranch");
      return <SrmList
        scrollable={false}
        dataSet={this.financesBranchesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.financesBranchesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderAuthes(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.authesDS && (this.authesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-authes", columns));
      this.authesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.authesDS.data, "sslmInvestgAuth");
      return <SrmList
        scrollable={false}
        dataSet={this.authesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.authesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderContacts(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.contactsDS) {
        this.contactsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-contacts", columns);
        this.contactsDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.mobilephone = `${e.internationalTelMeaning}|${e.mobilephone}`;
          });
        };
      }
      this.contactsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.contactsDS.data, "sslmInvestgContact");
      return <SrmList
        scrollable={false}
        dataSet={this.contactsDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.contactsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderAddresses(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.addressesDS) {
        this.addressesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-addresses", columns);
        this.addressesDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.regionId = e.regionPathName;
          });
        };
      }
      this.addressesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.addressesDS.data, "sslmInvestgAddress");
      return <SrmList
        scrollable={false}
        dataSet={this.addressesDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.addressesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderBankAccounts(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.bankAccountsDS && (this.bankAccountsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-bank-accounts", columns));
      this.bankAccountsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.bankAccountsDS.data, "sslmInvestgBankAccount");
      return <SrmList
        scrollable={false}
        dataSet={this.bankAccountsDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.bankAccountsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderCustomers(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.customersDS && (this.customersDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-customers", columns));
      this.customersDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.customersDS.data, "sslmInvestgCustomer");
      return <SrmList
        scrollable={false}
        dataSet={this.customersDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.customersDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderSubSuppliers(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.subSuppliersDS && (this.subSuppliersDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-sub-suppliers", columns));
      this.subSuppliersDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.subSuppliersDS.data, "sslmInvestgSubSupplier");
      return <SrmList
        scrollable={false}
        dataSet={this.subSuppliersDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.subSuppliersDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderEquipments(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.equipmentsDS && (this.equipmentsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-equipments", columns));
      this.equipmentsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.equipmentsDS.data, "sslmInvestgEquipment");
      return <SrmList
        scrollable={false}
        dataSet={this.equipmentsDS}
        onItemClick={() => columns.length > 10 ? this.openDetailPopup(this.equipmentsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderRds(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.rdsDS && (this.rdsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-rds", columns));
      this.rdsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.rdsDS.data, "sslmInvestgRd");
      return <SrmForm
        dataSet={this.rdsDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.rdsDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderProduces(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.producesDS && (this.producesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-produces", columns));
      this.producesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.producesDS.data, "sslmInvestgProduce");
      return <SrmForm
        dataSet={this.producesDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.producesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderQas(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.qasDS && (this.qasDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-qas", columns));
      this.qasDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.qasDS.data, "sslmInvestgQa");
      return <SrmForm
        dataSet={this.qasDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.qasDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderCustservices(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      !this.custservicesDS && (this.custservicesDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-custservices", columns));
      this.custservicesDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.custservicesDS.data, "sslmInvestgCustservice");
      return <SrmForm
        dataSet={this.custservicesDS}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this.custservicesDS, columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderAttachments(config) {
      const { investgCfHeaderId } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this.attachmentsDS) {
        this.attachmentsDS = this.getDefaultDataSet("/sslm/v1/{tenantId}/investigate-attachments", columns);
        this.attachmentsDS.events.afterQuery = (ds, data) => {
          data && data.forEach((e) => {
            e.attachmentType = e.attachmentTypeMeaning;
          });
        };
      }
      this.attachmentsDS.addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this.attachmentsDS.data, "sslmInvestgAttachment");
      return <SrmList
        scrollable={false}
        dataSet={this.attachmentsDS}
        columns={columns}/>;
    },
    renderInvestgReserveTable(config) {
      const { investgCfHeaderId, configName } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this[`${configName}DS`]) {
        this[`${configName}DS`] = this.getDefaultDataSet(getInvestgListApi(configName), columns);
      }
      this[`${configName}DS`].addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this[`${configName}DS`].data, configName);
      return <SrmList
        dataSet={this[`${configName}DS`]}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this[`${configName}DS`], columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
    renderInvestgReserveForm(config) {
      const { investgCfHeaderId, configName } = config;
      const columns = this.getCustomColumns(investgCfHeaderId);
      if (!this[`${configName}DS`]) {
        this[`${configName}DS`] = this.getDefaultDataSet(getInvestgListApi(configName), columns);
      }
      this[`${configName}DS`].addQueryParameter("investgHeaderId", this.investgHeaderId);
      this.validateReferenceRange(this[`${configName}DS`].data, configName);
      return <SrmForm
        dataSet={this[`${configName}DS`]}
        nativeOnClick={() => columns.length > 10 ? this.openDetailPopup(this[`${configName}DS`], columns) : null}
        columns={columns.slice(0, 10)}/>;
    },
  },
  render() {
    return <div style="height: 90vh">
      <SrmScrollTab contentScroll>
        <SrmScrollTabItem label={this.$T("sslm.supplierDetail.view.message.title.questionInfo").$D("调查表信息")}>
          <Customize
            style="padding: 16px 15px; min-height: 200px"
            code="SMBL.INVESTION_APPROVAL.QUESTION_INFO"
            dataSource={this.investigateDetail}
            columns={this.getInvestigateDetailColumns()}/>
        </SrmScrollTabItem>
        {
          this.investigateConfig.investigateConfigHeaders &&
        this.investigateConfig.investigateConfigHeaders
          .filter((e) => this.investigateConfigRenderMap[e.configName] || e.children)
          .map((header, index) => <SrmScrollTabItem
            key={index}
            label={header.configDescription || "-"}>
            {
              header.children ? header.children.map((child, childIndex) => [ <SrmFlex class={ childIndex === 0 ? "sub-title-first" : "sub-title"} align="center">{child.configDescription || "-"}</SrmFlex>,
                [
                  child.remark && <SrmFlex class="reference-remark" align="center" direction="column">{
                    <SrmFlex> { child.remark } </SrmFlex>
                  }</SrmFlex>,
                  this.referenceRangeMessage[child.configName] && this.referenceRangeMessage[child.configName].length > 0 && <SrmFlex class="reference-title" align="center" direction="column">{
                    this.referenceRangeMessage[child.configName].map((e) => <SrmFlex> {e} </SrmFlex>)
                  }</SrmFlex>,
                  this.investigateConfigRenderMap[child.configName](child)
                ] ]) :
                this.investigateConfigRenderMap[header.configName] ?
                  [
                    header.remark && <SrmFlex class="reference-remark" align="center" direction="column">{
                      <SrmFlex> { header.remark } </SrmFlex>
                    }</SrmFlex>,
                    this.referenceRangeMessage[header.configName] && this.referenceRangeMessage[header.configName].length > 0 && <SrmFlex class="reference-title" align="center" direction="column">{
                      this.referenceRangeMessage[header.configName].map((e) => <SrmFlex> {e} </SrmFlex>)
                    }</SrmFlex>,
                    this.investigateConfigRenderMap[header.configName](header)
                  ] : ""
            }
          </SrmScrollTabItem>
          )
        }
        <SrmScrollTabItem label={this.$T("smbl.common.message.OperationRecord").$D("操作记录")}>
          <history-record-tiled
            action-data={this.operationRecord}
            remark-label={this.$T("smbl.common.view.title.operationRemark").$D("操作说明")}
            operator-field-name="processUserName"
            operation-meaning-field-name="processStatusMeaning"/>
        </SrmScrollTabItem>
      </SrmScrollTab>
      <srm-bottom-handler btn-arr={this.getBtnArr()} />
    </div>;
  }
};
</script>

<style scoped lang="stylus">

.sub-title-first {
  height 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  padding-left 15px;
  border-bottom #F6F6F6 solid 1px;
}

.sub-title {
  height 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  padding-left 15px;
  border-bottom #F6F6F6 solid 1px;
  border-top #F6F6F6 solid 8px;
}

.reference-title {
  font-size: 12px;
  color: #E11900;
  line-height: 16px;
  font-weight: 500;
  padding: 10px 20px 10px 15px;
  background: #FFEFED;
}

.reference-remark {
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
  padding: 10px 20px 10px 15px;
  background: #EFF3FE ;
}

.approve-form {
  font-size: 14px;
  padding 20px 0;
}

.approve-remark-box {
  padding 0 15px 0 10px;

  h5 {
    color: #1B1E2B;
    line-height: 20px;
    font-weight: bold;
    margin-left 5px;
  }
}

.fast-approve-remark-box {
  padding 20px 15px;

  h5 {
    color: #1B1E2B;
    line-height: 20px;
    font-weight: bold;
  }

  .fast-approve-remark-edit {
    display flex;
    align-items center;

    .srm-button {
      margin-left 20px;
    }
  }
}

>>> .srm-textarea-counter{
  right: 15px;
}
</style>
