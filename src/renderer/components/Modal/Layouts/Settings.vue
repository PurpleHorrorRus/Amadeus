<template>
    <div id="modal-layout-settings" class="modal-layout">
        <SettingsNavigation />
        <Component :is="renderView" />
    </div>
</template>

<script>
export default {
    components: {
        SettingsNavigation: () => import("~/components/Modal/Settings/Navigation")
    },

    data: () => ({
        view: "general"
    }),

    computed: {
        renderView() {
            switch(this.view) {
                case "general": return () => import("~/components/Modal/Settings/Views/General");
                case "appearance": return () => import("~/components/Modal/Settings/Views/Appearance");
            }

            return () => import("~/components/Modal/Settings/Views/General");
        }
    },

    methods: {
        nav(id) {
            if (id === this.view) {
                return false;
            }

            this.view = id;
            return true;
        }
    }
};
</script>

<style lang="scss">
.layout:not(.extended) {
    #modal-layout-settings .settings-view {
        width: 80vw;
    }
}

#modal-layout-settings {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "navigation view";
    column-gap: 10px;

    span {
        font-size: 12px;
    }
    
    .settings-view {
        grid-area: view;

        display: flex;
        flex-direction: column;
        row-gap: 10px;

        width: 40vw;
        max-height: 90vh;

        padding: 10px;

        &-category {
            display: flex;
            flex-direction: column;
            row-gap: 10px;

            padding: 10px 0px;

            border-bottom: 1px solid var(--border);
        }
    }
}
</style>