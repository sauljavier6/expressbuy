// pages/404.tsx

import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
      <Link href="/">
        <a style={{ color: "#0070f3", textDecoration: "underline" }}>Volver al inicio</a>
      </Link>
    </div>
  );
};

export default NotFoundPage;
