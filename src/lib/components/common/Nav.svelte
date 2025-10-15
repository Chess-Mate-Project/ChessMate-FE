<script>
  import { page } from '$app/stores';
  import { isAuthenticated } from '$lib/components/stores/authStore';
</script>

<nav>
  <div class="nav-container">
    <div class="left-section">
      <div class="logo">
        <img src="/ChessMateLogo.png" alt="ChessMate Logo" />
        <span>ChessMate</span>
      </div>
    </div>

    <div class="center-section">
      <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
<a href="/game" class:active={$page.url.pathname === '/game'}>Game</a>
<a href="/rank" class:active={$page.url.pathname === '/rank'}>Rank</a>
<a href="/profile" class:active={$page.url.pathname === '/profile'}>Profile</a>
    </div>

    <div class="right-section">
<a href="/auth" class="auth-btn login">로그인</a>
    </div>
  </div>
</nav>

<style>
  nav {
    width: 100%;
    background-color: rgba(26, 26, 26, 0.95);
    padding: 1rem 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    backdrop-filter: blur(8px);
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }

  .left-section {
    flex: 1;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .logo span {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffd700;
  }

  .center-section {
    flex: 2;
    display: flex;
    justify-content: center;
    gap: 2.5rem;
  }

  .center-section a {
    color: #ffffff;
    font-size: 1.1rem;
    transition: color 0.3s ease;
    position: relative;
  }

  .center-section a:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #ffd700;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .center-section a:hover:after,
  .center-section a.active:after {
    transform: scaleX(1);
  }

  .right-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .auth-btn {
    padding: 0.7rem 1.8rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    border: none;
    font-size: 1rem;
  }

  .login {
    background-color: #ffd700;
    color: #1a1a1a;
  }

  .login:hover {
    background-color: #ffed4a;
    transform: translateY(-2px);
  }

  .logout {
    background-color: transparent;
    border: 2px solid #ffd700;
    color: #ffd700;
  }

  .logout:hover {
    background-color: #ffd700;
    color: #1a1a1a;
    transform: translateY(-2px);
  }

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .nav-container {
      padding: 0 1rem;
    }

    .center-section {
      gap: 1.5rem;
    }

    .center-section a {
      font-size: 1rem;
    }

    .auth-btn {
      padding: 0.6rem 1.4rem;
      font-size: 0.9rem;
    }
  }
</style>