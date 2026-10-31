import { create } from "zustand";
import booksData from "@/data/books.json";
import categoriesData from "@/data/categories.json";
import studentsData from "@/data/students.json";
import issuedData from "@/data/issued.json";
import activitiesData from "@/data/activities.json";

export type Book = { id: string; title: string; author: string; category: string; quantity: number; available: number };
export type Category = { id: string; name: string; description: string };
export type Student = { id: string; name: string; email: string; department: string };
export type Issued = {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "issued" | "returned";
};
export type ActivityItem = { id: number; action: string; detail: string; time: string };

type State = {
  books: Book[];
  categories: Category[];
  students: Student[];
  issued: Issued[];
  activities: ActivityItem[];
};

type Actions = {
  // books
  addBook: (b: Book) => void;
  updateBook: (id: string, patch: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  // categories
  addCategory: (c: Omit<Category, "id">) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // students
  setStudents: (students: Student[]) => void;
  addStudent: (s: Student) => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  // issue / return
  issueBook: (input: {
    studentId: string; studentName: string;
    bookId: string; bookTitle: string;
    issueDate: string; dueDate: string;
  }) => Issued;
  returnBook: (id: string) => void;
  // activity
  logActivity: (action: string, detail: string) => void;
};

const now = () => "just now";

export const useLibraryStore = create<State & Actions>((set, get) => ({
  books: booksData as Book[],
  categories: categoriesData as Category[],
  students: studentsData as Student[],
  issued: issuedData as Issued[],
  activities: activitiesData as ActivityItem[],

  logActivity: (action, detail) =>
    set((s) => ({
      activities: [
        { id: Date.now(), action, detail, time: now() },
        ...s.activities,
      ].slice(0, 20),
    })),

  addBook: (b) => {
    set((s) => ({ books: [b, ...s.books] }));
    get().logActivity("Book Added", `${b.title} added to catalog`);
  },
  updateBook: (id, patch) =>
    set((s) => ({ books: s.books.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
  deleteBook: (id) => {
    const book = get().books.find((b) => b.id === id);
    set((s) => ({ books: s.books.filter((b) => b.id !== id) }));
    if (book) get().logActivity("Book Removed", `${book.title} removed from catalog`);
  },

  addCategory: (c) => {
    const created = { id: `C${Date.now()}`, ...c };
    set((s) => ({ categories: [created, ...s.categories] }));
    get().logActivity("Category Added", `${created.name} added`);
    return created;
  },
  updateCategory: (id, patch) =>
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
  deleteCategory: (id) => {
    const cat = get().categories.find((c) => c.id === id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
    if (cat) get().logActivity("Category Removed", `${cat.name} removed`);
  },

  setStudents: (students) => set({ students }),
  addStudent: (s) => {
    set((st) => ({ students: [s, ...st.students] }));
    get().logActivity("New Student", `${s.name} registered`);
  },
  updateStudent: (id, patch) =>
    set((s) => ({ students: s.students.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  deleteStudent: (id) => {
    const st = get().students.find((s) => s.id === id);
    set((s) => ({ students: s.students.filter((x) => x.id !== id) }));
    if (st) get().logActivity("Student Removed", `${st.name} removed`);
  },

  issueBook: (input) => {
    const record: Issued = {
      id: `I${Date.now()}`,
      status: "issued",
      returnDate: null,
      ...input,
    };
    set((s) => ({
      issued: [record, ...s.issued],
      books: s.books.map((b) =>
        b.id === input.bookId ? { ...b, available: Math.max(0, b.available - 1) } : b,
      ),
    }));
    get().logActivity("Book Issued", `${input.bookTitle} issued to ${input.studentName}`);
    return record;
  },

  returnBook: (id) => {
    const rec = get().issued.find((i) => i.id === id);
    if (!rec || rec.status === "returned") return;
    const returnDate = new Date().toISOString().slice(0, 10);
    set((s) => ({
      issued: s.issued.map((i) => (i.id === id ? { ...i, status: "returned", returnDate } : i)),
      books: s.books.map((b) =>
        b.id === rec.bookId ? { ...b, available: Math.min(b.quantity, b.available + 1) } : b,
      ),
    }));
    get().logActivity("Book Returned", `${rec.bookTitle} returned by ${rec.studentName}`);
  },
}));
