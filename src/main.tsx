import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Diagnostic } from "./components/Diagnostic";

// https://votre-site/?diagnostic → page de vérification de la configuration
const isDiagnostic = new URLSearchParams(window.location.search).has("diagnostic");

if (isDiagnostic) {
  // Page technique : pas d'indexation Google
  const meta = document.createElement("meta");
  meta.name = "robots";
  meta.content = "noindex, nofollow";
  document.head.appendChild(meta);
  document.title = "VYZIO · diagnostic";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>{isDiagnostic ? <Diagnostic /> : <App />}</StrictMode>
);
