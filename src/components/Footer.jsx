import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-bold text-indigo-400">EduJobApp</h3>
                        <p className="text-sm text-gray-400">© {new Date().getFullYear()} EduJobApp. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                    </div>
                </div>
                <div className="mt-4 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
                    <p>Connecting students and professionals with their dream opportunities.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
