<template>
    <div class="ui right floated pagination menu" v-if="pageTotal>1">
        <a class="disabled item">共{{ total }}条</a>
        <a class="icon item" @click="prePage">
            <i class="left chevron icon"></i>
        </a>
        <!-- <a class="item">1</a> -->
        <!-- <a class="item">2</a> -->
        <!-- <a class="item">3</a> -->
        <!-- <a class="item">4</a> -->
        <a class="item" :class="pageNo == index ? 'active' : ''" v-for="index in pages" @click="curPage(index)">{{
                index
        }}</a>
        <a class="icon item" @click="nextPage">
            <i class="right chevron icon"></i>
        </a>
        <a class="disabled item">跳到第<input v-model="index" size="4" min="1" @keyup.enter="jumpPage(index)">页</a>
    </div>
</template>
  
<script>
export default {
    name: "DataTable",
    data() {
        return {
        };
    },
    props: {
        pageNo: Number,
        pageTotal: Number,
        total: Number
    },
    computed: {
        pages() {
            // let { pageNo: n, pageTotal: total } = this.page;
            let n = this.pageNo
            let total = this.pageTotal
            if (total < 10) return total;
            if (n < 5) {
                return [1, 2, 3, 4, 5, '...', total]
            } else if (n >= total - 5) {
                return [1, '...', total - 6, total - 5, total - 4, total - 3, total - 2, total - 1, total]
            } else {
                return [1, '...', n - 2, n - 1, n, n + 1, n + 2, '...', total]
            }
        },
    },
    methods: {
        curPage(index) {
            if (index == "...") return;
            console.log("test1")
            this.$emit("getList", index);
        },
        prePage() {
            let pageNo = this.pageNo;
            if (pageNo > 1) {
                this.$emit("getList", --pageNo);
            }
        },
        nextPage() {
            let pageNo = this.pageNo;
            let pageTotal = this.pageTotal;
            if (pageNo < pageTotal) {
                this.$emit("getList", ++pageNo);
            }
        },
        jumpPage(index) {
            if (index < 1) return;
            if (index > this.pageTotal) return;
            this.$emit("getList", index);
        }
    },
};
</script>