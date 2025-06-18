import React, { useState, useMemo, useEffect } from 'react';
import { useRequests, useUpdateRequest } from '../hooks/useRequest';
import { format } from 'date-fns';
import InputBox from '../components/InputBox';
import SelectBox from '../components/SelectBox';
import Tab from '../components/Tab/Tab';
import Modal from '../components/Modal';
import RequestCard from '../components/RequestCard';
import RangeSlider from '../components/RangeSelector';
import { InputLabel } from '../components/Utilities';
import { RequestHead } from '../components/RequestCard/RequestCard';

const STATUS_OPTIONS = ['draft', 'submitted', 'approved', 'rejected'];
const SORT_OPTIONS = [
  { value: 'expectedDate', label: 'Expected Date' },
  { value: 'estimatedBudget', label: 'Estmiated Budget' },
];
function SupervisorPage() {
  const { data: requests = [], isLoading } = useRequests();
  const { mutate: updateRequest, reset, isSuccess, isIdle } = useUpdateRequest();
  const [filters, setFilters] = useState({ employeeName: '', budgetRange: [0, 0] });
  const [budgetLimits, setBudgetLimits] = useState([0, 0]);
  const [sortKey, setSortKey] = useState('expectedDate');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  const filteredSorted = useMemo(() => {
    return requests
      .filter(
        (r) =>
          (!filters.employeeName ||
            r.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())) &&
          (!filters.budgetRange[0] || r.estimatedBudget >= parseFloat(filters.budgetRange[0])) &&
          (!filters.budgetRange[1] || r.estimatedBudget <= parseFloat(filters.budgetRange[1])) &&
          (activeTab === 'All' || r.status === activeTab.toLocaleLowerCase())
      )
      .sort((a, b) => {
        if (sortKey === 'expectedDate') return new Date(a.expectedDate) - new Date(b.expectedDate);
        if (sortKey === 'budget') return a.estimatedBudget - b.estimatedBudget;
        return 0;
      });
  }, [filters, sortKey, requests, activeTab]);

  useEffect(() => {
    if (requests && requests.length > 0) {
      const budgets = requests.map((r) => r.estimatedBudget);
      const budgetLimits = [Math.min.apply(this, budgets), Math.max.apply(this, budgets)];
      setBudgetLimits(budgetLimits);
      setFilters({ ...filters, budgetRange: budgetLimits });
    }
  }, [requests]);
  return (
    <div
      className="p-4 max-w-6xl mx-auto"
      role="main"
      aria-label="Supervisor Certification Requests"
    >
      <h1 className="text-gray-100 font-bold mb-4">Certification Requests</h1>

      {/* Filters */}
      <section aria-label="Filter Requests">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <div className="mb-4">
            <InputLabel htmlFor="employeeName"> Employee Name</InputLabel>
            <InputBox
              id="employeeName"
              placeholder="Filter by employee name"
              value={filters.employee}
              onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <InputLabel htmlFor="budgetRange"> Budget Range</InputLabel>
            <RangeSlider
              id="budgetRange"
              min={budgetLimits[0]}
              max={budgetLimits[1]}
              values={filters.budgetRange}
              step={1}
              onChange={(values) => setFilters({ ...filters, budgetRange: values })}
            />
          </div>
          <div></div>
          <div className="mb-4">
            <InputLabel htmlFor="sortField"> Sort by</InputLabel>
            <SelectBox
              value={sortKey}
              id="sortField"
              onChange={(e) => setSortKey(e.target.value)}
              options={SORT_OPTIONS}
              className={'max-w-full'}
            />
          </div>
        </div>

        {/* Sort Options */}
      </section>
      <nav role="tablist" aria-label="Request Status Tabs">
        <Tab
          options={['All', ...STATUS_OPTIONS]}
          active={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
          }}
        />
      </nav>
      <section aria-label="Request Table">
        {/* Requests in Active Tab */}
        {isLoading && <div> Loading...</div>}
        {!isLoading && filteredSorted.length === 0 && (
          <div className="text-xl text-gray-100"> No Result</div>
        )}
        {!isLoading && filteredSorted.length > 0 && (
          <table className="min-w-full table-auto border-collapse border-separate border-spacing-y-3">
            <RequestHead />
            <tbody>
              {filteredSorted.map((req) => (
                <RequestCard
                  key={req.id}
                  data={req}
                  onClick={(e) => {
                    reset();
                    setSelectedRequest(req);
                  }}
                  onChangeStatus={(value) => {
                    console.log(value);
                    updateRequest({
                      id: req.id,
                      data: { status: value },
                    });
                  }}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>
      {/* Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
      >
        {selectedRequest && (
          <>
            <h2 className="text-lg font-bold mb-4">Request Details</h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p className="text-gray-400 font-medium">Employee:</p>
              <p className="text-gray-100">{selectedRequest.employeeName}</p>

              <p className="text-gray-400 font-medium">Expected Date:</p>
              <p className="text-gray-100">
                {format(new Date(selectedRequest.expectedDate), 'yyyy-MM-dd')}
              </p>

              <p className="text-gray-400 font-medium">Budget:</p>
              <p className="text-gray-100">${selectedRequest.estimatedBudget}</p>

              <p className="text-gray-400 font-medium">Description:</p>
              <p className="text-gray-100">{selectedRequest.description}</p>
            </div>

            <div className="mt-6">
              <InputLabel htmlFor="selector_status">Update Status:</InputLabel>
              <SelectBox
                value={selectedRequest.status}
                id="selector_status"
                onChange={(e) => {
                  updateRequest({
                    id: selectedRequest.id,
                    data: { status: e.target.value.toLowerCase() },
                  });
                  setSelectedRequest((prev) => ({ ...prev, status: e.target.value }));
                  setTimeout(() => {
                    setSelectedRequest(null); // close after 2s
                    reset();
                  }, [2000]);
                }}
                options={STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
              />
              {!isIdle && isSuccess && (
                <label className="text-lime-500 mt-1" role="status" aria-live="polite">
                  Updated Successfully! Will close this modal!
                </label>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default SupervisorPage;
