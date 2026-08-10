const memories = [
  { src: "src/1第一次去见你.jpg", title: "第一次去见你" },
  { src: "src/2第一次一起出cos.jpg", title: "第一次一起出 cos" },
  { src: "src/3第一次一起去水族馆.jpg", title: "第一次一起去水族馆" },
  { src: "src/4第一次换一种身份去去见你.jpg", title: "第一次换一种身份去见你" },
  { src: "src/5第一次牵手.jpg", title: "第一次牵手" },
  { src: "src/6第一次？？.jpg", title: "第一次？？" },
  { src: "src/7第一次一起k歌.jpg", title: "第一次一起 K 歌" },
  { src: "src/8第一次出去旅游.jpg", title: "第一次出去旅游" },
  { src: "src/9第一次一起去迪士尼.jpg", title: "第一次一起去迪士尼" },
  { src: "src/10很安心的地方.jpg", title: "很安心的地方" },
  { src: "src/11第一个一白天.png", title: "第一个一白天" },
  { src: "src/12去长沙啦.jpg", title: "去长沙啦" },
  { src: "src/13第一次一起做蛋糕.jpg", title: "第一次一起做蛋糕" },
  { src: "src/13第一次一起看比赛.jpg", title: "第一次一起看比赛" },
  { src: "src/14第一次一起经营小铺.jpg", title: "第一次一起经营小铺" },
];

const rollPhotos = [
  "src/roll/251141.JPG",
  "src/roll/7051076b03e6bda5a8b1eb8e2276be64.JPG",
  "src/roll/e9a7b23e7a73cd00cf28371fcec51520.JPG",
  "src/roll/IMG_0244.JPG",
  "src/roll/IMG_0245.JPG",
  "src/roll/IMG_0479.JPG",
  "src/roll/IMG_7845.JPG",
  "src/roll/IMG_8116.JPG",
  "src/roll/IMG_8128.JPG",
  "src/roll/IMG_8134.JPG",
  "src/roll/IMG_8145.JPG",
  "src/roll/IMG_8457.JPG",
  "src/roll/IMG_8615.JPG",
  "src/roll/IMG_8622.JPG",
  "src/roll/IMG_8628.JPG",
  "src/roll/IMG_8642.JPG",
  "src/roll/IMG_8655.JPG",
  "src/roll/IMG_8703.JPG",
  "src/roll/IMG_8759.JPG",
  "src/roll/IMG_8765.JPG",
  "src/roll/IMG_8889.JPG",
  "src/roll/IMG_8942.PNG",
  "src/roll/IMG_9117.JPG",
  "src/roll/IMG_9311.JPG",
  "src/roll/IMG_9371.JPG",
  "src/roll/IMG_9395.JPG",
  "src/roll/IMG_9401.JPG",
  "src/roll/IMG_9413.JPG",
  "src/roll/IMG_9628.JPG",
  "src/roll/IMG_9632.JPG",
  "src/roll/IMG_9633.JPG",
  "src/roll/IMG_9654.JPG",
  "src/roll/IMG_9663.JPG",
];

const scenes = [...document.querySelectorAll(".scene")];
const dots = [...document.querySelectorAll(".dot")];
const nextSceneButtons = document.querySelectorAll("[data-next-scene]");
const backButtons = document.querySelectorAll("[data-back-to]");
const albumScene = document.querySelector('[data-scene="album"]');
const finalScene = document.querySelector('[data-scene="final"]');
const wishButton = document.querySelector("#wishButton");
const summonCakeButton = document.querySelector("#summonCake");
const bgm = document.querySelector("#bgm");
const musicToggle = document.querySelector("#musicToggle");
const rollingPhotos = document.querySelector("#rollingPhotos");
const wishCake = document.querySelector("#wishCake");
const wishVignette = document.querySelector("#wishVignette");
const routeTrack = document.querySelector("#routeTrack");
const mapRunners = document.querySelector("#mapRunners");
const journeyPopup = document.querySelector("#journeyPopup");
const popupEyebrow = document.querySelector("#popupEyebrow");
const popupTitle = document.querySelector("#popupTitle");
const journeyStatus = document.querySelector("#journeyStatus");
const restartJourney = document.querySelector("#restartJourney");
const memoryOverlay = document.querySelector("#memoryOverlay");
const closeMemoryButtons = document.querySelectorAll("[data-close-memory]");
const detailEyebrow = document.querySelector("#detailEyebrow");
const detailTitle = document.querySelector("#detailTitle");
const detailText = document.querySelector("#detailText");
const detailText2 = document.querySelector("#detailText2");
const detailImageSlot = document.querySelector("#detailImage").closest(".story-photo-slot");

const sceneThemes = {
  intro: "intro",
  map: "map",
  album: "album",
  final: "final",
};

const detailCopyTemplates = [
  "这张照片本身就已经是这段回忆的标题，后面你只需要把那天最想说的一句话补进去。",
  "如果你想继续细化内容，可以写当时发生了什么、你记住了什么、为什么这件事会一直留到现在。",
];

const FLAG_SPACING = 460;
const SPRINT_FLAG_COUNT = 10;
const BIRTHDAY_AGE = 21;
const FINAL_CARD = {
  eyebrow: "Next Stage",
  title: "携手走进新的一岁",
  hint: "点开进入下一页",
};

const journey = {
  index: 0,
  trackIndex: 0,
  activeTimer: null,
  isPopupOpen: false,
  isDetailOpen: false,
  isFinished: false,
  hasStarted: false,
  phase: "memories",
};

let currentScene = "intro";

function updateMusicButton(isPlaying) {
  if (!musicToggle) {
    return;
  }

  musicToggle.classList.toggle("is-paused", !isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "暂停背景音乐" : "播放背景音乐");
  const label = musicToggle.querySelector(".music-label");
  if (label) {
    label.textContent = isPlaying ? "音乐播放中" : "播放音乐";
  }
}

async function playBgm() {
  if (!bgm) {
    return false;
  }

  try {
    bgm.volume = 0.42;
    await bgm.play();
    updateMusicButton(true);
    return true;
  } catch {
    updateMusicButton(false);
    return false;
  }
}

function setupBgm() {
  if (!bgm || !musicToggle) {
    return;
  }

  bgm.loop = true;
  bgm.volume = 0.42;
  updateMusicButton(!bgm.paused);
  playBgm();

  const unlockMusic = (event) => {
    if (event.target instanceof Element && event.target.closest("#musicToggle")) {
      return;
    }

    if (bgm.paused) {
      playBgm();
    }
  };

  window.addEventListener("pointerdown", unlockMusic, { once: true });
  window.addEventListener("keydown", unlockMusic, { once: true });

  musicToggle.addEventListener("click", async (event) => {
    event.stopPropagation();

    if (bgm.paused) {
      await playBgm();
      return;
    }

    bgm.pause();
    updateMusicButton(false);
  });

  bgm.addEventListener("play", () => updateMusicButton(true));
  bgm.addEventListener("pause", () => updateMusicButton(false));
}

function buildBrokenMarkup(title) {
  return `
    <div class="broken-copy">
      <strong>${title}</strong>
      <small>这张图片加载失败</small>
      <small>请确认文件路径和格式</small>
    </div>
  `;
}

function applyImageFallback(img, title) {
  img.addEventListener("error", () => {
    const slot = img.parentElement;
    img.remove();
    slot.classList.add("is-broken");
    slot.innerHTML = buildBrokenMarkup(title);
  });
}

function clearJourneyTimer() {
  if (journey.activeTimer) {
    clearTimeout(journey.activeTimer);
    journey.activeTimer = null;
  }
}

function setJourneyTimer(callback, delay) {
  clearJourneyTimer();
  journey.activeTimer = setTimeout(callback, delay);
}

function renderJourney() {
  const totalFlags = memories.length + SPRINT_FLAG_COUNT;

  routeTrack.style.width = `${(totalFlags + 3) * FLAG_SPACING}px`;
  routeTrack.innerHTML = Array.from({ length: totalFlags })
    .map((_, index) => {
      const isBonusFlag = index >= memories.length;
      const isFinalFlag = index === totalFlags - 1;
      const label = isFinalFlag ? BIRTHDAY_AGE : index + 1;

      return `
        <button
          class="route-flag ${isBonusFlag ? "route-flag-bonus" : ""} ${
            isBonusFlag && !isFinalFlag ? "route-flag-unlabeled" : ""
          }"
          type="button"
          data-route-index="${index}"
          style="left: ${index * FLAG_SPACING}px"
          aria-label="Route flag ${index + 1}"
        >
          <span>${isBonusFlag && !isFinalFlag ? "" : String(label).padStart(2, "0")}</span>
        </button>
      `;
    })
    .join("");

  routeTrack.querySelectorAll("[data-route-index]").forEach((flag) => {
    flag.addEventListener("click", () => {
      const index = Number(flag.dataset.routeIndex);

      if (
        index === journey.trackIndex &&
        index < memories.length &&
        journey.phase !== "sprint" &&
        currentScene === "map" &&
        !journey.isDetailOpen
      ) {
        journey.index = index;
        arriveAtCurrentFlag();
      }
    });
  });
}

function updateFlagState() {
  routeTrack.querySelectorAll("[data-route-index]").forEach((flag) => {
    const index = Number(flag.dataset.routeIndex);

    flag.classList.toggle("is-active", index === journey.trackIndex && journey.isPopupOpen);
    flag.classList.toggle("is-visited", index < journey.trackIndex);
  });
}

function moveGroundTo(index) {
  routeTrack.style.transform = `translateX(${-index * FLAG_SPACING}px)`;
}

function startJourney() {
  if (journey.hasStarted || journey.isPopupOpen || journey.isDetailOpen || journey.isFinished) {
    return;
  }

  journey.hasStarted = true;
  setJourneyTimer(() => advanceJourney(), 450);
}

function advanceJourney() {
  if (currentScene !== "map" || journey.isDetailOpen) {
    return;
  }

  if (journey.index >= memories.length) {
    startFinalSprint();
    return;
  }

  journey.isPopupOpen = false;
  journey.phase = "memories";
  journey.trackIndex = journey.index;
  routeTrack.classList.remove("is-sprinting");
  mapRunners.classList.remove("is-sprinting");
  journeyPopup.classList.remove("is-visible");
  updateFlagState();
  journeyStatus.textContent = `前往第 ${journey.index + 1} 站`;
  moveGroundTo(journey.trackIndex);
  setJourneyTimer(() => arriveAtCurrentFlag(), journey.index === 0 ? 650 : 2200);
}

function arriveAtCurrentFlag() {
  if (currentScene !== "map") {
    return;
  }

  const memory = memories[journey.index];

  journey.isPopupOpen = true;
  journey.trackIndex = journey.index;
  popupEyebrow.textContent = `Memory ${String(journey.index + 1).padStart(2, "0")}`;
  popupTitle.textContent = memory.title;
  journeyPopup.querySelector("small").textContent = "点开查看这一段回忆";
  journeyStatus.textContent = `抵达：${memory.title}`;
  mapRunners.classList.add("is-jumping");
  updateFlagState();

  setJourneyTimer(() => {
    mapRunners.classList.remove("is-jumping");
    journeyPopup.classList.add("is-visible");
  }, 520);
}

function startFinalSprint() {
  journey.phase = "sprint";
  journey.isPopupOpen = false;
  journeyPopup.classList.remove("is-visible");
  routeTrack.classList.add("is-sprinting");
  mapRunners.classList.add("is-sprinting");
  journeyStatus.textContent = "向新的一岁冲刺";
  updateFlagState();
  sprintPastBonusFlags(1);
}

function sprintPastBonusFlags(step) {
  if (currentScene !== "map" || journey.phase !== "sprint") {
    return;
  }

  if (step > SPRINT_FLAG_COUNT) {
    arriveAtFinalFlag();
    return;
  }

  journey.trackIndex = memories.length + step - 1;
  moveGroundTo(journey.trackIndex);
  updateFlagState();
  setJourneyTimer(() => sprintPastBonusFlags(step + 1), 190);
}

function arriveAtFinalFlag() {
  journey.isFinished = true;
  journey.isPopupOpen = true;
  journey.phase = "final";
  routeTrack.classList.remove("is-sprinting");
  mapRunners.classList.remove("is-sprinting");
  popupEyebrow.textContent = FINAL_CARD.eyebrow;
  popupTitle.textContent = FINAL_CARD.title;
  journeyPopup.querySelector("small").textContent = FINAL_CARD.hint;
  journeyStatus.textContent = FINAL_CARD.title;
  mapRunners.classList.add("is-jumping");
  updateFlagState();

  setJourneyTimer(() => {
    mapRunners.classList.remove("is-jumping");
    journeyPopup.classList.add("is-visible");
  }, 520);
}

function restartJourneyFlow() {
  clearJourneyTimer();
  journey.index = 0;
  journey.trackIndex = 0;
  journey.isPopupOpen = false;
  journey.isDetailOpen = false;
  journey.isFinished = false;
  journey.hasStarted = false;
  journey.phase = "memories";
  routeTrack.classList.remove("is-sprinting");
  mapRunners.classList.remove("is-sprinting");
  journeyPopup.classList.remove("is-visible");
  memoryOverlay.classList.remove("is-open");
  memoryOverlay.setAttribute("aria-hidden", "true");
  moveGroundTo(0);
  updateFlagState();
  journeyStatus.textContent = "准备出发";
  startJourney();
}

function renderRollPhotos() {
  const imageSet = rollPhotos
    .map(
      (src, index) => `
          <div class="photo-tile">
            <img src="${src}" alt="滚动照片 ${index + 1}" />
          </div>
        `,
    )
    .join("");

  rollingPhotos.innerHTML = `
    <div class="photo-band one">
      <div class="photo-strip">${imageSet}${imageSet}</div>
    </div>
    <div class="photo-band two">
      <div class="photo-strip">${imageSet}${imageSet}</div>
    </div>
    <div class="photo-band three">
      <div class="photo-strip">${imageSet}${imageSet}</div>
    </div>
  `;
}

function updateDetail(index) {
  const memory = memories[index];

  detailEyebrow.textContent = `Memory ${String(index + 1).padStart(2, "0")}`;
  detailTitle.textContent = memory.title;
  detailText.textContent = `这一页对应的是“${memory.title}”。你可以把当时最想写下来的那一句话，直接补在这里。`;
  detailText2.textContent = detailCopyTemplates[index % detailCopyTemplates.length];
  detailImageSlot.classList.remove("is-broken");
  detailImageSlot.innerHTML = `<img src="${memory.src}" alt="${memory.title}" />`;

  const freshImage = detailImageSlot.querySelector("img");
  applyImageFallback(freshImage, memory.title);
}

function openMemory(index) {
  updateDetail(index);
  journey.isDetailOpen = true;
  memoryOverlay.classList.add("is-open");
  memoryOverlay.setAttribute("aria-hidden", "false");
}

function closeMemory() {
  if (!journey.isDetailOpen) {
    return;
  }

  journey.isDetailOpen = false;
  journey.isPopupOpen = false;
  memoryOverlay.classList.remove("is-open");
  memoryOverlay.setAttribute("aria-hidden", "true");
  journeyPopup.classList.remove("is-visible");
  journey.index += 1;
  journey.trackIndex = journey.index;
  updateFlagState();

  if (currentScene === "map") {
    setJourneyTimer(() => advanceJourney(), 620);
  }
}

function showScene(sceneName) {
  currentScene = sceneName;

  scenes.forEach((scene) => {
    scene.classList.toggle("scene-active", scene.dataset.scene === currentScene);
  });

  dots.forEach((dot) => {
    const isActive = dot.dataset.goScene === currentScene;
    dot.classList.toggle("dot-active", isActive);
  });

  document.body.dataset.sceneTheme = sceneThemes[currentScene] || "intro";

  if (currentScene === "map") {
    document.body.classList.remove("wish-dark");
    wishScene.classList.remove("candles-out", "is-dark");
    if (journey.isFinished) {
      updateFlagState();
    } else if (!journey.hasStarted) {
      startJourney();
    } else if (!journey.isPopupOpen && !journey.isDetailOpen) {
      setJourneyTimer(() => advanceJourney(), 350);
    }
  } else if (currentScene === "album") {
    resetWishScene();
    clearJourneyTimer();
    memoryOverlay.classList.remove("is-open");
    memoryOverlay.setAttribute("aria-hidden", "true");
    journey.isDetailOpen = false;
    journey.isPopupOpen = false;
    journeyPopup.classList.remove("is-visible");
  } else if (currentScene === "final") {
    if (wishScene.classList.contains("candles-out")) {
      document.body.classList.add("wish-dark");
    }
    summonedCake.classList.remove("is-visible");
    summonCakeButton.textContent = "召唤蛋糕";
    clearJourneyTimer();
    memoryOverlay.classList.remove("is-open");
    memoryOverlay.setAttribute("aria-hidden", "true");
    journey.isDetailOpen = false;
    journey.isPopupOpen = false;
    journeyPopup.classList.remove("is-visible");
  } else {
    document.body.classList.remove("wish-dark");
    wishScene.classList.remove("candles-out", "is-dark");
    clearJourneyTimer();
    memoryOverlay.classList.remove("is-open");
    memoryOverlay.setAttribute("aria-hidden", "true");
    journey.isDetailOpen = false;
    journey.isPopupOpen = false;
    journeyPopup.classList.remove("is-visible");
  }
}

nextSceneButtons.forEach((button) => {
  button.addEventListener("click", () => showScene(button.dataset.nextScene));
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => showScene(dot.dataset.goScene));
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => showScene(button.dataset.backTo));
});

journeyPopup.addEventListener("click", () => {
  if (journey.phase === "final") {
    showScene("album");
    return;
  }

  openMemory(journey.index);
});

closeMemoryButtons.forEach((button) => {
  button.addEventListener("click", () => closeMemory());
});

restartJourney.addEventListener("click", () => restartJourneyFlow());

function extinguishCake() {
  wishScene.classList.add("candles-out");
  wishScene.classList.add("is-dark");
  document.body.classList.add("wish-dark");
}

const wishScene = albumScene.querySelector(".wish-scene");
const blowCandlesButton = document.querySelector("#blowCandles");
const summonedCake = document.querySelector("#summonedCake");

function resetWishScene() {
  wishScene.classList.remove("candles-out", "is-dark");
  document.body.classList.remove("wish-dark");
  blowCandlesButton.disabled = false;
  blowCandlesButton.textContent = "吹灭蜡烛打开贺卡";
}

blowCandlesButton.addEventListener("click", () => {
  blowCandlesButton.disabled = true;
  blowCandlesButton.textContent = "贺卡正在打开";
  extinguishCake();
  setJourneyTimer(() => showScene("final"), 1400);
});

summonCakeButton.addEventListener("click", () => {
  if (summonedCake.classList.contains("is-visible")) {
    summonedCake.classList.remove("is-visible");
    summonCakeButton.textContent = "召唤蛋糕";
    return;
  }

  summonedCake.classList.add("is-visible");
  summonCakeButton.textContent = "收起蛋糕";
});

if (wishButton) {
  wishButton.addEventListener("click", () => {
    document.body.classList.add("wish-made");
    wishButton.textContent = "愿望已经悄悄送达";
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && journey.isDetailOpen) {
    closeMemory();
  }
});

setInterval(() => {
  document.body.classList.toggle("stroll-step");
}, 2200);

renderJourney();
renderRollPhotos();
setupBgm();
updateDetail(0);
moveGroundTo(0);
showScene(currentScene);
