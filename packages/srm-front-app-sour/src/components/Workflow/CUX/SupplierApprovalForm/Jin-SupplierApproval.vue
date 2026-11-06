<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section class="mainDetail" >
    <div ref="navWrap" class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in getNavArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="$changeNav(index)">
          {{ item.title }}
        </li>
      </ul>
    </div>

    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <!-- 申请单头信息 -->
        <div ref="headInfo" class="infoContent headInfo">
          <h3>{{ $T("hipspfm.workFlowSupplier.view.title.supplierHeadInfo").$D("申请单头信息") }}</h3>
          <div class="detail-info">
            <ul>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.applicationNum').$D('申请单号') }}：</span>
                <span>{{ headInfo.changeReqNumber }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.supplierNum').$D('供应商编码') }}：</span>
                <span>{{ headInfo.supplierCompanyNum }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.supplierName').$D('供应商名称') }}：</span>
                <span>{{ headInfo.supplierCompanyName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.applicationState').$D('申请状态') }}：</span>
                <span>{{ headInfo.reqStatusMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.creator').$D('创建人') }}：</span>
                <span>{{ headInfo.createUserRealName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.department').$D('所属部门') }}：</span>
                <span>{{ headInfo.unitName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.creationDate').$D('创建日期') }}：</span>
                <span>{{ headInfo.creationDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.submitDate').$D('提交日期') }}：</span>
                <span>{{ headInfo.submitDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.latitudeChange').$D('变更维度') }}：</span>
                <span>{{ headInfo.changeLevelMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.changeRemark').$D('变更备注') }}：</span>
                <span>{{ headInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div ref="register" class="infoContent-a registerInfo">
          <!-- <h3>{{ $T("sslm.supplierDetail.view.message.title.registrationInfo").$D("登记信息") }}</h3> -->
          <div class="btn-h3">
            <div>{{ $T("sslm.supplierDetail.view.fixCatalog.registInform").$D("登记信息") }}</div>
            <div
              v-if="false"
              :class="registerInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('registerInfoAfter')">
              {{ registerInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(showRegisterInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noRegisterInfo").$D("暂无登记信息") }}</span>
          </div>
          <div v-else>
            <div class="headCompany">
              <span class="block"/>
              <span class="code" >{{ showRegisterInfo.companyName }}</span>
            </div>
            <ul>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.suDe.companyInfo.enterpriseType").$D("类型") }}：{{ showRegisterInfo.companyTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("hipspfm.supplier.message.supplier.shortName").$D("简称") }}：{{ showRegisterInfo.shortName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.companyInfo.companyEnglishName").$D("英文名称") }}：{{ showRegisterInfo.companyEnglishName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.suDe.companyInfo.unifiedSocialCode").$D("统一社会信用代码") }}：{{ showRegisterInfo.unifiedSocialCode }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.taxpayerTypeMeaning").$D("纳税人标识") }}：{{ showRegisterInfo.taxpayerTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.registeredCountryName").$D("注册地址") }}：{{ showRegisterInfo.registeredCountryName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.companyInfo.address").$D("认证地区") }}：{{ showRegisterInfo.domesticForeignRelation === '1' ? $T("sslm.enterpriseInform.view.model.companyInfo.innerOrg").$D("境内") : (showRegisterInfo.domesticForeignRelation === '0' ? $T("sslm.enterpriseInform.view.model.companyInfo.outerOrg").$D("境外") : '') }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.companyInfo.addressDetail").$D("详细地址") }}：{{ showRegisterInfo.addressDetail }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.companyInfo.legalRepName").$D("法定代表人") }}：{{ showRegisterInfo.legalRepName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.companyInfo.regCapital").$D("注册资本(万元)") }}：{{ showRegisterInfo.registeredCapital ? showRegisterInfo.registeredCapital:'' }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.companyInfo.buildDate").$D("成立日期") }}：{{ showRegisterInfo.buildDate }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.registInform.businessTerm").$D("营业期限") }}：{{ showRegisterInfo.longTermFlag === '1' ? $T("sslm.supplierDetail.model.suDe.companyInfo.longTermFlag").$D("长期") : (showRegisterInfo.longTermFlag === '0' ? showRegisterInfo.licenceEndDate : '') }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.companyInfo.businessScope").$D("经营范围") }}：{{ showRegisterInfo.businessScope }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.companyInfo.licenceUrl").$D("营业执照") }}：<i :class="showRegisterInfo.licenceUrl ? 'font-blue':''" @click="showRegisterInfo.licenceUrl ? handlePreview(showRegisterInfo.licenceUrl):''">{{ $T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片") }}</i></span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.taxpayerTypeMeaning").$D("纳税人标识") }}：{{ showRegisterInfo.taxpayerTypeMeaning }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 业务信息 -->
        <div ref="business" class="infoContent-a businessInfo">
          <!-- <h3>{{ $T("sslm.supplierDetail.view.message.basicBusinessInfo").$D("业务信息") }}</h3> -->
          <div class="btn-h3">
            <div>{{ $T("sslm.enterpriseInform.view.message.businessTitle").$D("业务信息") }}</div>
            <div
              v-if="false"
              :class="businessInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('businessInfoAfter')">
              {{ businessInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(showBusinessInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noBasicBusinessInfo").$D("暂无业务信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.industryName").$D("行业类型") }}：</span>
              <span v-text="merge(showBusinessInfo.industryReqList,'industryName')"/>
              <srm-tooltip
                v-if="showBusinessInfo.industryList"
                placement="left"
                :title="merge(showBusinessInfo.industryReqList,'industryName')">
                <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default" >
              </srm-tooltip>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.companyInfo.categoryName").$D("主营品类") }}：</span>
              <span v-text="merge(showBusinessInfo.industryCategoryReqList,'categoryName')"/>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.website").$D("公司官网") }}：</span>
              <span>{{ showBusinessInfo.website }}</span>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.view.message.title.description").$D("公司简介") }}：</span>
              <span>{{ showBusinessInfo.description }}</span>
            </li>
            <!-- <li>
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.mainRule").$D("主要身份") }}：</span>
              <span v-text="merge(showBusinessInfo.industryCategoryReqList,'categoryName')"></span>
            </li> -->
            <li>
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.mainRule").$D("主要身份") }}：</span>
              <span
                v-if="showBusinessInfo.purchaseFlag === 1 && showBusinessInfo.saleFlag === 1">{{ $T("sslm.enterpriseInform.view.message.sale").$D("销售") }}/{{ $T("sslm.enterpriseInform.view.message.purchase").$D("采购") }}</span>
              <span
                v-else>{{ showBusinessInfo.saleFlag === 1 ? $T("sslm.enterpriseInform.view.message.sale").$D("销售"): (showBusinessInfo.purchaseFlag === 1 ? $T("sslm.enterpriseInform.view.message.purchase").$D("采购") : '') }}</span>
            </li>
            <li>
              <span>{{ $T("sslm.enterpriseInform.view.model.business.serviceType").$D("经营性质") }}：</span>
              <span>{{ businessNature }}</span>
            </li>
            <li>
              <span>{{ $T("sslm.enterpriseInform.view.model.business.serviceAreaReqList").$D("送货服务范围") }}：</span>
              <span v-text="merge(showBusinessInfo.serviceAreaReqList,'serviceAreaMeaning')"/>
            </li>
            <li>
              <span>{{ $T("sslm.enterpriseInform.view.model.business.logoUrl").$D("公司logo") }}：</span>
              <span :class="showBusinessInfo.logoUrl ? 'font-blue':''" @click="showBusinessInfo.logoUrl ? handlePreview(showBusinessInfo.logoUrl,'private-bucket'):''">{{ showBusinessInfo.logoUrlname }}{{ $T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片") }}</span>
            </li>
          </ul>
        </div>

        <div ref="contacts" class="infoContent-a supplyCapacityList contacts">
          <!-- <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierContact").$D("联系人") }}</h3> -->
          <div class="btn-h3">
            <div>{{ $T("sslm.enterpriseInform.view.fixCatalog.contactInform").$D("联系人") }}</div>
            <div
              v-if="false"
              :class="contactsAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('contactsAfter')">
              {{ contactsAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(showContactList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierContact").$D("暂无联系人信息") }}</span>
          </div>
          <div v-else class="itemBottom">
            <div
              v-for="(item,index) in showContactList"
              :key="index">
              <span class="headCompany">
                <span v-if="item.gender === 0" class="headImg">
                  <img class="image-red-default" src="@/assets/icon_list_women_normal@3x.png" alt="wowenHeadImg" >
                </span>
                <span v-else class="headImg">
                  <img class="image-blue-default" src="@/assets/icon_list_man_normal@3x.png" alt="manHeadImg" >
                </span>
                <span class="code">
                  <span class="materiel-name">{{ item.name }}</span>
                </span>
              </span>
              <ul>
                <li>
                  <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.mobilephone").$D("手机号码") }}：{{ item.mobilephone }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.mail").$D("邮箱") }}：{{ item.mail }}</span>
                </li>
                <li>
                  <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.defaultFlag").$D("默认联系人") }}：<i
                    v-if="item.defaultContactFlag === 1"
                    class="font-blue">{{ $T("hipspfm.common.status.yes").$D("是") }}</i>
                    <i v-else>{{ $T("hipspfm.common.status.no").$D("否") }}</i></span>
                </li>
              </ul>
              <span class="footInfo concat-status-foot">
                <span>
                  {{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}：
                  <i
                    v-if="item.enabled === 1"
                    class="font-blue">{{ $T("hipspfm.common.status.yes").$D("是") }}</i>
                  <i v-else-if="item.enabled === 0" class="font-red">{{ $T("hipspfm.common.status.no").$D("否") }}</i>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div ref="address" class="infoContent-a financialSituation address">
          <!-- <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierAddress").$D("地址") }}</h3> -->
          <div class="btn-h3">
            <div>{{ $T("sslm.enterpriseInform.view.fixCatalog.addressInform").$D("地址") }}</div>
            <div
              v-if="false"
              :class="addressAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('addressAfter')">
              {{ addressAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(showAddressList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierAddress").$D("暂无地址信息") }}</span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in showAddressList" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span class="width-wrap">{{ $T("sslm.supplierDetail.model.suDe.addressData.addressDetail").$D("详细地址") }}：{{ item.address }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.suDe.addressData.countryName").$D("国家") }}：{{ item.countryIdMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.suDe.addressData.regionName").$D("省/市") }}：{{ item.regionIdMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.addressData.postCode").$D("邮政编码") }}：{{ item.zipCode }}</span>
                <!-- <span>
                  {{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}：
                  <i
                    v-if="item.enabledFlag === 1"
                    class="font-blue"
                  >{{ $T("hipspfm.common.status.yes").$D("是") }}</i>
                  <i v-else-if="item.enabledFlag === 0" class="font-red">{{ $T("hipspfm.common.status.no").$D("否") }}</i>
                </span> -->
              </li>
            </ul>
          </div>
        </div>

        <div ref="bankAccount" class="infoContent-a financialSituation bankAccount">
          <!-- <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierBankAccount").$D("银行账户") }}</h3> -->
          <div class="btn-h3">
            <div>{{ $T("sslm.supplierDetail.view.message.bankAccount").$D("银行账户") }}</div>
            <div
              v-if="false"
              :class="bankAccountAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('bankAccountAfter')">
              {{ bankAccountAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(bankAccountList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierBankAccount").$D("暂无银行账户信息") }}</span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in bankAccountList" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span class="width-wrap">{{ $T("sslm.supplierDetail.model.supplierDetail.bankAccountData.bankName").$D("银行名称") }}：{{ item.bankName }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.bankAccountData.bankBranchName").$D("开户行名称") }}：{{ item.depositBank }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.view.message.title.supplierBankAccount").$D("银行账户") }}：{{ item.bankAccountNum }}</span>
              </li>
              <li>
                <span>
                  {{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态") }}：
                  <i
                    v-if="item.enabledFlag === 1"
                    class="font-blue">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}</i>
                  <i v-else-if="item.enabledFlag === 0" class="font-red">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }}</i>
                </span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierInform.model.supplierInform.paymentTypeCode").$D("付款方式") }}：{{ item.reserve1Meaning }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.bank.bankCode").$D("银行代码") }}：{{ item.bankCodeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.bank.bankFirm").$D("联行行号") }}：{{ item.bankFirmMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.bankAccountData.bankAccountName").$D("账户名称") }}：{{ item.bankAccountName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.view.message.primaryAccount").$D("主账号") }}：{{ item.mainAccountFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T("ssrc.bidHall.model.store.info").$D("门店信息") }}：<i :class="item.reserve2 ? 'font-blue':''" @click="item.reserve2 ? checkInfo(item.reserve2):''">{{ $T("smbl.common.button.view").$D("查看") }}</i></span>
              </li>
              <li>
                <span>{{ $T("smbl.supplierApproval.view.outOfServiceStore").$D("失效门店") }}：<i :class="item.reserve3 ? 'font-blue':''" @click="item.reserve3 ? checkInfo(item.reserve3):''">{{ $T("smbl.common.button.view").$D("查看") }}</i></span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.bank.bankCountry").$D("国家") }}/{{ $T("sslm.supplierDetail.model.supplierDetail.addressData.regionName").$D("省/市") }}
                  ：{{ item.reserve4Meaning ? item.reserve4Meaning:'' }}{{ item.reserve5Meaning ? '/'+item.reserve5Meaning : '' }}/{{ item.reserve6Meaning ? '/'+item.reserve6Meaning:'' }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierInform.model.supplierInform.taxRate").$D("税率") }}：{{ item.reserve8Meaning }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div ref="billingInfo" class="infoContent-a financialSituation billingInfo">
          <!-- <h3>{{ $T("").$D("开票信息") }}</h3> -->
          <div class="btn-h3">
            <div>{{ $T("sslm.supplierDetail.view.fixCatalog.invoiceInform").$D("开票信息") }}</div>
            <div
              v-if="false"
              :class="billingInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('billingInfoAfter')">
              {{ billingInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(showBillingInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierBankAccount").$D("暂无开票信息") }}</span>
          </div>
          <div v-else>
            <ul>
              <li>
                <span>
                  <span class="block"/>
                  <span class="width-wrap">{{ $T("sslm.enterpriseInform.view.model.invoice.invoiceHeader").$D("发票头") }}：{{ showBillingInfo.invoiceHeader }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.invoice.taxAddress").$D("税务登记地址") }}：{{ showBillingInfo.taxRegistrationAddress }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.enterpriseInform.view.model.invoice.taxPhone").$D("税务登记电话") }}：{{ showBillingInfo.taxRegistrationPhone }}</span>
              </li>
              <li>
                <span>
                  {{ $T("sslm.supplierDetail.model.companyInfo.receivePhone").$D("收票人手机") }}：{{ showBillingInfo.receivePhone }}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 供货清单能力 -->
        <div ref="lineInfo" class="infoContent lineInfo">
          <div class="btn-h3">
            <div>{{ $T("sslm.supplierInform.view.message.fixCatalog.supplyCapacityList").$D("供货能力清单") }}</div>
            <div
              v-if="false"
              :class="abilityInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('abilityInfoAfter')">
              {{ abilityInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(showAbilityInfo) === '[]'" class="noContent">
            <span>{{ $T("smbl.supplierApproval.view.noAvailabilityListInfo").$D("暂无供货能力清单信息") }}</span>
          </div>
          <div v-for="(item,index) in showAbilityInfo" :key="index" class="detail-info">
            <section class="sub-header">
              <div class="left-info">
                <div>
                  <span>{{ $T('sslm.supplyAbility.model.supplyAbility.itemCode').$D('物料编码') }}：</span>
                  <!-- <span
                    :class="item.itemCodeStateFlag!=='original'?'changeColor':''"
                  >{{ item.itemCode }}</span> -->
                  <span>{{ item.itemCode }}</span>
                </div>
                <div>
                  <span>{{ $T('sslm.supplyAbility.model.supplyAbility.itemName').$D('物料名称') }}：</span>
                  <!-- <span
                    :class="item.itemIdStateFlag!=='original'?'changeColor':''"
                  >{{ item.itemName }}</span> -->
                  <span>{{ item.itemName }}</span>
                </div>
              </div>
              <hy-tag
                :title="item.supplyFlag? $T('hipspfm.workFlowSupplier.model.workFlowSupplier.supplyFlagA').$D('可供') : $T('hipspfm.workFlowSupplier.model.workFlowSupplier.supplyFlagB').$D('不可供')"
                :bg-color="item.supplyFlag?'var(--color-other-default-b)':'#C6CAD6'"/>
            </section>
            <ul>
              <li>
                <span>{{ $T('sslm.supplyAbility.model.supplyAbility.itemCategoryCode').$D('品类代码') }}：</span>
                <!-- <span
                  :class="item.itemCategoryCodeStateFlag!=='original'?'changeColor':''"
                >{{ item.itemCategoryCode }}</span> -->
                <span>{{ item.itemCategoryCode }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplyAbility.model.supplyAbility.categoryName').$D('品类名称') }}：</span>
                <!-- <span
                  :class="item.itemCodeStateFlag!=='original'?'changeColor':''"
                >{{ item.categoryName }}</span> -->
                <span>{{ item.categoryName }}</span>
              </li>
              <li>
                <span>{{ $T('slm.supplyAbility.model.supplyAbility.remark').$D('备注') }}：</span>
                <span >{{ item.remark }}</span>
                <!-- <span :class="item.remarkStateFlag!=='original'?'changeColor':''">{{ item.remark }}</span> -->
              </li>
            </ul>
          </div>
        </div>

        <div ref="supplierClass" class="infoContent supplierClass">
          <div class="btn-h3">
            <div>{{ $T("sslm.supplierInform.view.message.fixCatalog.supplierClass").$D("供应商分类") }}</div>
            <div
              v-if="false"
              :class="supplierClassAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('supplierClassAfter')">
              {{ supplierClassAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-if="JSON.stringify(showSupplierClass) === '[]'" class="noContent">
            <span>{{ $T("smbl.supplierApproval.view.noSupplierClassificationInfo").$D("暂无供应商分类信息") }}</span>
          </div>
          <div class="detail-info" >
            <ul v-for="(item,index) in showSupplierClass" :key="index">
              <li>
                <span>{{ $T('sslm.enterpriseInform.model.supplierClassify.describe').$D('供应商分类描述') }}：</span>
                <!-- <span
                  :class="item.itemCategoryCodeStateFlag!=='original'?'changeColor':''"
                >{{ item.categoryDescription }}</span> -->
                <span>{{ item.categoryDescription }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.enterpriseInform.view.model.address.enabledFlag').$D('状态') }}：</span>
                <!-- <span
                  :class="item.itemCodeStateFlag!=='original'?'changeColor':''"
                >{{ item.enabledFlag }}</span> -->
                <span
                  v-if="item.enabledFlag === 1"
                  class="font-blue">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}</span>
                <span v-else-if="item.enabledFlag === 0" class="font-red">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 其他信息 -->
        <div ref="otherInfo" class="infoContent headInfo">
          <div class="btn-h3">
            <div>{{ $T('sslm.supplierInform.view.message.fixCatalog.otherInform').$D('其他信息') }}</div>
            <div
              v-if="false"
              :class="otherInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('otherInfoAfter')">
              {{ otherInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div class="language-class-ul-li">
            <ul>
              <li>
                <span>{{ $T('sslm.common.model.manager').$D('总经理') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar13 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.register.currency').$D('注册货币') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar14Meaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.annual.sales.volume').$D('年营业额（万元）') }}：</span>
                <span>{{ showOtherInfo.attributeDecimal1 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.area.code').$D('区号') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar15 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.fix.number').$D('传真') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar16 }}</span>
              </li>

              <li>
                <span>{{ $T('sslm.common.model.tel.number').$D('公司固化/手机') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar17 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.company.email').$D('公司邮箱') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar18 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.service.tel.number').$D('客服电话') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar19 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.post.code').$D('邮政编码') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar20 }}</span>
              </li>

              <li>
                <span>{{ $T('sslm.common.model.invoice.area').$D('发票国家/省/市') }}：</span>
                <span>{{ showOtherInfo.attributeBigint10Meaning }}/{{ showOtherInfo.attributeBigint11Meaning }}/{{ showOtherInfo.attributeBigint12Meaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.receive.invoice.area').$D('收票国家/省/市') }}：</span>
                <span>{{ showOtherInfo.attributeBigint13Meaning }}/{{ showOtherInfo.attributeBigint14Meaning }}/{{ showOtherInfo.attributeBigint15Meaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.receive.invoice.address').$D('收票详细地址') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar21 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.receive.invoice.address.en').$D('收票详细地址（英文）') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar22 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.invoice.receiver.name').$D('发票收件人名称') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar23 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.invoice.type').$D('发票类型') }}：</span>
                <span>{{ clacObject(showOtherInfo.attributeVarchar24Meaning,showOtherInfo.attributeVarchar24) }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.termName').$D('付款条件') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar25Meaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.super.hotel').$D('所属高星级酒店') }}：</span>
                <span>{{ clacObject(showOtherInfo.attributeVarchar1Meaning,showOtherInfo.attributeVarchar1) }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.supplier.h.share.code').$D('供应商H股代码') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar2 }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.model.free.price').$D('自由定价') }}：</span>
                <span>{{ showOtherInfo.attributeBigint16 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.oldSystemCode').$D('老系统编码') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar3 }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.applicableBrands').$D('适用品牌') }}：</span>
                <span>{{ clacObject(showOtherInfo.attributeVarchar4Meaning,showOtherInfo.attributeVarchar4) }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.common.supplyType').$D('供应商类型') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar5Meaning }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.supplierNature').$D('供应商性质') }}：</span>
                <span>{{ clacObject(showOtherInfo.attributeVarchar6Meaning,showOtherInfo.attributeVarchar6) }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.enterpriseNotes').$D('企业备注') }}：</span>
                <span>
                  <srm-tooltip
                    v-if="showOtherInfo.attributeLongtext1"
                    placement="left"
                    :title="showOtherInfo.attributeLongtext1">
                    <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default" >
                  </srm-tooltip></span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.shippingCPC').$D('发货国家/省/市') }}：</span>
                <span>{{ showOtherInfo.attributeBigint1Meaning }}/{{ showOtherInfo.attributeBigint2Meaning }}/{{ showOtherInfo.attributeBigint3Meaning }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.shippingDetails').$D('发货详细地址') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar7 }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.shippingDetailsEn').$D('发货详细地址（英文）') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar8 }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.companyAddress').$D('公司详细地址') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar9 }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.returnCPC').$D('退货国家/省/市') }}：</span>
                <span>{{ showOtherInfo.attributeBigint4Meaning }}/{{ showOtherInfo.attributeBigint5Meaning }}/{{ showOtherInfo.attributeBigint6Meaning }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.returnDetails').$D('退货详细地址') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar10 }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.returnDetailsEn').$D('退货详细地址（英文）') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar11 }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.storeFactorydetailedAdd').$D('店铺（工厂）详细地址') }}：</span>
                <span>{{ showOtherInfo.attributeVarchar12 }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.isFactoryOrDealer').$D('是否为工厂或经销商') }}：</span>
                <span>{{ showOtherInfo.attributeBigint17 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.isHotelIndustryexperience').$D('是否有酒店行业经验') }}：</span>
                <span>{{ showOtherInfo.attributeBigint18 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.isErpexperience').$D('是否有ERP或其他生产管理系统') }}：</span>
                <span>{{ showOtherInfo.attributeBigint19 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.isBom').$D('是否有产品的BOM表') }}：</span>
                <span>{{ showOtherInfo.attributeBigint20 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.isProductionOrSchedule').$D('是否有产品的生产计划或者排产模型') }}：</span>
                <span>{{ showOtherInfo.attributeBigint21 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.isIndependentDesignTeam').$D('是否有独立的设计团队') }}：</span>
                <span>{{ showOtherInfo.attributeBigint22 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T('smbl.supplierApproval.view.isOwnBrandOrProductPatent').$D('是否拥有自有品牌或产品专利') }}：</span>
                <span>{{ showOtherInfo.attributeBigint23 === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <hips-popup
      v-model="storeVal"
      style="height:90%;width:100%;overflow: hidden;"
      position="bottom"
      class="top-boder-radius"
      :overlay-on-click-close="false"
      @click-overlay="storeVal = false">
      <div class="header">
        <hips-nav-bar slot="header">
          <div slot="right" class="right-button" @click="storeVal = false">
            <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt >
          </div>
        </hips-nav-bar>
        <div class="title">{{ $T("smbl.supplierApproval.view.information").$D("信息") }}</div>
      </div>
      <div class="store-info infoContent-a">
        <ul>
          <li v-for="(li,key) in tempStroe" :key="key">
            <span>{{ $T('smbl.supplierApproval.view.storeCode').$D('门店代码') }}：{{ storeInfo[li].organizationCode }}</span>
            <span>{{ $T('smbl.supplierApproval.view.storeName').$D('门店名称') }}：{{ storeInfo[li].organizationName }}</span>
          </li>
        </ul>
      </div>
    </hips-popup>
  </section>
</template>

<script>
import uuid from "uuid";
import BScroll from "better-scroll";
import HyTag from "@/components/HyTag";
import { Popup, NavBar, Input } from "hips";
// import OuDetailInfo from "../components/OuDetailInfo";
// import {
//   getContactListApi,
//   getHeadInfoApi,
//   getOtherInfoApi,
//   getAddressListApi,
//   getSupplyCapacityListApi,
//   getBankAccountListApi,
//   getBillingInfoListApi,
//   getSupplierRegisterInfoApi,
//   getSupplierBusinessInfoApi,
//   getSupplierSupplierClassApi,
//   getStoreInfo
// } from "../api/Hyt";
import {
  getContactListApi,
  getHeadInfoApi,
  getOtherInfoApi,
  getAddressListApi,
  getSupplyCapacityListApi,
  getBankAccountListApi,
  getBillingInfoListApi,
  getSupplierRegisterInfoApi,
  getSupplierBusinessInfoApi,
  getSupplierSupplierClassApi,
  getStoreInfo
} from "./api/jin";
const tenantId = window.localStorage.getItem("tenantId");

export default {
  modules: [ "hipspfm.workFlow", "sslm.supplierInform", "sslm.supplierDetail", "hipspfm.workFlowSupplier", "hipspfm.supplierLifeCycle", "hipspfm.supplier", "sslm.enterpriseInform", "hipspfm.common", "sslm.supplyAbility", "slm.supplyAbility", "sslm.common", "ssrc.bidHall", "smbl.common", "smbl.supplierApproval" ],
  name: "JinSupplierApproval",
  components: {
    HyTag,
    // OuDetailInfo,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Input.name]: Input
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      headInfo: {}, // 申请头
      registerInfo:{}, //登记信息
      businessInfo:{}, //业务信息
      lineInfo: [], // 供货能力清单
      otherInfo: [ [], [] ], // 其它信息
      contactList:{}, // 联系人
      bankAccountList:{}, // 银行账户
      addressList:{}, // 地址
      billingInfo:{}, // 开票信息
      supplierClass:[], // 供应商分类
      loading:false,
      scroll: "",
      navScroll: "",
      offsetX: 0,
      navIndex: 0,
      lengthArr: [],
      contentLenArr: [],
      registerInfoAfter:false,
      businessInfoAfter:false,
      abilityInfoAfter: false,
      contactsAfter:false,
      addressAfter:false,
      bankAccountAfter:false,
      billingInfoAfter:false,
      supplierClassAfter:false,
      otherInfoAfter: false,
      storeVal:false, // 门店信息弹窗
      storeInfo:{},
      tempStroe:[],
    };
  },
  computed: {
    showRegisterInfo() {
      // return this.registerInfoAfter ? this.registerInfo.newBasic : (this.registerInfo.oldBasic||{});
      return this.registerInfo;
    },
    showBusinessInfo() {
      // return this.businessInfoAfter ? this.businessInfo.newBusiness : (this.businessInfo.oldBusiness||{});
      return this.businessInfo;
    },
    showAbilityInfo() {
      return this.abilityInfoAfter ? this.lineInfo[0] : this.lineInfo[1];
    },
    showContactList() {
      return this.contactsAfter ? this.contactList[0] : this.contactList[1] || [];
    },
    showAddressList() {
      return this.addressAfter ? this.addressList[0] : this.addressList[1] || [];
    },
    showBankAccountList() {
      return this.bankAccountAfter ? this.bankAccountList[0] : this.bankAccountList[1] || [];
    },
    showBillingInfo() {
      return this.billingInfoAfter ? this.billingInfo.newInvoice : this.billingInfo.oldInvoice || {};
    },
    showSupplierClass() {
      return this.supplierClassAfter ? this.supplierClass[0] : this.supplierClass[1];
    },
    showOtherInfo() {
      // return this.otherInfoAfter
      //   ? this.otherInfo[0][0] || {}
      //   : this.otherInfo[1][0] || {};
      return this.otherInfo;
    },
    getNavArr() {
      return [ { title:this.$T("hipspfm.workFlow.view.message.applicationHeader").$D("申请头信息"), ref:"headInfo" },
        { title:this.$T("sslm.supplierDetail.view.fixCatalog.registInform").$D("登记信息"), ref:"register" },
        { title:this.$T("sslm.supplierDetail.view.fixCatalog.businessInform").$D("业务信息"), ref:"business" },
        { title:this.$T("sslm.supplierDetail.view.fixCatalog.contactInform").$D("联系人"), ref:"contacts" },
        { title:this.$T("sslm.supplierDetail.view.title.supplierAddress").$D("地址"), ref:"address" },
        { title:this.$T("sslm.supplierDetail.view.message.bankAccount").$D("银行账户"), ref:"bankAccount" },
        { title:this.$T("sslm.supplierDetail.view.message.invoiceInfo").$D("开票信息"), ref:"billingInfo" },
        { title:this.$T("sslm.supplierInform.view.message.fixCatalog.supplyCapacityList").$D("供货能力清单"), ref:"lineInfo" },
        { title:this.$T("sslm.supplierDetail.view.message.title.supplierClassify").$D("供应商分类"), ref:"supplierClass" },
        { title:this.$T("sslm.supplierInform.view.fixCatalog.otherInform").$D("其他信息"), ref:"otherInfo" }, ];
    },
    businessNature() {
      let arr = [];
      if (this.showBusinessInfo.manufacturerFlag === 1) {
        arr.push(this.$T("sslm.supplierDetail.model.companyInfo.manufacturerFlag").$D("制造商"));
      }
      if (this.showBusinessInfo.traderFlag === 1) {
        arr.push(this.$T("sslm.supplierDetail.model.companyInfo.traderFlag").$D("贸易商"));
      }
      if (this.showBusinessInfo.servicerFlag === 1) {
        arr.push(this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.servicerFlag").$D("服务商"));
      }
      if (arr.length > 1) {
        return arr.join("/");
      } else if (arr.length === 1) {
        return arr[0];
      }
      return arr;
    }
  },
  watch: {
    showAbilityInfo: {
      handler:function() {
        this.$refreshScroll();
      },
      immediate: true
    },
    showContactList: {
      handler:function() {
        this.$refreshScroll();
      },
      immediate: true
    },
    showAddressList: {
      handler:function() {
        this.$refreshScroll();
      },
      immediate: true
    },
    showBankAccountList: {
      handler:function() {
        this.$refreshScroll();
      },
      immediate: true
    },
    showSupplierClass: {
      handler:function() {
        this.$refreshScroll();
      },
      immediate: true
    },
    navIndex(nVal) {
      if ([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ].includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        // await this.getSupplierOrderHeader();
        // await this.getSupplierRegisterInfo();
        // await this.getSupplierBusinessInfo();
        // await this.getSupplierOrderLine();
        // await this.getContactList();
        // await this.getAddressList();
        // await this.getBankAccountList();
        // await this.getSupplierSupplierClass();
        // await this.getBillingInfoList();
        // await this.getOtherInfo();
        await this.getSupplierOrderHeader();
        Promise.all([ this.getSupplierRegisterInfo(),
          this.getSupplierBusinessInfo(), this.getSupplierOrderLine(),
          this.getContactList(), this.getAddressList(),
          this.getBankAccountList(), this.getSupplierSupplierClass(),
          this.getBillingInfoList(), this.getOtherInfo() ])
          .then(() => {
            this.loading = true;
            this.$loading.hide();
            this.$refreshScroll();
          });
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowSupplier.view.title.supplierApproval").$D("供应商信息变更审批"));
    this.$nextTick(() => {
      this.navScroll = new BScroll(this.$refs.navWrap, {
        scrollX: true,
        click: true
      });
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        click: true,
        probeType: 3
      });
      this.$refreshScroll();
      console.log(12, this.$refs.register.scrollHeight);
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 获取申请单头信息
    async getSupplierOrderHeader() {
      const params = {
        flexRuleCode: "SSLM.SUPPLIER_INFORM_CHANGE_DETAIL.HEADER",
        tenantId
      };
      await getHeadInfoApi(this.changeReqId, params).then((res) => {
        this.headInfo = res || {};
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        this.$emit("GetAttachmentUuid", attachmentUuid);
      });
    },
    // 获取登记信息
    getSupplierRegisterInfo() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const params = {
          // changeReqId: this.changeReqId,
          // companyId:this.headInfo.supplierCompanyId,
          dataSource: 2,
          customizeUnitCode:"SSLM.SUPPLIER_INFORM_CHANGE_DETAIL.REGIST_INFO"
        };
        getSupplierRegisterInfoApi(this.changeReqId, params).then((res) => {
          this.registerInfo = res;
          resolve();
        });
      });
    },
    // 获取业务信息
    getSupplierBusinessInfo() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const params = {
          // changeReqId: this.changeReqId,
          // companyId:this.headInfo.supplierCompanyId,
          dataSource: 2,
          customizeUnitCode:"SSLM.SUPPLIER_INFORM_CHANGE_DETAIL.BUSINESS_INFO"
        };
        getSupplierBusinessInfoApi(this.changeReqId, params).then((res) => {
          this.businessInfo = res;
          resolve();
        });
      });
    },
    //获取联系人信息
    getContactList() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2, // 1企业信息变更 2供应商信息变更
        };
        getContactListApi(params).then((res) => {
          this.contactList = res;
          resolve();
        });
      });
    },
    //获取地址信息
    getAddressList() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2,
        };
        getAddressListApi(params).then((res) => {
          this.addressList = res;
          resolve();
        });
      });
    },
    //获取银行账户信息
    getBankAccountList() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2,
          tenantId
        };
        getBankAccountListApi(params).then((res) => {
          this.bankAccountList = res;
          resolve();
        });
      });
    },
    //获取开票信息
    getBillingInfoList() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const params = {
          changeReqId: this.changeReqId,
          dataSource: 2,
          // customizeUnitCode:'SSLM.SUPPLIER_INFORM_CHANGE_DETAIL.INVOICE_INFO',
          companyId:this.headInfo.supplierCompanyId
        };
        getBillingInfoListApi(params).then((res) => {
          this.billingInfo = res;
          resolve();
        });
      });
    },
    //获取供应商分类信息
    getSupplierSupplierClass() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const params = {
          changeReqId: this.changeReqId,
          tenantId
        };
        getSupplierSupplierClassApi(params).then((res) => {
          this.supplierClass = res;
          resolve();
        });
      });
    },
    //获取供货能力清单信息
    getSupplierOrderLine() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        getSupplyCapacityListApi(this.changeReqId).then((res) => {
          this.lineInfo = res;
          resolve();
        });
      });
    },
    //获取其他信息
    getOtherInfo() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        getOtherInfoApi(this.changeReqId).then((res) => {
          this.otherInfo = res;
          resolve();
        });
      });
    },
    showAfterInfo(flag) {
      this[flag] = !this[flag];
    },
    clacObject(obj, item) {
      if (item) {
        // eslint-disable-next-line no-param-reassign
        item = item.split(",");
      }
      if (item && item.length > 1) {
        let arr = "";
        item.map((li) => {
          arr = arr + obj[li] + "/";
        });
        arr = arr.substring(0, arr.length - 1);
        return arr;
      }
      return obj;
    },
    merge: function(val, industryName) {
      let arr = [];
      if (val && industryName) {
        val.forEach((element) => {
          arr.push(element[industryName]);
        });
      }
      // eslint-disable-next-line no-param-reassign
      val = arr.join("/");
      return val;
    },
    checkInfo(val) {
      this.$loading.show();
      this.tempStroe = val.split(",");
      getStoreInfo(val.split(",")).then((res) => {
        this.storeInfo = res;
        this.storeVal = true;
        this.$loading.hide();
      });

    },
    handlePreview(fileUrl, bucketName = "private-bucket") {
      this.previewImg = this.buildImgUrl(fileUrl, bucketName);
      const imageSet = [ { src: this.previewImg } ];
      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.previewer.show({ imageSet: imageSet });
    },
    downPreview(fileUrl, bucketName = "private-bucket") {
      try {
        const downloadUrl = this.buildImgUrl(fileUrl, bucketName);
        console.log("downloadUrl:", downloadUrl);
        downloadFile(downloadUrl);
      } catch (e) {
        console.log("e:", e);
        // this.downloadlFile(fileUrl,bucketName);
        const loadUrl = this.buildImgUrl(fileUrl, bucketName);
        this.$router.push({ "name": "downLoad", query: { downLoadUrl:loadUrl } });
      }
    },
    downloadlFile(fileUrl, bucketName = "private-bucket") {
      const downloadUrl = this.buildImgUrl(fileUrl, bucketName);
      let iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.style.height = 0;
      iframe.src = downloadUrl;
      document.body.appendChild(iframe);
      setTimeout(() => iframe.remove(), 100000);
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    }
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color:var(--color-font-default);
}
.font-blue{
   color:var(--color-other-default-b) !important;
}
.closeFont {
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c) !important;
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    // overflow-x: auto;
    position: relative;
    z-index: 999;

    &::-webkit-scrollbar {
      display: none;
    }

    .navContent {
      width: 150%;
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

          .btn-h3 {
          display: flex;
          background: var(--color-bg-default-b);
          padding: 15px 16px 15px 20px;
          justify-content: space-between;

          div:nth-child(1) {
            font-size: 20px;
            color:var(--color-font-default);
            font-weight: bold;
            line-height: 28px;
          }

          .btn-class-A {
            width: 76px;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            color:var(--color-font-default-d);
            text-align: center;
            background: var(--color-other-default-b);
            border-radius: 14px;
          }

          .btn-class-B {
            width: 76px;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            color: var(--color-other-default-b);
            text-align: center;
            background:var(--color-bg-default);
            border-radius: 14px;
            border: 1px solid var(--color-other-default-b);
          }
        }

  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    .content {
      .infoContent {
        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background:var(--color-bg-default-b);
        }

        .input-edit {
          margin-top: 18px;
          width: 16px;
          height: 16px;
        }
      }
      .infoContent-a{
        .block {
          width: 6px;
          height: 14px;
          border-radius: 1px;
          background-color: var(--color-other-default-b);
          margin: 0px 8px 0 0;
        }
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview {
          color: var(--color-other-default-b) !important;
        }

        h3 {
          padding: 20px 20px 12px;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background:var(--color-bg-default-b);
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          // border-bottom:8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color:var(--color-font-default);
          font-size: 14px;
          font-weight: bold;
          display: flex;

          span:nth-child(1) {
            line-height: 22px;
            width: 90%;
            margin-right: 15px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 11px;
          margin: 14px 0 0px 20px;
          border-bottom:1px solid var(--color-border-default);
          padding-right: 20px;
          align-items: center;

          .lineSamll {
            color: var(--color-font-default-e);
            font-size: 14px;
            position: absolute;
            right: 20px;
            line-height: 22px;
          }

          .code {
            font-weight: bold;
            font-size: 16px;
            color:var(--color-font-default);
            line-height: 24px;
            flex: 1;
            display: flex;
            justify-content: space-between;
          }

          .headImg {
            height: 20px;

            img {
              width: 20px;
              height: 20px;
            }

            margin-right: 8px;
          }
        }

        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 13px;
            border-bottom:1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 12px 20px 0 0;

            // margin-bottom: 2px;
            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;
            }
          }
        }
      }
    .businessInfo {
        & ul li {
          padding: 16px 20px 15px 0;
          border-bottom:1px solid var(--color-border-default);
          align-items: baseline;

          span {
            flex: none;
            width: 84px;
          }

          span:nth-child(2) {
            color:var(--color-font-default-b);
            width: calc(100% -106px);
            word-break: break-all;
          }
        }

        & ul li:nth-child(3) span:nth-child(2) {
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      .supplyCapacityList {
        .itemBottom {
          div {
            border-bottom:8px solid var(--color-border-default);
          }

          div:nth-last-child(1) {
            border-bottom: none;
          }
        }
      }
      .supplierClass{
          ul {
            border-bottom:8px solid var(--color-border-default);
          }

          ul:nth-last-child(1) {
            border-bottom: none;
          }
      }
      .financialSituation {
        ul {
          padding: 0;

          li:nth-child(1) {
            padding: 13px 20px 7px 0px;
            margin-bottom: 0px;
            border: none;

            span {
              display: flex;
              align-items: center;
              flex: none;

              .block {
                display: inline-block;
                margin: 0 14px 0 0;
              }

              span:nth-child(2) {
                margin-right: 12px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color:var(--color-font-default);
                line-height: 22px;
                font-weight: 700;
              }
            }
          }

          li {
            margin-bottom: 2px;
            padding: 5px 20px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color:var(--color-font-default);
            line-height: 22px;
          }

          li:nth-last-child(1) {
            padding: 5px 20px 13px 20px;
            border: none;
            margin-bottom: 0px;
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;

  .header {
    font-size: 20px;
    line-height: 32px;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
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
    margin-bottom: 8px;
  }

  .lineBody {
    background-color:var(--color-font-default-d);
    height: calc(100vh - 160px);
    overflow: auto;

    li {
      display: flex;
      padding: 20px 20px 11px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);

      &:nth-of-type(1) {
        padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        &:nth-child(1) {
          width: 122px;
        }

        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 213px;
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
  }
}

.detail-info {
  .sub-title {
    width: 100%;
    padding: 16px 20px;
    line-height: 22px;
    font-size: 14px;
    color:var(--color-font-default);
    font-weight: bold;
    background: var(--color-bg-default-b);
    border-top:1px solid var(--color-border-default);
  }

  .sub-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: var(--color-bg-default-b);
    border-top:1px solid var(--color-border-default);

    .left-info {
      padding: 14px 20px;

      > div {
        margin-bottom: 4px;

        &:last-child {
          margin-bottom: 0;
        }

        span {
          display: inline-block;
          font-size: 14px;
          color:var(--color-font-default);
          font-weight: bold;
          line-height: 22px;

          &:first-child {
            width: 100px;
          }
        }
      }
    }
  }

  ul {
    padding-left: 20px;

    &.has-bottom {
      border-bottom:8px solid var(--color-border-default);
    }

    &:last-child {
      border-bottom: 0;
    }

    li {
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      padding: 16px 20px 16px 0;

      &:last-child {
        border-bottom: none;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        img {
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      span:nth-child(1) {
        width: 100px;
      }

      span:nth-child(2) {
        width: 235px;
        color:var(--color-font-default-b);
      }

      span.fileBtn {
        color: var(--color-other-default-b);
      }
    }

    .edit-wrap {
      align-items: center;
    }
  }

  ul.long {
    padding-left: 20px;

    &.has-bottom {
      border-bottom:8px solid var(--color-border-default);
    }

    &:last-child {
      border-bottom: 0;
    }

    li {
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      padding: 16px 20px 16px 0;

      &:last-child {
        border-bottom: none;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        img {
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      span:nth-child(1) {
        width: 126px;
      }

      span:nth-child(2) {
        width: 209px;
        color:var(--color-font-default-b);
      }

      span.fileBtn {
        color: var(--color-other-default-b);
      }
    }

    .edit-wrap {
      align-items: center;
    }
  }
}

.card-info {
  .card {
    padding-left: 20px;
    color: #666666;
    background:var(--color-bg-default);
    border-bottom:8px solid var(--color-border-default);

    div {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      padding-right: 20px;
      border-bottom:1px solid var(--color-border-default);

      .code {
        text-align: left;
        font-size: 16px;
        color:var(--color-font-default);
        font-weight: bold;

        span {
          display: inline-block;
          width: 6px;
          height: 14px;
          background: var(--color-other-default-b);
          border-radius: 1px;
          margin-right: 8px;
        }
      }

      .noWrap {
        width: 260px;
      }

      .head-num, .line-num {
        span {
          font-size: 14px;
          color: var(--color-font-default-e);
        }
      }
    }

    ul {
      padding-right: 20px;

      li {
        display: flex;
        justify-content: space-between;
        line-height: 32px;
        height: 32px;
        margin-top: 2px;
        font-size: 14px;
        color:var(--color-font-default);

        &:first-child, &:last-child {
          margin-top: 8px;
        }

        > span {
          flex: 1;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .fileBtn {
            color: var(--color-other-default-b);
          }
        }

        > span:nth-child(odd) {
          text-align: left;
        }

        &:last-child {
          height: 46px;
          line-height: 46px;
          border-top:1px solid var(--color-border-default);

          span:nth-child(1) {
            font-weight: bold;
          }

          span:nth-child(2) {
            color: var(--color-other-default);
          }
        }
      }
    }
  }
}
.right-button {
  margin-right: 20px;
  width: 24px;
  height: 24px;
}

.header {
  font-size: 18px;
  line-height: 26px;
}
>>> .hips-timeline-item__content {
  margin-top: 20px;
}
.title {
  font-size: 24px;
  color:var(--color-font-default);
  line-height: 32px;
  font-weight: bold;
  text-align: left;
  margin:5px 0 5px 20px;
}
.store-info{
  padding:10px 0 0 20px
  overflow:auto;
  max-height:520px;
  ul li{
    display: flex;
    align-items: flex-start;
    padding: 3.2vw 5.333vw 0 0;
    span{
      flex: 1;
      font-family: PingFangSC-Regular;
      font-size: 3.733vw;
      color: var(--color-font-default);
      line-height: 5.867vw;
    }
    ul li:nth-last-child(1){
      margin-bottom:150px
    }
  }
}

.changeColor {
  color: var(--color-other-default) !important;
}
</style>
