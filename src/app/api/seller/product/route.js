import connectToDatabase from "@/config/db";
import { NextResponse } from "next/server";
const db = connectToDatabase();

//Posting product for seller
export async function POST(req) {
  const data = await req.json();
  const {
    productTitle,
    productDescription,
    productOptionList, // list option [{optionName,optionPrice}]
    productImageList, //list image [{imageURL}]
    sellerID,
  } = data;
  const sql1 = `call Add_Product('${sellerID}','${productTitle}','${productDescription}')`;
  const sql2 = `call Add_Product_Option(?,?,?,?)`; /// (productID,optionName,optionPrice,optionNumber)
  const sql3 = `call Add_Product_Image(?,?)`; /// (productID,imageURL)
  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        reject(NextResponse.error(err));
      } else {
        const sqlGetID = `SELECT Product_ID FROM PRODUCT WHERE Seller_ID='${sellerID}' AND Product_Title='${productTitle}' AND Product_Description='${productDescription}' ORDER BY Product_ID DESC LIMIT 1`;
        db.query(sqlGetID, (err, result) => {
          if (err) {
            console.log(err);
            reject(NextResponse.error(err));
          } else {
            const productID = result[0].Product_ID;

            productOptionList.forEach((option, index) => {
              db.query(
                sql2,
                [productID, option.optionName, option.optionPrice, index],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    reject(NextResponse.error(err));
                  }
                }
              );
            });

            productImageList.forEach((image) => {
              db.query(sql3, [productID, image.imageURL], (err, result) => {
                if (err) {
                  console.log(err);
                  reject(NextResponse.error(err));
                }
              });
            });

            resolve(
              NextResponse.json({
                success: true,
                message: "Product added successfully",
              })
            );
          }
        });
      }
    });
  });
}

///Get Product Detail For Seller
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const product_id = searchParams.get("product_id");
  const sql = `call Get_Product_Detail_For_Seller('${product_id}')`; // every thing about this product
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

// Updating product for seller
export async function PUT(req) {
  const data = await req.json();
  const {
    productID,
    productTitle,
    productDescription,
    productOptionList, // list option [{optionName,optionPrice}]
    productImageList, //list image [{imageURL}]
    sellerID,
  } = data;

  const sql1 = `UPDATE PRODUCT SET Product_Title='${productTitle}', Product_Description='${productDescription}' WHERE Product_ID='${productID}' AND Seller_ID='${sellerID}'`;

  return new Promise((resolve, reject) => {
    db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        reject(NextResponse.error(err));
      } else {
        productOptionList.forEach((option, index) => {
          const sql2 = `UPDATE PRODUCT_OPTION SET Option_Name='${option.optionName}', Option_Price='${option.optionPrice}' WHERE Product_ID='${productID}' AND Option_Number='${index}'`;
          db.query(sql2, (err, result) => {
            if (err) {
              console.log(err);
              reject(NextResponse.error(err));
            }
          });
        });

        resolve(
          NextResponse.json({
            success: true,
            message: "Product updated successfully",
          })
        );
      }
    });
  });
}
