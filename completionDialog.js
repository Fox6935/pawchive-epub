export function showEpubCompletionDialog({ processedCount, skippedPosts }) {
  const host = document.createElement("div");
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    dialog {
      box-sizing: border-box;
      width: 400px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 40px);
      overflow: auto;
      padding: 22px;
      border: 1px solid #555;
      border-radius: 8px;
      background: #2c2c2c;
      color: #e0e0e0;
      box-shadow: 0 12px 40px #0009;
      font: 14px/1.5 "Segoe UI", sans-serif;
    }
    dialog::backdrop { background: rgba(0, 0, 0, .65); }
    h2 { font-size: 19px; font-weight: 600; margin: 0 0 10px; line-height: 1.4; }
    p { color: #bbb; margin: 0 0 14px; }
    summary { color: #e5c880; cursor: pointer; }
    ul { margin: 10px 0 0; padding: 0; list-style: none; max-height: 160px; overflow: auto; }
    li { padding: 8px 0; border-top: 1px solid #444; overflow-wrap: anywhere; }
    li span { display: block; color: #bbb; font-size: 13px; }
    .actions { display: flex; justify-content: flex-end; margin-top: 20px; }
    button {
      padding: 7px 20px;
      border: 1px solid #0056b3;
      border-radius: 4px;
      background: #0056b3;
      color: #fff;
      font: inherit;
      cursor: pointer;
    }
    button:focus-visible, summary:focus-visible { outline: 2px solid #89cff0; outline-offset: 3px; }
  `;

  const dialog = document.createElement("dialog");
  dialog.setAttribute("aria-labelledby", "completion-title");
  const heading = document.createElement("h2");
  heading.id = "completion-title";
  const skippedCount = skippedPosts.length;
  heading.textContent = skippedCount
    ? `EPUB created with ${skippedCount} skipped chapter${skippedCount === 1 ? "" : "s"}`
    : "EPUB created";

  const message = document.createElement("p");
  message.textContent = skippedCount
    ? `${processedCount} of ${processedCount + skippedCount} chapters included. Download started.`
    : `${processedCount === 1 ? "1 chapter" : `All ${processedCount} chapters`} included. Download started.`;
  dialog.append(heading, message);

  if (skippedCount) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `View errors (${skippedCount})`;
    const list = document.createElement("ul");
    for (const post of skippedPosts) {
      const item = document.createElement("li");
      item.append(document.createTextNode(post.title));
      const reason = document.createElement("span");
      reason.textContent = post.error;
      item.appendChild(reason);
      list.appendChild(item);
    }
    details.append(summary, list);
    dialog.appendChild(details);
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.autofocus = true;
  closeButton.addEventListener("click", () => dialog.close());
  actions.appendChild(closeButton);
  dialog.appendChild(actions);
  dialog.addEventListener("close", () => host.remove(), { once: true });
  root.append(style, dialog);
  document.body.appendChild(host);
  dialog.showModal();
}
