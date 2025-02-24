import fs from "fs";
import Metadata from "types/Metadata";

export const getMetadataStore = (): Metadata[] => {
  return JSON.parse(fs.readFileSync("./metadata.json", "utf8"));
};

export const writeMetadataStore = (metadata: Metadata[]) => {
  fs.writeFileSync("./metadata.json", JSON.stringify(metadata, undefined, 2), {
    encoding: "utf8",
    flag: "w",
  });
};
