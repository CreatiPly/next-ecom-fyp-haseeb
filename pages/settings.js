import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Settings() {
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [editedAdmin, setEditedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      const response = await axios.get("/api/admins");
      setAdmins(response.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  }

  async function saveAdmin(ev) {
    ev.preventDefault();
    const data = { email: newAdminEmail };
    try {
      if (editedAdmin) {
        await axios.put(`/api/admins/${editedAdmin._id}`, data);
        setEditedAdmin(null);
      } else {
        await axios.post("/api/admins", data);
      }
      setNewAdminEmail("");
      fetchAdmins();
    } catch (error) {
      console.error("Failed to save admin:", error);
    }
  }

  function editAdmin(admin) {
    setEditedAdmin(admin);
    setNewAdminEmail(admin.email);
  }

  function openDeleteModal(admin) {
    setSelectedAdmin(admin);
    setModalAction("delete");
    setIsModalOpen(true);
  }

  async function deleteAdmin() {
    try {
      await axios.delete(`/api/admins/${selectedAdmin._id}`);
      fetchAdmins();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1>Admin Settings</h1>
        <div className="bg-accent rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold text-text mb-4">
            {editedAdmin ? `Edit Admin: ${editedAdmin.email}` : "Add New Admin"}
          </h2>

          <form onSubmit={saveAdmin} className="space-y-4">
            <div>
              <label htmlFor="adminEmail">Admin Email</label>
              <input
                id="adminEmail"
                type="email"
                placeholder="Enter admin email"
                value={newAdminEmail}
                onChange={(ev) => setNewAdminEmail(ev.target.value)}
                required
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editedAdmin ? "Update" : "Add"}
              </button>
              {editedAdmin && (
                <button
                  onClick={() => {
                    setEditedAdmin(null);
                    setNewAdminEmail("");
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

        {!editedAdmin && (
          <div className="overflow-x-auto">
            <table className="basic w-full">
              <thead>
                <tr>
                  <th className="text-left">Admin Email</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.email}</td>
                    <td className="text-right">
                      <button
                        className="btn-secondary mr-1"
                        onClick={() => editAdmin(admin)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-red"
                        onClick={() => openDeleteModal(admin)}
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
            <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
            <p className="mb-4">
              Are you sure you want to delete the admin: {selectedAdmin.email}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn-red" onClick={deleteAdmin}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
