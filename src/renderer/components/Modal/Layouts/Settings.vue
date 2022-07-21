<template>
    <div id="modal-layout-settings" class="modal-layout">
        <SettingsNavigation />
        <Component :is="renderView" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        SettingsNavigation: () => import("~/components/Modal/Settings/Navigation.vue")
    },

    data: () => ({
        view: "general"
    }),

    computed: {
        renderView() {
            switch (this.view) {
                case "general": return () => import("~/components/Modal/Settings/Views/General.vue");
                case "appearance": return () => import("~/components/Modal/Settings/Views/Appearance.vue");
                case "accounts": return () => import("~/components/Modal/Settings/Views/Accounts.vue");
                case "about": return () => import("~/components/Modal/Settings/Views/About.vue");
            }

            return () => import("~/components/Modal/Settings/Views/General.vue");
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
    grid-template-columns: max-content 60vw;
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

        width: 50vw;
        min-height: 52vh;
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