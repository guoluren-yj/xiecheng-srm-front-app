import {
  queryCheckModeApi,
  getRegionsInfoApi,
  getBankInfoApi,
  deleteContactInfoApi,
  deleteAddressInfoApi,
  deleteBankInfoApi,
  deleteAttachmentInfoApi,
  deletePurchaseLineInfoApi,
  getRequiredTabsInfoApi,
  checkBankAccountCommon,
  submitSupplierInfoApi,
  deleteSupplierInfoApi,
} from "../api/index";
import { SrmUtil } from "srm-mobile-ui";
import { isEmpty, forEach, isBoolean } from "lodash";
export default {
  data() {
    return {
      regionPathNameIsLeaf: true,
      tabsCuz: {}, // 页签个性化配置
    };
  },
  computed:{
    hidePurchaseTab() {
      return !this.tabsCuz?.purchaseLine?.visible;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          handler: () => this.handlerPre("save")
        },
        {
          title: this.$T("smbl.common.button.submit").$D("提交"),
          handler: () => this.handlerPre("submit"),
          fill: true
        },
        {
          title: this.$T("smbl.common.button.delete").$D("删除"),
          handler: () => this.handlerPre("delete")
        },
      ];
    },
  },
  methods:{
    queryCheckMode() {
      queryCheckModeApi({ supplierType: "IMPORTED_SUPPLIER" }).then((res) => {
        if (res && !res.failed) {
          const { checkMode } = res || {};
          this.checkMode = checkMode;
        }
      });
    },
    // 详情页按钮
    getDetailBtnArr(type) {
      return [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          handler: () => {
            if (type === "basis") {
              this.basisPop = !this.basisPop;
            } else if (type === "contact") {
              this.contactPop = !this.contactPop;
            }
          }
        },
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          handler: () => this.handlerPre("save"),
          fill: true
        },
      ];
    },
    async editRegionsLinkage(item) {
      this.regionPathList = [];
      this.regionIds = [];
      this.asyncListData = [];
      if (!item.countryId) {
        this.$notification.open({
          message: this.$T("smbl.common.message.PleaseSelectCountryFirst").$D("请先选择国家/地区"),
          class: "notification"
        });
        return;
      }
      await getRegionsInfoApi(item.countryId, "").then((res) => {
        res && res.forEach((e) => {
          e.hasChildren = !e.isLeaf;
        });
        this.asyncListData = res;
      });
      this.regionsLinkagePop = !this.regionsLinkagePop;
    },
    onSelect() {
      const nameList = [];
      this.regionPathList.forEach((e) => {
        nameList.push(e.regionName);
        this.regionIds.push(e.regionId);
      });
      const { isLeaf, regionName } = this.selectedData[0] || {};
      nameList.push(regionName);
      this.regionIds.push(this.selectedData[0].regionId);
      this.curRegionPathName = nameList.join("|");
      this.regionPathNameIsLeaf = isLeaf;
      this.addressDataSet.current.data.regionId = this.selectedData[0].regionId;
      this.addressDataSet.current.data.regionPathName = this.curRegionPathName;
      this.addressDataSet.current.data.regionIds = this.regionIds;
      this.regionsLinkagePop = !this.regionsLinkagePop;
    },
    renderAsyncItem(item) {
      return <span>{item.regionName}</span>;
    },
    loadChildren(item) {
      this.regionPathList.push(item);
      return new Promise((resolve, reject) => {
        getRegionsInfoApi(item.countryId, item.regionId).then((res) => {
          res && res.forEach((e) => {
            e.hasChildren = !e.isLeaf;
          });
          resolve(res);
        }).catch((e) => reject(e));
      });
    },
    getBankId() {
      // eslint-disable-next-line no-console
      // console.log(this.bankDataSet.current);
      // eslint-disable-next-line no-console
      // console.log(this.bankDataSet.current ? this.bankDataSet.current.data.bankId : "");
      return this.bankDataSet.current ? this.bankDataSet.current.data.bankId : "";
    },
    getBankInfo() {
      getBankInfoApi().then((res) => {
        this.bankList = res.content;
      });
    },
    // tab页删除数据二次确认提示
    deleteCheck(type, record) {
      const that = this;
      this.$dialog({
        content:
          this.$T("smbl.common.message.confirm.delete").$D("确认删除吗?"),
        closable: false,
        onOk() {
          that.deleteHandle(type, record);
        }
      });
    },
    // tab页删除数据提示
    deleteHandle(type, record) {
      if (type === "contact") {
        // 删除联系人
        this.deleteContact(record);
      } else if (type === "address") {
        // 删除地址
        this.deleteAddress(record);
      } else if (type === "bank") {
        // 删除银行
        this.deleteBank(record);
      } else if (type === "attachment") {
        // 删除地址
        this.deleteAttachment(record);
      } else if (type === "purchaseLine") {
        // 删除地址
        this.deletePurchaseLine(record);
      }
    },
    // 联系人
    addOneContact() {
      this.contactDataSet.create({
        name:"",
        mobilephone:"",
        // defaultFlag:0,
        enabledFlag:1,
      }, 0);
    },
    deleteContact(record) {
      if (typeof record.extContactReqId === "undefined") {
        this.contactDataSet.removeLocalRecords([ this.contactDataSet.current ]);
      } else {
        const params = [ record ];
        deleteContactInfoApi(params).then(() => {
          this.contactDataSet.refresh();
        });
      }
    },
    // 地址
    addOneAddress() {
      this.addressDataSet.create({
        tenantId:window.localStorage.getItem("tenantId"),
        // countryId:"",
        regionPathName:"",
      }, 0);
    },
    deleteAddress(record) {
      if (typeof record.extAddressReqId === "undefined") {
        this.addressDataSet.removeLocalRecords([ this.addressDataSet.current ]);
      } else {
        const params = [ record ];
        deleteAddressInfoApi(params).then(() => {
          this.addressDataSet.refresh();
        });
      }
    },
    // 银行
    addOneBank() {
      this.bankDataSet.create({
        bankId:"",
        bankFirm:""
      }, 0);
    },
    // 采购财务行
    addOnePurchaseLine() {
      this.purchaseLineDataSet.create({}, 0);
    },
    deleteBank(record) {
      if (typeof record.extBkAccountReqId === "undefined") {
        this.bankDataSet.removeLocalRecords([ this.bankDataSet.current ]);
      } else {
        const params = [ record ];
        deleteBankInfoApi(params).then(() => {
          this.bankDataSet.refresh();
        });
      }
    },
    deleteAttachment(record) {
      if (typeof record.extAttachmentReqId === "undefined") {
        this.attachmentDataSet.removeLocalRecords([ this.attachmentDataSet.current ]);
      } else {
        const params = [ record ];
        deleteAttachmentInfoApi(params).then(() => {
          this.attachmentDataSet.refresh();
        });
      }
    },
    deletePurchaseLine(record) {
      if (typeof record.extPfLineReqId === "undefined") {
        this.purchaseLineDataSet.removeLocalRecords([ this.purchaseLineDataSet.current ]);
      } else {
        const params = [ record.extPfLineReqId ];
        deletePurchaseLineInfoApi(params).then(() => {
          this.purchaseLineDataSet.refresh();
        });
      }
    },
    // 附件
    addOneAttachment() {
      this.$attachment({
        attachments: [
          {
            directory: "sslm-common",
            readonly:true,
          }
        ],
        //监听文件变化
        onFileListChange: () => {},
        onFileUpload: (e) => {
          this.attachmentDataSet.create({
            description:e.fileName + "." + e.extension, //附件名称
            fileSize:e.fileSize, //附件大小
            creationDate:e.creationDate, //上传时间
            uploader: SrmUtil.getUserInfo().realName, //上传人
            createdBy: SrmUtil.getUserInfo().id,
            remark:"", // 备注
            attachmentUrl:e.fileUrl, //附件路径
          }, 0);
        }
      });
    },
    // 获取业务规则定义
    getRequiredTabsInfo() {
      this.$loading.show();
      getRequiredTabsInfoApi().then((res) => {
        // 需要根据业务规则配置，判断是否需要默认带出一条数据
        // ADDRESS：地址 | CONTACT：联系人 | BANK：银行
        this.mustInputTabs = res;
        if (res.includes("CONTACT")) {
          this.titlePrompt = this.titlePrompt + "【" + this.$T("sslm.supplierWarehouse.view.warehous.contact").$D("联系人") + "】";
        }
        if (res.includes("ADDRESS")) {
          this.titlePrompt = this.titlePrompt + "【" + this.$T("sslm.supplierWarehouse.view.warehous.address").$D("地址") + "】";
        }
        if (res.includes("BANK")) {
          this.titlePrompt = this.titlePrompt + "【" + this.$T("sslm.supplierWarehouse.view.warehous.bankAccount").$D("银行账户") + "】";
        }
        if (res.includes("ATTACHMENT")) {
          this.titlePrompt = this.titlePrompt + "【" + this.$T("sslm.supplierWarehouse.view.warehous.attachment").$D("附件") + "】";
        }
      });
    },
    refreshData() {
      this.basisDataSet.refresh();
      this.contactDataSet.refresh();
      this.addressDataSet.refresh();
      this.bankDataSet.refresh();
      this.attachmentDataSet.refresh();
      this.purchaseHeaderDataSet.refresh();
      this.purchaseLineDataSet.refresh();
    },
    /**
     * 处理错误信息
     * @param {*} checkDataSet 检验ds
     * @param {*} errFieldCode 报错显示字段编码
     * @returns
     */
    handleErrorMsg(checkDataSet, errFieldCode) {
      let errMsg = {};
      let errMsgMeanning = "";
      forEach(checkDataSet.records, (item) => {
        const { validated, fields, data, index } = item || {};
        if (!validated) {
          const fieldMsg = [];
          forEach(fields, (field) => {
            const { errorMessage, displayErrorMessage, fieldName } = field;
            if (!isEmpty(field.errorMessage) || !isEmpty(field.displayErrorMessage)) {
              const fieldMsgMeannig = `${fieldName}:${errorMessage || displayErrorMessage}`;
              fieldMsg.push(fieldMsgMeannig);
            }
          });
          errMsg[data[`${errFieldCode}`] || index] = fieldMsg;
        }
      });
      Object.entries(errMsg).forEach(([ key, value ]) => {
        const msg = `[${key}|${value.join(",")}]`;
        errMsgMeanning = errMsgMeanning.concat(msg, " ");
      });
      return errMsgMeanning;
    },
    //处理按钮
    handlerPre(type) {
      // 校验基础信息
      if (!this.basisDataSet.validate()) {
        return;
      }
      if (!this.$refs.basisDetailRef.validate()) {
        this.$notification.open({
          message: `${this.$T("sslm.common.view.archiveFilled.baseInfo").$D("基础信息")}${this.$T("smbl.common.view.message.detailsPageRequired").$D("请填写详情页必输字段")}`,
          duration: 1000,
        });
        return;
      }
      // 校验联系人信息
      const { mail, mobilephone, extContactReqId } = this.contaDetailctInfo;
      const formatFlag = !isEmpty(extContactReqId) && (!isEmpty(mail) || !isEmpty(mobilephone));
      if (this.contactDataSet?.data?.length > 0 && formatFlag && !this.$refs.contactDetailRef.validate()) {
        const errmessage = this.$refs.contactDetailRef.filedValidateMessageMap;
        let errMessage = "";
        forEach(errmessage, (item) => {
          if (!isEmpty(item)) {
            errMessage = errMessage.concat(item, " ");
          }
        });
        this.$notification.open({
          message: `${this.$T("sslm.supplierWarehouse.view.warehous.contactDetail").$D("联系人详情")} ${errMessage}`,
          duration: 1000,
        });
        return;
      }
      if (!this.contactDataSet.validate()) {
        const errMsg = this.handleErrorMsg(this.contactDataSet, "name");
        this.$notification.open({
          message: `${this.$T("sslm.supplierWarehouse.view.warehous.contact").$D("联系人")} ${errMsg}`,
          duration: 2000,
        });
        return;
      }
      // 校验地址信息
      if (!this.addressDataSet.validate()) {
        const errMsg = this.handleErrorMsg(this.addressDataSet, "regionPathName");
        this.$notification.open({
          message: `${this.$T("sslm.supplierWarehouse.view.warehous.address").$D("地址")} ${errMsg}`,
          duration: 2000,
        });
        return;
      }
      // 校验是否选择到最末级
      if (!this.regionPathNameIsLeaf) {
        this.$notification.open({
          message: this.$T("sslm.supplierWarehouse.view.message.regionPathNameWarning").$D(
            "城市未选择到最末级"
          ),
          duration: 1000,
        });
        return;
      }
      // 校验银行信息
      if (!this.bankDataSet.validate()) {
        const errMsg = this.handleErrorMsg(this.bankDataSet, "bankName");
        this.$notification.open({
          message: errMsg,
          duration: 2000,
        });
        return;
      }
      // 校验附件信息
      if (!this.attachmentDataSet.validate()) {
        return;
      }
      // 校验采购财务信息
      if (!this.purchaseHeaderDataSet.validate()) {
        return;
      }
      if (!this.purchaseLineDataSet.validate()) {
        return;
      }
      if (type === "save") {
        this.save();
      } else if (type === "submit") {
        const checkFlag = this.checkMustInputTabs();
        if (checkFlag) {
          this.submit();
        }
      } else if (type === "delete") {
        this.delete();
      }
    },
    // 提交
    submit() {
      const params = this.buildParams("submit");
      const { supplierName } = params;
      const data = params.extSupBkAccountReqs || [];
      const bankAccountList = data.map((n) => {
        const { extBkAccountReqId, bankAccountName, bankAccountNum, enabledFlag } = n;
        return {
          bankAccountId: extBkAccountReqId,
          bankAccountName,
          bankAccountNum,
          enabledFlag,
        };
      });
      checkBankAccountCommon({
        bankAccountList,
        documentSource: "EXT_SUPPLIER_REQ",
        companyName: supplierName,
        documentId: this.extSupplierReqId || -1,
      }).then((res) => {
        if (res && !res.failed) {
          const { bankDataFlag = true, bankNameFlag = true } = res || {};
          const checkRepeat = isBoolean(bankDataFlag) && !bankDataFlag;
          // 银行名称不一致需要前端校验的场景
          const checkDifferent = isBoolean(bankNameFlag) && !bankNameFlag && this.checkMode === "weakCheck";
          if (checkRepeat || checkDifferent) {
            const bankRepeatMsg = checkRepeat ? this.$T("sslm.common.view.message.bankDuplicateTips").$D("存在银行账户重复的数据，请检查数据，确认是否继续提交") : "";
            const bankAccountDifferentMsg = checkDifferent ? this.$T("sslm.common.view.message.bankAccountDifferentTips").$D("银行账户名称与公司名称不一致，请确认是否继续提交") : "";
            const that = this;
            this.$dialog({
              content: <div>
                <div>{bankRepeatMsg}</div>
                <div>{bankAccountDifferentMsg}</div>
              </div>,
              closable: false,
              onOk() {
                that.submitApi(params);
              }
            });
          } else {
            this.submitApi(params);
          }
        }
      });
    },
    submitApi(params) {
      this.$loading.show();
      submitSupplierInfoApi(params).then((res) => {
        if (res.failed && res.message) {
          this.$notification.open({
            message: res.message,
            duration: 1500,
          });
          this.$loading.hide();
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.submit.success").$D(
              "提交成功"
            ),
            duration: 1000,
          });
          this.$loading.hide();
          // 返回列表页
          this.$router.replace({ name: "SimpleSupWarehouseList" });
        }
      });
    },
    // 删除
    delete() {
      const params = [];
      params.push(this.buildParams("delete"));
      const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.BASIC_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.BANK_ACCOUNT,SSLM.EASY_SUPPLIER_WAREHOUSE.CONTACT_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ADDRESS_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ATTACHMENT";
      this.$loading.show();
      deleteSupplierInfoApi(params, customizeUnitCode).then(() => {
        this.$notification.open({
          message: this.$T("smbl.common.message.operateSuccess").$D(
            "操作成功"
          ),
          duration: 1000,
        });
        this.$loading.hide();
        // 返回列表页
        this.$router.replace({ name: "SimpleSupWarehouseList" });
      });
    },
    // 保存和提交，校验必输tab页
    checkMustInputTabs() {
      let checkflag = true;
      if (this.mustInputTabs.includes("CONTACT")) {
        if (!(this.contactDataSet.data.length > 0)) {
          this.$notification.open({
            message: this.$T("sslm.siteInvestigateReport.view.warehous.contactAtLastOne").$D(
              "请至少填写一条默认联系人"
            ),
            duration: 1000,
          });
          checkflag = false;
        }
      }
      if (this.mustInputTabs.includes("ADDRESS")) {
        if (!(this.addressDataSet.data.length > 0)) {
          this.$notification.open({
            message: this.$T("sslm.siteInvestigateReport.view.warehous.addressAtLastOne").$D(
              "请至少填写一条地址信息。"
            ),
            duration: 1000,
          });
          checkflag = false;
        }
      }
      if (this.mustInputTabs.includes("BANK")) {
        if (!(this.bankDataSet.data.length > 0)) {
          this.$notification.open({
            message: this.$T("sslm.siteInvestigateReport.view.warehous.bankAccountAtLastOne").$D(
              "请至少填写一条银行主账户。"
            ),
            duration: 1000,
          });
          checkflag = false;
        }
      }
      if (this.mustInputTabs.includes("ATTACHMENT")) {
        if (!(this.attachmentDataSet.data.length > 0)) {
          this.$notification.open({
            message: this.$T("sslm.siteInvestigateReport.view.message.maintainAtLeast").$D(
              "请至少填写一条附件信息"
            ),
            duration: 1000,
          });
          checkflag = false;
        }
      }
      return checkflag;
    },
    // 处理传参
    buildParams(type) {
      let params = {};
      if (type === "save" || type === "submit") {
        params = this.basisDataSet.data[0];
        params.extSupplierContactReqs = this.contactDataSet.data;
        params.extSupplierAddressReqs = this.addressDataSet.data;
        params.extSupBkAccountReqs = this.bankDataSet.data;
        params.extSupplierAttachmentReqs = this.attachmentDataSet.data;
        // 处理采购财务-头信息，表单只取一条数据
        const extSupplierPfReq = this.purchaseHeaderDataSet.current ? this.purchaseHeaderDataSet.current.data : null;
        params.extSupplierPfReq = extSupplierPfReq;
        params.extSupplierPfLineReqs = this.purchaseLineDataSet.data;
      } else if (type === "delete") {
        params = this.basisDataSet.data[0];
      }
      return params;
    },
    goToContactDetail(record) {
      this.contaDetailctInfo = record;
      this.contactPop = !this.contactPop;
    },
    goToBasisDetail(record) {
      this.basisDetailInfo = record;
      this.basisPop = !this.basisPop;
    },
  },
};