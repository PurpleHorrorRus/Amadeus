<template>
    <div id="conversations-header-menu">
        <ExclamationRoundIcon 
            v-if="updater.available" 
            class="icon amadeus update-icon"
        />
        
        <DotsHorizontal 
            class="icon amadeus clickable" 
            @click="openMenu($event, null, true)" 
        />

        <ContextMenu 
            v-if="menu.show" 
            :menu="menu" 
            :margins="[0, 20]" 
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import MenuMixin from "~/mixins/menu";
import ModalMixin from "~/mixins/modal";

export default {
    components: {
        DotsHorizontal: () => import("~icons/dots-horizontal.svg"),
        ExclamationRoundIcon: () => import("~icons/exclamation-round.svg")
    },

    mixins: [MenuMixin, ModalMixin],
    
    computed: {
        ...mapState({
            updater: (state: any) => state.updater
        })
    },

    methods: {
        setMenuItems() {
            this.menu.items = [{
                id: "important",
                label: this.$strings.CONVERSATIONS.HEADER.MENU.IMPORTANT,
                function: () => this.$router.replace("/important").catch(() => {})
            },
            
            {
                id: "settings",
                label: this.$strings.CONVERSATIONS.HEADER.MENU.SETTINGS,
                function: () => this.open({ layout: "settings" })
            }, 
            
            {
                id: "update",
                show: this.updater.available,
                label: this.$i18n(this.$strings.CONVERSATIONS.HEADER.MENU.UPDATE, "version", this.updater.version),
                function: () => {
                    this.open({ view: "update" });
                }
            }];
        }
    }
};
</script>

<style lang="scss">
#conversations-header-menu {
    display: flex;
    justify-content: center;
    align-items: center;

    .update-icon {
        position: absolute;
        top: 2px; right: 2px;

        width: 16px;

        path {
            fill: var(--secondary);
        }
    }
}
</style>