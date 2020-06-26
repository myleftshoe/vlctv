<script>
    export let rotate = false
</script>
<style>
    svg {
        height: 1em;
        width: 1em;
        fill: currentColor;
    }
    .rotate {
        transform: rotate(180deg);
    }
</style>
<svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class:rotate
>
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 4.7L4.89 3l8.49 9.43-8.5 9.44L3 20.17l6.97-7.74L3 4.7z" />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11 4.7L12.89 3l8.49 9.43-8.5 9.44-1.88-1.7 6.97-7.74L11 4.7z" />
</svg>

