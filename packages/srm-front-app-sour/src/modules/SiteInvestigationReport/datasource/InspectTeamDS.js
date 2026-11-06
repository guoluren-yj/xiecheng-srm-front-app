import { SrmUtil, $T } from "srm-mobile-ui";

// manage时编辑basic状态
function isInspectTeamEditable(item, useType, readOnly = false) {
  if (useType === "NEW") {
    return false;
  }
  if (useType === "FILLED") {
    return false;
  }
  return !readOnly && item.evalStatus === "NEW" || item.evalStatus === "FEEDBACK";
}

function inspectTeamDS(id, localNum, useType, readOnly = false) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    selection: 20,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    fields: [ {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.childAccount").$D("子账户"),
      fieldType: "LOV",
      fieldCode: "userId",
      displayField: "loginName",
      // displayField: "itemCode",
      lovCode: "SSLM.TENANT.SUB.ACCOUNT",
      editor: (val, item) => isInspectTeamEditable(item, useType, readOnly),
      options: {
        valueField: "id",
        displayField: "loginName",
        subDisplayField: "name",
        onClear: (ds) => {
          const member = ds.current && ds.current.getField("member");
          member.setData(null);
          const department = ds.current && ds.current.getField("department");
          department.setData(null);
          const post = ds.current && ds.current.getField("post");
          post.setData(null);
          const phone = ds.current && ds.current.getField("phone");
          phone.setData(null);
          const email = ds.current && ds.current.getField("email");
          email.setData(null);
        },
        callback: (val, fieldCode, display, ds) => {
          let item = {};
          if (val.length) {
            item = val[0];
          }
          const member = ds.current && ds.current.getField("member");
          member.setData(item.name);
          const department = ds.current && ds.current.getField("department");
          department.setData(item.unitName);
          const post = ds.current && ds.current.getField("post");
          post.setData(item.positionName);
          const phone = ds.current && ds.current.getField("phone");
          phone.setData(item.mobile);
          const email = ds.current && ds.current.getField("email");
          email.setData(item.email);
        },
      },
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.members").$D("组员"),
      fieldType: "INPUT",
      fieldCode: "member",
      editor: (val, item) => isInspectTeamEditable(item, useType, readOnly),
      required: (val, item) => isInspectTeamEditable(item, useType, readOnly),
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.department").$D("部门"),
      fieldType: "INPUT",
      fieldCode: "department",
      editor: (val, item) => isInspectTeamEditable(item, useType, readOnly),
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.post").$D("职位"),
      fieldType: "INPUT",
      fieldCode: "post",
      editor: (val, item) => isInspectTeamEditable(item, useType, readOnly),
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.contactWay").$D("联系方式"),
      fieldType: "INPUT_NUMBER",
      fieldCode: "phone",
      // editor: (val, item) => isInspectTeamEditable(item, useType,readOnly),
      required: (val, item) => isInspectTeamEditable(item, useType, readOnly),
      disabled: (val, item) => !isInspectTeamEditable(item, useType, readOnly),
      prefixField:{
        lovCode:"HPFM.IDD",
        defaultValue:{ value: "+86", meaning:$T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
        // displayField:"internationalTelCodeMeaning",
        fieldCode:"internationalTelCode",
        fieldType: "SELECT"
      },
    }, {
      fieldName: $T("sslm.commonApplication.model.supplierData.email").$D("邮箱"),
      fieldType: "INPUT",
      fieldCode: "email",
      editor: (val, item) => isInspectTeamEditable(item, useType, readOnly),
      required: (val, item) => isInspectTeamEditable(item, useType, readOnly),
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.isLeader").$D("是否组长"),
      fieldType: "SELECT",
      fieldCode: "leaderFlag",
      displayField: "leaderFlagMeaning",
      editor: (val, item) => isInspectTeamEditable(item, useType, readOnly),
      clearButton: false,
      options: {
        displayField: "meaning",
        valueField: "value",
        listData: [ {
          meaning: $T("smbl.common.view.yes").$D("是"),
          value: "1",
        }, {
          meaning: $T("smbl.common.view.no").$D("否"),
          value: "0",
        }, ],
      },
    } ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-groups/${id}`,
        method: "get",
      },
      destroy: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-groups`,
        method: "delete",
      },
      submit: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-groups`,
        method: "post",
      }
    },
    events: {
      beforeSubmit: (ds, datas) => {
        // 优化为参数外部传入
        // datas.splice(0, datas.length);
        let evalHeaderId = id;
        datas.forEach((element) => {
          element.evalHeaderId = evalHeaderId;
        });
        return datas.length;
      },
      beforeDelete: (ds, datas) => {
        let ids = [];
        datas.forEach((element) => {
          if (element.evalGroupId) {
            ids.push(element.evalGroupId);
          }
        });
        datas.splice(0, datas.length);
        datas.push(...ids);
        return datas.length;
      },
    }
  };
}

export {
  inspectTeamDS
};