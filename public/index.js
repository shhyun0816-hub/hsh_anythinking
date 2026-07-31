async function loadPosts() {
  const container = document.getElementById("post-list-container");
  try {
    const res = await fetch("/api/posts");
    const posts = await res.json();

    if (!posts.length) {
      container.innerHTML =
        '<p class="empty-state">아직 아무 글도 없어요. 첫 글을 남겨보세요.</p>';
      return;
    }

    container.innerHTML = `<ul class="post-list">${posts
      .map((post) => {
        const reactions = REACTIONS.filter((type) => post[type] > 0)
          .map(
            (type) =>
              `<span>${REACTION_META[type].emoji} ${post[type]}</span>`
          )
          .join("");

        return `
          <li class="post-card">
            <a href="/post.html?id=${post.id}">
              <h3>${escapeHtml(post.title)}</h3>
              <p class="excerpt">${escapeHtml(post.content)}</p>
              <div class="post-meta">
                <span>${escapeHtml(post.author_name)} · ${formatDate(post.created_at)}</span>
                <span class="reactions">${reactions}</span>
              </div>
            </a>
          </li>
        `;
      })
      .join("")}</ul>`;
  } catch (err) {
    container.innerHTML =
      '<p class="empty-state">글을 불러오는 중 문제가 생겼어요.</p>';
  }
}

document.addEventListener("DOMContentLoaded", loadPosts);
