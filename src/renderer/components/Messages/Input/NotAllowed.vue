<template>
    <div id="message-input-blocked">
        <span id="message-input-blocked-label" v-text="'Отправка сообщений заблокирована'" />
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
#message-input-blocked {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 70px;

    &-label {
        color: var(--small-text);
        font-size: 14px;
    }
}
</style>