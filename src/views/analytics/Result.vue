<template>
    <div class="ui container">
        <table class="ui celled table">
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
                <tr v-for="item in resultList.data" :key="item.result_id">
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
            <tfoot>
                <tr>
                    <th colspan="8" v-if="resultList.pageTotal > 1">
                        <div class="ui right floated pagination menu">
                            <a class="item" :class="{ disabled: resultList.pageNo === 1 }" @click.prevent="goToPage(1)"
                                :style="{ 'pointer-events': resultList.pageNo === 1 ? 'none' : 'auto' }">First</a>
                            <a class="item" v-if="resultList.pageNo != 1" @click.prevent="goToPage(resultList.pageNo - 1)">
                                Prev
                            </a>
                            <a class="item" v-for="page in resultList.iter_pages" :key="page"
                                :class="{ 'active': page === resultList.pageNo, 'disabled': page === null }"
                                :style="{ 'pointer-events': page === null ? 'none' : 'auto' }"
                                @click.prevent="goToPage(page)">
                                {{ page ? page : '...' }}
                            </a>
                            <a class="item" v-if="resultList.pageNo != resultList.pageTotal"
                                @click.prevent="goToPage(resultList.pageNo + 1)">
                                Next
                            </a>
                            <a class="item" :class="{ disabled: resultList.pageNo === resultList.pageTotal }"
                                @click.prevent="goToPage(resultList.pageTotal)"
                                :style="{ 'pointer-events': page === resultList.pageTotal ? 'none' : 'auto' }">Last</a>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue';
import http from '../../axios';
const resultList = reactive({
    data: [],
    pageNo: 1,
    pageTotal: 1,
    total: 0,
    pageSize: 10,
    iter_pages: []
})

onMounted(() => {
    getList();
})
function goToPage(pageNo) {
    getList(pageNo)
}

const getList = async (pageNo) => {
    pageNo = pageNo ? pageNo : resultList.pageNo
    let res = await http.get("/results", { params: { pageNo: pageNo } });
    if (res.data.errcode === 0) {
        resultList.data = res.data.data;
        resultList.total = res.data.total;
        resultList.pageTotal = res.data.page_total;
        resultList.iter_pages = res.data.iter_pages;
    }
    resultList.pageNo = pageNo
}
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
  