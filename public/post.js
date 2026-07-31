const postId = new URLSearchParams(window.location.search).get("id");
let currentPost = null;

function renderPost(post) {
  document.title = `${post.title} · 아무생각`;

  const container = document.getElementById("post-container");
  container.innerHTML = `
    <article>
      <div class="post-detail-header">
        <h1 class="section-title">${escapeHtml(post.title)}</h1>
        <p class="meta">${escapeHtml(post.author_name)} · ${formatDate(post.created_at)}</p>
      </div>

      <p class="post-content">${escapeHtml(post.content)}</p>

      <div class="reactions-row" id="reactions-row"></div>

      <section class="comments-section">
        <h2 class="section-title" id="comment-count" style="font-size: 1.125rem"></h2>
        <ul class="comment-list" id="comment-list"></ul>

        <form id="comment-form">
          <div class="form-row">
            <input name="author_name" placeholder="이름" required style="width: 7rem" />
            <input name="author_email" type="email" placeholder="이메일" required style="flex: 1" />
          </div>
          <textarea name="content" placeholder="댓글을 남겨보세요" rows="3" required></textarea>
          <p id="comment-error" class="error-text" style="display: none"></p>
          <button type="submit" id="comment-submit-btn" class="btn">댓글 남기기</button>
        </form>
      </section>
    </article>
  `;

  renderReactions(post);

  const form = document.getElementById("comment-form");
  form.addEventListener("submit", handleCommentSubmit);
}

function renderReactions(post) {
  const row = document.getElementById("reactions-row");
  row.innerHTML = REACTIONS.map(
    (type) => `
      <button class="reaction-btn" data-type="${type}" title="${REACTION_META[type].label}">
        <span>${REACTION_META[type].emoji}</span>
        <span class="count">${post[type]}</span>
      </button>
    `
  ).join("");

  row.querySelectorAll(".reaction-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleReact(btn.dataset.type));
  });
}

async function handleReact(type) {
  const buttons = document.querySelectorAll(".reaction-btn");
  buttons.forEach((b) => (b.disabled = true));

  try {
    const res = await fetch(`/api/posts/${postId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) {
      currentPost = await res.json();
      renderReactions(currentPost);
    }
  } finally {
    buttons.forEach((b) => (b.disabled = false));
  }
}

function renderComments(comments) {
  document.getElementById("comment-count").textContent = `댓글 ${comments.length}`;
  const list = document.getElementById("comment-list");
  list.innerHTML = comments
    .map(
      (c) => `
        <li class="comment-card">
          <p class="content">${escapeHtml(c.content)}</p>
          <p class="meta">${escapeHtml(c.author_name)} · ${formatDate(c.created_at)}</p>
        </li>
      `
    )
    .join("");
}

async function loadComments() {
  const res = await fetch(`/api/posts/${postId}/comments`);
  const comments = await res.json();
  renderComments(comments);
}

async function handleCommentSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById("comment-error");
  const submitBtn = document.getElementById("comment-submit-btn");
  errorEl.style.display = "none";
  submitBtn.disabled = true;
  submitBtn.textContent = "올리는 중...";

  const body = {
    author_name: form.author_name.value,
    author_email: form.author_email.value,
    content: form.content.value,
  };

  try {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error ?? "댓글을 올리는 중 문제가 생겼어요.";
      errorEl.style.display = "block";
      return;
    }

    form.content.value = "";
    await loadComments();
  } catch (err) {
    errorEl.textContent = "댓글을 올리는 중 문제가 생겼어요.";
    errorEl.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "댓글 남기기";
  }
}

async function init() {
  const container = document.getElementById("post-container");

  if (!postId) {
    container.innerHTML = '<p class="empty-state">글을 찾을 수 없습니다.</p>';
    return;
  }

  const res = await fetch(`/api/posts/${postId}`);
  if (!res.ok) {
    container.innerHTML = '<p class="empty-state">글을 찾을 수 없습니다.</p>';
    return;
  }

  currentPost = await res.json();
  renderPost(currentPost);
  await loadComments();
}

document.addEventListener("DOMContentLoaded", init);
