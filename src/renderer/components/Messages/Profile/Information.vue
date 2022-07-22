<template>
    <div id="profile-information">
        <div id="profile-information-avatar">
            <img 
                id="profile-information-avatar-image" 
                :src="conversation.avatar" 
                :class="avatarClass" 
                @click="choosePhoto"
            >

            <div 
                v-if="showRemovingAvatar" 
                id="profile-information-avatar-remove"
                @click="removeAvatar"
            >
                <XIcon class="icon clickable" />
            </div>
        </div>

        <ProfileInformationMeta :conversation="conversation" />
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ModalMixin from "~/mixins/modal";

const filter = {
    name: ".jpg, .jpeg, .png",
    extensions: [".jpg", ".jpeg", ".png"]
};

export default {
    components: {
        ProfileInformationMeta: () => import("~/components/Messages/Profile/Information/Meta.vue"),
        XIcon: () => import("~icons/x.svg")
    },

    mixins: [CoreMixin, ModalMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapState({
            defaults: (state: any) => state.vk.defaults
        }),

        avatarClass() {
            return {
                clickable: this.conversation.isChat
            };
        },

        showRemovingAvatar() {
            return this.conversation.isChat
                && this.conversation.avatar !== this.defaults.photo_100;
        }
    },

    methods: {
        ...mapActions({
            uploadOnServer: "vk/messages/UPLOAD_ON_SERVER"
        }),

        async choosePhoto() {
            if (!this.conversation.isChat) {
                return false;
            }

            const filePaths = await ipcRenderer.invoke("select", {
                properties: ["openFile", "singleSelection"],
                filters: [filter]
            });

            if (!filePaths) {
                return false;
            }

            return await this.uploadOnServer({
                server: await this.client.api.photos.getChatUploadServer({
                    chat_id: this.current.local_id
                }),

                path: filePaths[0],
                save: file => this.client.api.messages.setChatPhoto({ file })
            });
        },

        removeAvatar() {
            this.confirmation({
                text: this.$strings.MENU.CONFIRMATION.DELETE_PHOTO,
                accept: () => this.client.api.messages.deleteChatPhoto({
                    chat_id: this.current.local_id
                })
            });
        }
    }
};
</script>

<style lang="scss">
#profile-information {
    display: grid;
    grid-template-columns: 80px 1fr;
    column-gap: 15px;

    &-avatar {
        position: relative;

        &-image {
            width: 80px;
            height: 80px;

            border-radius: 100%;

            &.clickable {
                cursor: pointer;
            }
        }

        &-remove {
            position: absolute;
            top: 0px; right: 0px;
            width: 30px; height: 30px;

            display: flex;
            justify-content: center;
            align-items: center;

            padding: 5px;

            background: var(--backdrop);
            border-radius: 100%;

            .icon {
                width: 16px;
            }
        }
    }
}
</style>