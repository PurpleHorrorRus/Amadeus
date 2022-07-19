<template>
    <div class="message-actions">
        <ReplyIcon 
            v-if="canReply"
            class="icon vkgram" 
            @click.stop="action('reply')" 
        />

        <StarIcon 
            class="icon vkgram star" 
            :class="starClass"
            @click.stop="action('important')" 
        />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";
import ActionsMixin from "~/mixins/actions";

export default {
    components: {
        ReplyIcon: () => import("~icons/reply.svg"),
        StarIcon: () => import("~icons/star.svg")
    },

    mixins: [CoreMixin, ActionsMixin],

    inject: ["message"],

    computed: {
        starClass() {
            return { 
                filled: this.message.important 
            };
        },

        canReply() {
            return this.current.information.can_write.allowed;
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