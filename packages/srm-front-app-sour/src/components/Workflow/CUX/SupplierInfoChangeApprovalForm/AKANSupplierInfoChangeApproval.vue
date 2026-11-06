<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-scroll-tab class="content" customize-code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE.TBAS">
      <div class="change-btn">
        <button-switch
          v-model="changeStatus"
          :btn-arr="[
            $T('ssrc.supplyInfoChange.view.title.updateAfter').$D('变更后'),
            $T('ssrc.supplyInfoChange.view.title.updateBefore').$D('变更前'),
          ]"
          @input="buttonswitchChange"/>
      </div>
      <!-- 基本信息 -->
      <srm-scroll-tab-item
        code="basicInfo"
        :label="$T('ssrc.supplyInfoChange.view.title.basicInfo').$D('基本信息')">
        <div class="content-item">
          <div class="card">
            <customize
              :columns="getBasicColums"
              :data-source="basicInfo"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_BASIC"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 登记信息 -->
      <srm-scroll-tab-item
        code="comBasicReq"
        :label="
          $T('ssrc.supplyInfoChange.view.title.registerInfo').$D('登记信息')
        ">
        <div class="content-item">
          <div class="card">
            <customize
              :columns="getRegisterInfoColums"
              :data-source="registerInfo"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_REGISTER_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 业务信息 -->
      <srm-scroll-tab-item
        code="comBusinessReqDTO"
        :label="
          $T('ssrc.supplyInfoChange.view.title.businessInfo').$D('业务信息')
        ">
        <div class="content-item">
          <div class="card">
            <customize
              :columns="getBusinessInfoColums"
              :data-source="businessInfo"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_BUSINESS_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 联系人信息 -->
      <srm-scroll-tab-item
        code="comContactsReqs"
        :label="
          $T('ssrc.supplyInfoChange.view.title.contactInfo').$D('联系人信息')
        ">
        <div class="content-item">
          <div
            v-for="(contact, key) in contactInfoList"
            :key="key"
            class="card has-border">
            <customize
              :columns="getContactInfoColums"
              :data-source="contact"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_CONTACT_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 地址信息 -->
      <srm-scroll-tab-item
        code="comAddressReqs"
        :label="
          $T('ssrc.supplyInfoChange.view.title.addressInfo').$D('地址信息')
        ">
        <div class="content-item">
          <div
            v-for="(address, key) in addressInfoList"
            :key="key"
            class="card has-border">
            <customize
              :columns="getAddressInfoColums"
              :data-source="address"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_ADDRESS_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 银行信息 -->
      <srm-scroll-tab-item
        code="comBankAccReqs"
        :label="$T('ssrc.supplyInfoChange.view.title.bankInfo').$D('银行信息')">
        <div class="content-item">
          <div
            v-for="(bankInfo, key) in bankInfoList"
            :key="key"
            class="card has-border">
            <customize
              :columns="getBankInfoColums"
              :data-source="bankInfo"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_BANK_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 开票信息 -->
      <srm-scroll-tab-item
        code="supInvoiceReq"
        :label="
          $T('ssrc.supplyInfoChange.view.title.invoiceInfo').$D('开票信息')
        ">
        <div class="content-item">
          <div class="card">
            <customize
              :columns="getInvoiceInfoColums"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_INVOICE_INFO"
              :data-source="invoiceInfo"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 附件信息 -->
      <srm-scroll-tab-item
        code="supAttachmentReqs"
        :label="
          $T('ssrc.supplyInfoChange.view.title.attachmentInfo').$D('附件信息')
        ">
        <div class="content-item">
          <div
            v-for="(attachmentInfo, key) in attachmentInfoList"
            :key="key"
            class="card has-border">
            <customize
              :columns="getAttachmentInfoColums"
              :data-source="attachmentInfo"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_ATTACHMENT_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 供货能力清单信息 -->
      <srm-scroll-tab-item
        code="supChangeAbilityLn"
        :label="
          $T('ssrc.supplyInfoChange.view.title.supplyAbilityUpdate').$D(
            '供货能力清单'
          )
        ">
        <div class="content-item">
          <div
            v-for="(supplyAbilityUpdateInfo, key) in supplyAbilityInfoList"
            :key="key"
            class="card has-border">
            <customize
              :columns="getSupplyUpdateAbilityInfoColums"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_SUPPLY_ABILITY"
              :data-source="supplyAbilityUpdateInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 供应商分类信息 -->
      <srm-scroll-tab-item
        code="supChangeCate"
        :label="
          $T('ssrc.supplyInfoChange.view.title.supplyCategory').$D('供应商分类')
        ">
        <div class="content-item">
          <div
            v-for="(supplyCategory, key) in supplyCategoryInfoList"
            :key="key"
            class="card has-border">
            <customize
              :columns="getSupplyCategoryInfoColums"
              :data-source="supplyCategory"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_CATEGORY"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 供应商采购/财务信息 -->
      <srm-scroll-tab-item
        v-if="systemType === 'SAP' || systemType === 'BOTH'"
        code="purchaseInfo"
        :label="
          $T('ssrc.supplyInfoChange.view.title.purchaseFinance').$D(
            '采购/财务信息'
          )
        ">
        <div class="content-item">
          <div class="card">
            <customize
              :columns="getPurchaseFinanceInfoColums"
              :data-source="purchaseFinanceInfo"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_PURCHASE_FINANCE"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 地点层信息 -->
      <srm-scroll-tab-item
        v-if="systemType === 'EBS' || systemType === 'BOTH'"
        code="supChangeEbsAdds"
        :label="
          $T('ssrc.supplyInfoChange.view.title.siteLayer').$D('地点层信息')
        ">
        <div class="content-item">
          <div
            v-for="(siteLayer, key) in siteLayerList"
            :key="key"
            class="card has-border">
            <customize
              :columns="getSiteLayerInfoColums"
              :data-source="siteLayer"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_CATEGORY"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 其他信息 -->
      <srm-scroll-tab-item
        code="supChangeOther"
        :label="$T('ssrc.supplyInfoChange.view.title.otherInfo').$D('其他信息')">
        <div class="content-item">
          <div class="card">
            <customize
              :columns="getOtherInfoColums"
              code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_OTHER_INFO"
              :data-source="otherInfo"/>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup
      :visible.sync="isLineInfo"
      :title="$T('ssrc.supplyInfoChange.view.title.lineInfo').$D('行信息')"
      height="100%"
      position="right"
      show-back>
      <div class="content-item">
        <div
          v-for="(lineInfo, key) in lineInfoList"
          :key="key"
          class="card has-border">
          <customize
            :columns="getPurchaseFinanceLineInfoColums"
            code="SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_PURCHASE_FINANCE_LINEINFO"
            :data-source="lineInfo"
            unit-type="FORM"/>
        </div>
      </div>
    </srm-popup>
    <!-- OU层信息pop -->
    <srm-popup
      :visible.sync="isOoupop"
      :title="$T('ssrc.supplyInfoChange.view.title.ouInfo').$D('OU层信息')"
      height="100%"
      position="right"
      show-back>
      <div class="content-item">
        <div
          v-for="(oulayerInfo, key) in oulayerInfoList"
          :key="key"
          class="card has-border">
          <customize
            :columns="getOUInfoColums"
            code="SMBL.WORKFLOW.SUPPLIER_CHANGE_INFO_OULAYER_INFO"
            :data-source="oulayerInfo"
            unit-type="FORM"/>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import ButtonSwitch from "@/components/V5/ButtonSwitch";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import {
  getSupplyBasicInfoApi,
  getSupplyRegisterInfoApi,
  getBusinessInfoApi,
  getContactInfoListApi,
  // getContactInfoListApiB,
  getAddressInfoListApi,
  getBankInfoListApi,
  getInvoiceInfoApi,
  getAttachmentInfoApi,
  getSupplyAbilityInfoApi,
  getSupplyCategoryInfoApi,
  // getOtherInfoApi,
  getPurchaseFinanceInfoApi,
  getPurchaseFinanceLineInfoApi,
  getSiteLayerInfoApi,
  getOuLayerInfoApi,
  getSupplyAbilityAttachmentInfoApi,
  queryInvestigateConfigApi,
  queryInvestigateApi,
} from "../../SupplierInfoChangeApprovalForm/api/index";
import { getOtherInfoApi } from "./api/akanApi";
import { dealConfigData, getInvestigateColums } from "../../SupplierInfoChangeApprovalForm/utils/investigate";
export default {
  modules: [
    "mallf.common",
    "spfm.enterprise",
    "scux.supplierOpenAccount",
    "scux.supplierLongList",
    "hipspfm.common",
    "sslm.supplierDetail",
    "smbl.common",
    "scux.businessInfo",
    "sslm.siteInvestigateReport",
    "spfm.partnership",
    "srmScux.companySubAccount",
    "scux.supplierPackingNotice",
    "hpfm.bank",
    "sslm.pointExamine",
    "spfm.bank",
    "sslm.supplierInform",
    "sslm.supplierWarehouse",
    "spfm.certificateAuthority",
    "ssrc.supplyInfoChange",
    "ssrc.inquiryHall",
    "scux.commercialTermsPre",
    "scux.purchaseRecordApproval",
    "scux.listOfReviewItems",
    "scux.upgradeOrderCreate",
  ],
  name: "AKANSupplierInfoChangeApproval",
  components: {
    ButtonSwitch,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      changeStatus: 1,
      basicInfo: {}, //基本信息
      registerInfo: {}, //登记信息
      businessInfo: {}, //业务信息
      contactInfoList: [], //联系人信息
      addressInfoList: [], //地址信息
      bankInfoList: [], //银行信息
      invoiceInfo: {}, //开票信息
      attachmentInfoList: [], //附件信息列表
      supplyAbilityInfoList: [], //供货能力清单信息列表
      supplyCategoryInfoList: [], //供应商类别列表
      otherInfo: {}, //其他信息
      isLineInfo: false,
      isOoupop: false,
      purchaseFinanceInfo: {}, //采购财务信息
      lineInfoList: [], //行信息列表
      siteLayerList: [], //地点层列表
      oulayerInfoList: [], //oou层信息列表
      status: "new",
      fileArr: [],
      systemType: "",
      dataSource: 2, // 接口公用，区分企业信息变更（1），供应商信息变更（2）
      configList:[], // 调查表配置
    };
  },
  computed: {
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.changeReqNumber").$D("申请单号"),
          fieldCode: "changeReqNumber",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.reqStatusMeaning").$D("申请状态"),
          fieldCode: "reqStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.changeLevelMeaning").$D("变更维度"),
          fieldCode: "changeLevelMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.supplierCompanyNum").$D("供应商编码"),
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.supplierName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          render: (val) =>
            <span>
              {val}
            </span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.createUserRealName").$D("创建人"),
          fieldCode: "createUserRealName",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.unitName").$D("所属部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.submitDate").$D("提交日期"),
          fieldCode: "submitDate",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.purchaseAgentNameJoint").$D("采购员"),
          fieldCode: "purchaseAgentNameJoint",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.remark").$D("变更备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.attachmentUuid").$D("变更附件"),
          fieldCode: "attachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-icon={false}
                color="#276EF1"
                title={this.$T("ssrc.supplyInfoChange.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "ssrc.supplyInfoChange.view.button.uploadview"
                ).$D("查看")}
              />
            </div>
          ,
        },
      ];

      return columns;
    },
    // 登记信息
    getRegisterInfoColums() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.domesticForeignRelation").$D("认证地区"),
          fieldCode: "domesticForeignRelation",
          render: (val, record) => record.isOld &&
              record.domesticForeignRelationFlag === "UPDATE" ?
            <span style="color:red">
              {val ?
                this.$T(
                  "ssrc.supplyInfoChange.model.domesticInstitution"
                ).$D("境内机构") :
                this.$T(
                  "ssrc.supplyInfoChange.model.overseasInstitution"
                ).$D("境外机构")}
            </span> :
            <span>
              {val ?
                this.$T(
                  "ssrc.supplyInfoChange.model.domesticInstitution"
                ).$D("境内机构") :
                this.$T(
                  "ssrc.supplyInfoChange.model.overseasInstitution"
                ).$D("境外机构")}
            </span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.unifiedSocialCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
          render: (val, record) => record.isOld && record.unifiedSocialCodeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.businessRegistrationNumber").$D("商业注册登记号"),
          fieldCode: "businessRegistrationNumber",
          visible: !this.registerInfo.domesticForeignRelation,
          render: (val, record) => record.isOld &&
              record.businessRegistrationNumberFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.companyName").$D("企业名称"),
          fieldCode: "companyName",
          render: (val, record) => record.isOld && record.companyNameFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.companyEnglishName").$D("英文名称"),
          fieldCode: "companyEnglishName",
          render: (val, record) => record.isOld &&
              record.companyEnglishNameFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.shortName").$D("企业简称"),
          fieldCode: "shortName",
          render: (val, record) => record.isOld && record.shortNameFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.organizingInstitutionCode").$D("组织机构代码"),
          fieldCode: "organizingInstitutionCode",
          render: (val, record) => record.isOld &&
              record.organizingInstitutionCodeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.dunsCode").$D("邓白氏编码"),
          fieldCode: "dunsCode",
          render: (val, record) => record.isOld && record.dunsCodeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.companyTypeMeaning").$D("企业类型"),
          fieldCode: "companyTypeMeaning",
          render: (val, record) => record.isOld && record.companyTypeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.registeredAddress").$D("注册地址"),
          fieldCode: "registeredAddress",
          render: (val, record) => record.isOld &&
              record.registeredRegionNameFlag === "UPDATE" ?
            <span style="color:red">
              {record.registeredCountryName} {record.registeredRegionName}
            </span> :
            <span>
              {record.registeredCountryName} {record.registeredRegionName}
            </span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.taxpayerTypeMeaning").$D("纳税人标识"),
          fieldCode: "taxpayerTypeMeaning",
          render: (val, record) => record.isOld && record.taxpayerTypeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.addressDetail").$D("详细地址"),
          fieldCode: "addressDetail",
          render: (val, record) => record.isOld && record.addressDetailFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.legalRepName").$D("法定代表人"),
          fieldCode: "legalRepName",
          render: (val, record) => record.isOld && record.legalRepNameFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.registeredCapital").$D("注册资本(万)"),
          fieldCode: "registeredCapital",
          render: (val, record) => record.isOld && record.registeredCapitalFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.currencyName").$D("注册资本币种"),
          fieldCode: "currencyName",
          render: (val, record) => record.isOld && record.currencyNameFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.buildDate").$D("成立日期"),
          fieldCode: "buildDate",
          render: (val, record) => record.isOld && record.buildDateFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.licenceEndDate").$D("营业期限"),
          fieldCode: "licenceEndDate",
          render: (val, record) => record.isOld && record.licenceEndDateFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.longTermFlag").$D("长期"),
          fieldCode: "longTermFlag",
          render: (val, record) => record.isOld && record.longTermFlagFlag === "UPDATE" ?
            <span style="color:red">
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span> :
            <span>
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.businessScope").$D("经营范围"),
          fieldCode: "businessScope",
          render: (val, record) => record.isOld && record.businessScopeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.licenceUrl").$D("营业执照"),
          fieldCode: "licenceUrl",
          render: (val, record) =>
            <div
              style="color: var(--color-other-default-b); font-size: 14px;"
              on-click={(e) => {
                e.stopPropagation();
                this.showLicense(val, record);
              }}
            >
              {this.$T("ssrc.supplyInfoChange.model.viewImg").$D("查看图片")}
            </div>
          ,
        },
      ];

      return columns;
    },
    // 业务信息
    getBusinessInfoColums() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.identity").$D("主要身份"),
          fieldCode: "identity",
          render: (val, record) => {
            if (record.saleFlag && record.purchaseFlag) {
              return (
                <span
                  style={
                    record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                      { color: "red" } :
                      ""
                  }
                >
                  {this.$T("ssrc.supplyInfoChange.model.willSale").$D(
                    "我要销售"
                  )}
                  /
                  {this.$T("ssrc.supplyInfoChange.model.willPurchase").$D(
                    "我要采购"
                  )}
                </span>
              );
            }
            return record.saleFlag ?
              <span
                style={
                  record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                    { color: "red" } :
                    ""
                }
              >
                {this.$T("ssrc.supplyInfoChange.model.willSale").$D("我要销售")}
              </span> :
              <span
                style={
                  record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                    { color: "red" } :
                    ""
                }
              >
                {this.$T("ssrc.supplyInfoChange.model.willPurchase").$D(
                  "我要采购"
                )}
              </span>
            ;
          },
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.businessProperty").$D("经营性质"),
          fieldCode: "businessScope",
          render: (val, record) => {
            const list = [];
            record.manufacturerFlag &&
              list.push(
                this.$T("ssrc.supplyInfoChange.model.manufacturer").$D("制造商")
              );
            record.servicerFlag &&
              list.push(
                this.$T("ssrc.supplyInfoChange.model.facilitator").$D("服务商")
              );
            record.traderFlag &&
              list.push(
                this.$T("ssrc.supplyInfoChange.model.trafficker").$D("贸易商")
              );
            record.agentFlag &&
              list.push(
                this.$T("ssrc.supplyInfoChange.model.agenter").$D("代理商")
              );
            return (
              <span
                style={
                  record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                    { color: "red" } :
                    ""
                }
              >
                {list.join("/")}
              </span>
            );
          },
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.interBusinessShield").$D("不允许其他企业找到我"),
          fieldCode: "interBusinessShield",
          visible: Boolean(this.businessInfo.isOld),
          render: (val, record) => val ?
            <span
              style={
                record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                  { color: "red" } :
                  ""
              }
            >
              {this.$T("ssrc.supplyInfoChange.model.yes").$D("是")}
            </span> :
            <span>{this.$T("ssrc.supplyInfoChange.model.no").$D("否")}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.industryName").$D("行业类型"),
          fieldCode: "industryName",
          render: (val, record) => {
            const list =
              record.industryReqList &&
              record.industryReqList.map((item) => item.industryName);
            return (
              <span
                style={
                  record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                    { color: "red" } :
                    ""
                }
              >
                {list && list.join("/")}
              </span>
            );
          },
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.categoryName").$D("主营品类"),
          fieldCode: "categoryName",
          render: (val, record) => {
            const list =
              record.industryCategoryReqList &&
              record.industryCategoryReqList.map((item) => item.categoryName);
            return (
              <span
                style={
                  record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                    { color: "red" } :
                    ""
                }
              >
                {list && list.join("/")}
              </span>
            );
          },
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.serviceAreaMeaning").$D("送货服务范围"),
          fieldCode: "serviceAreaCode",
          render: (val, record) => {
            const list =
              record.serviceAreaReqList &&
              record.serviceAreaReqList.map((item) => item.serviceAreaMeaning);
            return (
              <span
                style={
                  record.isOld && record.attachmentUuidFlag === "UPDATE" ?
                    { color: "red" } :
                    ""
                }
              >
                {list && list.join("/")}
              </span>
            );
          },
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.website").$D("公司官网"),
          fieldCode: "website",
          render: (val, record) => record.isOld && record.websiteFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.companyLogo").$D("公司Logo"),
          fieldCode: "logoUrl",
          render: (val, record) =>
            <div
              style="color: var(--color-other-default-b); font-size: 14px;"
              on-click={(e) => {
                e.stopPropagation();
                this.showLogo(val, record);
              }}
            >
              {this.$T("ssrc.supplyInfoChange.model.viewImg").$D("查看图片")}
            </div>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.introduce").$D("公司简介"),
          fieldCode: "description",
          render: (val, record) => record.isOld && record.websiteFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
      ];

      return columns;
    },
    // 联系人信息
    getContactInfoColums() {
      let columns = [];
      if (this.investgContactConfig) {
        columns = getInvestigateColums(this.investgContactConfig);
      } else {
        columns = [
          {
            fieldCode: "name",
            fieldType: "EMPTY",
            formRow: 0,
            render: (val, record) =>
              <SrmListHeader showOpenTag={false}>
                {record.defaultFlag ?
                  <srm-tag size="small" fill type="primary">
                    {this.$T("ssrc.supplyInfoChange.model.default").$D("默认")}
                  </srm-tag> :
                  ""
                }
                {record.enabledFlag ?
                  <srm-tag size="small" fill type="success">
                    {this.$T("ssrc.supplyInfoChange.model.enabled").$D("启用")}
                  </srm-tag> :
                  <srm-tag size="small" fill type="danger">
                    {this.$T("ssrc.supplyInfoChange.model.disabled").$D(
                      "未启用"
                    )}
                  </srm-tag>
                }
                {record.isOld && record.nameFlag === "UPDATE" ?
                  <span style="color:red">{val}</span> :
                  <span>{val}</span>
                }
                  -
                {record.isOld && record.genderFlag === "UPDATE" ?
                  <span style="color:red">{record.genderMeaning}</span> :
                  <span>{record.genderMeaning}</span>
                }
              </SrmListHeader>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.mail").$D("邮箱"),
            fieldCode: "mail",
            render: (val, record) => record.isOld && record.mailFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.mobilephone").$D("手机号码"),
            fieldCode: "mobilephone",
            render: (val, record) =>
              <span
                style={
                  record.isOld && record.mobilephoneFlag === "UPDATE" ?
                    { color: "red" } :
                    ""
                }
              >
                {record.internationalTelMeaning}| {val}
              </span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.idTypeMeaning").$D("证件类型"),
            fieldCode: "idTypeMeaning",
            render: (val, record) => record.isOld && record.idTypeFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.idNum").$D("证件号码"),
            fieldCode: "idNum",
            render: (val, record) => record.isOld && record.idNumFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.contactType").$D("联系人类型"),
            fieldCode: "contactTypeMeaning",
            render: (val, record) => record.isOld && record.contactTypeFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.department").$D("部门"),
            fieldCode: "department",
            render: (val, record) => record.isOld && record.departmentFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.position").$D("职位"),
            fieldCode: "position",
            render: (val, record) => record.isOld && record.positionFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.telephone").$D("固定电话"),
            fieldCode: "telephone",
            render: (val, record) => record.isOld && record.telephoneFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.description").$D("备注"),
            fieldCode: "description",
            render: (val, record) => record.isOld && record.descriptionFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
        ];
      }
      return columns;
    },
    // 地址信息
    getAddressInfoColums() {
      let columns = [];
      if (this.investgAddressConfig) {
        columns = getInvestigateColums(this.investgAddressConfig);
      } else {
        columns = [
          {
            fieldCode: "name",
            fieldType: "EMPTY",
            formRow: 0,
            render: (val, record) =>
              <SrmListHeader showOpenTag={false}>
                {record.enabledFlag ?
                  <srm-tag size="small" fill type="success">
                    {this.$T("ssrc.supplyInfoChange.model.enabled").$D("启用")}
                  </srm-tag> :
                  <srm-tag size="small" fill type="danger">
                    {this.$T("ssrc.supplyInfoChange.model.unenabled").$D(
                      "未启用"
                    )}
                  </srm-tag>
                }
                {record.isOld && record.addressDetailFlag === "UPDATE" ?
                  <span style="color:red">{record.addressDetail}</span> :
                  <span>{record.addressDetail}</span>
                }
              </SrmListHeader>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.countryName").$D("国家/地区"),
            fieldCode: "countryName",
            render: (val, record) => record.isOld && record.countryNameFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.regionPathName").$D("省/市/区"),
            fieldCode: "regionPathName",
            render: (val, record) => record.isOld && record.regionPathNameFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.postCode").$D("邮政编码"),
            fieldCode: "postCode",
            render: (val, record) => record.isOld && record.postCodeFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.addressRemark").$D("地址备注"),
            fieldCode: "description",
            render: (val, record) => record.isOld && record.descriptionFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
        ];
      }
      return columns;
    },
    // 银行信息
    getBankInfoColums() {
      let columns = [];
      if (this.investgBankAccountConfig) {
        columns = getInvestigateColums(this.investgBankAccountConfig);
      } else {
        columns = [
          {
            fieldCode: "bankName",
            fieldType: "EMPTY",
            formRow: 0,
            render: (val, record) =>
              <SrmListHeader showOpenTag={false}>
                {record.masterFlag ?
                  <srm-tag size="small" fill type="primary">
                    {this.$T("ssrc.supplyInfoChange.model.primaryAccount").$D(
                      "主账户"
                    )}
                  </srm-tag> :
                  ""
                }
                {record.enabledFlag ?
                  <srm-tag size="small" fill type="success">
                    {this.$T("ssrc.supplyInfoChange.model.enabled").$D("启用")}
                  </srm-tag> :
                  <srm-tag size="small" fill type="danger">
                    {this.$T("ssrc.supplyInfoChange.model.disabled").$D(
                      "未启用"
                    )}
                  </srm-tag>
                }
                {val} {record.bankCode}
              </SrmListHeader>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.bankCountryName").$D("国家/地区"),
            fieldCode: "bankCountryName",
            render: (val, record) => record.isOld && record.bankCountryNameFlag === "UPDATE" ?
              <span style="color:red">{val || record.bankCountryIdMeaning}</span> :
              <span>{val || record.bankCountryIdMeaning}</span>,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.bankFirm").$D("联行行号"),
            fieldCode: "bankFirm",
            render: (val, record) => record.isOld && record.bankFirmFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.bankBranchName").$D("开户行名称"),
            fieldCode: "bankBranchName",
            render: (val, record) => record.isOld && record.bankBranchNameFlag === "UPDATE" ?
              <span style="color:red">{val || record.depositBank}</span> :
              <span>{val || record.depositBank}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.bankAccountName").$D("账户名称"),
            fieldCode: "bankAccountName",
            render: (val, record) => record.isOld && record.bankAccountNameFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.bankAccountNum").$D("开户行账号"),
            fieldCode: "bankAccountNum",
            render: (val, record) => record.isOld && record.bankAccountNumFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
        ];
      }
      return columns;
    },
    // 开票信息
    getInvoiceInfoColums() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.invoiceHeader").$D("发票头"),
          fieldCode: "invoiceHeader",
          render: (val, record) => record.isOld && record.invoiceHeaderFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.taxRegistrationNumber").$D("税务登记号"),
          fieldCode: "taxRegistrationNumber",
          render: (val, record) => record.isOld &&
              record.taxRegistrationNumberFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.depositBank").$D("开户行"),
          fieldCode: "depositBank",
          render: (val, record) => record.isOld && record.depositBankFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.bankAccountNum").$D("开户行账号"),
          fieldCode: "bankAccountNum",
          render: (val, record) => record.isOld && record.bankAccountNumFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.taxRegistrationAddress").$D("税务登记地址"),
          fieldCode: "taxRegistrationAddress",
          render: (val, record) => record.isOld &&
              record.taxRegistrationAddressFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.taxRegistrationPhone").$D("税务登记电话"),
          fieldCode: "taxRegistrationPhone",
          render: (val, record) => record.isOld &&
              record.taxRegistrationPhoneFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.receiveMail").$D("收票人邮箱"),
          fieldCode: "receiveMail",
          render: (val, record) => record.isOld && record.receiveMailFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.receivePhone").$D("收票人手机号"),
          fieldCode: "receivePhone",
          render: (val, record) =>
            <span
              style={
                record.isOld && record.receivePhoneFlag === "UPDATE" ?
                  { color: "red" } :
                  ""
              }
            >
              {record.internationalTelMeaning}| {val}
            </span>
          ,
        },
      ];

      return columns;
    },
    // 附件信息
    getAttachmentInfoColums() {
      let columns = [];
      if (this.investgAttachmentConfig) {
        columns = getInvestigateColums(this.investgAttachmentConfig);
      } else {
        columns = [
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.attachmentMeaning").$D("附件类型"),
            fieldCode: "attachmentMeaning",
            render: (val, record) => record.isOld && record.attachmentMeaningFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.attachmentDescription").$D("附件描述"),
            fieldCode: "description",
            render: (val, record) => record.isOld && record.descriptionFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.endDate").$D("文件到期日"),
            fieldCode: "endDate",
            render: (val, record) => record.isOld && record.endDateFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.lastUpdateDate").$D("最后更新时间"),
            fieldCode: "uploadDate",
            render: (val, record) => record.isOld && record.uploadDateFlag === "UPDATE" ?
              <span style="color:red">{val}</span> :
              <span>{val}</span>
            ,
          },
          {
            fieldName: this.$T("ssrc.supplyInfoChange.model.attachment").$D("附件"),
            fieldCode: "attachmentUuid",
            render: (val) =>
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={this.$T("ssrc.supplyInfoChange.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "hipspfm.common.message.title.viewAttachment"
                  ).$D("附件查看")}
                />
              </div>,
            callBack: () => {},
          },
        ];
      }
      return columns;
    },
    // 供货能力清单信息
    getSupplyUpdateAbilityInfoColums() {
      const columns = [
        {
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              {record.supplyFlag ?
                <srm-tag size="small" fill type="success">
                  {this.$T("ssrc.supplyInfoChange.model.supplyed").$D("可供")}
                </srm-tag> :
                <srm-tag size="small" fill type="danger">
                  {this.$T("ssrc.supplyInfoChange.model.unsupplyed").$D(
                    "不可供"
                  )}
                </srm-tag>
              }
              {val}
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          render: (val, record) => record.isOld && record.itemCodeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.itemName").$D("物料名称"),
          fieldCode: "itemName",
          render: (val, record) => record.isOld && record.itemNameFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
          render: (val, record) => record.isOld && record.itemCategoryCodeFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.categoryDescription").$D("品类描述"),
          fieldCode: "categoryName",
          render: (val, record) => record.isOld && record.categoryNameFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.oneTimeFlag").$D("是否一次性供货"),
          fieldCode: "oneTimeFlag",
          render: (val, record) => record.isOld && record.oneTimeFlagFlag === "UPDATE" ?
            <span style="color:red">
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span> :
            <span>
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.adapterProducts").$D("适配产品"),
          fieldCode: "adapterProducts",
          render: (val, record) => record.isOld && record.adapterProductsFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.countryIdMeaning").$D("服务国家"),
          fieldCode: "countryIdMeaning",
          render: (val, record) => record.isOld && record.countryIdFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.regionIdMeaning").$D("服务地区"),
          fieldCode: "regionIdMeaning",
          render: (val, record) => record.isOld && record.regionIdFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.cityIdMeaning").$D("服务城市"),
          fieldCode: "cityIdMeaning",
          render: (val, record) => record.isOld && record.cityIdFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.dateFrom").$D("有效期从"),
          fieldCode: "dateFrom",
          render: (val, record) => record.isOld && record.dateFromFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.dateTo").$D("有效期至"),
          fieldCode: "dateTo",
          render: (val, record) => record.isOld && record.dateToFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.view.button.attachuuid").$D("附件"),
          fieldCode: "fileArr",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={this.fileArr}
                show-count={false}
                show-icon={false}
                color="#276EF1"
                title={this.$T("ssrc.supplyInfoChange.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "ssrc.supplyInfoChange.view.button.viewUpload"
                ).$D("查看")}
                onShowFilePopup={() => this.showAttachment(val)}
              />
            </div>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.remark").$D("变更备注"),
          fieldCode: "remark",
          render: (val, record) => record.isOld && record.remarkFlag === "UPDATE" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
      ];

      return columns;
    },
    // 供应商分类信息
    getSupplyCategoryInfoColums() {
      const columns = [
        {
          fieldCode: "categoryCode",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              {record.enabledFlag ?
                <srm-tag size="small" fill type="success">
                  {this.$T("ssrc.supplyInfoChange.model.enabled").$D("启用")}
                </srm-tag> :
                <srm-tag size="small" fill type="danger">
                  {this.$T("ssrc.supplyInfoChange.model.disabled").$D(
                    "未启用"
                  )}
                </srm-tag>
              }
              {val}——{record.categoryDescription}
            </SrmListHeader>
          ,
        },
      ];

      return columns;
    },
    // 采购/财务信息
    getPurchaseFinanceInfoColums() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.programmeGroupsMeaning").$D("计划组"),
          fieldCode: "programmeGroupsMeaning",
          render: (val, record) => record.isOld &&
              record.programmeGroupsStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.schemeGroup").$D("方案组"),
          fieldCode: "schemeGroup",
          render: (val, record) => record.isOld && record.schemeGroupStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.accountGroupMeaning").$D("账户组"),
          fieldCode: "accountGroupMeaning",
          render: (val, record) => record.isOld && record.accountGroupStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.reconciliationAccountMeaning").$D("统驭科目"),
          fieldCode: "reconciliationAccountMeaning",
          render: (val, record) => record.isOld &&
              record.reconciliationAccountStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.ouCode").$D("erp公司代码"),
          fieldCode: "ouCode",
          render: (val, record) => record.isOld && record.ouIdStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.termName").$D("付款条件"),
          fieldCode: "termName",
          render: (val, record) => record.isOld && record.termIdStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.frozenFlag").$D("记账冻结"),
          fieldCode: "frozenFlag",
          render: (val, record) => record.isOld && record.frozenFlagStateFlag === "update" ?
            <span style="color:red">
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span> :
            <span>
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.paymentFrozenMeaning").$D("付款冻结代码"),
          fieldCode: "paymentFrozenMeaning",
          render: (val, record) => record.isOld &&
              record.paymentFrozenStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.lineInfo").$D("行信息"),
          fieldCode: "lineInfo",
          render: () =>
            <span
              style={{ color: "#276EF1" }}
              onClick={this.getPurchaseFinanceLineInfo}
            >
              {this.$T("ssrc.supplyInfoChange.view.button.uploadview").$D(
                "查看"
              )}
            </span>
          ,
        },
      ];

      return columns;
    },
    // 采购/财务信息行信息
    getPurchaseFinanceLineInfoColums() {
      const columns = [
        {
          fieldCode: "organizationCode",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              {record.isOld && record.purchaseOrgIdStateFlag === "update" ?
                <span style="color:red">{val}</span> :
                <span>{val}</span>
              }
                -
              {record.isOld && record.purchaseOrgIdStateFlag === "update" ?
                <span style="color:red">{record.organizationName}</span> :
                <span>{record.organizationName}</span>
              }
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.purchaseAgentName").$D("采购组"),
          fieldCode: "purchaseAgentName",
          render: (val, record) => record.isOld &&
              record.purchaseAgentIdStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.termName").$D("付款条件"),
          fieldCode: "termName",
          render: (val, record) => record.isOld && record.termIdStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.typeName").$D("付款方式"),
          fieldCode: "typeName",
          render: (val, record) => record.isOld && record.typeIdStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.change.orderCurrencyName").$D("订单货币"),
          fieldCode: "currencyName",
          render: (val, record) => record.isOld && record.currencyCodeStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.reconciliationAccountMeaning").$D("统驭科目"),
          fieldCode: "reconciliationAccountMeaning",
          render: (val, record) => record.isOld &&
              record.reconciliationAccountStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.sortNumber").$D("排序码"),
          fieldCode: "sortNumber",
          render: (val, record) => record.isOld && record.sortNumberFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.frozenFlag").$D("记账冻结"),
          fieldCode: "frozenFlag",
          render: (val, record) => record.isOld && record.frozenFlagStateFlag === "update" ?
            <span style="color:red">
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span> :
            <span>
              {val ?
                this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
                this.$T("ssrc.supplyInfoChange.model.no").$D("否")}
            </span>
          ,
        },
      ];

      return columns;
    },
    // 地点层信息
    getSiteLayerInfoColums() {
      const columns = [
        {
          fieldCode: "address",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              {record.enabledFlag ?
                <srm-tag size="small" fill type="success">
                  {this.$T("ssrc.supplyInfoChange.model.enabled").$D("启用")}
                </srm-tag> :
                <srm-tag size="small" fill type="danger">
                  {this.$T("ssrc.supplyInfoChange.model.disabled").$D(
                    "未启用"
                  )}
                </srm-tag>
              }
              {record.isOld && record.addressStateFlag === "update" ?
                <span style="color:red">{val}</span> :
                <span>{val}</span>
              }
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.countryName").$D("国家/地区"),
          fieldCode: "countryName",
          render: (val, record) => record.isOld && record.countryNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.regionName").$D("地区"),
          fieldCode: "regionName",
          render: (val, record) => record.isOld && record.regionNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.city").$D("城市"),
          fieldCode: "city",
          render: (val, record) => record.isOld && record.cityStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.supplierAddress").$D("供应商地点"),
          fieldCode: "supplierAddress",
          render: (val, record) => record.isOld &&
              record.supplierAddressStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.contactName").$D("联系人"),
          fieldCode: "contactName",
          render: (val, record) => record.isOld && record.contactNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.internationalTelMeaning").$D("联系人方式"),
          fieldCode: "internationalTelMeaning",
          render: (val, record) => record.isOld &&
              record.internationalStateFlag === "update" ?
            <span style="color:red">
              {val} | {record.contactPhone}
            </span> :
            <span>
              {val} | {record.contactPhone}
            </span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.oulayerInfo").$D("OU层信息"),
          fieldCode: "oulayerInfo",
          render: (val, record) =>
            <span
              style={{ color: "#276EF1" }}
              onClick={() => this.getOuLayerInfoList(record.supChangeAddId)}
            >
              {this.$T("ssrc.supplyInfoChange.view.button.uploadview").$D(
                "查看"
              )}
            </span>
          ,
        },
      ];

      return columns;
    },
    // OU信息
    getOUInfoColums() {
      const columns = [
        {
          fieldName: "",
          fieldCode: "ouName",
          fieldType: "EMPTY",
          formRow: 0,
          langCode: "ssrc.supplyInfoChange.model.ouName",
          render: (val, record) => record.isOld && record.ouIdStateFlag === "update" ?
            <SrmListHeader showOpenTag={false}>
              <span style="color:red">{val}</span>
            </SrmListHeader> :
            <SrmListHeader showOpenTag={false}>
              <span>{val}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.billPeriodMeaning").$D("账期"),
          fieldCode: "billPeriodMeaning",
          render: (val, record) => record.isOld && record.billPeriodStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.typeName").$D("付款方式"),
          fieldCode: "typeName",
          render: (val, record) => record.isOld && record.typeNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.ticketDay").$D("票据天数"),
          fieldCode: "ticketDay",
          render: (val, record) => record.isOld && record.ticketDayStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.termName").$D("付款条件"),
          fieldCode: "termName",
          render: (val, record) => record.isOld && record.termNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.bankCode").$D("银行代码"),
          fieldCode: "bankCode",
          render: (val, record) => record.isOld && record.bankCodeStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.change.bankName").$D("银行名称"),
          fieldCode: "bankName",
          render: (val, record) => record.isOld && record.bankNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.bankFirm").$D("联行行号"),
          fieldCode: "bankFirm",
          render: (val, record) => record.isOld && record.bankFirmStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.change.depositBank").$D("开户行名称"),
          fieldCode: "depositBank",
          render: (val, record) => record.isOld && record.depositBankStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.change.bankAccountName").$D("账号名称"),
          fieldCode: "bankAccountName",
          render: (val, record) => record.isOld &&
              record.bankAccountNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.change.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
          render: (val, record) => record.isOld &&
              record.bankAccountNumStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.taxRate").$D("税率"),
          fieldCode: "taxRate",
          render: (val, record) => record.isOld && record.taxRateStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.change.currencyName").$D("币种"),
          fieldCode: "currencyName",
          render: (val, record) => record.isOld && record.currencyNameStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.layerCreationDate").$D("层创建日期"),
          fieldCode: "creationDate",
          render: (val, record) => record.isOld && record.creationDateStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.model.expirationDate").$D("层失效日期"),
          fieldCode: "expirationDate",
          render: (val, record) => record.isOld &&
              record.expirationDateStateFlag === "update" ?
            <span style="color:red">{val}</span> :
            <span>{val}</span>
          ,
        },
      ];

      return columns;
    },
    // 其他信息
    getOtherInfoColums() {
      const cusRenderer = (text, flag = false) => flag ? <span style="color:red">{text ?? "-"}</span> : text;
      const getOldFlag = (record, name) => {
        const { isOld, [`${name}StateFlag`] : flag } = record || {};
        return isOld && flag === "update";
      };
      const columns = [
        // 协鑫增加链接跳转 src-26954
        window.localStorage.getItem("tenantNum") === "SRM-XXJT" && {
          fieldName: this.$T("sslm.supplierDetail.title.viewSupplierTarget").$D("查看供应商标的"),
          fieldCode: "viewSupplierTarget",
          render:(_, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.jumpToSupplierTarget(record)}>{this.$T("sslm.supplierDetail.title.viewSupplierTarget").$D("查看供应商标的")}</a>,
        },
        {
          fieldCode: "attributeLongtext8",
          render:(_, record) => {
            const { attributeLongtext8 } = record;
            return cusRenderer(attributeLongtext8, getOldFlag(record, "attributeLongtext8"));
          }
        },
        ...[ "attributeVarchar19", "attributeVarchar20", "attributeVarchar21", "attributeVarchar23" ].map((fieldCode) => ({
          fieldCode,
          render:(_, record) => {
            const { [`${fieldCode}Meaning`]: attributeMeaning } = record;
            return cusRenderer(attributeMeaning, getOldFlag(record, fieldCode));
          }
        })),
      ].filter(Boolean);
      return columns;
    },
  },
  async mounted() {
    this.$loading.show();
    // 查询调查表配置
    await queryInvestigateConfigApi({ changeReqId: this.changeReqId }).then((res) => {
      if (res && !res.failed) {
        this.configList = dealConfigData(res);
        this.investgContactConfig = this.configList.find((item) => item.configName === "sslmInvestgContact");
        this.investgAddressConfig = this.configList.find((item) => item.configName === "sslmInvestgAddress");
        this.investgBankAccountConfig = this.configList.find((item) => item.configName === "sslmInvestgBankAccount");
        this.investgAttachmentConfig = this.configList.find((item) => item.configName === "sslmInvestgAttachment");
      }
    }).finally(async () => {
      await this.getBasicInfo();
      await this.getRegisterInfo();
      await this.getBusinessInfo();
      await this.getContactList();
      await this.getAddressList();
      await this.getBankInfoList();
      await this.getInvoiceInfo();
      await this.getAttachmentInfoList();
      await this.getSupplyAbilityInfoList();
      await this.getSupplyCategoryInfoList();
      await this.getPurchaseFinanceInfo();
      await this.getSiteLayerInfoList();
      this.$loading.hide();
      this.getOtherInfo();
      this.$emit(
        "GetApprovalTitle",
        this.$T("ssrc.supplyInfoChange.view.title.supplyInfoChange").$D(
          "供应商信息变更"
        )
      );
    });
  },
  methods: {
    async buttonswitchChange(val) {
      this.$loading.show();
      if (val) {
        this.status = "new";
        await this.getRegisterInfo();
        await this.getBusinessInfo();
        await this.getContactList();
        await this.getAddressList();
        await this.getBankInfoList();
        await this.getInvoiceInfo();
        await this.getAttachmentInfoList();
        await this.getSupplyAbilityInfoList();
        await this.getSupplyCategoryInfoList();
        await this.getPurchaseFinanceInfo();
        await this.getSiteLayerInfoList();
        await this.getOtherInfo();
      } else {
        this.status = "old";
        await this.getRegisterInfo("old");
        await this.getBusinessInfo("old");
        await this.getContactList("old");
        await this.getAddressList("old");
        await this.getBankInfoList("old");
        await this.getInvoiceInfo("old");
        await this.getAttachmentInfoList("old");
        await this.getSupplyAbilityInfoList("old");
        await this.getSupplyCategoryInfoList("old");
        await this.getPurchaseFinanceInfo("old");
        await this.getSiteLayerInfoList("old");
        await this.getOtherInfo("old");
      }
      this.$loading.hide();
    },
    // 获取基本信息资料
    getBasicInfo() {
      const params = {
        changeReqId: this.changeReqId,
        customizeUnitCode: "SLM.SUPPLIER_INFORM_CHANGE_DETAIL.HEADER",
      };
      getSupplyBasicInfoApi(params).then((res) => {
        this.basicInfo = res;
        this.systemType = res.systemType;
      });
    },
    // 获取登记信息资料
    getRegisterInfo(status) {
      const params = {
        changeReqId: this.changeReqId,
        dataSource: 2,
      };
      getSupplyRegisterInfoApi(params).then((res) => {
        if (status === "old") {
          res.oldBasic.isOld = true;
          this.registerInfo = res.oldBasic;
        } else {
          this.registerInfo = res.newBasic;
        }
      });
    },
    // 获取业务信息资料
    getBusinessInfo(status) {
      const params = {
        changeReqId: this.changeReqId,
        dataSource: 2,
      };
      getBusinessInfoApi(params).then((res) => {
        if (status === "old") {
          res.oldBusiness.isOld = true;
          this.businessInfo = res.oldBusiness;
        } else {
          this.businessInfo = res.newBusiness;
        }
      });
    },
    // 获取联系人列表
    getContactList(status) {
      if (this.investgContactConfig) {
        const params = {
          configName: "sslmInvestgContact",
          changeReqId: this.changeReqId,
          dataSource: this.dataSource,
        };
        queryInvestigateApi(params).then((res) => {
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.contactInfoList = res[0];
          } else {
            this.contactInfoList = res[1];
          }
        });
      } else {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2,
        };
        getContactInfoListApi(params).then((res) => {
          if (status === "old") {
            res.oldContacts.forEach((item) => {
              item.isOld = true;
            });
            this.contactInfoList = res.oldContacts;
          } else {
            this.contactInfoList = res.newContacts;
          }
        });
      }
    },
    // 获取地址列表
    getAddressList(status) {
      // 判断调查表
      if (this.investgAddressConfig) {
        const params = {
          configName: "sslmInvestgAddress",
          changeReqId: this.changeReqId,
          dataSource: this.dataSource,
        };
        queryInvestigateApi(params).then((res) => {
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.addressInfoList = res[0];
          } else {
            this.addressInfoList = res[1];
          }
        });
      } else {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2,
        };
        getAddressInfoListApi(params).then((res) => {
          if (status === "old") {
            res.oldAddresses.forEach((item) => {
              item.isOld = true;
            });
            this.addressInfoList = res.oldAddresses;
          } else {
            this.addressInfoList = res.newAddresses;
          }
        });
      }
    },
    // 获取银行信息列表
    getBankInfoList(status) {
      // 判断调查表
      if (this.investgBankAccountConfig) {
        const params = {
          configName: "sslmInvestgBankAccount",
          changeReqId: this.changeReqId,
          dataSource: this.dataSource,
          desensitize: false,
        };
        queryInvestigateApi(params).then((res) => {
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.bankInfoList = res[0];
          } else {
            this.bankInfoList = res[1];
          }
        });
      } else {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2,
        };
        getBankInfoListApi(params).then((res) => {
          if (status === "old") {
            res.oldBankAccounts.forEach((item) => {
              item.isOld = true;
            });
            this.bankInfoList = res.oldBankAccounts;
          } else {
            this.bankInfoList = res.newBankAccounts;
          }
        });
      }
    },
    // 获取开票信息
    getInvoiceInfo(status) {
      const params = {
        changeReqId: this.changeReqId,
        dataSource: 2,
      };
      getInvoiceInfoApi(params).then((res) => {
        if (status === "old") {
          res.oldInvoice.isOld = true;
          this.invoiceInfo = res.oldInvoice;
        } else {
          this.invoiceInfo = res.newInvoice;
        }
      });
    },
    // 获取附件信息列表
    getAttachmentInfoList(status) {
      // 判断调查表
      if (this.investgAttachmentConfig) {
        const params = {
          configName: "sslmInvestgAttachment",
          changeReqId: this.changeReqId,
          dataSource: this.dataSource,
        };
        queryInvestigateApi(params).then((res) => {
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.attachmentInfoList = res[0];
          } else {
            this.attachmentInfoList = res[1];
          }
        });
      } else {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2,
        };
        getAttachmentInfoApi(params).then((res) => {
          if (status === "old") {
            res.oldAttachments.forEach((item) => {
              item.isOld = true;
            });
            this.attachmentInfoList = res.oldAttachments;
          } else {
            this.attachmentInfoList = res.newAttachments;
          }
        });
      }
    },
    // 获取供货能力清单列表
    getSupplyAbilityInfoList(status) {
      getSupplyAbilityInfoApi(this.changeReqId).then((res) => {
        if (res && res[0] && res[1]) {
          if (status === "old") {
            res[0].forEach(async (item) => {
              item.isOld = true;
              const params = {
                abilityLineId: item.abilityLineId,
                compareFlag: 1,
              };
              await getSupplyAbilityAttachmentInfoApi(params).then((result) => {
                item.fileArr = result.oldSupChangeAbilityLnAtts;
              });
            });
            this.supplyAbilityInfoList = res[0];
          } else {
            res[1].forEach(async (item) => {
              const params = {
                abilityLineId: item.abilityLineId,
                compareFlag: 2,
              };
              await getSupplyAbilityAttachmentInfoApi(params).then((result) => {
                item.fileArr = result.newSupChangeAbilityLnAtts;
              });
            });
            this.supplyAbilityInfoList = res[1];
          }
        }
      });
    },
    //展示附件列表
    showAttachment(val) {
      this.fileArr = val;
    },
    // 获取供应类别列表
    getSupplyCategoryInfoList(status) {
      getSupplyCategoryInfoApi(this.changeReqId).then((res) => {
        if (res && res[0] && res[1]) {
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.supplyCategoryInfoList = res[0];
          } else {
            this.supplyCategoryInfoList = res[1];
          }
        }
      });
    },
    // 获取采购财务信息
    getPurchaseFinanceInfo(status) {
      getPurchaseFinanceInfoApi(this.changeReqId).then((res) => {
        if (res && res[0] && res[1]) {
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.purchaseFinanceInfo = res[0][0];
          } else {
            this.purchaseFinanceInfo = res[1][0];
          }
        }
      });
    },
    // 获取采购财务行信息
    getPurchaseFinanceLineInfo() {
      this.isLineInfo = true;
      getPurchaseFinanceLineInfoApi(this.changeReqId).then((res) => {
        if (res && res[0] && res[1]) {
          if (this.status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.lineInfoList = res[0];
          } else {
            this.lineInfoList = res[1];
          }
        }
      });
    },
    // 获取oou层信息
    getOuLayerInfoList(supChangeAddId) {
      this.isOoupop = true;
      const params = {
        changeReqId: this.changeReqId,
        supChangeAddId,
      };
      getOuLayerInfoApi(params).then((res) => {
        if (res && res[0] && res[1]) {
          if (this.status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.oulayerInfoList = res[0];
          } else {
            this.oulayerInfoList = res[1];
          }
        }
      });
    },
    // 获取地点层信息
    getSiteLayerInfoList(status) {
      getSiteLayerInfoApi(this.changeReqId).then((res) => {
        if (res && res[0] && res[1]) {
          for (let i = 0; i < res[0].length; i++) {
            res[0][i]["supChangeAddId"] = res[1][i]["supChangeAddId"];
          }
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.siteLayerList = res[0];
          } else {
            this.siteLayerList = res[1];
          }
        }
      });
    },
    // 获取其他信息
    getOtherInfo(status) {
      const params = {
        changeReqId: this.changeReqId,
        dataSource: 2,
        customizeUnitCode: "SSLM.SUPPLIER_INFORM_CHANGE_DETAIL.OTHER_INFO_FORM",
      };
      getOtherInfoApi(params).then((res) => {
        if (res && res[0] && res[1]) {
          if (status === "old") {
            res[0].forEach((item) => {
              item.isOld = true;
            });
            this.otherInfo = res[0][0];
          } else {
            this.otherInfo = res[1][0];
          }
        }
      });
    },
    // 获取考营业执照
    showLicense(fileUrl) {
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileUrl,
        fileName: ".jpg",
      });
    },
    // 获取公司logo
    showLogo(fileUrl) {
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileUrl,
        fileName: ".jpg",
      });
    },
    // 跳转供应商标的
    jumpToSupplierTarget(record) {
      const { supplierCompanyId } = record;
      this.$router.push({
        path: "/appCux/XxjtSupplierApplication",
        query: {
          sourceFrom:"OTHERS-MODULE",
          supplierCompanyId,
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .customize-detail .form-item .value {
  justify-content: start;
}

>>> .srm-tag {
  margin-right: 6px;
  line-height: 19px;
}

>>> .file-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: var(--color-font-default-d);
}

>>> .navWrap .navContent li.active:before {
  display: none;
}

>>> .navWrap .navContent li {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #afafaf;
}

>>> .navWrap .navContent li.active {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #1f1f1f;
}

>>> .textarea-box {
  padding: 0;
  border: 0;
}

>>> .srm-button-group .srm-button-group-area {
  padding-bottom: 12px;
  border-bottom: 1px solid #f6f6f6;
}

>>> .button-switch .toggle {
  height: 30px;
}

>>> .button-switch .toggle span {
  line-height: 18px;
}

>>> .content-item {
  box-sizing: border-box;
  .card{
    padding: 8px 16px !important;
  }
  .has-border{
    border-bottom: 1px solid #f6f6f6;
  }
}

.detail-wrap {
  .change-btn {
    margin: 11px 0 11px 15px;
  }

  .contact, .account {
    display: flex;
    justify-content: space-between;
  }

  .supply-open-account-status {
    font-size: 14px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    margin-right: 15px;
  }
}
</style>
