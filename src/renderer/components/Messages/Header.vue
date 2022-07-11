<template>
    <div id="messages-header">
        <div id="messages-header-main">
            <MessagesHeaderBack v-if="!extended" />

            <div id="messages-header-main-profile">
                <img id="messages-header-main-profile-avatar" :src="conversation.profile.photo_100">
                <MessagesHeaderInformation :conversation="conversation" />
            </div>
        </div>
        
        <div id="messages-header-profile-actions">
            <ForwardIcon 
                v-if="isSelectedMessages" 
                class="icon vkgram clickable" 
                @click="forwardMessages" 
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    components: {
        MessagesHeaderBack: () => import("~/components/Messages/Header/Back"),
        MessagesHeaderInformation: () => import("~/components/Messages/Header/Information"),
    
        ForwardIcon: () => import("~/assets/icons/forward.svg")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapState({
            extended: state => state.extendedView
        }),

        isSelectedMessages() {
            return this.$parent.chat.messages.some(message => {
                return message.selected;
            });
        }
    },

    methods: {
        forwardMessages() {
            const fwd_messages = this.$parent.chat.messages.filter(message => {
                return message.selected;
            });

            this.open({
                view: "forward",
                target: [...fwd_messages]
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