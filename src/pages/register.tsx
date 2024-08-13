import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import Loading from "@/components/Loading";
import { registerUser } from "../pages/api";
import { useQueryClient } from "@tanstack/react-query";

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [button, setButton] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const Router = useRouter();
  const queryClient = useQueryClient();
  const { refetchUser } = useUser();
  const showToast = (message: string, type: "error" | "success" = "error") => {
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

  const {
    reset,
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    setButton(true);
    try {
      const { data } = await registerUser(formData);
      refetchUser();
      showToast("User Registered Successfully", "success");

      // queryClient.invalidateQueries({ queryKey: ["user-details"] });
      Router.push("/login");
      reset();
      setApiError(null);
      setValue("name", "");
      setValue("email", "");
      setValue("password", "");
    } catch (err: any) {
      showToast("Some Error Occurred during Register", "error");
      setApiError(err.response?.data?.message || "Registration failed");
      setButton(false);
    }
  };

  return (
    <div className="flex">
      <div className="hidden lg:block w-1/2 h-screen bg-blue-400">
        <img
          className="object-cover h-full w-full"
          src="https://st.depositphotos.com/1001877/3814/i/450/depositphotos_38143799-stock-photo-e-commerce-shopping-cart-with.jpg"
          alt="Register Background"
        />
      </div>
      <div className="flex lg:w-1/2 sm:w-full h-screen justify-center p-10">
        <div className="flex flex-col ">
          <div className="p-4 m-4">
            <span className="font-mont text-blue-800 text-4xl font-bold">
              Shop
            </span>
            <span className="font-mont text-blue-400 text-4xl font-bold">
              Write
            </span>
          </div>
          <p className="text-gray-500">New User?</p>
          <h1 className="font-bold text-3xl font-mono">Register</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 my-10">
              <div>
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  className="w-full rounded-lg text-white"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm italic">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  className="w-full rounded-lg text-white"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm italic">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  className={`w-full rounded-lg text-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                <div
                  className="absolute top-8 right-1 translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiFillEye size={20} />
                  ) : (
                    <AiFillEyeInvisible size={20} />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm italic">
                    {errors.password.message}
                  </p>
                )}
                {apiError && (
                  <p className="text-red-500 text-sm italic">{apiError}</p>
                )}
              </div>
            </div>
            <div className="flex mx-10 p-5">
              <p className="text-gray-500">Already have an account?</p>
              <p
                className="text-blue-500 hover:cursor-pointer"
                onClick={() => {
                  Router.push("/login");
                }}
              >
                {"  "}Sign In
              </p>
            </div>
            {!button ? (
              <button
                type="submit"
                className="py-2 px-10 mx-24 my-4 bg-blue-400 text-white rounded-xl hover:bg-blue-500 hover:text-white hover:scale-110 duration-300"
              >
                Register
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

export default Register;
