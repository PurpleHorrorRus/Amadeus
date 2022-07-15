<template>
    <div id="modal-view-add" class="modal-view">
        <span class="modal-view-title" v-text="modal.title" />

        <div id="modal-view-add-list">
            <ForwardProfile
                v-for="conversation of conversations"
                :key="conversation.id"
                :conversation="conversation"
                @click.native="modal.function(conversation)"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

import ModalMixin from "~/mixins/modal";

export default {
    components: {
        ForwardProfile: () => import("~/components/Modal/Views/Forward/Profile")
    },

    mixins: [ModalMixin],

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.cache
        })
    }
};
</script>

<style lang="scss">
#modal-view-add {
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