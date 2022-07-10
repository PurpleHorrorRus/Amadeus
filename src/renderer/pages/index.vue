<template>
    <div id="index-page" class="page" />
</template>

<script>
import { ipcRenderer } from "electron";
import { mapActions } from "vuex";

export default {
    layout: "empty",

    created() {
        ipcRenderer.once("normal", async () => {
            const { config } = await ipcRenderer.invoke("config");

            if (!~config.vk.active || config.vk.accounts.length === 0) {
                this.$router.replace("/login").catch(() => {});
                ipcRenderer.send("dom-ready");
                return false;
            }

            const account = config.vk.accounts[config.vk.active];
            await this.setConfig(config);
            await this.auth(account);

            this.$router.replace("/general").catch(() => {});
            return true;
        });

        ipcRenderer.once("media", () => {
            this.$router.replace("/media").catch(() => {});
            return true;
        });

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

    background: #131313;
}
</style>