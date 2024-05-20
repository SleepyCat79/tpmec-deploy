"use client";
import "./forgot_password.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Forgot_Password() {
  const API_VERYFI_EMAIL = ""; /// API for checking the email have already exit or not if not then generate the code and send to the user. It will give the response that the email is valid or not.
  /// in this page we will use the method GET to check the email and send the code to the user
  const API_USER = ""; /// API for reset the password. It will give the response that the password is reset or not. METHOD UPDATE( PUT)
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isCheckCode, setIsCheckCode] = useState(false);
  const [canResetPassword, setCanResetPassword] = useState(false); /// if the code is valid then set the state to true and send the user to the reset password page.
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  function handle_show_password(e) {
    e.preventDefault();
    setSeePassword(!seePassword);
  }
  function handle_show_confirm_password(e) {
    e.preventDefault();
    setSeeConfirmPassword(!seeConfirmPassword);
  }
  async function handle_enter_email(e) {
    e.preventDefault();
    if (email === "") {
      setErr("Please enter the email");
      return;
    } else {
      /// write the function to check the email and send the code to the user email.
      /// METHOD GET send the email to the server and get the response that the email is valid or not.
      /// if the email is valid then send the code to the user email. and set the state isCheckCode to true for input the code.
      /// if the email is not valid then set the error message to the user.
      setErr("");
      setIsCheckCode(true);
    }
  }
  async function handle_verify_code(e) {
    e.preventDefault();
    if (code === "") {
      setErr("Please enter the code");
      return;
    } else {
      /// write the function to verify the code and send the user to the reset password page.
      /// METHOD POST send the code and the email to the server and get the response that the code is valid or not.
      /// if the code is valid then send the user to the reset password page. set the state canResetPassword to true.
      /// if the code is not valid then set the error message to the user.
      setErr("");
      setCanResetPassword(true);
    }
  }
  async function handle_reset_password(e) {
    e.preventDefault();
    if (password === "" || confirmPassword === "") {
      setErr("Please enter all the input");
      return;
    } else if (password !== confirmPassword) {
      setErr("Password does not match");
      return;
    } else {
      ///write the code for updating and reset the password.
      alert("password reset");
      router.push("/sign_in");
    }
  }

  return (
    <div className="forgot_password_container">
      {!isCheckCode && !canResetPassword && (
        <div>
          <div>
            <h2>Forgot Password</h2>
          </div>
          <form className="form_forget_password" onSubmit={handle_enter_email}>
            <p>
              Please enter your email address. We will send you a code to reset
              your password.
            </p>
            <input
              placeholder=" youremail@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <button type="submit" className="btn_sendCode">
              Send Code
            </button>
            <div className="err_msg_forget_password">{err}</div>
          </form>
          <Link href="/sign_in">Back to login</Link>
        </div>
      )}
      {isCheckCode && !canResetPassword && (
        <div className="input_code_forget_pass">
          <h2>input code</h2>
          <p>Enter the code we have send you via email</p>
          <form onSubmit={handle_verify_code}>
            <input
              type="text"
              placeholder="enter code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className="verify_code_forget_pass">
              Verify
            </button>
          </form>
          <div className="err_msg_forget_password">{err}</div>
          <button className="btn_resend_code_forget_password">
            resend code
          </button>
        </div>
      )}
      {canResetPassword && (
        <div className="reset_password">
          <h2>Reset Your Password</h2>
          <form onSubmit={handle_reset_password}>
            <p>New Password</p>
            <div className="input_container_reset_password">
              <input
                type={seePassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn_see"
                onClick={(e) => handle_show_password(e)}
              >
                {seePassword ? "hide" : "show"}
              </button>
            </div>
            <p>Confirm Password</p>
            <div className="input_container_reset_password">
              <input
                type={seeConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="btn_see"
                onClick={(e) => handle_show_confirm_password(e)}
              >
                {seeConfirmPassword ? "hide" : "show"}
              </button>
            </div>
            <div className="btn_reset_password">
              {err && <div className="err_msg_forget_password">{err}</div>}
              <button type="submit" className="btn_reset_password">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
