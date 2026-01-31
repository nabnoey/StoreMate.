import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import { loginService } from "../../services/auth.service";
import logo from "../../assets/logo.png";
import auth from "../../assets/Auth.png";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  // console.log("LOGIN FORM:", form)

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
    const { logIn } = useContext(UserContext)!; 

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Handle login submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const authData = await loginService(form);
            logIn(authData.token);

      // ถ้าอยากให้ Remember Me คุมการเก็บ token
      if (rememberMe) {
        localStorage.setItem("auth", JSON.stringify(authData));
      } else {
        sessionStorage.setItem("auth", JSON.stringify(authData));
      }

      // ✅ SweetAlert2: Login Success
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

      // ❌ SweetAlert2: Login Error
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid email or password. Please try again.",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row 
      bg-white
      justify-center lg:justify-end 
      items-center lg:items-start
      gap-8 lg:gap-20
      px-4 lg:mr-40 
      pt-8 lg:pt-24"
    >
      {/* Auth Section */}
      <div className="flex flex-col items-center justify-center mb-10 lg:mb-0 lg:mr-20">
        <img
          src={auth}
          alt="Auth"
          className="
            w-[300px] sm:w-[400px] lg:w-[513px] 
            h-auto
            lg:mt-[-150px] 
            lg:mb-[-37.5px]
          "
        />
        <p
          className="
            text-black font-bold text-center
            text-2xl sm:text-3xl lg:text-4xl
            mt-4 lg:mt-[-160px]
            ml-4 lg:ml-10
          "
        >
          Login to use our website
        </p>
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl 
        w-full max-w-[420px] 
        p-6 relative"
      >
        {/* Logo */}
        <div className="absolute top-4 right-4">
          <img
            src={logo}
            alt="logo"
            className="w-20 sm:w-24 lg:w-40 h-auto"
          />
        </div>

        <h2 className="text-2xl font-extrabold mb-6 text-black text-center lg:text-left">
          LOGIN
        </h2>

        {/* Email */}
        <label className="label p-0 mb-1">
          <span className="font-semibold text-black">
            Email<span className="text-red-500">*</span>
          </span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-4 bg-white border-gray-300 text-black"
        />

        {/* Password */}
        <label className="label p-0 mb-1">
          <span className="font-semibold text-black">
            Password<span className="text-red-500">*</span>
          </span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="at least 8 digits"
          value={form.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-4 bg-white border-gray-300 text-black"
        />

        {/* Remember me */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-green-400"
          />
          <label
            htmlFor="remember"
            className="text-gray-800 cursor-pointer select-none"
          >
            Remember me
          </label>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn w-full rounded-lg 
          bg-green-400 text-black text-lg font-bold 
          border-none disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <div
          className="text-black flex flex-col sm:flex-row 
          justify-between items-center text-sm mt-4 gap-2"
        >
          <p className="hover:underline cursor-pointer">
            Forgot Password
          </p>

          <div className="flex items-center">
            <span>Not a member?</span>
            <a
              href="/register"
              className="text-blue-500 hover:underline ml-2"
            >
              Sign up now.
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;