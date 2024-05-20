"use client";
import { useState } from "react";
import "./register_information.css";
import { useRouter } from "next/navigation";
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const cognito = new AWS.CognitoIdentityServiceProvider();

export default function RegisterInformation({ params }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const encodeEmail = params.verify_email;
  const email = decodeURIComponent(encodeEmail);
  const [userid, setUserid] = useState("");

  async function handleSubmit(e) {
    console.log("handleSubmit called");

    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    const userAttributesParams = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
      Username: email,
      UserAttributes: [
        {
          Name: "given_name",
          Value: firstName,
        },
        {
          Name: "family_name",
          Value: lastName,
        },
        {
          Name: "gender",
          Value: gender,
        },
        {
          Name: "phone_number",
          Value: phoneNumber,
        },
        {
          Name: "address",
          Value: address,
        },
      ],
    };

    cognito.adminUpdateUserAttributes(
      userAttributesParams,
      async function (err, data) {
        if (err) {
          console.error(err.message || JSON.stringify(err));
          return;
        }
        console.log("User information updated");
      }
    );

    const passwordParams = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID,
      Username: email,
      Password: password,
      Permanent: true,
    };
    const getUserParams = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_Userpool_ID, // Your User Pool Id
      Username: email, // The username of the user you want to get
    };
    cognito.adminSetUserPassword(passwordParams, function (err, data) {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        return;
      }
      console.log("User password updated");
    });

    cognito.adminGetUser(getUserParams, async function (err, data) {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        return;
      }
      const userid = data.UserAttributes.find(
        (attr) => attr.Name === "sub"
      ).Value;
      console.log("User ID: ", userid);

      // Fetch request here
      const res = await fetch("/api/user/information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          User_ID: userid, // Assuming User_ID is the email
          Phone_Number: phoneNumber,
          Email: email,
          Address: [address],
          FName: firstName,
          LName: lastName,
          Date_of_birth: "1/1/2002", // You need to define dateOfBirth
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("User information successfully updated"); // Alert the user
          router.push("/sign_in");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  return (
    <div className="register_information_container">
      <h1>Please inform you information for creating account</h1>
      <form className="form_register_information" onSubmit={handleSubmit}>
        <div className="form_register_content">
          <div className="first_block_form_content">
            <div className="left_of_first">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="right_of_first">
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="seconde_block_form_content">
            <div className="left_of_second">
              <label>Email</label>
              <p>{email}</p>
            </div>
            <div className="right_of_second">
              <label>Gender</label>
              <div className="option_for_gender">
                <div>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={(e) => setGender(e.target.value)}
                  ></input>
                  <p>Male</p>
                </div>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={(e) => setGender(e.target.value)}
                  ></input>
                  <p>Female</p>
                </div>
              </div>
            </div>
          </div>
          <div className="third_block_form_content">
            <div className="left_of_third">
              <label>Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="right_of_third">
              <label>Confirm Password</label>
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="form_register_btn">
          <button className="btn_clear">Clear</button>
          <button className="btn_finish" type="submit">
            Finish
          </button>
        </div>
      </form>
    </div>
  );
}
