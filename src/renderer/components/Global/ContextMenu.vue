<template>
    <div 
        ref="menu" 
        v-scroll-outside="$parent.closeMenu" 
        v-click-away="$parent.closeMenu" 
        class="context-menu"
        :style="contextMenuStyle"
        @click="$parent.closeMenu"
    >
        <ContextMenuItem 
            v-for="item of validItems"
            :key="item.id"
            :item="item"
            @select="action(item)"
        />
    </div>
</template>

<script>
export default {
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
                left: this.position[0] + this.margins[0] + "px",
                top: this.position[1] + this.margins[1] + "px"
            };
        },

        validItems() {
            return this.menu.items.filter(item => {
                return item.show === undefined || item.show;
            });
        }
    },

    mounted() {
        const { width, height } = this.$refs.menu.getBoundingClientRect();

        this.position = [
            Math.max(Math.min(this.menu.position[0] - width, window.innerWidth), this.margin),
            Math.min(this.menu.position[1] - height, window.innerHeight)
        ];
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
    border-radius: 8px;;

    z-index: 1001;
}
</style>