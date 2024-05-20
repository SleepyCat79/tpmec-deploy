"use client";
import "./sign_up.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
};
import Link from "next/link";
const userPool = new CognitoUserPool(poolData);

export default function SignUp() {
  const API_VERYFI_EMAIL = ""; /// API for checking the email have already exit or not if not then generate the code and send to the user. It will give the response that the email is valid or not.
  /// in this page we will use the method GET to check the email and send the code to the user
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [check, setCheck] = useState(false);
  const [err, setErr] = useState("");
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  async function check_submit(e) {
    e.preventDefault();
    if (email === "") {
      setErr("Please enter your email");
      return false;
    } else if (!check) {
      setErr("Please accept the terms and privacy");
      return false;
    } else {
      setErr("");
      const tempPassword = "Ecpassword123456";
      const attributeList = [
        new CognitoUserAttribute({
          Name: "given_name",
          Value: "Default",
        }),
        new CognitoUserAttribute({
          Name: "family_name",
          Value: "Default",
        }),
        new CognitoUserAttribute({
          Name: "gender",
          Value: "Default",
        }),
        new CognitoUserAttribute({
          Name: "phone_number",
          Value: "+11111111111",
        }),
        new CognitoUserAttribute({
          Name: "address",
          Value: "Default",
        }),
        new CognitoUserAttribute({
          Name: "birthdate",
          Value: "01/01/2001",
        }),
      ];

      userPool.signUp(
        email,
        tempPassword,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            console.error(err.message || JSON.stringify(err));
            return;
          }
          console.log("Verification code sent to " + email);
        }
      );
      /// make the request (METHOD GET) to the api for checking mail and send the code to the user if the response is oke we wil navigate to the checking code page
      router.push(`/sign_up_1/${encodeURIComponent(email)}`);
      return true;
    }
  }
  return (
    <form className="container" onSubmit={check_submit}>
      <div className="header_container">
        <h1 className="title">Create your account!</h1>
      </div>
      <div className="form_container_sign_up">
        <input
          type="email"
          placeholder="Enter your email here"
          className="input_mail_verify"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <div className="term_container">
          <input
            type="checkbox"
            checked={check}
            onChange={() => setCheck(!check)}
          ></input>
          <div className="term_content">
            <p>I have read and accepted with the</p>
            <Link href="/"> terms and privacy</Link>
            <p> of website</p>
          </div>
        </div>
      </div>
      <div>
        <p className="err_msg_sign_up_1">{err}</p>
      </div>
      <button className="btn_next" type="submit">
        Next
      </button>
    </form>
  );
}
