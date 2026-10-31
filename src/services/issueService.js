import { useLibraryStore } from "@/store/libraryStore";

export const getIssued = async () => Promise.resolve(useLibraryStore.getState().issued);
export const getIssuedByStudent = async (studentId) =>
  Promise.resolve(
    useLibraryStore.getState().issued.filter((i) => i.studentId === studentId),
  );
export const issueBook = async (payload) =>
  Promise.resolve(useLibraryStore.getState().issueBook(payload));
export const returnBook = async (id) => {
  useLibraryStore.getState().returnBook(id);
  const rec = useLibraryStore.getState().issued.find((i) => i.id === id);
  return Promise.resolve(rec);
};
