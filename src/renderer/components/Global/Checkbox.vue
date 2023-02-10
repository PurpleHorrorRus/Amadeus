<template>
    <div class="checkbox">
        <div class="checkbox-check" :class="checkClass" @click="switchCheck">
            <CheckIcon v-if="checked" class="icon" />
        </div>

        <span class="checkbox-label small-text" v-text="label" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        CheckIcon: () => import("~icons/check.svg")
    },

    props: {
        value: {
            type: Boolean,
            required: false,
            default: false
        },

        label: {
            type: String,
            required: false,
            default: ""
        }
    },

    data: () => ({
        checked: false
    }),

    computed: {
        checkClass() {
            return {
                checked: this.checked
            };
        }
    },

    created() {
        this.checked = this.value;
    },

    methods: {
        switchCheck() {
            this.checked = !this.checked;
            return this.$emit("switch", this.checked);
        }
    }
};
</script>

<style lang="scss">
.checkbox {
    display: grid;
    grid-template-columns: 15px 1fr;
    align-items: center;
    column-gap: 8px;

    &-check {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 15px;
        height: 15px;

        background-color: var(--icons);
        border-radius: 2px;

        transition: background .2s ease;

        &.checked {
            background-color: var(--secondary);
        }

        .icon {
            width: 10px;
        }
    }
}
</style>