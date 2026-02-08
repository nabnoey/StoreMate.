import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth/action"; 
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

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // 1. เรียก API ผ่าน Service
      const authData = await loginService(form);

      // 2. ดึง Token และจัดการเรื่อง Name
      const token = authData.token;

      // 💡 จุดที่แก้ไข: เนื่องจาก API ส่งมาแค่ {type, token}
      // เราจะดึงชื่อจาก Email ที่ผู้ใช้พิมพ์ในฟอร์มแทน
      // เช่น "fara@gmail.com" จะถูกตัดเหลือแค่ "fara"
      const userName = form.email.split('@')[0]; 

      // 3. ✅ ส่งข้อมูลเข้า Redux (ส่ง token และ userName ที่เราสร้างขึ้น)
      dispatch(login(token, userName));

      // 4. บันทึกข้อมูลลง Storage
      // เพิ่ม userName เข้าไปใน Object ที่จะเซฟด้วย เพื่อให้ Refresh แล้วชื่อไม่หาย
      const dataToSave = { ...authData, name: userName };
      
      if (rememberMe) {
        localStorage.setItem("auth", JSON.stringify(dataToSave));
      } else {
        sessionStorage.setItem("auth", JSON.stringify(dataToSave));
      }

      // 5. แจ้งเตือนเมื่อสำเร็จ
      await Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        text: `Welcome, ${userName}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      // 6. เปลี่ยนหน้าไปยังหน้าหลัก
      navigate("/");

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid email or password.",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white justify-center lg:justify-end items-center lg:items-start gap-8 lg:gap-20 px-4 lg:mr-40 pt-8 lg:pt-24 text-black">
      {/* Illustration Section */}
      <div className="flex flex-col items-center justify-center mb-10 lg:mb-0 lg:mr-20">
        <img src={auth} alt="Auth" className="w-75 sm:w-100 lg:w-128.25 h-auto lg:-mt-37.5 lg:mb-[-37.5px]" />
        <p className="font-bold text-center text-2xl sm:text-3xl lg:text-4xl mt-4 lg:-mt-45 ml-4 lg:ml-10">
          Login to use our website
        </p>
      </div>

      {/* Login Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-105 p-6 relative border border-gray-100">
        <div className="absolute top-4 right-4 -mt-7.5">
          <img src={logo} alt="logo" className="w-20 sm:w-24 lg:w-40 h-auto" />
        </div>

        <h2 className="text-2xl font-extrabold mb-6 text-center lg:text-left">LOGIN</h2>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Email<span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-white border-gray-300"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password<span className="text-red-500">*</span></label>
            <input
              type="password"
              name="password"
              placeholder="at least 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-white border-gray-300"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 accent-green-400 cursor-pointer"
            />
            <label htmlFor="remember" className="cursor-pointer select-none">Remember me</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-green-400 hover:bg-green-500 text-black text-lg font-bold border-none disabled:bg-gray-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-sm mt-6 gap-2">
          <p className="hover:underline cursor-pointer text-gray-600">Forgot Password?</p>
          <div className="flex items-center">
            <span>Not a member?</span>
            <button
              type="button"
              className="text-blue-500 hover:underline ml-2 font-semibold"
              onClick={() => navigate("/register")}
            >
              Sign up now.
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;