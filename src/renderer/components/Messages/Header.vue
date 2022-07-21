<template>
    <div id="messages-header">
        <div id="messages-header-main">
            <MessagesHeaderBack v-if="!extended" />

            <div id="messages-header-main-profile" @click="$parent.turnProfile">
                <img id="messages-header-main-profile-avatar" :src="conversation.avatar">
                <MessagesHeaderInformation :conversation="conversation" />
            </div>
        </div>

        <MessagesHeaderActions 
            v-if="isSelectedMessages" 
            :messages="$parent.chat.messages"
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

export default {
    components: {
        MessagesHeaderBack: () => import("./Header/Back.vue"),
        MessagesHeaderInformation: () => import("./Header/Information.vue"),
        MessagesHeaderActions: () => import("./Header/Actions.vue")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapState({
            extended: (state: any) => state.extendedView
        }),

        isSelectedMessages() {
            return this.$parent.chat.messages.some(message => {
                return message.selected;
            });
        }
    }
};
</script>

<style lang="scss">
#messages-header {
    grid-area: header;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    column-gap: 5px;
    flex-wrap: nowrap;

    padding: 0px 10px;

    > * {
        cursor: pointer;
    }

    &-main {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 5px;

        &-profile {
            display: flex;
            align-items: center;
            column-gap: 10px;

            &-avatar {
                width: 30px;
                height: 30px;
        
                border-radius: 100%;
            }
        }
    }
}
</style>