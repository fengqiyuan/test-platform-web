<template>
  <div class="ui container">
    <h1 class="ui header">{{ report.report_name }}</h1>
    <div class="ui form">
      <div class="three fields">
        <div class="field">
          <label>项目名称</label>
          <div>{{ report.project_name }}</div>
        </div>
        <div class="field">
          <label>模块名称</label>
          <div>{{ report.env_name }}</div>
        </div>
        <div class="field">
          <label>来源</label>
          <div>{{ report.source }}</div>
        </div>
      </div>
      <div class="ui statistics">
        <div class="blue statistic">
          <div class="label">用例总数</div>
          <div class="value">{{ report.total }}</div>
        </div>
        <div class="blue statistic">
          <div class="label">通过总数</div>
          <div class="value">{{ report.passed_total }}</div>
        </div>
        <div class="red statistic">
          <div class="label">失败总数</div>
          <div class="value">{{ report.failed_total }}</div>
        </div>
        <div class="yellow statistic">
          <div class="label">忽略总数</div>
          <div class="value">{{ report.skipped_total }}</div>
        </div>
        <div class="green statistic">
          <div class="label">执行通过率</div>
          <div class="value">{{ Number((report.passed_total / report.total * 100).toFixed(0)) }}%</div>
        </div>
        <div class="olive statistic">
          <div class="label">执行时间</div>
          <div class="value">{{ report.duration }}</div>
        </div>
      </div>
    </div>
    <div class="ui divider"></div>
    <h2 class="ui header">测试结果</h2>
    <table class="ui table">
      <thead>
        <tr>
          <th>测试结果ID</th>
          <th>项目名称</th>
          <th>测试报告名称</th>
          <th>运行器名称</th>
          <th>测试套件名称</th>
          <th>测试用例名称</th>
          <th>执行状态</th>
          <th style="width: 40em;">实际结果</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in report.results" :key="item.result_id">
          <td>{{ item.result_id }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.report_name }}</td>
          <td>{{ item.runner_name }}</td>
          <td>{{ item.testsuite_name }}</td>
          <td>{{ item.testcase_name }}</td>
          <td>{{ item.execute_status }}</td>
          <td>{{ item.actual_result }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue';
import http from '../../axios';
import { useRoute } from 'vue-router'
const route = useRoute()
const { params } = route
const report = reactive({
  'report_id': '',
  'report_name': '',
  'project_id': '',
  'project_name': '',
  'source': '',
  'env_id': '',
  'env_name': '',
  'env_url': '',
  'duration': '',
  'total': '',
  'passed_total': '',
  'failed_total': '',
  'skipped_total': '',
  'results': []
})

onMounted(() => {
  if (params.report_id) {
    getReport(params.report_id)
  }
});
const getReport = async (report_id) => {
  try {
    const res = await http.get(`/reports/${report_id}`)
    Object.assign(report, res.data.data)
  } catch (error) {
    console.error(error);
  }
};
</script>
<style scoped>
.ui.container {
  max-width: 85rem;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: fit-content;
}

.ui.table {
  word-break: break-all;
}
</style>