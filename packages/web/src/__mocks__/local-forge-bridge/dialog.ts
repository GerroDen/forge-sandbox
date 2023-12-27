interface ShowDialogParams {
  payload?: unknown;
  onClose?: (response: unknown) => void;
}

export function showDialog({
  payload,
  onClose,
}: ShowDialogParams): HTMLDialogElement {
  const dialog = document.createElement("dialog");
  const content = document.createElement("div");
  const pre = document.createElement("pre");
  pre.style.overflow = "auto";
  pre.style.width = "100%";
  pre.style.maxHeight = "100px";
  pre.append(JSON.stringify(payload, null, 2));
  const textarea = document.createElement("textarea");
  textarea.value = "{}";
  textarea.style.width = "100%";
  const button = document.createElement("button");
  button.textContent = "Close with payload";
  content.append(pre, textarea, button);
  dialog.append(content);
  document.body.append(dialog);
  dialog.showModal();
  button.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    try {
      const response: unknown = JSON.parse(textarea.value);
      dialog.remove();
      onClose?.(response);
    } catch (e) {
      console.error(e);
    }
  });
  return dialog;
}
