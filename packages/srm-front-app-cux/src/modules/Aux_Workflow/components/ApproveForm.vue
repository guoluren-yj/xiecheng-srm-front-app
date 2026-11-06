<template>
  <div class="approve-form-content">
    <div class="approve-option">
      <div
        v-if="showBtn('handler_approval_opinions')"
        class="option"
        @click="choseType('handler_approval_opinions')">
        <div class="opinion-button">
          <div
            class="icon-container opinion"
            :class="approveType === 'handler_approval_opinions' ? 'active' : ''">
            <em class="srm-icon icon-book" />
          </div>
          <div
            class="btn-des-opinion"
            :class="approveType === 'handler_approval_opinions' ? 'active' : ''">
            {{ $T("hipspfm.common.action.approval.opinions").$D("整理意见") }}
          </div>
        </div>
      </div>
      <div
        v-if="showBtn('handler_abandon')"
        class="option"
        @click="choseType('handler_abandon')">
        <div class="abandon-button">
          <div
            class="icon-container abandon"
            :class="approveType === 'handler_abandon' ? 'active' : ''">
            <em class="srm-icon icon-unlink" />
          </div>
          <div
            class="btn-des-abandon"
            :class="approveType === 'handler_abandon' ? 'active' : ''">
            {{ $T("hipspfm.common.action.approval.abandon").$D("中止") }}
          </div>
        </div>
      </div>
      <div
        v-if="showBtn('handler_pass')"
        class="option"
        @click="choseType('handler_pass')">
        <div class="agree-button">
          <div
            class="icon-container agree"
            :class="approveType === 'handler_pass' ? 'active' : ''">
            <em class="srm-icon icon-check" />
          </div>
          <div
            class="btn-des-agree"
            :class="approveType === 'handler_pass' ? 'active' : ''">
            {{ $T("hipspfm.common.action.approved").$D("同意") }}
          </div>
        </div>
      </div>
      <div
        v-if="showBtn('handler_special_pass')"
        class="option"
        @click="choseType('handler_special_pass')">
        <div class="special-agree-button">
          <div
            class="icon-container special-agree"
            :class="approveType === 'handler_special_pass' ? 'active' : ''">
            <em class="srm-icon icon-edit" />
          </div>
          <div
            class="btn-des-special-agree"
            :class="approveType === 'handler_special_pass' ? 'active' : ''">
            {{ $T("hipspfm.common.action.conditionAgree").$D("有条件同意") }}
          </div>
        </div>
      </div>
      <div
        v-if="showBtn('handler_pass_disagree')"
        class="option"
        @click="choseType('handler_pass_disagree')">
        <div class="disagree-button">
          <div
            class="icon-container disagree"
            :class="approveType === 'handler_pass_disagree' ? 'active' : ''">
            <em class="srm-icon icon-square-x" />
          </div>
          <div
            class="btn-des-disagree"
            :class="approveType === 'handler_pass_disagree' ? 'active' : ''">
            {{ $T("hipspfm.common.action.disagree").$D("不同意") }}
          </div>
        </div>
      </div>
      <div
        v-if="showBtn('handler_refuse')"
        class="option"
        @click="choseType('handler_refuse')">
        <div class="refuse-button">
          <div
            class="icon-container refuse"
            :class="approveType === 'handler_refuse' ? 'active' : ''">
            <em class="srm-icon icon-x" />
          </div>
          <div
            class="btn-des-refuse"
            :class="approveType === 'handler_refuse' ? 'active' : ''">
            {{ $T("hipspfm.common.action.jump.cuxAux").$D("不同意") }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="approveType === 'handler_approval_opinions'"
      class="approve-node-info">
      <div class="title">
        {{ $T("hipspfm.common.message.willFlow").$D("即将流向") }}
      </div>
      <srm-checkbox-group
        v-if="opinionNodeList.length > 0"
        v-model="opinionCheckValueList"
        :selection="1">
        <div v-for="item in opinionNodeList" :key="item.id" class="node">
          <srm-checkbox :value="isChecked(item.id)" :option="item.id">
            <span>{{ item.id }}.{{ item.name }}</span>
          </srm-checkbox>
        </div>
      </srm-checkbox-group>
    </div>
    <div
      v-if="approveType === 'handler_approval_opinions'"
      class="approve-node-info">
      <div class="title">
        {{ $T("hipspfm.common.message.modifyFlowInfo").$D("修改流程信息") }}
      </div>
      <div class="node">
        <div>
          {{ checkFlowInfo.id }}.{{ checkFlowInfo.name }}
          <span v-if="opinionEmployees">( {{ opinionEmployees }} )</span>
        </div>
        <em class="srm-icon icon-users" @click="showOpinionEmployee" />
      </div>
    </div>
    <div
      v-if="approveType === 'handler_pass' && checkFlowInfoList.length > 0"
      class="approve-node-info">
      <div class="title">
        {{ $T("hipspfm.common.message.modifyFlowInfo").$D("修改流程信息") }}
      </div>
      <div v-for="item in modifyFlowInfoList" :key="item.id" class="node">
        <div>
          {{ item.id }}.{{ item.name }}
          <span v-if="item.approveEmployees">( {{ item.approveEmployees }} )</span>
        </div>
        <em class="srm-icon icon-users" @click="showApproveEmployee(item)" />
      </div>
    </div>
    <div
      v-if="approveType === 'handler_approval_opinions'"
      class="approve-content">
      <SrmTextareaField
        v-model="agreeOpinionInfo"
        :clear-button="false"
        :label="$T('hipspfm.common.message.opinionComment').$D('整理意见')"
        theme="fill">
        <span slot="left">{{ $T("hipspfm.common.action.approval.adopt").$D("采纳") }}：</span>
      </SrmTextareaField>
      <SrmTextareaField
        v-model="refuseOpinionInfo"
        :clear-button="false"
        theme="fill">
        <span slot="left">{{
          $T("hipspfm.common.action.approval.unadopt").$D("不采纳")
        }}：</span>
      </SrmTextareaField>
    </div>
    <div
      v-if="approveType !== 'handler_approval_opinions'"
      class="approve-content">
      <SrmTextareaField
        v-model="approveInfo"
        :height="textareaHeight"
        :label="$T('hipspfm.common.message.approvalComment').$D('审批意见')"
        theme="fill"/>
    </div>
    <div v-show="approveType === 'handler_refuse'" class="approve-back">
      <div class="approve-back-item">
        <div class="approve-back-item-label">
          {{ $T("hipspfm.common.message.backNode").$D("退回节点") }}
        </div>
        <div v-if="refuseNodeList.length" class="approve-back-item-value">
          <SrmSelectField
            v-model="backNode"
            display-field="name"
            value-field="id"
            :title="
              $T('hipspfm.common.message.choseBackNode').$D('选择退回节点')
            "
            :placeholder="
              $T('hipspfm.common.message.tips.choseBackNode').$D(
                '请选择退回节点'
              )
            "
            :list="refuseNodeList"/>
        </div>
      </div>
      <div class="approve-back-item">
        <div class="approve-back-item-label">
          {{ $T("hipspfm.common.message.backType").$D("退回类型") }}
        </div>
        <srm-checkbox-group v-model="checkBackType" :selection="1">
          <div v-for="item in backTypeList" :key="item.value" class="node">
            <srm-checkbox
              :value="isBackTypeChecked(item.value)"
              :option="item.value">
              {{ item.title }}
            </srm-checkbox>
          </div>
        </srm-checkbox-group>
      </div>
    </div>
    <srm-popup
      :title="$T('hipspfm.common.message.pleaseSelect').$D('请选择')"
      position="bottom"
      rounded
      show-header
      :visible="employeePopVisible"
      @onClose="employeePopVisible = false">
      <span
        slot="title"
        class="srm-icon icon-switch-horizontal srm-lov-change-select"
        @click="activeTab = activeTab ? 0 : 1"/>
      <srm-swiper v-model="activeTab" height="100%">
        <srm-swiper-item>
          <div class="srm-lov-container">
            <!-- 搜索组件 -->
            <srm-search
              v-model="lovParams"
              :field="[
                {
                  fieldType: 'TEXT',
                  fieldCode: 'name',
                  fieldName: $T('hipspfm.common.view.employName').$D(
                    '人员名称'
                  ),
                },
                {
                  fieldType: 'TEXT',
                  fieldCode: 'employeeNum',
                  fieldName: $T('hipspfm.common.view.employeeNum').$D(
                    '人员编码'
                  ),
                },
                {
                  fieldType: 'TEXT',
                  fieldCode: 'unitName',
                  fieldName: $T('hipspfm.common.view.unitName').$D('人员部门'),
                },
              ]"
              :placeholder="$T('hipspfm.common.view.employName').$D('人员名称')"
              @search="handleSearch"
              @clear="handleSearch"/>
            <!-- 列表-->
            <div
              v-loading="loading"
              class="srm-lov-scroll-wrap"
              style="height: calc(100% - 104px)">
              <srm-scroll
                v-if="userMemoryList.length"
                :scrollable="true"
                :refreshable="false"
                height="100%">
                <srm-checkbox-group
                  v-model="employeeCheckedValue"
                  :selection="Infinity">
                  <div v-for="item in userMemoryList"
                       :key="item.employeeId">
                    <div
                      v-if="item.employeeId"
                      class="srm-lov-list-item">
                      <srm-checkbox :option="item" position="left">
                        <TouchFeedback active-class-name="srm-lov-content-active">
                          <div
                            class="srm-lov-content"
                            :class="{
                              'srm-lov-content-active': checkedFlag(item),
                            }">
                            <span v-if="item.name">{{ item.name }}</span><span v-if="item.unitName">({{ item.unitName }})</span>
                          </div>
                        </TouchFeedback>
                      </srm-checkbox>
                      <div class="srm-lov-content-bottom-line" />
                    </div>
                  </div>
                </srm-checkbox-group>
              </srm-scroll>
              <!-- 空白页 -->
              <NoContent
                v-else-if="!userMemoryList.length && !loading"
                title="hipspfm.common.message.noScreenResults"
                img-src="NoResult@3x.png"/>
            </div>
          </div>
        </srm-swiper-item>
        <srm-swiper-item>
          <div class="srm-lov-container">
            <!-- 列表-->
            <div class="srm-lov-scroll-wrap" style="height: calc(100% - 60px)">
              <srm-scroll
                v-if="employeeCheckedValue.length"
                :scrollable="true"
                :refreshable="false"
                height="100%"
                :content-scroll="false">
                <srm-checkbox-group
                  v-model="employeeCheckedValue"
                  :selection="Infinity">
                  <transition-group name="srm-lov-list-item">
                    <div
                      v-for="item in employeeCheckedValue"
                      :key="item.employeeId"
                      class="srm-lov-list-item">
                      <srm-checkbox :option="item" position="left">
                        <TouchFeedback
                          active-class-name="srm-lov-content-active">
                          <div class="srm-lov-content">
                            <span v-if="item.name">{{ item.name }}</span><span v-if="item.unitName">({{ item.unitName }})</span>
                          </div>
                        </TouchFeedback>
                      </srm-checkbox>
                      <div class="srm-lov-content-bottom-line" />
                    </div>
                  </transition-group>
                </srm-checkbox-group>
              </srm-scroll>
              <!-- 空白页 -->
              <NoContent
                v-else-if="!employeeCheckedValue.length && !loading"
                title="smbl.common.view.noSelect"
                img-src="NoResult@3x.png"/>
            </div>
          </div>
        </srm-swiper-item>
      </srm-swiper>
      <!-- 底部确认 -->
      <div class="srm-lov-foot-wrapper">
        <span class="srm-lov-foot-msg-info">
          {{ $T("hipspfm.common.validation.multiple").$D("该选择为多选") }}
        </span>
        <srm-button fill size="large" @click="submitValue">
          {{ $T("hipspfm.common.validation.confirmSelect").$D("确认选择") }}
        </srm-button>
      </div>
    </srm-popup>
    <BottomHandler :form-form="true" :can-approve-flag="true" :show-approve-btn="true" @confirm="confirm" />
  </div>
</template>

<script>
import SrmSelectField from "@/components/SrmSelectField";
import BottomHandler from "../components/BottomHandler.vue";
import NoContent from "@/components/NoContent";
import {
  getEmployIdByuserIdApi,
  getUnitNameByEmployeeIdApi,
  getEmployeeListByUnitNameApi,
} from "../api/index.js";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.common", "ssrc.common" ],
  components: {
    BottomHandler,
    SrmSelectField,
    NoContent,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    refuseNodeList: {
      type: Array,
      default: () => [],
    },
    opinionNodeList: {
      type: Array,
      default: () => [],
    },
    checkFlowInfoList: {
      type: Array,
      default: () => [],
    },
    operations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      approveInfo: "同意", //审批意见
      agreeOpinionInfo: "", //采纳整理意见
      refuseOpinionInfo: "", //不采纳整理意见
      approveType: "handler_pass", //审批操作类型
      backNode: "N2", //退回节点
      checkBackType: [ "false" ],
      flowInfo: {},
      lovParams: {},
      backTypeFlag: true, //退回类型弹窗
      operationArr: [], //操作按钮集合
      opinionCheckValueList: [],
      userMemoryList: [], //用户记忆列表
      employees: [], //员工列表
      approverObj: {},
      employeePopVisible: false,
      activeTab: 0,
      loading: false,
      employeeCheckedValue: [],
      employeeNum: "",
      unitName: "",
      approvers: "", //节点审批人
      opinionEmployees: "",
      textareaHeight: 55,
      modifyFlowInfoList: [],
      backTypeList: [
        {
          title: "【重新流转】流程",
          value: "false",
        },
        {
          title: "【直接返回】到我",
          value: "true",
        },
      ],
      multipleLanguage: {
        approveNodeTips: this.$T(
          "hipspfm.common.message.tips.choseBackNode"
        ).$D("请选择退回节点"),
        approveTypeTips: this.$T(
          "hipspfm.common.message.tips.choseBackType"
        ).$D("请选择退回类型"),
      },
    };
  },
  computed: {
    showBtn() {
      return (item) => {
        return this.operations.length && this.operations.includes(item);
      };
    },
    checkFlowInfo() {
      return (
        this.opinionNodeList.length > 0 &&
        this.opinionNodeList.find((item) => {
          return (
            this.opinionCheckValueList.length &&
            this.opinionCheckValueList.includes(item.id)
          );
        })
      );
    },
    isChecked() {
      return (item) => {
        return (
          this.opinionCheckValueList.length &&
          this.opinionCheckValueList.includes(item)
        );
      };
    },
    isBackTypeChecked() {
      return (item) => {
        return this.checkBackType.length && this.checkBackType.includes(item);
      };
    },
    checkedFlag() {
      return (item) => {
        return this.employeeCheckedValue.some((check) => {
          return check.employeeId === item.employeeId;
        });
      };
    },
  },
  watch: {
    opinionNodeList(val) {
      if (val && val.length > 0) {
        this.opinionCheckValueList = [ val[0].id ];
      }
    },
    checkFlowInfoList(val) {
      this.modifyFlowInfoList = val;
    },
  },
  created() {
    this.isClearCachEmployees();
  },
  async mounted() {
    if (this.operations.length > 0) {
      this.approveType = this.operations.includes("handler_approval_opinions") ?
        "handler_approval_opinions" :
        "handler_pass";
    }
    this.$emit("onApproveType", this.approveType);
    await this.getEmployIdByuserId();
    await this.getUnitNameByEmployeeId();
    this.getEmployeeListByUnitName();
  },
  methods: {
    choseType(type) {
      this.opinionCheckValueList[0] = "";
      this.approveType = type;
      this.$emit("onApproveType", this.approveType);
      switch (type) {
      case "handler_refuse":
        this.approveInfo = "不同意";
        break;
      case "handler_abandon":
        this.approveInfo = "废弃";
        break;
      case "handler_pass":
        this.approveInfo = "同意";
        break;
      case "handler_special_pass":
        this.approveInfo = "有条件同意";
        break;
      case "handler_pass_disagree":
        this.approveInfo = "不同意";
        break;
      default:
        this.approveInfo = "同意";
      }
    },
    // 提交
    confirm() {
      if (
        this.approveType === "handler_approval_opinions" &&
        (!this.agreeOpinionInfo || !this.refuseOpinionInfo)
      ) {
        this.$notification.open({
          message: `${this.$T(
            "hipspfm.common.view.validation.fillOptionsRequire"
          ).$D("请填写整理意见")}`,
          description: "",
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 2,
        });
        return;
      }
      if (!this.approveType) {
        this.notify(this.multipleLanguage.approveTypeTips);
        return;
      }

      if (this.approveType === "handler_refuse" && !this.backNode) {
        this.notify(this.multipleLanguage.approveNodeTips);
        return;
      }

      if (
        this.approveType === "handler_refuse" &&
        this.checkBackType[0] === ""
      ) {
        this.notify(this.multipleLanguage.approveTypeTips);
        return;
      }
      if (this.approveType === "handler_approval_opinions") {
        this.approveInfo = `采纳：${this.agreeOpinionInfo},不采纳：${this.refuseOpinionInfo}`;
      }
      const otherParams = {
        jumpToNodeId: this.backNode,
        refusePassedToThisNodeOnNode: false,
        refusePassedToThisNode: this.checkBackType[0] !== "false",
      };
      this.$emit(
        "submitApprove",
        this.approveInfo,
        this.approvers,
        this.approveType,
        otherParams,
        this.employees,
        this.opinionCheckValueList[0]
      );
    },
    notify(msg) {
      this.$notification.open({
        message: msg,
        // eslint-disable-next-line no-undef
        key,
        class: "notification",
      });
    },
    getOpinionEmployee(val) {
      this.employeeCheckedValue = [];
      this.employees = val;
      this.opinionEmployees = val
        .map((item) => {
          return item.name;
        })
        .join(";");
      let approversList = val.map((item) => {
        return { type: "account", handler: item.attribute1 };
      });
      let approverObj = {};
      approverObj[this.opinionCheckValueList[0]] = approversList;
      this.approvers = JSON.stringify(approverObj);
    },
    getApproveEmployee(employees) {
      this.employeeCheckedValue = [];
      this.employees = employees;
      let approveEmployees = employees
        .map((item) => {
          return item.name;
        })
        .join(";");
      this.flowInfo.approveEmployees = approveEmployees;
      this.modifyFlowInfoList = [ ...this.modifyFlowInfoList ];
      let approversList = employees.map((item) => {
        return { type: "account", handler: item.attribute1 };
      });
      this.approverObj[this.flowInfo.id] = approversList;
      this.approvers = JSON.stringify(this.approverObj);
    },
    //显示整理意见人员列表弹框
    showOpinionEmployee() {
      this.getMeorryCachEmployeeList();
      this.employeePopVisible = true;
    },
    //显示同意人员列表弹框
    showApproveEmployee(flowInfo) {
      this.getMeorryCachEmployeeList();
      this.employeePopVisible = true;
      this.flowInfo = flowInfo;
    },
    //通过员工id查询部门名称
    async getEmployIdByuserId() {
      await getEmployIdByuserIdApi(
        SrmUtil.getUserInfo().id
      ).then((res) => {
        this.employeeNum = res.content[0].employeeNum;
      });
    },
    //通过员工号查询部门名称
    async getUnitNameByEmployeeId() {
      await getUnitNameByEmployeeIdApi(this.employeeNum).then((res) => {
        this.unitName = res.content[0].unitName;
      });
    },
    //处理员工搜索
    handleSearch() {
      if (!this.lovParams.name) {
        this.getEmployeeListByUnitName();
        return;
      }
      getEmployeeListByUnitNameApi(this.lovParams).then((res) => {
        this.lovParams.size = res.totalElements;
        getEmployeeListByUnitNameApi(this.lovParams).then((result) => {
          this.userMemoryList = result.content;
          this.getMeorryCachEmployeeList();
        });
      });
    },
    //确认选择值
    submitValue() {
      if (this.approveType === "handler_approval_opinions") {
        this.getOpinionEmployee(this.employeeCheckedValue);
      }
      if (this.approveType === "handler_pass") {
        this.getApproveEmployee(this.employeeCheckedValue);
      }
      this.employeePopVisible = false;
    },
    //通过部门名字查询人员列表
    async getEmployeeListByUnitName() {
      const params = {};
      params.unitName = this.unitName;
      getEmployeeListByUnitNameApi(params).then((res) => {
        params.size = res.totalElements;
        getEmployeeListByUnitNameApi(params).then((result) => {
          this.userMemoryList = result.content;
          if (
            localStorage.getItem("employeesFlag") &&
            JSON.parse(localStorage.getItem("employeesFlag"))[
              SrmUtil.getUserInfo().id
            ]
          ) {
            let cachUser = JSON.parse(JSON.parse(localStorage.getItem("employeesFlag"))[
              SrmUtil.getUserInfo().id
            ]);
            cachUser.sort(this.compare("count"));
            // eslint-disable-next-line no-unused-vars
            for (let item of cachUser) {
              if (!JSON.stringify(this.userMemoryList).includes(item.employeeId)) {
                this.userMemoryList.unshift(item);
              }
            }
          }
        });
      });
    },
    //根据人员选择频率值排序
    compare(property,sort) {
      return (a, b) => {
        var value1 = a[property];
        var value2 = b[property];
        if (sort === "des") {
          return value2 - value1;
        }
        return value1 - value2;
      };
    },
    //从缓存中进行用户记忆获取员工列表
    getMeorryCachEmployeeList() {
      this.userMemoryList.forEach((item) => {
        item.count = 0;
      });
      if (
        localStorage.getItem("employeesFlag") &&
        JSON.parse(localStorage.getItem("employeesFlag"))[
          SrmUtil.getUserInfo().id
        ]
      ) {
        const cacheUserList = JSON.parse(JSON.parse(localStorage.getItem("employeesFlag"))[
          SrmUtil.getUserInfo().id
        ]);
        // eslint-disable-next-line no-unused-vars
        for (let cachUser of cacheUserList) {
          if (
            JSON.stringify(this.userMemoryList) &&
            JSON.stringify(this.userMemoryList).includes(cachUser.employeeId)
          ) {
            this.userMemoryList.forEach((item) => {
              if (item.employeeId === cachUser.employeeId) {
                item.count = cachUser.count;
              }
            });
          }
        }
      }
      this.userMemoryList =
        this.userMemoryList.length > 0 &&
        this.userMemoryList.sort(this.compare("count","des"));
    },
    //判断缓存的员工是否离职，离职则清除缓存
    isClearCachEmployees() {
      const params = {};
      getEmployeeListByUnitNameApi(params).then((res) => {
        params.size = res.totalElements;
        getEmployeeListByUnitNameApi(params).then((result) => {
          let allEmployees = result.content;
          let employees = {};
          if (
            localStorage.getItem("employeesFlag") &&
            JSON.parse(localStorage.getItem("employeesFlag"))[
              SrmUtil.getUserInfo().id
            ]
          ) {
            let cachUser = JSON.parse(JSON.parse(localStorage.getItem("employeesFlag"))[
              SrmUtil.getUserInfo().id
            ]);
            cachUser.sort(this.compare("count"));
            // eslint-disable-next-line no-unused-vars
            for (let i = 0; i < cachUser.length; i++) {
              if (!JSON.stringify(allEmployees).includes(cachUser[i].employeeId)) {
                cachUser.splice(i,1);
              }
            }
            employees[SrmUtil.getUserInfo().id] = JSON.stringify(cachUser);
            localStorage.setItem("employeesFlag",JSON.stringify(employees));
          }
        });
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl";

.approve-form-content {
  height: 100%;
  background-color: #F6F6F6;

  .approve-option {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    margin-bottom: 8px;
    background-color: #ffffff;

    .btn-des-opinion {
      font-size: 14px;

      &.active {
        color: #05944F;
      }
    }

    .btn-des-abandon {
      font-size: 14px;

      &.active {
        color: #333333;
      }
    }

    .btn-des-agree {
      font-size: 14px;

      &.active {
        color: #276EF1;
      }
    }

    .btn-des-disagree {
      font-size: 14px;

      &.active {
        color: rgba(253, 2, 96, 1);
      }
    }

    .btn-des-special-agree {
      font-size: 14px;

      &.active {
        color: rgba(110, 200, 0, 1);
      }
    }

    .btn-des-refuse {
      font-size: 14px;

      &.active {
        color: #E11900;
      }
    }

    .agree-button, .disagree-button, .opinion-button, .refuse-button, .special-agree-button, .abandon-button {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .icon-container {
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 32px;
    }

    .option {
      line-height: 36px;
      text-align: center;
      flex: 1;

      &:nth-of-type(2) {
        margin-left: 0;
      }
    }

    .opinion {
      color: #05944F;
      border: 1px solid #05944F;

      &.active {
        background-color: #05944F;
        color: #ffffff;
      }
    }

    .abandon {
      color: #333333;
      border: 1px solid #333333;

      &.active {
        background-color: #333333;
        color: #ffffff;
      }
    }

    .refuse {
      color: #E11900;
      border: 1px solid #E11900;

      &.active {
        background-color: #E11900;
        color: #ffffff;
      }
    }

    .agree {
      color: #276EF1;
      border: 1px solid #276EF1;

      &.active {
        background-color: #276EF1;
        color: #ffffff;
      }
    }

    .disagree {
      color: rgba(253, 2, 96, 1);
      border: 1px solid rgba(253, 2, 96, 1);

      &.active {
        background-color: rgba(253, 2, 96, 1);
        color: #ffffff;
      }
    }

    .special-agree {
      color: rgba(110, 200, 0, 1);
      border: 1px solid rgba(110, 200, 0, 1);

      &.active {
        background-color: rgba(110, 200, 0, 1);
        color: #ffffff;
      }
    }
  }

  .approve-node-info {
    background-color: #ffffff;

    .title {
      padding: 10px 0 10px 15px;
      box-sizing: border-box;
      font-family: Alibaba-PuHuiTi-M;
      font-size: 14px;
      color: #333333;
      font-weight: bold;
    }

    .node {
      display: flex;
      justify-content: space-between;
      padding: 18px;
      border-top: 1px solid #F6F6F6;
      font-size: 14px;
    }
  }

  .approve-content {
    padding: 16px 15px;
    margin-bottom: 8px;
    background-color: #ffffff;
  }

  .approve-back {
    padding-left: 15px;
    background-color: #ffffff;

    .approve-back-item {
      padding: 16px 15px 8px 0;
      border-bottom: 1px solid #F6F6F6;

      .approve-back-item-label {
        font-size: 14px;
        color: #333;
        line-height: 24px;
        font-weight: bold;
      }

      .node {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 18px;
        border-top: 1px solid #F6F6F6;
        font-size: 14px;
      }

      .approve-back-item-value {
      }
    }
  }
}

.srm-lov-change-select {
  color: $srm-theme-color-primary;
  margin-left: 3px;
  font-size: 22px;
}

.srm-lov-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 0 10px;
  width: 100%;
}

.srm-lov-scroll-wrap {
  height: calc(100% - 86px);
}

.srm-lov-content {
  width: 100%;
  font-size: 16px;
  color: $srm-theme-color-info;
  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 8px;
}

.srm-lov-content-active {
  color: $srm-theme-color-primary;
}

.srm-lov-list-item {
  padding-top: 16px;
  height: 54px;
  width: 100%;
}

.srm-lov-foot-wrapper {
  height: 60px;
  background: white;
  padding-right: 15px;
  padding-left: 15px;
  z-index: 9999;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.srm-lov-foot-msg-info {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #c6cad6;
  letter-spacing: 0;
  line-height: 24px;
  border-right: none;
  text-align: left;
  height: auto;
}

>>> .srm-swiper-item {
  background: white;
}

>>> .srm-check-box-content {
  font-size: 14px;
  margin-left: 12px;
}

>>> .font-style {
  font-size: 14px;
}

>>> .approve-form-content {
  .approve-option {
    .option {
      &:nth-of-type(2) {
        margin-left: 0;
      }
    }
  }
}

.srm-lov-list-item-enter-active, .srm-lov-list-item-leave-active {
  transition: all 0.3s ease;
}

.srm-lov-list-item-enter, .srm-lov-list-item-leave-to {
  opacity: 0;
  height: 0;
}
</style>
