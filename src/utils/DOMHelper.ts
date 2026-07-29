export class DOMHelper {
  static getValue(id: string): string {
    const el = document.getElementById(id);
    return el instanceof HTMLInputElement || el instanceof HTMLSelectElement ? el.value.trim() : "";
  }

  static showError(inputId: string, message: string): void {
    const errorId = inputId + "Error";
    const errorEl = document.getElementById(errorId);
    const inputEl = document.getElementById(inputId);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add("border-red-500", "ring-2", "ring-red-500");
  }

  static clearErrors(): void {
    document.querySelectorAll(".error").forEach((error) => {
      error.textContent = "";
    });
    document.querySelectorAll("input, select").forEach((input) => {
      input.classList.remove("border-red-500", "ring-2", "ring-red-500");
    });
  }

  static showSuccess(message: string): void {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50";
    toast.textContent = `✅ ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }
  static showToastError(message: string): void {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-5 right-5 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50";
    toast.textContent = `❌ ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }
}