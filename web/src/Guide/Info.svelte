<script context="module">
    import { setLocale,  format } from '@mls44/msdate'

    setLocale('en-AU')
    const toTime = date =>
        format(date, {
            hour: 'numeric',
            minute: 'numeric'
        })
</script>

<script>
    export let program
    import { slide } from 'svelte/transition'
    import { time } from './ticker.js'
    let nowOn = false
    function update(time) {
        const { start, end } = program
        nowOn = start < time && end > time
    }
    $: update($time)
</script>

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        padding: 1vh 16px;
    }
    span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 500;
    }
    .title {
        font-size: large;
    }
    .time {
        color: #fff7;
        font-size: smaller;
    }
    .nowOn {
        color: #0fa;
    }
</style>

<div>
    <span class="title">{program.title}</span>
    <span class="time" class:nowOn>{toTime(program.start)}</span>
</div>
