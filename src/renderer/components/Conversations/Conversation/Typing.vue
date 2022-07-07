<template>
    <div class="convermsation-message-typing nowrap">
        <PenIcon class="icon pen" />
        <span 
            class="convermsation-message-typing-text small-text nowrap" 
            v-text="'набирает сообщение...'" 
        />
    </div>
</template>

<script>
export default {
    components: {
        PenIcon: () => import("~/assets/icons/pen.svg")
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