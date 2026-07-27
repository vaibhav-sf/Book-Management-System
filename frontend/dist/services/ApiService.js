"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
class ApiService {
    static async fetchPost(id) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!response.ok) {
            throw new Error("Failed to load book from API.");
        }
        return await response.json();
    }
}
exports.ApiService = ApiService;
