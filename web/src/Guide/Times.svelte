<script>
    export let hours = 24
    export let from = today
    
    import { today, arrayOf } from '@mls44/msdate'

    $: times = arrayOf({ hours }, { hour: 'numeric' }).from(from)
</script>

<style>
    ul {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        height: calc(7.5vh + 4px);
    }
    li {
        flex: 0 0 360px;
        display: flex;
        align-items: center;
        height: 50%;
        padding-left: 12px;
        border-left: 1px solid white;
        font-weight: bolder;
        font-size: 0.9em;
    }
</style>

<ul>
    {#each times as time}
        <li>{time}</li>
    {/each}
</ul>
