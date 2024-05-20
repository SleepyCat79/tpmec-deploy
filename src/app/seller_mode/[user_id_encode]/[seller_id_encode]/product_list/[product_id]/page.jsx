"use client";
import "../../upload_product/page.css";
import { useState, useEffect } from "react";
export default function Page({ params }) {
  const { user_id_encode, seller_id_encode, product_id } = params;

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`/api/user/product?product_id=${product_id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data.product);
        setName(data.product.Product_title);
        setRows(data.options);
        setImages(data.images);

        setDescription(data.product.Product_description);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [product_id]);
  const handleUpdate = () => {
    const productData = {
      productID: product_id,
      productTitle: name,
      productDescription: description,
      productOptionList: rows.map((row) => ({
        optionName: row.Option_name,
        optionPrice: row.Option_price,
      })),
      sellerID: seller_id_encode,
    };
    console.log(productData.productOptionList);

    fetch(`/api/seller/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.message);
          alert(data.message);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map((file) => {
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
    setRows([...rows, { price: "", unit: "" }]);
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
        <div className="input_name">
          <h3>Name</h3>
          <input
            type="text"
            value={name ? name : ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input_price">
          <h3>Sale option</h3>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>¥ per</th>
                <th>Unit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={row.Option_price}
                      onChange={(e) =>
                        updateRow(index, "Option_price", e.target.value)
                      }
                      placeholder="Ex: 100"
                    />
                  </td>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      value={row.Option_name}
                      onChange={(e) =>
                        updateRow(index, "Option_name", e.target.value)
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
          {/* <input type="file" multiple onChange={handleImageChange} /> */}
          <div className="img_array">
            {images.map((image, index) => (
              <div className="img_container" key={index}>
                <img
                  src={image.Image_url} // Use Image_url property
                  alt={`Product ${index + 1}`}
                  className="product-image"
                />
                {/* <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                >
                  Delete
                </button> */}
              </div>
            ))}
          </div>
        </div>
        <div className="submit_button">
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
}
