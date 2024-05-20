import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

export async function POST(req) {
  const data = await req.json();
  const { shopName, shippingCompanyList, User_ID, shopImg, shopAddress } = data;
  const sql = `UPDATE USER SET Shop_name='${shopName}',IsSeller=true, Shop_image = '${shopImg}', Shop_address = '${shopAddress}'  WHERE User_id='${User_ID}'`;
  const sql2 = `INSERT INTO SHIPPING_COMPANY (Seller_ID,Company_name) values('${User_ID}',?)`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(NextResponse.error(err));
      } else {
        shippingCompanyList.forEach((company) => {
          db.query(sql2, company, (err, result) => {
            if (err) {
              console.log(err);
              reject(NextResponse.error(err));
            }
          });
        });
        resolve(
          NextResponse.json({
            message: "Seller Information Updated Successfully",
          })
        );
      }
    });
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const seller_id = searchParams.get("seller_id");
  const sql = `call Get_Seller_Information('${seller_id}')`;
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
