<template>
    <div id="index-page" class="page" />
</template>

<script>
import { ipcRenderer } from "electron";
import { mapActions } from "vuex";

export default {
    created() {
        ipcRenderer.once("normal", async () => {
            const { config } = await ipcRenderer.invoke("config");
        
            if (!config.vk.token || !config.vk.user) {
                this.$router.replace("/login").catch(() => {});
                ipcRenderer.send("dom-ready");
                return false;
            }
            
            this.setConfig(config);
            await this.auth();

            this.$router.replace("/conversations").catch(() => {});
            return true;
        });

        ipcRenderer.once("media", () => {
            this.$router.replace("/media").catch(() => {});
            return true;
        });
    },

    mounted() {
        ipcRenderer.send("dom-ready");
    },
    
    methods: {
        ...mapActions({
            setConfig: "SET_CONFIG",

            auth: "vk/AUTH"
        })
    }
};
</script>

<style lang="scss">
#index-page {
    grid-area: page;
}
</style>