<template>
    <div id="login-page-form-credits">
        <SingleInput 
            placeholder="Логин"
            :disabled="$parent.loading"
            @input="$parent.username = $event"
            @keypress.enter.native="$parent.auth"
        />

        <SingleInput 
            placeholder="Пароль" 
            type="password" 
            :disabled="$parent.loading"
            @input="$parent.password = $event"
            @keypress.enter.native="$parent.auth"
        />
    </div>
</template>

<script lang="ts">
export default {};
</script>