const RED = "#F06200";

const cusRenderer = (text) =>
  <span style={{ color: RED, }}>
    {text ?? "-"}
  </span>;

const getCUXPricingBasicInfoColumnsAKBL = () => {
  const fields = [
    {
      fieldCode: "suggestedFlag",
      render: (_, record) => {
        const { suggestedFlagMeaning } = record || {};
        return cusRenderer(suggestedFlagMeaning);
      }
    },
  ];

  return fields;
};

export {
  getCUXPricingBasicInfoColumnsAKBL,
};
