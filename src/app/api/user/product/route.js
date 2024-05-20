import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

/// Get product details
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const product_id = searchParams.get("product_id");
  const sql1 = `SELECT * FROM PRODUCT WHERE Product_ID=${product_id}`;
  const sql2 = `SELECT * FROM PRODUCT_IMAGE WHERE Product_ID=${product_id}`;
  const sql3 = `SELECT * FROM PRODUCT_OPTION WHERE Product_ID=${product_id}`;
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result1) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        db.query(sql2, (err, result2) => {
          if (err) {
            console.log(err);
            resolve(NextResponse.error(err));
          } else {
            db.query(sql3, (err, result3) => {
              if (err) {
                console.log(err);
                resolve(NextResponse.error(err));
              } else {
                const seller_id = result1[0].Seller_ID;
                const sql4 = `SELECT * FROM USER WHERE User_ID='${seller_id}'`;
                db.query(sql4, (err, result4) => {
                  if (err) {
                    console.log(err);
                    resolve(NextResponse.error(err));
                  } else {
                    resolve(
                      NextResponse.json({
                        product: result1[0],
                        images: result2,
                        options: result3,
                        seller: result4[0],
                      })
                    );
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

// like product
export async function POST(req) {
  const data = await req.json();
  const { product_id, user_id } = data;
  const sql = `call Like_Product(${product_id},${user_id})`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        resolve(NextResponse.error(err));
      } else {
        resolve(NextResponse.json(result[0]));
      }
    });
  });
}
