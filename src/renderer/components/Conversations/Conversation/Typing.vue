<template>
    <div class="convermsation-message-typing nowrap">
        <PenIcon class="icon pen" />
        <span 
            class="convermsation-message-typing-text small-text nowrap" 
            v-text="text" 
        />
    </div>
</template>

<script>
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
                return "набирает сообщение";
            }

            if (this.conversation.writers.length > 1) {
                const names = this.conversation.writers.map(writer => writer.first_name);
                return names.join(", ") + " набирают сообщение";
            }

            return this.conversation.writers[0].name + " набирает сообщение";
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