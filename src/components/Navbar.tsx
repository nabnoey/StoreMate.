import { BiSolidBell } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
function Navbar() {
  return (
    <div><div className="navbar bg-base-100 shadow-sm h-[101px] w-full bg-gray-100">
  <div className="navbar-start">
    <div className="dropdown">
 
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><a>Item 1</a></li>
        <li>
          <a>Parent</a>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
    <a className="btn btn-ghost text-xl text-black">
      <div className="w-48 h-41 ">
      <img  src="/src/assets/logo.png" alt="Logo" />
      </div>
    </a>
  </div>
  <div className="navbar-center hidden lg:flex ">
    <ul className="menu menu-horizontal px-1 text-[18px] text-black font-semibold font-roboto gap-6">
      <li><a>Contact</a></li>
      <li>
        <details>
          <summary>Promotion</summary>
          <ul className="p-2 bg-base-100 w-40 z-1">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </details>
      </li>
      <li><a>About us</a></li>
      <li><a>Product</a></li>
    </ul>
  </div>
  <div className="navbar-end mr-9 flex flex-row gap-5">
    <FiSearch size={28} className="text-black mr-4"/>
    <FaCartShopping size={28} className="text-black mr-4"/>
    <BiSolidBell size={28} className="text-black mr-4"/>
    <a href="/login">
    <FaRegUser size={28} className="text-black mr-4"/>
    </a>
     
    
    {/* <a className="btn">Button</a> */}
  </div>
</div></div>
  )
}

export default Navbar