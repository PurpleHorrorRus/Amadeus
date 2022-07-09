<template>
    <div id="messages-header">
        <div id="message-header-main">
            <MessagesHeaderBack v-if="!extended" />

            <div id="messages-header-main-profile">
                <img id="messages-header-main-profile-avatar" :src="conversation.profile.photo_100">
                <MessagesHeaderInformation :profile="conversation.profile" />
            </div>
        </div>
        
        <div id="message-header-profile-actions">
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

import ModalMixin from "~/mixins/modal";

export default {
    components: {
        MessagesHeaderBack: () => import("~/components/Messages/Header/Back"),
        MessagesHeaderInformation: () => import("~/components/Messages/Header/Information"),
    
        ForwardIcon: () => import("~/assets/icons/forward.svg")
    },

    mixins: [ModalMixin],

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

            console.log(fwd_messages);

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
    column-gap: 5px;

    padding: 0px 10px;

    > * {
        cursor: pointer;
    }

    &-main {
        display: flex;
        flex-direction: row;
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