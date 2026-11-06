<template>
  <div class="purchase-requisition-assign-detail">
    <srm-scroll-tab :class="showBtn ? 'main-tab detail-container-tab ' : 'main-tab'" customize-code="SMBL.MOULD_ACCOUNT.TABS">
      <srm-scroll-tab-item key="baseinfo" :label="$T('siec.mould.model.common.mouldBaseInfo').$D('模具基础信息')" code="baseinfo">
        <div @click="showBasicInfoDetail">
          <srm-form v-if="headerDataSet" :data-set="headerDataSet" :columns="getBasicInfoColumns()"
                    customize-code="SMBL.MOULD_ACCOUNT.BASEINFO" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="relateItemInfo" :label="$T('siec.mould.common.relateItemInfo').$D('关联物料信息')" code="relateItemInfo">
        <srm-list v-if="relateItemDataSet" class="scoll-list" :scrollable="false" :columns="getRelateInfoColumns"
                  :data-set="relateItemDataSet" customize-code="SMBL.MOULD_ACCOUNT.RELATEITEMINFO" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="expandLine" :label="$T('siec.mould.common.expandLineInfo').$D('扩展行信息')" code="expandLine">
        <srm-list v-if="expandlineDataSet" class="scoll-list" :scrollable="false" :columns="getExpandLineColumns"
                  :data-set="expandlineDataSet" customize-code="SMBL.MOULD_ACCOUNT.EXPANDLINE"
                  @itemClick="showExpandLineDetail" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="attamentInfo" :label="$T('siec.mould.common.attachmentInfo').$D('附件信息')" code="attamentInfo" class="attachment-container">
        <srm-form :row-col-to-seq="true"
                  :data-set="headerData?.maType === 'MODIFY' ? changeDataSet : headerDataSet"
                  :columns="getAttachInfoColums"
                  class="attachment-form"
                  customize-code="SMBL.MOULD_ACCOUNT.ATTACHMENT" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item key="history" :label="$T('smbl.common.message.OperationRecord').$D('操作记录')"
                           code="history">
        <div class="record-container">
          <history-record-tiled :show-remark="false" :loading="false" :action-data="actionRecordList"
                                operation-meaning-field-name="status" operator-field-name="processUserName"
                                process-date-field-name="creationDate" process-remark-field-name="processRemark"
                                :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
                                process-remark-info-field-name="unknown" />
        </div>
        <!-- <div class="bottom-button-space" /> -->
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <srm-bottom-handler v-show="showBtn" :class="showBtn ? '' : 'hidden-bottom-btn'" :btn-arr="getButtons" type="bottom-button" :fill="false" />

    <!--  审批意见  -->
    <approve-remark-popup v-model="approvePopupFlag" :required-flag="requiredFlag" @onSuccess="approve" />
  </div>
</template>

<script>
import StatusTag from "@/components/StatusTag";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { DataSet, $T } from "srm-mobile-ui";
import ApproveRemarkPopup from "../components/ApproveRemarkPopup.vue";
import { isArray, isEmpty, isNil } from "lodash";
import { formDS } from "../datasource/FormDS";
import { tableDS } from "../datasource/LineDS";
import WorkflowHeadTabs from "../components/WorkflowHeadTabs";
import { approveMould, rejecteMould, getMouldAccountDetailData, getMouldAccountChangData, getHistoryData } from "../api";
import { formatColumns } from "../utils";
export default {
  modules: [ "hzero.common", "siec.mould", "smbl.common", "sprm.common" ],
  name: "MouldAccountDetail",
  components: { HistoryRecordTiled, ApproveRemarkPopup },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      type: "normal",
      headerData: {},
      headerDataSet: new DataSet(formDS()), // 基本信息
      changeData: {},
      changeDataSet: new DataSet(formDS()), // 变更信息
      relateItemDataSet: new DataSet(tableDS()), // 关联物料信息
      expandlineDataSet: new DataSet(tableDS()), // 扩展行信息
      relateItemDetailDataSet: new DataSet(formDS()), // 关联物料信息详情
      expandlineDetailDataSet: new DataSet(formDS()), // 扩展行信息详情
      actionRecordList: [],
      mouldId: null,
      statusConfigId: null,
      statusMap: new Map(),
      operationCodes: [],
      approvePopupFlag: false,
      requiredFlag: false,
      showBtn: false,
      tabsProps: { activeKey: "all" },
    };
  },
  computed: {
    getButtons() {
      const buttons = [];
      if (this.statusMap.size && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH") && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH").includes("REJECT") && this.headerData.approvalMethod === "FUNCTIONAL") {
        buttons.push({
          text: $T("hzero.common.button.approvalRefuse").$D("审批拒绝"),
          bordered: true,
          type: "danger",
          visible: this.statusMap.size && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH") && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH").includes("REJECT") && this.headerData.approvalMethod === "FUNCTIONAL",
          size: "large",
          handler: () => {
            this.requiredFlag = true;
            this.approvePopupFlag = true;
          },
        });
      }
      if (this.statusMap.size && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH") && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH").includes("APPROVED") && this.headerData.approvalMethod === "FUNCTIONAL") {
        buttons.push({
          text: $T("hzero.common.button.approvalAdopt").$D("审批通过"),
          bordered: true,
          fill: true,
          visible: this.statusMap.size && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH") && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH").includes("APPROVED") && this.headerData.approvalMethod === "FUNCTIONAL",
          type: "primary",
          size: "large",
          handler: () => {
            this.requiredFlag = false;
            this.approvePopupFlag = true;
          },
        });
      }
      return buttons;
      // return [{
      //     text: $T("hzero.common.button.approvalRefuse").$D("审批拒绝"),
      //     bordered: true,
      //     type: "primary",
      //     visible: this.statusMap.size && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH') && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH').includes("REJECT") && this.headerData.approvalMethod === 'FUNCTIONAL',
      //     size: "large",
      //     handler: () => {
      //       this.requiredFlag = true;
      //       this.approvePopupFlag = true;
      //     },
      // },{
      //     text: $T("hzero.common.button.approvalAdopt").$D("审批通过"),
      //     bordered: true,
      //     fill: true,
      //     visible: this.statusMap.size && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH') && this.statusMap.get(this.type === 'normal' ? 'APPROVING_RL' : 'APPROVING_CH').includes("APPROVED") && this.headerData.approvalMethod === 'FUNCTIONAL',
      //     type: "primary",
      //     size: "large",
      //     handler: () => {
      //       this.requiredFlag = false;
      //       this.approvePopupFlag = true;
      //     },
      // }];
    },
    getBasicInfoColumns() {
      const allColumns = [
        {
          fieldCode: "maNum",
          fieldName: $T("siec.mould.model.common.maNum").$D("模具台账单号"),
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
          fieldCode: "creationDate",
          fieldName: $T("siec.mould.model.common.creationDate").$D("创建日期"),
          unchangeable: true,
        },
        {
          fieldCode: "companyName",
          fieldName: $T("siec.mould.model.common.company").$D("公司"),
        },
        {
          fieldCode: "mouldType",
          fieldName: $T("siec.mould.model.common.mouldType").$D("模具类型"),
          fieldType: "SELECT",
          lovCode: "SIEC.MOULD_TYPE",
          displayField: "mouldTypeMeaning",
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T("siec.mould.model.common.supplier").$D("外放供应商"),
        },
        {
          fieldCode: "createdByName",
          fieldName: $T("siec.mould.model.common.createdByName").$D("创建人"),
          unchangeable: true,
        },
        {
          fieldCode: "sourcePlatform",
          fieldType: "SELECT",
          lovCode: "SIEC.MOULD_SOURCE_PLATFORM",
          fieldName: $T("siec.mould.model.common.sourcePlatform").$D("模具来源"),
          displayField: "sourcePlatformMeaning",
        },
        {
          fieldCode: "uomName",
          fieldName: $T("siec.mould.model.common.mouldUomName").$D("模具单位"),
        },
        {
          fieldCode: "mouldPrincipalName",
          fieldName: $T("siec.mould.model.common.mouldPrincipal").$D("模具负责人"),
        },
        {
          fieldCode: "modelSpecs",
          fieldName: $T("siec.mould.model.common.modelSpecs").$D("规格型号"),
        },
        {
          fieldCode: "shareQuality",
          fieldName: $T("siec.mould.model.common.shareQuality").$D("分摊模数"),
        },
        {
          fieldCode: "mouldLife",
          fieldName: $T("siec.mould.model.common.mouldLife").$D("模具寿命(次数)"),
        },
        {
          fieldCode: "mouldQuality",
          fieldName: $T("siec.mould.model.common.mouldQuality").$D("模具数量"),
        },
        {
          fieldCode: "mouldValue",
          fieldName: $T("siec.mould.model.common.mouldValue").$D("模具价值(万元)"),
        },
        {
          fieldCode: "moldingCycle",
          fieldName: $T("siec.mould.model.common.moldingCycle").$D("成型周期"),
        },
        {
          fieldCode: "machineTonnage",
          fieldName: $T("siec.mould.model.common.machineTonnage").$D("机台吨位"),
        },
        {
          fieldCode: "cavityQuality",
          fieldName: $T("siec.mould.model.common.cavityQuality").$D("模空数量"),
        },
        {
          fieldCode: "mouldOwner",
          fieldType: "SELECT",
          lovCode: "SIEC.MOULD_OWNER",
          fieldName: $T("siec.mould.model.common.mouldOwner").$D("模具归属方"),
          editor: false,
          displayField: "mouldOwnerMeaning",
        },
        {
          fieldCode: "effectiveTimeFrom",
          fieldName: $T("siec.mould.model.common.effectiveTimeFrom").$D("模具有效时间从"),
        },
        {
          fieldCode: "effectiveTimeTo",
          fieldName: $T("siec.mould.model.common.effectiveTimeTo").$D("模具有效时间至"),
        },
        {
          fieldCode: "usedValue",
          fieldName: $T("siec.mould.model.common.usedValue").$D("模具残值"),
        },
        {
          fieldCode: "remainValue",
          fieldName: $T("siec.mould.model.common.remainValue").$D("模具剩余价值"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "usedQuality",
          fieldName: $T("siec.mould.model.common.usedQuality").$D("模具总使用价值"),
        },
        {
          fieldCode: "remainQuality",
          fieldName: $T("siec.mould.model.common.remainQuality").$D("模具剩余使用价值"),
        },
      ];
      return (detailFlag) => {
        const changedColumns = this.formatChangedColumns(allColumns, this.calcHeadValueChanged);
        const columns = formatColumns(changedColumns, {
          takeFlag: !detailFlag,
          rightTagRender: (_, item) =>
            <StatusTag color="warn" text={item.maStatusMeaning} />
        });
        return columns;
      };
    },
    getRelateInfoColumns() {
      const allColumns = [
        {
          fieldCode: "itemName",
          fieldName: $T("siec.mould.model.common.itemName").$D("物料名称"),
        },
        {
          fieldCode: "lineNum",
          fieldName: $T("siec.mould.model.common.lineNum").$D("行号"),
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("siec.mould.model.common.itemCode").$D("物料编码"),
        },
        {
          fieldCode: "categoryName",
          fieldName: $T("siec.mould.model.common.categoryName").$D("物料分类"),
        },
        {
          fieldCode: "uomName",
          fieldName: $T("sprm.common.model.common.uomName").$D("单位"),
        },
        {
          fieldCode: "quantity",
          fieldName: $T("siec.mould.model.common.quantity").$D("需求数量"),
        },
        {
          fieldCode: "modelSpecs",
          fieldName: $T("siec.mould.model.common.modelSpecs").$D("规格型号"),
        },
      ];
      const changedColumns = this.formatChangedColumns(allColumns, this.calcRelateValueChanged, false);
      const columns = formatColumns(changedColumns, {
        takeFlag: true,
        showTitle: true,
        rightTagRender: (_, item) => {
          const { maLineId, modifyItem } = item;
          if (!maLineId) {
            return <StatusTag color="success" text={this.$T("smbl.common.view.tag.add").$D("新增")} />;
          } else if (modifyItem) {
            return <StatusTag color="warn" text={this.$T("smbl.common.view.tag.change").$D("变更")} />;
          }
        }
      });
      return columns;
    },
    getRelateInfoDetailColumns() {
      return [
        {
          fieldCode: "lineNum",
          fieldType: "TEXT",
          fieldName: $T("siec.mould.model.common.lineNum").$D("行号"),
        },
        {
          fieldCode: "itemCode",
          fieldType: "TEXT",
          fieldName: $T("siec.mould.model.common.itemCode").$D("物料编码"),
          render: (val, item) => {
            if (this.type === "change" && item.modifyItem && val !== item.modifyItem["itemCode"]) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(val) ]).$D("变更前：{value}")} placement="top" ><div onClick={(event) => {
                event.stopPropagation();
              }} style={{ color:"red" }}>{item.modifyItem["itemCode"] || "-"}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldCode: "itemName",
          fieldType: "TEXT",
          fieldName: $T("siec.mould.model.common.itemName").$D("物料名称"),
          render: (val, item) => {
            if (this.type === "change" && item.modifyItem && val !== item.modifyItem["itemName"]) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(val) ]).$D("变更前：{value}")} placement="top" ><div onClick={(event) => {
                event.stopPropagation();
              }} style={{ color:"red" }}>{item.modifyItem["itemName"] || "-"}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldCode: "categoryName",
          fieldType: "TEXT",
          fieldName: $T("siec.mould.model.common.categoryName").$D("物料分类"),
          render: (val, item) => {
            if (this.type === "change" && item.modifyItem && item.categoryId !== item.modifyItem["categoryId"]) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(val) ]).$D("变更前：{value}")} placement="top" ><div onClick={(event) => {
                event.stopPropagation();
              }} style={{ color:"red" }}>{item.modifyItem["categoryName"] || "-"}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldCode: "uomName",
          fieldType: "TEXT",
          fieldName: $T("sprm.common.model.common.uomName").$D("单位"),
          render: (val, item) => {
            if (this.type === "change" && item.modifyItem && item.uomId !== item.modifyItem["uomId"]) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(val) ]).$D("变更前：{value}")} placement="top" ><div onClick={(event) => {
                event.stopPropagation();
              }} style={{ color:"red" }}>{item.modifyItem["uomName"] || "-"}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldCode: "quantity",
          fieldType: "TEXT",
          fieldName: $T("siec.mould.model.common.quantity").$D("需求数量"),
          render: (val, item) => {
            if (this.type === "change" && item.modifyItem && val !== item.modifyItem["quantity"]) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(val) ]).$D("变更前：{value}")} placement="top" ><div onClick={(event) => {
                event.stopPropagation();
              }} style={{ color:"red" }}>{item.modifyItem["quantity"] || "-"}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldCode: "modelSpecs",
          fieldType: "TEXT",
          fieldName: $T("siec.mould.model.common.modelSpecs").$D("规格型号"),
          render: (val, item) => {
            if (this.type === "change" && item.modifyItem && val !== item.modifyItem["modelSpecs"]) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(val) ]).$D("变更前：{value}")} placement="top" ><div onClick={(event) => {
                event.stopPropagation();
              }} style={{ color:"red" }}>{item.modifyItem["modelSpecs"] || "-"}</div></srm-tooltip>;
            }
            return val;
          },
        },
      ];
    },
    getExpandLineColumns() {
      return [];
    },
    getExpandLineDetailColumns() {
      return [];
    },
    // 附件-columns
    getAttachInfoColums() {
      return [
        {
          fieldCode: "attachmentUuid",
          fieldName: this.$T("smbl.common.button.viewAttachment").$D("查看附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 10,
        },
      ];
    }
  },
  beforeMount() {
    if (this.parameters) {
      // 审批页面过来的，不可显示审批按钮
      this.type = this.parameters.type;
      this.maHeaderId = this.parameters.maHeaderId;
      if (this.type === "change") {
        this.$emit(
          "InitMountNode", {
            headerButtonRight:
          <WorkflowHeadTabs
            tabsProps={this.tabsProps}
            onTabsChange={(val) => {
              this.tabsProps.activeKey = val;
            }}
          />,
          }
        );
      }
    } if (!isEmpty(this.$route.params)) {
      const { type, maHeaderId, operationCodes = [], statusConfigId, statusMap } = this.$route.params;
      this.type = type;
      this.maHeaderId = maHeaderId;
      this.operationCodes = operationCodes;
      this.statusConfigId = statusConfigId;
      this.statusMap = statusMap;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {

      const customizeUnitCode = this.type === "normal" ? "SIEC.MOULD_PLATFORM.DETAIL.ATTACHMENTINFO,SIEC.MOULD_PLATFORM.APPROVE.HEADER,SIEC.MOULD_PLATFORM.DETAIL.EXPAND_LINE,SIEC.MOULD_PLATFORM.DETAIL.LIST" : "SIEC.MOULD_PLATFORM.DETAIL.ATTACHMENTINFO,SIEC.MOULD_PLATFORM.APPROVE.HEADER,SIEC.MOULD_PLATFORM.APPROVE.EXPAND_LINE,SIEC.MOULD_PLATFORM.DETAIL.LIST";
      const mouldAccountData = await getMouldAccountDetailData(this.maHeaderId, customizeUnitCode);
      this.headerData = mouldAccountData;
      if (mouldAccountData) {
        const { maLineList, mouldAccountLineExpandList } = mouldAccountData;
        this.headerData = mouldAccountData;
        this.headerDataSet.create({ ...mouldAccountData }, 0);
        if (this.type === "change") {
          const dealData = await getMouldAccountChangData(this.maHeaderId);

          if (dealData) {
            const { maChangeModify, reason, changeType } = dealData;
            const mouldChangeData = changeType === "MODIFY" ? { ...maChangeModify, reason } : dealData;
            const { modifyLineList = [], modifyLineExpandList = [], ...others } = mouldChangeData;
            this.changeData = others;
            this.changeDataSet.create({ ...others }, 0);
            const newMaLineList = maLineList.map((ele) => {
              const updateLine = modifyLineList.find(
                (item) => item.maLineId === ele.maLineId
              );
              return {
                ...ele,
                modifyItem: updateLine,
              };
            });
            const newMouldAccountLineExpandList = mouldAccountLineExpandList.map((ele) => {
              const updateLine = modifyLineExpandList.find(
                (item) => item.mouldAccountLineExpandId === ele.mouldAccountLineExpandId
              );
              return {
                ...ele,
                modifyItem: updateLine,
              };
            });
            this.relateItemDataSet.setData([ ...newMaLineList, ...modifyLineList.filter((e) => !e.maLineId) ] || []);
            this.expandlineDataSet.setData([ ...newMouldAccountLineExpandList, ...modifyLineExpandList.filter((e) => !e.mouldAccountLineExpandId) ] || []);
          }

        } else {
          this.relateItemDataSet.setData(maLineList || []);
          this.expandlineDataSet.setData(mouldAccountLineExpandList || []);
        }
      }

      if (this.statusMap.size && this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH") && (this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH").includes("APPROVED") || this.statusMap.get(this.type === "normal" ? "APPROVING_RL" : "APPROVING_CH").includes("REJECT")) && this.headerData.approvalMethod === "FUNCTIONAL") {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
      const renderType = (type) => {
        if ([ "REJECTED", "REJECT" ].includes(type)) {
          return "danger";
        } else if ([ "APPROVED" ].includes(type)) {
          return "success";
        } else if ([ "NEW", "NEW_LINE", "MOUID_NEW_LINE", "NEW_EXPAND_LINE" ].includes(type)) {
          return "warn";
        }
        return "primary";

      };
      const res = await getHistoryData(this.maHeaderId);
      if (res && isArray(res)) {
        const currentItem = [];
        const batchNoArray = Array.from(
          new Set(
            res.map((ele) => {
              if (ele.actionId && ele.processType !== "MOULD_CHANGE_EFFECT") {
                return ele.actionId;
              }
              return ele.creationDate;

            })
          )
        );
        batchNoArray.forEach((item) => {
          currentItem.push(res.filter((ele) => ele.actionId === item || ele.creationDate === item));
        });
        const classified = currentItem.map((ele) => {
          if (
            ele.length === 1 &&
            [
              "NEW",
              "RELEASE",
              "CONFORM",
              "SEND_BACK",
              "DELETE",
              "CHANGE",
              "MAINTAIN",
              "TRANSFER",
              "SCRAP",
            ].includes(ele[0].processType)
          ) {
            return {
              ...ele[0],
              status: {
                type: renderType(ele[0].processType),
                text: ele[0].processTypeMeaning?.replace("了", ""),
              }
            };
            // 'UPDATE', 'UPDATE_LINE' 'CHANGE'
            // 会展示多行 更新、更新行、变更行 删除行 新增行
          }
          return {
            status: {
              type: renderType(ele[0].processType),
              text: (ele[0].processType === "MOULD_CHANGE_EFFECT" ? $T("siec.mould.currentStatus.changeInfluence").$D("变更【模具主数据】影响了") : ele[0].processTypeMeaning)?.replace("了", ""),
            },
            processType: ele[0].processType,
            creationDate: ele[0].creationDate,
            processUserName: ele[0].processUserName,
            lineNum: ele[0].lineNum,
            processRemark: (ele || []).map((data) => {
              if ([ "APPROVED", "REJECTED" ].includes(data.processType)) {
                return `审批意见 【${data.processRemark || ""}】`;
              } else if ([ "NEW_LINE", "DELETE_LINE", "DELETE_EXPAND_LINE", "NEW_EXPAND_LINE" ].includes(data.processType)) {
                return `行号：${data.version} 物料：${data.processRemark}`;
              } else if ([ "UPDATE_LINE", "UPDATE_EXPAND_LINE", "MOULD_CHANGE_EFFECT" ].includes(data.processType)) {
                if (data.processRemark && (data.processRemark.includes("删除行") || data.processRemark.includes("新增行"))) {
                  return `${data.processUserName} ${data.processRemark} ${data.version ? "行号【" + data.version + "】" : ""}`;
                }
                return `${data.processUserName} 将 ${data.processRemark} 由 ${data.oldValue} 改成 ${data.newValue} ${data.version ? "行号【" + data.version + "】" : ""}`;
              } else if ([ "UPDATE", "MODIFY" ].includes(data.processType)) {
                return `${data.processUserName} 将 ${data.processRemark} 由 ${data.oldValue} 改成 ${data.newValue}`;
              } else if ([ "CHANGE" ].includes(data.processType)) {
                return `异动类型 ${data.processRemark} 异动原因 ${data.reason}`;
              } else if ([ "MAINTAIN", "TRANSFER", "SCRAP", "MODIFY" ].includes(data.processType)) {
                return `异动原因 ${data.reason}`;
              } else if ([ "TRANSFER" ].includes(data.processType)) {
                return `转移供应商 ${data.oldValue} => ${data.newValue}`;
              }
              return "";
            }).join("\n")
          };

        });
        this.actionRecordList = classified;
      }

    },
    // 基础信息弹框
    showBasicInfoDetail() {
      this.$popup({
        title: this.$T("siec.mould.model.common.mouldBaseInfo").$D("模具基础信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getBasicInfoColumns(true)}
          data-source={this.headerData}
          type="list"
          need-padding={true}
          code="SMBL.MOULD_ACCOUNT.BASEINFO_DETAIL" />,
      });
    },
    // 关联物料信息弹框
    showItemInfoDetail(record) {
      this.$popup({
        title: this.$T("siec.mould.common.relateItemInfo").$D("关联物料信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getRelateInfoDetailColumns}
          data-source={record.data}
          type="list"
          need-padding={true}
          code="SMBL.MOULD_ACCOUNT.RELATEITEMINFO_DETAIL" />,
      });
    },
    showExpandLineDetail(record) {
      this.$popup({
        title: this.$T("siec.mould.common.expandLineInfo").$D("扩展行信息"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <customize-detail
          columns={this.getExpandLineDetailColumns}
          data-source={record.data}
          type="list"
          need-padding={true}
          code="SMBL.MOULD_ACCOUNT.EXPANDLINE_DETAIL" />,
      });
    },
    refresh() {
      this.$router.back();
    },
    renderYesNo(val) {
      return val ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");
    },
    approve(approvedRemark) {
      this.$loading.show();
      const request = this.requiredFlag ? rejecteMould : approveMould;
      request({
        approvedRemark,
        body: {
          ...this.headerData,
          statusConfigId: this.statusConfigId,
        },
      }).then((res) => {
        this.approvePopupFlag = false;
        this.requiredFlag = false;
        if (!res || res && !res.failed) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
          this.$loading.hide();
          this.refresh();
        } else {
          this.$loading.hide();
        }
      });
    },
    formatChangedColumns(columns, calcValueChangedFunc, filterChangedFieldsFlag = true) {
      if (this.type === "change") {
        return columns.reduce((acc, cur) => {
          const { fieldCode, displayField, unchangeable, render } = cur;
          const item = { ...cur };
          let concatArr = [];
          if (unchangeable) {
            concatArr = this.tabsProps.activeKey === "changed" ? [] : [ item ];
          } else {
            const {
              text,
              changedText,
              isValueChanged,
            } = calcValueChangedFunc({ item, fieldCode, displayField });
            if (isValueChanged && isNil(render)) {
              item.render = () => this.changedFieldRender({ text, changedText });
            }
            concatArr = this.tabsProps.activeKey === "changed" && !isValueChanged && filterChangedFieldsFlag ? [] : [ item ];
          }
          return acc.concat(concatArr);
        }, []);
      }
      return columns;
    },
    calcHeadValueChanged({ fieldCode, displayField }) {
      return this.calcValueChanged({
        fieldCode,
        displayField,
        item:  this.headerData,
        changedItem: this.changeData
      });
    },
    calcRelateValueChanged({ item, fieldCode, displayField }) {
      const { modifyItem = {} } = item;
      return this.calcValueChanged({
        fieldCode,
        displayField,
        item,
        changedItem: modifyItem,
      });
    },
    calcValueChanged({ item, fieldCode, changedItem, displayField }) {
      const value = item?.[fieldCode];
      const changedValue = changedItem?.[fieldCode];
      const isValueChanged = value !== changedValue && !isNil(changedValue);
      const textCode = displayField || fieldCode;
      return {
        isValueChanged,
        text: item?.[textCode],
        changedText: changedItem?.[textCode]
      };
    },
    changedFieldRender({ text, changedText }) {
      if (!isNil(changedText)) {
        return (
          <SrmTooltip
            placement="top"
            title={this.$T("sprm.common.model.common.beforeChanged", [ isNil(text) ? "-" : text ]).$D("变更前：{value}")}
          >
            <span
              style={{ color:"red" }}
              onClick={(e) => e.stopPropagation()}
            >
              {changedText}
            </span>
          </SrmTooltip>
        );
      }
      return isNil(text) ? "-" : text;
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-container-tab {
  >>> .srm-scroll-content {
    height: calc(100% - 72px);
   }
  }
.bottom-button {
  height: 72px;
  border-top: 1px solid #f0f2f5;
}

// UI校对
.main-tab {
  // 列表的颜色改回
  .scoll-list {
    >>> .srm-scroll {
      background: var(--background-color-empty);
    }
  }
  // 操作记录最小高度
  >>> .srm-history-record-content {
    min-height: 0px;
  }
}

.attachment-container {
  .attachment-form {
    min-height: 58px;
    padding: 0;
  }
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}

.hidden-bottom-btn{
    display: none !important;
}

</style>