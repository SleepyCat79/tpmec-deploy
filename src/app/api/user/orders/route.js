import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const Customer_ID = searchParams.get("customer_id");
  const Seller_ID = searchParams.get("seller_id");
  let sql;

  if (Customer_ID) {
    sql = `SELECT * FROM ORDER_TABLE WHERE Customer_ID = '${Customer_ID}'`;
  } else if (Seller_ID) {
    sql = `SELECT * FROM ORDER_TABLE WHERE Seller_ID = '${Seller_ID}'`;
  } else {
    throw new Error("Either customer_id or seller_id must be provided.");
  }

  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(NextResponse.json(result));
    });
  });
}
