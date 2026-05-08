import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const docsPath = location.pathname.match(/^\/docs\/?(.*)$/)?.[1] ?? "";
  const normalizedDocsPath = docsPath
    .replace(/\/$/, "")
    .replace(/-/g, "_")
    .replace(/\//g, "/")
    .toUpperCase();

  const docsRedirects: Record<string, string> = {
    "": "/docs/get-started/quick-start",
    "GET_STARTED/QUICK_START": "/docs/get-started/quick-start",
    "WORKFLOWS/13_QGIS_IMPLEMENTATION_GUIDE": "/docs/workflows/13-qgis-implementation-guide",
  };

  const docsTarget = docsRedirects[normalizedDocsPath];

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  if (location.pathname.startsWith("/docs") && docsTarget) {
    return <Navigate to={docsTarget} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
