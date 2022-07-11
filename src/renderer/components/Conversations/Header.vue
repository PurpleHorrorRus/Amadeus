<template>
    <div id="conversations-header">
        <SingleInput 
            placeholder="Поиск" 
            @input="query = $event" 
            @keydown.enter.native="search"
        />

        <div 
            id="conversations-header-mute"
            @click="deepChange(settings.vk, 'disable_notifications')"
        >
            <AlertIcon 
                v-if="!settings.vk.disable_notifications"
                v-tooltip.left="'Уведомления включены'"
                class="icon vkgram clickable"
            />

            <AlertOffIcon 
                v-else
                v-tooltip.left="'Уведомления отключены'"
                class="icon vkgram clickable"
            />
        </div>

        <DotsHorizontal 
            class="icon vkgram clickable" 
            @click="openMenu(null, $event, false)" 
        />

        <ContextMenu v-if="menu.show" :position="menu.position" @click.native="closeMenu">
            <ContextMenuItem label="Важные сообщения" @select="openImportant" />
            <ContextMenuItem label="Настройки" @select="openSettings" />
        </ContextMenu>
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";
import ModalMixin from "~/mixins/modal";
import MenuMixin from "~/mixins/menu";

export default {
    components: {
        AlertIcon: () => import("~/assets/icons/alert.svg"),
        AlertOffIcon: () => import("~/assets/icons/alert-off.svg"),
        DotsHorizontal: () => import("~/assets/icons/dots-horizontal.svg")
    },

    mixins: [CoreMixin, ModalMixin, MenuMixin],

    data: () => ({
        query: ""
    }),

    methods: {
        openImportant() {
            return this.$router.replace("/important").catch(() => {});
        },

        openSettings() {
            return this.open({
                layout: "settings"                
            });
        },

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
    display: grid;
    grid-template-columns: 1fr 30px 30px;
    align-items: center;
    column-gap: 10px;

    padding: 5px;

    &-mute {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .single-input {
        height: 30px;

        font-size: 12px;
    }
}
</style>