<script>
  import ChessAnimation from '$lib/components/animation/ChessAnimation.svelte';
</script>

<div class="main-container">
  <ChessAnimation />
  
<section class="hero">
    <div class="content">
      <h1>Welcome to ChessMate</h1>
      <p>Experience chess like never before</p>
      <div class="button-container">
        <a href="/game" class="cta-button primary">Extension -></a>
        <a href="/rank" class="cta-button secondary">시작하기</a>
      </div>
    </div>
</section>


  <section class="gradient-section">
    <!-- 추가 콘텐츠는 여기에 -->
  </section>
</div>

<style>
.main-container {
  position: relative;
  min-height: 280vh;
  width: 100%;
  background: #121212;
}

  .hero {
    height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    text-align: center;
    padding-top : 10vh;
    width: 100%;
  }

  .content {
    z-index: 1;
  }

  h1 {
    font-size: 3.5rem;  /* 한글이라 좀 줄임 */
    color: #ffd700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    word-break: keep-all;  /* 단어 분리 방지 */
  }

  p {
    font-size: 1.5rem;
    color: white;
    margin-bottom: 2rem;
    word-break: keep-all;  /* 단어 분리 방지 */
  }

  .cta-button {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: #ffd700;
    color: #1a1a1a;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
  }
 .gradient-section {
    position: relative;
    min-height: 300vh;  /* 그라데이션 섹션 높이 늘림 */
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(18, 18, 18, 0.5) 10%,
      rgba(18, 18, 18, 0.8) 20%,
      #121212 30%,
      #121212 100%
    );
    padding: 4rem 0;
    padding-bottom: 300vh; /* 하단 패딩도 늘림 */
  }

    .button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .cta-button {
    display: inline-block;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .cta-button.primary {
    background-color: #ffd700;
    color: #1a1a1a;
  }
</style>