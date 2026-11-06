<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.quatity.view.title.baseInfo').$D('基础信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else >
          <customize
            :columns="getHeaderColumns()"
            :need-padding="true"
            type="list"
            :data-source="headerInfo"/>
            <!-- <srm-button  size="small" type="primary"
                      @click="openOperateRecord()">
            {{ $T('scux.quatity.view.title.materialMessage').$D('操作记录') }}
          </srm-button> -->
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.quatity.view.title.materialMessage').$D('新物料明细')">
        <srm-list
          :data-set="lineInfoDataSet"
          :columns="lineColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="['REASEARCH_STAGE','QUAL_STAGE','ISSUE','CHECK','REASEARCH'].includes(headerInfo.curNode)"
        :label="$T('scux.quatity.view.title.yanfaMessage').$D('研发部门阶段信息')">
        <!-- <srm-list-header style="padding:15px 0 0 15px" show-open-tag>
        {{ $T('scux.quatity.view.title.yanfaMessage').$D('研发部门阶段信息') }}
      </srm-list-header> -->
        <customize
          :columns="developHeaderColumns()"
          :need-padding="true"
          type="list"
          :data-source="headerInfo"/>
        <div class="divider"/>
        <srm-list
          :data-set="developLineInfoDataSet"
          :columns="developLineColumns"/>
      </srm-scroll-tab-item>
      <!-- <srm-list-header style="padding:15px 0 0 15px" show-open-tag>
        {{ $T('scux.quatity.view.title.qualityMessage').$D('质量部门阶段信息') }}
      </srm-list-header> -->
      <srm-scroll-tab-item
        v-if="['QUAL_STAGE','ISSUE','CHECK','REASEARCH'].includes(headerInfo.curNode)"
        :label="$T('scux.quatity.view.title.qualityMessage').$D('质量部门阶段信息')">
        <customize
          :columns="qualityHeaderColumns()"
          :need-padding="true"
          type="list"
          :data-source="headerInfo"/>
        <div class="divider"/>
        <srm-list
          :data-set="qualityLineInfoDataSet"
          :columns="qualityLineColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="['ISSUE','CHECK','REASEARCH'].includes(headerInfo.curNode)"
        :label="$T('scux.quatity.view.title.confirmIssue').$D('新产品质量确认-发行部门')">
        <customize
          :columns="confirmIssueHeaderColumns()"
          :need-padding="true"
          type="list"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="['CHECK','REASEARCH'].includes(headerInfo.curNode)"
        :label="$T('scux.quatity.view.title.confirmQuality').$D('新产品质量确认-质量部门')">
        <srm-list-header style="padding:15px 0 0 15px" show-open-tag>
          {{ $T('scux.quatity.view.title.confirmQualityMessage').$D(' 质量确认结果总结(附上详细检查资料)') }}
        </srm-list-header>
        <customize
          :columns="confirmQualityHeaderColumns()"
          :need-padding="true"
          type="list"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="['REASEARCH'].includes(headerInfo.curNode)"
        :label="$T('scux.quatity.view.title.confirmDevelop').$D('新产品质量确认-研发部门')">
        <srm-list-header style="overflow: initial;padding:15px 0 0 15px" show-open-tag>
          {{ $T('scux.quatity.view.title.confirmDevelopMessage').$D('根据质量确认结果判定结果和对策内容') }}
        </srm-list-header>
        <div style="font-size:14px;padding:15px 0 0 15px;color:red">  {{ $T('scux.quatity.view.title.confirmDevelopMessage2').$D('* 填亏作为采用本零部件的前提，必要的处置对策和处置部门') }}</div>
        <customize
          :columns="confirmDevelopHeaderColumns()"
          :need-padding="true"
          type="list"
          :data-source="headerInfo"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!--    操作记录 -->
    <history-record
      v-model="visibleOperatePopup"
      :title="$T('smbl.common.message.OperationRecord').$D('操作记录')"
      operator-field-name="processedByName"
      operation-meaning-field-name="processStatusMeaning"
      process-date-field-name="processDate"
      :action-data="operationRecord"
      :loading="operationPopupLoadingFlag"/>
    <!-- 详情弹框    process-remark-field-name="processRemark"
    :remark-label="$T('smbl.common.view.operation.show').$D('操作说明')" -->
    <!-- <srm-popup :visible.sync="visiblePopup"
               :position="'right'"
               :show-header="false"
               :height="'100%'">
      <srm-list-header style="padding:15px 0 0 15px" show-open-tag>
        {{ $T('scux.quatity.view.title.materialMessage').$D('物料信息') }}
      </srm-list-header>
      <customize
        :columns="getSupplierHeaderColumns()"
        :need-padding="true"
        type="list"
        :data-source="clickItem"/>
      <srm-list-header style="padding:15px 0 0 15px" show-open-tag>
        {{ $T('scux.quatity.view.title.supplierMessage').$D('供应商信息') }}
      </srm-list-header>
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="supplierLineInfoDataSet"
        :columns="supplierLineColumns"/>
    </srm-popup> -->
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs, developLineInfoDs, qualityLineInfoDs } from "./dataSource/lineDs";
import { getOperationRecord, getBaseInfoApi } from "./api";
import HistoryRecord from "@/components/HistoryRecord";
export default {
  modules: [ "scux.quatity", "hipspfm.workFlow", "smbl.common" ],
  name: "JianJiQualityApproval",
  components:{ HistoryRecord },
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      lineInfo: {},
      lineInfoDataSet: new DataSet(lineInfoDs()),
      developLineInfoDataSet: new DataSet(developLineInfoDs()),
      qualityLineInfoDataSet: new DataSet(qualityLineInfoDs()),
      visiblePopup:false,
      clickItem:{},
      visibleOperatePopup:false,
      operationRecord:[]
      // lovData:{},
    };
  },
  computed: {
    confirmDevelopHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.quatity.model.researchRemark").$D("判定内容"),
          fieldCode: "researchRemark",
          formRow: 1,
        },
        {
          fieldName: this.$T("scux.quatity.model.researchAttachmentId").$D("判定附件"),
          fieldCode: "researchAttachmentId",
          formRow: 2,
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.researchAttachmentId}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.quatity.model.attachmentId").$D("附件")}
            desc-title={this.$T("scux.quatity.model.check").$D(
              "查看"
            )}
          />,
        },
      ];
    },
    confirmQualityHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.quatity.model.checkRemark").$D("内容填写"),
          fieldCode: "checkRemark",
          formRow: 1,
        },
        {
          fieldName: this.$T("scux.quatity.model.checkAttachmentId").$D("附件"),
          fieldCode: "checkAttachmentId",
          formRow: 2,
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.checkAttachmentId}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.quatity.model.attachmentId").$D("附件")}
            desc-title={this.$T("scux.quatity.model.check").$D(
              "查看"
            )}
          />,
        },
      ];
    },
    confirmIssueHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.quatity.model.issueDiscussLabelMeaning").$D("供应商研讨申请"),
          fieldCode: "issueDiscussLabelMeaning",
        },
        {
          fieldName: this.$T("scux.quatity.model.issueDiscussRemark").$D("供应商研讨申请描述"),
          fieldCode: "issueDiscussRemark",
        },
        {
          fieldName: this.$T("scux.quatity.model.issueAttachmentId").$D("附件"),
          fieldCode: "issueAttachmentId",
          formRow: 11,
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.issueAttachmentId}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.quatity.model.attachmentId").$D("附件")}
            desc-title={this.$T("scux.quatity.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.quatity.model.issueSpecialRemark").$D("特殊事项"),
          fieldCode: "issueSpecialRemark",
        },
      ];
    },
    qualityHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.quatity.model.qualityStageAttachmentId").$D("附件"),
          fieldCode: "qualityStageAttachmentId",
          formRow: 1,
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.qualityStageAttachmentId}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.quatity.model.attachmentId").$D("附件")}
            desc-title={this.$T("scux.quatity.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.quatity.model.qualityStageRemark").$D("要求内容"),
          fieldCode: "qualityStageRemark",
          formRow: 2,
        },
      ];
    },
    qualityLineColumns() {
      return [
        {
          fieldName: this.$T("scux.quatity.model.selectedFlag").$D("选择项目"),
          fieldCode: "selectedFlag",
          fieldType: "SWITCH",
          disabled: true,
          //     trueValue: "1",
          // falseValue: "0",
          // options:{
          //   value:'number'
          // }
        },
        {
          fieldName: this.$T("scux.quatity.model.projectMeaning").$D("项目"),
          fieldCode: "projectMeaning",
          //lookupCode: 'SCUX_JIANJI_IC_LINE_RESEARCH_STAGE_PROJECT',
        },
        {
          fieldName: this.$T("scux.quatity.model.projectContent").$D("内容填写"),
          fieldCode: "projectContent",
        },
      ];
    },
    developHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.quatity.model.researchStageAttachmentId").$D("附件"),
          fieldCode: "researchStageAttachmentId",
          formRow: 11,
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.researchStageAttachmentId}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.quatity.model.attachmentId").$D("附件")}
            desc-title={this.$T("scux.quatity.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.quatity.model.researchStageRemark").$D("要求内容"),
          fieldCode: "researchStageRemark",
        },
      ];
    },
    developLineColumns() {
      return [
        {
          fieldName: this.$T("scux.quatity.model.selectedFlag").$D("选择项目"),
          fieldCode: "selectedFlag",
          fieldType: "SWITCH",
          disabled: true,
          //     trueValue: "1",
          // falseValue: "0",
          // options:{
          //   value:'number'
          // }
        },
        {
          fieldName: this.$T("scux.quatity.model.projectMeaning").$D("项目"),
          fieldCode: "projectMeaning",
          //lookupCode: 'SCUX_JIANJI_IC_LINE_RESEARCH_STAGE_PROJECT',
        },
        {
          fieldName: this.$T("scux.quatity.model.projectContent").$D("内容填写"),
          fieldCode: "projectContent",
        },
      ];
    },
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.quatity.model.icNum").$D("品质认证单号"),
          fieldCode: "icNum",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.quatity.model.createdUser").$D("创建人"),
          fieldCode: "createdUser",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.quatity.model.createdDate").$D("创建时间"),
          fieldCode: "createdDate",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.quatity.model.issueNum").$D("发行号"),
          fieldCode: "issueNum",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.quatity.model.categoryMeaning").$D("类别"),
          fieldCode: "categoryMeaning",
          formRow: 5,
          // fieldType: "SELECT",
          // lovCode: "SCUX_JIANJI_ITEM_CERTIFICATION_CATEGORY",
        },
        {
          fieldName: this.$T("scux.quatity.model.icName").$D("项目名称"),
          fieldCode: "icName",
          formRow: 6,
        },
        {
          fieldName: this.$T("scux.quatity.model.reasonLabelMeaning").$D("新增理由"),
          fieldCode: "reasonLabelMeaning",
          formRow: 7,
          // fieldType: "SELECT",
          // displayField: "meaning",
        //  disabled: true,
        //  editor:false,
          //  lovCode: "SCUX_JIANJI_IETM_CERTIFICATION_REASON_LABEL",
        //  options: {
          // multiple: true,
          // displayField: "meaning",
          // valueField: "value",
          // },
          // transformResponse: (val)=>{
          //   console.log('val',val)
          // },
          // render: (val) => {
          //   console.log('value',val)
          //   if(val){
          //     const value = val.split(',')
          //    const meaning=value.map((v)=>{
          //     return this.lovData['reasonList'].find(item=>item.value===v)?.meaning;
          //    }).toString()
          //    console.log('a', this.lovData['reasonList'],'meaning',meaning)
          //     return <srm-tooltip title={meaning}>{meaning}</srm-tooltip>;
          //   }
          // const object=this.lovData['reasonList'].find(item=>item.value===val)??{};
          // return object['meaning']
          // if (val && val.length > 0) {
          //   const mainCategoryNames = val.map((items) => items.categoryName);
          //   return <span>{ mainCategoryNames.join() }</span>;
          // }
        //  return '-'
          // }
        },
        {
          fieldName: this.$T("scux.quatity.model.reasonRemark").$D("新增理由描述"),
          fieldCode: "reasonRemark",
          formRow: 8,
        },
        {
          fieldName: this.$T("scux.quatity.model.partCategoryLabelMeaning").$D("零部件分类"),
          fieldCode: "partCategoryLabelMeaning",
          formRow: 9,
          //    fieldType: "SELECT",
          // lovCode: "SCUX_JIANJI_ITEM_CERTIFICATION_PART_CATEGORY",
        },
        {
          fieldName: this.$T("scux.quatity.model.partCategoryRemark").$D("零部件分类描述"),
          fieldCode: "partCategoryRemark",
          formRow:10,
        },
        {
          fieldName: this.$T("scux.quatity.model.attachmentId").$D("附件"),
          fieldCode: "attachmentId",
          formRow: 11,
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.attachmentId}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.quatity.model.attachmentId").$D("附件")}
            desc-title={this.$T("scux.quatity.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.quatity.model.operateRecord").$D("操作记录"),
          fieldCode: "operateRecord",
          formRow:12,
          render:() => <SrmButton
            // slot="left"
            plain
            rect
            style={{ fontWeight: "bold" }}
            onClick={() => {
              //  console.log('onOperationPopup')
              this.onOperationPopup();
            }}
          >
            {this.$T("scux.quatity.model.lookOperate").$D("查看")}
          </SrmButton>
        },
      ];
    },
    lineColumns() {
      return [
        // {
        //   fieldName: this.$T("scux.quatity.model.itemCode").$D("物料编码"),
        //   fieldCode: "itemCode",
        //   render: (val) => <srm-list-header show-open-tag={true}>
        //     <span>{ val }</span>
        //   </srm-list-header>
        // },
        {
          fieldName: this.$T("scux.quatity.model.seq").$D("序号"),
          fieldCode: "seq",
        },
        {
          fieldName: this.$T("scux.quatity.model.itemCode").$D("图号"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("scux.quatity.model.itemName").$D("零部件名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("scux.quatity.model.supplierCompanyNumMeaning").$D("供应商"),
          fieldCode: "supplierCompanyNumMeaning",
        },
        // {
        //   fieldName: this.$T("scux.quatity.model.uomCodeMeaning").$D("单位"),
        //   fieldCode: "uomCodeMeaning",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.itemWeight").$D("物料重量"),
        //   fieldCode: "itemWeight",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.guding").$D("固定"),
        //   fieldCode: "guding",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.hjg").$D("后加工"),
        //   fieldCode: "hjg",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.yjg").$D("预加工"),
        //   fieldCode: "yjg",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.gdgyts").$D("固定供应天数"),
        //   fieldCode: "gdgyts",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.zxdhl").$D("最小订货量"),
        //   fieldCode: "zxdhl",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.zddhl").$D("最大订货量"),
        //   fieldCode: "zddhl",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.gddhl").$D("固定订货量"),
        //   fieldCode: "gddhl",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.itemType").$D("物料类型"),
        //   fieldCode: "itemType",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.agentCodeMeaning").$D("采购员"),
        //   fieldCode: "agentCodeMeaning",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.supplier").$D("供应商信息"),
        //   fieldCode: "supplier",
        //   render: (val, item) =>
        //     <srm-list-header show-open-tag={true}>
        //       {/* <span>{val}</span> */}
        //       <SrmButton
        //         // slot="left"
        //         plain
        //         rect
        //         style={{ fontWeight: "bold" }}
        //         onClick={() => {
        //           console.log("item", item);
        //           this.clickItem = item;
        //           this.supplierLineInfoDataSet.addBodyParameter("id", item.id);
        //           this.supplierLineInfoDataSet.addBodyParameter("type", "itemSupplierQuery");
        //           this.supplierLineInfoDataSet.refresh();
        //           this.visiblePopup = true;
        //         }}
        //       >
        //         {this.$T("scux.quatity.model.lookDetail").$D("查看详情")}
        //       </SrmButton>
        //     </srm-list-header>
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.jszk").$D("接收子库"),
        //   fieldCode: "jszk",
        // },
        // {
        //   fieldName: this.$T("scux.quatity.model.kgxx").$D("库管信息"),
        //   fieldCode: "kgxx",
        // },
      ];
    },
  },
  async mounted() {
    let id = this.changeReqId;//??37651
    // console.log("this.changeReqId", this.changeReqId);
    const res = await getBaseInfoApi(id);
    if (res) {
      this.headerInfo = res;
    }
    // const lovCodes = {
    //   categoryList: 'SCUX_JIANJI_ITEM_CERTIFICATION_CATEGORY',
    //   reasonList: 'SCUX_JIANJI_IETM_CERTIFICATION_REASON_LABEL',
    //   itemCategoryList: 'SCUX_JIANJI_ITEM_CERTIFICATION_PART_CATEGORY',
    // };
    // this.lovData = await getLov(lovCodes);
    // console.log('res',res)
    //this.lineInfoDataSet.addPathParameter("id", id);
    this.lineInfoDataSet.addBodyParameter("icHeaderId", id);
    //this.lineInfoDataSet.addBodyParameter("type", "itemLineQuery");
    this.lineInfoDataSet.refresh();
    this.developLineInfoDataSet.addBodyParameter("icHeaderId", id);
    this.developLineInfoDataSet.refresh();
    this.qualityLineInfoDataSet.addBodyParameter("icHeaderId", id);
    this.qualityLineInfoDataSet.refresh();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.quatity.view.title.qualityApproval").$D(
        "品质认证工作台"
      ),
    );
  },
  methods: {
    //打开操作记录
    onOperationPopup() {
      this.visibleOperatePopup = true;
      this.operationPopupLoadingFlag = true;
      getOperationRecord({ icHeaderId:this.changeReqId }).then((res) => {
      // console.log('res',res)
        // if (res.length > 0) {
        //   this.operationRecord = [];
        //   res.forEach((item) => {
        //     item.process = { text:item.processStatusMeaning, type:this.operationColorMap[item.processStatus] || "success" };
        //     this.operationRecord.push(item);
        //   });
        // }
        if (res) {
          this.operationRecord = res;
        }
      });
      this.operationPopupLoadingFlag = false;
    },
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  .divider {
  width: 100%;
  height: 8px;
  background: #f5f6fa;
}
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .contentStyle{
    .titleTag {
      height: 24px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .titleTag::before {
      content: '|';
      background: #36c2cf;
      color: #36c2cf;
      margin-right: 8px;
    }
  }

  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>