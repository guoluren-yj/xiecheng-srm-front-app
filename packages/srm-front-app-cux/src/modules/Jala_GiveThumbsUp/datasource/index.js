import { $T } from "srm-mobile-ui";
import { isEmpty } from "@/utils/index";

function likeLaunchData() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "supplierId",
        fieldName: $T("scux.supplierGiveThumbsUp.model.supplierIdLov").$D("供应商"),
        fieldType: "LOV",
        lovCode: "SCUX_JALA_LIKE_SUPPLIER",
        required: true,
      },
      {
        fieldCode: "coinQuantity",
        fieldName: $T("scux.supplierGiveThumbsUp.model.coinQuantity").$D("蓝币数"),
        fieldType: "SELECT",
        required: true,
        lovCode: "SCUX_JALA_LIKE_COIN",
      },
      {
        fieldCode: "likeAssort",
        fieldName: $T("scux.supplierGiveThumbsUp.model.likeAssort").$D("点赞维度"),
        fieldType: "SELECT",
        lovCode: "SCUX_JALA_LIKE_ASSORT"
      },
      {
        fieldCode: "likeAssortDimensionOne",
        fieldName: $T("scux.supplierGiveThumbsUp.model.likeAssortDimension").$D("点赞行为"),
        fieldType: "SELECT",
      },
      {
        fieldCode: "likeAssortDimensionTwo",
        fieldName: $T("scux.supplierGiveThumbsUp.model.likeAssortDimension").$D("点赞行为"),
        fieldType: "SELECT",
      },
      {
        fieldCode: "remark",
        fieldName: $T("scux.supplierGiveThumbsUp.model.remark").$D("想对ta说"),
        fieldType: "INPUT",
        required: true,
      },
    ],
  };
}

function getFields() {
  return [
    // {
    //   // fieldCode: "rank",
    //   // fieldName: $T("scux.supplierGiveThumbsUp.model.rank").$D("排名"),
    //   // fieldType: "TEXT",
    // },
    {
      fieldCode: "supplierName",
      // fieldName: $T("scux.supplierGiveThumbsUp.model.supplierName").$D("供应商名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "blueCoin",
      // fieldName: $T("scux.supplierGiveThumbsUp.model.blueCoin").$D("蓝币数"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "medalNum",
      // fieldName: $T("scux.supplierGiveThumbsUp.model.medalNum").$D("勋章"),
      fieldType: "TEXT",
    },
  ];
}

function monthlyRanking() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: getFields(),
    transport: {
      read: {
        url: `/scux2/v1/${localStorage.getItem("organizationId")}/jala-like-Leaderboard/monthly/list`,
        method: "get",
      },
    },
  };
}
function queryFieldsAll() {
  return {
    monthlyRanking: [
      {
        fieldCode: "monthlyDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.supplierGiveThumbsUp.model.monthlyDate").$D("月份"),
        yearPicker: true,
        options: {
          monthPicker: true,
        },
      },
      {
        fieldCode: "categoryCode",
        fieldType: "SELECT",
        fieldName: $T("scux.supplierGiveThumbsUp.model.categoryCode").$D("品类"),
        lovCode: "SCUX_JALA_LIKE_CATEGORY",
      },
    ],
    yearRanking: [
      {
        fieldCode: "yearDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.supplierGiveThumbsUp.model.yearDate").$D("年度"),
        yearPicker: true,
      },
      {
        fieldCode: "categoryCode",
        fieldType: "SELECT",
        fieldName: $T("scux.supplierGiveThumbsUp.model.categoryCode").$D("品类"),
        lovCode: "SCUX_JALA_LIKE_CATEGORY",
      },
    ],
    innovation: [
      {
        fieldCode: "monthlyDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.supplierGiveThumbsUp.model.monthlyDate").$D("月份"),
        yearPicker: true,
        options: {
          monthPicker: true,
        },
      },
      {
        fieldCode: "likeAssortDimension",
        fieldType: "SELECT",
        fieldName: $T("scux.supplierGiveThumbsUp.model.likeAssortDimension").$D("创新维度"),
        lovCode: "SCUX_JALA_LIKE_DIMENSION_INNOVATION",
      },
      {
        fieldCode: "categoryCode",
        fieldType: "SELECT",
        fieldName: $T("scux.supplierGiveThumbsUp.model.categoryCode").$D("品类"),
        lovCode: "SCUX_JALA_LIKE_CATEGORY",
      },
    ],
    praise: [
      {
        fieldCode: "monthlyDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.supplierGiveThumbsUp.model.monthlyDate").$D("月份"),
        yearPicker: true,
        options: {
          monthPicker: true,
        },
      },
      {
        fieldCode: "likeAssortDimension",
        fieldType: "SELECT",
        fieldName: $T("scux.supplierGiveThumbsUp.model.likeAssortDimensionNew").$D("好评维度"),
        lovCode: "SCUX_JALA_LIKE_DIMENSION_PRAISE",
      },
      {
        fieldCode: "categoryCode",
        fieldType: "SELECT",
        fieldName: $T("scux.supplierGiveThumbsUp.model.categoryCode").$D("品类"),
        lovCode: "SCUX_JALA_LIKE_CATEGORY",
      },
    ],
  };
}

function yearRanking() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: getFields(),
    transport: {
      read: {
        url: `/scux2/v1/${localStorage.getItem("organizationId")}/jala-like-Leaderboard/year/list`,
        method: "get",
      },
    },
  };
}
function innovation() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: getFields(),
    transport: {
      read: {
        url: `/scux2/v1/${localStorage.getItem("organizationId")}/jala-like-Leaderboard/innovation/list`,
        method: "get",
      },
    },
  };
}
function praise() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: getFields(),
    transport: {
      read: {
        url: `/scux2/v1/${localStorage.getItem("organizationId")}/jala-like-Leaderboard/praise/list`,
        method: "get",
      },
    },
  };
}

function likeRecord(_this) {
  const {
    app: {
      _route: {
        query: { supplierId },
      },
    },
  } = _this.$router;
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("scux.supplierGiveThumbsUp.model.like.time").$D("点赞时间"),
      },
      {
        fieldCode: "coinQuantity",
        fieldName: $T("scux.supplierGiveThumbsUp.model.coinQuantity").$D("蓝币"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "medalNum",
        fieldName: $T("scux.supplierGiveThumbsUp.model.medalNumNew").$D("价值观勋章"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "remark",
        fieldName: !isEmpty(supplierId) ? $T("scux.supplierGiveThumbsUp.model.remark").$D("想对ta说") : $T("scux.supplierGiveThumbsUp.model.remarkNew").$D("Ta对你说"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read:{
        url: !isEmpty(supplierId) ? `/scux2/v1/${localStorage.getItem("organizationId")}/jala-like-Leaderboard/comment/list` : `/scux2/v1/${localStorage.getItem("organizationId")}/jala-like-headers`,
        method: "get",
        params: { supplierId }
      },
    },
  };
}

export { likeLaunchData, monthlyRanking, yearRanking, innovation, praise, likeRecord, queryFieldsAll };