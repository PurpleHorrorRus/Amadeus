<template>
    <div id="message-input-blocked">
        <span
            id="message-input-blocked-label"
            v-text="$strings.CHAT.BLOCKED"
        />
    </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss">
#message-input-blocked {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 62px;

    background-color: var(--primary);

    z-index: 1;

    &-label {
        color: var(--small-text);
        font-size: 14px;
    }
}
</style>