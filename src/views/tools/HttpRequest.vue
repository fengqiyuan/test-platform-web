<template>
    <div class="container">
        <div>
            <h1>Send HTTP Request</h1>
        </div>
        <div class="ui form">
            <div class="two fields">
                <div class="four wide field">
                    <label>Method</label>
                    <select class="ui dropdown" v-model="request.method">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
                <div class="twelve wide field">
                    <label>URL</label>
                    <input type="text" v-model="request.url" />
                </div>
            </div>
            <div class="ui top attached tabular menu">
                <div class="item" :class="{ active: requestTab === 'params' }" @click="requestTab = 'params'">Params</div>
                <div class="item" :class="{ active: requestTab === 'headers' }" @click="requestTab = 'headers'">Headers
                </div>
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
                            <tr v-for="(value, key) in request.params" :key="key">
                                <td><span>{{ key }}</span></td>
                                <td><span>{{ value }}</span></td>
                                <td><button class="ui icon button" @click="deleteKeyValue(request.params, key)">
                                        <i class="minus icon"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><input type="text" v-model="newParams.key" placeholder="Key" /></td>
                                <td><input type="text" v-model="newParams.value" placeholder="Value" /></td>
                                <td><button class="ui icon button" @click="addKeyValue(request.params, newParams)">
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
                            <tr v-for="(value, key) in request.headers" :key="key">
                                <td>{{ key }}</td>
                                <td>{{ value }}</td>
                                <td><button class="ui icon button" @click="deleteKeyValue(request.headers, key)">
                                        <i class="minus icon"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><input v-model="newHeaders.key" placeholder="Key" /></td>
                                <td><input v-model="newHeaders.value" placeholder="Value" /></td>
                                <td><button class="ui icon button" @click="addKeyValue(request.headers, newHeaders)">
                                        <i class="plus icon"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="ui bottom attached tab segment" :class="{ active: requestTab === 'body' }" data-tab="third">
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
                                <input type="radio" name="body-type" value="raw" v-model="bodyType"
                                    @change="changeRawData">
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
                                <tr v-for="(value, key) in request.data" :key="key">
                                    <td>{{ key }}</td>
                                    <td>{{ value }}</td>
                                    <td><button class="ui icon button" @click="deleteKeyValue(request.data, key)">
                                            <i class="minus icon"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><input type="text" v-model="newData.key" placeholder="Key" /></td>
                                    <td><input type="text" v-model="newData.value" placeholder="Value" /></td>
                                    <td><button class="ui icon button" @click="addKeyValue(request.data, newData)">
                                            <i class="plus icon"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
                    <div class="field" v-else="bodyType === 'raw'">
                        <textarea v-model="requestDataRaw"></textarea>
                    </div>                
            </div>
            <div class="ui error message">
            </div>
            <div class="ui field"><button class="ui submit positive right floated button" :class="{ loading: isSubmitting }"
                     @click.prevent="sendRequest">{{ isSubmitting ? 'Sending' :
                        'Send' }}</button>
            </div>
        </div>
        <div class="response">
            <div>
                <h2>Response</h2>
            </div>
            <div>
                <a v-if="response.status" class="ui label" :class="message.type == 'success' ? 'green' : 'red'">{{
                    response.status }}</a>
                <a v-if="sendTime" class="ui label" :class="message.type == 'success' ? 'green' : 'red'">{{ sendTime }}</a>
            </div>
            <div v-if="message.isShow" :class="message.type == 'success' ? 'green' : 'red'" class="ui message">
                <div class="header">{{message.type}}!</div>
                <p>{{ message.text }}</p>
            </div>
            <div class="ui top attached tabular menu">
                <div class="item" :class="{ active: responseTab === 'data' }" @click="responseTab = 'data'">Data
                </div>
                <div class="item" :class="{ active: responseTab === 'headers' }" @click="responseTab = 'headers'">
                    Headers</div>
            </div>
            <div class="ui bottom attached segment">
                <pre v-if="responseTab === 'data'">{{ response.data != {} ? response.data: '' }}</pre>
                <div v-if="responseTab === 'headers'">
                    <table class="ui celled table">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(value, key) in response.headers" :key="key">
                                <td>{{ key }}</td>
                                <td>{{ value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, reactive, toRefs, toRef, watch } from 'vue';
import axios from 'axios';
import { showMessage, dateToString, addKeyValue, deleteKeyValue, changeRequestData, getNewRequestData, assign} from '../../utils/common.js'

const requestTab = ref('params');
const responseTab = ref('data');
const bodyType = ref('raw');
const requestDataRaw = ref('');
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
const request = reactive({
    url: '',
    method: 'get',
    headers: {},
    params: {},
    data: {}
});
const initResponse = {
    data: null,
    status: 0,
    statusText: '',
    headers: {}
};
const response = reactive({...initResponse});
const initMessage = {
    type: '',
    text: '',
    isShow: false
}
const message = reactive({ ...initMessage })
function changeRawData(){
    changeRequestData(toRef(request, 'data'), requestDataRaw, bodyType.value)
}
const sendRequest = async () => {
    try {
        isSubmitting.value = true
        sendTime.value = ''
        Object.assign(response, initResponse);
        Object.assign(message, initMessage);
        let res = await axios.request({
            url: request.url,
            method: request.method,
            headers: request.headers,
            params: request.params,
            data: getNewRequestData(toRef(request, 'data'), requestDataRaw, bodyType.value)
        })
        assign(response, res);
        if (res.status == 200 && res.data.errcode == 0) {
            showMessage(message, 'success', res.data.message)
        }else{
            showMessage(message, 'error', res.data.message)
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
    }finally {
    isSubmitting.value = false;
    sendTime.value = dateToString(new Date())
}
};
$(function () {
    $('.ui.radio.checkbox').checkbox();
    $('.tabular.menu').tab();
    $('.ui.dropdown').dropdown({});
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
  