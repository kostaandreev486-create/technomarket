function $(sel, root = document) {
  return root.querySelector(sel);
}

function init() {
  const form = $("[data-feedback-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    const question = String(fd.get("question") || "").trim();
    if (!name || !contact || !question) {
      alert("Заполните все поля формы.");
      return;
    }
    form.reset();
    alert(`Сообщение отправлено.\n\nИмя: ${name}\nКонтакт: ${contact}\nВопрос: ${question}`);
  });
}

init();

