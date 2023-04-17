<template>
  <div class="chart-container">
    <div class="ui statistics">
      <div class="blue statistic">
        <div class="label">场景总数</div>
        <div class="value">{{ testscenario_total }}</div>
      </div>
      <div class="red statistic">
        <div class="label">测试用例总数</div>
        <div class="value">{{ testcase_total }}</div>
      </div>
      <div class="yellow statistic">
        <div class="label">流程数量</div>
        <div class="value">{{ testsuite.flow_total }}</div>
      </div>
      <div class="green statistic">
        <div class="label">执行通过率</div>
        <div class="value">{{ Number((result.passed_total/result.total * 100).toFixed(0)) }}%</div>
      </div>
      <div class="olive statistic">
        <div class="label">平均用例执行时间</div>
        <div class="value">{{ result.average }}</div>
      </div>
    </div>
    <div class="ui placeholder segment">
      <div class="ui two column very relaxed stackable grid">
        <div class="column">
          <div ref="resultChart" class="chart"></div>
        </div>
        <div class="middle aligned column">
          <div ref="testSuiteChart" class="chart"></div>
        </div>
      </div>
      <div class="ui vertical divider"></div>
      <div class="ui section divider"></div>
      <div class="ui two column very relaxed stackable grid">
        <div class="column">
          <div ref="testScenarioChart" class="chart"></div>
        </div>
        <div class="middle aligned column">
          <div ref="testCaseChart" class="chart"></div>
        </div>
      </div>
      <div class="ui vertical divider"></div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import http from '../axios'
const testCaseChart = ref(null)
const testSuiteChart = ref(null)
const testScenarioChart = ref(null)
const resultChart = ref(null)
const result = reactive({
  duration: 10000,
  total: 1000,
  passed_total: 800,
  failed_total: 150,
  skipped_total: 50,
  average: 10,
})
const testsuite = reactive({
  testcase_total: 1000,
  testcase_single_total: 700,
  testcase_flow_total: 300,
  flow_total: 50
})
const testscenario = reactive({
  // "API": { "1": 100, "3": 300, "4": 400, "5": 500 },
  // "WEB": { "2": 300, "3": 400, "4": 500, "5": 600 },
  // "APP": { "1": 300, "2": 400, "4": 600, "5": 700 }
});
const testcase = reactive({
  // "API": { "1": 100, "3": 300, "4": 400, "5": 500 },
  // "WEB": { "2": 300, "3": 400, "4": 500, "5": 600 },
  // "APP": { "1": 300, "2": 400, "4": 600, "5": 700 }
});
onMounted(async () => {
  let res = await http.get("/statistics");
  if (res.data.errcode === 0) {
    Object.assign(result, res.data.result)
    Object.assign(testsuite, res.data.testsuite)
    for (let key in res.data.testscenario) {
      testscenario[key] = res.data.testscenario[key]
    }
    for (let key in res.data.testcase) {
      testcase[key] = res.data.testcase[key]
    }
    console.log(testscenario)
    getResultChart()
    getTestSuiteChart()
    getTestScenarioChart()
    getTestCaseChart()
  }
})
const testscenario_total = computed(() =>{
  let sum = 0;
      for (let key in testscenario) {
        for (let subKey in testscenario[key]) {
          sum += testscenario[key][subKey];
        }
      }
  return sum;
})
const testcase_total = computed(() =>{
  let sum = 0;
      for (let key in testcase) {
        for (let subKey in testcase[key]) {
          sum += testcase[key][subKey];
        }
      }
      return sum;
})

function getResultChart() {
  let myChart = echarts.init(resultChart.value)

  let option = {
    title: {
      text: '测试用例执行结果'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      // orient: 'vertical',
      // left: 10,
      data: ['通过', '失败', '跳过'],
    },
    series: [
      {
        name: '测试用例执行结果',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: result.passed_total, name: '通过' },
          { value: result.failed_total, name: '失败' },
          { value: result.skipped_total, name: '跳过' },
        ],
      },
    ],
  }
  myChart.setOption(option)
}
function getTestSuiteChart() {
  let myChart = echarts.init(testSuiteChart.value)

  let option = {
    title: {
      text: 'Testsuite数据'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      // orient: 'vertical',
      // left: 10,
      data: ['流程用例总数', '单独用例总数'],
    },
    series: [
      {
        name: '测试用例执行结果',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: testsuite.testcase_flow_total, name: '流程用例总数' },
          { value: testsuite.testcase_single_total, name: '单独用例总数' }
        ],
      },
    ],
  }
  myChart.setOption(option)
}
function getTestScenarioChart() {
  let myChart = echarts.init(testScenarioChart.value)
  let allKeys = [...new Set(Object.values(testscenario).flatMap(obj => Object.keys(obj)))].sort();
  let series = []
  allKeys.forEach(k => {
    let seriesData = []
    for (let key in testscenario) {
      seriesData.push(testscenario[key][k] || 0);
    }
    series.push({
      name: k,
      type: 'bar',
      data: seriesData,
    })
  })
  let option = {
    title: {
      text: '测试场景分类数据'
    },
    tooltip: {
      trigger: 'item',
      formatter: '优先级: {a} <br/>&emsp;数量: {c}',
    },
    legend: {
      data: allKeys
    },
    xAxis: { type: 'category', data: Object.keys(testscenario) },
    yAxis: { type: 'value' },
    series: series
  }
  myChart.setOption(option)
}
function getTestCaseChart() {
  let myChart = echarts.init(testCaseChart.value)
  let allKeys = [...new Set(Object.values(testcase).flatMap(obj => Object.keys(obj)))].sort();
  let series = []
  allKeys.forEach(k => {
    let seriesData = []
    for (let key in testcase) {
      seriesData.push(testcase[key][k] || 0);
    }
    series.push({
      name: k,
      type: 'bar',
      data: seriesData,
    })
  })
  let option = {
    title: {
      text: '测试用例分类数据'
    },
    tooltip: {
      trigger: 'item',
      formatter: '优先级: {a} <br/>&emsp;数量: {c}',
    },
    legend: {
      title: '优先级',
      data: allKeys
    },
    xAxis: { type: 'category', data: Object.keys(testcase) },
    yAxis: { type: 'value' },
    series: series
  }
  myChart.setOption(option)
}

</script>
  
<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ui.segment {
  width: 100%;
  margin-bottom: 1em;
}

.ui.header {
  margin-bottom: 0.5em;
}

.chart {
  height: 20em;
}

.ui.statistics {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.statistic:not(:last-child) {
  border-right: 1px solid rgba(38, 34, 38, 0.15);
  padding-right: 1em;
  margin-right: 1em;
}
</style>
  