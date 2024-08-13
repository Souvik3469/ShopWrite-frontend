import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../pages/api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Loading from "@/components/Loading";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [button, setButton] = useState<boolean>(false);
  const Router = useRouter();
  const queryClient = useQueryClient();
  const { refetchUser } = useUser();
  const {
    reset,
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<LoginFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const showToast = (message: string, type: "success" | "error" = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {
    setButton(true);
    try {
      const response = await loginUser(formData);
      const { data } = response;
      if (response.status === 200) {
        localStorage.setItem("token", data.message.accessToken);
        // queryClient.invalidateQueries({ queryKey: ["user-details"] });
        refetchUser();
        showToast("Login Successful", "success");

        Router.push("/");
      }
      reset();
      setApiError(null);
      setValue("email", "");
      setShowPassword(false);
    } catch (err) {
      setApiError("please verify your credentials");
      showToast("Invalid Credentials", "error");
      setButton(false);
    }
    reset();
    setValue("email", "");
    setShowPassword(false);
  };

  return (
    <div className="flex">
      <div className="hidden lg:block w-1/2 h-screen bg-blue-400">
        <img
          className="object-cover h-full w-full"
          src="https://t4.ftcdn.net/jpg/07/64/55/75/360_F_764557526_HlwV6rYpIxrfhrmlpTzl74INFoMmJs9Z.jpg"
          alt="Login Background"
        />
      </div>
      <div className="flex lg:w-1/2 sm:w-full justify-center p-16">
        <div className="flex flex-col gap-4">
          <div className="p-4 m-4">
            <span className="font-mont text-blue-800 text-4xl font-bold">
              Shop
            </span>
            <span className="font-mont text-blue-400 text-4xl font-bold">
              Write
            </span>
          </div>

          <p className="text-gray-500">Existing User? </p>
          <h1 className="font-bold text-3xl font-mono">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8 my-10">
              <div>
                <TextField
                  required
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  className="w-full rounded-lg text-white"
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </div>
              <div className="relative">
                <TextField
                  required
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  className="w-full rounded-lg text-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <div
                  className="absolute top-8 right-1 translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <AiFillEye size={20} />
                  ) : (
                    <AiFillEyeInvisible size={20} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex mx-10 p-5">
              <p className="text-gray-500">New User?</p>
              <p
                className="text-blue-500 mx-1 hover:cursor-pointer"
                onClick={() => Router.push("/register")}
              >
                {"  "}
                Sign up
              </p>
            </div>
            {!button ? (
              <button
                disabled={isSubmitting}
                className="py-2 px-10 mx-24 my-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-500 hover:text-white hover:scale-110 duration-300"
              >
                Login
              </button>
            ) : (
              <Loading />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
