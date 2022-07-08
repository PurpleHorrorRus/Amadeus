<template>
    <div id="messages-header">
        <MessagesHeaderBack v-if="!extended" />

        <div id="messages-header-profile">
            <img id="messages-header-profile-avatar" :src="conversation.profile.photo_100">
            <MessagesHeaderInformation :profile="conversation.profile" />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    components: {
        MessagesHeaderBack: () => import("~/components/Messages/Header/Back"),
        MessagesHeaderInformation: () => import("~/components/Messages/Header/Information")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapState({
            extended: state => state.extendedView
        })
    }
};
</script>

<style lang="scss">
#messages-header {
    grid-area: header;

    display: flex;
    flex-direction: row;
    column-gap: 5px;

    padding: 0px 10px;

    > * {
        cursor: pointer;
    }

    &-profile {
        display: flex;
        align-items: center;
        column-gap: 10px;

        &-avatar {
            width: 30px;
            height: 30px;
    
            border-radius: 100%;
        }

        &-information {
            display: flex;
            justify-content: center;
            flex-direction: column;

            &-name {
                font-size: 12px;
            }
        }
    }

}
</style>