<template>
    <div id="index-page" class="page" />
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { mapActions } from "vuex";

import ModalMixin from "~/mixins/modal";

export default {
    mixins: [ModalMixin],

    layout: "empty",

    async created() {
        ipcRenderer.once("normal", async () => {
            const data = await ipcRenderer.invoke("config");

            if (!~data.config.vk.active || data.config.vk.accounts.length === 0) {
                this.$router.replace("/login").catch(() => {});
                ipcRenderer.send("dom-ready");
                return false;
            }

            await this.setConfig(data);

            const account = data.config.vk.accounts[data.config.vk.active];
            await this.auth(account);

            this.ipc();
            this.registerUpdater();

            this.$router.replace("/general").catch(() => {});
            return true;
        });

        ipcRenderer.once("media", () => {
            this.$router.replace("/media").catch(() => {});
            return true;
        });

        await this.loadLanguage("ru");
        ipcRenderer.send("dom-ready");
    },
    
    methods: {
        ...mapActions({
            setConfig: "SET_CONFIG",
            loadLanguage: "i18n/LOAD",

            auth: "vk/AUTH",
            ipc: "ipc/REGISTER"
        }),

        registerUpdater() {
            if (process.platform !== "win32") {
                return false;
            }

            ipcRenderer.send("register-updater");
        }
    }
};
</script>

<style lang="scss">
#index-page {
    grid-area: page;

    background: #131313;
}
</style>