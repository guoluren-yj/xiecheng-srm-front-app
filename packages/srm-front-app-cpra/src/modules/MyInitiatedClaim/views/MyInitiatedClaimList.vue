<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="claimListDs"
      :columns="getListColumns"
      :buttons="getListButtons"
      customize-code="SMBL.MY_INITIATED_CLAIM.LIST"
      @itemClick="onListItemClick"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { isObject, isArray, isString, take, fromPairs } from "lodash";
import StatusTag from "@/components/StatusTag";
import { queryMapIdpValue } from "../api";
import { claimListDS } from "../datasource/myInitiatedClaimListDS";

export default {
  name: "MyInitiatedClaimList",
  modules: [ "hzero.common", "sqam.common", "entity.supplier", "entity.company", "entity.business", "entity.organization", "entity.roles", "ssta.common" ],
  data() {
    return {
      claimListDs: new DataSet(claimListDS()),
    };
  },
  computed: {
    getListColumns() {
      const fieldsList = [
        {
          fieldCode: "formNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { statusCodeMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value}</span>
                <StatusTag
                  slot="right"
                  text={statusCodeMeaning}
                  color={this.statusTypeMap[record.statusCode]}
                />
              </SrmListHeader>
            );
          },
        },
        "formTitle",
        "supplierCode",
        "supplierCompanyName",
        [ "claimTypeName", "currencyName" ],
        "totalAmount",
        [ "appealedFlag", "appealedSum" ],
      ];
      return this.formatListColumns(fieldsList);
    },
    getListButtons() {
      return [
        {
          text: this.$T("hzero.common.button.sync").$D("同步"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => this.claimListDs.updateSelected(),
        },
      ];
    },
  },
  created() {
    this.fetchLookupData();
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        statusTypeMap: "SQAM.CLAIM_STATUS_CODE",
      }).catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        Object.entries(res).forEach(([ key, data ]) => {
          this[key] = fromPairs(
            data.map(({ value, tag, meaning } = {}) => [ value, key === "statusTypeMap" ? tag : meaning ])
          );
        });
      }
    },
    onListItemClick(record) {
      const formHeaderId = record.get("formHeaderId");
      this.$router.push({
        name: "MyInitiatedClaimDetail",
        query: {
          formHeaderId,
        },
      });
    },
    formatListColumns(fieldsList, options = {}) {
      const { endRow = 7, showLabelTop = true } = options;
      const filterList = fieldsList.filter((item) => item);
      return take(filterList, endRow).reduce((total, item, formRow) => {
        const currentList = [];
        if (isArray(item)) {
          item.forEach((childItem, formCol) => {
            if (isObject(childItem)) {
              currentList.push({ formRow, formCol, ...childItem });
            } else if (isString(childItem)) {
              currentList.push({ formRow, formCol, fieldCode: childItem });
            }
          });
        } else if (isObject(item)) {
          currentList.push({ formRow, ...item });
        } else if (isString(item)) {
          if (formRow === 0) {
            currentList.push({
              formRow,
              fieldCode: item,
              fieldType: "EMPTY",
              render: (value, _, field) => {
                const content = showLabelTop ?
                  `${field.fieldName}：${value}` :
                  value;
                return <SrmListHeader>{content}</SrmListHeader>;
              },
            });
          } else {
            currentList.push({ formRow, fieldCode: item });
          }
        }
        return total.concat(currentList);
      }, []);
    },
  }
};
</script>

<style>
</style>