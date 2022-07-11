<template>
    <div id="modal-layout-default" class="modal-layout">
        <Component :is="renderView" />
    </div>
</template>

<script>
export default {
    props: {
        view: {
            type: String,
            required: true
        }
    },

    computed: {
        renderView() {
            switch(this.view) {
                case "choose-user": return () => import("~/components/Modal/Views/ChooseUser");
                case "confirmation": return () => import("~/components/Modal/Views/Confirmation");
            }

            return null;
        }
    }
};
</script>

<style lang="scss">
#modal-layout-default {
    padding: 10px;
}
</style>