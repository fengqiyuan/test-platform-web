<template>
  <div class="ui container">
    <button class="ui primary button" @click="createSchedule">新增</button>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>ID</th>
          <th>计划任务名称</th>
          <th>运行器名称</th>
          <th>项目名称</th>
          <th>执行时间</th>
          <th>最近一次执行时间</th>
          <th>最近一次执行状态</th>
          <th>下一次执行时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in scheduleList.data" :key="item.schedule_id">
          <td>{{ item.schedule_id }}</td>
          <td>{{ item.schedule_name }}</td>
          <td>{{ item.runner_name }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.cron }}</td>
          <td>{{ item.execute_time }}</td>
          <td>{{ item.execute_status }}</td>
          <td>{{ item.next_time }}</td>
          <td>
            <button class="ui primary button" @click="updateSchedule(item)">修改</button>
            <button class="ui negative button" @click="deleteSchedule(item)">删除</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="9" v-if="scheduleList.pageTotal > 1">
            <div class="ui right floated pagination menu">
              <a class="item" :class="{ disabled: scheduleList.pageNo === 1 }" @click.prevent="goToPage(1)"
                :style="{ 'pointer-events': scheduleList.pageNo === 1 ? 'none' : 'auto' }">First</a>
              <a class="item" v-if="scheduleList.pageNo != 1" @click.prevent="goToPage(scheduleList.pageNo - 1)">
                Prev
              </a>
              <a class="item" v-for="(item, index) in scheduleList.iter_pages" :key="index"
                :class="{ 'active': scheduleList.pageNo === item, 'disabled': item === null }"
                :style="{ 'pointer-events': item === null ? 'none' : 'auto' }" @click.prevent="goToPage(item)">
                {{ item ? item : '...' }}
              </a>
              <a class="item" v-if="scheduleList.pageNo != scheduleList.pageTotal"
                @click.prevent="goToPage(scheduleList.pageNo + 1)">
                Next
              </a>
              <a class="item" :class="{ disabled: scheduleList.pageNo === scheduleList.pageTotal }"
                @click.prevent="goToPage(scheduleList.pageTotal)"
                :style="{ 'pointer-events': page === scheduleList.pageTotal ? 'none' : 'auto' }">Last</a>
            </div>
          </th>
        </tr>
      </tfoot>
    </table>
    <div class="ui modal" id="createModal">
      <div class="header">新增计划任务</div>
      <div class="content">
        <form class="ui form" id="createForm">
          <div class="two fields">
            <div class="field required">
              <label>任务名称</label>
              <input v-model="schedule.schedule_name" name="schedule_name" type="text" placeholder="输入任务名称">
            </div>
            <div class="field required">
              <label>cron表达式</label>
              <input v-model="schedule.cron" name="cron" type="text" placeholder="输入cron表达式">
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="schedule.project_name" name="project_name" type="text"
                    placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
            <div class="field required">
              <label>运行器名称</label>
              <div class="ui search searchRunner">
                <div class="ui input">
                  <input class="prompt" v-model="schedule.runner_name" name="runner_name" type="text"
                    placeholder="输入Runner名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>任务描述</label>
            <textarea v-model="schedule.description" name="description" placeholder="请详细描述"></textarea>
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
      <div class="header">编辑计划任务</div>
      <div class="content">
        <form class="ui form" id="updateForm">
          <div class="three fields">
            <div class="field">
              <label>计划任务ID</label>
              {{ schedule.schedule_id }}
            </div>
            <div class="field">
              <label>创建时间</label>
              {{ schedule.create_time }}
            </div>
            <div class="field">
              <label>更新时间</label>
              {{ schedule.update_time }}
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>任务名称</label>
              <input v-model="schedule.schedule_name" name="schedule_name" type="text" placeholder="输入任务名称">
            </div>
            <div class="field required">
              <label>cron表达式</label>
              <input v-model="schedule.cron" name="cron" type="text" placeholder="输入cron表达式">
            </div>
          </div>
          <div class="two fields">
            <div class="field required">
              <label>项目名称</label>
              <div class="ui search searchProject">
                <div class="ui input">
                  <input class="prompt" v-model="schedule.project_name" name="project_name" type="text"
                    placeholder="输入项目名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
            <div class="field required">
              <label>运行器名称</label>
              <div class="ui search searchRunner">
                <div class="ui input">
                  <input class="prompt" v-model="schedule.runner_name" name="runner_name" type="text"
                    placeholder="输入Runner名称">
                </div>
                <div class="results"></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>任务描述</label>
            <textarea v-model="schedule.description" name="description" placeholder="请详细描述"></textarea>
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
        删除计划任务
      </div>
      <div class="content">
        <div class="ui form">
          <p>你是否确定删除计划任务？</p>
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
import { ref, reactive, onMounted, watchEffect } from 'vue';
import http from '../../axios';
import { useRouter } from 'vue-router'
const router = useRouter()
const scheduleList = reactive({
  data: [],
  pageNo: 1,
  pageTotal: 1,
  total: 0,
  pageSize: 10,
  iter_pages: []
})

const initSchedule = {
  schedule_id: '',
  schedule_name: '',
  project_id: '',
  project_name: '',
  runner_id: '',
  runner_name: '',
  cron: '',
  description: ''
}

const schedule = reactive({ ...initSchedule })
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
  pageNo = pageNo ? pageNo : scheduleList.pageNo
  let res = await http.get("/schedules", { params: { pageNo: pageNo } });
  if (res.data.errcode === 0) {
    scheduleList.data = res.data.data;
    scheduleList.total = res.data.total;
    scheduleList.pageTotal = res.data.page_total;
    scheduleList.iter_pages = res.data.iter_pages;
  }
  scheduleList.pageNo = pageNo
}

function createSchedule() {
  $('#createModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(schedule, initSchedule);
      },
      onApprove: function () {
        $('#createForm').form('validate form');
        let isValid = $('#addForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/schedules`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(schedule),
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
              if (scheduleList.data.length === scheduleList.pageSize) {
                goToPage(scheduleList.pageNo + 1);
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
function updateSchedule(item) {
  $('#updateModal')
    .modal({
      onHide: function () {
        $('.ui.form').form('clear');
        $('.ui.success.message').text();
        $('.ui.success.message').hide()
        $('.ui.error.message').text();
        $('.ui.error.message').hide()
        Object.assign(schedule, initSchedule);
      },
      onShow: function () {
        Object.assign(schedule, item);
      },
      onApprove: function () {
        $('#updateForm').form('validate form');
        let isValid = $('#updateForm').form('is valid');
        if (isValid) {
          $.api({
            url: `${import.meta.env.VITE_API_HOST}/schedules/${schedule.schedule_id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(schedule),
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
              getList(scheduleList.pageNo);
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
function deleteSchedule(item) {
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
          url: `${import.meta.env.VITE_API_HOST}/schedules/${item.schedule_id}`,
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
            scheduleList.data = scheduleList.data.filter((i) => i.schedule_id !== item.schedule_id);
            if (scheduleList.data.length === 0 && scheduleList.pageNo > 1) {
              goToPage(scheduleList.pageNo - 1);
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
watchEffect(() => {
  $('.searchRunner')
    .search({
      apiSettings: {
        url: import.meta.env.VITE_API_HOST + '/runners/search?project_id={project_id}&query={query}',
        urlData: {
          project_id: schedule.project_id
        },
        beforeXHR: function (xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.access_token}`);
          return xhr;
        }
      },
      fields: {
        results: 'data',
        title: 'runner_name'
      },
      searchFields: [
        'title'
      ],
      onSelect: function (result) {
        schedule.runner_id = result.runner_id
        schedule.runner_name = result.runner_name
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
        schedule.project_id = result.project_id
        schedule.project_name = result.project_name
      }
    });
});
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
