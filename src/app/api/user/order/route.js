import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

/// Get order details by order_id
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const order_id = searchParams.get("order_id");
  const sql2 = `SELECT * FROM ORDER_ITEM WHERE Order_ID='${order_id}'`;
  const sql1 = `SELECT * FROM ORDER_TABLE WHERE Order_ID='${order_id}'`;
  return new Promise((resolve, reject) => {
    db.query(sql1, async (err, result) => {
      if (err) {
        reject(NextResponse.error(err));
      } else {
        const order = result[0];
        db.query(sql2, async (err, result) => {
          if (err) {
            reject(NextResponse.error(err));
          } else {
            const order_items = result;
            resolve(
              NextResponse.json({
                status: 200,
                body: {
                  order,
                  order_items,
                },
              })
            );
          }
        });
      }
    });
  });
}
/// Create order for user
export async function POST(req) {
  const data = await req.json();
  const {
    Seller_ID,
    Customer_ID,
    Address,
    Shipping_company,
    Total_quantity,
    Product_list,
  } = data;
  const Order_date = new Date().toISOString().slice(0, 19).replace("T", " ");
  const sql = `call createOrder('${Seller_ID}', '${Customer_ID}', '${Address}', '${Shipping_company}', '${Total_quantity}','${Order_date}')`;
  const sql2 = "call createOrderDetails(?,?,?,?,?,?)"; // Order_ID,Product_ID,Option_number,Quantity,Discount_percentage,Original_price
  return new Promise((resolve, reject) => {
    db.query(sql, async (err, result) => {
      if (err) {
        reject(err);
      } else if (result[0] && result[0][0]) {
        const Order_ID = result[0][0].Order_ID;
        for (const product of Product_list) {
          await new Promise((resolve, reject) => {
            db.query(
              sql2,
              [
                parseInt(Order_ID),
                product.Product_ID, // Removed parseInt here
                product.Option_number,
                product.Quantity,
                product.Discount_percentage,
                product.Original_price,
              ],
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
        }
        resolve(NextResponse.json(result[0]));
      } else {
        reject(new Error("No results returned from createOrder"));
      }
    });
  });
}
