<template>
    <div class="settings-navigation-item" :class="settingsNavigationItemClass">
        <Component :is="item.icon" class="icon" />
        <span
            v-if="extended"
            class="settings-navigation-item-label nowrap"
            v-text="item.label"
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

export default {
    props: {
        item: {
            type: Object,
            required: true
        },

        active: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        ...mapState({
            extended: (state: any) => state.extendedView
        }),

        settingsNavigationItemClass() {
            return {
                active: this.active
            };
        }
    }
};
</script>

<style lang="scss">
.settings-navigation-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 10px;

    width: 100%;

    padding: 5px;

    border-radius: 4px;

    cursor: pointer;
    transition: background .1s ease-in-out;

    &:hover {
        background: var(--item-hover);
    }

    &.active {
        background: var(--item-hover);
    }

    .icon {
        width: 24px;

        path {
            fill: var(--secondary);
            stroke: none;
        }
    }
}
</style>