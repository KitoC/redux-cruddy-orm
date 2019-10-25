import jwtDecode from "jwt-decode";

const getCurrentUser = () => {
  const token = localStorage.getItem("token");

  if (token) return jwtDecode(token);

  return null;
};

export { getCurrentUser };
