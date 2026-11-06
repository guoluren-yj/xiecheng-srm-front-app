import { $T, SrmUtil } from "srm-mobile-ui";

function listDataSource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      defaultTenant: SrmUtil.getTenantId(),
      customizeUnitCode: Number(SrmUtil.getTenantId()) === 0 ? null : "HIAM.SUB_ACCOUND.GRID",
    },
    fields: [ {
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
    fastQueryField: {
      fieldCode: "loginOrRealName",
      fieldType: "TEXT",
      fieldName: $T("smbl.common.view.query.queryAccountOrName").$D("账号/名称"),
    },
    // 查询表单字段
    queryFields: [ {
      fieldCode: "phone",
      fieldName: $T("hiam.subAccount.model.user.phone").$D("手机号码"),
      fieldType: "INPUT_NUMBER"
    }, {
      fieldCode: "email",
      fieldName: $T("hiam.subAccount.model.user.email").$D("邮箱"),
      fieldType: "INPUT"
    }, {
      fieldCode: "enabled",
      fieldName: $T("smbl.common.view.query.accountState").$D("状态"),
      fieldType: "SELECT",
      options: {
        displayField: "meaning",
        valueField: "value",
        listData: [ {
          value: "1",
          meaning: $T("smbl.common.view.query.accountStateNormal").$D("未冻结"),
        }, {
          value: "0",
          meaning: $T("smbl.common.view.query.accountStateFreeze").$D("冻结"),
        } ]
      }
    } ],
    transport: {
      read: {
        url: Number(SrmUtil.getTenantId()) === 0 ? "/iam/hzero/v1/users/paging" :
          `/iam/hzero/v1/${SrmUtil.getTenantId()}/users/paging`,
        method: "get",
      },
    },
    events: {
    }
  };
}

export default listDataSource;
