<!--
 * @Description: 协议变更内容
 * @Date: 2023-03-07 10:26:55
 * @Author: MYT<yitian.mao@going-link.com>
 * @Version: 1.0.0
 * @Copyright: Copyright (c) 2021, ZhenYun
-->
<template>
  <div>
    <div v-if="JSON.stringify(dataHeader) === '{}' && !upDatePartneres.size" class="noContent">
      <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
    </div>
    <div v-else>
      <div @click="showBaseChangeDetail">
        <customize
          :columns="fieldsColumn"
          :need-padding="true"
          type="list"
          :data-source="dataHeader"/>
      </div>
      <div v-for="[key, val] in upDatePartneres.entries()" :key="key">
        <div @click="showLineDetail(val)">
          <customize
            :columns="getLineColumns(val)"
            :need-padding="true"
            type="list"
            :data-source="val"/>
        </div>
      </div>
    </div>
    <!-- 基础信息变更详情弹框 -->
    <srm-popup
      :visible.sync="baseInfoPopupFlag"
      position="right"
      :title="
        $T('spcm.starbucks.view.message.title.baseChangeDetail').$D(
          '基础信息变更详情'
        )
      "
      :show-back="true"
      :show-close="false"
      width="100%">
      <div style="margin-top: 8px; background: var(--background-color-empty)">
        <customize-detail
          :need-padding="true"
          :columns="showBaseChangeColumn"
          :data-source="dataHeader"/>
      </div>
    </srm-popup>
    <!-- 查看多选lov详情弹框 -->
    <srm-popup
      :visible.sync="objectDetailFlag"
      position="right"
      :title="popTitle"
      :show-back="true"
      :show-close="false"
      width="100%">
      <srm-collapse-item v-model="showOld" name="1">
        <span class="change-title">
          {{ $T("spcm.common.view.title.beforeChange").$D("变更前") }}
        </span>
        <div slot="content" class="change-content">
          <div v-if="isStr(changeDetail.old)">{{ changeDetail.old }}</div>
          <div v-for="(item, index) in changeDetail.old" v-else :key="index">
            {{ item }}
          </div>
        </div>
      </srm-collapse-item>
      <srm-collapse-item v-model="showNew" name="2">
        <span class="change-title">
          {{ $T("spcm.common.view.title.afterChange").$D("变更后") }}
        </span>
        <div slot="content" class="change-content">
          <div v-if="isStr(changeDetail.new)">{{ changeDetail.new }}</div>
          <div v-for="(item, index) in changeDetail.new" v-else :key="index" flex="2">
            {{ item }}
          </div>
        </div>
      </srm-collapse-item>
    </srm-popup>
    <!-- 二级供应商/经销商变更信息 -->
    <srm-popup
      :visible.sync="lineDetailPopupFlag"
      position="right"
      :title="
        $T('spcm.common.view.message.title.contractSpartnerInformation').$D(
          '二级供应商/经销商'
        )
      "
      :show-back="true"
      :show-close="false"
      width="100%">
      <div style="margin-top: 8px; background: var(--background-color-empty)">
        <customize-detail
          :need-padding="true"
          :columns="getLineDetailColumns()"
          :data-source="lineDetail"/>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import { unionBy, isString } from "lodash";
import moment from "moment";
import { fetchChangeField, getChangeContent, getUICustomizeApi } from "../api";
// import { yesOrNoRenderer } from "@/utils/renderer.js";

const headerCode = "SPCM.PURCHASE_CONTRACT_MAINTAIN.CHANGED.HEADER";
const partCode = "SPCM.PURCHASE_CONTRACT_MAINTAIN.PARTNER.READONLY";

const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";

export default {
  modules: [ "spcm.purchaseContractView", "spcm.starbucks", "spcm.common", "smbl.common", "spcm.contractmoney", "entity.company", "hzero.common", "entity.roles", "entity.business", "entity.organization", "entity.supplier", "hipspfm.common" ],
  name: "ChangeContent",
  props: {
    pcHeaderId: {
      type: String,
    },
    baseInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showOld: true,
      showNew: true,
      fieldsColumn: [],
      showBaseChangeColumn: [],
      dataHeader: {},
      objectDetailFlag: false,
      baseInfoPopupFlag: false,
      lineDetailPopupFlag: false,
      popTitle: null,
      changeDetail: {},
      lineDetail: {},
      upDatePartneres: new Map(),
      statusMap: {
        UPDATE: this.$T("hzero.common.button.update").$D("修改"),
        CREATE: this.$T("hzero.common.button.add").$D("新增"),
        DELETE: this.$T("hzero.common.button.delete").$D("删除"),
      },
    };
  },
  computed: {},
  mounted() {
    this.getFieldList();
  },
  created() {},
  methods: {
    // 获得个性化和标准字段的合集，保证字段的多语言显示
    async getPartField() {
      const fieldConfig =
        await getUICustomizeApi([ headerCode, partCode ]) || {};
      const list = [
        {
          fieldCode: "pcName",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.pcName").$D("协议名称"),
        },
        {
          fieldCode: "pcNum",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.pcNum").$D("协议编号"),
        },
        {
          fieldCode: "creationDate",
          fieldType: "dateTime",
          fieldName: this.$T("hzero.common.date.creation").$D("创建时间"),
        },
        {
          fieldCode: "taxIncludeAmount",
          fieldType: "currency",
          fieldName: this.$T("spcm.common.model.amount").$D("协议总额"),
        },
        {
          fieldCode: "createByRealName",
          fieldType: "string",
          fieldName: this.$T("entity.roles.creator").$D("创建人"),
        },
        {
          fieldCode: "pcKindCode",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.pcKindCode").$D("协议性质"),
          lookupCode: "SPCM.CONTRACT.KIND",
        },
        {
          fieldCode: "companyName",
          fieldType: "object",
          fieldName: this.$T("entity.company.tag").$D("公司"),
          lovCode: "SPCM.USER_AUTH.COMPANY",
        },
        {
          fieldCode: "ouName",
          fieldType: "object",
          fieldName: this.$T("entity.business.tag").$D("业务实体"),
          lovCode: "SPFM.USER_AUTH.OU",
        },
        {
          fieldCode: "purchaseOrgName",
          fieldType: "object",
          fieldName: this.$T("entity.organization.class.purchase").$D(
            "采购组织"
          ),
          lovCode: "SPFM.USER_AUTH.PURORG",
        },
        {
          fieldCode: "purchaseAgentName",
          fieldType: "object",
          fieldName: this.$T("spcm.common.model.common.agentName").$D("采购员"),
          lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
        },
        {
          fieldCode: "pcTypeName",
          fieldType: "object",
          fieldName: this.$T("spcm.common.model.pcType").$D("协议类型"),
          lovCode: "SPCM.PC_TYPE",
        },
        {
          fieldCode: "templateName",
          fieldType: "object",
          fieldName: this.$T("spcm.common.model.pcTemplateId").$D("协议模板"),
          lovCode: "SPCM.PC_TEMPLATE",
        },
        {
          fieldCode: "supplierCompanyName",
          fieldType: "object",
          fieldName: this.$T("entity.supplier.tag").$D("供应商"),
          lovCode: "SPCM.AUTH_SUPPLIER_LIFE_CYCLE",
        },
        {
          fieldCode: "signEffectFlag",
          fieldType: "boolean",
          fieldName: this.$T("spcm.common.model.signedEffect").$D("签署即生效"),
        },
        {
          fieldCode: "effectiveTime",
          fieldType: "currency",
          fieldName: this.$T("spcm.common.model.effectiveTime").$D("有效时长"),
        },
        {
          fieldCode: "acceptType",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.checkType").$D("验收类型"),
          lookupCode: "SPCM.ACCEPT_TYPE",
        },
        {
          fieldCode: "startDateActive",
          fieldType: "date",
          fieldName: this.$T("spcm.common.model.startDateActive").$D(
            "协议起始日期"
          ),
        },
        {
          fieldCode: "endDateActive",
          fieldType: "date",
          fieldName: this.$T("spcm.common.model.endDateActive").$D(
            "协议终止日期"
          ),
        },
        {
          fieldCode: "mainPcNum",
          fieldType: "object",
          fieldName: this.$T("spcm.common.model.mainContractId").$D("主协议"),
        },
        {
          fieldCode: "overseasProcurement",
          fieldType: "boolean",
          fieldName: this.$T("spcm.common.model.overseasProcurement").$D(
            "境外采购"
          ),
        },
        {
          fieldCode: "archiveCode",
          fieldType: "string",
          fieldName: this.$T("spcm.common.archiveCode").$D("归档码"),
        },
        {
          fieldCode: "pcSourceCode",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.pcSourceCode").$D("协议来源"),
        },
        {
          fieldCode: "globalFlag",
          fieldType: "boolean",
          fieldName: this.$T("spcm.common.model.common.globalFlag").$D(
            "是否全局协议"
          ),
        },
        {
          fieldCode: "contractPurpose",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.contractPurpose").$D(
            "协议用途"
          ),
        },
        {
          fieldCode: "signDescription",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.signDescription").$D(
            "签订原因"
          ),
        },
        {
          fieldCode: "signAddress",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.signAddress").$D("签署地点"),
        },
        {
          fieldCode: "terminationReason",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.terminationReason").$D(
            "终止原因"
          ),
        },
        {
          fieldCode: "termsName",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.termId").$D("付款条款"),
        },
        {
          fieldCode: "unitName",
          fieldType: "object",
          fieldName: this.$T("spcm.common.model.common.unitId").$D("所属部门"),
          lovCode: "SPRM.USER_UNIT",
        },
        {
          fieldCode: "internalPostil",
          fieldType: "string",
          fieldName: this.$T("spcm.common.innerRemark").$D("内部批注"),
        },
        {
          fieldCode: "remark",
          fieldType: "string",
          fieldName: this.$T("hzero.common.remark").$D("备注"),
        },
      ];
      const partlist = [
        {
          fieldCode: "partnerTypeName",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.partnerTypeName").$D(
            "伙伴类型名称"
          ),
        },
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeCode").$D(
            "伙伴类型编码"
          ),
          fieldCode: "attributeVarchar14",
          fieldType: "string",
        },
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeCode").$D(
            "伙伴类型编码"
          ),
          fieldCode: "partnerTypeCode",
          fieldType: "string",
        },
        {
          fieldCode: "companyIdLov",
          fieldType: "object",
          fieldName: this.$T("entity.company.code").$D("公司编码"),
        },
        {
          fieldCode: "companyId",
          bind: "companyIdLov.companyId",
        },
        {
          fieldCode: "companyNum",
          fieldType: "string",
          fieldName: this.$T("entity.company.code").$D("公司编码"),
        },
        {
          fieldCode: "companyName",
          fieldType: "string",
          fieldName: this.$T("entity.company.name").$D("公司名称"),
        },
        {
          fieldName: this.$T("spcm.common.model.common.unifiedSocialCode").$D(
            "统一社会信用代码"
          ),
          fieldCode: "unifiedSocialCode",
          fieldType: "string",
        },
        {
          fieldName: this.$T("spcm.common.model.common.postCode").$D("邮编"),
          fieldCode: "postCode",
          fieldType: "string",
        },
        {
          fieldCode: "legalRepName",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D(
            "代表人"
          ),
        },
        {
          fieldCode: "corporateDuty",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.corporateDuty").$D(
            "法人职务"
          ),
        },
        {
          fieldCode: "address",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
        },
        {
          fieldCode: "contacts",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.contacts").$D("联系人"),
        },
        {
          fieldCode: "telNum",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系电话"),
        },
        {
          fieldCode: "faxes",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.faxes").$D("传真"),
        },
        {
          fieldCode: "mail",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.mail").$D("邮箱"),
        },
        {
          fieldCode: "bankName",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.bankName").$D(
            "开户行名称"
          ),
        },
        {
          fieldCode: "bankAccountName",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.bankAccountName").$D(
            "账户名称"
          ),
        },
        {
          fieldCode: "bankAccountNumLov",
          fieldType: "object",
          lovCode: "SSLM.MASTER_DATA.SUPPLIER_BANK_ACCOUNT",
          fieldName: this.$T("spcm.common.model.common.bankAccountNum").$D(
            "银行账号"
          ),
        },
        {
          fieldCode: "bankAccountNum",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.bankAccountNum").$D(
            "银行账号"
          ),
        },
        {
          fieldCode: "bankAddress",
          fieldType: "string",
          fieldName: this.$T("spcm.common.model.common.bankAddress").$D(
            "开户行地址"
          ),
        },
        {
          fieldCode: "remark",
          fieldType: "string",
          fieldName: this.$T("hzero.common.explain").$D("说明"),
        },
      ];
      const headerListMap = new Map();
      unionBy(list, fieldConfig[headerCode]?.fields, "fieldCode").forEach(
        (item) => {
          headerListMap.set(item.fieldCode, item);
        }
      );
      const partListMap = new Map();
      unionBy(partlist, fieldConfig[partCode]?.fields, "fieldCode").forEach(
        (item) => {
          partListMap.set(item.fieldCode, item);
        }
      );
      return { partListMap, headerListMap };
    },
    // 获取头行配置表字段，头行变更数据
    async getFieldList() {
      const res = await fetchChangeField();
      const changeRes = await getChangeContent(this.pcHeaderId);
      if (res?.content?.length && changeRes?.content?.length) {
        const { partListMap, headerListMap } = await this.getPartField();
        const {
          newPcHeader = {},
          oldPcHeader = {},
          oldPartneres = [],
          newPartneres = [],
        } = JSON.parse(changeRes.content[0]?.contract);
        // 处理协议头变更数据
        this.getHeaderInfo(newPcHeader, oldPcHeader, res?.content, headerListMap);
        // 处理二级供应商/经销商
        this.getPartInfo(newPartneres, oldPartneres, partListMap);
      }
    },
    // 处理协议头变更数据
    getHeaderInfo(newPcHeader, oldPcHeader, resFields, headerListMap) {
      let headerInfo = {};
      let fieldsCol = [];
      const fields = Object.keys(newPcHeader);
      resFields?.forEach(({ fieldCode, fieldName }) => {
        // 本次合同增量（attributeDecimal14）中的变更记录调整为：当补充协议标识=1且协议头attributeVarchar31=1显示
        if (this.baseInfo.attributeVarchar31 !== "1" && fieldCode === "attributeDecimal14") {
          return;
        }
        if (fields.includes(fieldCode)) {
          Object.assign(headerInfo, {
            [fieldCode]: {
              new: newPcHeader[`${fieldCode}Meaning`] || newPcHeader[fieldCode],
              old: oldPcHeader[`${fieldCode}Meaning`] || oldPcHeader[fieldCode],
            },
          });
          fieldsCol.push(
            this.getColRender({
              fieldCode,
              fieldName,
              ...headerListMap.get(fieldCode),
            })
          );
        }
      });
      this.dataHeader = { ...this.baseInfo, ...headerInfo };
      this.showBaseChangeColumn = fieldsCol.slice(3);
      this.fieldsColumn = [
        {
          fieldName: this.$T("spcm.purchaseContractView.model.changeType").$D(
            "变更类型"
          ),
          fieldCode: "attributeVarchar31",
          render: (val) =>
            <srm-flex justify="between" class="card-title-container">
              <div class="title">{this.renderTag(val)}</div>
              {this.showBaseChangeColumn.length > 0 ?
                <div class="arrow-icon srm-icon icon-chevron-right" /> :
                null}
            </srm-flex>
          ,
        },
        {
          fieldName: this.$T("spcm.starbucks.createByRealName").$D("申请人"),
          fieldCode: "createByRealName",
        },
      ].concat(fieldsCol.slice(0, 3));
    },
    // 处理二级供应商/经销商信息
    getPartInfo(oldPartneres, newPartneres, partListMap) {
      [ ...oldPartneres, ...newPartneres ].forEach((item) => {
        if (!item.objectFlag) {
          return;
        }
        const cols = [
          {
            fieldCode: "companyName",
            fieldType: "EMPTY",
            render: (val, record) =>
              <srm-flex justify="between" class="card-title-container">
                <div class="title">
                  <span>{this.statusMap[record?.objectFlag]}</span>
                  <span>{record.partnerTypeName}</span>
                  <span>{val}</span>
                </div>
                {record?.objectFlag === "UPDATE" ?
                  <div class="arrow-icon srm-icon icon-chevron-right" /> :
                  null}
              </srm-flex>
            ,
          },
        ];
        if (item.objectFlag && item.objectFlag !== "UPDATE") {
          this.upDatePartneres.set(item.partnerId, { ...item, cols });
        } else if (this.upDatePartneres.get(item.partnerId)) {
          const oldItem = this.upDatePartneres.get(item.partnerId);
          const newItem = {};
          item?.changeColumnList?.split(",").forEach((fieldCode) => {
            cols.push(
              this.getColRender({ fieldCode, ...partListMap.get(fieldCode) })
            );
            Object.assign(newItem, {
              companyName: item.companyName,
              partnerTypeName: item.partnerTypeName,
              objectFlag: item.objectFlag,
              [fieldCode]: {
                new: item[`${fieldCode}Meaning`] || item[fieldCode],
                old: oldItem[`${fieldCode}Meaning`] || oldItem[fieldCode],
              },
            });
          });
          this.upDatePartneres.set(
            item.partnerId,
            Object.assign(newItem, { cols })
          );
        } else {
          this.upDatePartneres.set(item.partnerId, item);
        }
      });
    },
    // 查看Lov多指信息
    showObjectDetail(val, fieldName) {
      this.objectDetailFlag = true;
      this.popTitle = fieldName;
      this.changeDetail = val;
    },
    // 查看更多头变更数据
    showBaseChangeDetail() {
      if (this.showBaseChangeColumn.length) {
        this.baseInfoPopupFlag = true;
      }
    },
    // 获取单元信息
    getColRender({ fieldCode, fieldName, fieldType, dateFormat }) {
      return {
        fieldCode,
        fieldName,
        render: (val) => {
          if (Object.prototype.toString.call(val.new) === "[object Array]") {
            // 数组类型数据显示
          } else if (fieldCode === "attributeVarchar11") {
            return (
              <div
                style="color: var(--color-success);"
                onClick={(e) => {
                  e.stopPropagation();
                  this.showObjectDetail(val, fieldName);
                }}
              >
                {this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
              </div>
            );
          } else {
            let oldV = val?.old;
            let newV = val?.new;
            // if (
            //   fieldCode.includes("attributeTinyint") &&
            //   fieldType === "SELECT"
            // ) {
            //   // 是/否
            //   oldV = yesOrNoRenderer(val?.old);
            //   newV = yesOrNoRenderer(val?.new);
            // } else
            if (fieldType?.toUpperCase().includes("DATE")) {
              // 日期类型
              oldV = oldV ?
                moment(oldV).format(dateFormat || DEFAULT_DATE_FORMAT) :
                null;
              newV = newV ?
                moment(newV).format(dateFormat || DEFAULT_DATE_FORMAT) :
                null;
            } else if (
              fieldType?.toUpperCase() === "CURRENCY" ||
              fieldName.includes("金额")
            ) {
              oldV = SrmUtil.getNumberLocalized(val?.old || "-");
              newV = SrmUtil.getNumberLocalized(val?.new || "-");
            }
            return (
              <div class="change-transfer">
                {this.$T("spcm.starbucks.view.changeTransfer.from").$D("由")}
                <span>{oldV || "-"}</span>
                {this.$T("spcm.starbucks.view.changeTransfer.to").$D("变更为")}
                <span>{newV || "-"}</span>
              </div>
            );
          }
        },
      };
    },
    // 查看二级供应商/经销商行更多变更数据
    showLineDetail(val) {
      this.lineDetailPopupFlag = true;
      this.lineDetail = val;
    },
    getLineColumns(val) {
      return val?.cols?.slice(0, 1);
    },
    // 二级供应商/经销商变更详情弹框字段
    getLineDetailColumns() {
      return this.lineDetail?.cols?.slice(1);
    },
    isStr(val) {
      return isString(val);
    },
    renderTag(v) {
      const { supplementFlag } = this.baseInfo;
      switch (v) {
      case "1":
        return (
          <srm-tag color="yellow">
            {this.$T("spcm.starbucks.msg.amountChange").$D(
              "协议变更-合同金额变更"
            )}
          </srm-tag>
        );
      case "3":
        return (
          <srm-tag color="purple">
            {this.$T("spcm.starbucks.msg.legalChange").$D(
              "协议变更-适用法人公司变更"
            )}
          </srm-tag>
        );
      case "4":
        return (
          <srm-tag color="pink">
            {this.$T("spcm.starbucks.msg.fieldChange").$D(
              "协议变更-结构字段变更"
            )}
          </srm-tag>
        );
      case "5":
        return (
          <srm-tag color="cyan">
            {this.$T("spcm.starbucks.msg.bidChange").$D(
              "协议变更-协议标的修正"
            )}
          </srm-tag>
        );
      default:
        return supplementFlag ?
          <srm-tag color="pink">
            {this.$T("spcm.starbucks.msg.termsChange").$D(
              "协议变更-条款变更"
            )}
          </srm-tag> :
          null;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.change-transfer {
  span {
    font-weight: 600;
    padding: 0 5px;
  }
}
.change-title {
  font-weight: 600;
}
.change-content {
  padding: 10px 15px;
  flex: 1;
  div:not(:last-child) {
    margin-bottom: 10px;
  }
}

.card-title-container {
  overflow: hidden;
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .bold-title {
    font-size: 14px;
    font-weight: bold;
  }
  span:not(:first-child) {
    padding: 0 5px;
  }
}

.arrow-icon {
  width: 16px;
  height: 16px;
  background-color: var(--color-ghost-success);
  border-radius: 8px;
  line-height: 16px;
  font-size: 14px;
  color: var(--color-success);
  text-align: center;
  flex-shrink: 0;
}
</style>
