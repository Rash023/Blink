import { BottomWarning } from "../components/BottomWarning.jsx";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../../backend/controllers/user.js";
export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notify = () => toast("Invalid Credentials");
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <ToastContainer />
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            type={"text"}
            placeholder="johndoe123@gmail.com"
            label={"Email"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <InputBox
            type={"password"}
            placeholder="123456"
            label={"Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="pt-4">
            <Button
              label={"Sign in"}
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/user/login",
                  {
                    email,
                    password,
                  }
                );

                if (response.status != false) {
                  console.log("here");
                  notify();
                }

                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }}
            />
          </div>

          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
