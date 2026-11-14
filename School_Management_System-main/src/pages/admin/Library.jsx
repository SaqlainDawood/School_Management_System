import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBook,
  FiBookOpen,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import SearchBar from '../../components/common/SearchBar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/api';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ignore = false;
    const fetchBooks = async () => {
      try {
        const response = await api.get('/api/library', { params: { search } });
        if (ignore) return;
        setBooks(response.data?.books || []);
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching library books:', err);
          setBooks([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [search]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Catalog & Volumes"
        subtitle="Browse and monitor physical and digital library holdings and borrowing records"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Library' },
        ]}
        actions={
          <div title="Book cataloging mutation endpoint pending backend implementation">
            <Button variant="primary" icon={FiPlus} disabled>
              Add Volume
            </Button>
          </div>
        }
      />

      <div className="card overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="max-w-md">
            <SearchBar
              onSearch={setSearch}
              placeholder="Search volumes by title, author, or ISBN..."
            />
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiBookOpen}
              title="No library books found"
              description="No book records returned from the catalog for your query."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5 sm:p-6">
            {books.map((book) => {
              const isAvailable = (book.available || 0) > 0;
              return (
                <div
                  key={book._id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FiBook className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                            {book.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          by {book.author || 'Unknown Author'}
                        </p>
                      </div>

                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          disabled
                          className="p-1 rounded text-slate-400 cursor-not-allowed opacity-50"
                          title="Editing books requires backend update endpoint"
                        >
                          <FiEdit2 className="text-xs" />
                        </button>
                        <button
                          disabled
                          className="p-1 rounded text-slate-400 cursor-not-allowed opacity-50"
                          title="Deleting books requires backend delete endpoint"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>ISBN: {book.isbn || 'N/A'}</span>
                      <span className="font-sans font-semibold text-slate-700 dark:text-slate-300">
                        {book.available || 0} / {book.quantity || 0} Avail
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {book.category || 'General'}
                    </span>
                    <StatusBadge variant={isAvailable ? 'success' : 'danger'} dot>
                      {isAvailable ? 'Available' : 'Checked Out'}
                    </StatusBadge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
