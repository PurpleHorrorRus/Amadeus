<template>
    <div id="conversations-header">
        <SingleInput
            :placeholder="$strings.CONVERSATIONS.HEADER.SEARCH"
            @input="query = $event"
            @keydown.enter.native="search"
        />

        <HeaderAlerts @click.native="deepChange('vkService', config.vkService, 'notifications')" />
        <HeaderMenu />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    components: {
        HeaderAlerts: () => import("./Header/Alerts.vue"),
        HeaderMenu: () => import("./Header/Menu.vue")
    },

    mixins: [CoreMixin],

    data: () => ({
        query: ""
    }),

    methods: {
        search() {
            this.query = this.query.trim();
            if (this.query.length === 0) {
                return false;
            }

            return this.$router.replace(`/search?q=${this.query}`);
        }
    }
};
</script>

<style lang="scss">
#conversations-header {
    flex: 0 0 45px;

    display: grid;
    grid-template-columns: 1fr 30px 30px;
    align-items: center;
    column-gap: 5px;

    padding: 10px;

    .single-input {
        height: 30px;

        font-size: 12px;
    }
}
</style>