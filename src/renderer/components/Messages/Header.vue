<template>
    <div id="messages-header">
        <div v-if="!extended" id="messages-header-back" @click="back">
            <ArrowLeftIcon class="icon" />
        </div>

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
        ArrowLeftIcon: () => import("~/assets/icons/arrow-left.svg"),
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
    },

    methods: {
        back() {
            this.$router.replace("/general").catch(() => {});
            return true;
        }
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

    &-back {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 20px;

        .icon {
            width: 14px;
        }
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