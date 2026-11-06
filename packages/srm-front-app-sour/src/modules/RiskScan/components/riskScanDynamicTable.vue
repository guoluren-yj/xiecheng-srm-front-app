<template>
  <div>
    <div v-if="dynamicResults && dynamicResults.length">
      <div class="risk-scan-basic-report-list">
        <div
          v-for="(item, index) in dynamicResults"
          :key="index">
          <div class="risk-scan-result-sec-title">
            <div class="result-sec-title">
              {{ `2.${index + 1} ${item.title}` }}
            </div>
            <div class="result-level-title">
              <div v-if="item.levelList && item.levelList.length" style="display: flex;">
                <div
                  v-for="(record, index2) in item.levelList"
                  :key="index2"
                  style="display: flex; align-items: center;">
                  <div v-if="index2 !== 0" style="background: #E5E7EC; width: 1px; height: 12px; margin: 0 5px;" />
                  {{ record.riskLevel || '' }}:
                  <span style="color: red; margin-left: 4px;">{{ record.levelCount || record.count || 0 }}</span>
                </div>
              </div>
              <div v-else>
                {{ item.riskLevel || '' }}:
                <span style="color: red; margin-left: 4px;">{{ item.levelCount || item.count || 0 }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="dataSource && dataSource[item.id] && dataSource[item.id].length && item.fields && item.fields">
            <div
              v-for="(item2, index2) in dataSource[item.id]"
              :key="index2"
              class="risk-scan-result-content"
              :style="{
                borderTop: index2 === 0 ? '1px solid #E5E7EC' : ''
              }">
              <div class="risk-scan-result-content-item" style="display: flex; justify-content: space-between;">
                <div>
                  <span class="result-content-item-label">
                    {{ getFieldLabel(item.fields, 'serialNo') }}:
                  </span>
                  <span class="result-content-item-value">{{ index2 + 1 }}</span>
                </div>
                <div>
                  <span
                    v-if="fetFieldValue(item2, 'stdExpireStatus')"
                    :class="statusClassMap[String(fetFieldValue(item2, 'stdExpireStatus'))]"
                    style="margin-right: 8px;">
                    {{ fetFieldValue(item2, 'stdExpireStatus') }}
                  </span>
                  <span
                    v-if="fetFieldValue(item2, 'riskLevel')"
                    :class="classMap[String(fetFieldValue(item2, 'riskLevel'))]">
                    {{ levelMap[fetFieldValue(item2, 'riskLevel')] || '' }}
                  </span>
                </div>
              </div>
              <div
                v-for="(field, index3) in item.fields"
                :key="`item_${index3}`">
                <div
                  v-if="
                    field.fieldName !== 'serialNo' && field.fieldName !== 'riskLevel'&&
                      field.fieldName !== 'stdExpireStatus'
                  "
                  class="risk-scan-result-content-item">
                  <span class="result-content-item-label">
                    {{ getFieldLabel(item.fields, field.fieldName) }}:
                  </span>
                  <span class="result-content-item-value">
                    {{ fetFieldValue(item2, field.fieldName) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else style="color: #1d2129; text-align: center; line-height: 48px;">
      {{ $T('hzero.common.message.data.none').$D("暂无数据") }}
    </div>
  </div>
</template>

<script>

export default {
  modules: [ "hzero.common" ],
  name: "RiskScanDynamicTable",
  props: {
    results: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Object,
      default: () => {},
    },
    levelMap: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dynamicResults: [],
      classMap: {
        3: "incident-item-tag-high",
        2: "incident-item-tag-middle",
        1: "incident-item-tag-low",
      },
      statusClassMap: {
        正常: "status-tag-normal",
        已过期: "status-tag-outer",
      },
    };
  },
  watch: {
    results: {
      handler(newArr) {
        // 处理 items 变化
        this.dynamicResults = newArr.filter(
          (rcd) => rcd.count > 0 || rcd.levelList && rcd.levelList.length || rcd.fetchFailed
        );
      },
      deep: true // 深度监听数组变化
    }
  },
  methods: {
    getFieldLabel(fields, fieldName) {
      return fields.filter((item) => item.fieldName === fieldName)[0].label;
    },
    fetFieldValue(data = {}, fieldName = "") {
      return data[fieldName] || "";
    },
  }
};
</script>

<style lang="stylus" scoped>
.risk-scan-result-panel {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}

.risk-scan-basic-report-list {
  .risk-scan-result-sec-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;

    .result-sec-title {
      font-size: 12px;
      color: #333333;
      line-height: 16px;
      font-weight: 600;
    }

    .result-level-title {
      font-size: 12px;
      color: #868D9C;
      line-height: 16px;
      font-weight: 400;
    }
  }
}

.risk-scan-result-content {
  background: #fff;
  border-bottom: 1px solid #E5E7EC;
  padding: 5px 0;
}

.risk-scan-result-content-item {
  margin: 8px 0;
  width 100%
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .result-content-item-label {
    font-size: 12px;
    color: #868D9C;
    line-height: 16px;
    font-weight: 400;
  }

  .result-content-item-value {
    font-size: 12px;
    color: #333333;
    line-height: 16px;
    font-weight: 400;
  }
}

.incident-item-tag-high {
  border-radius: 2px;
  font-size: 12px;
  padding: 0 4px;
  color: #E64322;
  height: 18px;
  line-height: 18px;
  background: rgba(242,85,53,0.15);
  font-weight: 600;
}

.incident-item-tag-middle {
  font-size: 12px;
  border-radius: 2px;
  padding: 0 4px;
  color: #F06200;
  height: 18px;
  line-height: 18px;
  background: rgba(242,128,26,0.15);
  font-weight: 600;
}

.incident-item-tag-low {
  font-size: 12px;
  border-radius: 2px;
  padding: 0 4px;
  color: #179454;
  height: 18px;
  line-height: 18px;
  background: rgba(71,184,131,0.15);
  font-weight: 600;
}

.status-tag-normal {
  font-size: 12px;
  border-radius: 2px;
  padding: 0 4px;
  color: #179454;
  height: 18px;
  line-height: 18px;
  background: rgba(71,184,131,0.15);
  font-weight: 600;
}
.status-tag-outer {
  font-size: 12px;
  border-radius: 2px;
  padding: 0 4px;
  color: #4E5769;
  height: 18px;
  line-height: 18px;
  background: #E5E7EC;
  font-weight: 600;
}
</style>
