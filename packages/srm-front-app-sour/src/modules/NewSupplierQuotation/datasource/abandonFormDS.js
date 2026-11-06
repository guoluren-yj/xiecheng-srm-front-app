import { $T } from "srm-mobile-ui";

const abandonFormDS = () => ({
  selection: false,
  autoCreate: true,
  forceValidate: true,
  fields: [
    {
      fieldName: $T("ssrc.supplierQuotation.model.supQuo.giveUpReason").$D("关闭理由"),
      fieldCode:"abandonRemark",
      fieldType: "EMPTY",
      required: true,
      minRows: 4,
      editor: false,
      placeholder: $T("ssrc.supplierQuotation.view.title.pleaseInputgiveUpReason").$D("请输入放弃理由"),
      inputChange: (val, item, field, record) => {
        record.set("abandonRemark", val);
        item.abandonRemark = val;
      },
    },
  ],
});

export { abandonFormDS };
