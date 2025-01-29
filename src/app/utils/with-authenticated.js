import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const isJWT = (token) => {
  if (token === null || token === undefined || token.trim() === "") {
    return false; // Handle null, undefined, or empty strings explicitly
  }

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    // Decode the payload to check if it's valid JSON
    const payload = JSON.parse(atob(parts[1]));

    // Optional: Check for token expiry
    // if (payload.exp && Date.now() >= payload.exp * 1000) {
    //   return false; // Token has expired
    // }

    return typeof payload === "object";
  } catch (error) {
    return false;
  }
};

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      console.log(token);

      if (!isJWT(token)) {
        console.log("object");
        router.replace("/login");
      } else {
        setIsLoading(false);
      }
    }, []);

    if (isLoading) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
