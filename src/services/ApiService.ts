import { ApiPost } from "../types/BookTypes.js";

export class ApiService {
  static async fetchPost(id: string | number): Promise<ApiPost> {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!response.ok) {
      throw new Error("Failed to load book from API.");
    }
    return await response.json();
  }
}