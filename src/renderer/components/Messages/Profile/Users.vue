<template>
    <div id="profile-users">
        <div id="profile-users-list">
            <ChatUser
                v-for="user of conversation.users"
                :key="user.id"
                :profile="user"
            />

            <div id="profile-users-list-add">
                <AddIcon class="icon amadeus clickable" @click="add" />
                <span
                    id="profile-users-list-add-label"
                    v-text="$strings.CHAT.PROFILE.ADD_USER"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";
import ModalMixin from "~/mixins/modal";

export default {
    components: {
        ChatUser: () => import("./Users/ChatUser.vue"),
        AddIcon: () => import("~icons/add.svg")
    },

    mixins: [CoreMixin, ModalMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        isAdmin() {
            return this.conversation.profile.admin_id === this.user.id;
        }
    },

    methods: {
        add() {
            this.open({
                view: "choose-user",
                title: this.$strings.MENU.CHOOSE_USER,

                function: conversation => {
                    this.client.api.messages.addChatUser({
                        chat_id: this.current.local_id,
                        user_id: conversation.id
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss">
#profile-users {
    border-bottom: 1px solid var(--border);

    &-list {
        display: flex;
        flex-direction: column;
        row-gap: 5px;

        padding: 0px 0px 10px 0px;

        &-add {
            display: flex;
            flex-direction: row;
            align-items: center;
            column-gap: 20px;

            margin-left: 8px;

            padding: 5px;

            .icon {
                width: 14px;
            }

            &-label {
                font-size: 14px;
            }
        }
    }
}
</style>