import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-bold text-indigo-900">EduJobApp</h3>
                        <p className="text-sm text-[#90636b]">© {new Date().getFullYear()} EduJobApp. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6 text-sm text-[#1a8377]">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
                    </div>
                </div>
                <div className="mt-4 border-t border-gray-300 pt-4 text-center text-xs text-[#90636b]">
                    <p>Connecting students and professionals with their dream opportunities.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
