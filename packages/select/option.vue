<template>
    <li>
        <slot>{{ showLabel }}</slot>
    </li>
</template>
<script>
export default {
    props: {
        value: {
            type: [String, Number],
            required: true
        },
        label: {
            type: [String, Number]
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showLabel () {
            return this.label ? this.label : this.value;
        }
    }
}
</script>

