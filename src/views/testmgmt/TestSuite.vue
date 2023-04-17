<template>
    <div class="container">
        <h1>测试套件配置</h1>
        <div class="ui form">
            <div class="two fields">
                <div class="field required">
                    <label>测试套件名称</label>
                    <input type="text" v-model="testSuite.testsuite_name" name="testsuite_name" />
                </div>
                <div class="field required">
                    <label>项目名称</label>
                    <div class="ui search searchProject">
                        <div class="ui input">
                            <input class="prompt" v-model="testSuite.project_name" name="project_name" type="text"
                                placeholder="输入项目名称">
                        </div>
                        <div class="results"></div>
                    </div>
                </div>
            </div>
            <table class="ui celled table">
                <thead>
                    <tr>
                        <th colspan="6">
                            场景用例
                        </th>
                        <th colspan="2">
                            <div class="field">
                                <label>用例类型</label>
                                <div class="ui selection dropdown" id="executeType">
                                    <input type="hidden" name="executeType" v-model="executeType">
                                    <i class="dropdown icon"></i>
                                    <div class="default text">选择类型</div>
                                    <div class="menu">
                                        <div class="item" data-value="1">场景用例</div>
                                        <div class="item" data-value="0">单独用例</div>
                                    </div>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div class="field">
                                <label>测试用例名称</label>
                                <div class="ui search searchTestcase">
                                    <div class="ui input">
                                        <input class="prompt" name="testcase_name" type="text" placeholder="输入测试用例名称">
                                    </div>
                                    <div class="results"></div>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div class="ui">
                                <div class="ui">&emsp;&emsp;&emsp;</div>
                                <button class="ui button" @click="addTestcase">新增</button>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th>排序</th>
                        <th>项目ID</th>
                        <th>项目名称</th>
                        <th>模块ID</th>
                        <th>模块名称</th>
                        <th>测试用例ID</th>
                        <th>测试用例名称</th>
                        <th>方法</th>
                        <th>路径</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <TransitionGroup>
                        <tr v-for="(testcase, index) in sortedTestcases" :key="index"
                            :class="{ 'dragging': state.draggingIndex === index && state.draggingType }"
                            @dragstart="dragStart(1, index)" @dragend="dragEnd" @dragover.prevent
                            @drop.prevent="drop(1, index)" draggable="true">
                            <td>{{ testcase.order }}</td>
                            <td>{{ testcase.project_id }}</td>
                            <td>{{ testcase.project_name }}</td>
                            <td>{{ testcase.module_id }}</td>
                            <td>{{ testcase.module_name }}</td>
                            <td>{{ testcase.testcase_id }}</td>
                            <td>{{ testcase.testcase_name }}</td>
                            <td>{{ testcase.test_content.method }}</td>
                            <td>{{ testcase.test_content.path }}</td>
                            <td>
                                <div class="ui">
                                    <button class="ui button" @click="editTestcase(1, index, testcase)">转单独</button>
                                    <button class="ui button" @click="deleteTestcase(1, testcase)">删除</button>
                                </div>
                            </td>
                        </tr>
                    </TransitionGroup>
                </tbody>
                <thead>
                    <tr>
                        <th colspan="10">
                            单独用例
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <TransitionGroup>
                        <tr v-for="(testcase, index) in unSortedTestcases" :key="index"
                            :class="{ 'dragging': state.draggingIndex === index && state.draggingType }"
                            @dragstart="dragStart(0, index)" @dragend="dragEnd" @dragover.prevent
                            @drop.prevent="drop(1, index)" draggable="true">
                            <td></td>
                            <td>{{ testcase.project_id }}</td>
                            <td>{{ testcase.project_name }}</td>
                            <td>{{ testcase.module_id }}</td>
                            <td>{{ testcase.module_name }}</td>
                            <td>{{ testcase.testcase_id }}</td>
                            <td>{{ testcase.testcase_name }}</td>
                            <td>{{ testcase.test_content.method }}</td>
                            <td>{{ testcase.test_content.path }}</td>
                            <td>
                                <div class="ui">
                                    <button class="ui button" @click="editTestcase(0, index, testcase)">转场景</button>
                                    <button class="ui button" @click="deleteTestcase(0, testcase)">删除</button>
                                </div>
                            </td>
                        </tr>
                    </TransitionGroup>
                </tbody>
            </table>
            <div class="field">
                <label>备注</label>
                <textarea v-model="testSuite.description" name="description"></textarea>
            </div>
            <div class="ui">
                <button class="ui submit right floated button"
                    :class="{ loading: submitButton == '保存中', red: submitButton == '保存失败', positive: submitButton != '保存失败' }"
                    @click.prevent="saveTestSuite">{{ submitButton }}</button>
            </div>
            <div class="ui error message"></div>
            <div v-if="message.isShow" :class="message.type == 'success' ? 'green' : 'red'" class="ui message">
                <div class="header">{{ message.type }}!</div>
                <pre>{{ message.text }}</pre>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import http from '../../axios';
import { useRoute } from 'vue-router'
import { showMessage } from '../../utils/common.js'
const route = useRoute()
const { params } = route
const submitButton = ref('保存')
const executeType = ref(1)

const initTestcase = [{
    testsuite_id: '',
    testcase_id: '',
    testcase_name: '',
    order: 0,
    test_type: '',
    test_priority: 0,
    test_content: {},
    project_id: '',
    project_name: '',
    module_id: '',
    module_name: ''
}]
const testcase = reactive({ ...initTestcase })
const initTestSuite = {
    testsuite_id: '',
    testsuite_name: '',
    project_id: '',
    project_name: '',
    description: ''
}
const testSuite = reactive({ ...initTestSuite })
const sortedTestcases = reactive([]);
const unSortedTestcases = reactive([]);
const state = reactive({
    draggingIndex: -1,
    dragOverIndex: -1,
    draggingType: 1,
    dragOverType: 1
});
const initMessage = {
    type: '',
    text: '',
    isShow: false
}
const message = reactive({ ...initMessage });
onMounted(() => {
    if (params.testsuite_id) {
        getTestSuite(params.testsuite_id)
        updateTestcaseIds();
    }
});

const addTestcase = () => {
    let type = $('#executeType').dropdown('get value');
    console.log(type);
    if (type == '1') {
        sortedTestcases.push({ ...testcase });
    } else {
        unSortedTestcases.push({ ...testcase });
    }
    console.log(sortedTestcases)
    console.log(unSortedTestcases)
    updateTestcaseIds()
    Object.assign(testcase, initTestcase)
    $('#executeType').dropdown('clear');
    $('.ui.search.searchTestcase input.prompt').val('');
    $('.ui.search.searchTestcase').search('clear');
};


const editTestcase = (type, index, testcase) => {
    if (type) {
        sortedTestcases.splice(index, 1);
        unSortedTestcases.push(testcase);
    } else {
        unSortedTestcases.splice(index, 1);
        sortedTestcases.push(testcase);
    }
    updateTestcaseIds()
};

const deleteTestcase = (type, index) => {
    if (type) {
        sortedTestcases.splice(index, 1);
    } else {
        unSortedTestcases.splice(index, 1);
    }
    updateTestcaseIds()
};

const dragStart = (type, index) => {
    state.draggingIndex = index;
    state.draggingType = type
};

const dragEnd = () => {
    state.draggingIndex = -1;
    state.dragOverIndex = -1;
    state.draggingType = 1,
        state.dragOverType = 1
};

const drop = (type, index) => {
    if (type !== state.draggingType || index !== state.draggingIndex) {
        state.dragOverIndex = index
        state.dragOverType = type
    }
    if (state.draggingType !== state.dragOverType || state.draggingIndex !== state.dragOverIndex) {
        const draggingTestcase = state.draggingType ? sortedTestcases[state.draggingIndex] : unSortedTestcases[state.draggingIndex]
        if (state.draggingType) {
            sortedTestcases.splice(state.draggingIndex, 1);
        } else {
            unSortedTestcases.splice(state.draggingIndex, 1);
        }
        if (state.dragOverType) {
            sortedTestcases.splice(state.dragOverIndex, 0, draggingTestcase);
        } else {
            unSortedTestcases.splice(state.dragOverIndex, 0, draggingTestcase);
        }
        console.log(draggingTestcase)
        if (state.draggingType || state.dragOverType) {
            updateTestcaseIds();
        }
    }
};

const updateTestcaseIds = () => {
    sortedTestcases.forEach((testcase, index) => {
        testcase.order = index + 1;
    });
    unSortedTestcases.forEach((testcase) => {
        testcase.order = 0;
    });
};
const getTestSuite = async (testsuite_id) => {
    try {
        const res = await http.get(`/testsuites/${testsuite_id}/testcases`)
        Object.assign(testSuite, res.data.testsuite)
        const testSuiteDetail = res.data.testsuite_detail
        Object.assign(sortedTestcases, testSuiteDetail.filter(t => t.execute_type == true))
        Object.assign(unSortedTestcases, testSuiteDetail.filter(t => t.execute_type === false))
    } catch (error) {
        console.error(error);
    }
};
const saveTestSuite = async () => {
    try {
        submitButton.value = '保存中'
        Object.assign(message, initMessage);
        if ($('.ui.form').form('is valid')) {
            let data = {
                'testsuite_name': testSuite.testsuite_name,
                'description': testSuite.description,
                'project_id': testSuite.project_id,
                'sorted_testcases': sortedTestcases,
                'unsorted_testcases': unSortedTestcases
            }
            let res = null
            if (testSuite.testsuite_id) {
                res = await http.put(`/testsuites/${testSuite.testsuite_id}`, data)
            } else {
                res = await http.post("/testsuites", data)
            }
            if (res.status == 200 && res.data && res.data.errcode == 0) {
                showMessage(message, 'success', res.data.message)
                submitButton.value = '保存成功';
            }
            else {
                showMessage(message, 'error', res.data.message)
                submitButton.value = '保存失败';
            }
        } else {
            showMessage(message, 'error', '有必填项未填写或选择')
            submitButton.value = '保存失败';
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            showMessage(message, 'error', error.response.data && error.response.data.message ? error.response.data.message : '')
        }
        submitButton.value = '保存失败';
    }
};
watchEffect(() => {
    $('.searchTestcase')
        .search({
            apiSettings: {
                url: import.meta.env.VITE_API_HOST + '/testcases/search?project_id={project_id}&query={query}',
                urlData: {
                    project_id: testSuite.project_id
                },
                beforeXHR: function (xhr) {
                    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
                    return xhr;
                }
            },
            fields: {
                results: 'data',
                title: 'testcase_name'
            },
            searchFields: [
                'title'
            ],
            onSelect: function (result) {
                Object.assign(testcase, result)
            }
        });
});

$(function () {
    $('#executeType').dropdown({});
    $('.ui.form').form({});
    $('.searchProject')
        .search({
            apiSettings: {
                url: import.meta.env.VITE_API_HOST + '/projects/search?query={query}',
                beforeXHR: function (xhr) {
                    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
                    return xhr;
                }
            },
            fields: {
                results: 'data',
                title: 'project_name'
            },
            searchFields: [
                'title'
            ],
            onSelect: function (result) {
                testSuite.project_id = result.project_id
                testSuite.project_name = result.project_name
            }
        });
});
</script>

<style scoped>
.container {
    max-width: 85rem;
    margin: 0 auto;
    margin-top: 1rem;
    margin-bottom: 10rem;
}

.ui.form {
    margin-top: 1rem;
}

.ui.table {
    word-break: break-all;
}

.ui.segment pre {
    white-space: pre-wrap;
    word-break: break-all;
}

.ui.selection.dropdown {
    min-width: 100%;
}

/* 
.dragging {
    opacity: 0.5;
} */
.searchTestcase input {
    min-width: 100%;
}
</style>
