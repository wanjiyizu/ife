<template>
    <li>
        <div :class="elevatorClasses">
            跳至
            <input type="text" autocomplete="off" spellcheck="false" @keyup.enter="changePage" />
            页
        </div>
    </li>
</template>
<script>
const prefixCls = 'ife-page';
export default {
    name: 'PageOption',
    props: {
        current: Number,
        allPages: Number
    },
    computed: {
        elevatorClasses () {
            return [
                `${prefixCls}-options-elevator`
            ];
        }
    },
    methods: {
        changePage (event) {
            let val = event.target.value.trim();
            let page = 0;
            val = Number(val);
            if (val !== this.current) {
                let allPages = this.allPages;
                if (val > allPages) {
                    page = allPages;
                } else {
                    page = val;
                }
            }
            if (page) {
                this.$emit('on-page', page);
                event.target.value = page;
            }
        }
    }
};
</script>

