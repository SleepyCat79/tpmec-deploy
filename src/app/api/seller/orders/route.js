import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

/// Get all order of seller
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const seller_id = searchParams.get("seller_id");
  const sql = `
    SELECT ORDER_TABLE.*, u.LName, u.FName 
    FROM ORDER_TABLE 
    INNER JOIN USER AS u ON ORDER_TABLE.Customer_ID = u.User_ID 
    WHERE Seller_ID = '${seller_id}'`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(NextResponse.json(result));
    });
  });
}
