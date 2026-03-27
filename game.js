var CLUES = [
  {id:0, name:'偽造寄件者網域', desc:'信件使用大寫字母「I」替代小寫字母「l」，網域 taiwanmobiIe.com 是仿冒網域，視覺上極難分辨。'},
  {id:1, name:'異常發送時間', desc:'週六深夜 23:47 發送官方安全公告，不符合企業正常作業流程。'},
  {id:2, name:'製造緊迫感（恐嚇話術）', desc:'以「緊急」、「24小時停用」誘使收件者慌亂行事，是社交工程的核心策略。'},
  {id:3, name:'威脅描述含糊不清', desc:'真實的資安通知會提供具體異常資訊（IP、地點、時間），含糊描述是詐騙特徵。'},
  {id:4, name:'假冒按鈕 / 惡意連結', desc:'按鈕外觀正常，但實際連結指向釣魚網站。企業系統永遠不應要求你重新輸入密碼。'},
  {id:5, name:'Typosquatting 偽造網址', desc:'網址以數字「0」替換字母「o」（tw-m0bile），使用第三方 .net 網域，是典型拼字搶注攻擊。'}
];

var foundSet = new Set();

function startGame() {
  showScreen('game');
  setupClues();
  updateProgress();
}

function setupClues() {
  document.querySelectorAll('.clue').forEach(function(el) {
    el.addEventListener('click', function() {
      var id = parseInt(this.dataset.id);
      if (foundSet.has(id)) return;
      foundSet.add(id);
      this.classList.add('found');
      if (!this.querySelector('.clue-tooltip')) {
        var tip = document.createElement('span');
        tip.className = 'clue-tooltip';
        tip.textContent = this.dataset.tip;
        this.appendChild(tip);
      }
      updateProgress();
    });
  });
}

function updateProgress() {
  var n = foundSet.size;
  var total = CLUES.length;
  document.getElementById('live-score').textContent = n + ' / ' + total;
  document.getElementById('found-count').textContent = n + ' / ' + total + ' 線索';
  document.getElementById('progress-fill').style.width = (n / total * 100) + '%';
}

function openVerdict() {
  document.getElementById('modal-found').textContent = foundSet.size;
  document.getElementById('verdict-modal').classList.add('open');
}

function closeVerdict() {
  document.getElementById('verdict-modal').classList.remove('open');
}

function submitGame() {
  closeVerdict();
  document.querySelectorAll('.clue').forEach(function(el) {
    var id = parseInt(el.dataset.id);
    if (!foundSet.has(id)) {
      el.classList.add('missed-reveal');
      if (!el.querySelector('.clue-tooltip')) {
        var tip = document.createElement('span');
        tip.className = 'clue-tooltip';
        tip.textContent = el.dataset.tip;
        el.appendChild(tip);
      }
    }
  });
  showResult();
}

function showResult() {
  var n = foundSet.size;
  var total = CLUES.length;
  var pct = Math.round(n / total * 100);
  var badge, title, subtitle;
  if (pct === 100) { badge = '🏆'; title = '資安高手！'; subtitle = '完美偵測，所有釣魚線索一網打盡！'; }
  else if (pct >= 67) { badge = '🥈'; title = '不錯的眼力！'; subtitle = '找到了 ' + n + ' 個線索，還有幾處被漏掉了。'; }
  else if (pct >= 33) { badge = '🔎'; title = '繼續加油！'; subtitle = '只找到 ' + n + ' 個線索，攻擊者可能已得逞。'; }
  else { badge = '⚠️'; title = '危險！'; subtitle = '只找到 ' + n + ' 個線索，你可能已上鉤！'; }
  document.getElementById('result-badge').textContent = badge;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-score').textContent = n + '/' + total;
  document.getElementById('result-subtitle').textContent = subtitle;
  var container = document.getElementById('clue-rows');
  container.innerHTML = '';
  CLUES.forEach(function(clue, i) {
    var hit = foundSet.has(clue.id);
    var row = document.createElement('div');
    row.className = 'clue-row';
    row.style.animationDelay = (i * 0.07) + 's';
    row.innerHTML = '<div class="clue-status">' + (hit ? '✅' : '❌') + '</div><div class="clue-info"><div class="clue-name ' + (hit ? 'hit' : 'miss') + '">' + clue.name + '</div><div class="clue-desc">' + clue.desc + '</div></div>';
    container.appendChild(row);
  });
  showScreen('result');
}

function restartGame() {
  foundSet = new Set();
  document.querySelectorAll('.clue').forEach(function(el) {
    el.classList.remove('found', 'missed-reveal');
    var tip = el.querySelector('.clue-tooltip');
    if (tip) tip.remove();
  });
  updateProgress();
  showScreen('intro');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', function() {
  var b;
  b = document.getElementById('btn-start-game'); if (b) b.addEventListener('click', startGame);
  b = document.getElementById('btn-open-verdict'); if (b) b.addEventListener('click', openVerdict);
  b = document.getElementById('btn-close-verdict'); if (b) b.addEventListener('click', closeVerdict);
  b = document.getElementById('btn-submit-game'); if (b) b.addEventListener('click', submitGame);
  b = document.getElementById('btn-restart-game'); if (b) b.addEventListener('click', restartGame);
});
