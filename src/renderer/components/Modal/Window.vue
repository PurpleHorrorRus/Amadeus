<template>
    <div id="modal-window" @mousedown.self="close">
        <Component 
            :is="renderLayout" 
            :view="modal.view" 
        />
    </div>
</template>

<script>
import ModalMixin from "~/mixins/modal";

export default {
    mixins: [ModalMixin],

    computed: {
        renderLayout() {
            switch (this.modal.layout) {
                case "settings": return () => import("~/components/Modal/Layouts/Settings");
            }

            return () => import("~/components/Modal/Layouts/Default");
        }
    }
};
</script>

<style lang="scss">
#modal-window {
    position: absolute;
    top: 0px; left: 0px;
    width: 100%; height: 100%;

    display: flex;
    justify-content: center;
    align-items: flex-start;

    padding: 15px 0px;

    background: #2c2c2cb6;

    z-index: 999;

    .modal-layout {
        width: max-content;
        height: max-content;

        background: var(--backdrop);
        border-radius: 8px;

        .modal-view {
            display: flex;
            flex-direction: column;
            row-gap: 5px;

            &-title {
                margin: 5px;

                font-size: 14px;
            }
        }
    }
}
</style>