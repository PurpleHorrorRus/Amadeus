<template>
    <div id="modal-window" @mousedown.self="close">
        <SettingsLayout />
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    components: {
        SettingsLayout: () => import("~/components/Modal/Layouts/Settings")
    },

    methods: {
        ...mapActions({
            close: "modal/CLOSE"
        })
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
    align-items: center;

    background: #ffffff30;

    z-index: 999;

    .modal-layout {
        width: max-content;
        height: max-content;

        background: var(--backdrop);
        border-radius: 8px;
    }
}
</style>