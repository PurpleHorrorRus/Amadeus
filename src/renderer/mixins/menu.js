const menuDefaults = {
    show: false,
    position: [0, 0, 0, 0],
    target: null
};

export default {
    data: () => ({
        menu: { ...menuDefaults }
    }),

    methods: {
        async openMenu(target, event, atCursor = true) {
            if (this.menu.show) {
                this.closeMenu();
                if (!atCursor) return false;
            }
            
            return this.$nextTick(() => {
                this.menu.target = target;

                if (atCursor) {
                    this.menu.position = [event.clientY, 0, 0, event.clientX];
                } else {
                    const rect = event.target.getBoundingClientRect();
                    this.menu.position = [rect.top + 25, 0, 0, rect.left];
                }
        
                this.menu.show = true;
            });
        },

        closeMenu() {
            this.menu = { ...menuDefaults };
        }
    }
};