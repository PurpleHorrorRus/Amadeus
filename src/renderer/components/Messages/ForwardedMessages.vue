<template>
    <div class="message-content-forwarded-messages">
        <ForwardedMessage 
            v-for="message of messages"
            :key="message.id"
            :message="message"
        />
    </div>
</template>

<script>
export default {
    components: {
        ForwardedMessage: () => import("~/components/Messages/ForwardedMessage")
    },

    props: {
        messages: {
            type: Array,
            required: true
        }
    }
};
</script>

<style lang="scss">
.message-content-forwarded-messages {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}
</style>