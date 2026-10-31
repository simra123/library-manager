import api from "@/services/api";

const normalizeSession = (data, expectedRole) => {
  if (!data?.token || !data?.user) {
    throw new Error("The server returned an invalid login response");
  }

  if (data.user.role !== expectedRole) {
    throw new Error(`This account does not have the ${expectedRole} role`);
  }

  return {
    token: data.token,
    user: {
      ...data.user,
      id: String(data.user.id),
      role: expectedRole,
    },
  };
};

export const loginAdmin = async ({ email, password }) => {
  const { data } = await api.post("/auth/admin/login", {
    email: String(email).trim(),
    password,
  });

  return normalizeSession(data, "admin");
};

export const loginStudent = async ({ email, password }) => {
  const { data } = await api.post("/auth/student/login", {
    email: String(email).trim(),
    password,
  });

  return normalizeSession(data, "student");
};

export const forgotPassword = async ({ email }) =>
  Promise.resolve({ ok: true, email });

export const logout = async () => Promise.resolve({ ok: true });
