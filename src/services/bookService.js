
import api from "@/services/api";

export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data.books;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data.book;
};

export const createBook = async (payload) => {
  const response = await api.post("/books", payload);
  return response.data.book;
};

export const updateBook = async (id, payload) => {
  const response = await api.put(`/books/${id}`, payload);
  return response.data.book;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};
