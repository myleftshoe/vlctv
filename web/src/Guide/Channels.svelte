<script>
    export let channels;
    import Channel from './Channel.svelte'
</script>

<style>
    ul {
        grid-area: channels;
        display: grid;
        grid-auto-rows: 7.5vh;
        grid-gap: 4px;
        width:9vw;
        z-index:1;
        box-shadow: 5px 0px 10px #222;
    }
</style>

<ul>
    {#each channels as channel}
        <Channel {channel}/>
    {/each}
</ul>
