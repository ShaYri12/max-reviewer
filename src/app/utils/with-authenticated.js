import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login"); // Use `replace` to avoid adding to browser history
      } else {
        setIsLoading(false); // Only render the component if authenticated
      }
    }, []);

    if (isLoading) {
      return null; // Render nothing until auth check is complete
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
