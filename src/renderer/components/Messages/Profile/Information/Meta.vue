<template>
    <div id="profile-information-meta">
        <span 
            id="profile-information-meta-name"
            :class="nameClass"
            @click.stop="openInBrowser"
            v-text="conversation.name"
        />

        <span 
            v-if="conversation.profile.status"
            id="profile-information-meta-status" 
            class="small-text" 
            v-text="conversation.profile.status" 
        />

        <MessagesHeaderOnline 
            v-if="showLastSeen" 
            :conversation="conversation" 
        />

        <ProfileInformationActions :conversation="conversation" />
    </div>
</template>

<script lang="ts">
import { shell } from "electron";

import ProfileMixin from "~/mixins/profile";

export default {
    components: {
        ProfileInformationActions: () => import("~/components/Messages/Profile/Information/Actions.vue"),
        MessagesHeaderOnline: () => import("~/components/Messages/Header/Online.vue")
    },

    mixins: [ProfileMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        nameClass() {
            return {
                clickable: !this.conversation.isChat
            };
        }
    },

    methods: {
        openInBrowser() {
            if (this.conversation.isChat) {
                return false;
            }

            const link = this.externalLink(this.conversation);
            return shell.openExternal(link);
        }
    }
};
</script>

<style lang="scss">
#profile-information-meta {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
}
</style>