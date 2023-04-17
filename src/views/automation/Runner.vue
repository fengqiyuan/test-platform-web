<template>
  <div class="container">
    <h1>Runner配置</h1>
    <div class="ui form">
      <div class="two fields">
        <div class="field required">
          <label>Runner名称</label>
          <input type="text" v-model="runner.runner_name" name="runner_name" />
        </div>
        <div class="field required">
          <label>项目名称</label>
          <div class="ui search searchProject">
            <div class="ui input">
              <input class="prompt" v-model="runner.project_name" name="project_name" type="text" placeholder="输入项目名称">
            </div>
            <div class="results"></div>
          </div>
        </div>
      </div>
      <div class="two fields">
        <div class="field">
          <label>运行环境名称</label>
          <div class="ui search searchEnvironment">
            <div class="ui input">
              <input class="prompt" v-model="runner.env_name" name="env_name" type="text" placeholder="输入环境名称">
            </div>
            <div class="results"></div>
          </div>
        </div>
        <div class="field">
          <label>运行环境URL</label>
          <div>{{ runner.env_url }}</div>
        </div>
      </div>
      <table class="ui celled table">
        <thead>
          <tr>
            <th colspan="6">
              TestSuite配置
            </th>
            <th>
              <div class="field">
                <label>TestSuite名称</label>
                <div class="ui search searchTestSuite">
                  <div class="ui input">
                    <input class="prompt" name="testsuite_name" type="text" placeholder="输入TestSuite名称">
                  </div>
                  <div class="results"></div>
                </div>
              </div>
            </th>
            <th>
              <div class="ui">
                <div class="ui">&emsp;&emsp;&emsp;</div>
                <button class="ui button" @click="addTestSuite">新增</button>
              </div>
            </th>
          </tr>
          <tr>
            <th>TestSuite ID</th>
            <th>TestSuite名称</th>
            <th>项目ID</th>
            <th>项目名称</th>
            <th>总用例数量</th>
            <th>单独用例数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <TransitionGroup>
            <tr v-for="(testsuite, index) in runner.testsuites" :key="index"
              :class="{ 'dragging': state.draggingIndex === index }" @dragstart="dragStart(index)" @dragend="dragEnd"
              @dragover.prevent @drop.prevent="drop(index)" draggable="true">
              <td>{{ testsuite.testsuite_id }}</td>
              <td>{{ testsuite.testsuite_name }}</td>
              <td>{{ testsuite.project_id }}</td>
              <td>{{ testsuite.project_name }}</td>
              <td>{{ testsuite.total }}</td>
              <td>{{ testsuite.single_total }}</td>
              <td>
                <div class="ui">
                  <button class="ui button" @click="deleteTestSuite(index)">删除</button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </tbody>
      </table>
      <div class="field">
        <label>备注</label>
        <textarea v-model="runner.description" name="description"></textarea>
      </div>
      <div class="ui">
        <button class="ui submit right floated button"
          :class="{ loading: submitButton == '保存中', red: submitButton == '保存失败', positive: submitButton != '保存失败' }"
          @click.prevent="saveRunner">{{ submitButton }}</button>
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

const initRunner = [{
  runner_name: '',
  runner_type: '',
  description: '',
  project_id: '',
  project_name: '',
  env_id: '',
  env_name: '',
  env_url: '',
  testsuites: []
}]
const runner = reactive({ ...initRunner })
const testsuite = reactive({
  testsuite_id: '',
  testsuite_name: '',
  project_id: '',
  project_name: '',
  total: '',
  single_total: ''
})
const initMessage = {
  type: '',
  text: '',
  isShow: false
}
const message = reactive({ ...initMessage });
const state = reactive({
  draggingIndex: -1,
  dragOverIndex: -1,
});
onMounted(() => {
  if (params.runner_id) {
    getRunner(params.runner_id)
  }
});

const addTestSuite = () => {
  if ($('.ui.form').form('get value', 'testsuite_name')) {
    if (!Array.isArray(runner.testsuites)) {
      runner.testsuites = []
    }
    runner.testsuites.push({ ...testsuite })
    $('.ui.search.searchTestSuite input.prompt').val('');
    $('.ui.search.searchTestSuite').search('clear');
  } else {
    $('.ui.form').form('add prompt', 'testsuite_name', '请选择TestSuite')
  }
};

const deleteTestSuite = (index) => {
  runner.testsuites.splice(index, 1);
};

const dragStart = (index) => {
  state.draggingIndex = index;
};

const dragEnd = () => {
  state.draggingIndex = -1;
  state.dragOverIndex = -1;
};

const drop = (index) => {
  if (index !== state.draggingIndex) {
    state.dragOverIndex = index
    const draggingTestsuite = runner.testsuites[state.draggingIndex]
    runner.testsuites.splice(state.draggingIndex, 1)
    runner.testsuites.splice(state.dragOverIndex, 0, draggingTestsuite)
  }
};

const getRunner = async (runner_id) => {
  try {
    const res = await http.get(`/runners/${runner_id}`)
    Object.assign(runner, res.data.data)
  } catch (error) {
    console.error(error);
  }
};
const saveRunner = async () => {
  try {
    submitButton.value = '保存中'
    Object.assign(message, initMessage);
    if ($('.ui.form').form('is valid')) {
      let res = null
      if (runner.runner_id) {
        res = await http.put(`/runners/${runner.runner_id}`, runner)
      } else {
        res = await http.post("/runners", runner)
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
  $('.searchTestSuite')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/testsuites/search?project_id={project_id}&query={query}',
        urlData: {
          project_id: runner.project_id
        },
        beforeXHR: function (xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
          return xhr;
        }
      },
      fields: {
        results: 'data',
        title: 'testsuite_name'
      },
      searchFields: [
        'title'
      ],
      onSelect: function (result) {
        Object.assign(testsuite, result)
        $('.ui.form').form('remove prompt', 'testsuite_name');
      }
    });
  $('.searchEnvironment')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/environments/search?project_id={project_id}&query={query}',
        urlData: {
          project_id: runner.project_id
        },
        beforeXHR: function (xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
          return xhr;
        },
      },
      fields: {
        results: 'data',
        title: 'env_name'
      },
      searchFields: [
        'title'
      ],
      onSelect: function (result) {
        runner.env_id = result.env_id
        runner.env_name = result.env_name
        runner.env_url = result.env_url
      }
    });
});

$(function () {
  $('.ui.form').form({});
  $('.searchProject')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/projects/search?query={query}',
        beforeXHR: function (xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
          return xhr;
        },
      },
      fields: {
        results: 'data',
        title: 'project_name'
      },
      searchFields: [
        'title'
      ],
      onSelect: function (result) {
        runner.project_id = result.project_id
        runner.project_name = result.project_name
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
