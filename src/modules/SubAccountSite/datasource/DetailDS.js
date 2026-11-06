
import { $T, SrmUtil } from "srm-mobile-ui";

function baseInfoDS(id) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: Number(SrmUtil.getTenantId()) === 0 ? null : "HIAM.SUB_ACCOUND.EDIT.FORM_EDIT",
    },
    fields: [ {
      fieldCode: "loginName",
      fieldName: $T("hiam.subAccount.model.user.loginName").$D("账号"),
      fieldType: "TEXT",
    }, {
      fieldCode: "realName",
      fieldName: $T("hiam.subAccount.model.user.realName").$D("名称"),
      fieldType: "TEXT",
    }, {
      fieldCode: "nickname",
      fieldName: $T("hiam.subAccount.model.user.nickname").$D("昵称"),
      fieldType: "TEXT",
    }, {
      fieldCode: "gender",
      fieldName: $T("hzero.common.gender").$D("性别"),
      fieldType: "TEXT",
      render: (val) => {
        if (val === null || typeof val === "undefined" || val === "") {
          return "-";
        }
        return Number(val) ? $T("hzero.common.gender.male").$D("男") : $T("hzero.common.gender.female").$D("女");
      }
    }, {
      fieldCode: "birthday",
      fieldName: $T("hiam.subAccount.model.user.birthday").$D("出生日期"),
      fieldType: "TEXT",
    }, {
      fieldCode: "countryName",
      fieldName: $T("hiam.subAccount.model.user.countryId").$D("国家"),
      fieldType: "TEXT"
    }, {
      fieldCode: "regionName",
      fieldName: $T("hiam.subAccount.model.user.regionId").$D("地区"),
      fieldType: "TEXT",
    }, {
      fieldCode: "addressDetail",
      fieldName: $T("hiam.subAccount.model.user.addressDetail").$D("详细地址"),
      fieldType: "TEXT"
    }, {
      fieldCode: "phone",
      fieldType: "TEXT",
      fieldName: $T("hiam.subAccount.model.user.phone").$D("手机号码"),
      render: (val, item) => item.internationalTelMeaning ? `${item.internationalTelMeaning} | ${val || "-"}` : val,
    }, {
      fieldCode: "email",
      fieldType: "TEXT",
      fieldName: $T("hiam.subAccount.model.user.email").$D("邮箱"),
    }, {
      fieldCode: "startDateActive",
      fieldType: "TEXT",
      fieldName: $T("hiam.subAccount.model.user.expiryDate").$D("有效期"),
      render: (val, item) => `${val || ""} - ${item.endDateActive || ""}`
    }, {
      fieldCode: "enabled",
      fieldType: "TEXT",
      fieldName: $T("hiam.subAccount.model.user.isFreeze").$D("是否冻结"),
      render: (val) => val ? $T("smbl.common.view.no").$D("否") : $T("smbl.common.view.yes").$D("是")
    } ],
    transport: {
      read: {
        url: Number(SrmUtil.getTenantId()) === 0 ? `/iam/hzero/v1/users/${id}/info` :
          `/iam/hzero/v1/${SrmUtil.getTenantId()}/users/${id}/info`,
        method: "get",
      },
    },
    events: {
    }
  };
}

function roleListDS(id) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {
    },
    fields: [ {
      fieldCode: "name",
      fieldName: $T("hiam.subAccount.model.role.name").$D("角色名称"),
      fieldType: "TEXT",
    }, {
      fieldCode: "tenantName",
      fieldName: $T("hiam.subAccount.model.role.roleTenantName").$D("角色所属租户名称"),
      fieldType: "TEXT",
    }, {
      fieldCode: "startDateActive",
      fieldName: $T("hiam.subAccount.model.role.expiryDate").$D("有效期"),
      fieldType: "TEXT",
      render: (val, item) => `${val || ""} - ${item.endDateActive || ""}`
    } ],
    transport: {
      read: {
        url: Number(SrmUtil.getTenantId()) === 0 ? `/iam/hzero/v1/member-roles/user-roles/${id}` :
          `/iam/hzero/v1/${SrmUtil.getTenantId()}/member-roles/user-roles/${id}`,
        method: "get",
      },
    },
  };
}

export {
  baseInfoDS,
  roleListDS
};
