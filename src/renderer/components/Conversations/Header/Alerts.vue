<template>
    <div id="conversations-header-alerts">
        <AlertIcon 
            v-if="!$parent.settings.vk.disable_notifications"
            v-tooltip.bottom="'Уведомления включены'"
            class="icon amadeus clickable"
        />

        <AlertOffIcon 
            v-else
            v-tooltip.bottom="'Уведомления отключены'"
            class="icon amadeus clickable"
        />
    </div>
</template>

<script>
export default {
    components: {
        AlertIcon: () => import("~icons/alert.svg"),
        AlertOffIcon: () => import("~icons/alert-off.svg")
    }
};
</script>

<style>
#conversations-header-alerts {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>