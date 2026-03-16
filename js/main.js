import { renderStartPage } from "./pages/startPage.js";

renderStartPage();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}