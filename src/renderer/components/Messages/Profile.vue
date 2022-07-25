<template>
    <div id="chat-page-viewport-profile">
        <ProfileInformation :conversation="conversation" />
        <ProfileUsers v-if="conversation.isChat" :conversation="conversation" />
        <ProfileAttachments :conversation="conversation" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        ProfileInformation: () => import("~/components/Messages/Profile/Information.vue"),
        ProfileUsers: () => import("~/components/Messages/Profile/Users.vue"),
        ProfileAttachments: () => import("~/components/Messages/Profile/Attachments.vue")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
#chat-page-viewport-profile {
    position: absolute;
    top: 0px; right: 0px;

    display: flex;
    flex-direction: column;
    row-gap: 20px;

    width: 80%;
    max-width: 350px;
    height: 100%;

    padding: 10px;

    background: var(--primary);
    border-left: 1px solid var(--border);

    overflow-y: overlay;
}
</style>