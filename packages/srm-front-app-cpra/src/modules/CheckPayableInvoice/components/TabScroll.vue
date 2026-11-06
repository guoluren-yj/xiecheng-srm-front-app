<template>
  <section v-if="headInfo" class="mainDetail">
    <div ref="navWrap" class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in navArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="$changeNav(index)">
          {{ item }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <div ref="headInfo" class="infoContent headInfo">
          <h3 v-if="headInfo.businessType === 'CONSIGNMENT'">{{ $T("sfin.invoiceBill.view.consignmentInvoiceHeader").$D("寄售发票头信息") }}</h3>
          <h3 v-else>{{ $T("sfin.invoiceBill.view.nonConsignmentInvoiceHeader").$D("非寄售发票头信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.invoiceBill.view.message.NoNonConsignmentInvoiceHeader").$D("暂无非寄售发票头信息") }}</span>
          </div>
          <div v-else>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmountSystem").$D("含税总额(系统)") }}：</span>
              <span>{{ headInfo.taxIncludedAmountSystemMeaning|CalcMoney|CalcMicrometer }}</span>
            </div>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.taxAmountSystem").$D("税额（系统）") }}：</span>
              <span>{{ headInfo.taxAmountSystemMeaning|CalcMoney|CalcMicrometer }}</span>
            </div>
            <div class="invoiceHead">
              <span
                :class="showWarning ? 'code' : 'code-red'">{{ $T("sfin.invoiceBill.model.invoiceBill.taxationInvoiceNum").$D("税务发票号码") }}：</span>
              <span>{{ headInfo.taxInvoiceNum }}</span>
            </div>
            <div class="invoiceHead">
              <span
                :class="showWarning ? 'code' : 'code-red'">{{ $T("sfin.invoiceBill.model.invoiceBill.taxationInvoiceCode").$D("税务发票代码") }}：</span>
              <span>{{ headInfo.taxInvoiceCode }}</span>
            </div>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceAmount").$D("发票总额") }}：</span>
              <span>{{ headInfo.taxIncludedAmountMeaning|CalcMoney|CalcMicrometer }}</span>
            </div>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceTaxAmount").$D("发票税额") }}：</span>
              <span>{{ headInfo.taxAmountMeaning|CalcMoney|CalcMicrometer }}</span>
            </div>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.taxInvoiceDateIssued").$D("开票日期") }}：</span>
              <span>{{ headInfo.taxInvoiceDateIssued|CalcDate }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span class="code" >{{ $T("sfin.invoiceBill.model.payableInvoice.totalNonTax").$D("未税总额(系统)") }}：</span>
              <span>{{ headInfo.taxWithoutAmount }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span class="code" >{{ $T("sfin.invoiceBill.model.invoiceBill.").$D("扣款金额") }}：</span>
              <span>{{ headInfo.deductedTaxIncludedAmount }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span class="code" >{{ $T("sfin.invoiceBill.model.invoiceBill.deductionTaxAmount").$D("扣款税额") }}：</span>
              <span>{{ headInfo.deductedTaxAmount }}</span>
            </div>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.drawerSupplierName").$D("出票方") }}：</span>
              <span>{{ headInfo.paymentAmounted }}</span>
            </div>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceRemark").$D("发票备注") }}：</span>
              <span>{{ headInfo.remark }}</span>
            </div>
            <div class="invoiceHead">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.supplierSiteName").$D("供应商地址") }}：</span>
              <span class="materiel-name">{{ headInfo.supplierSiteName }}</span>
            </div>
          </div>

          <div
            class="info_h3">
            {{ $T("hipspfm.invoiceBill.view.title.validation.basicInformation").$D("基本信息") }}
          </div>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoBasicInformation").$D("暂无基本信息") }}</span>
          </div>
          <div v-else>
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span>{{ headInfo.companyName }}</span>
                <span class="status2">{{ headInfo.invoiceStatusMeaning }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.ouName").$D("业务实体") }}： {{ headInfo.ouName }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.purchaseOrgName").$D("采购组织") }}： {{ headInfo.purOrganizationName }}</span>
              </li>
              <li>
                <span
                  class="materiel-name">{{ $T("sfin.invoiceBill.model.invoiceBill.purAgentName").$D("采购员") }}： {{ headInfo.purchaseAgentName }}</span>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.currencyCode").$D("币种") }}： {{ headInfo.currencyCode }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.creationDate").$D("创建日期") }}： {{ headInfo.creationDate }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sfin.invoiceBill.model.invoiceBill.createName").$D("创建人") }}：</span>
              <span>{{ headInfo.createName }}</span>
            </div>
          </div>
        </div>
        <div ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceLineNum").$D("发票行") }}</h3>
          <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoInvoiceLineNum").$D("暂无发票行信息") }}</span>
          </div>
          <div
            v-for="(item,index) in lineInfo"
            v-else
            :key="index"
            @click="showLineInfoDetail(item)">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span>{{ item.poNumAndLineNum }}</span>
                <span
                  style="color: var(--color-font-default-e)">{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceLineNum").$D("发票行") }}: {{ item.invoiceLineNum }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span
                  class="materiel-name">{{ $T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称") }}: {{ item.itemName }}</span>
              </li>
              <li>
                <span
                  class="materiel-name">{{ $T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码") }}: {{ item.itemCode }}</span>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量") }}: {{ item.quantity }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.sfin.invoiceBill").$D("含税单价") }}: {{ item.taxIncludedPrice|CalcMoney|CalcMicrometer }}</span>
                <span>{{ $T("sfin.invoiceBill.sfin.taxAmount").$D("税额") }}: {{ item.taxAmount|CalcMoney|CalcMicrometer }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sfin.invoiceBill.model.invoiceBill.all.taxIncludedPrice").$D("含税总金额") }}：</span>
              <span>{{ item.taxIncludedAmount|CalcMoney|CalcMicrometer }}</span>
            </div>
          </div>
        </div>
        <div ref="logisticsInfo" class="infoContent headInfo">
          <h3>{{ $T("sfin.invoiceBill.view.taxInvoiceRow").$D("税务发票行") }}</h3>
          <div v-if="taxInfo.length === 0" class="noContent">
            <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoTaxInvoiceRow").$D("暂无税务发票行信息") }}</span>
          </div>
          <div v-for="(item,index) in taxInfo" v-else :key="index">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxInvoiceCode").$D("发票代码") }}: {{ item.invoiceCode }}</span>
                <span
                  v-if="item.validateStatusCode == 'UNCHECK'"
                  class="status status1">{{ item.validateStatusCodeMeaning }}</span>
                <span
                  v-if="item.validateStatusCode == 'CHECK_SUCCESS'"
                  class="status status2">{{ item.validateStatusCodeMeaning }}</span>
                <span
                  v-if="item.validateStatusCode == 'CHECK_FAILED'"
                  class="status status3">{{ item.validateStatusCodeMeaning }}</span>
                <span
                  v-if="item.validateStatusCode == 'PARTIAL_SUCCESS'"
                  class="status status4">{{ item.validateStatusCodeMeaning }}</span>
                <span
                  v-if="item.validateStatusCode == 'PARTIAL_FAILED'"
                  class="status status5">{{ item.validateStatusCodeMeaning }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceNumber").$D("发票号") }}： {{ item.invoiceNumber }}</span>
              </li>
              <li class="lineOverflow">
                <span
                  class="materiel-name">{{ $T("sfin.invoiceBill.model.invoiceBill.checkStateExplain").$D("查验状态说明") }}： {{ item.validateMessage }}</span>
                <span>
                  <srm-tooltip placement="left" :title="item.validateMessage">
                    <img src="@/assets/icon_more@3x.png" class="image-blue-default moreInfo" >
                  </srm-tooltip>
                </span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxInvoiceDateIssued").$D("开票日期") }}： {{ item.billingDate|CalcDate }}</span>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.checkCodeMeaning").$D("校验码") }}： {{ item.checkCode }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceStatus").$D("发票状态") }}： {{ item.taxInvoiceStatusCodeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额") }}： {{ item.taxAmount }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额") }}： {{ item.taxIncludedAmount }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.noDepositInvoiceType").$D("发票种类") }}： {{ item.noDepositInvoiceTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceDirection").$D("发票方向") }}： {{ item.invoiceDirectionMeaning }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额") }}：</span>
              <span>{{ item.totalAmount|CalcMoney|CalcMicrometer }}</span>
            </div>
          </div>
        </div>

        <div ref="ledgerAccount" class="infoContent lineInfo">
          <h3>{{ $T("sfin.invoiceBill.view.inf").$D("总账科目") }}</h3>
          <div v-if="JSON.stringify(ledgerAccount) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoInf").$D("暂无总账科目信息") }}</span>
          </div>
          <div
            v-for="(item,index) in ledgerAccount"
            v-else
            :key="index">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span>{{ item.deductionsNum }}</span>
                <span
                  style="color: var(--color-font-default-e)">{{ $T("sfin.invoiceBill.model.invoiceBill.lineNo").$D("行号") }}: {{ item.relationLineNum }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span>{{ $T("sfin.common.model.common.accountSubjectName").$D("总账科目名称") }}: {{ item.accountSubjectName }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.common.	model.common.debitCreditCodeMeaning").$D("借贷方") }}: {{ item.debitCreditCodeMeaning }}</span>
                <span>{{ $T("sfin.common.model.common.taxRate").$D("税率(%)") }}: {{ item.taxRate }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.common.model.common.taxIncludedAmount").$D("含税扣款额") }}: {{ item.taxIncludedAmount|CalcMoney|CalcMicrometer }}</span>
                <span>{{ $T("sfin.supplierChargeEntry.model.relationAmount").$D("已扣款额") }}: {{ item.relationAmount|CalcMoney|CalcMicrometer }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.supplierChargeEntry.model.remainingDeductionAmount").$D("剩余可扣款额") }}: {{ item.remainingDeductionAmount|CalcMoney|CalcMicrometer }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.supplierChargeEntry.model.deductionRemark").$D("扣款说明") }}: {{ item.remark }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sfin.supplierChargeEntry.model.deductionAmount").$D("本次扣款额") }}:</span>
              <span>{{ item.deductionAmount|CalcMoney|CalcMicrometer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 行信息详情弹窗 -->
    <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="bottom">
      <section class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closeLineInfoDetail">
            <img src="@/assets/icon_close_normal@3x.png" class="image-gray-default" alt >
          </div>
          <div
            slot="center"
            class="header">
            {{ $T("hipspfm.invoiceBill.view.message.invoiceInformation").$D("发票信息") }}
          </div>
        </hips-nav-bar>
        <div class="lineHead">
          <li>
            <span>{{ lineInfoDetail.poNumAndLineNum }}</span>
            <span
              style="color: var(--color-font-default-e)">{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceLineNum").$D("发票行") }}: {{ lineInfoDetail.invoiceLineNum }}</span>
          </li>
          <p>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码") }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称") }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div class="lineBody">
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量") }}：</span>
            <span>{{ lineInfoDetail.quantity }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.unitPriceBatch").$D("每") }}：</span>
            <span>{{ lineInfoDetail.unitPriceBatch }}</span>
          </li>
          <li v-if="basePrice === 'NET_PRICE'">
            <span :class="lineInfoDetail.netPrice === lineInfoDetail.orignNetPrice ? '' : 'code-red'">{{ $T("sfin.invoiceBill.model.invoiceBill.rawNetPrice").$D("原不含税价") }}：</span>
            <span>{{ lineInfoDetail.orignNetPrice|CalcMoney|CalcMicrometer }}</span>
          </li>
          <li v-else>
            <span :class="lineInfoDetail.taxIncludedPrice === lineInfoDetail.orignTaxIncludedPrice ? '' : 'code-red'">{{ $T("sfin.invoiceBill.model.invoiceBill.orignTaxPrice").$D("原含税价") }}：</span>
            <span>{{ lineInfoDetail.orignTaxIncludedPrice|CalcMoney|CalcMicrometer }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位") }}：</span>
            <span>{{ lineInfoDetail.uomName }}</span>
          </li>
          <li>
            <span :class="lineInfoDetail.netPrice === lineInfoDetail.orignNetPrice ? '' : 'code-red'">
              {{ $T("sfin.invoiceBill.model.invoiceBill.netPrice").$D("不含税单价") }}：
            </span>
            <span>{{ lineInfoDetail.netPrice|CalcMoney(10) }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额") }}：</span>
            <span>{{ lineInfoDetail.netAmount|CalcMoney|CalcMicrometer }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxRate").$D("税率") }}(%)：</span>
            <span>{{ lineInfoDetail.taxRate }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额") }}：</span>
            <span>{{ lineInfoDetail.taxAmount|CalcMoney|CalcMicrometer }}</span>
          </li>
          <li>
            <span :class="lineInfoDetail.taxIncludedPrice === lineInfoDetail.orignTaxIncludedPrice ? '' : 'code-red'">
              {{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedPrice").$D("含税单价") }}：
            </span>
            <span>{{ lineInfoDetail.taxIncludedPrice|CalcMoney(10) }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额") }}：</span>
            <span>{{ lineInfoDetail.taxIncludedAmount|CalcMoney|CalcMicrometer }}</span>
          </li>
          <li>
            <span :class="lineInfoDetail.priceDifferenceMsg === 'normal' ? '' : 'code-red'">{{ $T("sfin.invoiceBill.model.invoiceBill.priceDifferenceFlag").$D("比对结果") }}：</span>
            <span>{{ lineInfoDetail.priceDifferenceMsgMeaning }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.specificationsAndModel").$D("规格型号") }}：</span>
            <span>{{ lineInfoDetail.specificationsAndModel }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.displayReleaseNum").$D("发放号") }}：</span>
            <span>{{ }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.displayLineLocationNum").$D("发运号") }}：</span>
            <span>{{ lineInfoDetail.displayLineLocationNum }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.asnNum").$D("送货单号|行号") }}：</span>
            <span>{{ lineInfoDetail.asnNumAndAsnLineNum }}</span>
          </li>
          <li>
            <span>{{ $T("hipspfm.invoiceBill.model.invoiceBill.thingNumber").$D("事物编号") }}|{{ $T("sfin.invoiceBill.model.invoiceBill.lineNo").$D("行号") }}：</span>
            <span>{{ lineInfoDetail.trxAndLineNum }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.billNumAndBillLineNum").$D("对账单号|行号") }}：</span>
            <span>{{ lineInfoDetail.billNumAndBillLineNum }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.trxDate").$D("事务日期") }}：</span>
            <span>{{ lineInfoDetail.trxDate }}</span>
          </li>
          <div class="line-div">
            <span class="line-block"/>
          </div>
        </div>
      </section>
    </hips-popup>
    <!-- 审核意见 -->
    <hips-popup v-model="showAuditAppr" class="FullPop" style="width:100%" position="top">
      <div class="contentText">
        <hips-textarea
          v-model="auditOpinionAppr"
          :label="$T('sfin.invoiceBill.model.invoiceBill.approvedRemark').$D('审核意见')"
          :placeholder="'    '+$T('hipspfm.invoiceBill.message.validation.approvedRemark').$D('请输入审核意见')+'('+$T('hipspfm.invoiceBill.message.validation.notRequired').$D('非必填')+')'"
          label-position="top"
          auto-height
          :max-height="168"/>
      </div>
      <div class="handlerWrap">
        <span
          class="reset"
          @click="showAuditAppr = false">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        <span class="submitWrap" @click="submit">{{ $T("hipspfm.common.message.pass").$D("通过") }}</span>
      </div>
    </hips-popup>
    <hips-popup v-model="showAuditRej" class="FullPop" style="width:100%" position="top">
      <div class="contentText">
        <hips-textarea
          v-model="auditOpinionRej"
          :label="$T('sfin.invoiceBill.model.invoiceBill.approvedRemark').$D('审核意见')"
          :placeholder="'    '+$T('hipspfm.invoiceBill.message.validation.approvedRemark').$D('请输入审核意见')+'('+$T('hipspfm.invoiceBill.message.validation.notRequired').$D('非必填')+')'"
          label-position="top"
          auto-height
          :max-height="168"/>
      </div>
      <div class="handlerWrap">
        <span
          class="reset"
          @click="showAuditAppr = false">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        <span
          class="cancleWrap"
          @click="cancle">{{ $T("sfin.invoiceBill.model.invoiceBill.return").$D("退回") }}</span>
      </div>
    </hips-popup>
    <div id="FootButton" class="invite">
      <span
        @click="showAuditRej = true">{{ $T("sfin.invoiceBill.model.invoiceBill.return").$D("退回") }}</span>
      <span @click="showAuditAppr = true">{{ $T("hipspfm.common.message.pass").$D("通过") }}</span>
    </div>
  </section>
</template>

<script>
import BScroll from "better-scroll";
import { Popup, NavBar, Textarea } from "hips";
import { getApproveConfirmApi, getApproveRejectApi } from "../api/index";
import { getSettingsApi } from "@/modules/CreateInvoice/api";
export default {
  modules: [ "sfin.invoiceBill", "hipspfm.invoiceBill", "hipspfm.common", "sfin.common", "sfin.supplierChargeEntry" ],
  name: "TabScroll",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
  },
  props: {
    headInfo: {
      type: Object,
      default: {}
    },
    showFilePop: {
      type: Function
    },
    lineInfo: Array,
    taxInfo: Array,
    ledgerAccount: {
      type: Object | Array,
      default: {}
    },
  },
  data() {
    return {
      scroll: "",
      show: false,
      showAuditAppr: false, // 审批模态框
      showAuditRej: false,
      auditOpinionAppr: "", //审批意见
      auditOpinionRej: "", //审批意见
      navIndex: 0,
      contentLenArr: [],
      lineInfoDetail: {},
      basePrice: "NET_PRICE"
    };
  },
  computed: {
    showWarning() {
      const headInfo = this.headInfo;
      return headInfo.taxIncludedAmountSystemMeaning === headInfo.taxIncludedAmountMeaning && headInfo.taxAmountMeaning === headInfo.taxAmountSystemMeaning;
    },
    navArr() {
      return [
        this.$T("sfin.invoiceBill.view.nonConsignmentInvoiceHeader").$D(
          "非寄售发票头信息"
        ),
        this.$T("sfin.invoiceBill.model.invoiceBill.invoiceLineNum").$D(
          "发票行"
        ),
        this.$T("sfin.invoiceBill.view.taxInvoiceRow").$D("税务发票行"),
        this.$T("sfin.invoiceBill.view.inf").$D("总账科目")
      ];
    }
  },
  watch: {
    lineInfo: {
      handler() {
        this.$nextTick(() => {
          this.contentLenArr = [
            this.$refs.headInfo.offsetHeight,
            this.$refs.lineInfo.offsetHeight,
            this.$refs.logisticsInfo.offsetHeight,
            this.$refs.ledgerAccount.offsetHeight
          ];
          const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 490;
          this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
          this.scroll && this.scroll.refresh();
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.navScroll = new BScroll(this.$refs.navWrap, {
        scrollX: true,
        click: true
      });
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
    this.getSettings();
  },
  methods: {
    // 获取配置中心单价修改规则
    getSettings() {
      const value = "010505";
      //扣款基准价 010531 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      //对账及开票基准价 010505 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      getSettingsApi().then((res) => {
        this.basePrice = res[value] === "" ? "NET_PRICE" : res[value];
      });
    },
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    closeLineInfoDetail() {
      this.show = false;
    },
    // 切换tab
    changeNav(index) {
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;
      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 600, "bounce");
      });
      this.navIndex = index;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      const len1 = -this.contentLenArr[0];
      const len2 = len1 - this.contentLenArr[1];
      const len3 = len2 - this.contentLenArr[2];
      if (y > len1 && y < 100) {
        this.navIndex = 0;
      } else if (y > len2 && y <= len1) {
        this.navIndex = 1;
      } else if (y > len3 && y <= len2) {
        this.navIndex = 2;
      } else {
        this.navIndex = 3;
      }
    },
    // 退回
    cancle() {
      this.$notification.open({
        message: this.$T("hipspfm.invoiceBill.view.message..submitting").$D(
          "提交中"
        ),
        description: "",
        key,
        class: "notification"
      });
      let params = {
        invoiceHeaderId: this.headInfo.invoiceHeaderId,
        approvedRemark: this.auditOpinionRej
      };
      let paramsArr = [];
      paramsArr.push(params);
      getApproveRejectApi(paramsArr).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$hips.toast({
            message: res.message,
            duration: 1500
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            description: "",
            key,
            class: "notification"
          });
          const _this = this;
          setTimeout(() => {
            _this.$router.replace({ name: "CheckPayableInvoiceList" });
          }, 1500);
        }
      });
    },
    // 通过
    submit() {
      this.$notification.open({
        message: this.$T("hipspfm.invoiceBill.view.message..submitting").$D(
          "提交中"
        ),
        description: "",
        key,
        class: "notification"
      });
      let params = {
        invoiceHeaderId: this.headInfo.invoiceHeaderId,
        approvedRemark: this.auditOpinionAppr
      };
      let paramsArr = [];
      paramsArr.push(params);
      getApproveConfirmApi(paramsArr).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$hips.toast({
            message: res.message,
            duration: 1500
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            description: "",
            key,
            class: "notification"
          });
          const _this = this;
          setTimeout(() => {
            _this.$router.replace({ name: "CheckPayableInvoiceList" });
          }, 1500);
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.code-red {
  color: #ff0000 !important;
}
</style>

<style scoped  lang="stylus">
@import '../../../style/mixin.styl'
.blackFont {
  color:var(--color-font-default,#1b1e2b);
}

.closeFont {
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c) !important;
}

.noContent {
  height: 78px;
  padding-left: 20px;

  span {
    position: relative;
    top: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color:var(--color-font-default-b);
    letter-spacing: 0;
    line-height: 22px;
  }
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color:var(--color-font-default,#1b1e2b);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
          content: '';
        }
      }
    }
  }

  .materiel-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lineOverflow {
    & span:nth-child(1) {
      flex: 0 1 300px !important;
    }

    & span:nth-child(2) {
      line-height: 16px !important;
    }
  }

  .moreInfo {
    align-self: flex-end;
    width: 18.3px;
    height: 18.3px;
  }

  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    .content {
      .infoContent {
        .invoiceHead {
          margin-left: 20px;
          padding: 15px 20px 15px 0;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default,#1b1e2b);
          line-height: 22px;
          border-bottom:1px solid var(--color-border-default);
          display: flex;
          justify-content: flex-start;

          span:nth-child(2) {
            color:var(--color-font-default-b);
            width: 207px;
          }

          span:nth-child(1) {
            width: 108px;
          }
        }

        .invoiceHead:nth-child(1), .invoiceHead:nth-child(2), .invoiceHead:nth-child(4), .invoiceHead:nth-child(5) {
          span:nth-child(2) {
            color:var(--color-font-default,#1b1e2b);
            font-weight: bold;
          }
        }

        h3 {
          padding: 20px 20px 12px 20px;
          margin-bottom: 4px;
          font-size: 18px;
          color:var(--color-font-default,#1b1e2b);
          line-height: 26px;
          font-weight: bold;
          background: var(--color-bg-default-b);
        }

        .info_h3 {
          border-top:8px solid var(--color-border-default);
          height: 50px;
          font-size: 18px;
          padding: 12px 20px;
          line-height: 26px;
          font-weight: 600;
          background:var(--color-bg-default);
        }

        .footInfo {
          padding: 15px 15px 15px 20px;
          border-bottom: 8px solid #F0F2F5;
          font-family: PingFangSC-Medium;
          color:var(--color-font-default,#1b1e2b);
          font-size: 14px;
          display: flex;
          font-weight: bold;

          span:nth-child(1) {
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 11px;
          margin: 15px 0 3px 20px;
          border-bottom:1px solid var(--color-border-default);
          padding-right: 20px;

          // line-height: 26px;
          span:nth-child(3) {
            color: var(--color-font-default-e);
            font-size: 14px;
            position: absolute;
            right: 20px;
            line-height: 22px;
          }

          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: var(--color-other-default-b);
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color:var(--color-font-default,#1b1e2b);
            line-height: 22px;
            display: flex;
            justify-content: space-between;
            font-weight: bold;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              // color: var(--color-other-default-b);
              text-align: right;
              line-height: 22px;
              font-weight: normal;
            }

            .status {
              text-align: right;
            }

            .status1 {
              color: var(--color-font-default-e);
            }

            .status2 {
              color: var(--color-other-default-b);
            }

            .status3 {
              color: var(--color-other-default);
            }

            .status4 {
              color: var(--color-other-default-c);
            }

            .status5 {
              color: var(--color-other-default-c);
            }
          }
        }

        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 11px;
            border-bottom:1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 10px 20px 0 0;
            margin-bottom: 2px;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default,#1b1e2b);
              line-height: 22px;
            }
          }

          div {
            padding: 8px 20px 0px 20px;

            li {
              padding: 0;

              .tag {
                display: inline-block;
                width: 30px;
                margin-left: 5px;
                color: var(--color-other-default);
                font-size: 10px;
                line-height: 18px;
                text-align: center;
                border-radius: 1px;
                border: 1px solid var(--color-other-default);
              }

              &:nth-child(2) {
                span {
                  line-height: 22px;
                  font-size: 14px;
                  color:var(--color-font-default,#1b1e2b);
                }
              }
            }
          }
        }

        >>> .hips-input {
          font-family: 'PingFangSC-Regular';
          font-size: 14px;
          line-height: 22px;
          color:var(--color-font-default,#1b1e2b);
        }

        >>> .hips-input__input-value input {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default,#1b1e2b);
          line-height: 22px;
        }

        .input-edit {
          margin-top: 18px;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-size: 20px;
    line-height: 32px;
  }

  .lineHead {
    padding: 12px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default,#1b1e2b);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid #F0F2F5;

    li {
      padding: 0;
      margin-bottom: 4px;
      height: 24px;
      display: flex;
      justify-content: space-between;

      span:nth-child(1) {
        font-weight: bold;
      }

      span:nth-child(2) {
        color: var(--color-font-default-e);
      }
    }

    p {
      span {
        color:var(--color-font-default,#1b1e2b);
        line-height: 24px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 4px;
  }

  .lineBody {
    background-color:var(--color-font-default-d);
    overflow: auto;

    li {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px 15px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default,#1b1e2b);
        line-height: 22px;

        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 224px;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;

          img {
            width: 12px;
            height: 12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }

    .line-div {
      height: 34px;
      display: flex;
      justify-content: center;

      .line-block {
        width: 35.7%;
        height: 6px;
        // border-radius:100px;
        // background-color : #000000;
        position: relative;
        bottom: -18px;
      }
    }
  }
}

.contentText {
  >>> .hips-textarea {
    padding: 10px 20px;
  }

  >>> .hips-textarea__label-value {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default,#1b1e2b);
    line-height: 26px;
    font-weight: bold;
  }

  >>> .hips-textarea__body {
    height: 174px;
  }

  >>> .hips-textarea__input-value textarea {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default,#1b1e2b);
    letter-spacing: 0.7px;
    line-height: 28px;
  }

  >>> .hips-textarea__input-value textarea::-webkit-input-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    background-size: 20px 20px;
    color: var(--color-font-default-e);
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-moz-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::-moz-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-ms-input-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat !important;
    color: var(--color-font-default-e);
    background-size: 20px 20px !important;
    background-position-y: 3px !important;
  }

  >>> .hips-textarea__input-value textarea::-ms-input-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }
}

.handlerWrap {
  display: flex;

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default-b);
    line-height: 56px;
    text-align: center;
  }

  .submitWrap {
    color:var(--color-font-default-d);
    background: var(--color-other-default-b);
  }

  .cancleWrap {
    color:var(--color-font-default-d);
    background: var(--color-other-default) !important;
  }
}

.invite {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    font-weight: bold;
    border-right: 1px solid #F0F2F5;
  }

  span:nth-child(odd) {
    color:var(--color-font-default-b);
  }
}
</style>
