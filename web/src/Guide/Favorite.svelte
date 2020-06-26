<script context="module">
    export const isFavorite = key => JSON.parse(localStorage.getItem(key))
</script>

<script>
    export let key = ''
    export let favorite = JSON.parse(localStorage.getItem(key))

    import Icon from '../Icon.svelte'
    import StarIcon from '../icons/Star.svelte'
    import StarIconSolid from '../icons/StarSolid.svelte'

    function persist() {
        if (favorite)
            localStorage.setItem(key, true)
        else 
            localStorage.removeItem(key)
    }

    function toggleFavorite() {
        favorite = !favorite
        persist()
    }

    $: icon = favorite ? StarIconSolid : StarIcon
</script>

<Icon lg color="yellow" on:click={toggleFavorite}>
    <svelte:component this={icon} />
</Icon>
