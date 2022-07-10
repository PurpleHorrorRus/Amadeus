<template>
    <div id="modal-view-forward" class="modal-view">
        <span class="modal-view-title" v-text="'Переслать сообщение'" />

        <div id="modal-view-forward-list">
            <ForwardProfile
                v-for="conversation of conversations"
                :key="conversation.id"
                :profile="conversation.profile"
                @click.native="open(conversation)"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import ModalMixin from "~/mixins/modal";

export default {
    components: {
        ForwardProfile: () => import("~/components/Modal/Views/Forward/Profile")
    },

    mixins: [ModalMixin],

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.cache,
            current: state => state.vk.messages.current
        })
    },

    methods: {
        ...mapActions({
            addForwardModal: "input/ADD_FORWARD_MODAL",
            unselectAll: "vk/messages/UNSELECT_ALL"
        }),

        open(conversation) {
            this.addForwardModal();

            if (this.current.id !== conversation.id) {
                const { id, type } = conversation.information.peer;
                return this.$router.replace(`/messages/${id}?type=${type}`);
            }

            return this.unselectAll(this.current.id);
        }
    }
};
</script>

<style lang="scss">
#modal-view-forward {
    width: 400px;
    max-height: 60vh;

    &-list {
        display: flex;
        flex-direction: column;
        row-gap: 5px;

        padding: 5px;

        overflow-y: auto;
    }
}
</style>