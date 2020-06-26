<script>
    export let color = 'white'
    export let size = '1em';

    const sizes = {
        xs: '.75em',
        sm: '.875em',
        lg: '1.33em',
        xl: '1.5em'
    }

    function convertSize(size) {
        if (/^[1-9]*[0-9]x$/.test(size))
            return size.replace('x', 'em')
        if (sizes[size])
            return sizes[size]
        return size
    }

    $: cssSize = convertSize(size)
    $: style = `fill:${color};width:${cssSize};height:${cssSize};` 

</script>

<i {style} {...$$restProps} on:click><slot/></i>

<style>
    i {
        display: flex;
        align-items: center;
        justify-content: center;
        fill: white;
        width: 1em;
        height: 1em;
    }
</style>
