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
            this.menu.target = target;

            if (atCursor) {
                this.menu.position = [event.clientY, 0, 0, event.clientX];
            }
    
            this.menu.show = true;
        },

        closeMenu() {
            this.menu.show = false;
            this.menu.position = [0, 0, 0, 0];
            this.menu.target = null;
        }
    }
};