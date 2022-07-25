<template>
    <div id="conversations-header-alerts">
        <AlertIcon
            v-if="!$parent.settings.vk.disable_notifications"
            v-tooltip.left="$strings.TOOLTIP.NOTIFICATIONS.ENABLED"
            class="icon amadeus clickable"
        />

        <AlertOffIcon
            v-else
            v-tooltip.left="$strings.TOOLTIP.NOTIFICATIONS.DISABLED"
            class="icon amadeus clickable"
        />
    </div>
</template>

<script lang="ts">
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