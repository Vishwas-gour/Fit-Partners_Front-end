import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../API/API";
import {
  sizes,
  categories,
  colors,
  materials,
  genders,
  stepLabels,
} from "../../Functions/RequeredArrays";
import { EmptyPage } from "../../Functions/EmptyPage";
import "./css/addShoe.css";

const AddShoe = () => {
  const location = useLocation();
  const updateData = location.state?.shoe || null;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({id: "",name: "",brand: "",stock: "",description: "",salePrice: "",costPrice: "",discountParentage: "",category: "",gender: "",material: "",weight: "",
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [images, setImages] = useState([]);

  // pre-fill data for update case
  useEffect(() => {
    if (updateData) {
      setProduct({
        id: updateData.id || "",
        name: updateData.name || "",
        brand: updateData.brand || "",
        stock: updateData.stock || "",
        description: updateData.description || "",
        salePrice: updateData.salePrice || "",
        costPrice: updateData.costPrice || "",
        discountParentage: updateData.discountParentage || "",
        category: updateData.category || "",
        gender: updateData.gender || "",
        material: updateData.material || "",
        weight: updateData.weight || "",
      });
      setSelectedSizes((updateData.sizes || []).map(String));
      setSelectedColors((updateData.colors || []).map(String));
      setImages([]); // don’t prefill images
    }
  }, [updateData]);

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // no numbers in name & brand
    if ((name === "name" || name === "brand") && /\d/.test(value)) return;

    // only numbers in numeric fields
    const numericFields = ["stock","weight","salePrice","costPrice","discountParentage",
    ];
    if (numericFields.includes(name) && value && !/^\d*$/.test(value)) return;

    setProduct({ ...product, [name]: value });
  };

  const handleSizeToggle = (size) => {
    size = String(size);
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isValidType) alert(`${file.name} is not a valid image type.`);
      if (!isValidSize) alert(`${file.name} exceeds 5MB size limit.`);
      return isValidType && isValidSize;
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  // send data step by step
  const sendStepData = async () => {
    try {
      const shoeId = updateData?.id;

      // ✅ Step 1 validation
      if (step === 1) {
        const { name, brand, stock, description, weight, salePrice, costPrice, discountParentage } = product;
        if (!name || !brand || !stock || !description || !weight || !salePrice || !costPrice) {
          return alert("All fields except discount are required in Step 1");
        }
        if (description.length < 20) return alert("Description must be at least 20 characters long");
        if (Number(stock) <= 0) return alert("Stock must be greater than 0");
        if (Number(weight) <= 0) return alert("Weight must be greater than 0");
        if (Number(salePrice) <= 0) return alert("Sale Price must be greater than 0");
        if (Number(costPrice) <= 0) return alert("Cost Price must be greater than 0");
        if (discountParentage && (Number(discountParentage) < 0 || Number(discountParentage) > 100)) {
          return alert("Discount must be between 0 and 100");
        }

        await API.post(`/admin/addShoe/addStep1`, {
          id: shoeId,
          name, brand, stock, description, weight, salePrice, costPrice, discountParentage,
        });
      }

      // ✅ Step 2 validation
      if (step === 2) {
        const { category, gender, material } = product;
        if (!category || !gender || !material)
          return alert("Category, Gender and Material are required");
        await API.post(`/admin/addShoe/addStep2${shoeId ? `?id=${shoeId}` : ""}`, {
          category, gender, material,
        });
      }

      // ✅ Step 3 validation
      if (step === 3) {
        if (selectedSizes.length === 0) return alert("Select at least 1 size");
        if (selectedColors.length === 0) return alert("Select at least 1 color");

        await API.post(`/admin/addShoe/addStep3${shoeId ? `?id=${shoeId}` : ""}`, selectedSizes);
        await API.post(`/admin/addShoe/addStep4${shoeId ? `?id=${shoeId}` : ""}`, selectedColors);
      }

      // ✅ Step 4 validation
      if (step === 4) {
        if (images.length === 0) return alert("Upload at least 1 image");

        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        setLoading(true);
        await API.post(`/admin/addShoe/addStep5${shoeId ? `?id=${shoeId}` : ""}`, formData);
        setLoading(false);
        alert(shoeId ? "Product updated successfully!" : "Product added successfully!");

        // Reset form
        setProduct({
          name: "", brand: "", stock: "", description: "",
          salePrice: "", costPrice: "", discountParentage: "",
          category: "", gender: "", material: "", weight: "",
        });
        setSelectedSizes([]);
        setSelectedColors([]);
        setImages([]);
        setStep(1);
        return;
      }

      setStep(step + 1);
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loading) return <EmptyPage text="It might take some time" height="80vh" />;

  return (
    <form className="product-form" onSubmit={(e) => e.preventDefault()}>
      <h2>{updateData ? "Update Product" : "Add Product"} – {stepLabels[step]}</h2>

      {step === 1 && (
        <>
          <input name="name" value={product.name} onChange={handleChange} placeholder="Name (no numbers)" />
          <input name="brand" value={product.brand} onChange={handleChange} placeholder="Brand (no numbers)" />
          <input name="stock" type="text" value={product.stock} onChange={handleChange} placeholder="Stock" />
          <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description (min 20 chars)" />
          <input name="weight" type="text" value={product.weight} onChange={handleChange} placeholder="Weight (grams)" />
          <input name="salePrice" type="text" value={product.salePrice} onChange={handleChange} placeholder="Sale Price" />
          <input name="costPrice" type="text" value={product.costPrice} onChange={handleChange} placeholder="Cost Price" />
          <input name="discountParentage" type="text" value={product.discountParentage} onChange={handleChange} placeholder="Discount %" />
        </>
      )}

      {step === 2 && (
        <>
          <select name="category" value={product.category} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select name="gender" value={product.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            {genders.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <select name="material" value={product.material} onChange={handleChange}>
            <option value="">Select Material</option>
            {materials.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </>
      )}

      {step === 3 && (
        <>
          <h4>Select Sizes</h4>
          <div className="size-checkboxes">
            {sizes.map((size) => (
              <label key={size} className={`size-circle ${selectedSizes.includes(size) ? "selected" : ""}`}>
                {size}
                <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => handleSizeToggle(size)} />
              </label>
            ))}
          </div>

          <h4>Select Colors</h4>
          <div className="color-checkboxes">
            {colors.map((color) => (
              <label key={color} style={{ background: color }} className={`color-circle ${selectedColors.includes(color) ? "selected" : ""} ${color.toLowerCase()}`}>
                <input type="checkbox" checked={selectedColors.includes(color)} onChange={() => handleColorToggle(color)} />
              </label>
            ))}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h4>Upload Images</h4>
          <div className="image-upload">
            <div className="preview-box">
              {images.map((img, i) => (
                <div className="image-wrapper" key={i}>
                  <img src={URL.createObjectURL(img)} alt="preview" className="preview-image" />
                  <button type="button" className="remove-image" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
            </div>
            <label htmlFor="imageUpload" className="plus-icon">+</label>
            <input type="file" id="imageUpload" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageChange} />
          </div>
        </>
      )}

      <div className="step-buttons">
        <button type="button" onClick={sendStepData}>
          {step === 4 ? (updateData ? "Update" : "Submit") : "Next"}
        </button>
        {step > 1 && (<button type="button" onClick={handlePrev}>Previous</button>)}
      </div>
    </form>
  );
};

export default AddShoe;
