import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../Utilities';
import DropdownList from '../DropdownList';

export default function RequestCard({ data, onClick, onChangeStatus }) {
  return (
    <tr
      onClick={onClick}
      className="hover:bg-gray-800  mb-3 bg-gradient-panel cursor-pointer transition text-left"
    >
      <td className="rounded-l-lg p-4 text-gray-200">{data.employeeName}</td>
      <td className="p-4 text-gray-200">{format(new Date(data.expectedDate), 'yyyy-MM-dd')}</td>
      <td className="p-4 text-gray-200 hidden md:table-cell">{data.description}</td>
      <td className="p-4 text-gray-200 hidden md:table-cell">${data.estimatedBudget}</td>
      <td className="rounded-r-lg p-4 text-gray-200 ">
        {/* <StatusBadge status={data.status} /> */}
        <DropdownList
          id={data.id}
          value={data.status}
          onChange={onChangeStatus}
          renderLabel={(label) => <StatusBadge status={label} />}
          options={[
            { label: 'Draft', value: 'draft' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
          ]}
        />
      </td>
    </tr>
  );
}

export function RequestHead() {
  return (
    <thead>
      <tr>
        <th className="p-4 text-left text-gray-400">Employee</th>
        <th className="p-4 text-left text-gray-400">Expected Date</th>
        <th className="p-4 text-left text-gray-400 hidden md:table-cell">Description</th>
        <th className="p-4 text-left text-gray-400 hidden md:table-cell">Budget</th>
        <th className="p-4 text-left text-gray-400">Status</th>
      </tr>
    </thead>
  );
}
