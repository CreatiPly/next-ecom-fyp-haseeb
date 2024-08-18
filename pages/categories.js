import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        values: property.values.split(","),
      })),
    };
    if (editedCategory) {
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function openDeleteModal(category) {
    setSelectedCategory(category);
    setIsModalOpen(true);
  }

  async function deleteCategory() {
    const { _id } = selectedCategory;
    await axios.delete("/api/categories?_id=" + _id);
    fetchCategories();
    setIsModalOpen(false);
  }

  function addProperty() {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  }

  function handlePropertyNameChange(index, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1>Categories</h1>

        <div className="bg-accent rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold text-text mb-4">
            {editedCategory
              ? `Edit Category: ${editedCategory.name}`
              : "Create New Category"}
          </h2>

          <form onSubmit={saveCategory} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="categoryName">Category Name</label>
                <input
                  id="categoryName"
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="parentCategory">Parent Category</label>
                <select
                  id="parentCategory"
                  onChange={(ev) => setParentCategory(ev.target.value)}
                  value={parentCategory}
                >
                  <option value="">No parent category</option>
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block">Properties</label>
              <button
                onClick={addProperty}
                type="button"
                className="btn-secondary text-sm my-2"
              >
                Add new property
              </button>

              {properties.length > 0 &&
                properties.map((property, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-2 mb-2"
                  >
                    <input
                      type="text"
                      onChange={(ev) =>
                        handlePropertyNameChange(index, ev.target.value)
                      }
                      value={property.name}
                      placeholder="Property Name (e.g., color, size)"
                      className="flex-1"
                    />
                    <input
                      type="text"
                      onChange={(ev) =>
                        handlePropertyValuesChange(index, ev.target.value)
                      }
                      value={property.values}
                      placeholder="Values, comma separated"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      className="btn-red"
                      onClick={() => removeProperty(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Save
              </button>
              {editedCategory && (
                <button
                  onClick={() => {
                    setEditedCategory(null);
                    setName("");
                    setParentCategory("");
                    setProperties([]);
                  }}
                  type="button"
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {!editedCategory && (
          <div className="overflow-x-auto">
            <table className="basic w-full">
              <thead>
                <tr>
                  <th className="text-left">Category Name</th>
                  <th className="text-left">Parent Category</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category?.parent?.name || "None"}</td>
                      <td className="text-right">
                        <button
                          className="btn-secondary mr-1"
                          onClick={() => editCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-red"
                          onClick={() => openDeleteModal(category)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete the category:{" "}
              {selectedCategory.name}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn-red" onClick={deleteCategory}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
