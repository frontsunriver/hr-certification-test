import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import { useAuth } from '../contexts/authProvider';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBox';
import { InputLabel, Panel } from '../components/Utilities';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async ({ username, password }) => {
    try {
      await login({ username, password });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError('root', { type: 'server', message: msg });
    }
  };

  useEffect(() => {
    if (user) {
      navigate(user.role === 'supervisor' ? '/supervisor' : '/employee');
    }
  }, [user, navigate]);

  return (
    <main role="main" aria-label="Login page">
      <Panel>
        <h1 className="mb-10 text-gray-100 text-2xl font-bold">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-2">
            <InputLabel htmlFor="username">Username</InputLabel>
            <InputBox
              id="username"
              placeholder="Username"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Minimum 3 characters required' },
              })}
            />
            {errors.username && (
              <p id="username-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <InputLabel htmlFor="password">Password</InputLabel>
            <InputBox
              id="password"
              type="password"
              placeholder="Password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters required' },
              })}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p id="form-error" role="alert" className="text-red-500 text-sm mb-4">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            className="mx-auto min-w-[50%]"
            disabled={isSubmitting || Object.keys(errors) > 0}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Panel>
    </main>
  );
}
