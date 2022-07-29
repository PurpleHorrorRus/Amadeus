import common from "~/plugins/common";

import ModalMixin from "~/mixins/modal";
import ScrollMixin from "~/mixins/scroll";

export default {
    data: () => ({
        hold: false as boolean,

        menu: {
            show: false,
            event: null,
            target: null,
            position: [0, 0],
            items: []
        }
    }),

    mixins: [ModalMixin, ScrollMixin],

    beforeDestroy() {
        this.closeEvents();
    },

    methods: {
        openMenu(event: any, target: any, atElement = false, hold = false) {
            this.windowEvents(this.closeMenu);

            if (this.menu.show && !hold) {
                this.closeMenu();
                if (atElement) return true;
            }

            return this.$nextTick(async () => {
                if (atElement) {
                    const { left, top } = event.target.getBoundingClientRect();
                    this.menu.position = [left, top];
                } else this.menu.position = [event.clientX, event.clientY];

                if (target) {
                    this.menu.target = target;
                    this.setMenuItems(target);
                } else this.setMenuItems();

                this.menu.show = true;

                if (hold) {
                    const menu = await this.awaitElement("menu");
                    menu.$el.onmousemove = event.target.onmousemove = () => this.handleMenu();
                    menu.$el.onmouseleave = event.target.onmouseleave = () => this.unhandleMenu();
                }
            });
        },

        handleMenu() {
            this.handle = true;
        },

        async unhandleMenu() {
            this.handle = false;
            await common.wait(400);
            return !this.handle && this.closeMenu();
        },

        closeMenu() {
            this.closeEvents();

            this.menu.show = false;
            this.menu.event = null;
            this.menu.target = null;
            this.menu.position = [0, 0];
            this.menu.items = [];

            return true;
        }
    }
};