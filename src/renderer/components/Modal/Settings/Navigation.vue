<template>
    <div id="settings-navigation">
        <NavigationItem 
            v-for="item of items"
            :key="item.id"
            :item="item"
            :active="item.id === $parent.view"
            @click.native="$parent.nav(item.id)"
        />
    </div>
</template>

<script>
export default {
    components: {
        NavigationItem: () => import("~/components/Modal/Settings/Navigation/Item")
    },

    data: () => ({
        items: []
    }),

    created() {
        this.items = [
            {
                id: "general",
                label: this.$strings.SETTINGS.NAVIGATION.GENERAL,
                icon: () => import("~icons/settings.svg")
            },

            {
                id: "appearance",
                label: this.$strings.SETTINGS.NAVIGATION.APPEARANCE,
                icon: () => import("~icons/color.svg")
            },

            {
                id: "accounts",
                label: this.$strings.SETTINGS.NAVIGATION.ACCOUNTS,
                icon: () => import("~icons/person.svg")
            }
        ];
    }
};
</script>

<style lang="scss">
#settings-navigation {
    grid-area: navigation;

    display: flex;
    flex-direction: column;
    row-gap: 5px;

    width: max-content;

    padding: 10px;

    border-right: 1px solid var(--border);
}
</style>