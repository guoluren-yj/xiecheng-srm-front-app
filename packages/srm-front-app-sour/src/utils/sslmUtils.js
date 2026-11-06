/* eslint-disable valid-jsdoc */
import { $T, SrmUtil } from "srm-mobile-ui";
import { isNil } from "lodash";

/**
 * render yes no 数字或英文渲染为中文
 * @param {*} renderValue 原始值
 * @returns 处理值
 * 为空显示 “-”
 */
export function yesOrNoRender(renderValue = null) {
  const translateTorNumber = (value = null) => {
    const result = !value || value === "0" || value === "NO" || value === "N" ? 0 : 1;
    return result;
  };
  const currentValue = isNil(renderValue) ? null : translateTorNumber(renderValue);
  return isNil(currentValue) ? "-" : currentValue ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");
}

/**
 * 拼接多条数据传入字段
 * @param {*} arrs 传入数组数据
 * @param {*} itemName 返回的行字段名称
 * @returnVal 处理值
 */
export function mergeArrs(inArrs = [], itemName = "") {
  let arr = [];
  if (inArrs) {
    inArrs.forEach((element) => {
      arr.push(element[`${itemName}`]);
    });
  }
  const returnVal = arr.join("/");
  return returnVal;
}

/**
 * 手机号加拼接国别码处理
 * @param {*} mobilephone 手机号
 * @param {*} record 当前行数据
 * @param {*} type 0:默认先取国别码中文描述，再取取国别码编码 | 1:取国别码中文描述 ｜ 2:取国别码编码
 * @return 处理值
 */
export function handleMobilephone(mobilephone = "", record = {}, type = 0) {
  // internationalTelMeaning：国别码中文描述 ｜ internationalTel：国别码编码
  const { internationalTelMeaning = "", internationalTelCode = "" } = record;
  let internationalTel = "";
  switch (Number(type)) {
  case 1:
    internationalTel = internationalTelMeaning;
    break;
  case 2:
    internationalTel = internationalTelCode;
    break;
  default:
    internationalTel = internationalTelMeaning || internationalTelCode;
    break;
  }
  return internationalTel ? `${internationalTel} | ${mobilephone}` : mobilephone;
}

/**
 * 附件按钮查看组件
 * 使用场景，当附件字段只展示单个附件，且通过附件url查看时，使用该组件，返回一个带名称的文本按钮样式，点击可查看附件
 * @param {string} title 按钮显示名称
 * @param {string} disabled 禁用
 * @param {string} type 按钮类型
 * @param {string} size 按钮大小
 * @param {string} fielName 附件名称
 * @param {boolean} fielUrl 附件预览地址
 * @param {string} bucketName 桶名
 */
export function renderPreviewBtn(params) {
  const {
    title = $T("smbl.common.view.button.view").$D("查看"),
    disabled = false,
    type = "primary",
    fielName = "",
    fielUrl = "",
    bucketName = SrmUtil.getDefaultBucketName(),
  } = params;
  return (
    <srm-button
      plain
      disabled = {disabled}
      type = {type}
      onClick={() => SrmUtil.previewFile({
        fileName: fielName,
        fileUrl: fielUrl,
        bucketName: bucketName,
      })}
    >
      {title}
    </srm-button>
  );
}

// 绿色状态集合
const greenStatus = [
  "FEEDBACK_BAK",
  "SCORED",
  "COMPLETED",
  "CONFIRMED",
  "APPROVED",
  "EFFECTED",
  "TERMINATION_CONFIRM",
  "HAVE_ALTERATION",
  "ARCHIVE",
  "APPROVE",
  "SYSTEM_COMPLETE",
  "MANUAL_COMPLETE",
  "FINAL_COLLECTED",
  "FEEDBACK",
  "UN_SOURCE",
  "OPENED",
  "POSTQUAL_CUTOFF",
  "FINISHED",
  "PUBLISHED",
  "VALIDATED",
  "REVIEWED",
  "REGISTERED",
  "PASS",
  "CERTIFICATED",
  "RELEASED",
  "COMPLETE",
  // 调查表模板生效状态为1
  1,
  "1",
  "5",
  5,
  "EVALUATED",
  "AUTHENTICATION_APPROVED",
  "EARLY_TERMINATION",
  "FINAL_AUTHENTICATION_COMPLETE",
  "SUBMITTED",
  "SUPPLIER_REJECTED",
  "SUPPLEMENT_COMPLETE",
  "REISSUED",
  "CREATE",
  "SUBMIT",
  "FINISHED@WFL",
  "APPROVING@WFL",
  "FUNC_APPROVE",
  "FEEDBACK_BAK",
  "ICA_SUBMITTED",
  "PCA_SUBMITTED",
  "SUPPLIER_CONFIRMED",
  "supplierConfirmed",
  "NEW_APPROVED",
  "published",
  "PARTIAL_PUBLISHED",
];

// 红色状态集合
const redStatus = [
  "BACK",
  "REJECTED",
  "REJECT",
  "SYSTEM_FAIL",
  "RETURNED",
  "RELEASE_REJECT",
  "CONFIRM_REJECT",
  "BACK_SCORE",
  "RELEASE_REJECTED",
  "LACK_QUOTED",
  "CHECK_REJECTED",
  "PAUSED",
  "ICA_REJECTED",
  "PCA_REJECTED",
  "CANCEL FINISH APPROVAL REJECT",
  "PUBULISH APPROVAE REJECT",
  "FAIL",
  "WFL_REJECT",
  "REG_REJECT",
  "AUTHENTICATION_REJECTED",
  "CONFIRM_REJECTED",
  "REJECTED@WFL",
  "BACK",
  "NEW_REJECTED",
  "6",
  "SCORE_REJECTED",
];

// 灰色状态集合
const grayStatus = [
  "EXPIRED",
  "DELETED",
  "TERMINATION",
  "CANCELLATION",
  "CANCEL",
  "DISCARDED",
  "CLOSED",
  "CANCELED",
  "CANCELLED",
  "ABANDON",
  "RETAIN",
  "UNCERTIFIED",
  "UNREGISTERED",
  "UNSTART", // 未开始
  "UN_START",
  "REGISTER",
  "DISABLED",
  "OBSOLETED",
  "UNCHANGED",
  "DELETE",
  "2",
  "STAY_REVIEW",
  "NO_PARTNER",
  4,
  "4",
];

// 获取Tag组件color
export function getTagColor(status) {
  const color = greenStatus.includes(status) ? "green" : // 绿色
    redStatus.includes(status) ? "red" : // 红色
      grayStatus.includes(status) ? "gray" : // 灰色
        "#FFC043"; // 橙色
  return color;
}

// 渲染状态颜色
export function renderStatus(status) {
  const color = getTagColor(status);
  return color;
}

// 渲染手机号
export function renderPhone(record, phone) {
  const { internationalTelMeaning, internationalTelCode } = record || {};
  if (!isNil(internationalTelCode) || !isNil(internationalTelMeaning)) {
    return !isNil(internationalTelMeaning) ? `${internationalTelMeaning} | ${phone}` : `${internationalTelCode} | ${phone}`;
  }
  return phone;
}

/**
 * 手机号校验
 * 使用范围：[srm-list | srm-form 组件可使用，customize ｜ customize-detail 组件不适用]
 * mobile: 手机号
 * _that: 页面上下文对象
 * record：行数据
 * field：ds字段属性
 **/
export function validatorMobile(mobile, record, field, _that) {
  if (!isNil(mobile)) {
    if (!SrmUtil.isMobileNumber(mobile)) {
      // 设置提示信息
      field.errorMessage = $T("smbl.common.message.mobilePhoneNumberFormatIncorrect!").$D("手机号码格式不正确！");
      if (!isNil(_that) && mobile.length > 10) {
        _that.$notification.open({
          message: $T("smbl.common.message.mobilePhoneNumberFormatIncorrect!").$D("手机号码格式不正确！"),
          duration: 1000,
        });
      }
      return false;
    }
    return true;
  }
  return true;
}

/**
 * 邮箱校验 [srm-list | srm-form 组件使用]
 * 使用范围：[srm-list | srm-form 组件可使用，customize ｜ customize-detail 组件不适用]
 * mail: 邮箱
 * _that: 页面上下文对象
 * record：行数据
 * field：ds字段属性
 * patternExpression:正则表达式
 **/
export function validatorMail(mail, record, field, _that, patternExpression) {
  // eslint-disable-next-line no-useless-escape
  const pattern = patternExpression || /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!isNil(mail)) {
    if (!pattern.test(mail)) {
      // 设置提示信息
      field.errorMessage = $T("smbl.common.message.mailFormatIncorrect!").$D("邮箱格式不正确！");
      if (!isNil(_that)) {
        _that.$notification.open({
          message: $T("smbl.common.message.mailFormatIncorrect!").$D("邮箱格式不正确！"),
          duration: 1000,
        });
      }
      return false;
    }
    return true;
  }
  return true;
}

/**
 * 邮编校验 [srm-list | srm-form 组件使用]
 * 使用范围：[srm-list | srm-form 组件可使用，customize ｜ customize-detail 组件不适用]
 * mail: 邮箱
 * _that: 页面上下文对象
 * record：行数据
 * field：ds字段属性
 * patternExpression:正则表达式
 **/
export function validatorPostCode(postCode, record, field, _that, patternExpression) {
  // eslint-disable-next-line no-useless-escape
  const pattern = patternExpression || /^[0-9]{6}$/;
  if (!isNil(postCode)) {
    if (!pattern.test(postCode)) {
      // 设置提示信息
      field.errorMessage = $T("smbl.common.message.postCodeFormatIncorrect!").$D("邮政编码格式不正确！");
      if (!isNil(_that)) {
        _that.$notification.open({
          message: $T("smbl.common.message.postCodeFormatIncorrect!").$D("邮政编码格式不正确！"),
          duration: 1000,
        });
      }
      return false;
    }
    return true;
  }
  return true;
}

/**
 * 银行账号校验 [srm-list | srm-form 组件使用]
 * 使用范围：[srm-list | srm-form 组件可使用，customize ｜ customize-detail 组件不适用]
 * mail: 邮箱
 * _that: 页面上下文对象
 * record：行数据
 * field：ds字段属性
 * patternExpression:正则表达式
 **/
export function validatorBankAccount(bankAccount, record, field, _that, patternExpression) {
  // eslint-disable-next-line no-useless-escape
  const pattern = patternExpression || /^[0-9A-Za-z-@._,/]*$/;
  const patternFlag = pattern.test(bankAccount);
  if (!isNil(bankAccount)) {
    if (!patternFlag) {
      // 设置提示信息
      field.errorMessage = $T("smbl.common.message.bankAccountFormatIncorrect!").$D("银行账号格式不正确！");
      if (!isNil(_that)) {
        _that.$notification.open({
          message: $T("smbl.common.message.bankAccountFormatIncorrect!").$D("银行账号格式不正确！"),
          duration: 1000,
        });
      }
      return false;
    }
    return true;
  }
  return true;
}

// 获取tag文本
const getTagText = (type = "") => {
  const map = {
    create: {
      text: $T("sslm.common.conent.create").$D("新增"),
      style: {
        color: "#05944F",
        backgroundColor: "#E6F2ED",
      }
    },
    update: {
      text: $T("sslm.common.conent.change").$D("变更"),
      style: {
        color: "#FC8800",
        backgroundColor: "rgb(252, 136, 0, 0.15)",
      },
    },
    delete: {
      text: $T("sslm.common.conent.delete").$D("删除"),
      style: {
        color: "#757575",
        backgroundColor: "#F0F2F5",
      },
    },
  };
  return map[type] || {};
};

// 新增，变更，删除 Tag
export const renderUpdateTag = (record = {}) => {
  const deleteFlag = [ "DELETE" ].includes(record.objectFlag) ||
    [ "DELETE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "delete" ].includes(record.supChangeBeanStateFlag);
  const createFlag = [ "CREATE" ].includes(record.objectFlag) ||
    [ "insert", "CREATE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "insert" ].includes(record.supChangeBeanStateFlag);
  const updateFlag = [ "UPDATE" ].includes(record.objectFlag) ||
    [ "update", "UPDATE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "update", "UPDATE" ].includes(record.supChangeBeanStateFlag);
  const type = createFlag ? "create" :
    deleteFlag ? "delete" :
      updateFlag ? "update" : "";
  const tagObj = getTagText(type);
  const { text, style = {} } = tagObj;
  if (!text) {
    return null;
  }
  return <SrmTag
    style={{ ...style }}
  >
    {text}
  </SrmTag>;
};