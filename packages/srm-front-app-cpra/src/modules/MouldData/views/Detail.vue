<template>
  <div class="purchase-requisition-assign-detail">
    <srm-scroll-tab :class="showBtn ? 'main-tab detail-container-tab ' : 'main-tab'" customize-code="SMBL.MOULD_DATA.TABS">
    <srm-blank size="1px" theme="fill"/>
       <!-- <change-type-btn :btn-params="changeTypeParam" @onChangeType="handleChangeType" /> -->


      <srm-scroll-tab-item key="baseinfo" :label="$T('siec.mould.model.common.mouldBaseInfo').$D('模具基础信息')" code="baseinfo" v-if="changeTypeParam.activeAllBtn">
        <div @click="showBasicInfoDetail">
          <srm-form v-if="headerDataSet" :data-set="headerDataSet" :columns="getBasicInfoDetailColumns"
                    customize-code="SMBL.MOULD_DATA.BASEINFO" />
        </div>
      </srm-scroll-tab-item>
     <srm-scroll-tab-item key="relateItemInfo" :label="$T('siec.mould.common.relateItemInfo').$D('关联物料信息')" code="relateItemInfo"  v-if="changeTypeParam.activeAllBtn">
        <srm-list v-if="relateItemDataSet" class="scoll-list" :scrollable="false" :columns="getRelateInfoColumns"
        @itemClick="showItemInfoDetail"  :data-set="relateItemDataSet" customize-code="SMBL.MOULD_DATA.RELATEITEMINFO"
                />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="expandLine" :label="$T('siec.mould.common.expandLineInfo').$D('扩展行信息')" code="expandLine"  v-if="changeTypeParam.activeAllBtn">
        <srm-list v-if="expandlineDataSet" class="scoll-list" :scrollable="false" :columns="getExpandLineColumns"
                  :data-set="expandlineDataSet" customize-code="SMBL.MOULD_DATA.EXPANDLINE"
                  />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item key="baseinfoChange" :label="$T('siec.mould.model.common.mouldBaseInfo').$D('模具基础信息')" code="baseinfo"  v-if="!changeTypeParam?.activeAllBtn && changeTabList?.includes('baseinfoChange')">
        <div @click="showBasicInfoDetail">
          <srm-form v-if="changeDataSet" :data-set="changeDataSet" :columns="getBasicInfoDetailColumns"
                    customize-code="SMBL.MOULD_DATA.BASEINFO" />
        </div>
      </srm-scroll-tab-item>
     <srm-scroll-tab-item key="relateItemInfoChange" :label="$T('siec.mould.common.relateItemInfo').$D('关联物料信息')" code="relateItemInfo"   v-if="!changeTypeParam?.activeAllBtn && changeTabList?.includes('relateItemInfoChange')">
        <srm-list v-if="changeRelateItemDataSet" class="scoll-list" :scrollable="false" :columns="getRelateInfoColumns"
        @itemClick="showItemInfoDetail"  :data-set="changeRelateItemDataSet" customize-code="SMBL.MOULD_DATA.RELATEITEMINFO"
                />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="expandLineChange" :label="$T('siec.mould.common.expandLineInfo').$D('扩展行信息')" code="expandLine"  v-if="!changeTypeParam?.activeAllBtn && changeTabList?.includes('expandLineChange')">
        <srm-list v-if="changEexpandlineDataSet" class="scoll-list" :scrollable="false" :columns="getExpandLineColumns"
                  :data-set="changEexpandlineDataSet" customize-code="SMBL.MOULD_DATA.EXPANDLINE"
                  />
      </srm-scroll-tab-item>
     <srm-scroll-tab-item key="attamentInfo" :label="$T('siec.mould.common.attachmentInfo').$D('附件信息')" code="attamentInfo">
        <srm-list :scrollable="false" show-total-count: false height="auto" style="height: auto"
            :data-set="headerDataSet" :show-bottom-bar="false" :columns="getAttachInfoColums"
            customize-code="SMBL.MOULD_DATA.ATTACHMENT" />
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

    <srm-bottom-handler :class="showBtn ? '' : 'hidden-bottom-btn'" v-show="showBtn" :btn-arr="getButtons" type="bottom-button" :fill="false" />

  </div>
</template>

<script>
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import ChangeTypeBtn from "./ChangeTypeBtn.vue";
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import { isArray, isEmpty, differenceBy } from "lodash";
import { formDS } from "../datasource/FormDS";
import { tableDS } from "../datasource/LineDS"
import { approveMould, rejecteMould, getMouldDetailData, getHistoryData, getMouldChangeData} from "../api";

export default {
  modules: [ "hzero.common", "siec.mould", "smbl.common", "sprm.common", "sslm.common"],
  name: "MouldDataDetail",
  components: { HistoryRecordTiled, ChangeTypeBtn },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      headerData: {},
      headerDataSet: new DataSet(formDS()), // 基本信息
      relateItemDataSet: new DataSet(tableDS()), // 关联物料信息
      expandlineDataSet: new DataSet(tableDS()), // 扩展行信息
      relateItemDetailDataSet: new DataSet(formDS()), // 关联物料信息详情
      expandlineDetailDataSet: new DataSet(formDS()), // 扩展行信息详情

      changeDataSet: new DataSet(formDS()),// 变更基本信息
      changeRelateItemDataSet: new DataSet(tableDS()), // 变更关联物料信息
      changEexpandlineDataSet: new DataSet(tableDS()), // 变更关联物料信息
      changeTabList: [],// 变更tab展示
      actionRecordList: [],
      mouldId: null,
      statusConfigId: null,
      statusMap: new Map(),
      operationCodes: [],
      showBtn: false,
      changeTypeParam: { // 全部、仅变更按钮
        activeAllBtn: true,
        handleChangeType: this.handleChangeType,
      },

    };
  },
  computed: {
    getButtons() {
        const buttons = [];
        if(this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_REJECTED") && this.headerData.changeApprovalMethod === 'FUNCTIONAL'){
          buttons.push({
            text: $T("hzero.common.button.approvalRefuse").$D("审批拒绝"),
            bordered: true,
            type: "danger",
            visible: this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_REJECTED") && this.headerData.changeApprovalMethod === 'FUNCTIONAL',
            size: "large",
            handler: () => {
                this.$loading.show();
                rejecteMould({
                    ...this.headerData,
                    statusConfigId: this.statusConfigId,
                }).then((res) => {
                if (!res || (res && !res.failed)) {
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
          });
        }

        if(this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_APPROVED") && this.headerData.changeApprovalMethod === 'FUNCTIONAL'){
          buttons.push({
            text: $T("hzero.common.button.approvalAdopt").$D("审批通过"),
            bordered: true,
            fill: true,
            visible: this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_APPROVED") && this.headerData.changeApprovalMethod === 'FUNCTIONAL',
            type: "primary",
            size: "large",
            handler: () => {
                this.$loading.show();
                approveMould({
                    ...this.headerData,
                    statusConfigId: this.statusConfigId,
                }).then((res) => {
                if (!res || (res && !res.failed)) {
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
          });
        }

        return buttons;
        // return [{
        //     text: $T("hzero.common.button.approvalRefuse").$D("审批拒绝"),
        //     bordered: true,
        //     type: "primary",
        //     visible: this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_REJECTED") && this.headerData.changeApprovalMethod === 'FUNCTIONAL',
        //     size: "large",
        //     handler: () => {
        //         rejecteMould({
        //             ...this.headerData,
        //             statusConfigId: this.statusConfigId,
        //         }).then((res) => {
        //         if (res && !res.failed) {
        //             this.$notification.open({
        //                 message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
        //                 class: "notification"
        //             });
        //             this.$loading.hide();
        //             this.refresh();
        //         } else {
        //             this.$loading.hide();
        //         }
        //         });
        //     },
        // },{
        //     text: $T("hzero.common.button.approvalAdopt").$D("审批通过"),
        //     bordered: true,
        //     fill: true,
        //     visible: this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_APPROVED") && this.headerData.changeApprovalMethod === 'FUNCTIONAL',
        //     type: "primary",
        //     size: "large",
        //     handler: () => {
        //         approveMould({
        //             ...this.headerData,
        //             statusConfigId: this.statusConfigId,
        //         }).then((res) => {
        //         if (res && !res.failed) {
        //             this.$notification.open({
        //                 message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
        //                 class: "notification"
        //             });
        //             this.$loading.hide();
        //             this.refresh();
        //         } else {
        //             this.$loading.hide();
        //         }
        //         });
        //     },
        // }];
    },
    getBasicInfoColumns(){
        return [
            {
                fieldCode: "mouldNum",
                fieldName: $T("siec.mould.model.common.mouldNum").$D("模具编码"),
                formRow: 10,
                formCol: 10,
                visible: this.changeTypeParam?.activeAllBtn,
                render: (val) => <srm-list-header show-open-tag={false}>
            <span>{ val || "-" }</span>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
            },
            {
                fieldCode: "mouldName",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.mouldName").$D("模具名称"),
                formRow: 20,
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode, record:item }),
                formCol: 10,
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "creationDate",
                fieldName: $T("siec.mould.model.common.creationDate").$D("创建日期"),
                fieldType: "TEXT",
                formRow: 30,
                formCol: 10,
                visible: this.changeTypeParam?.activeAllBtn,
            },
            {
                fieldCode: "companyName",
                fieldName: $T("siec.mould.model.common.companyId").$D("模具生产商"),
                fieldType: "TEXT",
                formRow: 40,
                formCol: 10,
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "mouldType",
                fieldName: $T("siec.mould.model.common.mouldType").$D("模具类型"),
                fieldType: "SELECT",
                lovCode: "SIEC.MOULD_TYPE",
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                formRow: 40,
                formCol: 20,
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "supplierName",
                fieldName: $T("siec.mould.model.common.supplier").$D("外放供应商"),
                fieldType: "TEXT",
                formRow: 50,
                formCol: 10,
                render: (value,item, field) => this.renderRedNode({ name: 'supplierCompanyName', code: field.fieldCode,record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: 'supplierCompanyName', code: field.fieldCode,record:item }),
                // render: (val, item) => {
                //   return item.supplierCompanyName || val;
                // },
            },
            {
                fieldCode: "createdByName",
                fieldName: $T("siec.mould.model.common.createdByName").$D("创建人"),
                fieldType: "TEXT",
                formRow: 50,
                formCol: 20,
                visible: this.changeTypeParam?.activeAllBtn,
            },
            {
                fieldCode: "sourcePlatform",
                fieldType: "SELECT",
                lovCode: "SIEC.MOULD_SOURCE_PLATFORM",
                fieldName: $T("siec.mould.model.common.sourcePlatform").$D("模具来源"),
                formRow: 60,
                formCol: 10,
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode,record:item }),
            },
            {
                fieldCode: "uomName",
                fieldName: $T("siec.mould.model.common.mouldUomName").$D("模具单位"),
                fieldType: "TEXT",
                formRow: 60,
                formCol: 20,
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode,record:item }),
            },
            {
                fieldCode: "mouldPrincipalName",
                fieldName: $T("siec.mould.model.common.mouldPrincipal").$D("模具负责人"),
                fieldType: "TEXT",
                formRow: 70,
                formCol: 10,
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode,record:item }),
            },
        ]
    },
    getBasicInfoDetailColumns(){
        return [
            {
                fieldCode: "mouldNum",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.mouldNum").$D("模具编码"),
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode,record:item }),
            },
            {
                fieldCode: "mouldName",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.mouldName").$D("模具名称"),
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode,record:item }),
            },
            {
                fieldCode: "creationDate",
                fieldName: $T("siec.mould.model.common.creationDate").$D("创建日期"),
                fieldType: "TEXT",
                visible: this.changeTypeParam?.activeAllBtn,
            },
          {
                fieldCode: "companyName",
                fieldName: $T("siec.mould.model.common.companyId").$D("模具生产商"),
                fieldType: "TEXT",
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode,record:item }),
            },
            {
                fieldCode: "mouldType",
                fieldName: $T("siec.mould.model.common.mouldType").$D("模具类型"),
                fieldType: "SELECT",
                lovCode: "SIEC.MOULD_TYPE",
                editor: false,
                render: (value,item, field) =>this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (val, item,field)=>this.visibleFlag({ name: field.fieldCode,record:item }),
            },
            {
                fieldCode: "supplierName",
                fieldName: $T("siec.mould.model.common.supplier").$D("外放供应商"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: "supplierCompanyName",code: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: "supplierCompanyName",code: field.fieldCode, record:item }),
            },
            {
                fieldCode: "createdByName",
                fieldName: $T("siec.mould.model.common.createdByName").$D("创建人"),
                fieldType: "TEXT",
                visible: this.changeTypeParam?.activeAllBtn,
            },
            {
                fieldCode: "sourcePlatform",
                fieldType: "SELECT",
                lovCode: "SIEC.MOULD_SOURCE_PLATFORM",
                fieldName: $T("siec.mould.model.common.sourcePlatform").$D("模具来源"),
                editor: false,
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name:  field.fieldCode, record:item }),
            },
            {
                fieldCode: "uomName",
                fieldName: $T("siec.mould.model.common.mouldUomName").$D("模具单位"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "mouldQuality",
                fieldName: $T("siec.mould.model.common.mouldQuality").$D("模具数量"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: 'mouldOwner',
                fieldType: 'SELECT',
                lovCode: 'SIEC.MOULD_OWNER',
                fieldName: $T("siec.mould.model.common.mouldOwner").$D("模具归属方"),
                editor: false,    
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "machineTonnage",
                fieldName: $T("siec.mould.model.common.machineTonnage").$D("规格型号"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "modelSpecs",
                fieldName: $T("siec.mould.model.common.modelSpecs").$D("模空数量"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name:  field.fieldCode, record:item }),
            },
            {
                fieldCode: "mouldPrincipalName",
                fieldName: $T("siec.mould.model.common.mouldPrincipal").$D("模具负责人"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name:field.fieldCode, record:item }),
            },
            {
                fieldCode: "cavityQuality",
                fieldName: $T("siec.mould.model.common.cavityQuality").$D("模腔数量"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "mouldLife",
                fieldName: $T("siec.mould.model.common.mouldLife").$D("模具寿命(次数)"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name:field.fieldCode, record:item }),
            },
            {
                fieldCode: "moldingCycle",
                fieldName: $T("siec.mould.model.common.moldingCycle").$D("成型周期"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "mouldValue",
                fieldName: $T("siec.mould.model.common.mouldValue").$D("模具价值(万元)"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "remark",
                fieldName: $T("hzero.common.remark").$D("备注"),
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: "supplierCompanyName",code: field.fieldCode, record:item }),
            },
        ]
    },
    getRelateInfoColumns(){
        return [
            {
                fieldCode: "lineNum",
                formRow: 10,
                formCol: 10,
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "itemCode",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.itemCode").$D("物料编码"),
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "itemName",
                fieldType: "EMPTY",
                render: (val,item) => {
                  const redFlag = item['compareObjList']?.includes('itemName');
                  const tipValue = item['compareObj']?.itemName || '-';
                  const tipContent = `${this
          .$T("siec.mould.model.common.beforeUpdate")
          .$D("变更前")} : ${tipValue}`;
                  const map = {
                        add: {
                            color: "#05944F",
                            backgroundColor: "#E6F2ED",
                          },
                        update:  {
                            color: "#FC8800",
                            backgroundColor: "rgb(252, 136, 0, 0.15)",
                          },
                        
                        delete: {
                            color: "#757575",
                            backgroundColor: "#F0F2F5",
                          },
                      };
                const actionType=map[item.actionType];
                return <srm-list-header show-open-tag={false}>
                {redFlag && <srm-tooltip title={tipContent} placement='top'>
                  <span style={{ color: "red" }}  
                  onClick={(e) => {
                        if (e) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}>
                    {val || "-"}
                </span>
                </srm-tooltip>} 
                {!redFlag&&<span> { val|| "-"}</span>}
                 <srm-tag style={{ ...actionType }}  slot="right" >
                   {item.actionTypeMeaning}
                 </srm-tag>
                </srm-list-header>
                },
            },
            {
                fieldCode: "categoryName",
                fieldType: "TEXT",
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
                fieldName: $T("siec.mould.model.common.categoryName").$D("物料分类"),
            },
            {
                fieldCode: "uomName",
                fieldType: "TEXT",  
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name:field.fieldCode, record:item }),
                fieldName: $T("sprm.common.model.common.uomName").$D("单位"),
            },
        ]
    },
    getRelateInfoDetailColumns(){
        return [
            {
                fieldCode: "lineNum",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.lineNum").$D("行号"),
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "itemCode",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.itemCode").$D("物料编码"),
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "itemName",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.itemName").$D("物料名称"),
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "categoryName",
                fieldType: "TEXT",
                fieldName: $T("siec.mould.model.common.categoryName").$D("物料分类"),
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
            {
                fieldCode: "uomName",
                fieldType: "TEXT",
                fieldName: $T("sprm.common.model.common.uomName").$D("单位"),
                render: (value,item, field) => this.renderRedNode({ name: field.fieldCode, record:item }),
                visible: (value,item, field) => this.visibleFlag({ name: field.fieldCode, record:item }),
            },
        ]
    },
    getExpandLineColumns(){
        return [];
    },
    getExpandLineDetailColumns(){
        return [];
    },
    // 附件-columns
    getAttachInfoColums() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "attachmentUuid",
          fieldName:  this.$T("hzero.common.view.title.attachment").$D("附件"),
          render: (val, _, field) => <SrmFlex class="attachment" justify="between">
            <SrmFlex justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <srm-attachment-button
                  attachments={[ {
                    bucketName: "private-bucket",
                    attachmentUuid: val,
                    title: field.fieldName,
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]}
                  show-total
                  title={field.fieldName}/>
              </SrmFlex>
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
        },
      ];
    }
  },
  beforeMount() {
    this.$emit(
      "InitMountNode", {
        headerButtonRight: <ChangeTypeBtn btnParams={this.changeTypeParam} />,
        bottomTextTip: $T("sslm.common.view.message.changeBtnTips").$D("变更的内容用红色字体标识，可点击切换仅查看变更内容"),
      }
    );
    if(this.parameters){
      console.log(this.parameters)
      // 审批页面过来的，不可显示审批按钮
      this.mouldId = this.parameters.mouldId;
    }else if(!isEmpty(this.$route.params)) {
      const { mouldId, operationCodes = [], statusConfigId, statusMap } = this.$route.params;
        this.mouldId = mouldId;
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
      const mouldData = await getMouldDetailData(this.mouldId);
      const mouldChangeData= await getMouldChangeData(this.mouldId);
      if(mouldData){
       const  compareObjList=[];
       const allMouldItemList=[];
       const allMouldLineExpandList=[]
       if(mouldChangeData && mouldData){
          for (const key in mouldData) {
            if( mouldData[key] !==mouldChangeData[key] && !['mouldItemList','mouldLineExpandList'].includes(key)){
                compareObjList.push(key);
              }
          }
          for (const key in mouldChangeData) {
            if( mouldData[key] !==mouldChangeData[key] && !['mouldItemList','mouldLineExpandList'].includes(key) && 
              !compareObjList.includes(key)){
              compareObjList.push(key);
              }
          }
          const { mouldItemList = [],mouldLineExpandList=[]} = mouldData || {};
          // 新加字段
          const addMouldItemList = differenceBy(mouldItemList, (mouldChangeData?.mouldItemList || []), 'mouldItemId')?.map(e => e?.mouldItemId)
          // 删除字段
          const deleteMouldItemList = differenceBy((mouldChangeData?.mouldItemList || []), mouldItemList, 'mouldItemId')?.map(e => ({ ...e, actionType: 'delete' ,actionTypeMeaning: $T("sslm.common.conent.delete").$D("删除")}));
            // 变更后字段， 变更前字段
            ([...mouldItemList, ...deleteMouldItemList]).forEach((item) => {
              if (item?.actionType) {
                allMouldItemList.push(item);
              } else if (addMouldItemList.includes(item?.mouldItemId)) {
                allMouldItemList.push({ ...item, actionType: 'add' , actionTypeMeaning:$T("sslm.common.conent.create").$D("新增")});
              } else {
                const tableDifferKeys = [];
                const tableDifferValue={};
                const findItem = mouldChangeData?.mouldItemList?.find(i => i?.mouldItemId === item?.mouldItemId) ||{};
                if(findItem?.objectVersionNumber===item?.objectVersionNumber){
                  allMouldItemList?.push(item)
                }else{
                for (const key in findItem) {
                  if (findItem[key] !== item[key]) {
                    tableDifferKeys.push(key);
                    tableDifferValue[key]=findItem[key] ;
                  }
                }
                for (const key in item ) {
                  if (findItem[key] !== item[key] && !tableDifferKeys?.includes(key)) {
                    tableDifferKeys.push(key);
                    tableDifferValue[key]=findItem[key] ;
                  }
                }
                allMouldItemList.push({ ...item, compareObjList:tableDifferKeys,compareObj:tableDifferValue,actionType: 'update',actionTypeMeaning: $T("sslm.common.conent.change").$D("变更"), });
              }
              }
            })

              // 新加字段
          const addMouldLineExpandList = differenceBy(mouldLineExpandList, (mouldChangeData?.mouldLineExpandList || []), 'mouldLineExpandId')?.map(e => e?.mouldLineExpandId)
          // 删除字段
          const deletMouldLineExpandList = differenceBy((mouldChangeData?.mouldLineExpandList || []), mouldLineExpandList, 'mouldLineExpandId')?.map(e => ({ ...e, actionType: 'delete' ,actionTypeMeaning: $T("sslm.common.conent.delete").$D("删除")}));
          
          ([...mouldLineExpandList, ...deletMouldLineExpandList]).forEach((item) => {
              if (item?.actionType) {
                allMouldLineExpandList.push(item);
              } else if (addMouldLineExpandList.includes(item?.mouldLineExpandId)) {
                allMouldLineExpandList.push({ ...item, actionType: 'add' , actionTypeMeaning:$T("sslm.common.conent.create").$D("新增")});
              } else {
                const findItem = mouldChangeData?.mouldLineExpandList?.find(i => i?.mouldLineExpandId === item?.mouldLineExpandId) ||{};
                if(findItem?.objectVersionNumber===item?.objectVersionNumber){
                  allMouldLineExpandList?.push(item)
                }
                allMouldLineExpandList.push({ ...item,actionType: 'update',actionTypeMeaning: $T("sslm.common.conent.change").$D("变更"), });
              }
            })
      }
      console.log(compareObjList)
      if(compareObjList.some(i=>['mouldNum','mouldName','companyName','mouldType','sourcePlatform','uomName','mouldQuantity','modelSpecs','mouldPrincipalName','cavityQuality','mouldLife','moldingCycle','mouldValue','remark','mouldOwner','machineTonnage','supplierName','supplierCompanyName','mouldType',"remark"].includes(i))){
        this.changeTabList?.push('baseinfoChange');
      }

      if(allMouldItemList?.some(i=>i?.actionType)){
        this.changeTabList?.push('relateItemInfoChange');
      }

     if(allMouldLineExpandList?.some(i=>i?.actionType)){
        this.changeTabList?.push('expandLineChange');
      }
    
      console.log(allMouldItemList)
        mouldData['compareObjList']=compareObjList;
        mouldData['compareObj']=mouldChangeData;
        this.headerData = mouldData;
        this.headerDataSet.create({ ...mouldData }, 0);
        this.relateItemDataSet.setData(allMouldItemList || [])
        this.expandlineDataSet.setData([...allMouldLineExpandList] || []);

        this.changeDataSet.create({ ...mouldChangeData , compareObjList}, 0);
        this.changeRelateItemDataSet.setData((allMouldItemList||[])?.filter(i=>i.actionType))
        this.changEexpandlineDataSet.setData((allMouldLineExpandList||[])?.filter(i=>i?.actionType));
      }

      if(this.statusMap.size && this.statusMap.get('CHANGE_APPROVING') && (this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_REJECTED") || this.statusMap.get('CHANGE_APPROVING').includes("CHANGE_APPROVED"))  && this.headerData.changeApprovalMethod === 'FUNCTIONAL'){
        this.showBtn = true;
      }else{
        this.showBtn = false;
      }

      const res = await getHistoryData(this.mouldId);
      const renderType  = (type) =>{
        if(['REJECTED'].includes(type)){
          return 'danger';
        }else if(['APPROVED'].includes(type)){
          return 'success';
        }else if(['NEW', 'NEW_LINE', 'MOUID_NEW_LINE'].includes(type)){
          return 'warn';
        }else{
          return 'primary'
        }
      };
      if(res && isArray(res)){
        const currentItem = [];
        const batchNoArray = Array.from(
            new Set(
            res.map((ele) => {
                if (ele.batchNo) {
                return ele.batchNo;
                } else {
                return ele.creationDate;
                }
            })
            )
        );
        batchNoArray.forEach((item) => {
            currentItem.push(res.filter((ele) => ele.batchNo === item || ele.creationDate === item));
        });
        const classified = currentItem.map((ele, index) => {
            if (
            ele.length === 1 &&
            [
                'NEW',
                'DELETE',
                'EFFECTIVE',
            ].includes(ele[0].processType)
            ) {
            return {
                ...ele[0],
                status: {
                    type: renderType(ele[0].processType),
                    text: ele[0].processTypeMeaning?.replace('了',''),
                }
            };
            // 'UPDATE', 'UPDATE_LINE' 'CHANGE'
            // 会展示多行 更新、更新行、变更行 删除行 新增行
            } else {
            return {
                status: {
                    type: renderType(ele[0].processType),
                    text: ele[0].processTypeMeaning?.replace('了',''),
                },
                processType: ele[0].processType,
                creationDate: ele[0].creationDate,
                processUserName: ele[0].processUserName,
                lineNum: ele[0].lineNum,
                processRemark: (ele || []).map((data)=>{
                    if(['APPROVED', 'REJECTED'].includes(data.processType)){
                        return `审批意见 【${data.processRemark || ''}】`
                    }else if (['NEW_LINE', 'DELETE_LINE', 'DELETE_EXPAND_LINE', 'NEW_EXPAND_LINE'].includes(data.processType)){
                        return `行号：${data.lineNum} 物料：${data.processRemark}`
                    }else if(['CHANGE', 'REQ_CHANGE', 'UPDATE_EXPAND_LINE', 'MOUID_NEW_LINE', 'MOUID_DELETE_LINE'].includes(data.processType)){
                        if(data.processRemark && (data.processRemark.includes('删除行') || data.processRemark.includes('新增行'))){
                            return `${data.processUserName} ${data.processRemark} ${data.lineNum ? '行号【' + data.lineNum +'】' : ''}`
                        }else{
                            return `${data.processUserName} 将 ${data.processRemark} 由 ${data.oldValue} 改成 ${data.newValue} ${data.lineNum ? '行号【' + data.lineNum +'】' : ''}`
                        }
                    }else if(['MOUID_UPDATE_LINE', 'UPDATE_LINE', 'UPDATE', 'MOUID_UPDATE'].includes(data.processType)){
                            return `${data.processUserName} 将 ${data.processRemark} 由 ${data.oldValue} 改成 ${data.newValue}`
                    }else{
                        return '';
                    }
                }).join("\n")
            };
            }
        });
        this.actionRecordList = classified;
      }

    },

    renderRedNode({ name, record, code }){
      if(record){
        const redFlag = record['compareObjList']?.includes(name) || record['compareObjList']?.includes(code);
        const tipValue = record['compareObj']?.[name] || record['compareObj']?.[name] || '-';
        const tipContent = `${this
          .$T("siec.mould.model.common.beforeUpdate")
          .$D("变更前")} : ${tipValue}`;
        return redFlag ?  <srm-tooltip title={tipContent} placement='top'>
          <span style={{ color: "red" }}  
          onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}>
            {record[code] || record[name] || "-"}
        </span>
        </srm-tooltip> : <span> {record[code] || record[name] || "-"}</span>
      }else{
        return '-'
      }
    },

    visibleFlag({ name, record, code }){
      if (this.changeTypeParam?.activeAllBtn) {
        return true
      } else if (record?.compareObjList?.includes(name) || record?.compareObjList?.includes(code)|| ['add','delete'].includes(record?.actionType)) {
        return true
      } else {
        return false
      }
    },

    async buttonswitchChange(val) {
      this.changeTypeParam.activeAllBtn=val
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
          columns={this.getBasicInfoDetailColumns}
          data-source={this.headerData}
          type="list"
          need-padding={true}
          code="SMBL.MOULD_DATA.BASEINFO_DETAIL" />,
      });
    },
    // 关联物料信息弹框
    showItemInfoDetail(record){
     console.log(record)
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
          code="SMBL.MOULD_DATA.RELATEITEMINFO_DETAIL" />,
      });
    },
    showExpandLineDetail(record){
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
          code="SMBL.MOULD_DATA.EXPANDLINE_DATAIL" />,
      });
    },
    refresh() {
      this.$router.back();
    },
    renderYesNo(val) {
      return val ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");
    },
    
    async handleChangeType(value) {
      if (this.changeTypeParam.activeAllBtn !== value) {
        this.changeTypeParam.activeAllBtn = value;
        this.$loading.show();
        this.$loading.hide();
      }
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

.attachment {
  height 28px;
  font-size 14px;
  color #333333;
  line-height 20px;

  .icon-other {
    font-size 28px;
    color #FEBF43;
    margin-right 8px;
  }

  .icon-chevron-right {
    font-size 16px;
    color val(--color-font-default-b);
  }
  >>> .srm-button-primary {
    color #333 !important;
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