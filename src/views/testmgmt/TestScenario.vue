<template>
  <div class="container">
    <!-- <button class="ui primary labeled icon button" @click="gitImport">
    <i class="upload icon"></i>
    Import
  </button> -->
    <button class="ui primary button" @click="createScenario">
      新增
    </button>
    <div class="ui modal" id="createModal">
      <div class="header">新增测试场景</div>
      <div class="content">
        <form class="ui form" id="createForm">
          <div class="two fields">
            <div class="field required">
              <label>场景编码</label>
              <input v-model="testScenario.scenario_code" name="scenario_code" type="text" placeholder="输入编码">
            </div>
            <div class="field required">
              <label>场景名称</label>
              <input v-model="testScenario.scenario_name" name="scenario_name" type="text" placeholder="输入名称">
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>优先级</label>
              <select name="level" class="ui dropdown" v-model="testScenario.scenario_level">
                <option value=""></option>
                <option value=1>1</option>
                <option value=2>2</option>
                <option value=3>3</option>
                <option value=4>4</option>
                <option value=5>5</option>
              </select>
            </div>
            <div class="field required">
              <label>类型</label>
              <select name="type" class="ui dropdown" v-model="testScenario.scenario_type">
                <option value=""></option>
                <option value="API">API</option>
                <option value="WEB">WEB</option>
                <option value="APP">APP</option>
                <option value="H5">H5</option>
                <option value="小程序">小程序</option>
              </select>
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>所属项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="testScenario.project_name" name="project_name" type="text"
                    placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
            <div class="field required">
              <label>模块名称</label>
              <div class="ui search searchModule">
                <div class="ui input">
                  <input class="prompt" v-model="testScenario.module_name" name="module_name" type="text"
                    placeholder="输入模块名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>场景描述</label>
            <textarea v-model="testScenario.description" name="description" placeholder="请详细描述场景"></textarea>
          </div>
          <div class="ui success message"></div>
          <div class="ui error message"></div>
        </form>
      </div>
      <div class="actions">
        <div class="ui negative button">取消</div>
        <div class="ui positive right button">确定</div>
      </div>
    </div>
    <div class="ui modal" id="updateModal">
      <div class="header">编辑测试场景</div>
      <div class="content">
        <form class="ui form" id="updateForm">
          <div class="three fields">
            <div class="field">
              <label>场景ID</label>
              {{ testScenario.scenario_id }}
            </div>
            <div class="field">
              <label>创建时间</label>
              {{ dateToString(testScenario.create_time) }}
            </div>
            <div class="field">
              <label>更新时间</label>
              {{ dateToString(testScenario.update_time) }}
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>场景编码</label>
              <input v-model="testScenario.scenario_code" name="scenario_code" type="text" placeholder="输入编码">
            </div>
            <div class="field required">
              <label>场景名称</label>
              <input v-model="testScenario.scenario_name" name="scenario_name" type="text" placeholder="输入名称">
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>优先级</label>
              <select name="level" class="ui dropdown" v-model="testScenario.scenario_level">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div class="field required">
              <label>类型</label>
              <select name="type" class="ui dropdown" v-model="testScenario.scenario_type">
                <option value="API">API</option>
                <option value="WEB">WEB</option>
                <option value="APP">APP</option>
                <option value="H5">H5</option>
                <option value="小程序">小程序</option>
              </select>
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>所属项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="testScenario.project_name" name="project_name" type="text"
                    placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
            <div class="field required">
              <label>模块名称</label>
              <div class="ui search searchModule">
                <div class="ui input">
                  <input class="prompt" v-model="testScenario.module_name" name="module_name" type="text"
                    placeholder="输入模块名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>场景描述</label>
            <textarea v-model="testScenario.description" name="description" placeholder="请详细描述场景"></textarea>
          </div>
          <div class="ui success message"></div>
          <div class="ui error message"></div>
        </form>
      </div>
      <div class="actions">
        <div class="ui negative button">取消</div>
        <div class="ui positive right button">确定</div>
      </div>
    </div>
    <div class="ui mini modal transition" id="deleteModal">
      <div class="header">
        删除测试场景
      </div>
      <div class="content">
        <div class="ui form">
          <p>你是否确定删除测试场景？</p>
          <div class="ui success message"></div>
          <div class="ui error message"></div>
        </div>
      </div>
      <div class="actions">
        <div class="ui negative button">
          取消
        </div>
        <div class="ui positive right button">
          确定
        </div>
      </div>
    </div>
    <div class="ui mini modal transition" id="executeModal">
      <div class="header">
        运行测试场景
      </div>
      <div class="content">
        <div class="ui form" id="executeForm">
          <div class="field">
            <label>执行环境名称</label>
            <div class="ui search searchEnvironment">
              <div class="ui input">
                <input class="prompt" v-model="env.env_name" name="env_name" type="text" placeholder="输入环境名称">
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
    <table class="ui celled padding table">
      <thead class="full-width">
        <tr>
          <th>场景ID</th>
          <th>场景编码</th>
          <th>场景名称</th>
          <th>优先级</th>
          <th>类型</th>
          <th>项目名称</th>
          <th>模块名称</th>
          <th>更新人</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in scenarioList.data" :key="item.scenario_id">
          <td>{{ item.scenario_id }}</td>
          <td>{{ item.scenario_code }}</td>
          <td>{{ item.scenario_name }} </td>
          <td>{{ item.scenario_level }}</td>
          <td>{{ item.scenario_type }} </td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.module_name }}</td>
          <td>{{ item.updater_username }}</td>
          <td>{{ dateToString(item.update_time) }}</td>
          <td><button class="ui positive button" @click="updateScenario(item)">修改</button>
            <button class="ui negative button" @click="deleteScenario(item)">删除</button>
            <button class="ui positive button" @click="executeScenario(item)">运行</button>
            <button class="ui primary button" id="projectDetail" @click="detail(item)">详情</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="10">
            <Pagination :pageNo="scenarioList.pageNo" :pageTotal="scenarioList.pageTotal" :total="scenarioList.total"
              @getList="getList" />
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import http from "../../axios";
import Pagination from "../../components/Pagination.vue";
import { reactive, onMounted, watch, watchEffect, toRef } from "vue";
import { useRouter } from 'vue-router'
import { dateToString } from '../../utils/common.js'
import { testScenarioValidationRules } from '../../constants/testmgmt/validation.js'
const router = useRouter()
const env = reactive({
  env_id: 0,
  env_name: '',
  env_url: ''
})
const scenarioList = reactive({
  data: [],
  pageNo: 1,
  pageTotal: 1,
  total: 0,
  pageSize: 10
})
const initTestScenario = {
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
}
const testScenario = reactive({ ...initTestScenario });
onMounted(() => {
  getList();
})
const getList = async (index) => {
  scenarioList.pageNo = index ? index : scenarioList.pageNo
  let res = await http.get("/scenarios", { params: { pageNo: scenarioList.pageNo } });
  if (res.data.errcode === 0) {
    scenarioList.data = res.data.data;
    scenarioList.total = res.data.total;
    scenarioList.pageTotal = res.data.page_total;
  }
}
watch(toRef(scenarioList, 'pageNo'), (newvalue) => {
  getList(newvalue)
}
)
watchEffect(() => {
  $('.searchModule')
    .search({
      apiSettings: {
        url: `${import.meta.env.VITE_API_HOST}/modules/search?project_id={project_id}&query={query}`,
        urlData: { project_id: testScenario.project_id },
        beforeXHR: function (xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
          return xhr;
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
        testScenario.module_id = result.module_id
        testScenario.module_name = result.module_name
      }
    });
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
const gitImport = () => {
  router.push("/test/case/import");
}
function createScenario() {
  $('#createModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(testScenario, initTestScenario);
      },
      onShow: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#createForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/scenarios`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(testScenario),
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
              if (scenarioList.data.length === scenarioList.pageSize) {
                getList(scenarioList.pageNo + 1);
              } else {
                getList();
              }
              setTimeout(function () {
                $('#createModal').modal('hide');
              }, 3000);
            },
            onFailure: function (response) {
              $('.ui.error.message').text(response.message);
              $('.ui.error.message').show();
            }
          });
        }
        return false;
      }
    })
    .modal('show');
}
function updateScenario(item) {
  $('#updateModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(testScenario, initTestScenario);
      },
      onShow: function () {
        Object.assign(testScenario, item);
      },
      onVisible: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#updateForm').form('validate form');
        let isValid = $('#updateForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/scenarios/${testScenario.scenario_id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(testScenario),
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
              $('.ui.success.message').show();
              getList(scenarioList.pageNo);
              setTimeout(function () {
                $('#updateModal').modal('hide');
              }, 3000);
            },
            onFailure: function (response) {
              $('.ui.error.message').text(response.message);
              $('.ui.error.message').show();
            }
          });
        }
        return false;
      }
    }).modal('show');
}
function deleteScenario(item) {
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
          url: `${import.meta.env.VITE_API_HOST}/scenarios/${item.scenario_id}`,
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
            scenarioList.data = scenarioList.data.filter((i) => i.scenario_id !== item.scenario_id);
            if (scenarioList.data.length === 0 && scenarioList.pageNo > 1) {
              getList(scenarioList.pageNo - 1);
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
function executeScenario(item) {
  $('#executeModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(testScenario, initTestScenario);
        env.env_id = ""
        env.env_name = ""
        env.env_url = ""
      },
      onShow: function () {
        Object.assign(testScenario, item);
      },
      onApprove: function () {
        $.api({
          url: `${import.meta.env.VITE_API_HOST}/executions/scenario/${item.scenario_id}?env_id=${env.env_id}`,
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
            getList(scenarioList.pageNo);
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
function detail(item) {
  router.push(`/test/case/${item.scenario_type.toLowerCase()}/${item.scenario_id}`)
}
$(function () {
  $('#createForm').form(testScenarioValidationRules);
  $('#updateForm').form(testScenarioValidationRules);
  $('#executeForm').form();
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
      searchDelay: 100,
      onSelect: function (result) {
        testScenario.project_id = result.project_id
        testScenario.project_name = result.project_name
        testScenario.module_id = ""
        testScenario.module_name = ""
      }
    });
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
</style>