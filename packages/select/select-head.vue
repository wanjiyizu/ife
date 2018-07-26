<template>
    <div>
        <div :class="singleDisplayClasses" v-show="singleDisplayValue">{{ singleDisplayValue }}</div>
    </div>
</template>
<script>
const prefixCls = 'ife-select';
export default {
    props: {
        placeholder: String,
        multiple: {
            type: Boolean,
            default: false
        },
        values: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        singleDisplayClasses () {
            return {
                [`${prefixCls}-placeholder`]: this.showPlaceholder
            };
        },
        singleDisplayValue () {
            if (this.multiple && this.values.length > 0) {
                return '';
            }
            let item = this.values[0];
            return item ? item.label : '';
        },
        showPlaceholder () {
            if (!this.multiple) {
                let value = this.values[0];
                if (typeof value === 'undefined' || String(value).trim() === '') {
                    return true;
                }
            } else {
                if (!this.values.length) {
                    return true;
                }
            }
            return false;
        }
    }
}
</script>

