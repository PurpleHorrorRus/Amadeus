<template>
    <div
        ref="menu"
        v-click-away="$parent.closeMenu"
        v-scroll-outside="$parent.closeMenu" 
        class="context-menu" 
        :style="contextMenuStyle"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        position: {
            type: Array,
            required: false,
            default: () => ([0, 0, 0, 0])
        }
    },

    data: () => ({
        padding: 5,

        positioning: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    }),

    computed: {
        contextMenuStyle() {
            return {
                top: this.positioning.top + "px",
                right: this.positioning.right + "px",
                bottom: this.positioning.bottom + "px",
                left: this.positioning.left + "px"
            };
        }
    },

    watch: {
        position: function() { this.updatePosition(); }
    },

    mounted() {
        this.updatePosition();
        window.addEventListener("blur", this.$parent.closeMenu);
    },

    beforeDestroy() {
        window.removeEventListener("blur", this.$parent.closeMenu);
    },

    methods: {
        updatePosition() {
            const width = this.$refs.menu.clientWidth;
            const height = this.$refs.menu.clientHeight;

            const top = this.position[0] + height >= window.innerHeight
                ? window.innerHeight - height - this.padding
                : this.position[0] - this.padding;

            const left = this.position[3] + width >= window.innerWidth
                ? window.innerWidth - width - this.padding
                : this.position[3] - this.padding;

            this.positioning = {
                top,
                right: Math.max(this.position[1], this.padding),
                bottom: this.position[2],
                left
            };
        }
    }
};
</script>

<style lang="scss">
.context-menu {
    position: fixed;

    display: flex;
    flex-direction: column;
    row-gap: 5px;

    width: max-content;
    height: max-content;

    padding: 5px;

    background: var(--backdrop);
    border-radius: 4px;

    z-index: 1000;
}
</style>