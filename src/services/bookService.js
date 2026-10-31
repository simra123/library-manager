import { useLibraryStore } from "@/store/libraryStore";

export const getBooks = async () => Promise.resolve(useLibraryStore.getState().books);
export const getBookById = async (id) =>
  Promise.resolve(useLibraryStore.getState().books.find((b) => b.id === id));

export const createBook = async (payload) => {
  useLibraryStore.getState().addBook(payload);
  return Promise.resolve(payload);
};

export const updateBook = async (id, payload) => {
  useLibraryStore.getState().updateBook(id, payload);
  return Promise.resolve({ id, ...payload });
};

export const deleteBook = async (id) => {
  useLibraryStore.getState().deleteBook(id);
  return Promise.resolve({ id });
};
