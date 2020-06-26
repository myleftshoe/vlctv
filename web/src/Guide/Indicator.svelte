<script>
    export let zero 
    import { time } from "./ticker.js"
    const getPosition = zero => (Date.now() - zero) / 10000
</script>

<style>
    span {
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 100%;
        background-color: #1fa;
        /* transition: transform 0.3s linear; */
        z-index:10;
        pointer-events: none;
    }
</style>

<span style={`transform: translateX(${$time ? getPosition(zero) : 0}px);`} />
