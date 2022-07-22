// @ts-nocheck
export default {
    name: "autosize",

    inserted: function (el: Element) {
        const style = getComputedStyle(el);
        const minHeight = parseFloat(style.getPropertyValue("min-height"));
        const maxHeight = parseFloat(style.getPropertyValue("max-height"));
  
        const resize = () => {
            el.style.height = "auto";
            const height = Math.max(Math.min(el.scrollHeight, maxHeight), minHeight);
            el.style.setProperty("overflow-y", height < maxHeight ? "hidden" : "overlay");
            el.style.setProperty("height", `${height}px`, "important");
        };

        el.resize = () => setTimeout(resize, 0);
        el.resize();
    }
};