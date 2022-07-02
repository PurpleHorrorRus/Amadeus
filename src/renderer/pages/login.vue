<template>
    <div id="login-page" class="page">
        <div id="login-page-logo">
            <img id="login-page-logo-image" src="logo.png">
            <span id="login-page-logo-label" v-text="'VKGram'" />
        </div>

        <div id="login-page-form">
            <span 
                v-if="loginError" 
                id="login-page-form-error" 
                v-text="loginError" 
            />

            <div v-if="type === 'credits'" id="login-page-form-credits">
                <SingleInput 
                    placeholder="Логин"
                    type="password"
                    :disabled="loading"
                    @input="username = $event"
                    @keypress.enter.native="auth"
                />

                <SingleInput 
                    placeholder="Пароль" 
                    type="password" 
                    :disabled="loading"
                    @input="password = $event"
                    @keypress.enter.native="auth"
                />
            </div>

            <SingleInput
                v-else-if="type === 'tfa'"
                type="password"
                placeholder="Код двухфакторной аутентификации"
                :disabled="loading" 
                @input="tfa.code = $event"
                @keypress.enter.native="auth"
            />

            <SingleInput
                v-else-if="type === 'captcha'"
                placeholder="Решение"
                :disabled="loading" 
                @input="captcha = $event"
                @keypress.enter.native="auth"
            />
        </div>

        <SolidButton 
            label="Войти" 
            :disabled="disabled" 
            @click.native="auth"
        />
    </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { CallbackService } from "vk-io";
import { DirectAuthorization, officialAppCredentials } from "@vk-io/authorization";

const callbackService = new CallbackService();

export default {
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
            solution: ""
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
    },

    methods: {
        async auth() {
            if (this.disabled) {
                return false;
            }

            this.loading = true;

            switch(this.type) {
                case "credits": {
                    this.username = this.username.trim();
                    this.password = this.password.trim();

                    return await this.authVK();
                }

                case "tfa": {
                    return await this.authVK();
                }
            }
        },

        async authVK() {
            this.DirectData = await new DirectAuthorization({
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
                if (/invalid client/.test(e) || /password/.test(e) || /username/.test(e)) {
                    this.reset();
                }

                this.loading = false;
                return null;
            });

            console.log(this.DirectData.user);

            if (this.DirectData) {
                return this.success();
            }
        },

        success() {
            ipcRenderer.send("save", {
                type: "vk",
                content: {
                    token: this.DirectData.token,
                    user: this.DirectData.user
                }
            });

            return true;
        },
        
        reset() {
            this.tfa.enable = false;
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
        justify-content: center;
        align-items: center;
        column-gap: 10px;

        &-image {
            width: 40px;
            height: 40px;
        }

        &-label {
            font-family: "Fira Sans";
            font-size: 24px;
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