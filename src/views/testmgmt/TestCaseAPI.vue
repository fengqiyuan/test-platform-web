<template>
  <div class="container">
    <div class="ui form">
      <h2>TestCase API</h2>
      <div class="three fields">
        <div class="field">
          <label>场景名称</label>
          <div>{{ testScenario.scenario_name }}</div>
        </div>
        <div class="field">
          <label>项目名称</label>
          <div>{{ testScenario.project_name }}</div>
        </div>
        <div class="field">
          <label>模块名称</label>
          <div>{{ testScenario.module_name }}</div>
        </div>
      </div>
    </div>
    <div class="ui top attached tabular menu" v-if="testCases.length != 0">
      <a class="item" v-for="(tab, index) in testCases" :key="index" @click="changeTab(index)"
        :class="{ active: activeTab === index }">{{ tab.testcase_name }}</a>
      <a class="item" v-if="activeTab == -1" :class="{ active: activeTab == -1 }">新增</a>
      <div class="right menu">
        <div class="item">
          <div class="ui icon button" @click="addTab">
            <i class="plus icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="ui bottom attached segment">
      <div class="ui form">
        <!-- <div class="three fields">
          <div class="field">
            <label>场景名称</label>
            <div>{{ testScenario.scenario_name }}</div>
          </div>
          <div class="field">
            <label>项目名称</label>
            <div>{{ testScenario.project_name }}</div>
          </div>
          <div class="field">
            <label>模块名称</label>
            <div>{{ testScenario.module_name }}</div>
          </div>
        </div> -->
        <div class="three fields">
          <div class="five wide field required">
            <label>测试用例名称</label>
            <input type="text" v-model="testCase.testcase_name" name="testcase_name" />
          </div>
          <div class="four wide field required">
            <label>请求方法</label>
            <div class="ui selection dropdown" id="method">
              <input type="hidden" name="method" v-model="testCase.test_content.method">
              <i class="dropdown icon"></i>
              <div class="default text">选择方法</div>
              <div class="menu">
                <div class="item" v-for="(method, index) in methods" :key="index" :data-value="method" :value="method">
                  {{ method }}
                </div>
              </div>
            </div>
          </div>
          <div class="seven wide field required">
            <label>请求路径</label>
            <input type="text" v-model="testCase.test_content.path" name="path" placeholder="请输入请求PATH" />
          </div>
        </div>
        <div class="ui top attached tabular menu">
          <div class="item" :class="{ active: requestTab === 'params' }" @click="requestTab = 'params'">Params</div>
          <div class="item" :class="{ active: requestTab === 'headers' }" @click="requestTab = 'headers'">Headers</div>
          <div class="item" :class="{ active: requestTab === 'body' }" @click="requestTab = 'body'">Body</div>
        </div>
        <div class="ui bottom attached tab segment" :class="{ active: requestTab === 'params' }" data-tab="first">
          <div class="field">
            <table class="ui celled table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key) in testCase.test_content.params" :key="key">
                  <td><span>{{ key }}</span></td>
                  <td><span>{{ value }}</span></td>
                  <td><button class="ui icon button" @click.prevent="deleteKeyValue(testCase.test_content.params, key)">
                      <i class="minus icon"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><input type="text" v-model="newParams.key" placeholder="Key" /></td>
                  <td><input type="text" v-model="newParams.value" placeholder="Value" /></td>
                  <td><button class="ui icon button"
                      @click.prevent="addKeyValue(testCase.test_content.params, newParams)">
                      <i class="plus icon"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="ui bottom attached tab segment" :class="{ active: requestTab === 'headers' }" data-tab="second">
          <div class="field">
            <table class="ui celled table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key) in testCase.test_content.headers" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                  <td><button class="ui icon button" @click.prevent="deleteKeyValue(testCase.test_content.headers, key)">
                      <i class="minus icon"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><input v-model="newHeaders.key" placeholder="Key" /></td>
                  <td><input v-model="newHeaders.value" placeholder="Value" /></td>
                  <td><button class="ui icon button"
                      @click.prevent="addKeyValue(testCase.test_content.headers, newHeaders)">
                      <i class="plus icon"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="ui bottom attached tab segment" :class="{ active: requestTab === 'body' }" data-tab="third">
          <div class="field">
            <div class="inline fields">
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="body-type" value="form-data" v-model="bodyType" @change="changeRawData">
                  <label>form-data</label>
                </div>
              </div>
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="body-type" value="raw" v-model="bodyType" @change="changeRawData">
                  <label>raw</label>
                </div>
              </div>
            </div>
            <table class="ui celled table" v-if="bodyType === 'form-data'">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key) in testCase.test_content.data" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                  <td><button class="ui icon button" @click.prevent="deleteKeyValue(testCase.test_content.data, key)">
                      <i class="minus icon"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><input type="text" v-model="newData.key" placeholder="Key" /></td>
                  <td><input type="text" v-model="newData.value" placeholder="Value" /></td>
                  <td><button class="ui icon button" @click.prevent="addKeyValue(testCase.test_content.data, newData)">
                      <i class="plus icon"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="field" v-else="bodyType === 'raw'">
              <textarea v-model="requestDataRaw"></textarea>
            </div>
          </div>
        </div>
        <div class="three fields">
          <div class="field required">
            <label>期望状态码</label>
            <div class="ui selection dropdown" id="expected_status">
              <input type="hidden" name="expected_status" v-model="testCase.expected_result.expected_status">
              <i class="dropdown icon"></i>
              <div class="default text">选择状态码</div>
              <div class="menu">
                <div class="item" v-for="(statusCode, index) in statusCodes" :key="index" :data-value="statusCode" :value="statusCode">
                  {{ statusCode }}
                </div>
              </div>
            </div>
          </div>
          <div class="field required">
            <label>验证类型</label>
            <div class="ui selection dropdown" id="validate_type">
              <input type="hidden" name="validate_type" :value="testCase.expected_result.validate_type">
              <i class="dropdown icon"></i>
              <div class="default text">选择类型</div>
              <div class="menu">
                <div class="item" v-for="(value, key) in validateTypes" :key="key" :data-value="key" :value="key">
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
          <div class="field required">
            <label>优先级</label>
            <div class="ui selection dropdown" id="test_priority">
              <input type="hidden" name="test_priority" v-model="testCase.test_priority">
              <i class="dropdown icon"></i>
              <div class="default text">选择优先级</div>
              <div class="menu">
                <div class="item" data-value=1 :class="{ 'active selected': testCase.test_priority === 1 }">1
                </div>
                <div class="item" data-value=2 :class="{ 'active selected': testCase.test_priority === 2 }">2
                </div>
                <div class="item" data-value=3 :class="{ 'active selected': testCase.test_priority === 3 }">3
                </div>
                <div class="item" data-value=4 :class="{ 'active selected': testCase.test_priority === 4 }">4
                </div>
                <div class="item" data-value=5 :class="{ 'active selected': testCase.test_priority === 5 }">5
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="three fields">
          <div class="field">
            <label>调试环境名称</label>
            <div class="ui search searchEnvironment">
              <div class="ui input">
                <input class="prompt" v-model="env.env_name" name="env_name" type="text" placeholder="输入环境名称">
              </div>
              <div class="results"></div>
            </div>
          </div>
          <div class="field">
            <label>调试环境URL</label>
            <div>{{ env.env_url }}</div>
          </div>
          <div class="inline fields right floated">
            <div class="field">
              <div class="ui">&emsp;&emsp;&emsp;</div>
              <div class="ui">&emsp;&emsp;&emsp;</div>
            </div>
            <div class="field">
              <div class="ui">&emsp;&emsp;&emsp;</div>
              <div class="ui">&emsp;&emsp;&emsp;</div>
            </div>
            <div class="field">
              <div class="ui">&emsp;&emsp;&emsp;</div>
              <button class="ui right floated button"
                :class="{ loading: debugButton == '调试中', red: debugButton == '调试失败', positive: debugButton != '调试失败' }"
                @click.prevent="sendRequest">{{ debugButton }}</button>
            </div>
            <div class="field">
              <div class="ui">&#8195; &emsp;</div>
              <button class="ui right floated button"
                :class="{ loading: submitButton == '保存中', red: submitButton == '保存失败', positive: submitButton != '调试失败' }"
                @click.prevent="saveApiData">{{ submitButton }}</button>
            </div>
          </div>
        </div>
        <div>
          <a v-if="response.status" class="ui label" :class="message.type == 'success' ? 'green' : 'red'">{{
            response.status }}</a>
          <a v-if="sendTime" class="ui label" :class="message.type == 'success' ? 'green' : 'red'">{{ sendTime }}</a>
        </div>
        <div class="ui error message"></div>
        <div v-if="message.isShow" :class="message.type == 'success' ? 'green' : 'red'" class="ui message">
          <div class="header">{{ message.type }}!</div>
          <pre>{{ message.text }}</pre>
        </div>
        <div class="ui top attached tabular menu">
          <div class="item" :class="{ active: operateTab === 'expected_data' }" @click="operateTab = 'expected_data'">
            期望响应体
          </div>
          <div class="item" :class="{ active: operateTab === 'expected_headers' }"
            @click="operateTab = 'expected_headers'">
            期望响应头
          </div>
          <div class="item" :class="{ active: operateTab === 'pre_process' }" @click="operateTab = 'pre_process'">前置处理
          </div>
          <div class="item" :class="{ active: operateTab === 'test_data' }" @click="operateTab = 'test_data'">测试数据
          </div>
          <div class="item" :class="{ active: operateTab === 'post_process' }" @click="operateTab = 'post_process'">后置处理
          </div>
          <div class="item" :class="{ active: operateTab === 'res_data' }" @click="operateTab = 'res_data'">实际响应体
          </div>
          <div class="item" :class="{ active: operateTab === 'res_headers' }" @click="operateTab = 'res_headers'">
            实际响应头
          </div>
        </div>
        <div class="ui bottom attached segment">
          <div v-show="operateTab === 'expected_data'" class="field">
            <textarea v-model="testCase.expected_result.expected_data" name="expected_data"></textarea>
          </div>
          <div v-show="operateTab === 'expected_headers'" class="field">
            <table class="ui celled table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key) in testCase.expected_result.expected_headers" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                  <td><button class="ui icon button"
                      @click.prevent="deleteKeyValue(testCase.expected_result.expected_headers, key)">
                      <i class="minus icon"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><input v-model="newExpectedHeaders.key" placeholder="Key" /></td>
                  <td><input v-model="newExpectedHeaders.value" placeholder="Value" /></td>
                  <td><button class="ui icon button"
                      @click.prevent="addKeyValue(testCase.expected_result.expected_headers, newExpectedHeaders)">
                      <i class="plus icon"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="operateTab === 'pre_process'" class="field">
            <textarea v-model="testCase.pre_process_str" name="pre_process"></textarea>
          </div>
          <div v-show="operateTab === 'test_data'" class="field">
            <textarea v-model="testCase.test_data_str" name="test_data"></textarea>
          </div>
          <div v-show="operateTab === 'post_process'" class="field">
            <textarea v-model="testCase.post_process_str" name="post_process"></textarea>
          </div>
          <div v-show="operateTab === 'res_data'" class="field">
            <pre>{{ response.data }}</pre>
          </div>
          <div v-show="operateTab === 'res_headers'" class="field">
            <table class="ui celled table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key, index) in response.headers" :key="index">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRef, watchEffect } from 'vue';
import http from '../../axios';
import { useRoute } from 'vue-router'
import { testCaseValidationRules } from '../../constants/testmgmt/validation.js'
import { showMessage, dateToString, addKeyValue, deleteKeyValue, changeRequestData, getNewRequestData, assign } from '../../utils/common.js'

const route = useRoute()
const { params } = route
const activeTab = ref(0)
const requestTab = ref('params');
const operateTab = ref('expected_data');
const bodyType = ref('raw');
const requestDataRaw = ref('');
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH']
const statusCodes = [200, 400, 401, 403, 404, 405, 417, 500, 501, 502, 503, 504]
const validateTypes = {
  'full_match': '完全匹配',
  'partial_match': '部分匹配',
  'jsonschema': 'JSON模式',
  'specified_fields': '指定字段'
}
const debugButton = ref('调试')
const submitButton = ref('保存')
const sendTime = ref('')
const env = reactive({
  env_id: 0,
  env_name: '',
  env_url: ''
})
const newParams = reactive({
  key: '',
  value: ''
})
const newHeaders = reactive({
  key: '',
  value: ''
})
const newData = reactive({
  key: '',
  value: ''
})
const newExpectedHeaders = reactive({
  key: '',
  value: ''
})
const testCases = reactive([]);
const testScenario = reactive({
  scenario_id: "",
  scenario_code: "",
  scenario_name: "",
  scenario_level: "",
  scenario_type: "",
  project_id: "",
  project_name: "",
  description: "",
  module_id: "",
  module_name: "",
  creator: "",
  creator_name: "",
  create_time: "",
  updater: "",
  updater_name: "",
  update_time: ""
})
const initTestCase = {
  scenario_id: '',
  testcase_id: '',
  testcase_code: '',
  testcase_name: '',
  test_type: '',
  test_priority: '',
  pre_process: undefined,
  pre_process_str: '',
  test_content: { path: '', method: '', params: {}, headers: {}, data: {} },
  test_data: undefined,
  test_data_str: '',
  post_process: undefined,
  post_process_str: '',
  expected_result: { validate_type: '', expected_status: '', expected_headers: {}, expected_data: '' },
  actual_result: {},
  description: ''
};
const testCase = reactive({ ...initTestCase });
const initResponse = {
  data: undefined,
  status: '',
  statusText: '',
  headers: {}
};
const response = reactive({ ...initResponse });
const initMessage = {
  type: '',
  text: '',
  isShow: false
}
const message = reactive({ ...initMessage });
onMounted(() => {
  getApiData(params.scenario_id, activeTab.value)
});
watchEffect(() => {
  $('.searchEnvironment')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/environments/search?project_id={project_id}&query={query}',
        urlData: {
          project_id: testScenario.project_id
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
})
function changeRawData() {
  changeRequestData(toRef(testCase.test_content, 'data'), requestDataRaw, bodyType.value)
}
const getApiData = async (scenario_id, index) => {
  try {
    const scenario_res = await http.get(`/scenarios/${scenario_id}`)
    const testcase_res = await http.get(`/scenarios/${scenario_id}/testcases`)
    Object.assign(testScenario, scenario_res.data.data)
    Object.assign(testCases, testcase_res.data.data)
    if (testCases.length != 0) {
      Object.assign(testCase, testCases[index])
    }
    testCase.scenario_id = testScenario.scenario_id
    requestDataRaw.value = testCase.test_content.data && Object.keys(testCase.test_content.data).length != 0 ? JSON.stringify(testCase.test_content.data) : ''
    testCase.pre_process_str = testCase.pre_process && Object.keys(testCase.pre_process).length != 0 ? JSON.stringify(testCase.pre_process, null, 2) : ''
    testCase.test_data_str = testCase.test_data && Object.keys(testCase.test_data).length != 0 ? JSON.stringify(testCase.test_data, null, 2) : ''
    testCase.post_process_str = testCase.post_process && Object.keys(testCase.post_process).length != 0 ? JSON.stringify(testCase.post_process, null, 2) : ''
    $('#method').dropdown('set selected', testCase.test_content.method)
    $('#expected_status').dropdown('set selected', testCase.expected_result.expected_status)
    $('#validate_type').dropdown('set selected', testCase.expected_result.validate_type)
    $('#test_priority').dropdown('set selected', testCase.test_priority)
    activeTab.value = index
  } catch (error) {
    console.error(error);
  }
};
const saveApiData = async () => {
  try {
    submitButton.value = '保存中'
    debugButton.value = '调试'
    sendTime.value = ''
    Object.assign(response, initResponse);
    Object.assign(message, initMessage);
    // 更新data数据
    let requestData = testCase
    requestData.test_content.data = getNewRequestData(toRef(testCase.test_content, 'data'), requestDataRaw, bodyType.value)
    requestData.pre_process = testCase.pre_process_str ? JSON.parse(testCase.pre_process_str): JSON.parse(null)
    requestData.test_data = testCase.test_data_str ? JSON.parse(testCase.test_data_str): null
    requestData.post_process = testCase.post_process_str ? JSON.parse(testCase.post_process_str): null
    if ($('.ui.form').form('is valid')) {
      let res = null
      if (testCase.testcase_id) {
        res = await http.put(`/testcases/${testCase.testcase_id}`, requestData)
      } else {
        res = await http.post("/testcases", requestData)
      }
      assign(response, res);
      if (res.status == 200 && res.data && res.data.errcode == 0) {
        showMessage(message, 'success', res.data.message)
        submitButton.value = '保存成功';
        if (!testCase.testcase_id) {
          getApiData(testScenario.scenario_id, testCases.length)
        }
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
      assign(response, error.response);
      showMessage(message, 'error', response.data && response.data.message ? response.data.message : '')
    } else {
      response.data = error.stack
    }
    submitButton.value = '保存失败';
  } finally {
    sendTime.value = dateToString(new Date())
  }
};
const sendRequest = async () => {
  try {
    sendTime.value = ''
    debugButton.value = '调试中';
    submitButton.value = '保存'
    Object.assign(response, initResponse);
    Object.assign(message, initMessage);
    // 更新data数据
    let requestData = testCase
    requestData.test_content.data = getNewRequestData(toRef(testCase.test_content, 'data'), requestDataRaw, bodyType.value)
    requestData.pre_process = testCase.pre_process ? JSON.parse(testCase.pre_process): null
    requestData.test_data = testCase.test_data ? JSON.parse(testCase.test_data): null
    requestData.post_process = testCase.post_process ? JSON.parse(testCase.post_process): null
    if ($('.ui.form').form('get value', 'env_name')) {
      let res = await http.post("/executions/debug", requestData, { params: {"env_id": env.env_id}})
      assign(response, res);
      console.log(res.headers)
      console.log(typeof res.headers)
      if (res.status == 200 && res.data.errcode == 0) {
        showMessage(message, 'success', res.data.message)
        debugButton.value = '调试成功';
      }
      else {
        showMessage(message, 'error', res.data.message)
        debugButton.value = '调试失败';
      }
    } else {
      $('.ui.form').form('add prompt', 'env_name', '请选择调试环境')
      showMessage(message, 'error', '请选择调试环境')
      debugButton.value = '调试失败';
    }
  } catch (error) {
    console.error(error);
    if (error.response) {
      assign(response, error.response);
      showMessage(message, 'error', response.data && response.data.message ? response.data.message : '')
    } else {
      response.data = error.stack
    }
    debugButton.value = '调试失败';
    console.log(message)
  } finally {
    sendTime.value = dateToString(new Date())
  }
};
function addTab() {
  Object.assign(testCase, initTestCase)
  testCase.scenario_id = testScenario.scenario_id
  $('#method').dropdown('clear')
  $('#expected_status').dropdown('clear')
  $('#validate_type').dropdown('clear')
  $('#test_priority').dropdown('clear')
  activeTab.value = -1
}
function deleteTab(index) {
  testCases.splice(index, 1)
  activeTab.value = 0
}
function changeTab(index) {
  Object.assign(testCase, testCases[index])
  testCase.scenario_id = testScenario.scenario_id
  requestDataRaw.value = testCase.test_content.data && Object.keys(testCase.test_content.data).length != 0 ? JSON.stringify(testCase.test_content.data) : ''
  testCase.pre_process_str = testCase.pre_process && Object.keys(testCase.pre_process).length != 0 ? JSON.stringify(testCase.pre_process, null, 2) : ''
  testCase.test_data_str = testCase.test_data && Object.keys(testCase.test_data).length != 0 ? JSON.stringify(testCase.test_data, null, 2) : ''
  testCase.post_process_str = testCase.post_process && Object.keys(testCase.post_process).length != 0 ? JSON.stringify(testCase.post_process, null, 2) : ''
  $('#method').dropdown('set selected', testCase.test_content.method)
  $('#expected_status').dropdown('set selected', testCase.expected_result.expected_status)
  $('#validate_type').dropdown('set selected', testCase.expected_result.validate_type)
  $('#test_priority').dropdown('set selected', testCase.test_priority)
  activeTab.value = index
}
$(function () {
  $('#method').dropdown({
    onChange: function (value, text) {
      testCase.test_content.method = value;
    }
  });
  $('#expected_status').dropdown({
    onChange: function (value, text) {
      testCase.expected_result.expected_status = value;
    }
  });
  $('#validate_type').dropdown({
    onChange: function (value) {
      testCase.expected_result.validate_type = value;
    }
  });
  $('#test_priority').dropdown({
    onVisible: function () { },
    onChange: function (value) {
      testCase.test_priority = value;
    }
  });
  $('.ui.form').form(testCaseValidationRules);
  $('.tabular.menu').tab();
});
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .container {
    max-width: 85rem;
    margin: 0 auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

@media screen and (max-width: 767px) {
  .container {
    max-width: 100%;
    margin: 0 auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
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
</style>
