export class DOMHelper {
  static getValue<T extends HTMLElement>(id: string): string {
    const element = document.getElementById(id) as T | null;
    if (element && 'value' in element) {
      return (element as unknown as HTMLInputElement | HTMLSelectElement).value.trim();
    }
    return "";
  }

  static showError(inputId: string, errorId: string, message: string): void {
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
}