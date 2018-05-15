<template>
    <ul :class="wrapClasses">
        <li :class="prevClasses" @click="prev"></li>
        <li title="1" :class="firstPageClasses" @click="changePage(1)">1</li>
        <li class="ife-page-item-jump-prev" v-if="currentPage - 3 > 1" @click="fastPrev"></li>
        <li :title="currentPage - 2" class="ife-page-item" v-if="currentPage - 2 > 1" @click="changePage(currentPage - 2)">{{ currentPage - 2 }}</li>
        <li :title="currentPage - 1" class="ife-page-item" v-if="currentPage - 1 > 1" @click="changePage(currentPage - 1)">{{ currentPage - 1 }}</li>
        <li :title="currentPage" class="ife-page-item ife-page-item-active" v-if="currentPage != 1 && currentPage != allPages" @click="changePage(currentPage)">{{ currentPage }}</li>
        <li :title="currentPage + 1" class="ife-page-item" v-if="currentPage + 1 < allPages" @click="changePage(currentPage + 1)">{{ currentPage + 1 }}</li>
        <li :title="currentPage + 2" class="ife-page-item" v-if="currentPage + 2 < allPages" @click="changePage(currentPage + 2)">{{ currentPage + 2 }}</li>
        <li class="ife-page-item-jump-next" v-if="currentPage + 3 < allPages" @click="fastNext"></li>
        <li :title="allPages" :class="lastPageClasses" v-if="allPages > 1" @click="changePage(allPages)">{{ allPages }}</li>
        <li :class="nextClasses" @click="next"></li>
        <Options
            :current="currentPage"
            :allPages="allPages"
            @on-page="onPage" />
    </ul>
</template>
<script>
import Options from './options';
const prefixCls = 'ife-page';
export default {
    name: 'Page',
    components: {
        Options
    },
    data () {
        return {
            total: 100,
            currentPage: 1,
            currentPageSize: 10
        };
    },
    computed: {
        allPages () {
            let allPage = Math.ceil(this.total / this.currentPageSize);
            return (allPage === 0) ? 1 : allPage;
        },
        firstPageClasses () {
            return [
                `${prefixCls}-item`,
                {
                    [`${prefixCls}-item-active`]: this.currentPage === 1
                }
            ];
        },
        lastPageClasses () {
            return [
                `${prefixCls}-item`,
                {
                    [`${prefixCls}-item-active`]: this.currentPage === this.allPages
                }
            ];
        },
        wrapClasses () {
            return [
                `${prefixCls}`
            ];
        },
        prevClasses () {
            return [
                `${prefixCls}-prev`,
                {
                    [`${prefixCls}-disabled`]: this.currentPage === 1
                }
            ];
        },
        nextClasses () {
            return [
                `${prefixCls}-next`,
                {
                    [`${prefixCls}-disabled`]: this.currentPage === this.allPages
                }
            ];
        }
    },
    methods: {
        changePage (page) {
            if (this.currentPage !== page) {
                this.currentPage = page;
            }
        },
        fastPrev () {
            let page = this.currentPage - 5;
            if (page > 0) {
                this.changePage(page);
            } else {
                this.changePage(1);
            }
        },
        fastNext () {
            let page = this.currentPage + 5;
            if (page > this.allPages) {
                this.changePage(this.allPages);
            } else {
                this.changePage(page);
            }
        },
        prev () {
            if (this.currentPage <= 1) {
                return false;
            }
            this.changePage(this.currentPage - 1);
        },
        next () {
            if (this.currentPage >= this.allPages) {
                return false;
            }
            this.changePage(this.currentPage + 1);
        },
        onPage (page) {
            this.changePage(page);
        }
    }
};
</script>
