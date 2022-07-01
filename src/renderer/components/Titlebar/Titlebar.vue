<template>
    <div id="titlebar">
        <span id="titlebar-title" v-text="'VKGram'" />
    </div>
</template>

<script>
export default {

};
</script>

<style lang="scss">
#titlebar {
    -webkit-app-region: drag;
    grid-area: titlebar;

    display: flex;
    align-items: center;

    width: 100%;
    height: 100%;

    background: #131313;
    border-bottom: 1px solid #343434;

    z-index: 999;

    &-title {
        padding-left: 20px;

        font-size: 11px;
        font-weight: bold;
    }
}
</style>