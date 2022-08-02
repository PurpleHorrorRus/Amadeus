<template>
    <div id="login-page" class="page">
        <div id="login-page-logo">
            <VKIcon id="login-page-logo-icon" />
            <span id="login-page-logo-description">
                Amadeus — бесплатный мессенджер для социальной сети ВКонтакте
                с открытым исходным кодом
            </span>
        </div>

        <div id="login-page-form">
            <span
                v-if="loginError"
                id="login-page-form-error"
                v-text="loginError"
            />

            <LoginCredits v-if="type === 'credits'" />

            <SingleInput
                v-else-if="type === 'tfa'"
                type="password"
                placeholder="Код двухфакторной аутентификации"
                :disabled="loading"
                @input="tfa.code = $event"
                @keypress.enter.native="auth"
            />

            <LoginCaptcha
                v-else-if="type === 'captcha'"
                :src="captcha.src"
            />
        </div>

        <SolidButton
            label="Войти"
            :disabled="disabled"
            @click.native="auth"
        />
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { CallbackService } from "vk-io";
import { DirectAuthorization, officialAppCredentials } from "@vk-io/authorization";

import common from "~/plugins/common";

const callbackService = new CallbackService();

export default {
    components: {
        VKIcon: () => import("~icons/brands/vk.svg"),

        LoginCredits: () => import("~/components/Login/Credits.vue"),
        LoginCaptcha: () => import("~/components/Login/Captcha.vue")
    },

    layout: "login",

    data: () => ({
        username: "",
        password: "",

        tfa: {
            enable: false,
            code: "",
            retry: null
        },

        captcha: {
            enable: false,
            retry: null,
            params: {},
            url: "",
            sid: "",
            value: ""
        },

        loginError: "",

        loading: false,

        type: "credits",

        DirectData: {}
    }),

    computed: {
        disabled() {
            if (this.tfa.enable) {
                return this.tfa.code.length === 0;
            }

            return this.username.length === 0
                || this.password.length === 0
                || this.loading;
        }
    },

    mounted() {
        callbackService.onTwoFactor(async (_, retry) => {
            this.type = "tfa";
            this.tfa.retry = retry;

            if (this.tfa.enable) {
                this.loading = true;
                await this.tfa.retry(this.tfa.code.trim());
            } else {
                this.loginError = "Необходимо ввести код двухфакторной аутентификации";
                this.loading = false;
                this.tfa.enable = true;
            }
        });

        callbackService.onCaptcha(async (payload, retry) => {
            if (this.captcha.enable) {
                this.loading = true;
                await this.captcha.retry(this.captcha.value).catch(e => {
                    this.loginError = e;
                    this.resetCaptcha();
                    this.setCaptcha(payload, retry);
                });
            } else {
                this.loginError = "Необходимо решить капчу";
                this.setCaptcha(payload, retry);
            }

            this.type = "captcha";
            this.loading = false;
        });
    },

    methods: {
        async auth() {
            if (this.disabled) {
                return false;
            }

            this.loading = true;

            switch (this.type) {
                case "credits": {
                    this.username = this.username.trim();
                    this.password = this.password.trim();
                    return await this.authVK();
                }

                case "tfa": {
                    this.tfa.code = this.tfa.code.trim();
                    return await this.authVK();
                }

                case "captcha": {
                    this.captcha.value = this.captcha.value.trim();
                    return await this.authVK();
                }
            }
        },

        async authVK() {
            this.DirectData = await new DirectAuthorization({
                apiVersion: "5.154",
                callbackService,

                scope: "all",

                ...officialAppCredentials.vkMe,

                login: this.username,
                password: this.password
            }).run().catch(e => {
                console.log(e);
                e = e.toString();
                this.loginError = e;

                e = e.toLowerCase();
                if (/invalid client/.test(e) || /password/.test(e) || /Username/.test(e)) {
                    this.reset();
                }

                this.loading = false;
                return null;
            });

            if (this.DirectData) {
                return this.success();
            }
        },

        async success() {
            const { config } = await ipcRenderer.invoke("config");
            const accountExist = config.vk.accounts.some(account => {
                return account.user === this.DirectData.user;
            });

            if (accountExist) {
                this.loginError = "Этот аккаунт уже добавлен";
                return this.reset();
            }

            config.vk.accounts.push({
                token: this.DirectData.token,
                user: this.DirectData.user
            });

            ipcRenderer.send("save", {
                type: "vk",
                content: {
                    ...config.vk,
                    active: config.vk.accounts.length - 1
                }
            });

            await common.wait(1000);
            return this.$router.replace("/").catch(() => (false));
        },

        setCaptcha(payload, retry) {
            this.captcha.enable = true;
            this.captcha.sid = payload.sid;
            this.captcha.src = payload.src;
            this.captcha.retry = retry;
        },

        reset() {
            this.type = "credits";
            this.DirectData = {};

            this.resetTFA();
            this.resetCaptcha();

            this.loading = false;
        },

        resetTFA() {
            this.tfa.enable = false;
            this.tfa.code = "";
            this.tfa.retry = null;
        },

        resetCaptcha() {
            this.captcha.enable = false;
            this.captcha.value = "";
            this.captcha.sid = "";
            this.captcha.src = "";
            this.captcha.retry = null;
        }
    }
};
</script>

<style lang="scss">
#login-page {
    grid-area: page;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 20px;

    width: 100%;
    height: 100%;

    padding: 0px 10px;

    &-logo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 10px;

        justify-self: flex-start;
        align-self: flex-start;

        padding: 0px 10px;

        &-icon {
            width: 20vw;

            path {
                fill: var(--text);
            }
        }
    }

    &-form {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        width: 100%;

        &-error {
            color: #ff0000;
        }

        &-credits {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            row-gap: 10px;

            width: 100%;
        }

        .single-input {
            height: 40px;

            font-size: 12px;
        }
    }
}
</style>