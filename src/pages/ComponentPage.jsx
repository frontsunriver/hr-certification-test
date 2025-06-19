import { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import InputBox from '../components/InputBox';
import DateInputBox from '../components/DateInputBox';
import TextAreaBox from '../components/TextAreaBox';
import RangeSlider from '../components/RangeSelector';
import DropdownList from '../components/DropdownList';
import { StatusBadge } from '../components/Utilities';

export default function ComponentPage() {
  const [selected, setSelected] = useState('');
  return (
    <div>
      <Header></Header>
      <Button className="mb-2">Button</Button>
      <InputBox name="test" placeholder="Uesr Name" className="mb-2"></InputBox>
      <InputBox name="test" placeholder="Number Input" type="number" className="mb-2"></InputBox>
      <DateInputBox name="date" placeholder="Date Input" className="mb-2"></DateInputBox>
      <TextAreaBox name="date" placeholder="Input your bio"></TextAreaBox>
      <RangeSlider
        min={0}
        max={1000}
        values={[0, 1000]}
        onChange={(values) => {
          values;
        }}
      ></RangeSlider>
      <DropdownList
        id="status"
        label="Choose a status"
        value={selected}
        onChange={setSelected}
        renderLabel={(label) => <StatusBadge status={label} />}
        options={[
          { label: 'Approved', value: 'approved' },
          { label: 'Draft', value: 'draft' },
          { label: 'Rejected', value: 'rejected' },
        ]}
      />
    </div>
  );
}
