<template>
  <div class="container">
    <button class="ui primary button" @click="createModule">
      新增
    </button>
    <div class="ui modal" id="createModal">
      <div class="header">创建模块</div>
      <div class="content">
        <div class="ui form" id="createForm">
          <div class="three fields">
            <div class="field">
              <label>模块编码</label>
              <input v-model="module.module_code" type="text" placeholder="输入名称">
            </div>
            <div class="field">
              <label>模块名称</label>
              <input v-model="module.module_name" type="text" placeholder="输入URL">
            </div>
            <div class="field required">
              <label>所属项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="module.project_name" name="project_name" type="text"
                    placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>模块描述</label>
            <textarea v-model="module.description" placeholder="请描述模块概况"></textarea>
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
      <div class="header">修改模块</div>
      <div class="content">
        <div class="ui form" id="updateForm">
          <div class="three fields">
            <div class="field">
              <label>模块编码</label>
              <input v-model="module.module_code" type="text" placeholder="输入名称">
            </div>
            <div class="field">
              <label>模块名称</label>
              <input v-model="module.module_name" type="text" placeholder="输入URL">
            </div>
            <div class="field required">
              <label>所属项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="module.project_name" name="project_name" type="text"
                    placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>模块描述</label>
            <textarea v-model="module.description" placeholder="请描述模块概况"></textarea>
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
        删除模块
      </div>
      <div class="content">
        <div class="ui form">
          <p>你是否确定删除模块？</p>
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
          <th>模块ID</th>
          <th>模块编码</th>
          <th>模块名称</th>
          <th>项目名称</th>
          <th>模块描述</th>
          <th>创建时间</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in moduleList.data" :key="item.module_id">
          <td>{{ item.module_id }}</td>
          <td>{{ item.module_code }}</td>
          <td>{{ item.module_name }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.description }} </td>
          <td>{{ dateToString(item.create_time) }} </td>
          <td>{{ dateToString(item.update_time) }} </td>
          <td>
            <button class="ui primary button" @click="updateModule(item)">修改</button>
            <button class="ui negative button" @click="deleteModule(item)">删除</button>
            <!-- <button class="ui primary button">详情</button> -->
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="8">
            <Pagination :pageNo.sync="moduleList.pageNo" :pageTotal="moduleList.pageTotal" :total="moduleList.total"
              @getList="getList" />
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
const moduleList = reactive({
  data: [],
  pageNo: 1,
  pageTotal: 1,
  total: 0,
  pageSize: 10
})
const initModule = {
  module_id: '',
  module_code: '',
  module_name: '',
  parent_module_id: '',
  parent_module_name: '',
  description: '',
  project_id: '',
  project_name: ''
}
const module = reactive({ ...initModule });
onMounted(() => {
  getList();
})
const getList = async (index) => {
  moduleList.pageNo = index ? index : moduleList.pageNo
  let res = await http.get("/modules", { params: { pageNo: moduleList.pageNo } });
  if (res.data.errcode === 0) {
    moduleList.data = res.data.data;
    moduleList.total = res.data.total;
    moduleList.pageTotal = res.data.page_total;
  }
}
watch(toRef(moduleList, 'pageNo'), (newvalue) => {
  getList(newvalue)
}
)

function createModule() {
  $('#createModal')
    .modal({
      onHide: function () {
        Object.assign(module, initModule);
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
      },
      onShow: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#createForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/modules`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(module),
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
              if (moduleList.data.length === moduleList.pageSize) {
                getList(moduleList.pageNo + 1);
              } else {
                getList();
              }
              setTimeout(function () {
                $('#createModal').modal('hide');
              }, 1000);
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
function updateModule(item) {
  $('#updateModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(module, initModule);
      },
      onShow: function () {
        Object.assign(module, item);
      },
      onVisible: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#createForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/modules/${module.module_id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(module),
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
              getList(moduleList.pageNo);
              setTimeout(function () {
                $('#updateModal').modal('hide');
              }, 1000);
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
function deleteModule(item) {
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
          url: `${import.meta.env.VITE_API_HOST}/modules/${item.module_id}`,
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
            moduleList.data = moduleList.data.filter((i) => i.module_id !== item.module_id);
            if (moduleList.data.length === 0 && envList.pageNo > 1) {
              getList(moduleList.pageNo - 1);
            } else {
              getList();
            }
            setTimeout(function () {
              $('#deleteModal').modal('hide');
            }, 1000);
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
        module.project_id = result.project_id
        module.project_name = result.project_name
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
}</style>