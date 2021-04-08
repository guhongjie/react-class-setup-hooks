const rollup = require("rollup");
const terser = require("terser");
const path = require("path");
const fs = require("fs");

const setReg = new RegExp("[/\\\\]", "g");
const sep = (p) => {
  return p.replace(setReg, path.sep);
};
const formats = ["es", "umd", "cjs"];

const resolve = (p) => {
  return path.resolve(__dirname, p);
};

let config = {
  input: {
    input: resolve(sep("./src/index.js")),
    external: ["react"],
  },
  outputs: formats.map((format) => ({
    file: resolve(sep(`./packages/react-class-setup-hooks/index.${format}.js`)),
    name: "react-class-setup-hooks",
    format: format,
    globals: {
      react: "React",
    },
  })),
};

async function build() {
  await Promise.all(
    config.outputs.map((output) =>
      (async function () {
        const bundle = await rollup.rollup(config.input);
        const { code } = await bundle.generate(output);
        const minified = terser.minify(code, {
          output: {
            ascii_only: true,
            keep_quoted_props: true,
          },
          compress: {
            pure_funcs: ["makeMap"],
          },
          module: true,
          toplevel: true,
          nameCache: {},
        }).code;
        await write(output.file, minified);
      })()
    )
  );
}

function write(dest, code) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(
        blue(path.relative(process.cwd(), dest)) +
          " " +
          getSize(code) +
          (extra || "")
      );
      resolve();
    }
    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err);
      report();
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + "kb";
}

function blue(str) {
  return "\x1b[1m\x1b[34m" + str + "\x1b[39m\x1b[22m";
}

build();
