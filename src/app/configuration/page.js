"use client";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import SignupForm from "../signup/page";
import { useSearchParams } from "next/navigation";

const EditUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const mockUserData = {
    companyName: "Mock Company",
    email: "mock@example.com",
    phone: "1234567890",
  };

  useEffect(() => {
    if (!userId) {
      console.error("userId is missing");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUserData(response.data);
      } catch (err) {
        setUserData(mockUserData);
        setError("Error fetching user data");
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = async (payload) => {
    try {
      const response = await axios.put(`/user/update/${userId}`, payload);
      if (response.data?.status === "OK") {
        toast.success("User details updated successfully!");
        router.push("/profile");
      } else {
        toast.error("Error updating user details.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating details.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <SignupForm userData={userData} onSubmit={handleUpdate} />;
};

export default function EditUserWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditUser />
    </Suspense>
  );
}
