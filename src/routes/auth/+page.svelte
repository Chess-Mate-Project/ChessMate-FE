<script>
  import { initiateLogin } from '$lib/components/stores/authStore';

  function handleLichessLogin() {
    initiateLogin();
  }

  function handleChesscomLogin() {
    alert('Chess.com 로그인은 준비 중입니다.');
  }
</script>

<div class="auth-bg">
  <div class="auth-center">
    <button class="login-btn lichess" on:click={handleLichessLogin}>
      <img src="/lichess-logo.png" alt="Lichess" />
      Lichess로 로그인
    </button>
    <button class="login-btn chesscom" on:click={handleChesscomLogin}>
      <img src="/chesscom-logo.png" alt="Chess.com" />
      Chess.com으로 로그인
    </button>
  </div>
</div>

<style>
  :global(body) {
    background: #121212 !important; /* 모든 페이지와 통일 */
  }
  .auth-bg {
    min-height: 100vh;
    width: 100vw;
    background: #121212;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .auth-center {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  .login-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 16px 32px;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    transition: background 0.2s, color 0.2s;
    color: #222;
  }
  .login-btn img {
    width: 32px;
    height: 32px;
  }
  .login-btn.lichess {
    background: #888888;
    color: #fff;
  }
  .login-btn.lichess:hover {
    background: #b0b0b0;
  }
  .login-btn.chesscom {
    background: #1a472a;
    color: #fff;
  }
  .login-btn.chesscom:hover {
    background: #14551a;
  }
</style>