<template>
    <div id="messages-header-main-profile-information">
        <span 
            id="messages-header-main-profile-information-name" 
            class="nowrap"
            v-text="name(profile)" 
        />

        <MessagesHeaderOnline v-if="showLastSeen" :profile="profile" />
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
    }
};
</script>

<style lang="scss">
#messages-header-main-profile-information {
    display: flex;
    justify-content: center;
    flex-direction: column;

    &-name {
        font-size: 12px;
    }
}
</style>