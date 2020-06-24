<script>
    function handlePlayClick() {
        const response = fetch('pause')
    }
    function handleOpenClick(e) {
        const channel = e.currentTarget.dataset.channel
        const response = fetch(`open/${channel}`)
    }
    const channels = [ 1, 2, 3, 7, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 44, 70, 71, 72, 73, 74, 75, 76, 78, 90, 91, 92, 93, 94, 95, 96, 99 ]
</script>

<style>
    main {
        height: 100%;
        width: 100%;
        background-color: transparent;
        /* margin:50px; */
        /* padding:50px; */
        overflow: auto;
    }
    div {
        display:flex;
        justify-content: center;
        flex-wrap: wrap;
        /* grid-auto-rows: auto;
        grid-template-columns: auto;  */
        height: 100%;
    }
    button {
        flex: 0 1 15vw;
        background-color: #3337;
        color:white;
        margin: 8px;
    }
    img {
        height: 5vh;
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

<main>
    <!-- <button on:click={handlePlayClick}>play</button> -->
    <div>
        {#each channels as channel}
            <button class="ripple" on:click={handleOpenClick} data-channel={channel}>
                <img src={`img/${channel}.png`} alt={`channel ${channel}`}/>
            </button>
        {/each}
    </div>
</main>
