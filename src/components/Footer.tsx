import React from "react";
import logo from "../assets/logo.png";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaGoogle,
  FaPinterestP,
  FaRss,
} from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-600">
      <div className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-center ">
        
    
    <div className="flex justify-center md:justify-start mt-6">
  <img
    src={logo}
    alt="StoreMate Logo"
    className="w-[205px]"
  />
</div>

      
        <div className="text-center space-y-3 text-sm">
          <p>
            📍 345 Faulconer Drive, Suite 4, Charlottesville, CA 12345
          </p>
<div className="flex items-center justify-center gap-6 text-sm text-blue-600 ">
  <p className="flex items-center gap-2">
    <MdLocalPhone className="text-base w-30px" />
    (123) 456-7890
  </p>

  <p className="flex items-center gap-2">
    <AiFillPrinter className="text-base" />
    (123) 456-7890
  </p>
</div>

        
          <div className="flex justify-center gap-4 pt-2 text-blue-600 text-lg">
            <div className="text-gray-400 font-light">Social Media</div>
         
            <a href="#" className="hover:text-blue-800">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-800">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-blue-800">
              <FaYoutube />
            </a>
            <a href="#" className="hover:text-blue-800">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-800">
              <FaGoogle />
            </a>
            <a href="#" className="hover:text-blue-800">
              <FaPinterestP />
            </a>
            <a href="#" className="hover:text-blue-800">
              <FaRss />
            </a>
          </div>
        </div>

        {/* RIGHT : EMPTY (BALANCE LAYOUT) */}
        <div />
      </div>

    
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-10 py-4 flex flex-col md:flex-row justify-between items-center text-xs gap-2">
          

          <div className="flex gap-4 flex-wrap justify-center">
            <span className="cursor-pointer hover:text-black">ABOUT US</span>
            <span className="cursor-pointer hover:text-black">CONTACT US</span>
            <span className="cursor-pointer hover:text-black">HELP</span>
            <span className="cursor-pointer hover:text-black">PRIVACY POLICY</span>
            <span className="cursor-pointer hover:text-black">DISCLAIMER</span>
          </div>

 
          <p className="text-gray-400">
            Copyright © 2018 · Lift Media Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
