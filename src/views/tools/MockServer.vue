<template>
  <div class="container">
    <div class="ui">
      <h1>Http Mock 配置</h1>
    </div>
    <div>
        <h2>Request</h2>
      </div>
    <form class="ui form">
      <div class="four wide field">
        <div class="field required">
          <label>Mock名称</label>
          <input type="text" v-model="mock_data.mock_name" name="mock_name" />
        </div>
      </div>
      <div class="three fields">
        <div class="field required">
          <label>项目名称</label>
          <div class="ui search searchProject">
            <div class="ui input">
              <input class="prompt" v-model="project_name" name="project_name" type="text" placeholder="输入项目名称">
            </div>
            <div class="results"></div>
          </div>
        </div>
        <div class="field required">
          <label>模块名称</label>
          <div class="ui search searchModule">
            <div class="ui input">
              <input class="prompt" v-model="module_name" name="module_name" type="text" placeholder="输入模块名称">
            </div>
            <div class="results"></div>
          </div>
        </div>
        <div class="field required">
          <label>环境名称</label>
          <div class="ui search searchEnvironment">
            <div class="ui input">
              <input class="prompt" v-model="env_name" name="env_name" type="text" placeholder="输入环境名称">
            </div>
            <div class="results"></div>
          </div>
        </div>
      </div>
      <div class="three fields">
        <div class="field required">
          <label>Method</label>
          <div class="ui selection dropdown" id="method">
            <input type="hidden" name="method" :value="mock_data.method" id="method_input">
            <i class="dropdown icon"></i>
            <div id="method_text" class="text" :class="{ 'default': !mock_data.method }">{{ mock_data.method ? mock_data.method : 'Select Method'}}</div>
            <div class="menu">
              <div class="item" v-for="(method, index) in methods" :key="index" :data-value="method"
                :class="{ 'active selected': mock_data.method === method }">
                {{ method }}
              </div>
            </div>
          </div>
        </div>
        <div class="eleven wide field">
          <label>URL</label>
          <input type="text" v-model="mock_data.url" name="url" />
        </div>
        <div class="four wide field">
          <label>PATH</label>
          <input type="text" v-model="mock_data.path" name="path" />
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
              <tr v-for="(value, key) in mock_data.params" :key="key">
                <td><span>{{ key }}</span></td>
                <td><span>{{ value }}</span></td>
                <td><button class="ui icon button" @click.prevent="deleteKeyValue(mock_data.params, key)">
                    <i class="minus icon"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td><input type="text" v-model="newParams.key" placeholder="Key" /></td>
                <td><input type="text" v-model="newParams.value" placeholder="Value" /></td>
                <td><button class="ui icon button" @click.prevent="addKeyValue(mock_data.params, newParams)">
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
              <tr v-for="(value, key) in mock_data.headers" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
                <td><button class="ui icon button" @click.prevent="deleteKeyValue(mock_data.headers, key)">
                    <i class="minus icon"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td><input v-model="newHeaders.key" placeholder="Key" /></td>
                <td><input v-model="newHeaders.value" placeholder="Value" /></td>
                <td><button class="ui icon button" @click.prevent="addKeyValue(mock_data.headers, newHeaders)">
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
                <input type="radio" name="body-type" value="form-data" v-model="bodyType"
                  @change="changeRawData">
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
                <tr v-for="(value, key) in mock_data.data" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                  <td><button class="ui icon button" @click.prevent="deleteKeyValue(mock_data.data, key)">
                      <i class="minus icon"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><input type="text" v-model="newData.key" placeholder="Key" /></td>
                  <td><input type="text" v-model="newData.value" placeholder="Value" /></td>
                  <td><button class="ui icon button" @click.prevent="addKeyValue(mock_data.data, newData)">
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
      <div>
        <h2>Response</h2>
      </div>
      <div class="two fields">
        <div class="four wide field">
          <label>响应码</label>
          <div class="ui selection dropdown" id="response_status">
            <input type="hidden" name="response_status" :value="mock_data.response_status" id="response_status_input">
            <i class="dropdown icon"></i>
            <div id="response_status_text" class="text" :class="{ 'default': !mock_data.response_status }">{{ mock_data.response_status ?
              mock_data.response_status : 'Select Status Code' }}</div>
            <div class="menu">
              <div class="item" v-for="(statusCode, index) in statusCodes" :key="index" :data-value="statusCode"
                :class="{ 'active selected': mock_data.response_status === statusCode }">
                {{ statusCode }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui top attached tabular menu">
        <div class="item" :class="{ active: responseTab === 'data' }" @click="responseTab = 'data'">Data
        </div>
        <div class="item" :class="{ active: responseTab === 'headers' }" @click="responseTab = 'headers'">
          Headers</div>
      </div>
      <div class="ui bottom attached segment">
        <div v-show="responseTab === 'data'" class="field">
          <textarea v-model="mock_data.response_data" name="response_data"></textarea>
        </div>
        <div class="field" v-show="responseTab === 'headers'">
            <table class="ui celled table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key) in mock_data.response_headers" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                  <td><button class="ui icon button" @click.prevent="deleteKeyValue(mock_data.response_headers, key)">
                      <i class="minus icon"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><input v-model="newResHeaders.key" placeholder="Key" /></td>
                  <td><input v-model="newResHeaders.value" placeholder="Value" /></td>
                  <td><button class="ui icon button" @click.prevent="addKeyValue(mock_data.response_headers, newResHeaders)">
                      <i class="plus icon"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
      <div><button class="ui submit positive right floated button" :class="{ loading: isSubmitting }" @click.prevent="saveMockData">{{ isSubmitting ? '保存中' : '保存' }}</button></div>
          <div class="ui error message"></div>
          <div>
                <a v-if="response.status" class="ui label" :class="message.type == 'success' ? 'green' : 'red'">{{
                    response.status }}</a>
                <a v-if="sendTime" class="ui label" :class="message.type == 'success' ? 'green' : 'red'">{{ sendTime }}</a>
            </div>
            <div v-if="message.isShow" :class="message.type == 'success' ? 'green' : 'red'" class="ui message">
                <div class="header">{{message.type}}!</div>
                <p>{{ message.text }}</p>
            </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect, toRef } from 'vue';
import http from '../../axios';
import { useRoute, useRouter } from 'vue-router'
import { mockDataValidationRules } from '../../constants/tools/validation.js'
import { showMessage, dateToString, addKeyValue, deleteKeyValue, changeRequestData, getNewRequestData, assign} from '../../utils/common.js'

const route = useRoute()
const router = useRouter()
const { params } = route
const mock_id = params.mock_id
const requestTab = ref('params');
const responseTab = ref('data');
const bodyType = ref('raw');
const requestDataRaw = ref('');
const project_name = ref('');
const module_name = ref('');
const env_name = ref('');
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH']
const statusCodes = [200, 400, 401, 403, 404, 405, 417, 500, 501, 502, 503, 504]
const isSubmitting = ref(false)
const sendTime = ref('')
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
const newResHeaders = reactive({
    key: '',
    value: ''
})

const mock_data = reactive({
  mock_code: '',
  mock_name: '',
  project_id: '',
  module_id: 0,
  env_id: 0,
  url: '',
  path: '',
  method: '',
  params: {},
  headers: {},
  data: {},
  response_headers: {},
  response_data: '',
  response_status: ''
});
const initResponse = {
    data: null,
    status: '',
    statusText: '',
    headers: {}
};
const response = reactive({...initResponse});
const initMessage = {
    type: '',
    text: '',
    isShow: false
}
const message = reactive({...initMessage});
onMounted(() => {
  if (mock_id) {
    getMockData(mock_id)
  }
});
watchEffect(() => {
  $('.searchModule')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/module/search?project_id={project_id}&query={query}',
        urlData: {
          project_id: mock_data.project_id
        }
      },
      fields: {
        results: 'data',
        title: 'module_name'
      },
      searchFields: [
        'title'
      ],
      onSelect: function (result) {
        mock_data.module_id = result.module_id
        module_name.value = result.module_name
      }
    });
  $('.searchEnvironment')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/environment/search?project_id={project_id}&query={query}',
        urlData: {
          project_id: mock_data.project_id
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
        mock_data.env_id = result.env_id
        env_name.value = result.env_name
      }
    });
});
function changeRawData(){
    changeRequestData(toRef(mock_data, 'data'), requestDataRaw, bodyType.value)
}
const getMockData = async (mock_id) => {
  try {
    let res = await http.get(`/mock/mock-data/${mock_id}`)
    let data = res.data.data
    Object.assign(mock_data, data)
    console.log(mock_data)
    mock_data.params = data.params ? JSON.parse(data.params) : {}
    mock_data.headers = data.headers ? JSON.parse(data.headers) : {}
    mock_data.data = data.data ? JSON.parse(data.data) : {}
    requestDataRaw.value = Object.keys(mock_data.data).length != 0 ? JSON.stringify(mock_data.data): '' 
    mock_data.response_headers = data.response_headers ? JSON.parse(data.response_headers) : {}
    project_name.value = data.project_name
    module_name.value = data.module_name
    env_name.value = data.env_name
  } catch (error) {
    console.error(error);
  }
};
const saveMockData = async () => {
  try {
    isSubmitting.value = true
    sendTime.value = ''
    Object.assign(response, initResponse);
    Object.assign(message, initMessage);
    let res = null
    // 更新data数据
    let requestData = mock_data
    requestData.data = getNewRequestData(toRef(mock_data, 'data'), requestDataRaw, bodyType.value)
    if ($('.ui.form').form('is valid')) {
      let res = null
      if (mock_id) {
        res = await http.put(`/mock/mock-data/${mock_id}`, requestData)
      } else {
        res = await http.post('/mock/mock-data', requestData)
      }
      assign(response, res)
      if (res.status == 200 && res.data.errcode == 0) {
          showMessage(message, 'success', res.data.message)
          if (mock_id == undefined) {
          router.push(`/tools/mock/edit/${res.data.mock_id}`)
      }
      }else{
          showMessage(message, 'error', res.data.message)
      }
    }
  } catch (error) {
    console.error(error);
        if (error.response) {
            assign(response, error.response);
            showMessage(message, 'error', error.response.data && error.response.data.message ? error.response.data.message : '')
        }else{
            response.data = error.stack
        }
        console.log(message)
  } finally {
    isSubmitting.value = false;
    sendTime.value = dateToString(new Date())
  }
};
$(function () {
  $('.tabular.menu').tab();
  $('#method').dropdown({
    onChange: function (value, text) {
      $('#method_input').val(value);
      $('#method_text').text(text);
      mock_data.method = value;
    },
    'set selected': $('#method_input').val()
  });
  $('#response_status').dropdown({
    onChange: function (value, text) {
      $('#response_status_input').val(value);
      $('#response_status_text').text(text);
      mock_data.response_status = value;
    },
    'set selected': $('#response_status_input').val()
  });
  $('.ui.form').form(mockDataValidationRules);
  $('.searchProject')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/project/search?query={query}'
      },
      fields: {
        results: 'data',
        title: 'project_name'
      },
      searchFields: [
        'title'
      ],
      onSelect: function (result) {
        mock_data.project_id = result.project_id
        project_name.value = result.project_name
        mock_data.module_id = ""
        module_name.value = ""
      }
    });
});
</script>

<style scoped>
.container {
  max-width: 75rem;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.ui.form {
  margin-top: 1rem;
}
.response {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.ui.table {
  word-break: break-all;
}

.response pre {
  white-space: pre-wrap;
  word-break: break-all;
}

.loading {
  cursor: progress;
  opacity: 0.6;
}
</style>
