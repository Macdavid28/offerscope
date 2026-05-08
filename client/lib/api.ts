import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1/compensations",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred";
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      message = error.response.data?.message || error.response.data?.error || message;
      
      // Specifically handle validation errors from Zod/backend
      if (error.response.status === 400 && error.response.data?.errors) {
        // You might want to return the structured errors for form handling
        return Promise.reject(error);
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = "No response from server. Please check your connection.";
    } else {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
    }

    console.error("[API Error]:", message);
    
    // Attach the normalized message to the error object
    error.normalizedMessage = message;
    
    return Promise.reject(error);
  }
);

export default api;
