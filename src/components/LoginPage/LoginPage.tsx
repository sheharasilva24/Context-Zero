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
        } else if (password.length > 256) {
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
        } else if (email.length > 320) {
          return "Email must be less than 320 characters";
        } else if (!isValidEmail) {
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
        <div className="w-screen dynamic-height flex justify-center items-center">
          <div>
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#F4F4F6] w-screen dynamic-height flex justify-center items-center">
      <div className="flex justify-center items-center">
            <div className="flex items-center justify-center  p-3 ">
              {!loadingLogin && (
                <img src="/images/icon.png" alt="logo" className="w-[450px]" />
              )}
              {loadingLogin && <Spinner />}
            </div>
          </div>
        <div className="rounded-md shadow-lg bg-white p-10 relative w-[90%] h-[50%] sm:w-[500px] animate-height align">
          
          <form onSubmit={onSubmit}>
            <p className="text-[#212B36] font-medium text-[25px] mb-[30px] text-center mt-[20%]">
              {headerTitle}
            </p>
            {/* Email Address */}
            <input
              type="text"
              placeholder="Email address"
              className="w-full h-[48px] pl-[12px] pr-[12px] text-black border border-[#18181B] rounded-[5px] outline-none text-[15px]"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            {/* Password */}
            {(mode === "login" || mode === "create") && (
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-[48px] pl-[12px] pr-[70px] text-black border border-[#18181B] rounded-[5px] outline-none text-[15px] mt-4"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                {mode === "login" && (
                  <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
                    <a
                      className="text-[#18181B] text-[15px] font-medium no-underline mr-2 mt-4"
                      onClick={() => setMode("reset")}
                    >
                      Forgot?
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Verify Password */}
            {mode === "create" && (
              <input
                type="password"
                placeholder="Verify Password"
                className="w-full h-[48px] pl-[12px] pr-[12px] text-black border border-[#18181B] rounded-[5px] outline-none text-[15px] mt-4"
                onChange={(e) => setVerifyPassword(e.target.value)}
                value={verifyPassword}
              />
            )}

            <div className="flex justify-center items-center mt-4">
              <input
                type="submit"
                value={capitalize(mode)}
                disabled={
                  isSubmitDisabled || loadingLogin || validationError !== ""
                }
                className="bg-[#18181B] border border-[#18181B] hover:bg-[#404040] rounded-[5px] text-white text-[15px] font-medium cursor-pointer py-2 px-4 disabled:opacity-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mt-4">
              {mode === "login" && (
                <p className="text-center text-[#000000] text-[15px] font-normal">
                  Don't have an account? {" "}
                  <a
                    onClick={() => setMode("create")}
                    className="text-[#717070] text-[15px] font-medium no-underline"
                  >
                    Create account
                  </a>
                </p>
              )}
              {(mode === "create" || mode === "reset") && (
                <p className="text-center text-[#000000] text-[15px] font-normal">
                  Back to{" "}
                  <a
                    onClick={() => setMode("login")}
                    className="text-[#7a7a7a] text-[15px] font-medium no-underline"
                  >
                    Login
                  </a>
                </p>
              )}
            </div>
            {(validationError || error) && (
              <div className="mt-4">
                <div className="flex justify-center items-center">
                  <AlertIcon className="w-[20px] text-red-600 mr-2" />
                  <p className="text-[#18181B] text-[15px]">
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
