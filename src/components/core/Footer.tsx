import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black backdrop-blur-sm text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-8">
              <li>
                <Link
                  href="#courses"
                  className="bg-white text-black hover:text-white hover:bg-black p-2 rounded-md  transition-colors"
                >
                  Short-Term Fun Courses
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="  p-2 rounded-sm bg-white text-primary md:text-white md:bg-transparent hover:bg-white hover:text-primary  transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="#tools"
                  className="  p-2 rounded-sm bg-white text-primary md:text-white md:bg-transparent hover:bg-white hover:text-primary  transition-colors"
                >
                  Given Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Additional Information</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#career"
                  className=" p-2 rounded-sm hover:bg-white hover:text-primary  transition-colors"
                >
                  Career
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className=" p-2 rounded-sm hover:bg-white hover:text-primary  transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className=" p-2 rounded-sm hover:bg-white hover:text-primary  transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p>
              Kalibari Girls School Road, New Barrackpore, Kolkata, West Bengal
            </p>
            <p>Phone: +91 9147714547</p>
            <p>Email: ashaafoundation25@gmail.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>
            &copy; {new Date().getFullYear()} ASHAA Tailoring Institute. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
