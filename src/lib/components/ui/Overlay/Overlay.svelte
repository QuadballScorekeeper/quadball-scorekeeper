<script>
  import timeAndScore from './Time and score.png';
</script>

<div class="wrapper">
  <div class="strips">
    <div class="strip time-strip" aria-label="time strip">
      <div class="cell">00:00</div>
    </div>
    <div class="gap"></div>
    <div class="strip score-strip" aria-label="score strip">
      <div class="cell team">ABC</div>
      <div class="cell score score-left">1</div>
      <div class="score-divider"></div>
      <div class="cell score score-right">5</div>
      <div class="cell team">ABC</div>
    </div>
  </div>
  <div class="strips">
    <div class="strip time-strip" aria-label="time strip">
      <div class="cell">00:00</div>
    </div>
    <div class="gap"></div>
    <div class="strip score-strip" aria-label="score strip">
      <div class="cell team">ABC</div>
      <div class="cell score score-left">10</div>
      <div class="score-divider"></div>
      <div class="cell score score-right">50</div>
      <div class="cell team">ABC</div>
    </div>
  </div>
  <div class="strips">
    <div class="strip time-strip" aria-label="time strip">
      <div class="cell">00:00</div>
    </div>
    <div class="gap"></div>
    <div class="strip score-strip" aria-label="score strip">
      <div class="cell team">ABC</div>
      <div class="cell score score-left">100</div>
      <div class="score-divider"></div>
      <div class="cell score score-right">500</div>
      <div class="cell team">ABC</div>
    </div>
  </div>
    <div class="strips">
    <div class="strip time-strip" aria-label="time strip">
      <div class="cell">00:00</div>
    </div>
    <div class="gap"></div>
    <div class="strip score-strip" aria-label="score strip">
      <div class="cell team">ABC</div>
      <div class="cell score score-left">100</div>
      <div class="score-divider"></div>
      <div class="cell score score-right">500</div>
      <div class="cell team">ABC</div>
    </div>
  </div>
  <img src={timeAndScore} alt="Time and score" />
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    user-select: none;
  }

  .strips {
    display: flex;
    flex-direction: row;
    gap: 0;
  }

  .gap {
    height: 80px;
    aspect-ratio: 0.2 / 0.86;
  }

  .strip {
    height: 80px;
    background: #000;
    color: #fff;
    display: flex;
    align-items: stretch;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 2.5rem;
    flex-shrink: 0;
  }

  .time-strip {
    aspect-ratio: 1.8 / 0.86;
    justify-content: center;
  }

  .score-strip {
    aspect-ratio: 5 / 0.86;
    background: linear-gradient(to right, #098040, #000 40%, #000 60%, #C90000);
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .team {
    flex: 1;
    letter-spacing: 0.06em;
  }

  .score {
    width: 5rem;
    flex-shrink: 0;
  }

  .score-divider {
    width: 2rem;
    flex-shrink: 0;
  }

  .score-left {
    justify-content: flex-end;
  }

  .score-right {
    justify-content: flex-start;
  }

  img {
    display: block;
  }
</style>