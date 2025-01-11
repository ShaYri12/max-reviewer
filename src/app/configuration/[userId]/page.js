"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import SignupForm from "../../signup/page";
import { useSearchParams } from "next/navigation";

const EditUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  console.log(userId);

  const mockUserData = {
    companyName: "Mock Company",
    email: "mock@example.com",
    phone: "+52 1234567890",
    password: "mockPassword",
    confirmPassword: "mockPassword",
  };

  useEffect(() => {
    if (!userId) {
      console.error("userId is missing");
      return;
    } // Ensure the userId is available before making the API call

    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for ID:", userId); // Log the userId
        const response = await axios.get(`/user/${userId}`); // Adjust API URL
        console.log("User data response:", response); // Log the response
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserData(mockUserData); // Use mock data if there's an error
        setError("Error fetching user data"); // Set the error
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchUserData();
  }, [userId]); // Re-run the effect when userId changes

  const handleUpdate = async (payload) => {
    try {
      const response = await axios.put(`/user/update/${userId}`, payload);
      if (response.data?.status === "OK") {
        toast.success("User details updated successfully!");
        router.push("/profile"); // Redirect to profile page after update
      } else {
        toast.error("Error updating user details.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating details.");
    }
  };

  // Display loading message if still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error if occurred
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SignupForm
      userData={userData} // Pass the user data to the form
      onSubmit={handleUpdate} // Handle submit for updating user data
      buttonText="Update" // Update button text
    />
  );
};

export default EditUser;
