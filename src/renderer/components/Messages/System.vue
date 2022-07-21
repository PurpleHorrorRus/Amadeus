<template>
    <div v-if="action.length > 0" class="message-system nowrap">
        <span class="message-system-invited nowrap" v-text="action[0]" />
        <span class="message-system-text nowrap" v-text="action[1]" />
        <span class="message-system-new nowrap" v-text="action[2]" />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    props: {
        message: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        action: []
    }),

    async created() {
        this.action = await this.getActionMessage(this.message);
    },

    methods: {
        ...mapActions({
            getActionMessage: "vk/GET_ACTION_MESSAGE"
        })
    }
};
</script>

<style lang="scss">
.message-system {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    column-gap: 3px;

    padding: 5px 10px;

    background: var(--item);
    border-radius: 16px;

    span {
        font-size: 14px;

        user-select: text;
    }
}
</style>