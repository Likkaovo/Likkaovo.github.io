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

const scenes = [...document.querySelectorAll(".scene")];
const dots = [...document.querySelectorAll(".dot")];
const nextSceneButtons = document.querySelectorAll("[data-next-scene]");
const backButtons = document.querySelectorAll("[data-back-to]");
const wishButton = document.querySelector("#wishButton");
const albumGrid = document.querySelector("#albumGrid");
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
const journey = {
  index: 0,
  activeTimer: null,
  isPopupOpen: false,
  isDetailOpen: false,
  isFinished: false,
  hasStarted: false,
};

let currentScene = "intro";

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
  routeTrack.innerHTML = memories
    .map(
      (_, index) => `
        <button
          class="route-flag"
          type="button"
          data-route-index="${index}"
          style="left: ${index * FLAG_SPACING}px"
          aria-label="Memory ${index + 1}"
        >
          <span>${String(index + 1).padStart(2, "0")}</span>
        </button>
      `,
    )
    .join("");

  routeTrack.querySelectorAll("[data-route-index]").forEach((flag) => {
    flag.addEventListener("click", () => {
      const index = Number(flag.dataset.routeIndex);

      if (index === journey.index && currentScene === "map" && !journey.isDetailOpen) {
        journey.index = index;
        arriveAtCurrentFlag();
      }
    });
  });
}

function updateFlagState() {
  routeTrack.querySelectorAll("[data-route-index]").forEach((flag) => {
    const index = Number(flag.dataset.routeIndex);

    flag.classList.toggle("is-active", index === journey.index && journey.isPopupOpen);
    flag.classList.toggle("is-visited", index < journey.index);
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
    finishJourney();
    return;
  }

  journey.isPopupOpen = false;
  journeyPopup.classList.remove("is-visible");
  updateFlagState();
  journeyStatus.textContent = `前往第 ${journey.index + 1} 站`;
  moveGroundTo(journey.index);
  setJourneyTimer(() => arriveAtCurrentFlag(), journey.index === 0 ? 650 : 2200);
}

function arriveAtCurrentFlag() {
  if (currentScene !== "map") {
    return;
  }

  const memory = memories[journey.index];

  journey.isPopupOpen = true;
  popupEyebrow.textContent = `Memory ${String(journey.index + 1).padStart(2, "0")}`;
  popupTitle.textContent = memory.title;
  journeyStatus.textContent = `抵达：${memory.title}`;
  mapRunners.classList.add("is-jumping");
  updateFlagState();

  setJourneyTimer(() => {
    mapRunners.classList.remove("is-jumping");
    journeyPopup.classList.add("is-visible");
  }, 520);
}

function finishJourney() {
  journey.isFinished = true;
  journey.isPopupOpen = false;
  journeyPopup.classList.remove("is-visible");
  journeyStatus.textContent = "所有回忆都已经走完啦";
  updateFlagState();
}

function restartJourneyFlow() {
  clearJourneyTimer();
  journey.index = 0;
  journey.isPopupOpen = false;
  journey.isDetailOpen = false;
  journey.isFinished = false;
  journey.hasStarted = false;
  journeyPopup.classList.remove("is-visible");
  memoryOverlay.classList.remove("is-open");
  memoryOverlay.setAttribute("aria-hidden", "true");
  moveGroundTo(0);
  updateFlagState();
  journeyStatus.textContent = "准备出发";
  startJourney();
}

function renderAlbum() {
  albumGrid.innerHTML = memories
    .map(
      (memory) => `
        <button class="memory-card" type="button">
          <span class="photo-slot">
            <img src="${memory.src}" alt="${memory.title}" />
          </span>
          <strong>${memory.title}</strong>
          <small>点击翻开</small>
        </button>
      `,
    )
    .join("");

  albumGrid.querySelectorAll(".memory-card").forEach((card, index) => {
    const image = card.querySelector("img");

    applyImageFallback(image, memories[index].title);
    card.addEventListener("click", () => {
      const tip = card.querySelector("small");
      card.classList.toggle("revealed");
      tip.textContent = card.classList.contains("revealed")
        ? "这张已经放进回忆册啦"
        : "点击翻开";
    });
  });
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
    if (journey.isFinished) {
      updateFlagState();
    } else if (!journey.hasStarted) {
      startJourney();
    } else if (!journey.isPopupOpen && !journey.isDetailOpen) {
      setJourneyTimer(() => advanceJourney(), 350);
    }
  } else {
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
  openMemory(journey.index);
});

closeMemoryButtons.forEach((button) => {
  button.addEventListener("click", () => closeMemory());
});

restartJourney.addEventListener("click", () => restartJourneyFlow());

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
renderAlbum();
updateDetail(0);
moveGroundTo(0);
showScene(currentScene);
