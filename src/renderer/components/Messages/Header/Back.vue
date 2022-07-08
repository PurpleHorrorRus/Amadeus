<template>
    <div id="messages-header-back" @click="back">
        <ArrowLeftIcon class="icon" />
    </div>
</template>

<script>
export default {
    components: {
        ArrowLeftIcon: () => import("~/assets/icons/arrow-left.svg")
    },

    methods: {
        back() {
            return this.$router.replace("/general").catch(() => {});
        }
    }
};
</script>

<style lang="scss">
#messages-header-back {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 20px;

    cursor: pointer;

    .icon {
        width: 14px;
    }
}
</style>