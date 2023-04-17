<template>
    <div class="ui container">
        <button class="ui primary button" @click="createTestSuite">新增</button>
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>测试套件ID</th>
                    <th>测试套件名称</th>
                    <th>项目ID</th>
                    <th>项目名称</th>
                    <th>总用例数量</th>
                    <th>单独用例数量</th>
                    <th>最近一次执行时间</th>
                    <th>最近一次执行状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in testSuiteList.data" :key="item.testsuite_id">
                    <td>{{ item.testsuite_id }}</td>
                    <td>{{ item.testsuite_name }}</td>
                    <td>{{ item.project_id }}</td>
                    <td>{{ item.project_name }}</td>
                    <td>{{ item.total }}</td>
                    <td>{{ item.single_total }}</td>
                    <td>{{ item.execute_time }}</td>
                    <td>{{ item.execute_status }}</td>
                    <td>
                        <button class="ui primary button" @click="updateTestSuite(item)">修改</button>
                        <button class="ui negative button" @click="deleteTestSuite(item)">删除</button>
                        <button class="ui primary button" @click="executeTestSuite(item)">执行</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="11">
                        <div class="ui right floated pagination menu">
                            <a class="item" :class="{ disabled: testSuiteList.pageNo === 1 }" @click.prevent="goToPage(1)"
                                :style="{ 'pointer-events': testSuiteList.pageNo === 1 ? 'none' : 'auto' }">First</a>
                            <a class="item" v-if="testSuiteList.pageNo != 1"
                                @click.prevent="goToPage(testSuiteList.pageNo - 1)">
                                Prev
                            </a>
                            <a class="item" v-for="page in testSuiteList.iter_pages" :key="page"
                                :class="{ 'active': page === testSuiteList.pageNo, 'disabled': page === null }"
                                :style="{ 'pointer-events': page === null ? 'none' : 'auto' }"
                                @click.prevent="goToPage(page)">
                                {{ page ? page : '...' }}
                            </a>
                            <a class="item" v-if="testSuiteList.pageNo != testSuiteList.pageTotal"
                                @click.prevent="goToPage(testSuiteList.pageNo + 1)">
                                Next
                            </a>
                            <a class="item" :class="{ disabled: testSuiteList.pageNo === testSuiteList.pageTotal }"
                                @click.prevent="goToPage(testSuiteList.pageTotal)"
                                :style="{ 'pointer-events': page === testSuiteList.pageTotal ? 'none' : 'auto' }">Last</a>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
        <div class="ui mini modal transition" id="deleteModal">
            <div class="header">
                删除测试套件
            </div>
            <div class="content">
                <div class="ui form">
                    <p>你是否确定删除测试套件？</p>
                    <div class="ui success message"></div>
                    <div class="ui error message"></div>
                </div>
            </div>
            <div class="actions">
                <div class="ui negative button">取消</div>
                <div class="ui positive right button">确定</div>
            </div>
        </div>
        <div class="ui mini modal transition" id="executeModal">
            <div class="header">
                运行测试套件
            </div>
            <div class="content">
                <div class="ui form" id="executeForm">
                    <div class="field">
                        <label>执行环境名称</label>
                        <div class="ui search searchEnvironment">
                            <div class="ui input">
                                <input class="prompt" v-model="env.env_name" name="env_name" type="text"
                                    placeholder="输入环境名称">
                            </div>
                            <div class="results"></div>
                        </div>
                    </div>
                    <div class="field">
                        <label>执行环境URL</label>
                        <div>{{ env.env_url }}</div>
                    </div>
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
const testSuiteList = reactive({
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
    pageNo = pageNo ? pageNo : testSuiteList.pageNo
    let res = await http.get("/testsuites", { params: { pageNo: pageNo } });
    if (res.data.errcode === 0) {
        testSuiteList.data = res.data.data;
        testSuiteList.total = res.data.total;
        testSuiteList.pageTotal = res.data.page_total;
        testSuiteList.iter_pages = res.data.iter_pages;
    }
    testSuiteList.pageNo = pageNo
}
function createTestSuite(item) {
    router.push("/test/suite/add");
}

function updateTestSuite(item) {
    router.push(`/test/suite/edit/${item.testsuite_id}`);
}

function deleteTestSuite(item) {
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
                    url: `${import.meta.env.VITE_API_HOST}/testsuites/${item.testsuite_id}`,
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
                        testSuiteList.data = testSuiteList.data.filter((i) => i.testsuite_id !== item.testsuite_id);
                        if (testSuiteList.data.length === 0 && testSuiteList.pageNo > 1) {
                            getList(testSuiteList.pageNo - 1);
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

function executeTestSuite(item) {
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
                    url: `${import.meta.env.VITE_API_HOST}/executions/testsuite/${item.testsuite_id}?env_id=${env.env_id}`,
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
                        getList(testSuiteList.pageNo);
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
</style>
  