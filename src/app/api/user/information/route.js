import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();
export async function POST(req) {
  const data = await req.json();
  const { User_ID, Phone_Number, Email, Address, FName, LName, Date_of_birth } =
    data;

  const sql = `call Insert_User_Information('${User_ID}', '${Phone_Number}', '${Email}', '${FName}', '${LName}', '${Date_of_birth}')`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        const sql2 = `insert into USER_ADDRESS (User_ID, Address) values ('${User_ID}', '${Address}')`;
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            resolve(NextResponse.error(err));
          }
        });
        resolve(NextResponse.json({ message: "success" }));
      }
    });
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const user_id = searchParams.get("user_id");
  const sql = `call Get_User_Information('${user_id}')`;
  const sql2 = `select Address from USER_ADDRESS where User_ID = '${user_id}'`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        db.query(sql2, (err, result2) => {
          if (err) {
            console.log(err);
            resolve(NextResponse.error(err));
          } else {
            resolve(
              NextResponse.json({
                user: result[0][0],
                address: result2,
              })
            );
          }
        });
      }
    });
  });
}

/// just update Name and Date_of_birth and Phone Number
export async function PUT(req) {
  const data = await req.json();
  const { User_ID, Phone_Number, FName, LName, Date_of_birth } = data; /// address is array
  const sql = `call Update_User_Information('${User_ID}', '${Phone_Number}', '${FName}', '${LName}', '${Date_of_birth}')`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        resolve(NextResponse.json({ message: "success" }));
      }
    });
  });
}
