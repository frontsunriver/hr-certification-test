import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputBox from '../components/InputBox';
import DateInputBox from '../components/DateInputBox';
import TextAreaBox from '../components/TextAreaBox';
import Button from '../components/Button';
import { usePostRequest } from '../hooks/useRequest';
import { useAuth } from '../contexts/authProvider';
import { InputLabel, Panel } from '../components/Utilities';

const RequestForm = () => {
  const { user } = useAuth();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  const { mutate: postRequest, isError, isSuccess, isPending } = usePostRequest();

  const onSubmit = (data) => {
    postRequest(
      {
        employeeId: user.id,
        employeeName: user.username,
        status: 'submitted',
        ...data,
      },
      {
        onSuccess: () => {
          reset();
          alert('Submitted Successfully');
        },
        onError: () => {
          alert('Occured Erro');
        },
      }
    );
  };
  const today = new Date().toISOString().split('T')[0];
  return (
    <Panel>
      <h1 className="mb-10 text-gray-100 font-size-xs">Certification Request</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Description */}
        <div className="mb-4">
          <InputLabel htmlFor="description"> Description</InputLabel>
          <TextAreaBox
            id="description"
            placeholder={'Description'}
            {...register('description', {
              required: 'Description is required.',
              // minLength: {
              //   value: 10,
              //   message: 'Must be at least 10 characters.',
              // },
            })}
          />
          {touchedFields.description && errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Budget */}
        <div className="mb-4">
          <InputLabel htmlFor="budget"> Estimated Budget ($)</InputLabel>
          <InputBox
            type="number"
            id="budget"
            name="estimatedBudget"
            placeholder={'Estimated Budget'}
            step="0.01"
            {...register('estimatedBudget', {
              required: 'Budget is required.',
              validate: (value) => parseFloat(value) > 0 || 'Must be a positive number.',
            })}
          />
          {touchedFields.estimatedBudget && errors.estimatedBudget && (
            <p className="text-red-500 text-sm mt-1">{errors.estimatedBudget.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <InputLabel htmlFor="date">Expected Date</InputLabel>
          <Controller
            control={control}
            name="expectedDate"
            rules={{
              required: 'Date is required.',
              validate: (value) => {
                console.log(value);
                console.log(today);
                const formattedValue = value.toISOString().split('T')[0];
                return (value && formattedValue >= today) || 'Date must be today or in the future.';
              },
            }}
            render={({ field }) => (
              <DateInputBox
                id="date"
                placeholderText="Select a date"
                selected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                dateFormat="yyyy-MM-dd"
              />
            )}
          />
          {touchedFields.expectedDate && errors.expectedDate && (
            <p className="text-red-500 text-sm mt-1">{errors.expectedDate.message}</p>
          )}
        </div>
        <Button
          className={'mx-auto min-w-[50%]'}
          type="submit"
          disabled={Object.keys(errors).length > 0}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Panel>
  );
};

export default function EmployeePage() {
  return <RequestForm />;
}
