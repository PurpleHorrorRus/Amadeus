<template>
    <div class="message-actions">
        <ReplyIcon 
            v-if="parent.conversation.information.can_write.allowed"
            class="icon vkgram" 
            @click="action('reply')" 
        />

        <StarIcon 
            class="icon vkgram star" 
            :class="starClass"
            @click="action('important')" 
        />
    </div>
</template>

<script>
export default {
    components: {
        ReplyIcon: () => import("~/assets/icons/reply.svg"),
        StarIcon: () => import("~/assets/icons/star.svg")
    },

    computed: {
        parent() {
            return this.$parent;
        },

        starClass() {
            return { 
                filled: this.parent.message.important 
            };
        }
    },

    methods: {
        action(name) {
            return this.parent.$emit("action", name);
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
            fill: var(--secondary);
        }
    }

    .star {
        stroke: var(--secondary);
        stroke-width: 2px;

        path {
            fill: none;
        }

        &.filled path {
            fill: var(--secondary);
        }
    }
}
</style>