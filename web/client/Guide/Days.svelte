<script>
    export let selected = today()
    import { today, arrayOf, format } from '@mls44/msdate'

    const dates = arrayOf({ days: 7}).from(today)

    function handleClick(e) {
        selected = Number(e.currentTarget.dataset.date)
    }
</script>

<style>
    ul {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    li {
        background-color: #202529;
        transition: background-color 250ms ease-in-out, box-shadow 250ms ease-in-out;
        flex: 1 1 auto;
        min-width: 80px;
        max-width: 120px;
    }
    .selected {
        background-color: #202529;
        box-shadow: inset 0 -1px 0 0 #00fca7;
    }
    button {
        display:flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        font-size: 10px;
        font-weight: 600;
    }
    button:active {
        background-color: transparent;
    }
    @media (min-width: 681px) {
        button {
            font-size: 14px;
        }
    }
    span { 
        padding: .25em;
    }
    .weekday {
        text-transform: uppercase;
    }
</style>

<ul>
    {#each dates as date}
        <li class:selected={date === selected} tabindex="0" data-date={date} on:click={handleClick} on:focus={handleClick}>
            <button tabindex="-1">
                <span class='weekday'>{date === today ? 'today' : format(date, { weekday: 'short'})}</span>
                <span>{format(date, { day: 'numeric'})}</span>
            </button>
        </li>
    {/each}
</ul>
