import React, { useState, useEffect } from 'react';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiBook,
  FiMessageSquare,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/forms/Button';
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
      setAssignments(response.data?.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionBadge = (assignment) => {
    if (!assignment.submission) {
      return <StatusBadge status="warning" label="Pending Submission" />;
    }
    if (assignment.submission.status === 'graded') {
      return <StatusBadge status="success" label="Graded" />;
    }
    return <StatusBadge status="info" label="Submitted" />;
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coursework & Assignments"
        subtitle="Manage assigned homework, submission deadlines, and instructor grades"
        breadcrumbs={[
          { label: 'Student', href: '/student/dashboard' },
          { label: 'Assignments' },
        ]}
      />

      {assignments.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No Active Assignments"
          description="Your instructors have not assigned any active homework tasks or coursework."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assignments.map((assignment) => {
            const isDueSoon =
              assignment.dueDate &&
              new Date(assignment.dueDate) - new Date() < 86400000 * 3 &&
              !assignment.submission;

            return (
              <div
                key={assignment._id}
                className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 hover:shadow-md transition-all rounded-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {assignment.subject?.name || 'General Subject'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {assignment.title}
                      </h3>
                      {getSubmissionBadge(assignment)}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {assignment.description || 'No detailed instructions provided.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <FiClock className={isDueSoon ? 'text-rose-500' : 'text-slate-400'} />
                        <span className={isDueSoon ? 'text-rose-600 font-bold' : ''}>
                          Due: {formatDate(assignment.dueDate)}
                        </span>
                      </span>
                      <span>Total Marks: <strong className="text-slate-700 dark:text-slate-300">{assignment.totalMarks || 100}</strong></span>
                    </div>

                    {/* Submission evaluation panel */}
                    {assignment.submission && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500 uppercase">Submission Status</span>
                          <span className="text-xs text-slate-400">
                            Submitted: {formatDate(assignment.submission.submittedAt)}
                          </span>
                        </div>

                        {assignment.submission.status === 'graded' ? (
                          <div className="flex items-center gap-4">
                            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                              Marks: {assignment.submission.marks} / {assignment.totalMarks}
                            </span>
                            {assignment.submission.feedback && (
                              <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-xs">
                                <FiMessageSquare /> Feedback: "{assignment.submission.feedback}"
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            Your submission is queued for grading by your instructor.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {!assignment.submission && (
                    <div className="flex-shrink-0 self-start">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => toast.info('Online assignment portal is read-only. Please submit directly in class.')}
                      >
                        Submit Work
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
