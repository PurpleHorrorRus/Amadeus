<template>
    <div id="messages-header" :class="headerClass">
        <div id="messages-header-main" class="nowrap" :class="mainClass">
            <MessagesHeaderBack v-if="!extended" />

            <div id="messages-header-main-profile" class="nowrap" @click="$parent.turnProfile">
                <img id="messages-header-main-profile-avatar" :src="conversation.avatar">
                <MessagesHeaderInformation :conversation="conversation" />
            </div>
        </div>

        <MessagesHeaderActions
            v-if="selectedMessages.length > 0"
            :messages="selectedMessages"
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

        headerClass() {
            return {
                selected: this.isSelectedMessages
            };
        },

        mainClass() {
            return {
                extended: this.extended
            };
        },

        selectedMessages() {
            return this.$parent.chat.messages.filter(message => {
                return message.selected;
            });
        }
    }
};
</script>

<style lang="scss">
#messages-header {
    grid-area: header;

    display: grid;
    grid-template-columns: 1fr max-content;
    grid-template-areas: "main actions";
    align-items: center;
    column-gap: 5px;
    flex-wrap: nowrap;

    height: 100%;

    background: var(--primary);

    z-index: 1;

    &-main {
        grid-area: main;

        display: flex;
        align-items: center;

        width: 100%;
        height: 100%;

        &-profile {
            display: flex;
            align-items: center;
            column-gap: 10px;

            cursor: pointer;

            &-avatar {
                width: 30px;
                height: 30px;

                border-radius: 100%;
            }
        }

        #messages-header-back {
            padding: 0px 5px 0px 10px;
        }
    }
}
</style>