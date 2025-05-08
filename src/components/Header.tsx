import React from 'react';

const Header = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">点石成金</div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">登录</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              注册
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header; 