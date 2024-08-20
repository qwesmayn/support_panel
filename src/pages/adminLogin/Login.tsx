import { FC } from 'react';
import { useForm } from 'react-hook-form';
import Logo from '/logo_bount.png';
import { useAppDispatch, useAppSelector } from '../../hooks/typeHooks';
import { adminLogin } from '../../store/action_creators/actionCreators';

type FormData = {
  login: string;
  password: string;
};

const Login: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const dispatch = useAppDispatch()
  const {error} = useAppSelector((state) => state.authReducer)

  const onSubmit = (data: FormData) => {
      dispatch(adminLogin(data))
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 font-inter">
      <div className="flex gap-4 items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Panel Logo" src={Logo} className="h-14 w-auto" />
        <h2 className="text-center text-4xl font-medium leading-9 tracking-tight text-white">
          Support Pannel
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="mt-2">
              <input
                id="login"
                {...register('login', { required: 'Введите логин' })}
                placeholder="Введите логин"
                autoComplete="login"
                className="block w-full rounded-full border-0 py-3 px-5 bg-[#1b1b1b] text-white shadow-sm  ring-gray-300 placeholder:text-[#515151] placeholder:font-medium focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
              />
              {errors.login && (
                <p className="mt-2 text-sm text-red-500">{errors.login.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Введите пароль',
                })}
                placeholder="Введите пароль"
                autoComplete="current-password"
                className="block w-full rounded-full border-0 py-3 px-5 bg-[#1b1b1b] text-white shadow-sm  ring-gray-300 placeholder:text-[#515151] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-white py-3 px-5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Продолжить
            </button>
          </div>
          {errors && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
        </form>
      </div>
    </div>
  );
};

export default Login;
