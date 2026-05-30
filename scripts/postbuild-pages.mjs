import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");

// GitHub Pages project site: /username/repo-name/ → keep 1 segment
const pathSegmentsToKeep = 1;

const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Архив звуков</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = ${pathSegmentsToKeep};
      var l = window.location;
      l.replace(
        l.protocol + "//" + l.hostname + (l.port ? ":" + l.port : "") +
        l.pathname.split("/").slice(0, 1 + pathSegmentsToKeep).join("/") + "/?/" +
        l.pathname.slice(1).split("/").slice(pathSegmentsToKeep).join("/").replace(/&/g, "~and~") +
        (l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
`;

writeFileSync(resolve(distDir, "404.html"), html, "utf8");
console.log("Generated dist/404.html for GitHub Pages SPA routing");
