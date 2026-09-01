# 📚 Book Management System (BMS)

A production-style **Book Management System** built using **TypeScript** as part of the SourceFuse internship assignments. The project demonstrates modern software engineering practices including **SOLID Principles**, **Object-Oriented Programming**, **Generics**, **Decorators**, **Factory Pattern**, and **GitHub Actions CI**.

---

## 🚀 Features

- Add, Edit and Delete Books
- Search Books by Title
- Filter Books by Genre
- Sort Books (A-Z, Z-A, Newest, Oldest)
- Dashboard Statistics
- Book Age Calculation
- Book Category & Discount Calculation
- Form Validation
- Duplicate Book Detection
- Fetch Books from External API
- Responsive User Interface

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- TypeScript

### Programming Concepts
- Object-Oriented Programming (OOP)
- SOLID Principles
- Generics
- Decorators
- Factory Pattern
- Async/Await
- Promises

### Version Control
- Git
- GitHub

### Continuous Integration
- GitHub Actions

---

# 📂 Project Structure

```text
src
│
├── decorators
│   └── Logger.ts
│
├── factories
│   └── BookFactory.ts
│
├── generics
│   └── Repository.ts
│
├── interfaces
│
├── managers
│   └── BookManager.ts
│
├── models
│   ├── BaseBook.ts
│   ├── PrintedBook.ts
│   └── EBook.ts
│
├── renderers
│   └── BookRenderer.ts
│
├── services
│   ├── ApiService.ts
│   └── FilterService.ts
│
├── utils
│   ├── DashboardRenderer.ts
│   └── DOMHelper.ts
│
├── validators
│   └── BookValidator.ts
│
└── main.ts
```

---

# 🏛️ SOLID Principles Implemented

## 1. Single Responsibility Principle (SRP)

Each class has a single responsibility.

- BookManager → Business Logic
- BookRenderer → UI Rendering
- FilterService → Filtering & Sorting
- BookValidator → Validation
- DashboardRenderer → Dashboard Updates
- ApiService → API Communication
- BookFactory → Object Creation

---

## 2. Open/Closed Principle (OCP)

The project is open for extension through inheritance.

- BaseBook
- PrintedBook
- EBook

New book types can be added without modifying existing model classes.

---

## 3. Liskov Substitution Principle (LSP)

PrintedBook and EBook extend BaseBook and can be used wherever a book object is expected without affecting application behavior.

---

## 4. Interface Segregation Principle (ISP)

The project uses focused interfaces such as:

- `IBook`
- `IRepository<T>`
- `IBookRenderer`
- `IFilterService`
- `IValidator`
- `ISearchFilter`

Each interface represents a specific contract within the application.

---

## 5. Dependency Inversion Principle (DIP)

BookManager receives its dependencies through constructor injection rather than creating them internally.

Dependencies include:

- Repository
- BookRenderer
- FilterService
- BookValidator

---

# 🧩 Design Patterns Used

- Repository Pattern
- Factory Pattern
- Dependency Injection
- Decorator Pattern

---

# 🌐 API Integration

The application integrates with JSONPlaceholder to simulate book fetching.

Features include:

- Fetch Book by ID
- Add API Book
- Duplicate Detection
- Dynamic Rendering

---

# ⚙️ GitHub Actions

The project includes a Continuous Integration workflow.

On every Push and Pull Request GitHub automatically:

- Installs dependencies
- Builds the TypeScript project
- Detects compilation errors

Workflow file:

```text
.github/workflows/ci.yml
```

---

# ▶️ Installation

```bash
git clone <repository-url>

cd Book-Management-System

npm install

npm run build

npm run dev
```

---

# 👨‍💻 Author

**Vaibhav Sharma**

SourceFuse Internship Assignment

2026