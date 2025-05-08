import React, { useState } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现搜索逻辑
    console.log('搜索:', searchTerm);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSearch} className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300"
          placeholder="搜索技能..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          搜索
        </button>
      </form>
    </div>
  );
};

export default Search; 