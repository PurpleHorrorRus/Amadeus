<template>
    <div class="convermsation-message-typing nowrap">
        <PenIcon class="icon pen" />
        <span 
            class="convermsation-message-typing-text small-text nowrap" 
            v-text="text" 
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        PenIcon: () => import("~icons/pen.svg")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        text() {
            if (this.conversation.isUser || this.conversation.isGroup) {
                return this.$strings.CONVERSATIONS.TYPING.SINGLE;
            }

            if (this.conversation.writers.length > 1) {
                const names = this.conversation.writers.map(writer => {
                    return writer.first_name;
                });

                return this.$i18n(this.$strings.CONVERSATIONS.TYPING.MANY, "users", names.join(", "));
            }

            return `${this.conversation.writers[0].name} ${this.$strings.CONVERSATIONS.TYPING.SINGLE}`;
        }
    }
};
</script>

<style lang="scss">
@keyframes toRight {
    0% {
        left: 0px;
    }

    100% {
        left: 3px;
    }
}

.convermsation-message-typing {
    display: grid;
    grid-template-columns: 15px 1fr;
    align-items: center;
    column-gap: 5px;

    .icon {
        width: 14px;

        path {
            stroke: none;
            fill: var(--small-text);
        }

        &.pen {
            position: relative;

            animation: toRight .8s infinite;
        }
    }
}
</style>