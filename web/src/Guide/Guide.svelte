<script>
    import { guide } from './store.js'
    import { today } from '@mls44/msdate'
    import Days from './Days.svelte'
    import Channels from './Channels.svelte'
    import Programs from './Programs.svelte'

    let date = today

    $: programs = guide.get(date)
    $: channels = programs.channels
</script>

<style>
    main {
        display: grid;
        margin: 5vh 7.5vw 7.5vh 7.5vw;
        grid-template-areas:
            '. programs'
            'channels programs';
        grid-template-rows: 7.5vh;
        grid-gap: 4px;
        overflow-x: hidden;
        cursor: pointer;
        /* background-color: #f001 */
    }
</style>

<Days bind:selected={date} />
<main>
    <Channels {channels} />
    <Programs bind:date {programs} />
</main>
