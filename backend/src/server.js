const app = require("./app");

if (process.argv.includes("--check")) {
  console.log("QualityData AI backend listo.");
  process.exit(0);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`QualityData AI backend: http://localhost:${port}`);
});
