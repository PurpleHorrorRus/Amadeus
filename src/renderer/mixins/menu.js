export default {
    data: () => ({
        menu: {
            show: false,
            position: [0, 0, 0, 0],
            target: null
        }
    }),

    methods: {
        openMenu(target, event, atCursor = true) {
            if (this.menu.show && !atCursor) {
                this.menu.show = false;
                return false;
            }

            this.menu.target = target;

            if (atCursor) {
                this.menu.position = [event.clientY, 0, 0, event.clientX];
            } else {
                const rect = event.target.getBoundingClientRect();
                this.menu.position = [rect.top + 25, 0, 0, rect.left];
            }
    
            this.menu.show = true;
            return true;
        },

        closeMenu() {
            this.menu.show = false;
            this.menu.position = [0, 0, 0, 0];
            this.menu.target = null;
        }
    }
};