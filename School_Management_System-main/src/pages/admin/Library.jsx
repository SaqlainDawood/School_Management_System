import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBook,
  FiBookOpen,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import SearchBar from '../../components/common/SearchBar';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/api/library', { params: { search } });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Library Management"
        subtitle="Manage books and borrowing"
        actions={
          <Button variant="primary" icon={FiPlus}>
            Add Book
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar
            onSearch={setSearch}
            placeholder="Search by title, author, or ISBN..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FiBook className="text-primary-500" />
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                      {book.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {book.author}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-yellow-600">
                    <FiEdit2 className="text-xs" />
                  </button>
                  <button className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-red-600">
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="text-gray-600 dark:text-gray-300">
                  ISBN: {book.isbn}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  Available: {book.available}/{book.quantity}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                <span className="badge badge-info">{book.category}</span>
                {book.available > 0 ? (
                  <span className="badge badge-success">Available</span>
                ) : (
                  <span className="badge badge-danger">Out of Stock</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <FiBookOpen className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;