import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

export async function POST(req) {
  const data = await req.json();
  const { User_ID, Address } = data;
  const sql2 = `insert into USER_ADDRESS (User_ID, Address) values ('${User_ID}', '${Address}')`;
  db.query(sql2, (err, result) => {
    if (err) {
      console.log(err);
      resolve(NextResponse.error(err));
    }
  });
} /// add new address of user

export async function PUT(req) {
  const data = await req.json();
  const { User_ID, Address, NewAddress } = data;
} /// update address of user

export async function DELETE(req) {
  const data = await req.json();
  const { User_ID, Address } = data;
  const sql = `delete from USER_ADDRESS where User_ID = '${User_ID}' and Address = '${Address}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      resolve(NextResponse.error(err));
    }
  });
} /// delete address of user
