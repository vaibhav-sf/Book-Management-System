import { describe, it, expect } from "vitest";
import { FilterService } from "./FilterService.js";
import { IBook } from "../interfaces/IBook.js";

describe("FilterService", () => {
  const sampleBooks: IBook[] = [
    {
      title: "Ramayana",
      author: "Valmiki",
      isbn: "1234567890",
      publicationDate: "2020-01-01",
      genre: "Fiction",
      getBookAge: () => 4,
      getDiscountPrice: () => 100,
      source: "Manual Entry",
      getSource: () => "Manual Entry",
      price: 100
    }
  ];

  it("filters titles case-insensitively", () => {
    const service = new FilterService();
    const resultUpper = service.filterBooks(sampleBooks, "Ram", "", "");
    const resultLower = service.filterBooks(sampleBooks, "ram", "", "");
    expect(resultUpper).toHaveLength(1);
    expect(resultLower).toHaveLength(1);
    expect(resultUpper[0]?.title).toBe("Ramayana");
  });
});
