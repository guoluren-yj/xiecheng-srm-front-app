<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section v-if="headInfo" class="mainDetail">
    <div ref="navWrap" class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in navArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="changeNav(index)">
          {{ item }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <div ref="headInfo" class="infoContent headInfo">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.registrationInfo").$D("登记信息") }}</h3>
          <div v-if="JSON.stringify(basic) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noRegisterInfo").$D("暂无登记信息") }}</span>
          </div>
          <div v-else>
            <div class="headCompany">
              <span class="block"/>
              <span class="code">{{ basic.companyName }}</span>
            </div>
            <ul>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.suDe.companyInfo.companyType").$D("类型")
                  }}：{{ basic.companyTypeMeaning }}
                </span>
              </li>
              <li>
                <span>
                  {{ $T("sslm.supplierDetail.model.suDe.companyInfo.shortName").$D("简称") }}：{{
                    basic.shortName
                  }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.companyInfo.registeredCountryName").$D("注册地址")
                  }}：{{ basic.registeredCountryName }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.suDe.companyInfo.buildDate").$D("成立日期")
                  }}：{{ basic.buildDate|CalcDate }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.suDe.companyInfo.legalRepName").$D("法定代表人")
                  }}：{{ basic.legalRepName }}
                </span>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.suDe.companyInfo.registeredCapital").$D("注册资本(万元)")
                  }}：{{ basic.registeredCapital }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.suDe.companyInfo.licenceEndDate").$D("经营期限")
                  }}：{{
                    basic.longTermFlag === '1' ? $T("sslm.supplierDetail.model.suDe.companyInfo.longTermFlag").$D("长期") : (basic.longTermFlag === '0' ? basic.licenceEndDate : '')
                  }}</span>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.companyInfo.domesticForeignRelation").$D("境内外关系")
                  }}：{{
                    basic.domesticForeignRelation === '1' ? $T("sslm.supplierDetail.model.supplierDetail.companyInfo.domestic").$D("境内") : (basic.domesticForeignRelation === '0' ? $T("sslm.supplierDetail.model.supplierDetail.companyInfo.overseas").$D("境外") : '')
                  }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.companyInfo.taxpayerTypeMeaning").$D("纳税人标识")
                  }}：{{ basic.taxpayerTypeMeaning }}
                </span>
              </li>
              <li>
                <span>
                  {{ $T('sslm.supplierDetail.model.suDe.companyInfo.duns').$D('D-U-N-S') }}: {{
                    basic.dunsCode
                  }}
                </span>
              </li>
            </ul>
            <div class="footInfo">
              <span>
                {{
                  $T("sslm.supplierDetail.model.supplierDetail.companyInfo.businessScope").$D("经营范围")
                }}：{{ basic.businessScope }}
              </span>
              <span>
                <srm-tooltip
                  v-if="basic.businessScope"
                  placement="left"
                  :title="basic.businessScope">
                  <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default">
                </srm-tooltip>
              </span>
            </div>
          </div>
        </div>
        <div ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T("sslm.supplierDetail.view.message.basicBusinessInfo").$D("业务信息") }}</h3>
          <div v-if="JSON.stringify(headInfo.business) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noBasicBusinessInfo").$D("暂无业务信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.companyInfo.mainRule").$D("主要身份") }}：</span>
              <span v-if="headInfo.business.purchaseFlag === 1 && headInfo.business.saleFlag === 1">
                {{
                  $T("sslm.supplierDetail.model.companyInfo.saleFlag").$D("销售")
                }}/{{ $T("sslm.supplierDetail.model.companyInfo.purchaseFlag").$D("采购") }}
              </span>
              <span v-else>
                {{
                  headInfo.business.saleFlag === 1 ? $T("sslm.supplierDetail.model.companyInfo.saleFlag").$D("销售") : (headInfo.business.purchaseFlag === 1 ? $T("sslm.supplierDetail.model.companyInfo.purchaseFlag").$D("采购") : '')
                }}
              </span>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.businessNature").$D("经营性质") }}：</span>
              <span>{{ businessNature }}</span>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.industryName").$D("行业类型") }}：</span>
              <span v-text="merge(headInfo.business.industryList,'industryName')"/>
              <srm-tooltip
                v-if="headInfo.business.industryList"
                placement="left"
                :title="merge(headInfo.business.industryList,'industryName')">
                <img src="@/assets/icon_more@3x.png" class="moreInfo image-blue-default">
              </srm-tooltip>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.companyInfo.categoryName").$D("主营品类") }}：</span>
              <span v-text="merge(headInfo.business.industryCategoryList,'categoryName')"/>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.model.supplierDetail.companyInfo.website").$D("公司官网") }}：</span>
              <span>{{ headInfo.business.website }}</span>
            </li>
            <li>
              <span>{{ $T("sslm.supplierDetail.view.message.title.description").$D("公司简介") }}：</span>
              <span>{{ headInfo.business.description }}</span>
            </li>
          </ul>
        </div>

        <div ref="financialSituation" class="infoContent financialSituation">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.treeYearsFinance").$D("财务状况") }}</h3>
          <div v-if="JSON.stringify(headInfo.financeList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noThreeYearsFinance").$D("暂无财务状况信息") }}</span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in headInfo.financeList" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span>{{ $T("sslm.supplierDetail.model.companyInfo.year").$D("年份") }}：{{ item.year }}</span>
                  <span class="bigBlock">
                    {{
                      $T("sslm.supplierDetail.model.supplierDetail.companyInfo.assetLiabilityRatio").$D("资产负债率")
                    }}：{{ item.assetLiabilityRatio * 100|CalcMoney }}%
                  </span>
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.companyInfo.totalAssets").$D("企业总资产")
                  }}：{{ item.totalAssets }}
                </span>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.companyInfo.totalLiabilities").$D("总负债")
                  }}：{{ item.totalLiabilities }}
                </span>
              </li>
              <li>
                <span>
                  {{ $T("sslm.supplierDetail.model.companyInfo.currentAssets").$D("流动资产") }}：{{
                    item.currentAssets
                  }}
                </span>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.companyInfo.currentLiab").$D("流动负债")
                  }}：{{ item.currentLiabilities }}
                </span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.companyInfo.revenue").$D("营业收入") }}：{{ item.revenue }}</span>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.companyInfo.netProfit").$D("净利润")
                  }}：{{ item.netProfit }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div ref="lifeCycle" class="infoContent lifeCycle">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierLifetime").$D("生命周期") }}</h3>
          <div v-if="JSON.stringify(lifeCycleInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierLifetime").$D("暂无生命周期信息") }}</span>
          </div>
          <hips-timeline v-else class="lifeCycle-container">
            <hips-timeline-item v-for="(item,index) in lifeCycleInfo" :key="index" color="var(--color-other-default-b)">
              <div class="lifeCycle-item-title">{{ item.reqStage }}</div>
              <div class="lifeCycle-content">
                <div>
                  <span>{{ $T("sslm.supplierDetail.view.message.step.proposer").$D("申请人") }}：{{ item.proposer }}</span>
                  <span>
                    {{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.index").$D("序号") }}：{{
                      index + 1
                    }}
                  </span>
                </div>
                <div>
                  {{
                    $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.reqProcessDate").$D("申请时间")
                  }}：{{ item.reqProcessDate|CalcDate }}
                </div>
                <div>{{ $T("sslm.supplierDetail.view.message.step.approver").$D("审批人") }}：{{ item.approver }}</div>
              </div>
            </hips-timeline-item>
          </hips-timeline>
        </div>

        <div
          ref="supplierClassification"
          class="infoContent supplierClassification financialSituation">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierClass").$D("供应商分类") }}</h3>
          <div v-if="JSON.stringify(supplierClassification) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierClass").$D("暂无供应商分类信息") }}</span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in supplierClassification" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span>
                    {{
                      $T("sslm.supplyAbility.model.supplyAbility.categoryDescription").$D("供应商分类描述")
                    }}：{{ item.categoryDescription }}
                  </span>
                  <span
                    v-if="item.enabledFlag === 1"
                    class="bigBlock ">{{
                      $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态")
                    }}：{{ $T("hipspfm.common.status.enabledFlag.enable").$D("启用") }}</span>
                  <span
                    v-else-if="item.enabledFlag === 0"
                    class="bigBlock block-red">{{
                      $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态")
                    }}：{{ $T("hipspfm.common.status.enabledFlag.disable").$D("禁用") }}</span>
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplyAbility.model.supplyAbility.evaluationLevel").$D("评级")
                  }}：{{ item.evaluationLevel }}
                </span>
                <span>
                  {{
                    $T("sslm.supplyAbility.model.supplyAbility.evaluationScore").$D("评分")
                  }}：{{ item.evaluationScore }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.categoryCode").$D("供应商分类代码")
                  }}：{{ item.categoryCode }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.alterReason").$D("变更理由")
                  }}：{{ item.alterReason }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.alterDate").$D("变更时间")
                  }}：{{ item.alterDate|CalcDate }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div ref="supplyCapacityList" class="infoContent supplyCapacityList">
          <h3>{{ $T("sslm.supplierDetail.view.fixCatalog.supplyCapacityList").$D("供货能力清单") }}</h3>
          <div v-if="JSON.stringify(supplyCapacityList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplyCapacityList").$D("暂无供货能力清单信息") }}</span>
          </div>
          <div v-else class="itemBottom">
            <div
              v-for="(item,index) in supplyCapacityList"
              :key="index"
              @click="showLineInfoDetail('ShowSupplyCapacityListDetail',item)">
              <span class="headCompany">
                <span class="block"/>
                <span class="code">
                  <span class="materiel-name">{{ item.itemCode|CalcFontLength(24) }}</span>
                </span>
              </span>
              <ul>
                <li>
                  <span class="materialCode">
                    {{
                      $T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称")
                    }}：{{ item.itemCategoryName }}
                  </span>
                  <span class="lineSamll">
                    {{
                      $T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码")
                    }}：{{ item.itemCategoryCode }}
                  </span>
                </li>
                <li>
                  <span>
                    {{
                      $T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供")
                    }}：{{
                      item.supplyFlag === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")
                    }}
                  </span>
                  <span>
                    {{ $T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态") }}：{{
                      item.supplyStatus
                    }}
                  </span>
                </li>
              </ul>
              <span class="footInfo">
                <span>{{ $T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称") }}：{{ item.itemName }}</span>
                <span/>
              </span>
            </div>
          </div>
        </div>

        <div
          ref="supplierEvaluationResults"
          class="infoContent supplyCapacityList supplierEvaluationResults">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.evaluationResults").$D("供应商考评结果") }}</h3>
          <div v-if="JSON.stringify(supplierEvaluationResults) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noEvaluationResults").$D("暂无供应商考评结果信息") }}</span>
          </div>
          <div v-else class="itemBottom">
            <div
              v-for="(item,index) in supplierEvaluationResults"
              :key="index"
              @click="showLineInfoDetail('showSupplierEvaluationResultsDetail',item)">
              <span class="headCompany">
                <span class="block"/>
                <span class="code">
                  <span class="materiel-name">{{ item.evalNum }}</span>
                  <span class="lineSamll font-blue">{{ item.evalStatusMeaning }}</span>
                </span>
              </span>
              <ul>
                <li>
                  <span>
                    {{ $T("sslm.evaluationQuery.model.evaluation.cycle").$D("考评周期") }}：{{
                      item.evalCycleMeaning
                    }}
                  </span>
                </li>
                <li>
                  <span>
                    {{ $T("sslm.evaluationQuery.model.archive.create.time").$D("建档时间") }}：{{
                      item.creationDate
                    }}
                  </span>
                </li>
              </ul>
              <span class="footInfo">
                <span>{{ $T("sslm.evaluationQuery.model.archive.describe").$D("档案描述") }}：{{ item.evalName }}</span>
                <span/>
              </span>
            </div>
          </div>
        </div>

        <div ref="contacts" class="infoContent supplyCapacityList contacts">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierContact").$D("联系人") }}</h3>
          <div v-if="JSON.stringify(contactList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierContact").$D("暂无联系人信息") }}</span>
          </div>
          <div v-else class="itemBottom">
            <div
              v-for="(item,index) in contactList"
              :key="index"
              @click="showLineInfoDetail('showContactsDetail',item)">
              <span class="headCompany">
                <span v-if="item.gender === 0" class="headImg">
                  <img class="image-red-default" src="@/assets/icon_list_women_normal@3x.png" alt="wowenHeadImg">
                </span>
                <span v-else class="headImg">
                  <img class="image-blue-default" src="@/assets/icon_list_man_normal@3x.png" alt="manHeadImg">
                </span>
                <span class="code">
                  <span class="materiel-name">{{ item.name }}</span>
                </span>
              </span>
              <ul>
                <li>
                  <span>
                    {{
                      $T("sslm.supplierDetail.model.suDe.contactsData.mobilephone").$D("手机号码")
                    }}：{{ item.mobilephone }}
                  </span>
                </li>
                <li>
                  <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.mail").$D("邮箱") }}：{{ item.mail }}</span>
                </li>
              </ul>
              <span class="footInfo concat-status-foot">
                <span>
                  {{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态") }}：
                  <span
                    v-if="item.enabledFlag === 1"
                    class="font-blue">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}</span>
                  <span v-else-if="item.enabledFlag === 0" class="font-red">
                    {{
                      $T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用")
                    }}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div ref="address" class="infoContent financialSituation address">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierAddress").$D("地址") }}</h3>
          <div v-if="JSON.stringify(addressList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierAddress").$D("暂无地址信息") }}</span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in addressList" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span class="width-wrap">
                    {{
                      $T("sslm.supplierDetail.model.suDe.addressData.addressDetail").$D("详细地址")
                    }}：{{ item.addressDetail }}
                  </span>
                </span>
              </li>
              <li>
                <span>
                  {{ $T("sslm.supplierDetail.model.suDe.addressData.countryName").$D("国家") }}：{{
                    item.countryName
                  }}
                </span>
              </li>
              <li>
                <span>
                  {{ $T("sslm.supplierDetail.model.suDe.addressData.regionName").$D("省/市") }}：{{
                    item.regionName
                  }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.addressData.postCode").$D("邮政编码")
                  }}：{{ item.postCode }}
                </span>
                <span>
                  {{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态") }}：
                  <i
                    v-if="item.enabledFlag === 1"
                    class="font-blue">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}</i>
                  <i v-else-if="item.enabledFlag === 0"
                     class="font-red">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }}</i>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div ref="bankAccount" class="infoContent financialSituation bankAccount">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.supplierBankAccount").$D("银行账户") }}</h3>
          <div v-if="JSON.stringify(bankAccountList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noSupplierBankAccount").$D("暂无银行账户信息") }}</span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in bankAccountList" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span class="width-wrap">
                    {{
                      $T("sslm.supplierDetail.model.supplierDetail.bankAccountData.bankName").$D("银行名称")
                    }}：{{ item.bankName }}
                  </span>
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.bankAccountData.bankBranchName").$D("开户行名称")
                  }}：{{ item.bankBranchName }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.view.message.title.supplierBankAccount").$D("银行账户")
                  }}：{{ item.bankAccountNum }}
                </span>
              </li>
              <li>
                <span>
                  {{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态") }}：
                  <i
                    v-if="item.enabledFlag === 1"
                    class="font-blue">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.enable").$D("启用") }}</i>
                  <i v-else-if="item.enabledFlag === 0"
                     class="font-red">{{ $T("hipspfm.supplierLifeCycle.status.enabledFlag.disable").$D("禁用") }}</i>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div ref="enterpriseAttachment" class="infoContent financialSituation enterpriseAttachment">
          <h3>{{ $T("sslm.supplierDetail.view.message.title.attachmentInfo").$D("附件查看（企业认证）") }}</h3>
          <div v-if="JSON.stringify(headInfo.attachmentList) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.supplierLifeCycle.message.supplier.noAttachmentInfo").$D("暂无附件查看（企业认证）信息") }}</span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in headInfo.attachmentList" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span class="width-wrap">
                    {{
                      $T("sslm.supplierDetail.model.supplierDetail.description").$D("附件描述")
                    }}：{{ item.description }}
                  </span>
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.attachmentType").$D("附件类型")
                  }}：{{ item.attachmentType }}
                </span>
                <span>
                  {{ $T("sslm.supplierDetail.model.supplierDetail.attachmentMessage").$D("附件信息") }}：
                  <span
                    class="font-blue"
                    @click="showFilePop(item.attachmentUuid||uuid)">{{
                      $T('hipspfm.common.button.viewAttachments').$D('查看附件')
                    }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T("sslm.supplierDetail.model.supplierDetail.endDate").$D("文件到期日") }}：{{ item.endDate }}</span>
              </li>
              <li>
                <span>
                  {{ $T("sslm.supplierDetail.model.supplierDetail.addressDetail").$D("最后上传日") }}：{{
                    item.uploadDate
                  }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div ref="surveyAttachment" class="infoContent financialSituation surveyAttachment">
          <h3>{{ $T("hipspfm.supplierLifeCycle.message.supplier.questionnaireAttachmentInfo").$D("附件查看（调查表）") }}</h3>
          <div v-if="JSON.stringify(surveyAttachment) === '[]'" class="noContent">
            <span>
              {{
                $T("hipspfm.supplierLifeCycle.message.supplier.noQuestionnaireAttachmentInfo").$D("暂无附件查看（调查表）信息")
              }}
            </span>
          </div>
          <div v-else>
            <ul v-for="(item,index) in surveyAttachment" :key="index">
              <li>
                <span>
                  <span class="block"/>
                  <span class="width-wrap">
                    {{
                      $T("sslm.supplierDetail.model.supplierDetail.description").$D("附件描述")
                    }}：{{ item.attachmentDesc }}
                  </span>
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.attachmentType").$D("附件类型")
                  }}：{{ item.attachmentType }}
                </span>
                <span>
                  {{ $T("sslm.supplierDetail.model.supplierDetail.attachmentMessage").$D("附件信息") }}：
                  <span
                    class="font-blue"
                    @click="showFilePop(item.supplierAttachmentUuid||uuid)">{{
                      $T('hipspfm.common.button.viewAttachments').$D('查看附件')
                    }}</span>
                </span>
              </li>
              <li>
                <span>
                  {{ $T("sslm.supplierDetail.model.supplierDetail.endDate").$D("文件到期日 ") }}：{{
                    item.expirationDate
                  }}
                </span>
              </li>
              <li>
                <span>
                  {{
                    $T("sslm.supplierDetail.model.supplierDetail.addressDetail").$D("最后上传日")
                  }}：{{ item.lastUploadDate }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <supply-capacity-list-detail
      v-model="ShowSupplyCapacityListDetail"
      :line-info-detail="lineInfoDetail"
      :show-file-pop="showFilePop"/>
    <supplier-evaluation-results-detail
      v-model="showSupplierEvaluationResultsDetail"
      :line-info-detail="lineInfoDetail"
      :show-file-pop="showFilePop"
      :query-params="{supplierCompanyId}"/>
    <contacts-detail
      v-model="showContactsDetail"
      :line-info-detail="lineInfoDetail"
      :show-file-pop="showFilePop"/>
  </section>
</template>

<script>
import BScroll from "better-scroll";
import SupplyCapacityListDetail from "./SupplyCapacityListDetail";
import SupplierEvaluationResultsDetail from "./SupplierEvaluationResultsDetail";
import ContactsDetail from "./ContactsDetail";
import uuid from "uuid";
import { NavBar, Timeline, TimelineItem } from "hips";

export default {
  modules: [ "sslm.supplierDetail", "hipspfm.supplierLifeCycle", "sslm.supplyAbility", "hipspfm.common", "sslm.evaluationQuery", "slm.evaluationQuery" ],
  name: "TabScroll",
  components: {
    ContactsDetail,
    SupplierEvaluationResultsDetail,
    SupplyCapacityListDetail,
    [NavBar.name]: NavBar,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem
  },
  props: {
    headInfo: {
      // 头信息
      type: Object,
      default: () => ({})
    },
    showFilePop: {
      type: Function
    },
    lifeCycleInfo: {
      // 生命周期信息
      type: Array,
      default: () => []
    },
    supplierClassification: {
      // 供应商分类信息
      type: Array,
      default: () => []
    },
    supplyCapacityList: {
      type: Array,
      default: () => []
    },
    surveyAttachment: {
      type: Array,
      default: () => []
    },
    addressList: {
      // 地址
      type: Array,
      default: () => []
    },
    supplierCompanyId: {
      type: String | Number
    },
    supplierEvaluationResults: {
      type: Array,
      default: () => []
    },
    bankAccountList: {
      // 银行账户
      type: Array,
      default: () => []
    },
    contactList: {
      //联系人信息
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scroll: "",
      show: false,
      navIndex: 0,
      contentLenArr: [],
      navArr: [
        this.$T("sslm.supplierDetail.view.message.title.registrationInfo").$D("登记信息"),
        this.$T("sslm.supplierDetail.view.message.basicBusinessInfo").$D("业务信息"),
        this.$T("sslm.supplierDetail.view.message.title.treeYearsFinance").$D("财务状况"),
        this.$T("sslm.supplierDetail.view.message.title.supplierLifetime").$D("生命周期"),
        this.$T("sslm.supplierDetail.view.message.title.supplierClass").$D("供应商分类"),
        this.$T("sslm.supplierDetail.view.fixCatalog.supplyCapacityList").$D("供货能力清单"),
        this.$T("sslm.supplierDetail.view.message.title.evaluationResults").$D("供应商考评结果"),
        this.$T("sslm.supplierDetail.view.message.title.supplierContact").$D("联系人"),
        this.$T("sslm.supplierDetail.view.message.title.supplierAddress").$D("地址"),
        this.$T("sslm.supplierDetail.view.message.title.supplierBankAccount").$D("银行账户"),
        this.$T("sslm.supplierDetail.view.message.title.attachmentInfo").$D("附件查看（企业认证）"),
        this.$T("hipspfm.supplierLifeCycle.message.supplier.questionnaireAttachmentInfo").$D("附件查看（调查表）")
      ],
      basic: "",
      business: "",
      businessNature: "", // 经营性质
      uuid: "",
      lineInfoDetail: {}, // 弹出框内容
      ShowSupplyCapacityListDetail: false, // 供货能力清单弹出框
      showSupplierEvaluationResultsDetail: false, // 供应商考评结果弹出框
      showContactsDetail: false, // 供货能力清单弹出框
      lengthArr: []
    };
  },
  watch: {
    navIndex(nVal) {
      if ([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ].includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    }
  },
  mounted() {
    this.basic = this.headInfo.basic;
    this.business = this.headInfo.business;
    this.navScroll = new BScroll(this.$refs.navWrap, {
      scrollX: true,
      click: true
    });
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        eventPassthrough: "horizontal",
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);
      this.contentLenArr = [
        this.$refs.headInfo.offsetHeight,
        this.$refs.lineInfo.offsetHeight,
        this.$refs.financialSituation.offsetHeight,
        this.$refs.lifeCycle.offsetHeight,
        this.$refs.supplierClassification.offsetHeight,
        this.$refs.supplyCapacityList.offsetHeight,
        this.$refs.supplierEvaluationResults.offsetHeight,
        this.$refs.contacts.offsetHeight,
        this.$refs.address.offsetHeight,
        this.$refs.bankAccount.offsetHeight,
        this.$refs.enterpriseAttachment.offsetHeight,
        this.$refs.surveyAttachment.offsetHeight
      ];
      const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 430;
      this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
      this.scroll.refresh();
    });
    let arr = [];
    if (Number(this.headInfo.business.manufacturerFlag) === 1) {
      arr.push(this.$T("sslm.supplierDetail.model.companyInfo.manufacturerFlag").$D("制造商"));
    }
    if (Number(this.headInfo.business.traderFlag) === 1) {
      arr.push(this.$T("sslm.supplierDetail.model.companyInfo.traderFlag").$D("贸易商"));
    }
    if (Number(this.headInfo.business.servicerFlag) === 1) {
      arr.push(this.$T("sslm.supplierDetail.model.supplierDetail.companyInfo.servicerFlag").$D("服务商"));
    }
    if (arr.length > 1) {
      this.businessNature = arr.join("/");
    } else if (arr.length === 1) {
      this.businessNature = arr[0];
    }
    this.uuid = uuid();
  },
  methods: {
    // 切换tab
    changeNav(index) {
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;
      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 400, "bounce");
      });
      this.navIndex = index;
    },
    merge: function (val, industryName) {
      let arr = [];
      if (val && industryName === "industryName") {
        val.forEach((element) => {
          arr.push(element.industryName);
        });
      } else if (val && industryName === "categoryName") {
        val.forEach((element) => {
          arr.push(element.categoryName);
        });
      }
      // eslint-disable-next-line no-param-reassign
      val = arr.join("/");
      return val;
    },
    // 滚动事件
    handlerScroll({ y }) {
      this.lengthArr.length ||
      (this.lengthArr = this.contentLenArr.reduce(
        (pre, cur) => [ ...pre, pre[pre.length - 1] - cur ],
        [ 0 ]
      ));
      let contentLenArrLength = this.contentLenArr.length;
      const index =
        this.lengthArr
          .concat(y)
          .sort((a, b) => b - a)
          .lastIndexOf(y) - 1;
      this.navIndex =
        index > contentLenArrLength - 1 ?
          contentLenArrLength - 1 :
          index < 0 ?
            0 :
            index;
    },
    showLineInfoDetail(index, item) {
      this[index] = true;
      this.lineInfoDetail = item;
    }
  }
};
</script>

<style lang="stylus" scoped>
.mainDetail {
  .block {
    width: 6px;
    height: 14px;
    border-radius: 1px;
    background-color: var(--color-other-default-b);
    margin: 0px 8px 0 0;
  }

  .bigBlock {
    border-radius: 2px;
    background: var(--color-bg-default-d, rgba(65, 70, 96, 0.1));
    padding: 1px 4px;
    font-weight: normal;
    font-size: 10px !important;
    line-height: 18px !important;
    font-family: PingFangSC-Medium;
    color: var(--color-font-default-c);
    position: relative;
    display: inline-block;
    bottom: 1px;
  }

  .block-red {
    color: var(--color-other-default) !important;
    background: var(--color-bg-default) 0 F0 !important;
  }

  .backColor-orange {
    background: var(--color-other-default-d);
  }

  .backColor-blue {
    background: var(--color-other-default-b);
  }

  .backColor-gray {
    background: var(--color-bg-default-f);
  }

  .font-blue {
    color: var(--color-other-default-b) !important;
  }

  .font-red {
    color: var(--color-other-default) !important;
  }

  .noContent {
    height: 78px;
    padding-left: 20px;

    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-font-default-b);
      letter-spacing: 0;
      line-height: 22px;
    }
  }

  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      width: 1300px;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        white-space: nowrap;
        position: relative;
        margin-left: 20px;
        // max-width: 140px;
        // overflow:hidden;
        text-overflow: ellipsis;

        &.active {
          font-size: 16px;
          color: var(--color-font-default);
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

    .content {
      .infoContent {
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
          color: var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          // border-bottom:8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
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
          border-bottom: 1px solid var(--color-border-default);
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
            color: var(--color-font-default);
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
            border-bottom: 1px solid var(--color-border-default);
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
              color: var(--color-font-default);
              line-height: 22px;
            }
          }
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
                color: var(--color-font-default);
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
            color: var(--color-font-default);
            line-height: 22px;
          }

          li:nth-last-child(1) {
            padding: 5px 20px 13px 20px;
            border: none;
            margin-bottom: 0px;
          }
        }
      }

      .width-wrap {
        width: 335px;
        word-break: break-all;
      }

      .lifeCycle {
        .lifeCycle-container {
          margin: 16px 20px 0 20px;
        }

        >>> .hips-timeline-item__tail {
          top: 4px;
        }

        >>> .hips-timeline-item__head {
          background: var(--color-other-default-b);
          width: 8px;
          height: 8px;
          top: 4px;
        }

        .lifeCycle-item-title {
          font-size: 16px;
          color: var(--color-other-default-b);
          fongt-weight: 700;
        }

        .lifeCycle-content {
          margin-top: 4px;
          padding: 8px 12px;
          background: var(--color-bg-default-b);
          border-radius: 4px;

          & div:nth-child(1) {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
              font-size: 10px;
              color: var(--color-font-default-e);
              line-height: 18px;
            }

            & span:nth-child(1) {
              font-size: 14px;
              color: var(--color-font-default);
              line-height: 22px;
              fongt-weight: 700;
            }
          }

          & div:nth-child(2) {
            font-family: PingFangSC-Regular;
            color: var(--color-font-default-b);
            line-height: 20.1px;
          }

          & div:nth-child(3) {
            margin-top: 8px;
            color: var(--color-other-default-b);
            line-height: 20.1px;
          }
        }
      }

      .lineInfo {
        & ul li {
          padding: 16px 20px 15px 0;
          border-bottom: 1px solid var(--color-border-default);
          align-items: baseline;

          span {
            flex: none;
            width: 84px;
          }

          span:nth-child(2) {
            color: var(--color-font-default-b);
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

      .supplierClassification {
        .bigBlock {
          background: var(--color-bg-default-c);
          bottom: 0;
          font-family: PingFangSC-Medium;
          font-size: 10px;
          color: var(--color-other-default-b);
          line-height: 18px;
        }
      }

      .supplyCapacityList {
        .itemBottom {
          div {
            border-bottom: 8px solid var(--color-border-default);
          }

          div:nth-last-child(1) {
            border-bottom: none;
          }
        }
      }

      .concat-status-foot {
        span {
          font-weight: normal;
        }
      }
    }
  }
}

.moreInfo {
  align-self: flex-end;
  width: 18.3px;
  height: 18.3px;
}

.lineInfoDetail {
  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  background: #FAFBFC;
  height: 100%;

  div {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      color: var(--color-font-default);

      span {
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(3) {
        margin-bottom: 0;
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: var(--color-font-default);
      line-height: 24px;
      // font-font-weight: bold;
    }
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 6px 20px;
    margin-bottom: 2px;

    // background: #FAFBFC;

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default);
      line-height: 22px;

      &:nth-child(2) {
        color: var(--color-font-default-b);
        display: inline-block;
        width: 60%;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}
</style>
