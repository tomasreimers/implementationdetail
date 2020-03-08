import path from "path";
import fs from "fs";
import remark from "remark";
import { VFile } from "vfile";
import sass from "node-sass";
import { Node } from "unist";
import { Result as SASSResult } from "node-sass";
const guide = require("remark-preset-lint-markdown-style-guide");
const html = require("remark-html");
const frontmatter = require("remark-frontmatter");
const parseFrontmatter = require("remark-parse-yaml");
const visit = require("unist-util-visit");

const RAW_PATH = path.join(__dirname, "../raw/");
const POSTS_PATH = path.join(__dirname, "../public/posts/");
const POST_TEMPLATE_FILE = path.join(__dirname, "./templates/post.html");

const STYLES_INPUT = path.join(__dirname, "./styles/index.scss");
const STYLES_OUTPUT = path.join(__dirname, "../public/static/css/main.css");

function interpolateTemplate(
  template: string,
  replacements: { [name: string]: string }
): string {
  for (const replacement_key in replacements) {
    template = template.replace(
      new RegExp("{{" + replacement_key + "}}", "g"),
      replacements[replacement_key]
    );
  }

  template = template.replace(new RegExp("{{.*?}}", "g"), "");

  return template;
}

function copyFrontmatter() {
  return function(ast: Node, file: VFile) {
    visit(ast, "yaml", (item: { data: { parsedValue: string } }): void => {
      (file as { data: { frontmatter: {} } }).data.frontmatter =
        item.data.parsedValue;
    });
  };
}

// POSTS
fs.promises
  .readFile(POST_TEMPLATE_FILE, "utf8")
  .then(function(post_template: string) {
    fs.promises.readdir(RAW_PATH).then(
      function(files: string[]) {
        files.forEach(function(file: string) {
          if (!file.endsWith(".md")) {
            return;
          }

          fs.promises
            .readFile(path.join(RAW_PATH, file), "utf8")
            .then(function(contents: string) {
              const newFileName = file.slice(0, -3) + ".html";

              remark()
                .use(guide)
                .use(html)
                .use(frontmatter, ["yaml"])
                .use(parseFrontmatter)
                .use(copyFrontmatter)
                .process(contents)
                .then(function(htmlString: VFile) {
                  console.log(htmlString);
                  fs.promises
                    .writeFile(
                      path.join(POSTS_PATH, newFileName),
                      interpolateTemplate(post_template, {
                        TITLE: "",
                        DESCRIPTION: "Descriptor",
                        CONTENT: htmlString.toString()
                      }),
                      {
                        flag: "w+"
                      }
                    )
                    .catch(function(err: NodeJS.ErrnoException) {
                      console.log(err);
                    });
                });
            });
        });
      },
      function(err: NodeJS.ErrnoException) {
        return console.log("Unable to scan directory: " + err);
      }
    );
  });

// STYLES
sass.render(
  {
    file: STYLES_INPUT
  },
  function(err: NodeJS.ErrnoException, result: SASSResult) {
    if (err) {
      return console.log("Unable to compile sass: " + err);
    }

    fs.promises
      .writeFile(STYLES_OUTPUT, result.css.toString(), {
        flag: "w+"
      })
      .catch(function(err: NodeJS.ErrnoException) {
        console.log(err);
      });
  }
);
