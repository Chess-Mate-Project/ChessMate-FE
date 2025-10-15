<script>
  import { onMount } from 'svelte';
  import { handleCallback } from '$lib/components/stores/authStore';

  let error = '';
  let success = false;
  let loading = true;

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      error = '인증 코드가 없습니다.';
      loading = false;
      setTimeout(() => window.location.href = '/auth', 1500);
      return;
    }

    const result = await handleCallback(code);
    loading = false;
    if (result) {
      success = true;
      setTimeout(() => window.location.href = '/profile', 1200);
    } else {
      error = '인증 실패';
      setTimeout(() => window.location.href = '/auth', 1500);
    }
  });
</script>

<div class="callback-container">
  {#if loading}
    <div class="loader"></div>
    <p>인증 중입니다...</p>
  {:else}
    {#if success}
      <h1>인증 성공!</h1>
      <p>환영합니다.</p>
    {:else}
      <h1>인증 실패</h1>
      <p>{error}</p>
    {/if}
  {/if}
</div>

<style>
  .callback-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #121212;
  }

  .loader {
    border: 6px solid #232323;
    border-top: 6px solid #ffd700;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
    margin-bottom: 2rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }

  h1 {
    color: #ffd700;
  }

  p {
    color: #fff;
  }
</style>