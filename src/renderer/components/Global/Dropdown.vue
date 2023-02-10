<template>
    <div class="dropdown-item">
        <span v-if="text" class="dropdown-item-text" v-text="text" />
        <select class="dropdown-item-select" @change="change($event)">
            <option
                v-for="(option, index) of options"
                :key="option + '' + index"
                :selected="index === selected"
                v-text="option"
            />
        </select>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        text: {
            type: String,
            required: false,
            default: ""
        },

        options: {
            type: Array,
            required: true
        },

        selected: {
            type: Number,
            required: false,
            default: 0
        }
    },

    methods: {
        change(event) {
            this.$emit("change", event.target.selectedIndex);
        }
    }
};
</script>

<style lang="scss">
.dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    select {
        min-width: 60px;

        height: 25px;

        padding: 0px 10px;

        background-color: var(--field);

        color: var(--text);

        font-weight: 300;
        font-size: 12px;

        text-align: right;
        text-align-last: right;

        border: 1px solid #00000000;
        border-radius: 20px;

        outline: none;
        cursor: pointer;

        option {
            direction: rtl;

            background-color: var(--backdrop);
        }
    }
}
</style>