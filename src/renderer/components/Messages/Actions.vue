<template>
    <div class="message-actions">
        <ReplyIcon class="icon vkgram" @click="action('reply')" />
    </div>
</template>

<script>
export default {
    components: {
        ReplyIcon: () => import("~/assets/icons/reply.svg")
    },

    methods: {
        action(name) {
            return this.$parent.$emit("action", name);
        }
    }
};
</script>

<style lang="scss">
.message-actions {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    opacity: 0;

    transition: opacity .1s ease-in-out;

    .icon {
        width: 14px;

        cursor: pointer;

        path {
            fill: var(--secondary);
        }
    }
}
</style>