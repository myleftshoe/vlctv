<script>
    function handlePlayClick() {
        const response = fetch('pause')
    }
    function handleOpenClick(e) {
        const channel = e.target.dataset.channel
        const response = fetch(`open/${channel}`)
    }
    const channels = [ 1, 2, 3, 7, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 44, 70, 71, 72, 73, 74, 75, 76, 78, 90, 91, 92, 93, 94, 95, 96, 99 ]
</script>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }
</style>

<main>
    <button on:click={handlePlayClick}>play</button>
    {#each channels as channel}
      <button on:click={handleOpenClick} data-channel={channel}>{channel}</button>
    {/each}
</main>
