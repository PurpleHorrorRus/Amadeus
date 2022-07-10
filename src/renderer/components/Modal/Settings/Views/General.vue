<template>
    <div id="settings-view-general" class="settings-view">
        <ToggleButton 
            text="Не прочитывать сообщения при открытии чата" 
            :value="settings.vk.disable_read"
            @change="deepChange(settings.vk, 'disable_read')"
        />

        <ToggleButton 
            text="Не отправлять статус о наборе текста в чат" 
            :value="settings.vk.disable_write"
            @change="deepChange(settings.vk, 'disable_write')"
        />

        <ToggleButton 
            text="Отправлять статус offline после отправки сообщения" 
            :value="settings.vk.send_offline"
            @change="deepChange(settings.vk, 'send_offline')"
        />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin]
};
</script>

<style lang="scss">

</style>