<script>
    import Guide from "./Guide";
    import { hasData } from "./Guide/store.js"
</script>

{#await hasData then data}
    <Guide/>
{/await}
