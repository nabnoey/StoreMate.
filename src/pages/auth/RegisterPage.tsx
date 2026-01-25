import logo from "../../assets/logo.png"
import Auth from "../../assets/Auth.png"

function RegisterPage() {
  
   return (
    <div className="min-h-screen flex bg-white justify-end mr-40 items-start pt-24 bg-base-100">
      {/* Image */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={Auth}
          alt="Auth"
          className="w-[513px] h-auto mt-[-150px] mb-[-37.5px] mr-60"
        />
        <p className="text-black text-[30px] mt-[-160px] -ml-52.5 font-medium text-center">
          Create your Store mate Account
        </p>
      </div>

      {/* Register Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative">
        <div className="absolute top-4 right-4">
          <img src={logo} alt="logo" className="w-40 h-40 mt-[-30px]" />
        </div>

        <h2 className="text-xl font-bold mb-6 text-black">REGISTRATION</h2>

        <input
          type="text"
          name="name"
        //   value={user.name}
        //   onChange={handleChange}
          placeholder="name"
          className="input input-bordered w-full mb-4 bg-white text-black"
        />

        <input
          type="email"
          name="email"
        //   value={user.email}
        //   onChange={handleChange}
          placeholder="example@gmail.com"
          className="input input-bordered w-full mb-4 bg-white text-black"
        />

        <input
          type="text"
          name="phone"
        //   value={user.phone}
        //   onChange={handleChange}
          placeholder="081-234-5678"
          className="input input-bordered w-full mb-4 bg-white text-black"
        />

        <input
          type="password"
          name="password"
        //   value={user.password}
        //   onChange={handleChange}
          placeholder="at least 8 digits"
          className="input input-bordered w-full mb-4 bg-white text-black"
        />

        <input
          type="password"
          name="confirmPassword"
        //   value={user.confirmPassword}
        //   onChange={handleChange}
          placeholder="Confirm Password"
          className="input input-bordered w-full mb-6 bg-white text-black"
        />

        <button
        //   onClick={handleSubmit}
          className="btn w-full bg-green-400 text-black border-none"
        >
          Register
        </button>
      </div>
    </div>
  );
}


export default RegisterPage