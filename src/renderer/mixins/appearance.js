export default {
    methods: {
        setStyleVariable(data) {
            document.documentElement.style.setProperty(`--${data.variable}`, data.value);
        }
    }
};