import { useLibraryStore } from "@/store/libraryStore";

export const getCategories = async () => Promise.resolve(useLibraryStore.getState().categories);
export const createCategory = async (payload) =>
  Promise.resolve(useLibraryStore.getState().addCategory(payload));
export const updateCategory = async (id, payload) => {
  useLibraryStore.getState().updateCategory(id, payload);
  return Promise.resolve({ id, ...payload });
};
export const deleteCategory = async (id) => {
  useLibraryStore.getState().deleteCategory(id);
  return Promise.resolve({ id });
};
