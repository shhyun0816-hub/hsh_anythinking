const REACTIONS = ["heart", "joy", "sad", "thumbs_up", "thumbs_down"];

const REACTION_META = {
  heart: { emoji: "❤️", label: "하트" },
  joy: { emoji: "😄", label: "기쁨" },
  sad: { emoji: "😢", label: "슬픔" },
  thumbs_up: { emoji: "👍", label: "엄지척" },
  thumbs_down: { emoji: "👎", label: "엄지다운" },
};

function formatDate(sqliteUtcDate) {
  const date = new Date(sqliteUtcDate.replace(" ", "T") + "Z");
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderCollageBackground() {
  const container = document.getElementById("collage-bg");
  if (!container) return;
  let html = "";
  for (let i = 0; i < 27; i++) {
    const src = `/images/collage/banksy-${(i % 9) + 1}.jpg`;
    html += `<div class="collage-tile" style="background-image:url('${src}')"></div>`;
  }
  html += `<div class="collage-overlay"></div>`;
  container.innerHTML = html;
}

function renderHeaderFooter() {
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <div class="site-header-inner">
        <a href="/" class="logo">아무생각</a>
        <nav class="site-nav">
          <a href="/write.html">글쓰기</a>
        </nav>
      </div>
    `;
  }
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.textContent = "아무생각 · 아무나 쓰는 게시판";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCollageBackground();
  renderHeaderFooter();
});
