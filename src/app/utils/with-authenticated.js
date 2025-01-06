import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
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
