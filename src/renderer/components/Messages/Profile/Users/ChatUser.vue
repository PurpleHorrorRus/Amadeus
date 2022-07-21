<template>
    <div class="chat-user">
        <img :src="profile.photo_100" class="chat-user-avatar">
        <span class="chat-user-name nowrap" v-text="profile.name" />

        <MoreHorizontalIcon 
            v-if="showActions" 
            class="icon amadeus clickable" 
            @click="openMenu($event, profile)" 
        />

        <ContextMenu v-if="menu.show" :menu="menu" />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import ProfileMixin from "~/mixins/profile";
import MenuMixin from "~/mixins/menu";
import ModalMixin from "~/mixins/modal";

export default {
    components: {
        MoreHorizontalIcon: () => import("~icons/more-horizontal.svg")
    },

    mixins: [CoreMixin, ProfileMixin, MenuMixin, ModalMixin],

    props: {
        profile: {
            type: Object,
            required: true
        }
    },

    computed: {
        showActions() {
            return this.$parent.isAdmin
                && this.profile.id !== this.user.id;
        }
    },

    methods: {
        ...mapActions({
            removeUser: "vk/conversations/REMOVE_USER"
        }),

        setMenuItems(profile) {
            this.menu.items = [{
                id: "kick",
                label: this.$strings.MENU.KICK_USER,

                function: () => {
                    this.confirmation({
                        text: this.$i18n(this.$strings.MENU.CONFIRMATION.KICK_USER, "name", profile.name),

                        accept: () => {
                            this.client.api.messages.removeChatUser({
                                chat_id: this.$parent.conversation.local_id,
                                user_id: profile.id
                            });
                        }
                    });
                }
            }];
        }
    }
};
</script>

<style lang="scss">
.chat-user {
    display: grid;
    grid-template-columns: 30px 1fr 20px;
    align-items: center;
    column-gap: 10px;

    padding: 5px;

    &-avatar {
        width: 30px;
        height: 30px;

        border-radius: 100%;
    }

    &-name {
        font-size: 14px;
    }
}
</style>