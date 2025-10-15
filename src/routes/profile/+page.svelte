<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  // 현재 연도를 기본값으로 설정
  let selectedYear = new Date().getFullYear();

  // 윤년 계산 함수
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // 선택된 연도의 일 수 계산
  $: daysInYear = isLeapYear(selectedYear) ? 366 : 365;

  // 세로 7 고정 → 가로로 주차 단위 늘어남
  $: rows = 7;
  $: columns = Math.ceil(daysInYear / rows);

  // 날짜 계산 함수 - YYYY-MM-DD 형식으로 반환
  function getDateForDay(year, dayOfYear) {
    const date = new Date(year, 0, dayOfYear);
    return date.toISOString().split('T')[0];
  }

  // 스트릭 데이터 상태
  let streakData = [];
  let streakDataLoaded = false; // 반응성을 위한 플래그
  
  // 스트릭 정보 불러오기
  async function fetchStreaks() {
    try {
      streakDataLoaded = false; // 로딩 시작 시 false로 설정
      const res = await fetch(`/api/user/streak?year=${selectedYear}`);
      if (!res.ok) throw new Error('스트릭 정보를 불러오지 못했습니다.');
      const response = await res.json();
      streakData = response.data || [];
      console.log('스트릭 데이터 로드됨:', streakData.length, '개 항목');
      console.log('첫 번째 항목:', streakData[0]);
      streakDataLoaded = true;
    } catch (e) {
      console.error(e);
      streakData = [];
      streakDataLoaded = true;
    }
  }

  // 연도 변경 핸들러
  async function handleYearChange() {
    await fetchStreaks();
    // 스트릭 데이터가 변경되면 반응형으로 화면이 업데이트됩니다
  }

  // 오프닝 통계 불러오기
  async function fetchOpeningStats() {
    try {
      const res = await fetch('/api/user/opening');
      if (!res.ok) throw new Error('오프닝 통계를 불러오지 못했습니다.');
      const response = await res.json();
      userStats.openingStats = response.data || [];
    } catch (e) {
      console.error(e);
      userStats.openingStats = [];
    }
  }

  // Move 통계 불러오기 (ECO 대신)
  async function fetchMoveStats() {
    try {
      const res = await fetch('/api/user/move');
      if (!res.ok) throw new Error('Move 통계를 불러오지 못했습니다.');
      const response = await res.json();
      userStats.firstMoveStats = response.data || [];
    } catch (e) {
      console.error(e);
      userStats.firstMoveStats = [];
    }
  }

  // 전체 게임 카운트 불러오기
  async function fetchTotalGameCount() {
    try {
      const res = await fetch('/api/user/count');
      if (!res.ok) throw new Error('전체 게임 카운트를 불러오지 못했습니다.');
      const response = await res.json();
      totalAllTimeStats = {
        win: response.data.win || 0,
        lose: response.data.lose || 0,
        draw: response.data.draw || 0,
        all: response.data.all || 0
      };
      console.log('전체 게임 카운트 로드됨:', totalAllTimeStats);
    } catch (e) {
      console.error(e);
      totalAllTimeStats = { win: 0, lose: 0, draw: 0, all: 0 };
    }
  }

  // 게임 타입별 통계 불러오기
  let gameTypesData = { classical: 0, rapid: 0, bullet: 0, blitz: 0 };
  async function fetchGameTypesSummary() {
    try {
      const res = await fetch('/api/user/summary');
      if (!res.ok) throw new Error('게임 타입별 통계를 불러오지 못했습니다.');
      const response = await res.json();
      gameTypesData = {
        classical: response.data.classical || 0,
        rapid: response.data.rapid || 0,
        bullet: response.data.bullet || 0,
        blitz: response.data.blitz || 0
      };
      console.log('게임 타입별 통계 로드됨:', gameTypesData);
    } catch (e) {
      console.error(e);
      gameTypesData = { classical: 0, rapid: 0, bullet: 0, blitz: 0 };
    }
  }

  // 이용 가능한 연도 목록 가져오기
  let availableYears = [2025]; // 기본값
  async function fetchAvailableYears() {
    try {
      const allYears = new Set();
      const currentYear = new Date().getFullYear();
      // 2010년(리체스 창설일)부터 현재까지 각 연도의 데이터 확인
      for (let year = 2010; year <= currentYear; year++) {
        try {
          const yearRes = await fetch(`/api/user/streak?year=${year}`);
          if (yearRes.ok) {
            const yearData = await yearRes.json();
            if (yearData.data && yearData.data.length > 0) {
              allYears.add(year);
            }
          }
        } catch (e) {
          // 해당 연도에 데이터가 없으면 넘어감
        }
      }
      availableYears = Array.from(allYears).sort((a, b) => b - a);
      if (availableYears.length === 0) {
        availableYears = [currentYear];
      }
    } catch (e) {
      console.error(e);
      availableYears = [new Date().getFullYear()];
    }
  }

  // 스트릭에 필요한 정보를 계산하는 함수
  function getStreakDayInfo(year, dayOfYear, _loaded) {
    const dateStr = getDateForDay(year, dayOfYear);
    // streakData는 이제 직접 배열입니다
    const streak = streakData?.find(s => s.date === dateStr);
    
    if (streak) {
      const win = streak.win || 0;
      const lose = streak.lose || 0;
      const draw = streak.draw || 0;
      const total = win + lose + draw;
      const color = getGoldShade(total);
      const tooltipInfo = `${dateStr}\n승리: ${win}  패배: ${lose}  무승부: ${draw}`;
      console.log(`Date: ${dateStr}, Total: ${total}, Color: ${color}`); // 디버깅용
      return { color, tooltipInfo };
    } else {
      const color = getGoldShade(0);
      const tooltipInfo = `${dateStr}\n승리: 0  패배: 0  무승부: 0`;
      return { color, tooltipInfo };
    }
  }

  // 게임 횟수에 따라 어두운 금색 계열로 색상 반환
  function getGoldShade(totalGames) {
    if (totalGames === 0) return '#2a2a2a';  // 기본 어두운 회색
    if (totalGames <= 1) return '#4d4d1a';   // 아주 어두운 금색 (1게임)
    if (totalGames <= 3) return '#6d5d2a';   // 어두운 금색 (2-3게임)
    if (totalGames <= 6) return '#8d7d4a';   // 중간 금색 (4-6게임)
    if (totalGames <= 10) return '#ad9d6a';  // 밝은 금색 (7-10게임)
    if (totalGames <= 15) return '#cdbd8a';  // 더 밝은 금색 (11-15게임)
    return '#edddaa';                         // 가장 밝은 금색 (16게임 이상)
  }

  onMount(async () => {
    // 로그인 상태 확인
    const localAuth = localStorage.getItem('isAuthenticated');
    if (!localAuth) {
      window.location.href = '/auth';
      return;
    }

    try {
      const authRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (!authRes.ok) {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/auth';
        return;
      }
    } catch (e) {
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/auth';
      return;
    }

    // 인증이 완료되면 데이터 로드
    await fetchAvailableYears();
    fetchStreaks();
    fetchOpeningStats();
    fetchMoveStats();
    fetchTotalGameCount();
    fetchGameTypesSummary();
  });
  
  // 사용자 통계 데이터
  let userStats = {
    name: "사용자 이름",
    firstMoveStats: [],
    openingStats: [],
    totalGames: { total: 0, win: 0, lose: 0, draw: 0 }
  };

  // 전체 게임 통계 (API 데이터)
  let totalAllTimeStats = { win: 0, lose: 0, draw: 0, all: 0 };
  $: totalAllTimeGames = totalAllTimeStats.all;

  // 스트릭 데이터로부터 연도별 게임 통계 계산
  $: if (streakData && streakData.length > 0) {
    const totals = streakData.reduce((acc, day) => {
      acc.win += day.win || 0;
      acc.lose += day.lose || 0;
      acc.draw += day.draw || 0;
      return acc;
    }, { win: 0, lose: 0, draw: 0 });
    
    totals.total = totals.win + totals.lose + totals.draw;
    userStats.totalGames = totals;
  }

  // 상위 5개 오프닝 표시 (번호 매기기)
  $: topOpenings = userStats.openingStats.slice(0, 5).map((item, index) => ({
    text: `${index + 1}. ${item.opening}: ${item.count}회`,
    weight: 900 - index * 100
  }));

  // 상위 5개 Move 표시 (번호 매기기)
  $: topMoves = userStats.firstMoveStats.slice(0, 5).map((item, index) => ({
    text: `${index + 1}. ${item.move}: ${item.count}회`,
    weight: 900 - index * 100
  }));

  // 툴팁 관련 상태
  let tooltipVisible = false;
  let tooltipText = '';
  let tooltipX = 0;
  let tooltipY = 0;

  function showTooltip(event, info) {
    tooltipVisible = true;
    tooltipText = info;
    tooltipX = event.clientX + 10;
    tooltipY = event.clientY + 10;
  }

  function hideTooltip() {
    tooltipVisible = false;
  }

  // 선택된 게임 모드 상태 추가
  let selectedMode = '종합';

  function selectMode(mode) {
    selectedMode = mode;
    console.log('선택된 모드:', mode);
  }

  // 원그래프용 각도 계산
  $: totalGames = userStats.totalGames.total;
  $: winPercentage = totalGames > 0 ? (userStats.totalGames.win / totalGames) * 100 : 0;
  $: losePercentage = totalGames > 0 ? (userStats.totalGames.lose / totalGames) * 100 : 0;
  $: drawPercentage = totalGames > 0 ? (userStats.totalGames.draw / totalGames) * 100 : 0;

  // SVG 경로 계산 함수
  function createPieSlice(centerX, centerY, radius, startAngle, endAngle) {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} z`;
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  let ecoChartCanvas;
  let openingChartCanvas;
  let pieChartCanvas;
  let totalPieChartCanvas;
  let gameTypesChartCanvas;
  let ecoChart;
  let openingChart;
  let pieChart;
  let totalPieChart;
  let gameTypesChart;

  // Chart.js 차트 생성 함수들
  function createMoveChart() {
    if (ecoChart) ecoChart.destroy();
    
    const ctx = ecoChartCanvas.getContext('2d');
    const labels = userStats.firstMoveStats.slice(0, 5).map(item => item.move);
    const data = userStats.firstMoveStats.slice(0, 5).map(item => item.count);
    
    ecoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '게임 수',
          data: data,
          backgroundColor: '#FFD700',
          borderColor: '#FFA500',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: '#E5E5E5'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function createOpeningChart() {
    if (openingChart) openingChart.destroy();
    
    const ctx = openingChartCanvas.getContext('2d');
    const labels = userStats.openingStats.slice(0, 5).map(item => item.opening);
    const data = userStats.openingStats.slice(0, 5).map(item => item.count);
    
    openingChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '게임 수',
          data: data,
          backgroundColor: '#FFD700',
          borderColor: '#FFA500',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: '#E5E5E5'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function createPieChart() {
    if (pieChart) pieChart.destroy();
    
    const ctx = pieChartCanvas.getContext('2d');
    
    pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['승리', '패배', '무승부'],
        datasets: [{
          data: [userStats.totalGames.win, userStats.totalGames.lose, userStats.totalGames.draw],
          backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          }
        }
      }
    });
  }

  function createTotalPieChart() {
    if (totalPieChart) totalPieChart.destroy();
    
    const ctx = totalPieChartCanvas.getContext('2d');
    
    totalPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['승리', '패배', '무승부'],
        datasets: [{
          data: [totalAllTimeStats.win, totalAllTimeStats.lose, totalAllTimeStats.draw],
          backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'],
          borderWidth: 2,
          borderColor: '#1e1e1e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              color: '#ffffff'
            }
          }
        }
      }
    });
  }

  function createGameTypesChart() {
    if (gameTypesChart) gameTypesChart.destroy();
    
    const ctx = gameTypesChartCanvas.getContext('2d');
    
    // 최대값 계산 (0일 경우 기본값 10 설정)
    const maxValue = Math.max(gameTypesData.classical, gameTypesData.rapid, gameTypesData.bullet, gameTypesData.blitz);
    const chartMax = maxValue > 0 ? maxValue * 1.2 : 10;
    const stepSize = maxValue > 0 ? Math.ceil(maxValue / 4) : 2;
    
    gameTypesChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['클래시컬', '래피드', '불렛', '블리츠'],
        datasets: [{
          label: '게임 수',
          data: [gameTypesData.classical, gameTypesData.rapid, gameTypesData.bullet, gameTypesData.blitz],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50',
          borderWidth: 3,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#66BB6A',
          pointHoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#4CAF50',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const total = gameTypesData.classical + gameTypesData.rapid + gameTypesData.bullet + gameTypesData.blitz;
                const percentage = total > 0 ? ((context.parsed.r / total) * 100).toFixed(1) : 0;
                return `${context.label}: ${context.parsed.r}게임 (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: chartMax,
            ticks: {
              color: '#ffffff',
              backdropColor: 'transparent',
              font: {
                size: 10
              },
              stepSize: stepSize,
              showLabelBackdrop: false
            },
            grid: {
              color: '#4CAF50',
              lineWidth: 1
            },
            angleLines: {
              color: '#4CAF50',
              lineWidth: 2
            },
            pointLabels: {
              color: '#ffffff',
              font: {
                size: 13,
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  }

  // 데이터 로드 후 차트 생성
  $: if (streakDataLoaded && userStats.firstMoveStats.length > 0) {
    setTimeout(createMoveChart, 100);
  }

  $: if (streakDataLoaded && userStats.openingStats.length > 0) {
    setTimeout(createOpeningChart, 100);
  }

  $: if (streakDataLoaded && userStats.totalGames.total > 0) {
    setTimeout(createPieChart, 100);
  }

  // 전체 게임 통계 차트 생성
  $: if (totalAllTimeStats.all > 0 && totalPieChartCanvas) {
    setTimeout(createTotalPieChart, 100);
  }

  // 게임 타입별 분포도 차트 생성 (데이터가 0이어도 축은 표시)
  $: if (gameTypesChartCanvas && gameTypesData) {
    setTimeout(createGameTypesChart, 100);
  }
</script>

<div class="profile-container">
  <!-- 사용자 이름 -->
  <div class="user-name-section">
    <h1>{userStats.name}</h1>
  </div>

  <!-- 게임 모드 선택 영역 (탭 스타일) - 이름 아래로 이동 -->
  <div class="mode-selector-container">
    <div class="mode-tabs">
      <button 
        class="mode-tab {selectedMode === '종합' ? 'active' : ''}"
        on:click={() => selectMode('종합')}
      >
        종합
      </button>
      <button 
        class="mode-tab {selectedMode === '불렛' ? 'active' : ''}"
        on:click={() => selectMode('불렛')}
      >
        불렛
      </button>
      <button 
        class="mode-tab {selectedMode === '블리츠' ? 'active' : ''}"
        on:click={() => selectMode('블리츠')}
      >
        블리츠
      </button>
      <button 
        class="mode-tab {selectedMode === '래피드' ? 'active' : ''}"
        on:click={() => selectMode('래피드')}
      >
        래피드
      </button>
      <button 
        class="mode-tab {selectedMode === '클래시컬' ? 'active' : ''}"
        on:click={() => selectMode('클래시컬')}
      >
        클래시컬
      </button>
    </div>
    <div class="tab-underline"></div>
  </div>

  <!-- 통계 섹션 -->
  <div class="stats-section">
    <!-- Move 통계 막대그래프 -->
    <div class="chart-section">
      <h3>첫 수 통계</h3>
      <div class="chart-container">
        <canvas bind:this={ecoChartCanvas}></canvas>
      </div>
    </div>

    <!-- 오프닝 통계 막대그래프 -->
    <div class="chart-section">
      <h3>오프닝 통계</h3>
      <div class="chart-container">
        <canvas bind:this={openingChartCanvas}></canvas>
      </div>
    </div>

    <!-- 게임 타입별 분포도 -->
    <div class="chart-section">
      <h3>게임 타입별 분포</h3>
      <div class="chart-container">
        <canvas bind:this={gameTypesChartCanvas}></canvas>
      </div>
    </div>

    <!-- 전체 게임 통계 원그래프 -->
    <div class="chart-section">
      <h3>전체 게임 통계</h3>
      <div class="chart-container">
        <canvas bind:this={totalPieChartCanvas}></canvas>
      </div>
      <div class="total-games">총 {totalAllTimeGames}게임</div>
    </div>
  </div>

  <!-- 스트릭 & 연도별 통계 섹션 -->
  <div class="bottom-stats-container">
    <!-- 스트릭 박스 (좌측) -->
    <div class="streak-section">
      <div class="streak-box">
        <div class="streak-header">
          <select class="year-selector" bind:value={selectedYear} on:change={handleYearChange}>
            {#each availableYears as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>
        <div class="streak-content">
          <h2>{selectedYear} Streak</h2>
          <div
            class="streak-bar"
            style="grid-template-rows: repeat({rows}, 1fr); grid-auto-flow: column;"
          >
            {#each Array(daysInYear) as _, index}
              {@const info = getStreakDayInfo(selectedYear, index + 1, streakDataLoaded)}
              <div
                class="streak-day"
                style="background-color: {info.color}"
                on:mouseenter={(e) => showTooltip(e, info.tooltipInfo)}
                on:mouseleave={hideTooltip}
                role="button"
                tabindex="-1"
              ></div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- 연도별 게임 통계 박스 (우측) -->
    <div class="yearly-stats-section">
      <div class="yearly-stats-box">
        <h3>{selectedYear} 연도별 통계</h3>
        <div class="yearly-stats-content">
          <div class="yearly-chart-container">
            <canvas bind:this={pieChartCanvas}></canvas>
          </div>
          <div class="yearly-total-games">총 {totalGames}게임</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 버튼별 콘텐츠 영역 -->
  <div class="content-container">
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
  </div>

  {#if tooltipVisible}
    <div
      class="tooltip"
      style="top: {tooltipY}px; left: {tooltipX}px;"
    >
      {tooltipText}
    </div>
  {/if}
</div>

<style>
  .profile-container {
    width: 100%;
    margin: 0;
    padding: 20px;
    position: relative;
    background-color: #121212;
    min-height: 100vh;
  }

  /* 사용자 이름 섹션 */
  .user-name-section {
    text-align: center;
    margin-bottom: 20px;
  }

  .user-name-section h1 {
    margin: 0;
    color: #ffffff;
    font-size: 2.5rem;
    font-weight: bold;
  }

  /* 게임 모드 선택 컨테이너 */
  .mode-selector-container {
    width: 100%;
    margin: 0 0 30px 0;
    padding: 0 20px;
    background-color: #1e1e1e;
  }

  .mode-tabs {
    display: flex;
    gap: 0;
    max-width: 1040px;
    margin: 0 auto;
  }

  .mode-tab {
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    color: #888888;
    cursor: pointer;
    padding: 15px 25px;
    transition: all 0.3s ease;
    position: relative;
    border-bottom: 3px solid transparent;
  }

  .mode-tab:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .mode-tab.active {
    color: #FFD700;
    border-bottom-color: #FFD700;
    background-color: rgba(255, 215, 0, 0.1);
  }

  .tab-underline {
    height: 1px;
    background-color: #333333;
    max-width: 1040px;
    margin: 0 auto;
  }

  /* 통계 섹션 */
  .stats-section {
    display: flex;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto 40px;
    padding: 20px;
    overflow-x: auto;
  }

  .chart-section {
    background: none;
    min-width: 300px;
    flex: 1;
  }

  .chart-section h3 {
    margin: 0 0 20px 0;
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
  }



  .chart-container {
    height: 250px;
    position: relative;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
  }

  .total-games {
    margin-top: 15px;
    font-weight: bold;
    color: #ffffff;
    font-size: 1rem;
    text-align: center;
  }



  /* 스트릭 & 연도별 통계 컨테이너 */
  .bottom-stats-container {
    display: flex;
    gap: 20px;
    max-width: 1400px;
    margin: 0 auto 40px;
    padding: 0 20px;
  }

  .streak-section {
    flex: 2;
  }

  .streak-box {
    width: 100%;
    height: 280px;
    background-color: #1e1e1e;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #333333;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .streak-header {
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .year-selector {
    padding: 5px 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #555555;
    background-color: #2a2a2a;
    color: #ffffff;
  }

  .streak-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: calc(100% - 40px);
    margin-top: 10px;
  }

  .streak-content h2 {
    color: #ffffff;
    margin-bottom: 15px;
    font-size: 1.3rem;
  }

  .streak-bar {
    display: grid;
    gap: 2px;
    grid-template-rows: repeat(7, 18px);
    grid-auto-flow: column;
    width: 100%;
    height: auto;
    justify-content: start;
    align-content: start;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 5px;
    scrollbar-width: thin;
    scrollbar-color: #555555 #1e1e1e;
  }

  .streak-bar::-webkit-scrollbar {
    height: 6px;
  }

  .streak-bar::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  .streak-bar::-webkit-scrollbar-thumb {
    background: #555555;
    border-radius: 3px;
  }

  .streak-bar::-webkit-scrollbar-thumb:hover {
    background: #777777;
  }

  .streak-day {
    width: 18px;
    height: 18px;
    border-radius: 3px;
    transition: all 0.3s ease;
    cursor: pointer;
    user-select: none;
    outline: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .streak-day:hover {
    filter: brightness(1.3);
    outline: 1px solid #FFD700;
    transform: scale(1.1);
  }

  .streak-day:focus {
    outline: none;
  }

  /* 연도별 통계 섹션 */
  .yearly-stats-section {
    flex: 1;
  }

  .yearly-stats-box {
    width: 100%;
    height: 280px;
    background-color: #1e1e1e;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #333333;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .yearly-stats-box h3 {
    color: #ffffff;
    margin-bottom: 15px;
    font-size: 1.3rem;
    text-align: center;
  }

  .yearly-stats-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .yearly-chart-container {
    width: 180px;
    height: 150px;
    position: relative;
  }

  .yearly-total-games {
    margin-top: 10px;
    font-weight: bold;
    color: #ffffff;
    font-size: 1rem;
    text-align: center;
  }

  /* 콘텐츠 컨테이너 */
  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
    padding: 20px;
  }

  .box {
    width: 1000px;
    height: 400px;
    background-color: #1e1e1e;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
  }

  /* 툴팁 스타일 */
  .tooltip {
    position: fixed;
    background-color: #2a2a2a;
    color: #ffffff;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    pointer-events: none;
    z-index: 1000;
    white-space: pre-line;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    border: 1px solid #444444;
  }


</style>