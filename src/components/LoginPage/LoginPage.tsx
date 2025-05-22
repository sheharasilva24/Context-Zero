import { useEffect, useRef, useState, useCallback } from "react";
import {
  createAccountAPI,
  getUserAPI,
  loginAPI,
  sendPasswordResetAPI,
  resendVerifyEmailAPI,
} from "../../api/userAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { setUser } from "../../reducers/user";
import { useAppDispatch } from "../../hooks/store";
import capitalize from "lodash/capitalize";
import AlertIcon from "../../icons/AlertIcon";
import Spinner from "../Spinner/Spinner";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import isEmail from "validator/es/lib/isEmail";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [mode, setMode] = useState<"login" | "create" | "reset">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [attemptingLogin, setAttemptingLogin] = useState(true);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const lastSentPassowordReset = useRef(0);
  const lastSentEmailVerification = useRef(0);
  

  const attemptLoginWithToken = useCallback(async () => {
    setAttemptingLogin(true);

    try {
      const userResponse = await getUserAPI();

      const redirectPath = location.state?.from?.pathname || "/home";
      dispatch(setUser(userResponse));
      navigate(redirectPath);
      window.localStorage.setItem("hasPreviouslyLoggedIn", "true");
    } catch (e) {
      setAttemptingLogin(false);
      if (window.localStorage.getItem("hasPreviouslyLoggedIn")) {
        setError("Login Expired");
        window.localStorage.removeItem("hasPreviouslyLoggedIn");
      }
    }
  }, [dispatch, location, navigate]);

  const login = async () => {
    try {
      setLoadingLogin(true);
      const loginResponse = await loginAPI(email, password);
      window.localStorage.setItem("hasPreviouslyLoggedIn", "true");
      dispatch(setUser(loginResponse));
      navigate("/home");
      setLoadingLogin(false);
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 403 && e.response?.data?.message === "Email not verified. Please check your email for a verification link.") {
        setError("");
        const result = await Swal.fire({
          title: "Email Not Verified",
          text: "Your email address has not been verified. Please check your email for a verification link.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Resend Verification Email",
          cancelButtonText: "OK",
        });
        if (result.isConfirmed) {
          const currentDate = Date.now();
          if (currentDate - lastSentEmailVerification.current < 1000 * 60 * 1) {
            Swal.fire("Hold Up!", "Please wait 1 minute before resending the verification email.", "warning");
          } else {
            try {
              await toast.promise(resendVerifyEmailAPI(), {
                pending: "Resending verification email...",
                success: "Verification email resent! Please check your inbox.",
                error: "Error resending verification email.",
              });
              lastSentEmailVerification.current = Date.now();
            } catch (resendError) {
              console.error("Error resending email verification:", resendError);
            }
          }
        }
      } else if (
        e instanceof AxiosError &&
        [400, 401].includes(e.response?.status || 0)
      ) {
        setError("Incorrect email or password");
      } else {
        setError("Login Error");
      }
      console.log("Login Error", e);
      setLoadingLogin(false);
    }
  };

  const createAccount = async () => {
    try {
      setLoadingLogin(true);
      const createAccountResponse = await createAccountAPI(email, password);

      if (createAccountResponse.emailSent) {
        await Swal.fire({
          title: "Account Created!",
          text: "An email verification link has been sent to your email address. Please verify your email before logging in.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setMode("login");
      } else {
        dispatch(setUser(createAccountResponse.user));
        navigate("/home");
      }

      setLoadingLogin(false);
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 409) {
        setError("Email Already Exists");
      } else if (e instanceof AxiosError && e.response?.status === 400) {
        setError("Validation Error");
      } else {
        setError("Create Account Error");
      }
      console.log("Create Account Error", e);
      setLoadingLogin(false);
    }
  };

  const resetPassword = async () => {
    try {
      const currentDate = Date.now();
      if (currentDate - lastSentPassowordReset.current < 1000 * 60 * 1) {
        await Swal.fire({
          title: "Please wait 1 minute before resending",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Okay",
        });
        return;
      }

      lastSentPassowordReset.current = Date.now();

      setLoadingLogin(true);

      await toast.promise(sendPasswordResetAPI(email), {
        pending: "Sending password reset...",
        success: "Password Reset Sent",
        error: "Error Sending Password Reset",
      });

      setLoadingLogin(false);
    } catch (e) {
      console.log("Create Account Error", e);
      setLoadingLogin(false);
      if (e instanceof AxiosError && e.response?.status === 404) {
        setError("Email does not exist");
      } else if (e instanceof AxiosError && e.response?.status === 403) {
        setError("Email Verification Not Enabled");
      } else {
        setError("Create Account Failed");
      }
    }
  };

  const isSubmitDisabled = (() => {
    switch (mode) {
      case "login":
        return !email || !password;
      case "create":
        return !email || !password || !verifyPassword;
      case "reset":
        return !email;
      default:
        return false;
    }
  })();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "login") {
      login();
    } else if (mode === "create") {
      createAccount();
    } else if (mode === "reset") {
      resetPassword();
    }
  };

  const headerTitle = (() => {
    switch (mode) {
      case "login":
        return "Login ";
      case "create":
        return "Create an account";
      case "reset":
        return "Reset Password";
      default:
        return "Login to your account";
    }
  })();

  const validationError = (() => {
    if (mode === "login" || mode === "reset") return "";

    if (mode === "create") {
      if (password.length) {
        if (password.length < 6) {
          return "Password must be at least 6 characters";
        } if (password.length > 256) {
          return "Password must be less than 256 characters";
        }
      }

      if (
        password.length &&
        verifyPassword.length &&
        password !== verifyPassword
      ) {
        return "Passwords do not match";
      }

      if (email.length) {
        const isValidEmail = isEmail(email);

        if (email.length < 3) {
          return "Email must be at least 3 characters";
        }
        if (email.length > 320) {
          return "Email must be less than 320 characters";
        }
        if (!isValidEmail) {
          return "Email is invalid";
        }
      }
    }

    return "";
  })();

  useEffect(() => {
    setError("");
  }, [email.length, password.length, verifyPassword.length]);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("hasPreviouslyLoggedIn");
    if (loggedIn === "true") {
      attemptLoginWithToken();
    } else {
      setAttemptingLogin(false);
    }
  }, [attemptLoginWithToken]);

  if (attemptingLogin) {
    return (
      <div>
        <div className="w-screen dynamic-height flex justify-center items-center p-4">
          <div>
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#F4F4F6] w-screen dynamic-height flex flex-col md:flex-row justify-center items-center p-4">
        <div className="flex justify-center items-center mb-6 md:mb-0 md:mr-6">
          <div className="flex items-center justify-center p-3">
            {!loadingLogin && (
              <img src="/images/icon.png" alt="logo" className="w-full max-w-[250px] sm:max-w-[350px] md:max-w-[450px]" />
            )}
            {loadingLogin && <Spinner />}
          </div>
        </div>
        <div className="rounded-md shadow-lg bg-white p-6 sm:p-8 md:p-10 relative w-[95%] max-w-[500px] animate-height">
          
          <form onSubmit={onSubmit}>
            <p className="text-[#212B36] font-medium text-xl sm:text-2xl md:text-[25px] mb-5 sm:mb-[30px] text-center mt-4 sm:mt-[10%] md:mt-[20%]">
              {headerTitle}
            </p>
            {/* Email Address */}
            <input
              type="text"
              placeholder="Email address"
              className="w-full h-[48px] pl-[12px] pr-[12px] text-black border border-[#18181B] rounded-[5px] outline-none text-sm sm:text-[15px]"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            {/* Password */}
            {(mode === "login" || mode === "create") && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-[48px] pl-[12px] pr-[140px] text-black border border-[#18181B] rounded-[5px] outline-none text-sm sm:text-[15px] mt-4"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center mt-4">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      className="text-[#18181B] p-2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <title>Hide password</title>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <title>Show password</title>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-[#18181B] text-sm sm:text-[15px] font-medium no-underline ml-1 pr-2"
                      onClick={() => setMode("reset")}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Verify Password */}
            {mode === "create" && (
              <div className="relative">
                <input
                  type={showVerifyPassword ? "text" : "password"}
                  placeholder="Verify Password"
                  className="w-full h-[48px] pl-[12px] pr-[70px] text-black border border-[#18181B] rounded-[5px] outline-none text-sm sm:text-[15px] mt-4"
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  value={verifyPassword}
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center pr-2 mt-4">
                  <button
                    type="button"
                    className="text-[#18181B] p-2 cursor-pointer"
                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    aria-label={showVerifyPassword ? "Hide verify password" : "Show verify password"}
                  >
                    {showVerifyPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <title>Hide verify password</title>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <title>Show verify password</title>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-center items-center mt-4">
              <input
                type="submit"
                value={capitalize(mode)}
                disabled={
                  isSubmitDisabled || loadingLogin || validationError !== ""
                }
                className="bg-[#18181B] border border-[#18181B] hover:bg-[#404040] rounded-[5px] text-white text-sm sm:text-[15px] font-medium cursor-pointer py-2 px-4 w-full sm:w-auto disabled:opacity-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mt-4">
              {mode === "login" && (
                <p className="text-center text-[#000000] text-[15px] font-normal">
                  Don't have an account? {" "}
                  <button
                    onClick={() => setMode("create")}
                    className="text-[#717070] text-sm sm:text-[15px] font-medium no-underline bg-transparent border-none p-0 cursor-pointer"
                    type="button"
                  >
                    Create account
                  </button>
                </p>
              )}
              {(mode === "create" || mode === "reset") && (
                <p className="text-center text-[#000000] text-[15px] font-normal">
                  Back to{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-[#7a7a7a] text-sm sm:text-[15px] font-medium no-underline bg-transparent border-none p-0 cursor-pointer"
                    type="button"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
            {(validationError || error) && (
              <div className="mt-4">
                <div className="flex justify-center items-center">
                  <AlertIcon className="w-[20px] text-red-600 mr-2" />
                  <p className="text-[#18181B] text-sm sm:text-[15px]">
                    {validationError || error}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-left" pauseOnFocusLoss={false} />
    </div>
  );
};

export default LoginPage;
