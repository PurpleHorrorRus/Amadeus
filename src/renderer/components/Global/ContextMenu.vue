<template>
    <div
        ref="menu"
        v-scroll-outside="$parent.closeMenu"
        v-click-away="$parent.closeMenu"
        class="context-menu"
        :style="contextMenuStyle"
        @click="$parent.closeMenu"
    >
        <slot v-if="$slots.default" />

        <ContextMenuItem
            v-for="item of validItems"
            :key="item.id"
            :item="item"
            @select="action(item)"
        />
    </div>
</template>

<script lang="ts">
import ContextMenuItem from "~/components/Menu/Item.vue";

export default {
    components: {
        ContextMenuItem
    },

    props: {
        menu: {
            type: Object,
            required: true
        },

        margins: {
            type: Array,
            required: false,
            default: () => ([0, 0])
        }
    },

    data: () => ({
        position: [0, 0],
        margin: 5
    }),

    computed: {
        contextMenuStyle() {
            return {
                left: this.position[0] + "px",
                top: this.position[1] + "px"
            };
        },

        validItems() {
            return this.menu.items.filter(item => {
                return item.show === undefined || item.show;
            });
        }
    },

    mounted() {
        this.$nextTick(() => {
            const { width, height } = this.$refs.menu.getBoundingClientRect();
            this.position = [
                Math.min(
                    Math.max(this.margin, this.menu.position[0] + this.margins[0]),
                    window.innerWidth - width - this.margin
                ),

                Math.min(
                    Math.max(this.margin, this.menu.position[1] + this.margins[1]),
                    window.innerHeight - height - this.margin
                )
            ];
        });
    },

    methods: {
        action(item) {
            return item.function();
        }
    }
};
</script>

<style lang="scss">
.context-menu {
    position: fixed;

    padding: 5px;

    width: max-content;

    background: var(--backdrop);

    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 1px 7px rgb(0 0 0 / 25%), 0 6px 15px rgb(0 0 0 / 22%);

    z-index: 1001;
}
</style>