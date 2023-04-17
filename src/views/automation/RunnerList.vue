<template>
    <div class="ui container">
        <button class="ui primary button" @click="createRunner">新增</button>
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>运行器ID</th>
                    <th>运行器名称</th>
                    <th>项目ID</th>
                    <th>项目名称</th>
                    <th>环境名称</th>
                    <th>环境URL</th>
                    <th>最近一次执行时间</th>
                    <th>最近一次执行状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in runnerList.data" :key="item.runner_id">
                    <td>{{ item.runner_id }}</td>
                    <td>{{ item.runner_name }}</td>
                    <td>{{ item.project_id }}</td>
                    <td>{{ item.project_name }}</td>
                    <td>{{ item.env_name }}</td>
                    <td>{{ item.env_url }}</td>
                    <td>{{ item.execute_time }}</td>
                    <td>{{ item.execute_status }}</td>
                    <td>
                        <button class="ui primary button" @click="updateRunner(item)">修改</button>
                        <button class="ui negative button" @click="deleteRunner(item)">删除</button>
                        <button class="ui green button" @click="executeRunner(item)">执行</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="9" v-if="runnerList.pageTotal > 1">
                        <div class="ui right floated pagination menu">
                            <a class="item" :class="{ disabled: runnerList.pageNo === 1 }" @click.prevent="goToPage(1)"
                                :style="{ 'pointer-events': runnerList.pageNo === 1 ? 'none' : 'auto' }">First</a>
                            <a class="item" v-if="runnerList.pageNo != 1" @click.prevent="goToPage(runnerList.pageNo - 1)">
                                Prev
                            </a>
                            <a class="item" v-for="page in runnerList.iter_pages" :key="page"
                                :class="{ 'active': page === runnerList.pageNo, 'disabled': page === null }"
                                :style="{ 'pointer-events': page === null ? 'none' : 'auto' }"
                                @click.prevent="goToPage(page)">
                                {{ page ? page : '...' }}
                            </a>
                            <a class="item" v-if="runnerList.pageNo != runnerList.pageTotal"
                                @click.prevent="goToPage(runnerList.pageNo + 1)">
                                Next
                            </a>
                            <a class="item" :class="{ disabled: runnerList.pageNo === runnerList.pageTotal }"
                                @click.prevent="goToPage(runnerList.pageTotal)"
                                :style="{ 'pointer-events': page === runnerList.pageTotal ? 'none' : 'auto' }">Last</a>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
        <div class="ui mini modal transition" id="deleteModal">
            <div class="header">
                删除运行器
            </div>
            <div class="content">
                <div class="ui form">
                    <p>你是否确定删除运行器？</p>
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
import { ref, reactive, onMounted } from 'vue';
import http from '../../axios';
import { useRouter } from 'vue-router'
const router = useRouter()
const runnerList = reactive({
    data: [],
    pageNo: 1,
    pageTotal: 1,
    total: 0,
    pageSize: 10,
    iter_pages: []
})
const env = reactive({
    env_id: 0,
    env_name: '',
    env_url: ''
})
onMounted(() => {
    getList();
})
function goToPage(pageNo) {
    getList(pageNo)
}

const getList = async (pageNo) => {
    pageNo = pageNo ? pageNo : runnerList.pageNo
    let res = await http.get("/runners", { params: { pageNo: pageNo } });
    if (res.data.errcode === 0) {
        runnerList.data = res.data.data;
        runnerList.total = res.data.total;
        runnerList.pageTotal = res.data.page_total;
        runnerList.iter_pages = res.data.iter_pages;
    }
    state.pageNo = pageNo
}
function createRunner(item) {
    router.push("/automation/runner/add");
}

function updateRunner(item) {
    router.push(`/automation/runner/edit/${item.runner_id}`);
}

function deleteRunner(item) {
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
                    url: `${import.meta.env.VITE_API_HOST}/runners/${item.runner_id}`,
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
                        runnerList.data = runnerList.data.filter((i) => i.runner_id !== item.runner_id);
                        if (runnerList.data.length === 0 && runnerList.pageNo > 1) {
                            getList(runnerList.pageNo - 1);
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

function executeRunner(item) {
    $('.searchEnvironment')
        .search({
            apiSettings: {
                url: import.meta.env.VITE_API_HOST + '/environments/search?project_id={project_id}&query={query}',
                urlData: {
                    project_id: item.project_id
                },
                beforeXHR: function (xhr) {
                    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
                    return xhr;
                }
            },
            fields: {
                results: 'data',
                title: 'env_name'
            },
            searchFields: [
                'title'
            ],
            onSelect: function (result) {
                env.env_id = result.env_id
                env.env_name = result.env_name
                env.env_url = result.env_url
                $('.ui.form').form('remove prompt', 'env_name');
            }
        });
    $('#executeModal')
        .modal({
            onHide: function () {
                $('.ui.form').form('clear');
                $('.ui.success.message').text();
                $('.ui.success.message').hide()
                $('.ui.error.message').text();
                $('.ui.error.message').hide()
                env.env_id = ""
                env.env_name = ""
                env.env_url = ""
            },
            onApprove: function () {
                $.api({
                    url: `${import.meta.env.VITE_API_HOST}/executions/runner/${item.runner_id}?env_id=${env.env_id}`,
                    method: 'POST',
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
                        getList(runnerList.pageNo);
                        setTimeout(function () {
                            $('#executeModal').modal('hide');
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

.ui.form {
    margin-top: 1rem;
}
</style>