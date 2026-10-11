import React, { useState, useEffect } from 'react';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/assignments/my-assignments');
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (assignment) => {
    if (!assignment.submission) {
      return <span className="badge badge-warning">Not Submitted</span>;
    }
    if (assignment.submission.status === 'graded') {
      return <span className="badge badge-success">Graded</span>;
    }
    return <span className="badge badge-info">Submitted</span>;
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="My Assignments"
        subtitle="View and submit assignments"
      />

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
            <FiFileText className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No assignments available
            </p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <FiFileText className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {assignment.title}
                    </h3>
                    {getStatusBadge(assignment)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {assignment.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>Subject: {assignment.subject?.name}</span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-xs" />
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                    <span>Total Marks: {assignment.totalMarks}</span>
                  </div>

                  {assignment.submission && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {assignment.submission.status === 'graded' ? (
                          <>
                            <span className="font-medium">Marks:</span>{' '}
                            {assignment.submission.marks} /{' '}
                            {assignment.totalMarks}
                            {assignment.submission.feedback && (
                              <span className="ml-4">
                                <span className="font-medium">Feedback:</span>{' '}
                                {assignment.submission.feedback}
                              </span>
                            )}
                          </>
                        ) : (
                          'Submitted successfully'
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Submitted:{' '}
                        {formatDate(assignment.submission.submittedAt)}
                      </p>
                    </div>
                  )}
                </div>

                {!assignment.submission && (
                  <Button variant="primary" size="sm">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;