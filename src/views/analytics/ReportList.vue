<template>
    <div class="ui container">
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>测试报告ID</th>
                    <th>测试报告名称</th>
                    <th>项目名称</th>
                    <th>来源</th>
                    <th>环境URL</th>
                    <th>执行用时</th>
                    <th>用例总数</th>
                    <th>成功总数</th>
                    <th>失败总数</th>
                    <th>跳过总数</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in reportList.data" :key="item.report_id">
                    <td>{{ item.report_id }}</td>
                    <td>{{ item.report_name }}</td>
                    <td>{{ item.project_name }}</td>
                    <td>{{ item.source }}</td>
                    <td>{{ item.env_url }}</td>
                    <td>{{ item.duration }}</td>
                    <td>{{ item.total }}</td>
                    <td>{{ item.passed_total }}</td>
                    <td>{{ item.failed_total }}</td>
                    <td>{{ item.skipped_total }}</td>
                    <td>
                        <button class="ui negative button" @click="deleteReport(item)">删除</button>
                        <a class="ui positive button" :href="`/analytics/report/${item.report_id}`" target="_blank">详情</a>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="11" v-if="reportList.pageTotal > 1">
                        <div class="ui right floated pagination menu">
                            <a class="item" :class="{ disabled: reportList.pageNo === 1 }" @click.prevent="goToPage(1)"
                                :style="{ 'pointer-events': reportList.pageNo === 1 ? 'none' : 'auto' }">First</a>
                            <a class="item" v-if="reportList.pageNo != 1" @click.prevent="goToPage(reportList.pageNo - 1)">
                                Prev
                            </a>
                            <a class="item" v-for="page in reportList.iter_pages" :key="page"
                                :class="{ 'active': page === reportList.pageNo, 'disabled': page === null }"
                                :style="{ 'pointer-events': page === null ? 'none' : 'auto' }"
                                @click.prevent="goToPage(page)">
                                {{ page ? page : '...' }}
                            </a>
                            <a class="item" v-if="reportList.pageNo != reportList.pageTotal"
                                @click.prevent="goToPage(reportList.pageNo + 1)">
                                Next
                            </a>
                            <a class="item" :class="{ disabled: reportList.pageNo === reportList.pageTotal }"
                                @click.prevent="goToPage(reportList.pageTotal)"
                                :style="{ 'pointer-events': page === reportList.pageTotal ? 'none' : 'auto' }">Last</a>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
        <div class="ui mini modal transition" id="deleteModal">
            <div class="header">
                删除测试报告
            </div>
            <div class="content">
                <div class="ui form">
                    <p>你是否确定删除测试报告？</p>
                    <div class="ui success message"></div>
                    <div class="ui error message"></div>
                </div>
            </div>
            <div class="actions">
                <div class="ui negative button">取消</div>
                <div class="ui positive right button">确定</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue';
import http from '../../axios';
const reportList = reactive({
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
    pageNo = pageNo ? pageNo : reportList.pageNo
    let res = await http.get("/reports", { params: { pageNo: pageNo } });
    if (res.data.errcode === 0) {
        reportList.data = res.data.data;
        reportList.total = res.data.total;
        reportList.pageTotal = res.data.page_total;
        reportList.iter_pages = res.data.iter_pages;
    }
    reportList.pageNo = pageNo
}
function deleteReport(item) {
    $('#deleteModal')
        .modal({
            onHide: function () {
                $('.ui.success.message').text();
                $('.ui.success.message').hide()
                $('.ui.error.message').text();
                $('.ui.error.message').hide();
            },
            onApprove: function () {
                $.api({
                    url: `${import.meta.env.VITE_API_HOST}/reports/${item.report_id}`,
                    method: 'DELETE',
                    contentType: 'application/json',
                    beforeXHR: function (xhr) {
                        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
                        return xhr;
                    },
                    on: 'now',
                    successTest: function (response) {
                        return response.errcode === 0;
                    },
                    onSuccess: function (response) {
                        $('.ui.success.message').text(response.message);
                        $('.ui.success.message').show()
                        reportList.data = reportList.data.filter((i) => i.report_id !== item.report_id);
                        if (reportList.data.length === 0 && reportList.pageNo > 1) {
                            goToPage(reportList.pageNo - 1);
                        } else {
                            getList();
                        }
                        setTimeout(function () {
                            $('#deleteModal').modal('hide');
                        }, 3000);
                    },
                    onFailure: function (response) {
                        $('.ui.error.message').text(response.message);
                        $('.ui.error.message').show()
                    }
                });
                return false;
            }
        }).modal('show');
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
  