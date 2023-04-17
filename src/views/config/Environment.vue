<template>
  <div class="container">
    <button class="ui primary button" @click="createEnvironment">
      新增
    </button>
    <div class="ui modal" id="createModal">
      <div class="header">创建环境</div>
      <div class="content">
        <div class="ui form" id="createForm">
          <div class="three fields">
            <div class="field">
              <label>环境名称</label>
              <input v-model="env.env_name" type="text" placeholder="输入名称">
            </div>
            <div class="field">
              <label>环境URL</label>
              <input v-model="env.env_url" type="text" placeholder="输入URL">
            </div>
            <div class="field required">
              <label>所属项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="env.project_name" name="project_name" type="text" placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="three fields">
            <div class="field">
              <label>协议</label>
              <input v-model="env.protocol" type="text" placeholder="输入协议名称">
            </div>
            <div class="field">
              <label>主机名</label>
              <input v-model="env.hostname" type="text" placeholder="输入主机名">
            </div>
            <div class="field">
              <label>端口</label>
              <input v-model="env.port" type="number" placeholder="输入端口">
            </div>
          </div>
          <div class="field">
            <label>DB配置</label>
            <textarea v-model="env.db_config" placeholder="请输入DB配置"></textarea>
          </div>
          <div class="field">
            <label>Redis配置</label>
            <textarea v-model="env.redis_config" placeholder="请输入Redis配置"></textarea>
          </div>
          <div class="field">
            <label>环境描述</label>
            <textarea v-model="env.description" placeholder="请描述环境概况"></textarea>
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
    <div class="ui modal" id="updateModal">
      <div class="header">修改环境</div>
      <div class="content">
        <div class="ui form" id="updateForm">
          <div class="three fields">
            <div class="field">
              <label>环境名称</label>
              <input v-model="env.env_name" type="text" placeholder="输入名称">
            </div>
            <div class="field">
              <label>环境URL</label>
              <input v-model="env.env_url" type="text" placeholder="输入URL">
            </div>
            <div class="field required">
              <label>所属项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="env.project_name" name="project_name" type="text" placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="three fields">
            <div class="field">
              <label>协议</label>
              <input v-model="env.protocol" type="text" placeholder="输入协议名称">
            </div>
            <div class="field">
              <label>主机名</label>
              <input v-model="env.hostname" type="text" placeholder="输入主机名">
            </div>
            <div class="field">
              <label>端口</label>
              <input v-model="env.port" type="number" placeholder="输入端口">
            </div>
          </div>
          <div class="field">
            <label>DB配置</label>
            <pre><textarea v-model="env.db_config" placeholder="请输入DB配置"></textarea></pre>
          </div>
          <div class="field">
            <label>Redis配置</label>
            <textarea v-model="env.redis_config" placeholder="请输入Redis配置"></textarea>
          </div>
          <div class="field">
            <label>环境描述</label>
            <textarea v-model="env.description" placeholder="请描述环境概况"></textarea>
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
    <div class="ui mini modal transition" id="deleteModal">
      <div class="header">
        删除环境
      </div>
      <div class="content">
        <div class="ui form">
          <p>你是否确定删除环境？</p>
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
          <th>环境ID</th>
          <th>环境名称</th>
          <th>环境URL</th>
          <th>项目名称</th>
          <th>项目描述</th>
          <th>创建时间</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in envList.data" :key="item.env_id">
          <td>{{ item.env_id }}</td>
          <td>{{ item.env_name }}</td>
          <td>{{ item.env_url }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.description }} </td>
          <td>{{ dateToString(item.create_time) }} </td>
          <td>{{ dateToString(item.update_time) }} </td>
          <td>
            <button class="ui primary button" @click="updateEnvironment(item)">修改</button>
            <button class="ui negative button" @click="deleteEnvironment(item)">删除</button>
            <!-- <button class="ui primary button">详情</button> -->
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="8">
            <Pagination :pageNo.sync="pageNo" :pageTotal="pageTotal" :total="total" @getList="getList" />
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, toRef } from "vue"
import { useRouter } from 'vue-router'
import http from "../../axios"
import Pagination from "../../components/Pagination.vue"
import { dateToString } from '../../utils/common'
const router = useRouter()
const envList = reactive({
  data: [],
  pageNo: 1,
  pageTotal: 1,
  total: 0,
  pageSize: 10
})
const initEnv = {
  env_id: '',
  env_name: '',
  protocol: '',
  hostname: '',
  port: '',
  env_url: '',
  db_config: '',
  redis_config: '',
  description: '',
  project_id: '',
  project_name: ''
}
const env = reactive({ ...initEnv });
onMounted(() => {
  getList();
})
const getList = async (index) => {
  envList.pageNo = index ? index : envList.pageNo
  let res = await http.get("/environments", { params: { pageNo: envList.pageNo } });
  if (res.data.errcode === 0) {
    envList.data = res.data.data;
    envList.total = res.data.total;
    envList.pageTotal = res.data.page_total;
  }
}
watch(toRef(envList, 'pageNo'), (newvalue) => {
  getList(newvalue)
})

function createEnvironment() {
  $('#createModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(env, initEnv);
      },
      onShow: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#createForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/environments`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(env),
            beforeXHR: function (xhr) {
              xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
              return xhr;
            },
            on: 'now',
            successTest: function (response) {
              console.log(response)
              console.log(response.errcode === 0)
              return response.errcode === 0;
            },
            onSuccess: function (response) {
              $('.ui.success.message').text(response.message);
              $('.ui.success.message').show()
              if (envList.data.length === envList.pageSize) {
                goToPage(envList.pageNo + 1);
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
function updateEnvironment(item) {
  $('#updateModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(env, initEnv);
      },
      onShow: function () {
        Object.assign(env, item);
      },
      onVisible: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#createForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/environments/${env.env_id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(env),
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
              getList(envList.pageNo);
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
function deleteEnvironment(item) {
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
          url: `${import.meta.env.VITE_API_HOST}/environments/${item.env_id}`,
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
            envList.data = envList.data.filter((i) => i.env_id !== item.env_id);
            if (envList.data.length === 0 && envList.pageNo > 1) {
              goToPage(envList.pageNo - 1);
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
$(function () {
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
        env.project_id = result.project_id
        env.project_name = result.project_name
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