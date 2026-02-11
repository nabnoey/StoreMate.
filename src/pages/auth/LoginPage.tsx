import { useState } from "react";
import {useDispatch} from "react-redux";
import {login} from "../../redux/auth/action";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { loginService } from "../../services/auth.service";
import { useNavigate } from "react-router";
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
  const dispatch = useDispatch();

const navigate = useNavigate();



  


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
            dispatch(login({
              token:authData.token,
              isAuthenticated:true
            }))

      // ถ้าอยากให้ Remember Me คุมการเก็บ token
      if (rememberMe) {
        localStorage.setItem("auth", JSON.stringify(authData));
      } else {
        sessionStorage.setItem("auth", JSON.stringify(authData));
      }

      // ✅ SweetAlert2: Login Success
      await Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      // ❌ SweetAlert2: Login Error
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text:
          error.response?.data?.message ||
          "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "โปรดลองอีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

 return (
    <div
      id="login-page-container"
      className="min-h-screen flex flex-col lg:flex-row bg-white justify-center lg:justify-end items-center lg:items-start gap-8 lg:gap-20 px-4 lg:mr-40 pt-8 lg:pt-24"
    >
      {/* Auth Section */}
      <div className="flex flex-col items-center justify-center mb-10 lg:mb-0 lg:mr-20">
        <img
          id="auth-illustration"
          src={auth}
          alt="Auth"
          className="w-[300px] sm:w-[400px] lg:w-[513px] h-auto lg:mt-[-150px] lg:mb-[-37.5px]"
        />
        <p className="text-black font-bold text-center text-2xl sm:text-3xl lg:text-3xl mt-4 lg:mt-[-160px] ml-4 lg:ml-5">
          Login to use our website
        </p>
      </div>

      {/* Login Card */}
      <form
        id="login-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-105 p-6 relative"
      >
        {/* Logo */}
        <div className="absolute top-4 right-4 -mt-7.5">
          <img
            id="login-logo"
            src={logo}
            alt="logo"
            className="w-20 sm:w-24 lg:w-40 h-auto"
          />
        </div>

        <h2 className="text-2xl font-extrabold mb-6 text-black text-center lg:text-left">
          LOGIN
        </h2>

        {/* Email */}
        <label htmlFor="email-input" className="label p-0 mb-1">
          <span className="font-semibold text-black">
            Email<span className="text-red-500">*</span>
          </span>
        </label>
        <input
          id="email-input"
          type="email"
          name="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-4 bg-white border-gray-300 text-black"
          data-testid="login-email"
        />

        {/* Password */}
        <label htmlFor="password-input" className="label p-0 mb-1">
          <span className="font-semibold text-black">
            Password<span className="text-red-500">*</span>
          </span>
        </label>
        <input
          id="password-input"
          type="password"
          name="password"
          placeholder="at least 8 digits"
          value={form.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-4 bg-white border-gray-300 text-black"
          data-testid="login-password"
        />

        {/* Remember me */}
        <div className="flex items-center gap-3 mb-6">
          <input
            id="remember-checkbox"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-green-400"
            data-testid="login-remember-me"
          />
          <label
            htmlFor="remember-checkbox"
            className="text-gray-800 cursor-pointer select-none"
          >
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <button
          id="login-submit-button"
          type="submit"
          disabled={loading}
          className="btn w-full rounded-lg bg-green-400 text-black text-lg font-bold border-none disabled:opacity-50"
          data-testid="login-button"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <div className="text-black flex flex-col sm:flex-row justify-between items-center text-sm mt-4 gap-2">
          <p id="link-forgot-password" className="hover:underline cursor-pointer">
            Forgot Password
          </p>

          <div className="flex items-center">
            <span>Not a member?</span>
            <a
              id="link-register"
              className="text-blue-500 hover:underline ml-2 cursor-pointer"
              onClick={() => navigate("/register")}
              data-testid="go-to-register"
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