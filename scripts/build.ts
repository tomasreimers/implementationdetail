import path from "path";
import fs from "fs-extra";
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

const PUBLIC_PATH = path.join(__dirname, "../public/");
const BUILD_PATH = path.join(__dirname, "../build/");

const RAW_PATH = path.join(__dirname, "../raw/");
const POSTS_PATH = path.join(__dirname, "../build/posts/");
const POST_TEMPLATE_FILE = path.join(__dirname, "../src/templates/post.html");

const STYLES_INPUT = path.join(__dirname, "../src/styles/index.scss");
const STYLES_OUTPUT = path.join(__dirname, "../build/static/css/main.css");

const INDEX_INPUT = path.join(__dirname, "../src/templates/index.html");
const INDEX_OUTPUT = path.join(__dirname, "../build/index.html");

const HEADER_TEMPLATE_FILE = path.join(
  __dirname,
  "../src/templates/partials/header.html"
);
const FOOTER_TEMPLATE_FILE = path.join(
  __dirname,
  "../src/templates/partials/footer.html"
);
const POST_LINK_TEMPLATE_FILE = path.join(
  __dirname,
  "../src/templates/partials/post.html"
);

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
  return function (ast: Node, file: VFile) {
    visit(ast, "yaml", (item: { data: { parsedValue: string } }): void => {
      (file as { data: { frontmatter: {} } }).data.frontmatter =
        item.data.parsedValue;
    });
  };
}

interface BlogFile extends VFile {
  data: {
    frontmatter: {
      title: string;
      description?: string;
    };
  };
}

const headerContent = fs.readFileSync(HEADER_TEMPLATE_FILE, "utf8");
const footerContent = fs.readFileSync(FOOTER_TEMPLATE_FILE, "utf8");
const postLinkContent = fs.readFileSync(POST_LINK_TEMPLATE_FILE, "utf8");

// BASE
fs.emptyDirSync(BUILD_PATH);
fs.copySync(PUBLIC_PATH, BUILD_PATH, {
  dereference: true,
});

// POSTS & INDEX
fs.promises
  .readFile(POST_TEMPLATE_FILE, "utf8")
  .then(function (post_template: string) {
    fs.promises.readdir(RAW_PATH).then(
      function (files: string[]) {
        Promise.all(
          files.map(function (file: string) {
            if (!file.endsWith(".md")) {
              return null;
            }

            return fs.promises
              .readFile(path.join(RAW_PATH, file), "utf8")
              .then(function (contents: string) {
                const slug = file.slice(0, -3);
                const newFileName = slug + ".html";

                return remark()
                  .use(guide)
                  .use(html)
                  .use(frontmatter, ["yaml"])
                  .use(parseFrontmatter)
                  .use(copyFrontmatter)
                  .process(contents)
                  .then(function (vfile: VFile) {
                    const castVFile = vfile as BlogFile;
                    fs.promises
                      .mkdir(POSTS_PATH, {
                        recursive: true,
                      })
                      .then(() => {
                        fs.promises
                          .writeFile(
                            path.join(POSTS_PATH, newFileName),
                            interpolateTemplate(post_template, {
                              HEADER: headerContent,
                              FOOTER: footerContent,
                              TITLE: castVFile.data.frontmatter.title,
                              DESCRIPTION:
                                castVFile.data.frontmatter.description || "",
                              CONTENT: castVFile.toString(),
                            }),
                            {
                              flag: "w+",
                            }
                          )
                          .catch(function (err: NodeJS.ErrnoException) {
                            console.log(err);
                          });
                      });
                    return {
                      slug: slug,
                      title: castVFile.data.frontmatter.title,
                      description: castVFile.data.frontmatter.description || "",
                    };
                  });
              });
          })
        )
          .then((responses) => {
            return responses.filter(
              <TValue>(value: TValue | null | undefined): value is TValue => {
                return value !== null && value !== undefined;
              }
            );
          })
          .then((posts) => {
            fs.promises
              .readFile(INDEX_INPUT, "utf8")
              .then(function (contents: string) {
                fs.promises
                  .writeFile(
                    path.join(INDEX_OUTPUT),
                    interpolateTemplate(contents, {
                      HEADER: headerContent,
                      FOOTER: footerContent,
                      POSTS: posts
                        .map((post) => {
                          return interpolateTemplate(postLinkContent, {
                            SLUG: post.slug,
                            TITLE: post.title,
                            DESCRIPTION: post.description,
                          });
                        })
                        .join(""),
                    }),
                    {
                      flag: "w+",
                    }
                  )
                  .catch(function (err: NodeJS.ErrnoException) {
                    console.log(err);
                  });
              });
          });
      },
      function (err: NodeJS.ErrnoException) {
        return console.log("Unable to scan directory: " + err);
      }
    );
  });

// STYLES
sass.render(
  {
    file: STYLES_INPUT,
  },
  function (err: NodeJS.ErrnoException, result: SASSResult) {
    if (err) {
      return console.log("Unable to compile sass: " + err);
    }

    fs.promises
      .writeFile(STYLES_OUTPUT, result.css.toString(), {
        flag: "w+",
      })
      .catch(function (err: NodeJS.ErrnoException) {
        console.log(err);
      });
  }
);
