<template>
    <div class="selectable-item" @click.self="attach">
        <div class="selectable-item-select" :class="selectClass" @click.stop="select">
            <CheckIcon v-if="item.selected" class="icon" />
        </div>

        <Component
            :is="component"
            :item="item.attachment"
            :canQuickPlay="false"
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    components: {
        CheckIcon: () => import("~icons/check.svg")
    },

    props: {
        component: {
            type: [Function, Object],
            required: true
        },

        item: {
            type: Object,
            required: true
        }
    },

    computed: {
        selectClass() {
            return {
                selected: this.item.selected
            };
        }
    },

    methods: {
        ...mapActions({
            addAttachment: "input/ADD_ATTACHMENT",
            close: "modal/CLOSE"
        }),

        attach(event) {
            if (event.ctrlKey) return this.select();

            this.addAttachment(this.item.attachment);
            return this.close();
        },

        select() {
            this.$emit("select", this.item.selected);
        }
    }
};
</script>

<style lang="scss">
.selectable-item {
    position: relative;

    width: 13vw;
    height: 13vw;

    object-fit: cover;

    cursor: pointer;

    z-index: 1;

    &-select {
        position: absolute;
        top: 5px; right: 5px;
        width: 20px; height: 20px;

        display: flex;
        justify-content: center;
        align-items: center;

        border: 2px solid #ffffff;
        border-radius: 100%;

        z-index: 2;

        &.selected {
            background-color: var(--secondary);
        }

        .icon {
            width: 10px;
        }
    }

    .attachments-item {
        pointer-events: none;

        .attachments-item-video-preview {
            height: 100%;
        }
    }
}
</style>