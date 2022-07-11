<template>
    <div id="profile-information-meta">
        <span 
            id="profile-information-meta-name"
            class="clickable" 
            @click.stop="openInBrowser"
            v-text="name(conversation.profile)"
        />

        <span 
            id="profile-information-meta-status" 
            class="small-text" 
            v-text="conversation.profile.status" 
        />

        <MessagesHeaderOnline 
            v-if="showLastSeen" 
            :profile="conversation.profile" 
        />

        <ProfileInformationActions :conversation="conversation" />
    </div>
</template>

<script>
import { shell } from "electron";

import ProfileMixin from "~/mixins/profile";

export default {
    components: {
        ProfileInformationActions: () => import("~/components/Messages/Profile/Information/Actions"),
        MessagesHeaderOnline: () => import("~/components/Messages/Header/Online")
    },

    mixins: [ProfileMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    methods: {
        openInBrowser() {
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