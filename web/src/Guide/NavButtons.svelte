<script>
    export let disabled = false
    import Chevron from './Chevron.svelte'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    const handleLeftClick = e => dispatch('leftclick')
    const handleRightClick = e => dispatch('rightclick')
</script>

<style>
    button {
        position: fixed;
        top: calc(50% - 1.875vh);
        /* background-color: #aaa2; */
        color: #1fa;
        width: 3.75vh;
        height: 3.75vh;
        margin: 1em;
        transform: scale(2);
        z-index: 10;
    }
    button:active:not(:disabled) {
        background-color: #aaa3;
    }
    button:disabled {
        filter: grayscale(1);
    }
    .left {
        left: 1.875vw;
    }
    .right {
        right: 1.875vw;
    }
</style>

<button class="left" on:click={handleLeftClick} {disabled}>
    <Chevron rotate />
</button>
<button class="right" on:click={handleRightClick} {disabled}>
    <Chevron />
</button>
