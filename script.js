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
const memoryHub = document.querySelector("#memoryHub");
const albumGrid = document.querySelector("#albumGrid");
const detailEyebrow = document.querySelector("#detailEyebrow");
const detailTitle = document.querySelector("#detailTitle");
const detailText = document.querySelector("#detailText");
const detailText2 = document.querySelector("#detailText2");
const detailImage = document.querySelector("#detailImage");
const detailImageSlot = detailImage.closest(".story-photo-slot");

const sceneThemes = {
  intro: "intro",
  map: "map",
  memory: "memory",
  album: "album",
  final: "final",
};

const detailCopyTemplates = [
  "这张照片本身就已经是这段回忆的标题，后面你只需要把那天最想说的一句话补进去。",
  "如果你想继续细化内容，可以写当时发生了什么、你记住了什么、为什么这件事会一直留到现在。",
];

let currentScene = "intro";
let currentMemoryIndex = 0;

function buildBrokenMarkup(title) {
  return `
    <div class="broken-copy">
      <strong>${title}</strong>
      <small>这张图片是 HEIC 或当前浏览器不支持的格式</small>
      <small>建议转成 JPG / PNG 后替换</small>
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

function renderMap() {
  memoryHub.innerHTML = memories
    .map(
      (memory, index) => `
        <button class="hub-item" type="button" data-memory-index="${index}">
          <span class="hub-index">${String(index + 1).padStart(2, "0")}</span>
          <strong>${memory.title}</strong>
          <small>点击查看这一段回忆</small>
        </button>
      `,
    )
    .join("");

  memoryHub.querySelectorAll("[data-memory-index]").forEach((button) => {
    button.addEventListener("click", () => openMemory(Number(button.dataset.memoryIndex)));
  });
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

  currentMemoryIndex = index;
  detailEyebrow.textContent = `Memory ${String(index + 1).padStart(2, "0")}`;
  detailTitle.textContent = memory.title;
  detailText.textContent = `这一页对应的是“${memory.title}”。你可以把当时最想写下来的那一句话，直接补在这里。`;
  detailText2.textContent = detailCopyTemplates[index % detailCopyTemplates.length];
  detailImageSlot.classList.remove("is-broken");
  detailImageSlot.innerHTML = `<img id="detailImage" src="${memory.src}" alt="${memory.title}" />`;

  const freshImage = detailImageSlot.querySelector("img");
  applyImageFallback(freshImage, memory.title);
}

function openMemory(index) {
  updateDetail(index);
  showScene("memory");
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

  if (currentScene === "memory") {
    dots.forEach((dot) => {
      dot.classList.toggle("dot-active", dot.dataset.goScene === "map");
    });
  }

  document.body.dataset.sceneTheme = sceneThemes[currentScene] || "intro";
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

if (wishButton) {
  wishButton.addEventListener("click", () => {
    document.body.classList.add("wish-made");
    wishButton.textContent = "愿望已经悄悄送达";
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && currentScene === "memory") {
    showScene("map");
  }
});

setInterval(() => {
  document.body.classList.toggle("stroll-step");
}, 2200);

renderMap();
renderAlbum();
updateDetail(currentMemoryIndex);
showScene(currentScene);
