<template>
    <div id="settings-view-accounts" class="settings-view">
        <span class="modal-view-title" v-text="$strings.SETTINGS.ACCOUNTS.TITLE" />

        <div v-if="loaded" id="modal-view-accounts-list">
            <AccountProfile
                v-for="(profile, index) of profiles"
                :key="profile.id"
                :profile="profile"
                :active="user.id === profile.id"
                @click.native="switchAccount(index)"
                @remove="removeAccount(index)"
            />
        </div>

        <SolidButton
            id="settings-view-accounts-add"
            :label="$strings.SETTINGS.ACCOUNTS.ADD"
            @click.native="openLogin"
        />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import ModalMixin from "~/mixins/modal";

import User from "~/instances/User";

export default {
    components: {
        AccountProfile: () => import("~/components/Modal/Settings/Views/Accounts/Profile.vue")
    },

    mixins: [ModalMixin],

    data: () => ({
        loaded: false,
        profiles: []
    }),

    computed: {
        ...mapState({
            config: (state: any) => state.config,
            user: (state: any) => state.vk.user,
            client: (state: any) => state.vk.client
        })
    },

    async created() {
        const ids = this.config.vk.accounts.map(account => {
            return account.user;
        });

        const profiles = await this.client.api.users.get({
            user_ids: ids,
            count: 100,
            fields: "photo_100"
        });

        this.profiles = profiles.map(profile => {
            return new User(profile);
        });

        this.loaded = true;
    },

    methods: {
        ...mapActions({
            auth: "vk/AUTH"
        }),

        async switchAccount(index) {
            if (index === this.config.vk.active) {
                return false;
            }

            this.config.vk.active = index;
            this.config.vk.save();

            this.close();
            return await this.auth(this.config.vk.accounts[index]);
        },

        removeAccount(index) {
            if (index === this.config.vk.active) {
                return false;
            }

            const currentAccountIndex = this.config.accounts.findIndex(account => {
                return account.user === this.user.id;
            });

            if (index < currentAccountIndex) {
                this.config.vk.active = currentAccountIndex - 1;
            }

            this.config.vk.accounts.splice(index, 1);
            return this.config.vk.save();
        },

        openLogin() {
            this.close();

            return this.$router.replace("/login")
                .catch(() => (false));
        }
    }
};
</script>

<style lang="scss">
#settings-view-accounts {
    display: grid;
    grid-template-rows: 30px 1fr 30px;

    &-add {
        justify-self: flex-end;
    }
}
</style>