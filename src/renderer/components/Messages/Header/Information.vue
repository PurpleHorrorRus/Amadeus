<template>
    <div id="messages-header-profile-information">
        <span 
            id="messages-header-profile-information-name" 
            class="nowrap"
            v-text="name(profile)" 
        />

        <MessagesHeaderOnline 
            v-if="showLastSeen"
            :profile="profile"
        />
    </div>
</template>

<script>
import ProfileMixin from "~/mixins/profile";

export default {
    components: {
        MessagesHeaderOnline: () => import("~/components/Messages/Header/Online")
    },

    mixins: [ProfileMixin],

    props: {
        profile: {
            type: Object,
            required: true
        }
    },

    computed: {
        showLastSeen() {
            return (this.profile.last_seen || this.profile.online)
                && this.profile.type !== "group"
                && this.profile.type !== "chat";
        }
    }
};
</script>

<style>

</style>