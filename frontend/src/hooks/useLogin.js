import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState();
  const { setAuthUser } = useAuthContext();
  const login = async (username, password) => {
    const success = handleInputErrors({
      username,
      password,
    });
    if (!success) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { username, password },
        { withCredentials: true }
      );
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;
function handleInputErrors({ username, password }) {
  if (!username || !password) {
    toast.error("please fill in all fields");
    return false;
  }
  return true;
}
