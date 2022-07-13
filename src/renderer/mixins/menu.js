export default {
    data: () => ({
        menu: { 
            show: false,
            event: null,
            target: null,
            position: [0, 0],
            items: []
        }
    }),

    mounted() {
        window.addEventListener("blur", this.closeMenu);
    },

    beforeDestroy() {
        window.removeEventListener("blur", this.closeMenu);
    },

    methods: {
        openMenu(event, target, atElement = false) {
            if (this.menu.show) {
                this.closeMenu();
                if (atElement) return true;
            }

            return this.$nextTick(() => {
                if (atElement) {
                    const { left, top } = event.target.getBoundingClientRect();
                    this.menu.position = [left, top];
                } else this.menu.position = [event.clientX, event.clientY];

                if (target) {
                    this.menu.target = target;
                    this.setMenuItems(target);
                } else this.setMenuItems();

                this.menu.show = true;
            });
        },

        closeMenu() {
            this.menu.show = false;
            this.menu.event = null;
            this.menu.target = null;
            this.menu.position = [0, 0];
            this.menu.items = [];

            return true;
        }
    }
};