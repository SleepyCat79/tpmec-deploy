import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

/// Get all products
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const seller_id = searchParams.get("seller_id");
  const sql = `call Get_all_product_of_seller_for_user('${seller_id}')`; //just get the title the first image and the first price of the product and the product id
  const sql2 = `select * from USER where User_ID = '${seller_id}'`;
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
                products: result[0],
                shop_in4: result2[0],
              })
            );
          }
        });
      }
    });
  });
}
