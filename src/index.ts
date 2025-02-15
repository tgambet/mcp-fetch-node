import { fetchPage } from "./service.js";

async function main() {
  const page = await fetchPage('https://www.google.com');
  console.log(page);
}

await main();
