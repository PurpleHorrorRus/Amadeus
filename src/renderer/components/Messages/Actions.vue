<template>
    <div class="message-actions">
        <ReplyIcon 
            v-if="canReply"
            class="icon vkgram" 
            @click.prevent="action('reply')" 
        />

        <StarIcon 
            class="icon vkgram star" 
            :class="starClass"
            @click.prevent="action('important')" 
        />
    </div>
</template>

<script>
export default {
    components: {
        ReplyIcon: () => import("~/assets/icons/reply.svg"),
        StarIcon: () => import("~/assets/icons/star.svg")
    },

    inject: ["provideData", "message"],

    computed: {
        starClass() {
            return { 
                filled: this.message.important 
            };
        },

        canReply() {
            return this.provideData.conversation.information.can_write.allowed;
        }
    },

    methods: {
        action(name) {
            return this.$parent.$parent.$parent.action(name, this.message);
        }
    }
};
</script>

<style lang="scss">
.message-actions {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    column-gap: 5px;

    opacity: 0;

    transition: opacity .1s ease-in-out;

    .icon {
        width: 18px;

        cursor: pointer;

        path {
            fill: var(--message-bg);
        }
    }

    .star {
        stroke: var(--message-bg);
        stroke-width: 2px;

        path {
            fill: none;
        }

        &.filled path {
            fill: var(--message-bg);
        }
    }
}
</style>