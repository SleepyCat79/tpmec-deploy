"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./home.css";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID, // Your User Pool ID
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID, // Your Client ID
};

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const router = useRouter();
  const userPool = new CognitoUserPool(poolData);
  let cognitoUser = userPool.getCurrentUser();

  useEffect(() => {
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err);
          return;
        }
        cognitoUser.getUserAttributes(function (err, attributes) {
          if (err) {
            // Handle error
          } else {
            // Do something with attributes
            const sub = attributes.find(
              (attribute) => attribute.Name === "sub"
            ).Value;
            router.push(`/homepage/${encodeURIComponent(sub)}`);
            setIsSignedIn(true);
          }
        });
      });
    } else {
      setIsSignedIn(false);
    }
  }, []);

  const handleShopping = () => {
    router.push("/homepage/guess");
  };

  if (isSignedIn === null) {
    return <div>Loading...</div>; // or render a loading spinner
  }

  if (isSignedIn) {
    return null; // or redirect to homepage
  }

  return (
    <div className="home">
      <div className="content">
        <p>Content</p>
        <button onClick={handleShopping}>Shopping</button>
      </div>
    </div>
  );
}
