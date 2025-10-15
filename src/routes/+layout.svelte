<script>
  import Nav from '$lib/components/common/Nav.svelte';
  import '../style/app.css';
</script>

<Nav />

<main>
  <slot />
</main>

<style>
  main {
    margin-top: 4rem;
    padding: 2rem;
  }
</style>