import fs from "fs";

export const clearLog = () => {
  fs.writeFileSync("./metadata.log", "", {
    encoding: "utf8",
    flag: "w",
  });
};

export const writeLog = (msg: string) => {
  fs.appendFileSync("./metadata.log", `${msg}\n`, {
    encoding: "utf8",
    flag: "a",
  });
};
