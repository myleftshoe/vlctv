<script>
    export let programs
    import Program from './Program.svelte'
</script>

<style>
    ul {
        display: flex;
        flex-direction: row;
        min-height: 0;
        height: calc(7.5vh + 4px);
    }
</style>

<ul>
    {#each programs as program (`${program.id}:${program.start}`)}
        <Program {program} />
    {/each}
</ul>
