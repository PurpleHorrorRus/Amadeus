<template>
    <div id="index-page">
        <span class="index-page-label">123</span>
    </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
    async created() {
        const { config } = await ipcRenderer.invoke("config");
        
        if (!config.vk.token) {
            this.$router.replace("/login").catch(() => {});
            return false;
        }

        return true;
    },

    mounted() {
        ipcRenderer.send("dom-ready");
    }
};
</script>

<style lang="scss">
#index-page {
    grid-area: page;
}
</style>