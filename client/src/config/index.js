export const environment = process.env.NODE_ENV || "development";
export const backendUrl =
  process.env.NODE_ENV === "production"
    ? `http://localhost:8080/`
    : "http://localhost:8080/";
