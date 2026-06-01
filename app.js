/* ==========================================================================
   ECOLOGY COURSE INTERACTIVE SLIDES - SCRIPT ENGINE (app.js)
   Controls: Navigation, Sidebar drawer, Timers, Quiz, pH lab, Animal Gallery,
             Food Web Sandbox.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------------------------------
     1. Slide Navigation Engine
     -------------------------------------------------------------------------- */
  let currentSlide = 1;
  const totalSlides = 25;

  const slidesContainer = document.getElementById("slides-container");
  const currentNumEl = document.getElementById("current-slide-num");
  const totalNumEl = document.getElementById("total-slides-num");
  const sessionTagEl = document.getElementById("session-tag");
  const sidebarEl = document.getElementById("sidebar");
  const refDrawerEl = document.getElementById("ref-drawer");
  const refCountEl = document.getElementById("ref-count");
  const syllabusItems = document.querySelectorAll(".slide-item");

  // Aligned Teacher Reference Panel Elements
  const refDisplayImage = document.getElementById("ref-display-image");
  const refPageName = document.getElementById("ref-page-name");
  const refNotesText = document.getElementById("ref-notes-text");
  const tabCanva = document.getElementById("tab-canva");
  const tabTextbook = document.getElementById("tab-textbook");

  // Sync reference panel state
  let currentRefType = "canva"; // 'canva' or 'textbook'
  let currentRefPage = 1;

  // Initialize total slides indicator
  totalNumEl.textContent = totalSlides;

  // Slide-specific teacher notes database
  const teacherGuideNotes = {
    // Session 1
    1: {
      canva: { page: 1, notes: "第一堂開場：引導學生進入專案，打開 Canva 並複製個人生態調查簡報。請學生填寫封面班級、座號與個人姓名。" },
      textbook: { page: 1, notes: "課本第 152 頁：介紹實驗目的，引導學生思考『環境因子對生物組成會有什麼影響？』" }
    },
    2: {
      canva: { page: 2, notes: "課程地圖：向學生說明未來四堂課的整體學習旅程。第一堂課將集中於生態探索與個人照片上傳雲端硬碟。" },
      textbook: { page: 1, notes: "課本第 152 頁：展示實驗大綱。了解今日要做 15 分鐘的植物探究。" }
    },
    3: {
      canva: { page: 2, notes: "今日目標說明：提醒學生，今天下課前必須前往指定棲地進行植物探索，並拍照上傳至少 5-10 種植物的清晰原圖照片。" },
      textbook: { page: 1, notes: "課本第 152 頁：說明挑選棲地（如向陽草地或中庭花園）與實地拍照的科學要求。" }
    },
    4: {
      canva: { page: 2, notes: "Canva 生態報告引導：引導學生領取個人 iPad，進行一機一人的操作。提醒學生相機設定、對焦技巧與個人拍照守則。" },
      textbook: { page: 1, notes: "對照課本：說明課本實驗要求『記錄觀察到的生物』在 Canva 中擴展為個人『生物收集冊』的實地探索。" }
    },
    5: {
      canva: { page: 4, notes: "實作控時：按下畫面計時器，讓學生有 15 分鐘進入校園指定區域進行植物拍攝。叮嚀每種植物拍 2-3 張，注意特寫並保持穩定。" },
      textbook: { page: 1, notes: "對照課本實驗步驟 3：觀察生物。使用放大鏡和相機記錄生物特徵。" }
    },
    6: {
      canva: { page: 4, notes: "第一堂收尾（雲端傳送門）：指導學生登入個人 Google 雲端硬碟或 Google Classroom，將剛剛探勘的相片上傳至『校園生態調查』個人作業區，依照座號命名。" },
      textbook: { page: 1, notes: "對照課本：收集到的照片將在下一堂課進行鑑定（圖鑑與網絡鑑定）。" }
    },
    // Session 2
    7: {
      canva: { page: 5, notes: "第二堂開場：今天的主題是資料整理與 AI 植物辨識。我們需要從個人雲端下載相片貼進 Canva，並完成『三方查證』。" },
      textbook: { page: 1, notes: "課本第 152 頁步驟 3-3：『善用圖鑑、圖書館及網路鑑定動植物的種類。』本堂課將利用現代 AI 技術加速鑑定。" }
    },
    8: {
      canva: { page: 4, notes: "Canva 實作引導：學生登入個人 Canva 編輯生物收集冊。一格一張，貼上最清晰植物相片。引導學生使用 AI 大致鑑定，盡力判定到屬或科層級，無需分開雙棲地。" },
      textbook: { page: 1, notes: "對照課本 P.152：植物種類包含地毯草、車前草、牛筋草、雷公根、酢漿草等，引導學生尋找這些常見種類。" }
    },
    9: {
      canva: { page: 5, notes: "AI 辨識教學：介紹使用 Gemini 或其他多模態 AI 工具進行植物辨識。示範 Prompt 的問法，引導學生使用平板進行 AI 初步判定。" },
      textbook: { page: 1, notes: "科學求真：引導學生思考『AI 給出的名字，我們該如何證明它是對的？』，切入三方查證。" }
    },
    10: {
      canva: { page: 5, notes: "三方查證說明：引導學生查閱台灣野生植物資料庫等第三方權威平台，比對植物形態特徵是否與相片相符。" },
      textbook: { page: 1, notes: "對照課本 P.152：查證大花咸豐草、車前草特徵（如葉排列、花果特徵）。" }
    },
    11: {
      canva: { page: 5, notes: "互動查證遊戲：讓學生在簡報上操作『葉序』與『葉脈』的組合，找出對應的校園常見植物。建立分類學核心概念。" },
      textbook: { page: 1, notes: "植物特徵對照：引導學生辨認課本所列植物的特徵，例如車前草為叢生、平行脈；咸豐草為對生、網狀脈。" }
    },
    // Session 3
    12: {
      canva: { page: 3, notes: "第三堂開場：今天的任務是實地測量單一指定棲地的非生物環境因子，並尋找非植物的動物、真菌等生物。今日有 20 分鐘戶外挑戰。" },
      textbook: { page: 1, notes: "課本第 152 頁『測量環境因子』：介紹大氣溫濕度、光照、土壤 pH 的實際量測。" }
    },
    13: {
      canva: { page: 3, notes: "課本實驗說明與環境測量：展示自然課本 P.152 的實驗指引與環境因子測量工具（溫濕度計、照度計、廣用試紙）。針對單一指定棲地說明操作方法與記錄數據。" },
      textbook: { page: 1, notes: "對照課本步驟 2：詳細說明儀器操作細節與非生物因子測量方法。" }
    },
    14: {
      canva: { page: 3, notes: "思考互動：利用畫面上的環境因子問答題，引導學生討論測量非生物因子對生態調查的意義。引出非生物因子是限制生物分布的關鍵條件。" },
      textbook: { page: 1, notes: "課本第 152 頁步驟 1：確認調查地點。幫助學生理解環境限制因子與指定棲地環境物理條件的科學觀念。" }
    },
    15: {
      canva: { page: 3, notes: "pH 實驗模擬：在簡報上為學生示範土壤 pH 檢測實驗步驟。點擊選擇樣本、加入等體積水攪拌、以玻璃棒沾澄清液滴在廣用試紙上比對顏色。" },
      textbook: { page: 2, notes: "課本第 153 頁：詳細示範 1:1 土壤混合、廣用試紙檢驗與顏色判讀。加深實驗印象。" }
    },
    16: {
      canva: { page: 6, notes: "尋找動物與真菌：提醒學生注意翻開落葉堆、枯木，或抬頭望向樹梢。注意拍攝移動中的動物時要保持安靜，避免驚擾生物。" },
      textbook: { page: 2, notes: "對照課本 P.153：校園常見動物包含蚯蚓、蝸牛、蝴蝶、螞蟻、蝗蟲、綠繡眼等。" }
    },
    17: {
      canva: { page: 6, notes: "東興常見動物圖鑑：展示校園常見動物與特徵。點選任意卡片會開啟全螢幕大字體毛玻璃燈箱（Modal），讓全班學生清晰看清動物特徵，避免瀏覽器凍結。" },
      textbook: { page: 2, notes: "動物特徵核對：了解校園常見動物（如白尾八哥、紅姬緣椿象、蠅虎）的生態棲位與形態特徵。" }
    },
    18: {
      canva: { page: 3, notes: "實作控時：按下 20 分鐘計時器。出發實地測量指定棲地環境因子，並獵取動物、真菌相片。下課前完成雲端照片上傳。" },
      textbook: { page: 1, notes: "對照課本：實地觀測並記錄物理數據，為最後一堂生態分析提供量化支持。" }
    },
    // Session 4
    19: {
      canva: { page: 8, notes: "第四堂開場：今天的終極任務是完成個人 Canva 生物收集冊，並建構校園生態食物網，進行生態系健全性分析與評價。" },
      textbook: { page: 2, notes: "課本第 153 頁『結果與討論』：探討物理因子如何影響該棲地的生物分布、提出生態解釋。" }
    },
    20: {
      canva: { page: 4, notes: "生物豐富度檢視：引導學生在 Canva 簡報第 4 頁補齊動物與真菌的照片，並結合前幾堂的紀錄，完成個人生物收集冊的精美排版。" },
      textbook: { page: 2, notes: "對照課本結果與討論 1：分析指定棲地所記錄到的生物種類與多樣性。" }
    },
    21: {
      canva: { page: 8, notes: "食物網觀念：說明生產者、消費者（初級、次級）與分解者的食性連結。強調食物網複雜度與生態系穩定度的關係。" },
      textbook: { page: 2, notes: "能量流動：說明大自然中物質循環與能量流動的核心概念。" }
    },
    22: {
      canva: { page: 8, notes: "食物網連線沙盒：引導學生點選畫面上不同階層的生物，動態建構食物網。示範如果拿掉某個物種，網絡會如何受影響。" },
      textbook: { page: 2, notes: "對照課本結果與討論 2：『哪些物理因子對該棲地的生物分布影響最大？請提出科學解釋。』" }
    },
    23: {
      canva: { page: 8, notes: "生態分析討論：帶領學生討論東興校園的生態健全性與穩定度。指導學生在 Canva 第 8 頁填寫基於數據與事實的分析回答。" },
      textbook: { page: 2, notes: "對照課本結果與討論 3：『如何透過生態平衡與食性關係，維持指定棲地的穩定度？』" }
    },
    24: {
      canva: { page: 9, notes: "生態改善與具體行動：引導學生思考如何從自身做起（如建立落葉堆肥、種植本土蜜源植物），為學校寫下兩項生態改善具體建議。" },
      textbook: { page: 2, notes: "從探究到行動：將課堂生物學概念，延伸應用於校園環境改造的實踐中。" }
    },
    25: {
      canva: { page: 9, notes: "課程總結與發表：引導小組進行 Canva 簡報匯出（PDF 或連結）並上傳到 Classroom 個人作業區，準備開始個人成果展示與反思！" },
      textbook: { page: 2, notes: "科學傳達：引導學生分享個人調查報告，進行成果互評與回饋。" }
    }
  };

  // Navigates to a specific slide
  function showSlide(n) {
    if (n < 1) n = 1;
    if (n > totalSlides) n = totalSlides;
    currentSlide = n;

    // 1. Update Slides DOM
    const slides = document.querySelectorAll(".slide");
    slides.forEach(slide => {
      slide.classList.remove("active");
    });
    const targetSlide = document.getElementById(`slide-${currentSlide}`);
    if (targetSlide) {
      targetSlide.classList.add("active");
      
      // Update header session tag based on data-session attribute
      const session = targetSlide.getAttribute("data-session");
      sessionTagEl.textContent = session;
      
      // Set session specific styling to header tag
      if (session === "第一堂") sessionTagEl.className = "current-session-tag";
      else if (session === "第二堂") sessionTagEl.className = "current-session-tag session-2";
      else if (session === "第三堂") sessionTagEl.className = "current-session-tag session-3";
      else if (session === "第四堂") sessionTagEl.className = "current-session-tag session-4";

      // Sync reference panel metadata variables
      currentRefType = targetSlide.getAttribute("data-ref-type") || "canva";
      currentRefPage = parseInt(targetSlide.getAttribute("data-ref-page")) || 1;
    }

    // 2. Update Header Slide Counter
    currentNumEl.textContent = currentSlide;

    // 3. Update Sidebar Active State
    syllabusItems.forEach(item => {
      item.classList.remove("active");
      if (parseInt(item.getAttribute("data-slide")) === currentSlide) {
        item.classList.add("active");
        // Scroll into view if sidebar is open
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });

    // 4. Update Reference Companion Drawer
    updateReferencePanel();

    // 5. Initialize specialized interactions if we land on their slide
    if (currentSlide === 17) {
      renderAnimalGallery();
    }
    if (currentSlide === 22) {
      initFoodWebSandbox();
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      showSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      showSlide(currentSlide - 1);
    }
  }

  // Handle Right sidebar tabs and images
  function updateReferencePanel() {
    // Sync active tab in DOM
    if (currentRefType === "canva") {
      tabCanva.classList.add("active");
      tabTextbook.classList.remove("active");
      refPageName.textContent = `Canva 第 ${currentRefPage} 頁`;
      refDisplayImage.src = `images/canva_page_${currentRefPage}.png`;
    } else {
      tabTextbook.classList.add("active");
      tabCanva.classList.remove("active");
      refPageName.textContent = `自然課本 第 ${currentRefPage} 頁`;
      refDisplayImage.src = `images/textbook_page_${currentRefPage}.png`;
    }

    // Load Teacher Notes
    const notesConfig = teacherGuideNotes[currentSlide];
    if (notesConfig && notesConfig[currentRefType]) {
      refNotesText.textContent = notesConfig[currentRefType].notes;
    } else {
      refNotesText.textContent = "無當前頁面的引導說明。請自由講述或對比學生進度。";
    }
  }

  // Bind Header Controls
  document.getElementById("btn-prev").addEventListener("click", prevSlide);
  document.getElementById("btn-next").addEventListener("click", nextSlide);

  // Bind Sidebar toggler
  const btnToggleSidebar = document.getElementById("toggle-sidebar");
  btnToggleSidebar.addEventListener("click", () => {
    sidebarEl.classList.toggle("collapsed");
  });

  // Bind Reference toggler
  const btnToggleReference = document.getElementById("toggle-reference");
  const btnCloseRef = document.getElementById("close-ref");
  function toggleRefDrawer() {
    refDrawerEl.classList.toggle("collapsed");
  }
  btnToggleReference.addEventListener("click", toggleRefDrawer);
  btnCloseRef.addEventListener("click", () => {
    refDrawerEl.classList.add("collapsed");
  });

  // Bind Sidebar items click
  syllabusItems.forEach(item => {
    item.addEventListener("click", () => {
      const slideNum = parseInt(item.getAttribute("data-slide"));
      showSlide(slideNum);
    });
  });

  // Bind Reference Tab clicks
  tabCanva.addEventListener("click", () => {
    currentRefType = "canva";
    updateReferencePanel();
  });
  tabTextbook.addEventListener("click", () => {
    currentRefType = "textbook";
    updateReferencePanel();
  });

  // Export navigation function globally for footer buttons
  window.appNavigate = function(slideNum) {
    showSlide(slideNum);
  };

  // --------------------------------------------------------------------------
  // Keyboard Shortcuts (Arrow keys, Space, M, R, F)
  // --------------------------------------------------------------------------
  document.addEventListener("keydown", (e) => {
    // Avoid triggered shortcuts when user is in a dropdown selector or input
    if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        nextSlide();
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "PageUp":
        prevSlide();
        e.preventDefault();
        break;
      case "Spacebar":
      case " ":
        nextSlide();
        e.preventDefault();
        break;
      case "m":
      case "M":
        sidebarEl.classList.toggle("collapsed");
        break;
      case "r":
      case "R":
        toggleRefDrawer();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
    }
  });

  // Fullscreen support
  const btnFullscreen = document.getElementById("btn-fullscreen");
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
      btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
      document.exitFullscreen();
      btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  }
  btnFullscreen.addEventListener("click", toggleFullscreen);


  /* --------------------------------------------------------------------------
     2. Web Audio Synthesizer (Beep Alarm for Timers)
     -------------------------------------------------------------------------- */
  function playAlarmBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Beep 1
      let osc1 = audioCtx.createOscillator();
      let gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.15);

      // Beep 2 (Delayed)
      setTimeout(() => {
        let osc2 = audioCtx.createOscillator();
        let gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1046.5, audioCtx.currentTime); // C6 note
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.3);
      }, 200);

    } catch (e) {
      console.warn("Web Audio API not supported or blocked: ", e);
    }
  }


  /* --------------------------------------------------------------------------
     3. Fieldwork Countdown Timers (15 mins / 20 mins)
     -------------------------------------------------------------------------- */
  const timers = document.querySelectorAll(".timer-container");
  
  timers.forEach(timerContainer => {
    const display = timerContainer.querySelector(".timer-display");
    const progressFill = timerContainer.querySelector(".timer-progress-fill");
    const btnStart = timerContainer.querySelector(".start");
    const btnPause = timerContainer.querySelector(".pause");
    const btnReset = timerContainer.querySelector(".reset");
    
    const duration = parseInt(timerContainer.getAttribute("data-duration"));
    let timeLeft = duration;
    let timerId = null;

    function updateDisplay() {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      const pct = (timeLeft / duration) * 100;
      progressFill.style.width = `${pct}%`;
    }

    btnStart.addEventListener("click", () => {
      if (timerId !== null) return;
      
      timerContainer.classList.add("running");
      timerContainer.classList.remove("alarm");
      btnStart.disabled = true;
      btnPause.disabled = false;

      timerId = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          timeLeft = 0;
          clearInterval(timerId);
          timerId = null;
          timerContainer.classList.remove("running");
          timerContainer.classList.add("alarm");
          btnPause.disabled = true;
          btnStart.disabled = false;
          playAlarmBeep();
        }
        updateDisplay();
      }, 1000);
    });

    btnPause.addEventListener("click", () => {
      if (timerId === null) return;
      
      clearInterval(timerId);
      timerId = null;
      timerContainer.classList.remove("running");
      btnStart.disabled = false;
      btnPause.disabled = true;
    });

    btnReset.addEventListener("click", () => {
      clearInterval(timerId);
      timerId = null;
      timeLeft = duration;
      timerContainer.classList.remove("running", "alarm");
      btnStart.disabled = false;
      btnPause.disabled = true;
      updateDisplay();
    });

    // Initialize display state
    updateDisplay();
  });


  /* --------------------------------------------------------------------------
     4. Interactive Q&A (Session 1 Quiz)
     -------------------------------------------------------------------------- */
  const quizHabitat = document.getElementById("quiz-habitat");
  if (quizHabitat) {
    const options = quizHabitat.querySelectorAll(".quiz-option");
    const feedback = quizHabitat.querySelector(".quiz-feedback");

    options.forEach(opt => {
      opt.addEventListener("click", () => {
        // Reset options state
        options.forEach(o => o.classList.remove("correct", "wrong"));
        
        const isCorrect = opt.getAttribute("data-correct") === "true";
        if (isCorrect) {
          opt.classList.add("correct");
          feedback.style.display = "block";
          feedback.style.color = "#a7f3d0";
          feedback.style.borderColor = "var(--color-primary)";
          feedback.innerHTML = '<h4><i class="fa-solid fa-circle-check"></i> 答對了！科學探究精神！</h4><p>測量非生物環境因子，是為了釐清『光照、大氣溫濕度、土壤酸鹼值』等變因，如何具體決定生物在此地的存活與分布特徵。這是生態學中探討限制因子的經典探究操作！</p>';
        } else {
          opt.classList.add("wrong");
          feedback.style.display = "block";
          feedback.style.color = "#fca5a5";
          feedback.style.borderColor = "var(--color-danger)";
          feedback.innerHTML = '<h4><i class="fa-solid fa-circle-xmark"></i> 答錯囉，再想一想！</h4><p>雖然其他的選項聽起來有些道理，但站在「科學探究」的立場，我們是為了解開物理非生物因子與生物多樣性分布之間的因果關係喔！</p>';
        }
      });
    });
  }


  /* --------------------------------------------------------------------------
     5. Botanical Features Matcher Game (Session 2 Game)
     -------------------------------------------------------------------------- */
  const btnVerifyPlant = document.getElementById("btn-verify-plant");
  const selectPhyllotaxy = document.getElementById("select-phyllotaxy");
  const selectVenation = document.getElementById("select-venation");
  const verifierResult = document.getElementById("verifier-result");

  const plantDatabase = [
    {
      phyllotaxy: "rosette",
      venation: "parallel",
      name: "牛筋草 (Goosegrass) / 地毯草",
      scientificName: "Eleusine indica",
      verifiedSource: "行政院特有生物研究保育中心",
      description: "牛筋草根生叢生，葉片條形，平展且具有平行的葉脈。極具韌性，是校園向陽草皮上的優勢草本。地毯草葉寬平，亦為平行脈互生，是常見地被。",
      icon: "fa-solid fa-grass"
    },
    {
      phyllotaxy: "rosette",
      venation: "netted",
      name: "車前草 (Chinese Plantain)",
      scientificName: "Plantago asiatica",
      verifiedSource: "國立自然科學博物館植物園庫",
      description: "葉自基部根生呈叢生狀，葉片卵形或寬卵形。雖是平行主脈但帶有細密的網狀側脈支撐。多生長於路邊、草地上，是極佳的野外查證教材！",
      icon: "fa-solid fa-leaf"
    },
    {
      phyllotaxy: "opposite",
      venation: "netted",
      name: "大花咸豐草 (Bidens / 恰恰草)",
      scientificName: "Bidens pilosa var. radiata",
      verifiedSource: "台灣野生植物資料庫",
      description: "校園最常見的外來入侵植物。莖方形、葉對生，具有鋸齒邊緣與鮮明的羽狀網狀脈。白色舌狀花與黃色管狀花是重要辨識點，種子帶倒鉤能附著散播。",
      icon: "fa-solid fa-sun-flower"
    },
    {
      phyllotaxy: "alternate",
      venation: "netted",
      name: "雷公根 (Asiatic Pennywort)",
      scientificName: "Centella asiatica",
      verifiedSource: "中央研究院生物多樣性研究中心",
      description: "匍匐草本，葉互生，圓腎形，葉基深心形，邊緣有鈍鋸齒，掌狀網狀葉脈自基部放射而出。多生長於校園陰濕水溝邊，常被 AI 誤判為馬蹄金。",
      icon: "fa-solid fa-clover"
    }
  ];

  if (btnVerifyPlant) {
    btnVerifyPlant.addEventListener("click", () => {
      const phyl = selectPhyllotaxy.value;
      const ven = selectVenation.value;

      if (phyl === "none" || ven === "none") {
        verifierResult.innerHTML = '<div class="result-placeholder" style="color: var(--color-accent);"><i class="fa-solid fa-triangle-exclamation"></i> 請先選擇「葉序」與「葉脈」兩項植物特徵！</div>';
        return;
      }

      // Query database
      const match = plantDatabase.find(p => p.phyllotaxy === phyl && p.venation === ven);

      if (match) {
        verifierResult.innerHTML = `
          <div class="verifier-match-card">
            <div class="match-img-placeholder">
              <i class="${match.icon}"></i>
            </div>
            <div class="match-info">
              <h3>${match.name} <span>${match.scientificName}</span></h3>
              <p>${match.description}</p>
              <div class="match-details-row">
                <div class="match-tag"><i class="fa-solid fa-building-columns"></i> 查證來源：${match.verifiedSource}</div>
                <div class="match-tag"><i class="fa-solid fa-circle-check"></i> 特徵吻合度：100% (無AI幻覺)</div>
              </div>
            </div>
          </div>
        `;
      } else {
        // Build combinations explanations
        let comboName = "";
        if (phyl === "opposite" && ven === "parallel") comboName = "【對生 + 平行脈】";
        if (phyl === "alternate" && ven === "parallel") comboName = "【互生 + 平行脈】（單子葉木本草本）";
        if (phyl === "whorled") comboName = "【輪生】葉（如軟枝黃蟬、黑板樹）";

        verifierResult.innerHTML = `
          <div class="verifier-match-card text-center" style="flex-direction: column; align-items: center;">
            <i class="fa-solid fa-circle-question" style="font-size: 50px; color: var(--color-accent); margin-bottom: 12px;"></i>
            <h3 style="color: #fff;">未在校園基礎資料庫中比對到 ${comboName} 的精準匹配</h3>
            <p style="font-size:15px; color: var(--color-text-muted);">
              雖然這也是常見的植物組合（例如竹子或黑板樹），但在本次東興國中指定樣區的常見草本中未建檔。請小組打開『台灣野生植物資料庫』網站，手動輸入您的查證關鍵字！
            </p>
          </div>
        `;
      }
    });
  }


  /* --------------------------------------------------------------------------
     6. Soil pH Lab Simulator (Session 3 Interactive Lab)
     -------------------------------------------------------------------------- */
  const phSimulator = document.getElementById("ph-simulator");
  let activeSample = null;
  let labState = { mixed: false, dipped: false };

  if (phSimulator) {
    const btnSamples = phSimulator.querySelectorAll(".btn-sample");
    const beakerLiquid = document.getElementById("beaker-liquid");
    const glassRod = document.getElementById("glass-rod");
    const beakerStatus = document.getElementById("beaker-status");
    const btnMix = document.getElementById("btn-mix");
    const btnDip = document.getElementById("btn-dip");
    const indicatorStrip = document.getElementById("indicator-strip");
    const phCells = phSimulator.querySelectorAll(".ph-color-cell");
    const phSimResult = document.getElementById("ph-sim-result");

    // Soil parameters
    const soilDb = {
      grassland: {
        name: "樣本 A (向陽草地土壤)",
        ph: 7,
        color: "#2ECC71", // pH 7 Neutral Green
        muddyColor: "rgba(139, 90, 43, 0.4)", // light muddy brown
        resultText: "檢測完成！樣本 A 土壤檢驗顯現「綠色」，比對 pH 7.0，呈【中性】。符合多數向陽草本植物的健康生長環境！"
      },
      wetland: {
        name: "樣本 B (背陰潮濕水溝土)",
        ph: 5,
        color: "#E67E22", // pH 5 Acidic Orange
        muddyColor: "rgba(90, 50, 20, 0.5)", // dark organic-rich mud
        resultText: "檢測完成！樣本 B 土壤檢驗顯現「橘黃色」，比對 pH 5.0，呈【酸性】。主因是背陰水溝處堆積大量枯枝落葉，有機質分解釋放出腐植酸所致！"
      }
    };

    // 1. Sample Selection
    btnSamples.forEach(btn => {
      btn.addEventListener("click", () => {
        // Reset lab state
        activeSample = btn.getAttribute("data-sample");
        btnSamples.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Fill beaker with dry soil
        beakerLiquid.style.height = "35px";
        beakerLiquid.style.backgroundColor = "rgba(139, 90, 43, 0.7)"; // Dry soil brown
        beakerStatus.textContent = `已裝載 ${soilDb[activeSample].name}。請加入約等體積的蒸餾水並混合攪拌。`;
        
        // Reset controls
        btnMix.disabled = false;
        btnDip.disabled = true;
        indicatorStrip.style.backgroundColor = "#f7dc6f"; // Reset yellow
        indicatorStrip.textContent = "試紙";
        phCells.forEach(c => c.classList.remove("highlighted"));
        phSimResult.textContent = "";
        labState = { mixed: false, dipped: false };
      });
    });

    // 2. Mix and Stir
    btnMix.addEventListener("click", () => {
      if (!activeSample || labState.mixed) return;

      btnMix.disabled = true;
      beakerStatus.textContent = "正在注入約等體積的蒸餾水，進行攪拌...";
      
      // Animate beaker filling with water
      beakerLiquid.style.height = "70px";
      beakerLiquid.style.backgroundColor = soilDb[activeSample].muddyColor;

      // Stir rod animation
      glassRod.classList.add("stirring");

      setTimeout(() => {
        glassRod.classList.remove("stirring");
        beakerStatus.textContent = "攪拌完成！泥沙沉澱中... 澄清液已分離。請滴取上層澄清液檢測。";
        btnDip.disabled = false;
        labState.mixed = true;
      }, 2000);
    });

    // 3. Dip Glass Rod
    btnDip.addEventListener("click", () => {
      if (!activeSample || !labState.mixed || labState.dipped) return;

      btnDip.disabled = true;
      beakerStatus.textContent = "使用玻璃棒沾取澄清液，滴在廣用試紙上...";
      
      glassRod.classList.add("dipping");

      setTimeout(() => {
        glassRod.classList.remove("dipping");
        
        // Change indicator color
        const sampleData = soilDb[activeSample];
        indicatorStrip.style.backgroundColor = sampleData.color;
        indicatorStrip.textContent = `pH ${sampleData.ph}`;
        indicatorStrip.style.color = "#000";

        // Highlight matching color chart cell
        phCells.forEach(cell => {
          cell.classList.remove("highlighted");
          if (parseInt(cell.getAttribute("data-ph")) === sampleData.ph) {
            cell.classList.add("highlighted");
          }
        });

        // Show result
        phSimResult.textContent = `${sampleData.name} pH 值 = ${sampleData.ph}`;
        beakerStatus.textContent = sampleData.resultText;
        labState.dipped = true;
      }, 1200);
    });
  }


  /* --------------------------------------------------------------------------
     7. Dongxing School Common Animals Gallery Renders (Slide 18)
     -------------------------------------------------------------------------- */
  const animalGalleryData = [
    // Birds
    { name: "白尾八哥", cat: "birds", desc: "外來種優勢鳥類。全身黑色，嘴喙象牙白，尾羽下側有鮮明白斑。叫聲吵雜，常成群出現在草地覓食昆蟲。", icon: "fa-solid fa-crow", image: "images/birds_baige.png" },
    { name: "家八哥", cat: "birds", desc: "外來種八哥。嘴喙與眼周皮膚為鮮黃色，與本土八哥形成對比。雜食性，適應力強，常排擠本土鳥類棲地。", icon: "fa-solid fa-crow", image: "images/birds_jiabaige.png" },
    { name: "棕背伯勞", cat: "birds", desc: "中小型肉食性鳥類。背部紅褐色，有條黑色過眼線（如蒙面海盜）。喙端帶鉤，會將捕獲的蜥蜴或大昆蟲釘在鐵絲或樹枝上。", icon: "fa-solid fa-feather", image: "images/birds_bolao.png" },
    { name: "白頭翁", cat: "birds", desc: "本土常見三劍客之一。頭頂後方有塊白斑（如白頭髮），背部橄欖綠色。喜食漿果與昆蟲，叫聲悅耳清脆『巧克力、巧克力』。", icon: "fa-solid fa-dove", image: "images/birds_baitouweng.png" },
    { name: "綠繡眼", cat: "birds", desc: "本土常見小巧鳥類。全身黃綠色，眼周有一圈極為明顯的白色絨毛（眼圈）。常成群穿梭於校園灌木與大樹花叢間採蜜。", icon: "fa-solid fa-dove", image: "images/birds_lvxiuyan.png" },
    { name: "黑冠麻鷺", cat: "birds", desc: "校園明星『大笨鳥』。大體型，全身紅褐色帶細斑紋。喜出沒於向陽溼潤草皮，常靜止不動如木雕，伺機拔出土壤中的蚯蚓食用。", icon: "fa-solid fa-kiwi-bird", image: "images/birds_heiguanmalu.png" },
    { name: "麻雀", cat: "birds", desc: "最親近人類的小鳥。頭頂栗褐色，臉頰有塊顯眼的黑色圓斑。喜成群在校園中撿食草籽或學生掉落的碎屑。", icon: "fa-solid fa-feather", image: "images/birds_maque.png" },
    
    // Butterflies
    { name: "黃蝶", cat: "butterflies", desc: "校園最亮眼飛友。翅膀純黃色，邊緣微帶黑邊。幼蟲喜食校園內阿勃勒、黃槐等豆科植物嫩葉，常成群在向陽花圃飛舞。", icon: "fa-solid fa-butterfly", image: "images/butterflies_huangdie.png" },
    { name: "小灰蝶", cat: "butterflies", desc: "體型極為細小的蝴蝶。翅膀背面微帶藍紫金屬光澤，腹面為淡灰色帶斑點。飛行速度極快但高度偏低，常停在低矮大花咸豐草花上。", icon: "fa-solid fa-butterfly", image: "images/butterflies_xiaohuidie.png" },
    { name: "青帶鳳蝶", cat: "butterflies", desc: "亮麗的黑色大蝶。雙翅中央有一條貫穿的亮藍色/青綠色半透明帶狀紋。飛行迅速如閃電，常出沒在校園水溝邊、潮濕地吸水。", icon: "fa-solid fa-butterfly", image: "images/butterflies_qingdaifengdie.png" },
    { name: "白粉蝶", cat: "butterflies", desc: "又稱紋白蝶。翅膀白色，前翅端部有黑色斑。幼蟲為俗稱的『菜青蟲』，偏好十字花科植物，是校園生態園的常客。", icon: "fa-solid fa-butterfly", image: "images/butterflies_baifendie.png" },
    { name: "柑橘鳳蝶", cat: "butterflies", desc: "大型鳳蝶。翅膀黑底帶有縱向黃白色條紋，後翅有一對尾狀突起。幼蟲以柑橘類植物為食，會伸出臭角驅趕天敵。", icon: "fa-solid fa-butterfly", image: "images/butterflies_ganjufengdie.png" },
    { name: "橙帶藍尺蛾", cat: "butterflies", desc: "校園明星蛾類。常被誤認為蝴蝶！全身金屬深藍色，前後翅有一條亮麗的橙黃色橫帶。幼蟲專食校園景觀植物竹柏，集體啃食力驚人。", icon: "fa-solid fa-bug", image: "images/butterflies_chengdailanchie.png" },

    // Insects
    { name: "紅姬緣椿象", cat: "insects", desc: "又稱無患子椿象。全身鮮紅色，翅膀交會處有黑色三角形。春季時，數以千計的若蟲與成蟲會群聚在無患子樹下吸食種子汁液，對人無害。", icon: "fa-solid fa-bugs", image: "images/insects_hongjiyuanchunxiang.png" },
    { name: "馬陸", cat: "insects", desc: "分解者核心代表。身體圓柱形分節，每節有兩對足。喜在背陰潮濕落葉堆中活動，啃食腐植質，受驚嚇時會捲縮成螺旋狀，不可與百足蜈蚣混淆。", icon: "fa-solid fa-worm", image: "images/insects_malu.png" },
    { name: "豆芫菁", cat: "insects", desc: "中型甲蟲。頭部鮮紅色（如戴紅帽），身體與翅鞘黑色。喜啃食校園內茄科或豆科植物，體液含有斑蝥素，皮膚接觸會起水泡，切忌用手觸摸！", icon: "fa-solid fa-bug", image: "images/insects_douyuanjing.png" },
    { name: "大蚊", cat: "insects", desc: "外型像巨無霸蚊子，但『完全不吸血』！腳極為細長且易斷。成蟲吸食植物汁液或露水，幼蟲大多生長在陰暗濕泥中分解有機質。", icon: "fa-solid fa-bugs", image: "images/insects_dawen.png" },
    { name: "小家蟻", cat: "insects", desc: "體型細小的社會性昆蟲。常在落葉堆、大樹基部建立龐大行軍路徑，負責搬運昆蟲屍體與植物碎屑，是生態系中重要的清理者。", icon: "fa-solid fa-bug", image: "images/insects_xiaojiayi.png" },

    // Spiders
    { name: "蠅虎 (跳蛛)", cat: "spiders", desc: "微型捕食者。體型短壯，不織網，擁有極佳視力與一對大單眼。靠驚人的彈跳力突襲落葉堆上的小昆蟲。是校園的捕蟲小幫手。", icon: "fa-solid fa-spider", image: "images/spiders_yinghu.png" },
    { name: "白額高腳蛛", cat: "spiders", desc: "俗稱『拉牙』。體型極大，常出沒在大樓陰暗處、雜物間。不織網，速度極快，是蟑螂的超級剋星，雖外表猙獰但毒性極弱且害羞。", icon: "fa-solid fa-spider", image: "images/spiders_baiegaojiaozhu.png" },
    { name: "熱帶幽靈蛛", cat: "spiders", desc: "大樓牆角之王。腳極為細長（如幽靈般懸空）。在背陰、水溝邊或地下室角落結不規則的亂網。受驚嚇時會劇烈搖晃身體讓天敵看不清。", icon: "fa-solid fa-spider", image: "images/spiders_redaiyoulingzhu.png" },

    // Others
    { name: "非洲大蝸牛", cat: "others", desc: "超大型陸生蝸牛。外殼為黃褐色帶焦褐色斑紋。雨天後大量出現在草皮、背陰林地。雜食性，會啃食校園幾乎所有綠色植物，亦是分解者。", icon: "fa-solid fa-shrimp", image: "images/others_feizhoudawoaniu.png" },
    { name: "蚯蚓 (環毛蚓)", cat: "others", desc: "泥土的清道夫。身體無骨分節，生活在富含腐植質的潮濕土壤中。吞食泥土消化有機物，排出的蚓糞富含養分，能有效疏鬆土壤、調和酸鹼度。", icon: "fa-solid fa-worm", image: "images/others_qiuyin.png" }
];

  const animalGalleryContainer = document.getElementById("animal-gallery");

  function renderAnimalGallery(filter = "all") {
    if (!animalGalleryContainer) return;
    
    animalGalleryContainer.innerHTML = "";
    
    const filteredAnimals = filter === "all" 
      ? animalGalleryData 
      : animalGalleryData.filter(a => a.cat === filter);

    filteredAnimals.forEach(animal => {
      const card = document.createElement("div");
      card.className = "animal-card";
      
      let catChinese = "";
      if (animal.cat === "birds") catChinese = "鳥類";
      else if (animal.cat === "butterflies") catChinese = "蝶蛾";
      else if (animal.cat === "insects") catChinese = "昆蟲";
      else if (animal.cat === "spiders") catChinese = "蜘蛛";
      else if (animal.cat === "others") catChinese = "其他無脊椎";

      const imagePath = animal.image;

      card.innerHTML = `
        <div class="animal-img">
          <img src="${imagePath}" class="animal-card-photo" alt="${animal.name}">
          <span class="cat-tag">${catChinese}</span>
        </div>
        <div class="animal-info">
          <h4>${animal.name}</h4>
          <p>${animal.desc}</p>
        </div>
      `;

      // Expand card details on click (using high-end Lightbox Modal)
      card.addEventListener("click", () => {
        const modalEl = document.getElementById("animal-modal");
        const modalImg = document.getElementById("modal-img");
        const modalIcon = document.getElementById("modal-icon");
        const modalTitle = document.getElementById("modal-title");
        const modalCat = document.getElementById("modal-cat");
        const modalDesc = document.getElementById("modal-desc");
        
        if (modalEl) {
          if (modalImg) {
            modalImg.src = imagePath;
            modalImg.style.display = "block";
          }
          if (modalIcon) {
            modalIcon.className = animal.icon;
            modalIcon.style.display = "none";
          }
          if (modalTitle) modalTitle.textContent = animal.name;
          if (modalCat) modalCat.textContent = catChinese;
          if (modalDesc) modalDesc.textContent = animal.desc;
          
          modalEl.classList.add("active");
        }
      });

      animalGalleryContainer.appendChild(card);
    });
  }

  // Bind Gallery Tab clicks
  const galleryTabs = document.querySelectorAll(".btn-tab");
  galleryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      galleryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const filter = tab.getAttribute("data-filter");
      renderAnimalGallery(filter);
    });
  });

  // Lightbox Modal Close Event Bindings
  const animalModal = document.getElementById("animal-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  if (animalModal && btnCloseModal) {
    btnCloseModal.addEventListener("click", () => {
      animalModal.classList.remove("active");
    });
    // Click outside modal content to close
    animalModal.addEventListener("click", (e) => {
      if (e.target === animalModal) {
        animalModal.classList.remove("active");
      }
    });
    // Press ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && animalModal.classList.contains("active")) {
        animalModal.classList.remove("active");
      }
    });
  }


  /* --------------------------------------------------------------------------
     8. Food Web Sandbox Builder (Session 4 Interactive Sandbox)
     -------------------------------------------------------------------------- */
  let webLinks = []; // Array of links: { from: nodeId, to: nodeId }
  let selectedNode = null;

  // Trophic relationships database
  const validTrophicLinks = [
    { from: "sun", to: "grass" },
    { from: "sun", to: "bidens" },
    { from: "grass", to: "butterfly" },
    { from: "bidens", to: "butterfly" },
    { from: "grass", to: "millipede" },
    { from: "bidens", to: "earthworm" },
    { from: "butterfly", to: "whiteeye" },
    { from: "butterfly", to: "spider" },
    { from: "millipede", to: "whiteeye" },
    { from: "earthworm", to: "whiteeye" },
    { from: "spider", to: "whiteeye" }
  ];

  const nodeData = [
    // Column 1: Energy Source
    { id: "sun", label: "☀️ 陽光 (Energy)", col: 1, type: "source" },
    // Column 2: Producers
    { id: "grass", label: "🌿 地毯草 (Producer)", col: 2, type: "producer" },
    { id: "bidens", label: "🌼 咸豐草 (Producer)", col: 2, type: "producer" },
    // Column 3: Herbivores / Primary Consumers / Detritivores
    { id: "butterfly", label: "🦋 黃蝶 (Herbivore)", col: 3, type: "herbivore" },
    { id: "millipede", label: "🐛 馬陸 (Detritivore)", col: 3, type: "herbivore" },
    { id: "earthworm", label: "🪱 蚯蚓 (Detritivore)", col: 3, type: "herbivore" },
    // Column 4: Carnivores / Secondary Consumers
    { id: "spider", label: "🕷️ 蠅虎 (Carnivore)", col: 4, type: "carnivore" },
    { id: "whiteeye", label: "🐦 綠繡眼 (Carnivore)", col: 4, type: "carnivore" }
  ];

  function initFoodWebSandbox() {
    const nodesContainer = document.getElementById("food-web-nodes");
    if (!nodesContainer) return;

    nodesContainer.innerHTML = "";
    webLinks = [];
    selectedNode = null;

    // Create column structures
    for (let c = 1; c <= 4; c++) {
      const colDiv = document.createElement("div");
      colDiv.className = "sandbox-column";
      
      let colTitle = "";
      if (c === 1) colTitle = "能量來源";
      else if (c === 2) colTitle = "生產者 (植物)";
      else if (c === 3) colTitle = "初級消費者 / 分解者";
      else if (c === 4) colTitle = "次級消費者 (肉食)";
      
      colDiv.innerHTML = `<h5>${colTitle}</h5>`;

      // Filter nodes for this column
      const colNodes = nodeData.filter(n => n.col === c);
      colNodes.forEach(node => {
        const nodeBtn = document.createElement("div");
        nodeBtn.className = "sandbox-node";
        nodeBtn.id = `node-${node.id}`;
        nodeBtn.setAttribute("data-node-id", node.id);
        
        let iconHtml = "";
        if (node.type === "producer") nodeBtn.classList.add("active-producer");
        else if (node.type === "herbivore") nodeBtn.classList.add("active-herbivore");
        else if (node.type === "carnivore") nodeBtn.classList.add("active-carnivore");

        nodeBtn.innerHTML = node.label;
        
        // Node Click Event
        nodeBtn.addEventListener("click", () => handleNodeClick(node.id));

        colDiv.appendChild(nodeBtn);
      });

      nodesContainer.appendChild(colDiv);
    }

    // Append SVG overlay behind nodes
    let svgOverlay = document.getElementById("food-web-svg");
    if (!svgOverlay) {
      svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgOverlay.id = "food-web-svg";
      svgOverlay.setAttribute("class", "food-web-svg");
      document.querySelector(".food-web-sandbox").appendChild(svgOverlay);
    }
    svgOverlay.innerHTML = ""; // Clear existing lines

    // Reset status text
    updateWebStatus();
  }

  function handleNodeClick(nodeId) {
    const nodeEl = document.getElementById(`node-${nodeId}`);
    
    if (selectedNode === null) {
      // Step 1: Select source node
      selectedNode = nodeId;
      nodeEl.classList.add("selected");
      document.getElementById("web-status").textContent = `請點選被捕食者/生產者的「捕食者/消费者」...`;
    } else {
      // Step 2: Select destination node
      const fromNode = selectedNode;
      const toNode = nodeId;
      
      // Remove selection styles
      document.getElementById(`node-${fromNode}`).classList.remove("selected");
      selectedNode = null;

      if (fromNode === toNode) {
        updateWebStatus();
        return;
      }

      // Check if this trophic link is ecologically valid (from -> to, i.e., eaten by)
      const isValid = validTrophicLinks.some(l => l.from === fromNode && l.to === toNode);
      
      if (isValid) {
        // Check if already linked
        const isExist = webLinks.some(l => l.from === fromNode && l.to === toNode);
        if (!isExist) {
          webLinks.push({ from: fromNode, to: toNode });
          drawWebConnections();
          playAlarmBeep(); // Soft confirmation beep
          updateWebStatus();
        } else {
          // Toggle off if exists
          webLinks = webLinks.filter(l => !(l.from === fromNode && l.to === toNode));
          drawWebConnections();
          updateWebStatus();
        }
      } else {
        alert("【不符合大自然的食性關係！】\n請確認是「被吃者/能量來源」連向「捕食者/消費者」！\n例如：地毯草 ➔ 黃蝶 或是 蠅虎 ➔ 綠繡眼。");
        updateWebStatus();
      }
    }
  }

  function drawWebConnections() {
    const svgOverlay = document.getElementById("food-web-svg");
    const containerRect = document.querySelector(".food-web-sandbox").getBoundingClientRect();
    
    svgOverlay.innerHTML = ""; // Clear SVG paths

    webLinks.forEach(link => {
      const fromEl = document.getElementById(`node-${link.from}`);
      const toEl = document.getElementById(`node-${link.to}`);
      
      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      // Calculate relative coordinates in SVG container
      // Output point is center-right of source node
      const x1 = fromRect.right - containerRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
      
      // Input point is center-left of target node
      const x2 = toRect.left - containerRect.left;
      const y2 = toRect.top + toRect.height / 2 - containerRect.top;

      // Draw curved bezier path
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Control points for nice curve
      const dx = Math.abs(x2 - x1) * 0.5;
      const cx1 = x1 + dx;
      const cy1 = y1;
      const cx2 = x2 - dx;
      const cy2 = y2;
      
      path.setAttribute("d", `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
      
      // Color path based on trophic levels
      const sourceNode = nodeData.find(n => n.id === link.from);
      if (sourceNode.type === "producer") {
        path.setAttribute("class", "food-web-path herbivore");
      } else if (sourceNode.type === "herbivore") {
        path.setAttribute("class", "food-web-path carnivore");
      } else {
        path.setAttribute("class", "food-web-path");
      }

      svgOverlay.appendChild(path);
    });
  }

  function updateWebStatus() {
    const totalValid = validTrophicLinks.length;
    const currentCount = webLinks.length;
    const statusEl = document.getElementById("web-status");

    if (currentCount === 0) {
      statusEl.textContent = `生態沙盒：已建立 0 條食性通路`;
      statusEl.style.color = "var(--color-text-muted)";
      statusEl.style.background = "rgba(255,255,255,0.05)";
    } else if (currentCount < totalValid) {
      statusEl.textContent = `生態網路建構中：已鎖定 ${currentCount} / ${totalValid} 條食物鏈！`;
      statusEl.style.color = "var(--color-secondary)";
      statusEl.style.background = "rgba(132, 204, 22, 0.15)";
    } else {
      statusEl.textContent = `🏆 解鎖成就：完美校園生態食物網！`;
      statusEl.style.color = "#fff";
      statusEl.style.background = "var(--color-primary)";
      statusEl.style.boxShadow = "var(--shadow-glow)";
    }
  }

  // Bind Reset Sandbox Button
  const btnResetWeb = document.getElementById("btn-reset-web");
  if (btnResetWeb) {
    btnResetWeb.addEventListener("click", () => {
      initFoodWebSandbox();
    });
  }

  // Redraw SVG links on window resize (since coordinates shift)
  window.addEventListener("resize", () => {
    if (currentSlide === 22) {
      drawWebConnections();
    }
  });


  /* --------------------------------------------------------------------------
     9. Startup & Initialization
     -------------------------------------------------------------------------- */
  showSlide(1); // Set initial slide state
});
