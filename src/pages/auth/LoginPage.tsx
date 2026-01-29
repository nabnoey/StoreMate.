import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth.service";
import { UserContext } from "../../context/UserContext";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

import logo from "../../assets/logo.png";
import auth from "../../assets/Auth.png";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { logIn } = useContext(UserContext)!; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      
      const authData = await loginService(form);
    // console.log(authData);

      logIn(authData.token);
      console.log(authData);


      await Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        text: "Welcome back to StoreMate!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white justify-end mr-40 items-start pt-24 bg-base-100">
      {/* Left image */}
      <div className="hidden lg:block">
        <img src={auth} alt="auth" className="w-128.25 h-auto -mt-37.5 mb-[-37.5px] mr-60" />
          <p className="text-black text-[30px] -mt-40 -ml-52.5 font-medium text-center">
        Login to use our website
        </p>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] p-6 relative"
      >
        <img
          src={logo}
          alt="logo"
          className="absolute top-4 right-4 w-40 h-40 -mt-7.5"
        />

        <h2 className="text-2xl font-bold mb-6 text-black">LOGIN</h2>
<div className="mt-10">
        <label className="block mb-1 font-semibold text-black">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-4 bg-white text-black  border-gray-300"
        />

        <label className="block mb-1 font-semibold text-black">
          Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-6 bg-white text-black  border-gray-300"
        />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn  w-full bg-green-400 text-black font-bold border-green-400"
        >
          
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between text-sm mt-4 text-black">
          <span className="cursor-pointer hover:underline">
            Forgot password?
          </span>
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
