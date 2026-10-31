import { useLibraryStore } from "@/store/libraryStore";
import api from "@/services/api";

const normalizeStudent = (student) => ({
  id: String(student.Id),
  name: student.Name,
  email: student.Email,
  department: student.Department,
});

export const getStudents = async () => {
  const { data } = await api.get("/students");

  if (!Array.isArray(data?.students)) {
    throw new Error("The server returned an invalid students response");
  }

  return data.students.map(normalizeStudent);
};

export const getStudentById = async (id) =>
  Promise.resolve(useLibraryStore.getState().students.find((s) => s.id === id));

export const createStudent = async (payload) => {
  const { data } = await api.post("/students", {
    ...payload,
    role: "student",
  });

  if (!data?.student) {
    throw new Error("The server returned an invalid student response");
  }

  return normalizeStudent(data.student);
};
export const updateStudent = async (id, payload) => {
  useLibraryStore.getState().updateStudent(id, payload);
  return Promise.resolve({ id, ...payload });
};
export const deleteStudent = async (id) => {
  await api.delete(`/students/${encodeURIComponent(id)}`);
  return { id: String(id) };
};
