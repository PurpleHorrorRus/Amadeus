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
            const data = await this.$ipc.invoke("config");
            await this.setConfig(data);

            if (!~data.config.vk.active || data.config.vk.accounts.length === 0) {
                return this.$router.replace("/login")
                    .catch(() => (false));
            }

            const account = data.config.vk.accounts[data.config.vk.active];
            await this.auth(account);

            this.ipc();
            this.registerUpdater();

            return this.$router.replace("/general")
                .catch(() => (false));
        });

        ipcRenderer.once("media", () => {
            return this.$router.replace("/media")
                .catch(() => (false));
        });

        ipcRenderer.once("notifier", () => {
            return this.$router.replace("/notifier")
                .catch(() => (false));
        });

        await this.loadLanguage("ru");
        return this.$ipc.send("dom-ready");
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

            this.$ipc.send("register-updater");
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