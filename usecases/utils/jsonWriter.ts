import fs from "fs";
import path from "path";

export class JsonWriter {
  static write<T>(fileName: string, data: T) {
    const outputDir = path.join(process.cwd(), "testimonials");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return filePath;
  }
}
