<template>
  <div class="container">
    <button class="ui primary button" @click="createProject">
      新增
    </button>
    <div class="ui modal" id="createModal">
      <div class="header">创建项目</div>
      <div class="content">
        <div class="ui form" id="createForm">
          <div class="three fields">
            <div class="field">
              <label>项目编码</label>
              <input v-model="project.project_code" type="text" placeholder="输入编码">
            </div>
            <div class="field">
              <label>项目名称</label>
              <input v-model="project.project_name" type="text" placeholder="输入名称">
            </div>
            <div class="field">
              <label>项目git地址</label>
              <input v-model="project.git_url" type="text" placeholder="输入git地址">
            </div>
          </div>
          <div class="field">
            <label>项目描述</label>
            <textarea v-model="project.description" placeholder="请描述项目概况"></textarea>
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
      <div class="header">修改项目</div>
      <div class="content">
        <div class="ui form" id="updateForm">
          <div class="three fields">
            <div class="field">
              <label>项目ID</label>
              {{ project.project_id }}
            </div>
            <div class="field">
              <label>创建时间</label>
              {{ dateToString(project.create_time) }}
            </div>
            <div class="field">
              <label>更新时间</label>
              {{ dateToString(project.update_time) }}
            </div>
          </div>
          <div class="three fields">
            <div class="field">
              <label>项目编码</label>
              <input v-model="project.project_code" type="text" placeholder="输入编码">
            </div>
            <div class="field">
              <label>项目名称</label>
              <input v-model="project.project_name" type="text" placeholder="输入名称">
            </div>
            <div class="field">
              <label>项目git地址</label>
              <input v-model="project.git_url" type="text" placeholder="输入git地址">
            </div>
          </div>
          <div class="field">
            <label>项目描述</label>
            <textarea v-model="project.description" placeholder="请描述项目概况"></textarea>
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
        删除项目
      </div>
      <div class="content">
        <div class="ui form">
          <p>你是否确定删除项目？</p>
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
          <th>项目ID</th>
          <th>项目编码</th>
          <th>项目名称</th>
          <th>项目git地址</th>
          <th>项目描述</th>
          <th>创建时间</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in projectList.data" :key="item.id">
          <td>{{ item.project_id }}</td>
          <td>{{ item.project_code }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.git_url }}</td>
          <td>{{ item.description }} </td>
          <td>{{ dateToString(item.create_time) }} </td>
          <td>{{ dateToString(item.update_time) }} </td>
          <td>
            <button class="ui primary button" @click="updateProject(item)">修改</button>
            <button class="ui negative button" @click="deleteProject(item)">删除</button>
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
const projectList = reactive({
  data: [],
  pageNo: 1,
  pageTotal: 1,
  total: 0,
  pageSize: 10
})
const initProject = {
  project_id: '',
  project_code: '',
  project_name: '',
  git_url: '',
  description: '',
}
const project = reactive({ ...initProject });
onMounted(() => {
  getList();
})
const getList = async (index) => {
  projectList.pageNo = index ? index : projectList.pageNo
  let res = await http.get("/projects", { params: { pageNo: projectList.pageNo } });
  if (res.data.errcode === 0) {
    projectList.data = res.data.data;
    projectList.total = res.data.total;
    projectList.pageTotal = res.data.page_total;
  }
}
watch(toRef(projectList, 'pageNo'), (newvalue) => {
  getList(newvalue)
}
)
function createProject() {
  $('#createModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(project, initProject);
      },
      onShow: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#createForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/projects`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(project),
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
              if (projectList.data.length === projectList.pageSize) {
                getList(projectList.pageNo + 1);
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
function updateProject(item) {
  $('#updateModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(project, initProject);
      },
      onShow: function () {
        Object.assign(project, item);
      },
      onVisible: function () {
        $('.ui.dropdown').dropdown({});
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#createForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/projects/${project.project_id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(project),
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
              getList(projectList.pageNo);
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
function deleteProject(item) {
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
          url: `${import.meta.env.VITE_API_HOST}/projects/${item.project_id}`,
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
            projectList.data = projectList.data.filter((i) => i.project_id !== item.project_id);
            if (projectList.data.length === 0 && projectList.pageNo > 1) {
              getList(projectList.pageNo - 1);
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