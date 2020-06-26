<script>
    import Icon from './Icon.svelte'
</script>
<button on:click on:contextmenu|preventDefault {...$$restProps}>
    <Icon size="lg" {...$$restProps}><slot/></Icon>
</button>

<style>
    button {
        background: none;
        border: none;
        border-radius: 50%;
        outline: none;
        padding:1em;
        margin:0;
    }
</style>
