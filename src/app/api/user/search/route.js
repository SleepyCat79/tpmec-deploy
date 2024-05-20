import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

/// Get all products
export async function POST(req) {
  const data = await req.json();
  const { searchValue } = data;
  console.log(searchValue);
  const sql = `call searchProduct('${searchValue}')`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(NextResponse.json(result[0]));
      console.log(result[0]);
    });
  });
}
