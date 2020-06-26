<script>
    export let date
    export let programs

    import { today, days } from '@mls44/msdate'
    import { onMount, afterUpdate } from 'svelte'
    import { scrollMonitor } from './scrollMonitor.js'
    import Times from './Times.svelte'
    import ChannelPrograms from './ChannelPrograms.svelte'
    import Indicator from './Indicator.svelte'
    import NavButtons from './NavButtons.svelte'

    let ref
    onMount(scrollToNow)

    let onScrollend
    function scrollToNow() {
        ref.scrollTo({ left: startHour * 360, behavior: 'auto' })
    }
    async function next() {
        if (endHour < 24) {
            endHour++
            ref.scrollBy({ left: 360, behavior: 'smooth' })
            onScrollend = () => startHour++
        }
    }
    function previous() {
        if (startHour > 0) {
            startHour--
            ref.scrollBy({ left: -360, behavior: 'smooth' })
            onScrollend = () => endHour--
        }
    }

    let isScrolling = false
    function handleScrollbegin() {
        isScrolling = true
    }

    function handleScrollend() {
        isScrolling = false
        onScrollend && onScrollend()
        onScrollend = undefined
    }

    let startHour = Math.min(new Date().getHours(), 20)
    let endHour = startHour + 4
    $: rangeStart = new Date(date).setHours(startHour, 0, 0, 0)
    $: rangeEnd = new Date(date).setHours(endHour, 0, 0, 0)
    $: filtered = programs.getRange(rangeStart, rangeEnd)
</script>

<style>
    div {
        display: flex;
        grid-area: programs;
        overflow-x: hidden;
    }
    ul {
        position: relative; /* required for indicator position */
        display: flex;
        flex-direction: column;
        width: 100%; /* prevents added space at end of scroll container */
    }
    /* span {
        background-color: green;
    } */
</style>

<NavButtons
    on:leftclick={previous}
    on:rightclick={next}
    disabled={isScrolling} />
<div
    bind:this={ref}
    use:scrollMonitor
    on:scrollbegin={handleScrollbegin}
    on:scrollend={handleScrollend}>
    <span style={`flex: 0 0 ${startHour * 360}px`} />
    <ul>
        <Times from={rangeStart} hours={endHour - startHour} />
        <Indicator zero={rangeStart} />
        {#each filtered as programs}
            <li>
                <ChannelPrograms {programs} />
            </li>
        {/each}
    </ul>
    <span style={`flex: 0 0 ${(24 - endHour) * 360}px`} />
</div>
