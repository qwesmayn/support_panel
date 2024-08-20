import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Logo from '/logo_bount.png';
import { useAppDispatch, useAppSelector } from '../../hooks/typeHooks';
import { userLogin, userRegister } from '../../store/action_creators/actionCreators';

type FormData = {
  login: string;
  password: string;
  confirmPassword?: string;
  country?: string;
  ip?: string;
  chromeVersion?: string;
  avatar?: string;
};

const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown Browser";
    let version = "Unknown Version";
  
    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Mozilla Firefox";
      version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "Unknown Version";
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
      browserName = "Samsung Internet";
      version = userAgent.match(/SamsungBrowser\/(\d+\.\d+)/)?.[1] || "Unknown Version";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      browserName = "Opera";
      version = userAgent.match(/(Opera|OPR)\/(\d+\.\d+)/)?.[2] || "Unknown Version";
    } else if (userAgent.indexOf("Trident") > -1) {
      browserName = "Internet Explorer";
      version = userAgent.match(/Trident\/(\d+\.\d+)/)?.[1] || "Unknown Version";
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Microsoft Edge";
      version = userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || "Unknown Version";
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Google Chrome";
      version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || "Unknown Version";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
      version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "Unknown Version";
    }
  
    return { browserName, version };
  };

const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Failed to get IP address", error);
    return '';
  }
};

const uLogin: FC = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [ip, setIp] = useState<string>('');
    const [browserVersion, setBrowserVersion] = useState<string>('');
  
    useEffect(() => {
      const fetchIp = async () => {
        const ipAddress = await getIpAddress();
        setIp(ipAddress);
      };
  
      fetchIp();
      const { version } = getBrowserInfo();
      setBrowserVersion(version);
    }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.authReducer);

  const onSubmit = (data: FormData) => {
    if (isLoginMode) {
      dispatch(userLogin({ login: data.login, password: data.password }));
    } else {
      if (data.password === data.confirmPassword) {
        dispatch(userRegister({ 
          login: data.login, 
          password: data.password,
          country: data.country || 'RU',
          ip: ip, 
          chromeVersion: browserVersion || '',
          avatar: data.avatar || ''
        }));
      }
    }
  };

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 font-inter">
      <div className="flex gap-4 items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Panel Logo" src={Logo} className="h-14 w-auto" />
        <h2 className="text-center text-4xl font-medium leading-9 tracking-tight text-white">
          {isLoginMode ? 'Support Panel - Login' : 'Support Panel - Register'}
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
                className="block w-full rounded-full border-0 py-3 px-5 bg-[#1b1b1b] text-white shadow-sm ring-gray-300 placeholder:text-[#515151] placeholder:font-medium focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
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
                className="block w-full rounded-full border-0 py-3 px-5 bg-[#1b1b1b] text-white shadow-sm ring-gray-300 placeholder:text-[#515151] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          {!isLoginMode && (
            <>
              <div>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Подтвердите пароль',
                      validate: (value) =>
                        value === watch('password') || 'Пароли не совпадают',
                    })}
                    placeholder="Подтвердите пароль"
                    autoComplete="new-password"
                    className="block w-full rounded-full border-0 py-3 px-5 bg-[#1b1b1b] text-white shadow-sm ring-gray-300 placeholder:text-[#515151] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-white py-3 px-5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoginMode ? 'Продолжить' : 'Зарегистрироваться'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже зарегистрированы? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default uLogin;
