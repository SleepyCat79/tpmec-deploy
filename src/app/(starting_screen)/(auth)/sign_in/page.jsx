"use client";
import "./sign_in.css";
import { signIn, confirmSignIn } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";

import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        userPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
        loginWith: {
          // Optional
          oauth: {
            domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
            scopes: [
              "openid email phone profile aws.cognito.signin.user.admin ",
            ],
            redirectSignIn: ["http://localhost:3000/", "https://example.com/"],
            redirectSignOut: ["http://localhost:3000/", "https://example.com/"],
            responseType: "code",
          },
          username: "false",
          email: "true", // Optional
          phone: "false", // Optional
        },
      },
    },
  });

  function check_submit(e) {
    e.preventDefault();

    if (email === "") {
      setErr("Please enter your email");
      return;
    } else if (password === "") {
      setErr("Please enter your password");
      return;
    } else {
      setErr("");

      signIn({
        username: email, // use email as the username
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      })
        .then((user) => {
          router.push(`/`);
        })
        .catch((err) => {
          setErr(err.message || JSON.stringify(err));
        });
    }
  }

  return (
    <div className="container">
      <p className="helo"> If you already have the account, just login!</p>
      <form className="form_container" onSubmit={check_submit}>
        <h2>Log In</h2>
        <div className="input_container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <p className="err_msg_logIn">{err}</p>
        </div>
        <button type="submit">Log in</button>
        <div className="forgot_password">
          <Link href="/sign_in/forgot_password">Forgot Password</Link>
        </div>
      </form>
    </div>
  );
}
