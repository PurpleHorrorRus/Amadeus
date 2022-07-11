<template>
    <div id="profile-information">
        <img id="profile-information-avatar" :src="conversation.profile.photo_100">
        <ProfileInformationMeta :conversation="conversation" />
    </div>
</template>

<script>
export default {
    components: {
        ProfileInformationMeta: () => import("~/components/Messages/Profile/Information/Meta")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
#profile-information {
    display: flex;
    flex-direction: row;
    column-gap: 15px;


    &-avatar {
        width: 80px;
        height: 80px;

        border-radius: 100%;
    }
}
</style>