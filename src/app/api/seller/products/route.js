import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

/// Get all product
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const seller_id = searchParams.get("seller_id");
  const sql = `call Get_All_Product_For_Seller('${seller_id}')`; /// return titlle, first image, price, product_id
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else if (result && result.length > 0) {
        resolve(NextResponse.json(result[0]));
      } else {
        resolve(NextResponse.json({ message: "No results found" }));
      }
    });
  });
}
