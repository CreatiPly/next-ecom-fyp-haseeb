import { Router, useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDesctiption,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDesctiption || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      // update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      try {
        const res = await axios.post("/api/upload", data);
        console.log(res.data);
        console.log("Uploaded image URLs:", res.data.urls);
        setImages((prev) => {
          return [...prev, ...res.data.urls];
        });
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let CategoryInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...CategoryInfo?.properties);
    while (CategoryInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === CategoryInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      CategoryInfo = parentCat;
    }
  }
  function handleProdPropChange(propName, value) {
    setProductProperties((prevProdProp) => {
      const newProdProp = { ...prevProdProp };
      newProdProp[propName] = value;
      return newProdProp;
    });
  }
  return (
    // <form onSubmit={saveProduct}>
    //   <label>Product Name</label>
    //   <input
    //     type="text"
    //     placeholder="Product Name"
    //     value={title}
    //     onChange={(ev) => setTitle(ev.target.value)}
    //   />
    //   <label>Category</label>
    //   <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
    //     <option value="">Uncategorized</option>
    //     {categories.length > 0 &&
    //       categories.map((category) => (
    //         <option value={category._id}>{category.name}</option>
    //       ))}
    //   </select>
    //   {propertiesToFill.length > 0 &&
    //     propertiesToFill.map((property) => (
    //       <div className="flex gap-1">
    //         <div>{property.name}</div>
    //         <select
    //           value={productProperties[property.name] || ""}
    //           onChange={(ev) =>
    //             handleProdPropChange(property.name, ev.target.value)
    //           }
    //         >
    //           {property.values.map((value) => (
    //             <option value={value}>{value}</option>
    //           ))}
    //         </select>
    //       </div>
    //     ))}
    //   <label>Images</label>
    //   <div className="flex flex-wrap gap-1 mb-2">
    //     <ReactSortable
    //       list={images}
    //       setList={updateImagesOrder}
    //       className="flex flex-wrap gap-1"
    //     >
    //       {!!images?.length &&
    //         images.map((imageUrl) => (
    //           <div key={imageUrl} className="h-24">
    //             <img src={imageUrl} className="rounded-lg"></img>
    //           </div>
    //         ))}
    //     </ReactSortable>
    //     {isUploading && (
    //       <div className="h-24 flex items-center">
    //         <Spinner />
    //       </div>
    //     )}
    //     <label className="w-24 h-24 flex flex-col justify-center items-center rounded-md text-gray-600 bg-gray-300 cursor-pointer">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth={1.5}
    //         stroke="currentColor"
    //         className="w-6 h-6"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
    //         />
    //       </svg>

    //       <div>Upload</div>
    //       <input className="hidden" type="file" onChange={uploadImages}></input>
    //     </label>
    //   </div>
    //   <label>Product Description</label>
    //   <textarea
    //     placeholder=" Product Description"
    //     value={description}
    //     onChange={(ev) => setDescription(ev.target.value)}
    //   />
    //   <label>Product Price</label>
    //   <input
    //     type="number"
    //     placeholder="Product Price"
    //     value={price}
    //     onChange={(ev) => setPrice(ev.target.value)}
    //   />
    //   <button className="btn-primary">Save</button>
    // </form>
    <form
      onSubmit={saveProduct}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h1>Create New Product</h1>

      <div className="mb-4">
        <label htmlFor="productName">Product Name</label>
        <input
          id="productName"
          type="text"
          placeholder="Enter product name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
        >
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      {propertiesToFill.length > 0 && (
        <div className="mb-4">
          <label>Properties</label>
          {propertiesToFill.map((property) => (
            <div key={property.name} className="flex items-center gap-2 mb-2">
              <span className="w-1/3 text-sm text-text">{property.name}:</span>
              <select
                value={productProperties[property.name] || ""}
                onChange={(ev) =>
                  handleProdPropChange(property.name, ev.target.value)
                }
                className="w-2/3"
              >
                <option value="">Select {property.name}</option>
                {property.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <label>Images</label>
        <div className="flex flex-wrap gap-2 mb-2">
          <ReactSortable
            list={images}
            setList={updateImagesOrder}
            className="flex flex-wrap gap-2"
          >
            {!!images?.length &&
              images.map((imageUrl) => (
                <div key={imageUrl} className="h-24 w-24">
                  <img
                    src={imageUrl}
                    className="rounded-lg object-cover w-full h-full"
                    alt="Product"
                  />
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 w-24 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 flex flex-col justify-center items-center rounded-lg text-gray-600 bg-accent cursor-pointer hover:bg-opacity-80 transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="text-sm">Upload</span>
            <input className="hidden" type="file" onChange={uploadImages} />
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description">Product Description</label>
        <textarea
          id="description"
          placeholder="Enter product description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="price">Product Price</label>
        <input
          id="price"
          type="number"
          placeholder="Enter product price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Save Product
      </button>
    </form>
  );
}
