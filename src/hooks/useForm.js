import { useState } from 'react';

// 입력값, 제출 중 상태, 성공·오류 문구를 관리한다.
// onSubmit이 실패하면 입력값을 그대로 두어 다시 시도할 수 있게 한다.
export function useForm({ initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setError('');
    setMessage('');
  };

  const bind = (name) => ({ name, value: values[name], onChange: handleChange });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const successMessage = await onSubmit(values);
      setValues(initialValues);
      setMessage(successMessage ?? '');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, bind, handleSubmit, isSubmitting, error, message };
}
