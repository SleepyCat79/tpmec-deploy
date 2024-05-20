"use client";
import { useState } from "react";
import "./page.css";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});
export default function Page({ params }) {
  const { seller_id_encode: sellerid } = params;
  const s3 = new AWS.S3();
  const [rows, setRows] = useState([{ optionPrice: "", optionName: "" }]);
  const [images, setImages] = useState([]);
  const [productname, setProductname] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const submitproduct = async (e) => {
    setIsWaiting(true);
    console.log("Called");
    try {
      // Upload files to S3 and get their URLs
      const imageUrls = await Promise.all(
        selectedFiles.map((file) => {
          const uploadParams = {
            Bucket: "tpms3", // replace with your bucket name
            Key: file.name, // file name to use for S3 object
            Body: file,
            ACL: "public-read", // if you want the file to be publicly accessible
          };

          return s3
            .upload(uploadParams)
            .promise()
            .then((data) => data.Location)
            .catch((err) => {
              console.error("Error uploading file:", err);
              return null;
            });
        })
      );

      // Filter out any null URLs (in case of upload errors)
      const validImageUrls = imageUrls.filter((url) => url !== null);
      console.log("Image URLs:", validImageUrls);
      const productImageList = validImageUrls.map((url) => ({
        imageURL: url,
      }));
      console.log("Product Image List:", productImageList);
      const productOptionList = rows.map(({ optionName, optionPrice }) => ({
        optionName,
        optionPrice: Number(optionPrice), // convert string to number
      }));
      console.log("Product Option List:", productOptionList);

      // Now you can use validImageUrls in your fetch body
      const res = await fetch("/api/seller/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productTitle: productname,
          productDescription: description,
          productOptionList: rows, // assuming rows is an array of options
          productImageList, // add your list of images here
          sellerID: sellerid, // replace with actual sellerID
        }),
      });

      // Send rows to the separate API endpoint
      console.log("Rows:", rows);

      const rowRes = await res.json();
      console.log(rowRes);
      if (res.ok) {
        alert("Product uploaded successfully");
        setIsWaiting(false);
        window.location.reload();
      }

      // Move this fetch request inside the try block
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading product");
    }
  };

  const handleImageChange = (e) => {
    const newSelectedFiles = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newSelectedFiles]);

    const fileReaders = newSelectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((newImages) => {
        setImages((prevImages) => [...prevImages, ...newImages]);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };

  const addRow = () => {
    setRows([...rows, { optionPrice: "", optionName: "" }]);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  return (
    <div className="upload_product_big_container">
      <div className="upload_product_container">
        <h3>Add new product to your shop</h3>
        <div className="input_name">
          <h3>Name</h3>
          <input
            type="text"
            value={productname}
            onChange={(e) => setProductname(e.target.value)}
          />
        </div>
        <div className="input_price">
          <h3>Sale option</h3>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>¥ per</th>
                <th>Option</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.optionPrice}
                      onChange={(e) =>
                        updateRow(index, "optionPrice", e.target.value)
                      }
                      placeholder="Ex: 100"
                    />
                  </td>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      value={row.optionName}
                      onChange={(e) =>
                        updateRow(index, "optionName", e.target.value)
                      }
                      placeholder="Ex: package of 1.5 kg"
                    />
                  </td>
                  <td>
                    <button onClick={() => deleteRow(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addRow}>Add row</button>
        </div>
        <div className="input_description">
          <h3>Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <h3>Product Image</h3>
          <input type="file" multiple onChange={handleImageChange} />
          <div className="img_array">
            {images.map((image, index) => (
              <div className="img_container" key={index}>
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="product-image"
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="submit_button">
          {isWaiting && <p>Posting Product...</p>}
          <button onClick={() => submitproduct()}>Posting</button>
        </div>
      </div>
    </div>
  );
}
