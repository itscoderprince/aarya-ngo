// src/lib/pdfkit-node.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Use CommonJS require so Next.js doesn't try to SWC-bundle these modules
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

export { PDFDocument, fs, path };
