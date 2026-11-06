<template>
  <div style="height: 100vh">
    <!-- Tab栏 -->
    <srm-flex v-if="!isFirstFlag" slot="filter" direction="column" align="start">
      <srm-tab-bar
        :key="currentNodeConfigInfo.customerUnitCode"
        :tabs="alltabs"
        display="justify"
        :customize-code="getCustomizeTab"
        @indexChange="onTabChange">
        <srm-tab-item :label="$T('slod.common.model.node.createName').$D('待新建')" code="create"/>
        <srm-tab-item :label="$T('slod.common.model.node.submitName').$D('待提交')" code="submit"/>
        <srm-tab-item :label="$T('slod.common.model.node.affirmName').$D('待确认')" code="affirm"/>
        <srm-tab-item :label="$T('slod.common.model.node.allName').$D('全部')" code="all" />
      </srm-tab-bar>
      <div v-if="currentTab === 'affirm'||currentTab === 'all'" class="receive-workplace-list-second-tab">
        <srm-button :class="['first-button',{'no-active':hdKey!=='left'}]" size="small" type="primary"
                    @click="changeTabLine('left')">
          {{ $T('slod.common.model.common.head').$D('按单展示') }}
        </srm-button>
        <srm-button :class="[{'no-active':hdKey!=='right'}]" size="small" type="primary"
                    @click="changeTabLine('right')">
          {{ $T('slod.common.model.common.line').$D('按行展示') }}
        </srm-button>
      </div>
    </srm-flex>

    <!-- 列表页 -->
    <srm-list
      v-if="!isFirstFlag"
      :data-set="currentDataSet"
      :customize-code="getCustomizeCode(currentTab, hdKey, currentNodeConfigInfo)"
      :columns="getListColumns"
      :buttons="getListButtons"
      @itemClick="clickListToDetail">
      <!-- 节点按钮 -->
      <srm-flex slot="bottom" class="round-btn-box" justify="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="chooseNodeClick">
          <div style="display: flex;align-items: center;flex-direction: column;">
            <img :src="require('../icon/Node.svg')" width="24">
            <span style="color: #276EF1;transform: scale(0.8);font-size: 12px;">{{ `${currentNodeConfigInfo.nodeConfigName}` }}</span>
          </div>
        </srm-button>
      </srm-flex>
    </srm-list>

    <!-- 节点选择 -->
    <!-- 非初次进入发货 -->
    <srm-popup
      class="overridePop"
      position="bottom"
      :visible="showNodePop && !isFirstFlag"
      :title="$T('slod.common.model.common.chooseNode').$D('选择节点')"
      :show-header="!isFirstFlag"
      :height="isFirstFlag ? '100%' : '80%'"
      @onClose="closeNodeChoosePop">
      <srm-list
        v-if="showNodePop"
        :data-set="nodeTemplateCodeList"
        :columns="getNodeColumns"
        @itemClick="clickNode"/>
    </srm-popup>
    <!-- 初次进入发货 -->
    <srm-list
      class="overridePop"
      :v-if="isFirstFlag"
      :data-set="nodeTemplateCodeList"
      :columns="getNodeColumns"
      @itemClick="clickNode"/>
  </div>
</template>

<script>
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { isNil } from "lodash";
import {
  createAsnInfoApi,
  getNodeTemplateCodeApi,
  // getOperatingDataApi
} from "../api";
import { nodeDs } from "../datasource/commonDs";
import {
  asnDsByCreate,
  asnDsBySubmit,
  asnDsByAffirm,
  asnDsByAll
} from "../datasource/asnDs";
import {
  planDsByCreate,
  planDsBySubmit,
  planDsByAffirm,
  planDsByAll
} from "../datasource/planDs";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import {
  getCustomize,
} from "../utils";
import getWaitCreateListColumns from "../mixins/waitCreateColumns";
import getWaitSubmitListColumns from "../mixins/waitSubmitColumns";
import getWaitAffirmListColumns from "../mixins/waitAffirmColumns";
import getAllListColumns from "../mixins/allColumns";
import getListDetailColumns from "../mixins/listDetailColumns";
export default {
  modules: [ "slod.common", "hipspfm.common", "sinv.receiptExecution" ],
  name: "DeliveryWorkbenchList",
  // eslint-disable-next-line vue/no-unused-components
  components: { HistoryRecordTiled },
  mixins: [ getListDetailColumns, getWaitCreateListColumns, getWaitSubmitListColumns, getWaitAffirmListColumns, getAllListColumns ],
  data() {
    return {
      getCustomizeCode: getCustomize,
      // 节点列表
      nodeTemplateCodeList: new DataSet(nodeDs()),
      // 当前节点信息
      currentNodeConfigInfo: {
        nodeConfigName: $T("slod.common.model.common.asn").$D("送货单"),
      },
      oldNodeConfigInfo: {}, // 上一个选择节点信息
      hdKey: "left", // 待确认/全部 下的 按单（left）/按行（right）
      // 首次进入页面标记
      isFirstFlag: true,
      // 节点是否打开标记
      showNodePop: false,
      tabId: "",
      imgUrl: {
        ASN: require("../icon/ASN.svg"),
        LABEL: require("../icon/LABEL.svg"),
        PLAN: require("../icon/PLAN.svg"),
        UNIQUE_LABEL: require("../icon/UNIQUE_LABEL.svg"),
      },
      // tab栏
      currentTab: "",
      tabName: {
        "create": $T("slod.common.model.node.createName").$D("待新建"),
        "submit": $T("slod.common.model.node.submitName").$D("待提交"),
        "affirm": $T("slod.common.model.node.affirmName").$D("待确认"),
        "all": $T("slod.common.model.node.allName").$D("全部"),
      },
      alltabs: [
        { code: "create", label: $T("slod.common.model.node.createName").$D("待新建") },
        { code: "submit", label: $T("slod.common.model.node.submitName").$D("待提交") },
        { code: "affirm", label: $T("slod.common.model.node.affirmName").$D("待确认") },
        {
          code: "all",
          label:
          <srm-flex tab-id="click2" onNativeClick>
            <srm-flex-item onNativeClick key="4" class={[ this.currentTab === "all" ? "item-box-checked" : "item-box" ]} flex="1">
              <srm-dropdown tab-id="click3" onClick={() => this.onTabSelcet()} visible={this.showDropDownAffirm} value="all" text={$T("slod.common.model.node.allName").$D("全部")} >
                <srm-flex direction="column">
                  <srm-button onClick={() => this.changeTabLine("left")} class={[ "override-button", this.hdKey === "left" ? "" : "no-active" ]} type="primary" plain rect>
                    {$T("slod.common.model.common.head").$D("按单展示")}
                  </srm-button>
                  <srm-button onClick={() => this.changeTabLine("right")} class={[ "override-button", this.hdKey === "right" ? "" : "no-active" ]} type="primary" plain rect>
                    {$T("slod.common.model.common.line").$D("按行展示")}
                  </srm-button>
                </srm-flex>
              </srm-dropdown>
            </srm-flex-item>
          </srm-flex>
        },
      ],
      // tab栏的下拉菜单
      showDropDownAffirm: false,
      showDropDownAll: false,
      operatingType: "0",
      // 列表ds
      listDataSet: {},
      // 当前dataset
      currentDataSet: null,
      // 打开的弹框标记
      listPopup: null,
    };
  },
  computed: {
    getCustomizeTab() {
      const configAbc = this.currentNodeConfigInfo.nodeTemplateCode !== "ASN" ?
        `${this.currentNodeConfigInfo.customerUnitCode?.slice(-1)}` : "";
      let custCode = "";
      switch (this.currentNodeConfigInfo.nodeTemplateCode) {
      case "ASN":
        custCode = "SMBL.DELIVERY_WORKBENCH.ASN.TAB";
        break;
      case "PLAN":
        custCode = `SMBL.DELIVERY_WORKBENCH.PLAN_${configAbc}.TAB`;
        break;
      default:
        custCode = "SMBL.DELIVERY_WORKBENCH.ASN.TAB";
      }
      return custCode;
    },
    getListColumns() {
      switch (this.currentTab) {
      case "create":
        return this.getWaitCreateListColumns(this.currentNodeConfigInfo.nodeTemplateCode, this.hdKey);
      case "submit":
        return this.getWaitSubmitListColumns(this.currentNodeConfigInfo.nodeTemplateCode, this.hdKey);
      case "affirm":
        return this.getWaitAffirmListColumns(this.currentNodeConfigInfo.nodeTemplateCode, this.hdKey);
      case "all":
        return this.getAllListColumns(this.currentNodeConfigInfo.nodeTemplateCode, this.hdKey);
      default:
        return [];
      }
    },
    getListButtons() {
      switch (this.currentTab) {
      case "create":
        // 未实现并单
        return [
          // {
          //   text: this.$T("slod.common.model.status.createByAll").$D("全选新建"),
          //   type: "primary",
          //   fill: true,
          //   callback: () => {
          //     this.currentDataSet.updateSelected();
          //   }
          // },
          {
            text: this.$T("slod.common.model.status.createByChoose").$D("勾选新建"),
            type: "primary",
            fill: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              // 新建 -> 跳转到待提交 明细页
              const validHeadFlag = this.currentDataSet.validate();
              if (!validHeadFlag) {
                return;
              }
              this.$loading.show();
              let that = this;
              const listData = this.currentDataSet.selected.map((item) => item.toData());
              createAsnInfoApi(this.currentNodeConfigInfo.nodeTemplateCode, this.currentNodeConfigInfo.nodeConfigId,
                [ `customizeUnitCode=${this.currentNodeConfigInfo.customerUnitCode}.SEARCH.CREATE,${this.currentNodeConfigInfo.customerUnitCode}.CREATE` ],
                [ ...listData ]).then((res) => {
                this.$loading.hide();
                if (res && res.failed) {
                  this.$notification.open({
                    message: res.message,
                    duration: 2000,
                  });
                  return;
                }
                if (res.deliveryHeaderIdList && res.deliveryHeaderIdList.length > 1) {
                  // 并单页面
                  this.$notification.open({
                    message: $T("slod.common.model.status.mergeNumLook").$D("已根据并单规则生成单据，请在待提交页面查看单据！"),
                  });
                  this.currentDataSet.refresh();
                } else if (res.deliveryHeaderId) {
                  this.$store.commit("DeliveryWorkbench/setDetailFlag", true);
                  this.$store.commit("DeliveryWorkbench/setNodeTemplateCode", this.currentNodeConfigInfo.customerUnitCode);
                  that.$router.push({
                    name: "DeliveryWorkbenchDetail",
                    query: {
                      tab: "submit",
                      node: that.currentNodeConfigInfo.nodeTemplateCode,
                      deliveryHeaderId: res.deliveryHeaderId,
                      nodeConfigId: this.currentNodeConfigInfo.nodeConfigId,
                      customizeUnitCode: that.currentNodeConfigInfo.customerUnitCode,
                    }
                  });
                } else {
                  // 接口id返回为空
                  this.$notification.open({
                    message: res.deliveryHeaderId,
                    duration: 2000,
                  });
                }
              }).finally(() => {
                this.$loading.hide();
              });
            }
          },
        ];
      case "submit":
        return [
          {
            text: this.$T("slod.common.model.status.delete").$D("删除"),
            type: "danger",
            bordered: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.currentDataSet.updateSelected();
            }
          },
          {
            text: this.$T("slod.common.model.status.submit").$D("提交"),
            type: "primary",
            fill: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.currentDataSet.submitSelected();
            }
          },
        ];
      case "affirm":
        return [
          {
            text: this.$T("slod.common.model.status.reject").$D("拒绝"),
            type: "danger",
            bordered: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.currentDataSet.updateSelected();
            }
          },
          {
            text: this.$T("slod.common.model.status.sure").$D("确认"),
            type: "primary",
            fill: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              const validHeadFlag = this.currentDataSet.validate();
              if (validHeadFlag) {
                this.currentDataSet.submitSelected();
              }
            }
          },
        ];
      case "all":
        return [
          {
            text: this.$T("slod.common.model.status.close").$D("关闭"),
            type: "danger",
            bordered: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.currentDataSet.submitSelected();
            }
          }
        ];
      default:
        return [];
      }
    },
    getDetailButtons() {
      switch (this.currentTab) {
      case "create":
        return [
          {
            title: this.$T("slod.common.model.status.cancelled").$D("取消"),
            type: "danger",
            bordered: true,
            size: "small",
            handler: () => {
              // 取消
              this.listPopup.closePopup();
            }
          },
          {
            title: this.$T("slod.common.model.status.create").$D("新建"),
            type: "primary",
            fill: true,
            size: "small",
            handler: () => {
              // 新建 -> 跳转到待提交 明细页
              const validHeadFlag = this.currentDataSet.validate();
              if (!validHeadFlag) {
                return;
              }
              this.$loading.show();
              let that = this;
              createAsnInfoApi(this.currentNodeConfigInfo.nodeTemplateCode, this.currentNodeConfigInfo.nodeConfigId,
                [ `customizeUnitCode=${this.currentNodeConfigInfo.customerUnitCode}.SEARCH.CREATE,${this.currentNodeConfigInfo.customerUnitCode}.CREATE` ],
                [ this.currentDataSet.current.toData() ]).then((res) => {
                this.$loading.hide();
                if (res && res.failed) {
                  this.$notification.open({
                    message: res.message,
                    duration: 2000,
                  });
                  return;
                }
                if (res.deliveryHeaderIdList && res.deliveryHeaderIdList.length > 1) {
                  // 并单页面
                } else if (res.deliveryHeaderId) {
                  this.$store.commit("DeliveryWorkbench/setDetailFlag", true);
                  this.$store.commit("DeliveryWorkbench/setNodeTemplateCode", this.currentNodeConfigInfo.customerUnitCode);
                  that.$router.push({
                    name: "DeliveryWorkbenchDetail",
                    query: {
                      tab: "submit",
                      node: that.currentNodeConfigInfo.nodeTemplateCode,
                      deliveryHeaderId: res.deliveryHeaderId,
                      nodeConfigId: this.currentNodeConfigInfo.nodeConfigId,
                      customizeUnitCode: that.currentNodeConfigInfo.customerUnitCode,
                    }
                  });
                } else {
                  // 接口id返回为空
                  this.$notification.open({
                    message: res.deliveryHeaderId,
                    duration: 2000,
                  });
                }
              }).finally(() => {
                this.$loading.hide();
              });
            }
          },
        ];
      case "affirm":
        return [
          {
            title: this.$T("slod.common.model.status.reject").$D("拒绝"),
            type: "danger",
            bordered: true,
            size: "small",
            handler: () => {
              // 拒绝
              this.currentDataSet.updateRecords([ this.currentDataSet.current ]).finally(() => this.listPopup.closePopup());
            }
          },
          {
            title: this.$T("slod.common.model.status.sure").$D("确认"),
            type: "primary",
            fill: true,
            size: "small",
            handler: () => {
              // 确认
              const validHeadFlag = this.currentDataSet.validate();
              if (validHeadFlag) {
                this.currentDataSet.submitRecords([ this.currentDataSet.current ]).finally(() => this.listPopup.closePopup());
              }
            }
          },
        ];
      case "all":
        return [
          {
            title: this.$T("slod.common.model.status.close").$D("关闭"),
            type: "danger",
            bordered: true,
            size: "small",
            handler: () => {
              // 关闭
              this.currentDataSet.submitRecords([ this.currentDataSet.current ]).finally(() => this.listPopup.closePopup());
            }
          },
        ];
      default:
        return [];
      }
    },
    getNodeColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "nodeTemplateCode",
          fieldType: "EMPTY",
          render: (val) => <img src={this.imgUrl[val]} width="70" height="70"/>,
        },
        {
          formRow: 1,
          fieldCode: "customizeOne",
          fieldType: "EMPTY",
          render: (val, item) => <Customize
            class="overrideCus"
            columns={this.getCustomizeOneColumns}
            data-source={item}
            type="list"
            need-padding={false}/>
        }
      ];
    },
    getCustomizeOneColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "nodeConfigName",
          fieldType: "EMPTY",
          render: (val) => <span style="font-size: 16px;color: #333333, font-weight: 500;">{val}</span>,
        },
        {
          formRow: 2,
          fieldCode: "nodeRemark",
          fieldType: "EMPTY",
          render: (val) => <span style="font-size: 12px;color: #757575">{val}</span>,
        }
      ];
    }
  },
  watch: {
    showDropDownAffirm(val) {
      if (val) {
        // 监听 第一次打开自动选择按单
        if (this.currentTab !== "affirm") {
          this.hdKey = "left";
          this.currentTab = "affirm";
          this.setDataSetParams();
          setTimeout(() => {
            this.showDropDownAffirm = false;
          }, 1000);
        }
      }
    },
    showDropDownAll(val) {
      if (val) {
        // 监听 第一次打开自动选择按单
        if (this.currentTab !== "all") {
          this.hdKey = "left";
          this.currentTab = "all";
          this.setDataSetParams();
          setTimeout(() => {
            this.showDropDownAll = false;
          }, 1000);
        }
      }
    }
  },
  async beforeMount() {
    this.$loading.show();
    this.commonInfo = this.$route.query;
    this.operatingType = SrmUtil?.getDocFlowFlag();
    this.currentTab = this.currentTab || this.$store.getters["DeliveryWorkbench/getTabPosition"];
    const detailFlag = this.$store.getters["DeliveryWorkbench/getDetailFlag"];
    const customerUnitCode = this.$store.getters["DeliveryWorkbench/getNodeTemplateCode"];
    // 节点查询
    await getNodeTemplateCodeApi().then((res) => {
      // this.nodeTemplateCodeList = new DataSet(nodeDs());
      const data = [];
      res.map((item) => {
        if ([ "ASN", "PLAN" ].includes(item.nodeTemplateCode)) {
          data.push(item);
        }
      });
      this.nodeTemplateCodeList.reset();
      this.nodeTemplateCodeList.setData(data);
      this.nodeTemplateCodeList.locate(0);
      if (data.length === 1) {
        this.clickNode(this.nodeTemplateCodeList.current);
      } else if (detailFlag) {
        this.showNodePop = false;
        this.$store.commit("DeliveryWorkbench/setDetailFlag", false);
        data.forEach((item) => {
          if (item.customerUnitCode === customerUnitCode) {
            this.currentNodeConfigInfo = item;
            setTimeout(() => this.currentDs(item), 200);
          }
          this.$store.commit("DeliveryWorkbench/getNodeTemplateCode", null);
        });
      } else {
        this.showNodePop = true;
      }
    });
    this.$loading.hide();
  },
  activated() {
    if (!this.isFirstFlag) {
      // 第二次进入
      this.listPopup && this.listPopup.closePopup();
      if ([ "all", "affirm" ].includes(this.currentTab)) {
        this.listDataSet[this.currentNodeConfigInfo.nodeTemplateCode][this.currentTab][this.hdKey].refresh();
      } else {
        this.listDataSet[this.currentNodeConfigInfo.nodeTemplateCode][this.currentTab].refresh();
      }
      return;
    }
  },
  methods: {
    // ds合集
    currentDs(_object) {
      // 切割出节点单元组的A或者B
      const configAbc = _object?.customerUnitCode?.slice(-1);
      this.listDataSet = Object.assign({},
        {
          ASN: {
            "create": new DataSet(asnDsByCreate()),
            "submit": new DataSet(asnDsBySubmit()),
            "affirm": {
              left: new DataSet(asnDsByAffirm()),
              right: new DataSet(asnDsByAffirm("_H")),
            },
            "all": {
              left: new DataSet(asnDsByAll()),
              right: new DataSet(asnDsByAll("_H")),
            },
          },
          PLAN: {
            "create": new DataSet(planDsByCreate(configAbc)),
            "submit": new DataSet(planDsBySubmit(configAbc)),
            "affirm": {
              left: new DataSet(planDsByAffirm(_, configAbc)),
              right: new DataSet(planDsByAffirm("_H", configAbc)),
            },
            "all": {
              left: new DataSet(planDsByAll(_, configAbc, _object.nodeTemplateCode)),
              right: new DataSet(planDsByAll("_H", configAbc, _object.nodeTemplateCode)),
            },
          },
          LABEL: {
            "create": new DataSet(),
            "submit": new DataSet(),
            "affirm": {
              head: new DataSet(),
              line: new DataSet(),
            },
            "all": {
              head: new DataSet(),
              line: new DataSet(),
            },
          },
          UNIQUE_LABEL: {
            "create": new DataSet(),
            "submit": new DataSet(),
            "affirm": {
              head: new DataSet(),
              line: new DataSet(),
            },
            "all": {
              head: new DataSet(),
              line: new DataSet(),
            },
          }
        },
      );
    },
    // 关闭节点选择
    closeNodeChoosePop() {
      this.isFirstFlag = false;
      this.showNodePop = false;
    },
    // 打开节点选择
    chooseNodeClick() {
      this.showNodePop = true;
      this.oldNodeConfigInfo = this.currentNodeConfigInfo;
    },
    // 选择某个节点
    clickNode(record) {
      if (![ "ASN", "PLAN" ].includes(record.data.nodeTemplateCode)) {
        this.$notification.open({
          // eslint-disable-next-line rulesdir/check_modules
          message: "暂未开通，敬请期待！"
        });
        return;
      }
      // 如果选择了同一节点，不刷新页面
      if (this.oldNodeConfigInfo.nodeConfigId && this.oldNodeConfigInfo.nodeConfigId === record.data.nodeConfigId) {
        this.closeNodeChoosePop();
        return;
      }
      this.currentNodeConfigInfo = record.data;
      this.hdKey = this.currentNodeConfigInfo.nodeTemplateCode === "PLAN" && this.currentTab === "all" ? "right" : "left";
      this.currentTab = !isNil(this.currentTab) ? this.currentTab : this.currentNodeConfigInfo.permissionTabList[0];
      this.currentDs(this.currentNodeConfigInfo);
      this.setDataSetParams();
      this.closeNodeChoosePop();
      console.log(this.currentNodeConfigInfo, "当前节点信息");
    },
    // 选择某个单据
    clickListToDetail(record) {
      this.$loading.show();
      // 待创建 或 待确认/全部的按行 直接弹明细页面
      if ([ "affirm", "all" ].includes(this.currentTab) && this.hdKey === "right" || this.currentTab === "create") {
        this.$loading.hide();
        this.listPopup = this.$popup({
          showHeader: false,
          position: "right",
          content: <SrmForm
            style={{ padding: "0 15px" }}
            customizeType="detail"
            customizeCode={this.getCustomizeCode(`list${this.currentTab}`, this.hdKey, this.currentNodeConfigInfo)}
            dataSet={this.currentDataSet}
            buttons={this.getDetailButtons}
            columns={this.getListDetailColumns(this.currentNodeConfigInfo.nodeTemplateCode, this.currentTab)}
          />,
        });
        return;
      }
      // 跳转到明细
      this.$store.commit("DeliveryWorkbench/setDetailFlag", true);
      this.$store.commit("DeliveryWorkbench/setNodeTemplateCode", this.currentNodeConfigInfo.customerUnitCode);
      this.$router.push({
        name: "DeliveryWorkbenchDetail",
        query: {
          deliveryHeaderId: this.currentNodeConfigInfo.nodeTemplateCode === "ASN" ?
            record.data.asnHeaderId : record.data.planHeaderId,
          tab: this.currentTab,
          node: this.currentNodeConfigInfo.nodeTemplateCode,
          nodeConfigId: this.currentNodeConfigInfo.nodeConfigId,
          customizeUnitCode: this.currentNodeConfigInfo.customerUnitCode,
        }
      });
    },
    // tab切换
    onTabChange(index, oldIndex, code) {
      this.currentTab = code;
      this.hdKey = this.currentNodeConfigInfo.nodeTemplateCode === "PLAN" && code === "all" ? "right" : "left";
      this.$store.commit("DeliveryWorkbench/setTabPosition", this.currentTab);
      // 初始化（首次进入）页面不加载
      if (!this.isFirstFlag) {
        this.setDataSetParams();
      }
    },
    // 按单/按行
    changeTabLine(f) {
      this.hdKey = f;
      this.setDataSetParams();
      this.showDropDownAffirm = false;
      this.showDropDownAll = false;
    },
    // 切换dataSet
    setDataSetParams() {
      const configAbc = this.currentNodeConfigInfo?.customerUnitCode?.slice(-1);
      if ([ "all", "affirm" ].includes(this.currentTab)) {
        this.currentDataSet = this.listDataSet[this.currentNodeConfigInfo.nodeTemplateCode][this.currentTab][this.hdKey];
        this.currentDataSet.addQueryParameter("hdKey", this.hdKey);
        this.currentDataSet.addPathParameter("type", this.hdKey === "left" ? "header" : "line");
        this.currentDataSet.addQueryParameter("customizeUnitCode", `${this.currentNodeConfigInfo.customerUnitCode}.${this.currentTab.toUpperCase()}_${this.hdKey === "left" ? "D" : "H"},SMBL.DELIVERY_WORKBENCH.${this.currentNodeConfigInfo.nodeTemplateCode === "ASN" ? "ASN" : `${this.currentNodeConfigInfo.nodeTemplateCode}_${configAbc}`}.SEARCH.${this.currentTab.toUpperCase()}${this.hdKey === "left" ? "" : "_H"}`);
      } else {
        this.currentDataSet = this.listDataSet[this.currentNodeConfigInfo.nodeTemplateCode][this.currentTab];
        this.currentDataSet.addQueryParameter("customizeUnitCode", `${this.currentNodeConfigInfo.customerUnitCode}.${this.currentTab.toUpperCase()},SMBL.DELIVERY_WORKBENCH.${this.currentNodeConfigInfo.nodeTemplateCode === "ASN" ? "ASN" : `${this.currentNodeConfigInfo.nodeTemplateCode}_${configAbc}`}.SEARCH.${this.currentTab.toUpperCase()}`);
      }
      this.currentDataSet.addQueryParameter("nodeTemplateCode", this.currentNodeConfigInfo.nodeTemplateCode);
      this.currentDataSet.addQueryParameter("nodeConfigId", this.currentNodeConfigInfo.nodeConfigId);
      this.currentDataSet.addPathParameter("id", this.currentNodeConfigInfo.nodeConfigId);
      if (this.currentDataSet.toData() && this.currentDataSet.toData().length > 0) {
        return;
      }
      this.currentDataSet.refresh();
    }
  }
};
</script>

<style lang="stylus" scoped>

.receive-workplace-list-second-tab {
  width 375px;
  height 40px;

  .first-button {
    margin-top 8px;
    margin-left 15px;
    margin-right 8px;
  }

  .second-button {
    margin-top 8px;

  }

  .no-active {
    background white;
    color #333333;
  }
}
.filter-item-box {
  height 44px;
  border-bottom var(--split-line-color-primary) solid 1px;
  .item-box {
    text-align: center;
    font-size: 12px;
    line-height: 40px;
    color: var(--font-color-disable);
    >>> .srm-dropdown-button-text {
      font-size: 12px;
      color: var(--font-color-disable);
    }
    >>> .icon-caret-down {
      color: var(--font-color-disable);
    }
  }
  .item-box-checked {
    text-align: center;
    font-size: 12px;
    line-height: 40px;
    color: var(--font-color-primary);
    transition: font-size 0.1s ease;
    font-weight: bold;
    >>> .srm-dropdown-button-text {
      font-size: 12px;
      color: var(--font-color-primary);
      transition: font-size 0.1s ease;
      font-weight: bold;
    }
    >>> .icon-caret-down {
      color: var(--font-color-primary);
    }
    >>> .icon-caret-down::before {
      color: var(--font-color-primary);
    }
  }
}

.override-button {
  height: 54px !important;
  width: 100% !important;
  border-bottom: 1px solid var(--split-line-color-primary);
}

.no-active {
  background white;
  color #333333;
}

.round-btn-box {
  padding-bottom 80px;
  padding-right 15px;
  .round-btn {
    line-height normal;
    pointer-events auto;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.06);
    border: #FFFFFF solid 1px;
    .srm-icon {
      font-size 28px;
    }
  }
}

.overridePop {
  margin-bottom: 12px;
  >>> .srm-list-item-card {
    background: #F6F6F6;
    border-radius: 8px;
    width: calc(100vw - 30px);
    margin: 0px 15px 12px 15px;
    padding: 16px 15px 16px 15px;
    border-bottom: 0px solid var(--background-color-empty-second);
  }
  >>> .srm-check-box {
    &:first-child{
      margin-top: 16px;
    }
  }
  >>> .customize-item {
    margin-bottom: 4px !important;
    font-weight: bold;
  }
}
.overrideCus {
  position: absolute;
  left: 100px;
  padding-right: 100px;
}
</style>