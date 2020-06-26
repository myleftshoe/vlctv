<script>
    export let program

    import Info from './Info.svelte'
    import Overlay from './Overlay.svelte'
    import Favorite, { isFavorite } from './Favorite.svelte'
    import hoverTransition from './hoverTransition.js'

    const select = () => (selected = true)
    const deselect = () => (selected = false)

    let ref
    let selected = false
    let favorite = isFavorite(program.title)

    $: width = selected ? ref.scrollWidth : program.width
</script>

<style>
    li {
        position: relative;
        display: flex;
        justify-content: space-between;
        --backgroundColor: #333;
        background-color: var(--backgroundColor);
        outline: 4px solid #222;
        overflow: hidden;
    }
    li:hover {
        --backgroundColor: #666;
        box-shadow: inset 2px 0 #0fa;
    }
    .favorite {
        --backgroundColor: #484833;
    }
</style>

<li
    bind:this={ref}
    use:hoverTransition={{ width, hover: selected }}
    class:favorite
    on:mouseenter={select}
    on:mouseleave={deselect}>
    <Info {program} />
    {#if selected}
        <Overlay>
            <Favorite key={program.title} bind:favorite />
        </Overlay>
    {/if}
</li>
