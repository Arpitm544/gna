import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-sky-900 text-white py-10 relative">
 
      


      <div className="container mx-auto px-6 grid grid-cols-4 gap-10 text-center md:text-left">
        <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">PERFORMLY</h1>
        
        <img src="logoo.png" alt="Logo" className="w-60 h-40 mb-6" />
      </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">COMPANY</h2>
          <ul className="space-y-2">
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Terms & Conditions</li>
            <li className="hover:underline cursor-pointer">Privacy Policy</li>
            <li className="hover:underline cursor-pointer">Careers</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">QUICK LINKS</h2>
          <ul className="space-y-2">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">Features</li>
            <li className="hover:underline cursor-pointer">Pricing</li>
            <li className="hover:underline cursor-pointer">Support</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">FOLLOW US</h2>
          <div className="space-y-2">
            <a href="#" className="hover:text-gray-400 block">Twitter</a>
            <a href="#" className="hover:text-gray-400 block">Instagram</a>
            <a href="#" className="hover:text-gray-400 block">LinkedIn</a>
            <a href="#" className="hover:text-gray-400 block">Facebook</a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Performly. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
