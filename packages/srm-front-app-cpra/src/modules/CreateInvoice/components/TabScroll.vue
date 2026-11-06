<!--eslint-disable-->
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
          <div>
            <div class="invoiceHead">
              <li @click="showDatepop">
                <div class="left">
                  <span style="color: var(--color-other-default)">*</span>
                  <span>{{ $T("sfin.invoiceBill.model.invoiceBill.billingDate").$D("开票日期") }}：</span>
                </div>
                <div class="right">
                  <span
                    v-if="!headInfo.taxInvoiceDateIssued"
                    :style="dateTip? 'color:var(--color-other-default)':''">{{ $T("hipspfm.invoiceInspection.view.message.selectBillingDate").$D("请选择开票日期") }}</span>
                  <span v-else class="diffColor">{{ headInfo.taxInvoiceDateIssued|CalcDate }}</span>
                  <img v-show="!dateTip" class="image-gray-default" src="@/assets/CreateInvoice/icon_list_date_normals@3x.png" >
                  <img v-show="dateTip" class="image-red-default" src="@/assets/CreateInvoice/icon_list_date_warning@3x.png" >
                </div>
              </li>
            </div>
            <div class="invoiceHead">
              <hips-input
                :value="headInfo.taxInvoiceNum"
                :label="$T('sfin.invoiceBill.model.invoiceBill.taxInvoiceNum').$D('税务发票号码')+'：'"
                :placeholder="$T('hispfm.createInvoice.view.message.inputTaxationInvoiceNumber').$D('请填写税务发票号码')"
                :class="codeTip ? 'changePlaceholder':''"
                type="text"
                label-position="left"
                required>
                <div slot="right">
                  <img v-show="!codeTip" src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
                  <img
                    v-show="codeTip"
                    src="@/assets/CreateInvoice/icon_list_editor_warning@3x.png"
                    class="input-edit image-red-default">
                </div>
              </hips-input>
            </div>
            <div class="invoiceHead">
              <hips-input
                :value="headInfo.taxInvoiceCode"
                :label="$T('sfin.invoiceBill.model.invoiceBill.invoiceCode').$D('税务发票代码')+'：'"
                :placeholder="$T('hispfm.createInvoice.view.message.inputTaxationInvoiceCode').$D('请填写税务发票代码')"
                :class="codeTip ? 'changePlaceholder':''"
                type="text"
                label-position="left">
                <div slot="right">
                  <img v-show="!codeTip" src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
                  <img
                    v-show="codeTip"
                    src="@/assets/CreateInvoice/icon_list_editor_warning@3x.png"
                    class="input-edit image-red-default">
                </div>
              </hips-input>
            </div>
            <div class="invoiceHead">
              <hips-input
                :value="headInfo.taxIncludedAmount"
                :label="$T('sfin.invoiceBill.model.invoiceBill.invoicePrice').$D('发票总额')+'：'"
                :placeholder="$T('hispfm.createInvoice.view.message.inputInvoiceAmount').$D('请填写发票总额')"
                :class="amountTip ? 'changePlaceholder':''"
                type="text"
                label-position="left"
                required
                @on-change="numberInputCheck(headInfo,'taxIncludedAmount')">
                <div slot="right">
                  <img v-show="!amountTip" src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
                  <img
                    v-show="amountTip"
                    src="@/assets/CreateInvoice/icon_list_editor_warning@3x.png"
                    class="input-edit image-red-default">
                </div>
              </hips-input>
            </div>

            <div class="invoiceHead">
              <hips-input
                :value="headInfo.taxAmount"
                :label="$T('sfin.invoiceBill.model.invoiceBill.invoiceTaxAmount').$D('发票税额')+'：'"
                :placeholder="$T('hispfm.createInvoice.view.message.inputInvoiceTaxAmount').$D('请填写发票税额')"
                :class="taxTip ? 'changePlaceholder':''"
                type="text"
                label-position="left"
                required
                @on-change="numberInputCheck(headInfo,'taxAmount')">
                <div slot="right">
                  <img v-show="!taxTip" src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
                  <img
                    v-show="taxTip"
                    src="@/assets/CreateInvoice/icon_list_editor_warning@3x.png"
                    class="input-edit image-red-default">
                </div>
              </hips-input>
            </div>
            <div class="invoiceHead">
              <hips-textarea
                :value="headInfo.remark"
                :label="$T('sfin.invoiceBill.model.invoiceBill.invoiceRemark').$D('发票备注')+'：'"
                :placeholder="$T('hispfm.createInvoice.view.message.inputInvoiceRemark').$D('请填写发票备注')"
                type="text"
                label-position="left"
                auto-height>
                <div slot="right">
                  <img src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
                </div>
              </hips-textarea>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.drawerSupplierName").$D("出票方") }}：</span>
              <span>{{ headInfo.approvedBy }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span class="code" >{{ $T("sfin.invoiceBill.model.payableInvoice.totalNonTax").$D("未税总额(系统)") }}：</span>
              <span>{{ headInfo.taxWithoutAmount }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmountSystem").$D("含税总额(系统)") }}：</span>
              <span>{{ headInfo.taxIncludedAmountSystemMeaning|CalcMoney|CalcMicrometer }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.taxAmountSystem").$D("税额（系统）") }})：</span>
              <span>{{ headInfo.taxAmountSystemMeaning|CalcMoney|CalcMicrometer }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span class="code" >{{ $T("sfin.invoiceBill.model.invoiceBill.").$D("扣款金额") }}：</span>
              <span>{{ headInfo.deductedTaxIncludedAmount }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span class="code" >{{ $T("sfin.invoiceBill.model.invoiceBill.deductionTaxAmount").$D("扣款税额") }}：</span>
              <span>{{ headInfo.deductedTaxAmount }}</span>
            </div>
            <div class="invoiceHead invoiceHeadSpan">
              <span
                class="code">{{ $T("sfin.invoiceBill.model.invoiceBill.supplierSiteName").$D("供应商地址") }}：</span>
              <span>{{ headInfo.supplierSiteName }}</span>
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
                <span class="status1">{{ headInfo.invoiceStatusMeaning }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.ouName").$D("业务实体") }}： {{ headInfo.ouName }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.purAgentName").$D("采购员") }}： {{ headInfo.regionName }}</span>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.currencyCode").$D("币种") }}： {{ headInfo.currencyCode }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceTitle").$D("开票主体") }}： {{ headInfo.invoiceTitle }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sfin.invoiceBill.model.invoiceBill.purchaseOrgNam").$D("采购组织") }}:</span>
              <span>{{ headInfo.purOrganizationName }}</span>
            </div>
          </div>
        </div>
        <div ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceLineNum").$D("发票行") }}</h3>
          <div v-if="lineInfo.length === 0" class="noContent">
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
                <span>{{ item.asnNumAndAsnLineNum }}</span>
                <span
                  style="color: var(--color-font-default-e)">{{ $T("hispfm.createInvoice.view.message.invoiceLineNum").$D("发票行号") }}: {{ item.invoiceLineNum }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称") }}: {{ item.itemName }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码") }}: {{ item.itemCode }}</span>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量") }}: {{ item.quantity|CalcMicrometer }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位") }}: {{ item.uomName }}</span>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxRate").$D("税率") }}: {{ item.taxRate }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedPrice").$D("含税单价") }}: {{ item.taxIncludedPriceMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额") }}: {{ item.taxAmountMeaning }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sfin.invoiceBill.model.invoiceBill.all.taxIncludedAmount").$D("含税总金额") }}:</span>
              <span>{{ item.taxIncludedAmountMeaning }}</span>
            </div>
          </div>
        </div>
        <div ref="logisticsInfo" class="infoContent headInfo">
          <h3>
            {{ $T("sfin.invoiceBill.view.taxInvoiceRow").$D("税务发票行") }}
            <span
              v-if="taxInfo.length != 0"
              @click="taxLineCheck">{{ $T("hispfm.createInvoice.view.message.allCheck").$D("全部查验") }}</span>
            <span
              v-else
              style="background:var(--color-bg-default-f);">{{ $T("hispfm.createInvoice.view.message.allCheck").$D("全部查验") }}</span>
          </h3>
          <div v-if="taxInfo.length == 0" class="noContent">
            <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoTaxInvoiceRow").$D("暂无税务发票行信息") }}</span>
          </div>
          <div v-for="(item,index) in taxInfo" v-else :key="index" @click="editInvoiceLine(item)">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span>{{ $T("sfin.inputInvoice.model.invoiceCode").$D("发票代码") }}: {{ item.invoiceCode }}</span>
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
                <span>{{ $T("sfin.inputInvoice.model.invoiceNumber").$D("发票号码") }}： {{ item.invoiceNumber }}</span>
              </li>
              <li>
                <span
                  class="materiel-name">{{ $T("sfin.invoiceBill.model.invoiceBill.checkStateExplain").$D("查验状态说明") }}： {{ item.validateMessage }}</span>
                <i>
                  <srm-tooltip
                    v-if="item.validateMessage"
                    placement="left"
                    :title="item.validateMessage">
                    <img src="@/assets/CreateInvoice/icon_more@3x.png" class="moreInfo image-blue-default" >
                  </srm-tooltip>
                </i>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.billingDate").$D("开票日期") }}： {{ item.billingDate|CalcDate }}</span>
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
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceType").$D("发票种类") }}： {{ item.noDepositInvoiceTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sfin.invoiceBill.model.invoiceBill.invoiceDirection").$D("发票方向") }}： {{ item.invoiceDirectionMeaning }}</span>
              </li>
            </ul>
            <div class="footInfo footInfo1">
              <span>{{ $T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额") }}: {{ item.totalAmount|CalcMoney|CalcMicrometer }}</span>
              <div>
                <span
                  @click.stop="taxLineCheck(item)">{{ $T("hipspfm.common.button.inspection").$D("查验") }}</span>
                <span
                  @click.stop="taxLineDelete(item)">{{ $T("hipspfm.common.button.delete").$D("删除") }}</span>
              </div>
            </div>
          </div>
        </div>

        <div ref="ledgerAccount" class="infoContent lineInfo">
          <h3>{{ $T("sfin.invoiceBill.view.inf").$D("总账科目") }}</h3>
          <div v-if="ledgerAccount.length === 0" class="noContent">
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
            <img src="@/assets/CreateInvoice/icon_close_normal@3x.png" class="image-gray-default" alt >
          </div>
          <div
            slot="center"
            class="header">
            {{ $T("hispfm.createInvoice.view.message.tirtle.workInfo").$D("事务信息") }}
          </div>
        </hips-nav-bar>
        <div class="lineHead">
          <li>
            <span>{{ lineInfoDetail.poNumAndLineNum }}</span>
            <span
              style="color: var(--color-font-default-e)">{{ $T("hispfm.createInvoice.view.message.invoiceLineNum").$D("发票行号") }}: {{ lineInfoDetail.invoiceLineNum }}</span>
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
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位") }}：</span>
            <span>{{ lineInfoDetail.uomName }}</span>
          </li>
          <li v-if="lineInfoDetail.netPriceUpdFlag === 0">
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.netPrice").$D("不含税单价") }}：</span>
            <span class="otherFont">{{ netPrice }}</span>
          </li>
          <hips-input
            v-else
            v-model="lineInfoDetail.netPrice"
            :label="$T('sfin.invoiceBill.model.invoiceBill.netPrice').$D('不含税单价')+'：'"
            :placeholder="$T('hipspfm.createInvoice.view.message.inputNetPrice').$D('请填写不含税单价')"
            type="text"
            label-position="left"
            @on-change="onNetPriceChanged">
            <div slot="right">
              <img src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
            </div>
          </hips-input>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额") }}：</span>
            <span class="otherFont">{{ netAmount }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.rawNetPrice").$D("原不含税价") }}：</span>
            <span>{{ lineInfoDetail.rawNetPrice }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxRate").$D("税率") }}(%)：</span>
            <span class="otherFont">{{ lineInfoDetail.taxRate }}</span>
          </li>
          <hips-input
            v-model="lineInfoDetail.taxAmount"
            :label="$T('sfin.invoiceBill.model.invoiceBill.taxAmount').$D('税额')+'：'"
            :placeholder="$T('hipspfm.createInvoice.view.message.inputTaxAmount').$D('请填写税额')"
            type="text"
            label-position="left"
            :readonly="lineInfoDetail.taxAmountUpdFlag === 0"
            @on-change="numberInputCheck(lineInfoDetail,'taxAmount')">
            <div v-if="lineInfoDetail.taxAmountUpdFlag === 1" slot="right">
              <img src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
            </div>
          </hips-input>

          <li v-if="lineInfoDetail.taxIncludePriceUpdFlag === 0">
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedPrice").$D("含税单价") }}：</span>
            <span class="otherFont">{{ taxIncludedPrice }}</span>
          </li>
          <hips-input
            v-else
            v-model="lineInfoDetail.taxIncludedPrice"
            :label="$T('sfin.invoiceBill.model.invoiceBill.taxIncludedPrice').$D('含税单价')+'：'"
            :placeholder="$T('hipspfm.createInvoice.view.message.inputTaxIncludedPrice').$D('请填写含税单价')"
            type="text"
            label-position="left"
            @on-change="onTaxIncludePriceChanged">
            <div slot="right">
              <img src="@/assets/CreateInvoice/icon_editor@3x.png" class="input-edit image-gray-default" >
            </div>
          </hips-input>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额") }}：</span>
            <span class="otherFont">{{ taxIncludedAmount }}</span>
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
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.asnNumAndAsnLineNum").$D("送货单号|行号") }}：</span>
            <span>{{ lineInfoDetail.asnNumAndAsnLineNum }}</span>
          </li>
          <li>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.trxAndLineNum").$D("事务编号|行号") }}：</span>
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
      <div class="invite">
        <span @click="show = false">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        <span
          @click="confirmInvoice">{{ $T("hipspfm.common.button.save").$D("保存") }}</span>
      </div>
    </hips-popup>
    <!-- 日期弹窗 -->
    <date-chooser
      v-model="showDate"
      :title="$T('hipspfm.invoiceInspection.view.message.selectBillingDate').$D('请选择开票日期')"
      @submitDate="handleConfirm"/>

    <!-- 编辑开票日期弹窗结束 -->
    <div id="FootButton" class="invite">
      <span @click="save">{{ $T("hipspfm.common.button.save").$D("保存") }}</span>
      <span @click="approvel">{{ $T("hipspfm.common.button.submit").$D("提交") }}</span>
      <span class="addMethods">
        <transition name="slide-fade">
          <i v-if="showAdd" @click="showAddModal" ><img class="image-blue-default" src="@/assets/CreateInvoice/icon_add@3x.png" ></i>
        </transition>
      </span>
    </div>

    <hips-popup
      v-model="addModal"
      class="addModal top-boder-radius"
      style="height:40%;width:100%"
      position="bottom">
      <li>
        <span>{{ $T("hispfm.createInvoice.validation.message.addInvoiceToTaxInvoiceRow").$D("您将新增发票至税务发票行") }}</span>
      </li>
      <li>
        <div @click="goManualEntry">
          <img class="image-yellow-default" src="@/assets/CreateInvoice/icon_invoice_manualEntry@3x.png" alt >
          <div>{{ $T("hipspfm.invoiceInspection.view.message.manualEntry").$D("手工录入") }}</div>
        </div>
        <div @click="goScanner">
          <img class="image-blue-default" src="@/assets/CreateInvoice/icon_invoice_sweep@3x.png" alt >
          <div>{{ $T("hipspfm.invoiceInspection.view.message.scanAdd").$D("扫描添加") }}</div>
        </div>
        <div @click="goOcR">
          <img class="image-blue-default" src="@/assets/CreateInvoice/icon_invoice_ocrRecognition@3x.png" alt >
          <div>{{ $T("sfin.invoiceBill.view.button.invoiceBill.ocrDistinguish").$D("OCR识别") }}</div>
        </div>
      </li>
      <li @click="showAddModal">
        <img class="image-blue-default" src="@/assets/CreateInvoice/page_close@3x.png" alt >
      </li>
    </hips-popup>
  </section>
</template>

<script>
/*eslint-disable*/
import BScroll from "better-scroll";
import * as dd from "dingtalk-jsapi";
import { scanBridge } from "srm-mobile-ui/src/utils/jsBridge";
import { numberInputCheck1 } from "@/utils/index";
import DateChooser from "@/components/DateChooser";
import { Popup, NavBar, Textarea, Input } from "hips";
import {
  getSaveApi,
  getSubmitApi,
  batchCheckApi,
  batchRemoveApi, getRulesApi, getSettingsApi, updateInvoiceLineApi
} from "../api/index";
import SrmAppCore from "srm-front-app-core";

export default {
  modules: [ "sfin.invoiceBill", "smbl.invoice", "hipspfm.invoiceInspection", "hipspfm.invoiceBill", "hipspfm.common", "hispfm.createInvoice", "sfin.inputInvoice", "sfin.common", "sfin.supplierChargeEntry", "hipspfm.createInvoice" ],
  name: "TabScroll",
  components: {
    DateChooser,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
    [Input.name]: Input
  },
  props: {
    headInfo: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    showFilePop: {
      type: Function
    },
    getOrderTax: {
      type: Function
    },
    getOrderHeader: {
      type: Function
    },
    getOrderLine:{
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
      navIndex: 0,
      addModal: false,
      contentLenArr: [],
      lineInfoDetail: {},
      dateTip: false, // 开票日期tip
      codeTip: false, // 税额发票代码tip
      amountTip: false, // 发票总额tip
      taxTip: false, // 发票税额tip
      showDate: false, // 开票日期弹窗
      choseedDate: "",
      showAdd :false, // 添加按钮
      priceRule: {
        taxUpdFlag: 0,
        taxAmountUpdFlag: 0,
        quantityUpdFlag: 0,
        priceUpdFlag: 0,
        taxAmountTolerance: 0,
      },
      taxAmount: 0,
      basePrice: "NET_PRICE"
    };
  },
  computed:{
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
    },
    basePriceTaxFlag() {
      return this.basePrice && this.basePrice === "TAX_INCLUDED_PRICE";
    },
    netPrice() {
      if (!this.lineInfoDetail.quantity) {
        return 0;
      }
      if (this.basePriceTaxFlag) {
        return Number(Number(this.taxIncludedPrice) / (1 + Number(this.lineInfoDetail.taxRate / 100.0))).toFixed(10);
      }
      return Number(this.lineInfoDetail.netPrice).toFixed(10);

    },
    taxIncludedPrice() {
      if (!this.lineInfoDetail.quantity) {
        return 0;
      }
      if (this.lineInfoDetail.taxIncludedPrice) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineInfoDetail.taxIncludedPrice = Number(this.lineInfoDetail.taxIncludedPrice).toFixed(10);
      }
      if (this.basePriceTaxFlag) {
        return this.lineInfoDetail.taxIncludedPrice;
      }
      return Number(Number(this.netPrice) * (1 + Number(this.lineInfoDetail.taxRate) / 100.0)).toFixed(10);

    },
    netAmount() {
      if (!this.lineInfoDetail.quantity) {
        return 0;
      }
      if (this.basePriceTaxFlag) {
        //若基准价含税，含税金额减税额计算；
        return Number(this.taxIncludedAmount) - Number(this.lineInfoDetail.taxAmount);
      }
      //若基准价不含税，round(不含税单价*数量/每,2）
      // round(不含税金额*税率，2)，
      const result = Number(Number(this.netPrice) * Number(this.lineInfoDetail.quantity) / Number(this.lineInfoDetail.unitPriceBatch)).toFixed(2);
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.lineInfoDetail.taxAmount = this.lineInfoDetail.taxAmount || Number(result * Number(this.lineInfoDetail.taxRate / 100.0)).toFixed(2);
      return result;

    },
    taxIncludedAmount() {
      if (!this.lineInfoDetail.quantity) {
        return 0;
      }
      if (this.basePriceTaxFlag) {
        //若基准价含税，round(含税单价*数量/每,2）
        //round（含税金额/（1+税率）*税率，2）；
        const result = Number(this.taxIncludedPrice * this.lineInfoDetail.quantity / this.lineInfoDetail.unitPriceBatch).toFixed(2);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineInfoDetail.taxAmount = this.lineInfoDetail.taxAmount || Number(result / (1 + Number(this.lineInfoDetail.taxRate / 100.0)) * Number(this.lineInfoDetail.taxRate / 100.0)).toFixed(2);
        return result;
      }
      //若若基准价不含税，不含税金额加税额计算
      return Number(this.netAmount) + Number(this.lineInfoDetail.taxAmount);

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
        eventPassthrough: "horizontal",
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
    this.getSettings();
    this.getRules();
  },
  methods: {
    onNetPriceChanged() {
      this.lineInfoDetail.taxAmount = null;
      numberInputCheck(lineInfoDetail, "netPrice");
    },
    onTaxIncludePriceChanged() {
      this.lineInfoDetail.taxAmount = null;
      numberInputCheck(lineInfoDetail, "taxIncludedPrice");
    },
    editInvoiceLine(item) {
      const params = {
        invoiceHeaderId: this.headInfo.invoiceHeaderId,
        taxInvoiceLineId: item.taxInvoiceLineId,
        invoiceCode: item.invoiceCode,
        invoiceNumber: item.invoiceNumber,
        billingDate: item.billingDate,
        invoiceType: item.noDepositInvoiceTypeCode,
        invoiceTypeMeaning: item.noDepositInvoiceTypeMeaning,
        invoiceDirection: item.invoiceDirection,
        invoiceDirectionMeaning: item.invoiceDirectionMeaning,
        totalAmount: item.totalAmount,
        taxAmount: item.taxAmount,
        checkCode: item.checkCode,
        objectVersionNumber: item.objectVersionNumber,
        token: item._token,
      };
      this.$router.push({
        name: "ManualEntryB",
        query: params
      });
    },
    confirmInvoice() {
      this.$loading.show();
      this.lineInfoDetail.taxIncludedAmount = this.taxIncludedAmount;
      this.lineInfoDetail.netAmount = this.netAmount;
      this.lineInfoDetail.netPrice = this.netPrice;
      this.lineInfoDetail.taxIncludedPrice = this.taxIncludedPrice;
      if (this.priceRule.taxAmountUpdFlag && Math.abs(this.taxAmount - this.lineInfoDetail.taxAmount) > this.priceRule.taxAmountTolerance) {
        this.$hips.toast({
          message: this.$T("smbl.invoice.view.taxAmountNotMatch").$D(
            "修改后税额较原税额超过税额允差，无法保存，请修改"
          ),
          duration: 1500
        });
      }
      updateInvoiceLineApi(this.headInfo.invoiceHeaderId, this.lineInfoDetail).then((res) => {
        if (!res.failed) {
          this.$emit("on-save-invoice-line");
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 获取配置中心单价修改规则
    getSettings() {
      const value = "010505";
      //扣款基准价 010531 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      //对账及开票基准价 010505 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      getSettingsApi().then((res) => {
        this.basePrice = res[value] === "" ? "NET_PRICE" : res[value];
      });
    },
    getRules() {
      getRulesApi().then((res) => {
        this.priceRule = res.filter((e) => e.consignmentType === this.headInfo.businessType);
        if (this.priceRule.length > 0) {
          this.priceRule = this.priceRule[0];
        } else {
          this.priceRule = {};
        }
      });
    },
    //日期弹窗显示或隐藏
    showDatepop() {
      setTimeout(() => {
        this.showDate = !this.showDate;
      }, 10);
    },
    //确认时间并选择
    handleConfirm(value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.headInfo.taxInvoiceDateIssued = value;
      this.showDatepop();
    },
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      console.log(this.lineInfoDetail, "linedetail");
      this.taxAmount = data.taxAmount;
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    closeLineInfoDetail() {
      this.show = false;
    },
    // 发票弹窗显示或隐藏
    showAddModal() {
      setTimeout(() => {
        this.addModal = !this.addModal;
      }, 10);
    },
    //扫一扫
    async goScanner() {
      let that = this;
      SrmAppCore.scanQrCode(function (result) {
        console.info(result);
        that.$router.push({
          name: "EditableDetailB",
          query: { result, editable: false, invoiceHeaderId: this.headInfo.invoiceHeaderId }
        });
      }, function (error) {
        that.$notification.open({
          message: _this
              .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
              .$D("扫码异常"),
          key,
          class: "notification",
          duration: 3
        });
      });

      // const navigatorInfo = navigator.userAgent.toLowerCase();
      // if (
      //   navigatorInfo.includes("welink") ||
      //   navigatorInfo.includes("cloudlink")
      // ) {
      //   /** welink **/
      //   await this.getWlScan();
      // } else if (navigatorInfo.indexOf("micromessenger") !== -1) {
      //   /** 微信 **/
      //   await this.getWxScan();
      // } else if (dd.env.platform !== "notInDingTalk") {
      //   console.log("钉钉扫码");
      //   /** 钉钉 **/
      //   await this.getDdScan();
      // } else {
      //   /** APP **/
      //   await this.getAppScan();
      // }
    },
    // welink扫码
    // getWlScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   HWH5.scanCode({ needResult: 1 })
    //     .then((res) => {
    //       let result = JSON.parse(res).result;
    //       console.log(res);
    //       _this.$router.push({
    //         name: "EditableDetailB",
    //         query: { result, editable: false, invoiceHeaderId: this.headInfo.invoiceHeaderId }
    //       });
    //     })
    //     .catch(() => {
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     });
    // },
    // // APP扫码
    // getAppScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   scanBridge()
    //     .then((res) => {
    //       let result = JSON.parse(res).result;
    //       JSON.stringify(res).indexOf(",") === -1 ?
    //         _this.$notification.open({
    //           message:
    //               _this
    //                 .$T("hipspfm.invoiceInspection.view.message.scanError")
    //                 .$D("扫码有误") +
    //               "," +
    //               _this
    //                 .$T(
    //                   "hipspfm.invoiceInspection.validation.message.useManualEntry"
    //                 )
    //                 .$D("请使用手工录入"),
    //           key,
    //           class: "notification",
    //           duration: 3
    //         }) :
    //         _this.$router.push({
    //           name: "EditableDetailB",
    //           query: { result, editable: false, invoiceHeaderId: this.headInfo.invoiceHeaderId }
    //         });
    //     })
    //     .catch(() => {
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     });
    // },
    parseInvoice(text) {
      let dataArr = text.split(",");
      const invoiceCode = dataArr[2];
      const invoiceNumber = dataArr[3];
      const totalAmount = dataArr[4];

      const year = dataArr[5].slice(0, 4) + "-";
      const month = dataArr[5].slice(4, 6) + "-";
      const day = dataArr[5].slice(6, 8);
      const billingDate = `${year}${month}${day}`;
      let checkCodeArr = JSON.stringify(dataArr[6]);
      let checkCodeLen = checkCodeArr.length;
      const checkCode =
          checkCodeArr &&
          checkCodeArr.substring(checkCodeLen - 7, checkCodeLen - 1);
      return {
        invoiceCode,
        invoiceNumber,
        totalAmount,
        billingDate,
        checkCode
      };
    },
    // // 微信扫码
    // getWxScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   const wx = parent.wxBridge || parent.jWeixin;
    //   if (!wx) {
    //     _this.$notification.open({
    //       message: _this
    //         .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //         .$D("扫码异常"),
    //       key,
    //       class: "notification",
    //       duration: 3
    //     });
    //   }
    //   wx.scanQRCode({
    //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //     scanType: [ "qrCode" ], // 可以指定扫二维码还是一维码，默认二者都有
    //     success: function(resC) {
    //       console.log("扫描单号", resC.resultStr);
    //       let result = resC.resultStr; // 当needResult 为 1 时，扫码返回的结果
    //       const invoice = _this.parseInvoice(result);
    //       invoice.invoiceHeaderId = _this.headInfo.invoiceHeaderId;
    //       _this.$router.push({
    //         name: "ManualEntryB",
    //         query: invoice
    //       });
    //     },
    //     fail: function(err) {
    //       console.log("scanerr", err);
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     },
    //     cancel: function(resE) {
    //       console.log("cancel", resE);
    //       _this.$router.push({ name: "CreateInvoiceDetail" });
    //     }
    //   });
    // },
    // // 钉钉扫码
    // getDdScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   dd.ready(function() {
    //     dd.biz.util.scan({
    //       type: "all",
    //       onSuccess: function(data) {
    //         console.log("扫码结果", data);
    //         let result = data.text;
    //         _this.$router.push({
    //           name: "EditableDetailB",
    //           query: { result, editable: false, invoiceHeaderId: this.headInfo.invoiceHeaderId }
    //         });
    //       },
    //       onFail: function(err) {
    //         if (Number(err.errorCode) === 10) {
    //           _this.$router.push({ name: "InvoiceInspection" });
    //         } else {
    //           _this.$notification.open({
    //             message: _this
    //               .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //               .$D("扫码异常"),
    //             key,
    //             class: "notification",
    //             duration: 3
    //           });
    //         }
    //       }
    //     });
    //   });
    // },
    //进入OCR识别
    goOcR() {
      this.$router.push({
        name: "OcrRecognitionB",
        query: {
          invoiceHeaderId: this.headInfo.invoiceHeaderId
        }
      });
    },
    //进入手工录入
    goManualEntry() {
      this.$router.push({
        name: "ManualEntryB",
        query: {
          invoiceHeaderId: this.headInfo.invoiceHeaderId
        }
      });
    },
    numberInputCheck(v, t) {
      return numberInputCheck1(v, t);
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
    handlerScroll({ y }) {
      const len1 = -this.contentLenArr[0];
      const len2 = len1 - this.contentLenArr[1];
      const len3 = len2 - this.contentLenArr[2];
      if (y > len1 && y < 100) {
        this.showAdd = false;
        this.navIndex = 0;
      } else if (y > len2 && y <= len1) {
        this.showAdd = false;
        this.navIndex = 1;
      } else if (y > len3 && y <= len2) {
        this.showAdd = true;
        this.navIndex = 2;
      } else {
        this.showAdd = true;
        this.navIndex = 3;
      }
    },
    // 删除
    taxLineDelete(item) {
      this.$hips.dialog.confirm({
        title: " ",
        content: this.$T("hipspfm.invoiceBill.validation.message.comfirmDelete").$D("是否确认删除") + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        asyncClose: true,
        closable: false,
        onOk: () => {
          let params = [];
          params.push(item);
          batchRemoveApi(params).then(() => {
            this.$hips.toast({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D(
                "操作成功"
              ),
              duration: 1500
            });
            this.$hips.dialog.close();
            this.getOrderTax();
          });
        },
        onCancel() {}
      });
    },
    // 查验
    taxLineCheck(item) {
      console.log(item, "dddd");
      let params = [];
      if (item.type === "click") {
        params = this.taxInfo;
      } else {
        params.push(item);
      }
      batchCheckApi(params).then((res) => {
        if (res) {
          if (res.failed) {
            this.$hips.toast({ message: res.message, duration: 1500 });
            this.$hips.dialog.close();
          } else {
            this.$hips.toast({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D(
                "操作成功"
              ),
              duration: 1500
            });
            this.$hips.dialog.close();
            this.getOrderTax();
          }
        } else {
          this.$hips.toast({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            duration: 1500
          });
          this.$hips.dialog.close();
          this.getOrderTax();
        }
      });
    },
    // 保存
    save() {
      let flag = true;
      if (!this.headInfo.taxInvoiceDateIssued) {
        this.dateTip = true;
        flag = false;
      }
      if (!this.headInfo.taxInvoiceNum) {
        this.codeTip = true;
        flag = false;
      }
      if (
        this.headInfo.taxIncludedAmount === "" ||
        // eslint-disable-next-line no-eq-null
        this.headInfo.taxIncludedAmount === null
      ) {
        this.amountTip = true;
        flag = false;
      }
      // eslint-disable-next-line no-eq-null
      if (this.headInfo.taxAmount === "" || this.headInfo.taxAmount === null) {
        this.taxTip = true;
        flag = false;
      }
      if (flag) {
        this.$loading.show({
          text: this.$T("hipspfm.invoiceInspection.view.message.saving").$D(
            "保存中"
          )
        });
        // eslint-disable-next-line vue/no-mutating-props
        this.headInfo.taxInvoiceDateIssued =
          this.headInfo.taxInvoiceDateIssued + " 00:00:00";
        // eslint-disable-next-line vue/no-mutating-props
        this.headInfo.customizeUnitCode = "SFIN.INVOICE_CREATE_DETAIL.TAX_LINE,SFIN.INVOICE_UPDATE_DETAIL.HEADER_INFO,SFIN.INVOICE_UPDATE_DETAIL.BASIC_INFO";
        // eslint-disable-next-line vue/no-mutating-props
        this.headInfo.invoiceLines = this.lineInfo;
        getSaveApi(this.headInfo).then((res) => {
          // eslint-disable-next-line no-empty
          if (res.failed) {
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
              description: "",
              key,
              class: "notification",
            });
            this.taxTip = false;
            this.amountTip = false;
            this.codeTip = false;
            this.dateTip = false;
            this.getOrderHeader();
            this.getOrderLine();
          }
          this.$loading.hide();
        });
      } else {
        this.$hips.toast({
          message: this.$T("hipspfm.common.validation.enterRequired").$D("请填写必填项") + "!",
          duration: 1500
        });
      }
    },
    // 通过
    approvel() {
      let flag = true;
      if (!this.headInfo.taxInvoiceDateIssued) {
        this.dateTip = true;
        flag = false;
      }
      if (!this.headInfo.taxInvoiceNum) {
        this.codeTip = true;
        flag = false;
      }
      if (
        this.headInfo.taxIncludedAmount === "" ||
        // eslint-disable-next-line no-eq-null
        this.headInfo.taxIncludedAmount === null
      ) {
        this.amountTip = true;
        flag = false;
      }
      // eslint-disable-next-line no-eq-null
      if (this.headInfo.taxAmount === "" || this.headInfo.taxAmount === null) {
        this.taxTip = true;
        flag = false;
      }
      if (flag) {
        this.$loading.show({
          text: this.$T("hipspfm.invoiceBill.view.message..submitting").$D("提交中")
        });
        // eslint-disable-next-line vue/no-mutating-props
        this.headInfo.taxInvoiceDateIssued =
          this.headInfo.taxInvoiceDateIssued + " 00:00:00";
        // eslint-disable-next-line vue/no-mutating-props
        this.headInfo.invoiceLines = this.lineInfo;
        getSubmitApi(this.headInfo).then((res) => {
          this.$loading.hide();
          // eslint-disable-next-line no-empty
          if (res.failed) {
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
              description: "",
              key,
              class: "notification",
            });
            // eslint-disable-next-line consistent-this
            const _this = this;
            setTimeout(() => {
              _this.$router.push({
                name: "CreateInvoiceList"
              });
            }, 1000);
          }
        });
      } else {
        this.$hips.toast({
          message: this.$T("hipspfm.common.validation.enterRequired").$D("请填写必填项") + "!",
          duration: 1500
        });
      }
    }
  }
};
</script>
<style lang="stylus">
.hips-input {
  padding: 0 20px;
}
.hips-input__label {
  flex: 4;
}
.hips-input__body {
  flex: 6;
}

.input-edit {
  margin-top: 18px;
  width: 16px;
  height: 16px;
}
</style>

<style scoped lang="stylus">
.blackFont {
  color:var(--color-font-default);
}

.closeFont {
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c) !important;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
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
          color:var(--color-font-default);
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

  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    // position:relative
    .content {
      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lineOverflow {
          & span:nth-child(1) {
            flex: 0 1 auto !important;
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

        .invoiceHead {
          margin-left: 20px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default);
          line-height: 22px;
          padding: 2px 0 1px 0;
          border-bottom:1px solid var(--color-border-default);

          >>> .hips-input {
            padding: 0 20px 0 0;
          }

          >>> .hips-input__label--in-left {
            width: 106px;
          }

          >>> .hips-input__error-message {
            display: none;
          }

          >>> .hips-textarea {
            padding: 3px 20px 3px 0;
            position: static;
          }

          >>> .hips-textarea__label--in-left {
            width: 102px;
          }

          >>> .hips-input__body .hips-input__input-value input::-webkit-input-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-input__body .hips-input__input-value input:-moz-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-input__body .hips-input__input-value input::-moz-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-input__body .hips-input__input-value input:-ms-input-placeholder {
            font-family: PingFangSC-Regular !important;
            color: var(--color-font-default-e) !important;
          }

          >>> .hips-input__body .hips-input__input-value input::-ms-input-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-input__body .hips-input__input-value input::placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-textarea__body .hips-textarea__input-value textarea::-webkit-textarea-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-textarea__body .hips-textarea__input-value textarea:-moz-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-textarea__body .hips-textarea__input-value textarea::-moz-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-textarea__body .hips-textarea__input-value textarea:-ms-textarea-placeholder {
            font-family: PingFangSC-Regular !important;
            color: var(--color-font-default-e) !important;
          }

          >>> .hips-textarea__body .hips-textarea__input-value textarea::-ms-textarea-placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          >>> .hips-textarea__body .hips-textarea__input-value textarea::placeholder {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-e);
          }

          li:nth-child(1) {
            display: flex;
            align-items: center;
            height: 50px;
            font-size: 14px;

            .left {
              width: 106px;
            }

            .right {
              display: flex;
              width: 229px;
              justify-content: space-between;

              span:nth-child(1) {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: var(--color-font-default-e);
                line-height: 22px;
              }

              .diffColor {
                font-family: PingFangSC-Medium !important;
                color:var(--color-font-default) !important;
              }

              img {
                margin-top: 3px;
                width: 16px;
                height: 16px;
              }
            }
          }
        }

        .invoiceHeadSpan {
          display: flex;
          padding: 17px 20px 14px 0;

          & .code {
            width: 106px;
          }

          & span:nth-child(2) {
            color:var(--color-font-default-b);
          }
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

        h3 {
          padding: 15px 20px;
          margin-bottom: 4px;
          font-size: 20px;
          color:var(--color-font-default);
          line-height: 28px;
          font-weight: 600;
          background: #FAFBFC;

          span {
            float: right;
            background: var(--color-other-default-b);
            border-radius: 16px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color:var(--color-font-default-d);
            text-align: right;
            padding: 7px 14px;
            line-height: 22px;
            position: relative;
            bottom: 3.5px;
          }
        }

        .footInfo1 {
          justify-content: space-between;
        }

        .footInfo {
          padding: 15px 15px 15px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color:var(--color-font-default);
          font-size: 14px;
          display: flex;
          font-weight: 600;

          span:nth-child(1) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          div {
            flex: 0 1 auto;

            span {
              background: var(--color-other-default-b);
              border-radius: 16px;
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color:var(--color-font-default-d);
              line-height: 20px;
              padding: 8px 16px;
              margin-left: 12px;
              position: relative;
              bottom: 2px;
            }

            span:nth-child(2) {
              background: var(--color-other-default);
            }
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 13px;
          margin: 16px 0 4px 20px;
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
            color:var(--color-font-default);
            line-height: 22px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-other-default-b);
              text-align: right;
              line-height: 22px;
              font-weight: normal;
            }
          }

          .status {
            text-align: right;
          }

          .status1 {
            color: var(--color-font-default-e) !important;
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

        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 11px;
            border-bottom:1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 9px 20px 0 0;
            margin-bottom: 2px;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
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
                  color:var(--color-font-default);
                }
              }
            }
          }
        }

        >>> .hips-input {
          font-family: 'PingFangSC-Regular';
          font-size: 14px;
          line-height: 22px;
          color:var(--color-font-default);
        }

        >>> .hips-input__input-value input {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default);
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
    font-size: 18px;
    line-height: 32px;
    color:var(--color-font-default);
    font-weight: 600;
  }

  .left-button {
    // margin-left: 20px;
  }

  .lineHead {
    padding: 12px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 4px;
      height: 24px;
      display: flex;
      justify-content: space-between;

      span:nth-child(1) {
        font-weight: 600;
      }

      span:nth-child(2) {
        color: var(--color-font-default-e);
      }
    }

    p {
      span {
        color:var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
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
      padding: 16px 20px 15px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);

      .otherFont {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color:var(--color-font-default) !important;
        line-height: 22px;
      }

      &:nth-of-type(1) {
        padding-top: 12px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 60%;
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

.supplier-confirm {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -1px 2px 0 rgba(27, 30, 43, 0.1);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
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
    border-right: 1px solid var(--color-border-default);
  }

  span:nth-child(odd) {
    color:var(--color-font-default-b);
  }
}

.addMethods {
  position: fixed;
  z-index: 1600;
  bottom: calc(18px + constant(safe-area-inset-bottom));
  bottom: calc(18px + env(safe-area-inset-bottom));
  left: 161.5px;
  width: 52px !important;
  height: 52px;
  border-radius: 50%;

  img {
    width: 52px;
    height: 52px;
  }
}

.addModal {
  padding: 0px 20px;

  li:nth-child(1) {
    span {
      display: inline-block;
      padding: 36px 0px 48px 0px;
      font-size: 14px;
      color: var(--color-font-default-e);
    }
  }

  li:nth-child(2) {
    display: flex;
    text-align: center;
    justify-content: space-around;
    color:var(--color-font-default);
    color:var(--color-font-default);

    img {
      height: 32px;
      width: 32px;
      margin-bottom: 4px;
    }

    div {
      font-weight: 700;
    }
  }

  li:nth-child(3) {
    text-align: center;
    margin-top: 54px;

    img {
      height: 52px;
      width: 52px;
      transform: rotate(-270deg);
      background: var(--color-other-default-b);
      border-radius: 50%;
      box-shadow: 0 2px 6px 0 rgba(0, 65, 61, 0.2);
    }
  }
}

.changePlaceholder {
  >>> .hips-input__body .hips-input__input-value input::-webkit-input-placeholder {
    color: var(--color-other-default) !important;
  }

  >>> .hips-input__body .hips-input__input-value input:-moz-placeholder {
    color: var(--color-other-default) !important;
  }

  >>> .hips-input__body .hips-input__input-value input::-moz-placeholder {
    color: var(--color-other-default) !important;
  }

  >>> .hips-input__body .hips-input__input-value input:-ms-input-placeholder {
    color: var(--color-other-default) !important;
  }

  >>> .hips-input__body .hips-input__input-value input::-ms-input-placeholder {
    color: var(--color-other-default) !important;
  }

  >>> .hips-input__body .hips-input__input-value input::placeholder {
    color: var(--color-other-default) !important;
  }
}
</style>
