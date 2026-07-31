document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("write-form");
  const errorEl = document.getElementById("error");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.textContent = "올리는 중...";

    const body = {
      title: form.title.value,
      content: form.content.value,
      author_name: form.author_name.value,
      author_email: form.author_email.value,
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error ?? "글을 올리는 중 문제가 생겼어요.";
        errorEl.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "올리기";
        return;
      }

      window.location.href = `/post.html?id=${data.id}`;
    } catch (err) {
      errorEl.textContent = "글을 올리는 중 문제가 생겼어요.";
      errorEl.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "올리기";
    }
  });
});
