<script>
    export let channel
    function handleClick(e) {
        const channel = e.currentTarget.dataset.channel
        console.log(`(Channel.svelte) handleClick: ${channel}`)
        const response = fetch(`open/${channel}`)
    }
</script>
<style>
    li {
        background-color: #aaa3;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 24px;
    }
    li:hover {
        background-color: #333;
    }
    img {
        /* height:4vh; */
        width: 4vw;
    }
    .ripple {
        position: relative;
        overflow: hidden;
        transform: translate3d(0, 0, 0);
    }
    .ripple:after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(10,10);
        opacity: 0;
        transition: transform .5s, opacity 1s;
    }
    .ripple:active:after {
        transform: scale(0,0);
        opacity: .2;
        transition: 0s;
    }
</style>

<li class="ripple" on:click={handleClick} data-channel={channel}>
    <img src={`./img/${channel}.png`} alt={channel}/>
</li>