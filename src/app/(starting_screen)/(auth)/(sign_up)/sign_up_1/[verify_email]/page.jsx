"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
import "./sign_up_2.css";
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
};
export default function SignUp2({ params }) {
  const API_VERYFI_EMAIL = ""; /// in this page we will use the method POST to check the code
  /// we will make the request that contain email and code which is input by the user
  /// if the response is oke we will navigate to the register information page
  const encodeEmail = params.verify_email;
  const email = decodeURIComponent(encodeEmail);
  const router = useRouter();
  const [code, setCode] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const userPool = new CognitoUserPool(poolData);

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  async function check_submit(e) {
    e.preventDefault();
    if (code === "") {
      alert("Please enter the code");
      return false;
    } else {
      /// make the request (METHOD POST) to the api for checking the code
      setErrMsg("");

      const userPool = new CognitoUserPool(poolData);
      const userData = {
        Username: email,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log("call result: " + result);
        router.push(`/sign_up_1/${encodeEmail}/register_information`);
      });

      return true;
    }
  }
  async function resend_code() {
    setErrMsg("We have sent you a new code");
    /// in this function we will make the request (METHOD GET) to the api for sending the code to the user with the request body contain email
  }
  return (
    <div className="container_sign_up_2">
      <h1>Verify your email</h1>
      <p>Enter the code we have send you via email</p>
      <form className="form_sign_up_2" onSubmit={check_submit}>
        <input
          type="text"
          placeholder="enter code here"
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <button type="submit">Verify</button>
      </form>
      <div>
        {errMsg && <p className="error_message_verify_code">{errMsg}</p>}
      </div>
      <button className="btn_resend_verify_email" onClick={resend_code}>
        resend code
      </button>
    </div>
  );
}
