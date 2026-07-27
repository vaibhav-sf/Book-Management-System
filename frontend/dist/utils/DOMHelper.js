"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMHelper = void 0;
class DOMHelper {
    static getValue(id) {
        const element = document.getElementById(id);
        if (element && 'value' in element) {
            return element.value.trim();
        }
        return "";
    }
    static showError(inputId, errorId, message) {
        const errorEl = document.getElementById(errorId);
        const inputEl = document.getElementById(inputId);
        if (errorEl)
            errorEl.textContent = message;
        if (inputEl)
            inputEl.classList.add("border-red-500", "ring-2", "ring-red-500");
    }
    static clearErrors() {
        document.querySelectorAll(".error").forEach((error) => {
            error.textContent = "";
        });
        document.querySelectorAll("input, select").forEach((input) => {
            input.classList.remove("border-red-500", "ring-2", "ring-red-500");
        });
    }
    static showSuccess(message) {
        const toast = document.createElement("div");
        toast.className = "fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50";
        toast.textContent = `✅ ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2800);
    }
}
exports.DOMHelper = DOMHelper;
