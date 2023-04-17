<template>
    <div class="ui container">
        <h1 class="ui header">Mock接口列表</h1>
        <button class="ui primary button" @click="addItem">Add</button>
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Mock名称</th>
                    <th>项目名称</th>
                    <th>模块名称</th>
                    <th>环境名称</th>
                    <th>URL</th>
                    <th>PATH</th>
                    <th>方法</th>
                    <th>响应码</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in state.data" :key="item.id">
                    <td>{{ item.mock_id }}</td>
                    <td>{{ item.mock_name }}</td>
                    <td>{{ item.project_name }}</td>
                    <td>{{ item.module_name }}</td>
                    <td>{{ item.env_id }}</td>
                    <td>{{ item.url }}</td>
                    <td>{{ item.path }}</td>
                    <td>{{ item.method }}</td>
                    <td>{{ item.response_status }}</td>
                    <td>
                        <button class="ui primary button" @click="editItem(item)">Edit</button>
                        <button class="ui negative button" @click="deleteItem(item)">Delete</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="10"  v-if="state.pageTotal > 1">
                        <div class="ui right floated pagination menu">
                            <a class="item" :class="{ disabled: state.pageNo === 1 }" @click.prevent="goToPage(1)"
                                :style="{ 'pointer-events': state.pageNo === 1 ? 'none' : 'auto' }">First</a>
                            <a class="item" v-if="state.pageNo != 1" @click.prevent="goToPage(state.pageNo - 1)">
                                Prev
                            </a>
                            <a class="item" v-for="page in state.iter_pages" :key="page"
                                :class="{ 'active': page === state.pageNo, 'disabled': page === null }"
                                :style="{ 'pointer-events': page === null ? 'none' : 'auto' }"
                                @click.prevent="goToPage(page)">
                                {{ page ? page : '...' }}
                            </a>
                            <a class="item" v-if="state.pageNo != state.pageTotal"
                                @click.prevent="goToPage(state.pageNo + 1)">
                                Next
                            </a>
                            <a class="item" :class="{ disabled: state.pageNo === state.pageTotal }"
                                @click.prevent="goToPage(state.pageTotal)"
                                :style="{ 'pointer-events': page === state.pageTotal ? 'none' : 'auto' }">Last</a>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
        <div class="ui mini modal transition" id="deleteModal">
            <div class="header">
                删除Mock接口数据
            </div>
            <div class="content">
                <p>你是否确定删除Mock接口?</p>
            </div>
            <div class="actions">
                <div class="ui negative button">
                    取消
                </div>
                <div class="ui positive right labeled icon button">
                    确定
                    <i class="checkmark icon"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import http from '../../axios';
import { useRouter } from 'vue-router'
const router = useRouter()
const state = reactive({
    data: [],
    pageNo: 1,
    pageTotal: 1,
    total: 0,
    pageSize: 10,
    iter_pages: [],
    showDeleteModal: false
})

onMounted(() => {
    console.log('test')
    getList();
})
function goToPage(pageNo) {
    getList(pageNo)
}

const getList = async (pageNo) => {
    pageNo = pageNo ? pageNo : state.pageNo
    let res = await http.get("/mock/mock-data", { params: { pageNo: pageNo } });
    if (res.data.errcode === 0) {
        state.data = res.data.data;
        state.total = res.data.total;
        state.pageTotal = res.data.page_total;
        state.iter_pages = res.data.iter_pages;
        console.log(state.iter_pages)
    }
    state.pageNo = pageNo
}
function addItem(item) {
    router.push("/tools/mock/add");
}

function editItem(item) {
    router.push(`/tools/mock/edit/${item.mock_id}`);
}

function deleteItem(item) {
    $('#deleteModal')
        .modal({
            onApprove: async function () {
                try {
                    const res = await http.delete(`/mock/mock-data/${item.mock_id}`);
                    if (res.data.errcode === 0) {
                        state.data = state.data.filter((i) => i.mock_id !== item.mock_id);
                        if (state.data.length === 0 && state.pageNo > 1) {
                            goToPage(state.pageNo - 1);
                        } else {
                            getList();
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }).modal('show');
}
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
  