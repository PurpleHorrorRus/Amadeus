<template>
    <div id="modal-view-forward" class="modal-view">
        <span class="modal-view-title" v-text="'Переслать сообщение'" />

        <div id="modal-view-forward-list">
            <ForwardProfile
                v-for="id of order"
                :key="id"
                :profile="conversations[id].profile"
                @click.native="open(conversations[id])"
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
            // eslint-disable-next-line max-len
            conversations: state => ({ ...state.vk.conversations.pinned.conversations, ...state.vk.conversations.cache.conversations }),
            order: state => ([...state.vk.conversations.pinned.order, ...state.vk.conversations.cache.order]),
            current: state => state.vk.messages.current
        })
    },

    methods: {
        ...mapActions({
            unselectAll: "vk/messages/UNSELECT_ALL"
        }),

        open(conversation) {
            if (this.current.information.peer.id !== conversation.information.peer.id) {
                const { id, type } = conversation.information.peer;
                return this.$router.replace(`/messages/${id}?type=${type}&action=fwd`);
            }

            this.unselectAll(this.current.information.peer.id);
            return this.fire("forward");
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