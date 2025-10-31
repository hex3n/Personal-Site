import fs from "fs";
import path from "path";
import { inputDir, jsonOutput } from "./config";

function stripFrontmatter(md: string): string {
  // Remove leading YAML frontmatter if present
  if (md.startsWith("---")) {
    const end = md.indexOf("\n---", 3);
    if (end !== -1) {
      return md.slice(end + 4);
    }
  }
  return md;
}

function parseFrontmatter(md: string): Record<string, any> | null {
  if (!md.startsWith("---")) return null;
  const end = md.indexOf("\n---", 3);
  if (end === -1) return null;
  const frontmatter = md.slice(3, end).trim();
  const result: Record<string, any> = {};
  frontmatter.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      const value = rest.join(":").trim();
      // Handle lists like: tags: [xss, recon]
      if (value.startsWith("[") && value.endsWith("]")) {
        result[key.trim()] = value
          .slice(1, -1)
          .split(",")
          .map((t) => t.trim().replace(/^['"]|['"]$/g, ""));
      } else {
        result[key.trim()] = value.replace(/^['"]|['"]$/g, "");
      }
    }
  });
  return result;
}

function cleanInlineMarkdown(s: string): string {
  if (!s) return "";
  return s
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // links
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstNSentences(text: string, n = 2): string {
  const re = /(.+?[.!?])(\s+|$)/g;
  const sentences: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) && sentences.length < n && m[1]) {
    sentences.push(m[1].trim());
  }
  if (sentences.length > 0) {
    return sentences.join(" ");
  }
  if (text.length > 200) return text.slice(0, 197).trim() + "...";
  return text.trim();
}

function extractSection(md: string, headingRegex: RegExp): string | null {
  const lines = md.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (headingRegex.test(line)) {
      const collected: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        const ln = lines[j];
        if (!ln) continue;
        if (/^\s{0,3}#{1,6}\s+/.test(ln)) break;
        if (/^\s*```/.test(ln)) {
          j++;
          while (j < lines.length && lines[j] && !/^\s*```/.test(lines[j]!)) j++;
          continue;
        }
        collected.push(ln);
      }
      return collected.join("\n").trim();
    }
  }
  return null;
}

function findFirstParagraphAfterTitle(md: string): string {
  const lines = md.split(/\r?\n/);
  let startedAfterTitle = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const ln = line.trim();
    if (!startedAfterTitle) {
      if (/^\s*#\s+/.test(ln)) {
        startedAfterTitle = true;
        continue;
      }
      if (ln !== "") {
        startedAfterTitle = true;
        i--;
        continue;
      }
    } else {
      for (let j = i; j < lines.length; j++) {
        const currentLine = lines[j];
        if (!currentLine) continue;
        const l = currentLine.trim();
        if (l === "") continue;
        if (/^\s*#{1,6}\s+/.test(l)) return "";
        if (
          /^\s*[-*+]\s+/.test(l) ||
          /^\s*>/.test(l) ||
          /^\s*\|/.test(l) ||
          /^\s*```/.test(l)
        )
          continue;
        const collected: string[] = [];
        for (let k = j; k < lines.length; k++) {
          const lk = lines[k];
          if (!lk) break;
          if (lk.trim() === "") break;
          if (
            /^\s*[-*+]\s+/.test(lk) ||
            /^\s*#{1,6}\s+/.test(lk) ||
            /^\s*>/.test(lk) ||
            /^\s*\|/.test(lk) ||
            /^\s*```/.test(lk)
          )
            break;
          collected.push(lk);
        }
        return collected.join(" ").trim();
      }
    }
  }
  return "";
}

interface Metadata {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

function extractTags(md: string, fmTags?: string[]): string[] {
  const found = new Set<string>();

  // 1) YAML frontmatter tags take priority
  if (fmTags && fmTags.length) {
    fmTags.forEach((t) => found.add(t.toLowerCase()));
  }

  // 2) Auto-detect common pentest keywords in the text
  const commonTags = [
    "xss",
    "sqli",
    "recon",
    "sliver",
    "metasploit",
    "tryhackme",
    "hackthebox",
    "forensics",
    "enum",
    "privilege escalation",
    "crypto",
    "red team",
    "memory",
    "web",
    "exploit",
  ];
  const lower = md.toLowerCase();
  commonTags.forEach((t) => {
    if (lower.includes(t)) found.add(t);
  });

  return Array.from(found);
}

function extractMetadataFromMd(mdContent: string, filename: string): Metadata {
  const frontmatterData = parseFrontmatter(mdContent);
  mdContent = stripFrontmatter(mdContent);

  let metadata: Metadata = {
    id: path.basename(filename, ".md"),
    title: path.basename(filename, ".md").replace(/[-_]/g, " "),
    description: "",
    tags: [],
  };

  const h1Match = mdContent.match(/^\s*#\s+(.+)$/m);
  if (h1Match && h1Match[1]) metadata.title = h1Match[1].trim();

  // Description logic
  const execSection = extractSection(mdContent, /^\s*#{2,6}\s*Executive Summary\s*$/i);
  if (execSection && execSection.length > 20) {
    metadata.description = firstNSentences(cleanInlineMarkdown(execSection), 2);
  } else {
    const para = findFirstParagraphAfterTitle(mdContent);
    if (para && para.length > 20)
      metadata.description = firstNSentences(cleanInlineMarkdown(para), 2);
    else
      metadata.description = firstNSentences(cleanInlineMarkdown(mdContent), 1);
  }

  // Tag extraction
  metadata.tags = extractTags(mdContent, frontmatterData?.tags);

  return metadata;
}

export const extractMetaData = async () => {
  const outputFile = jsonOutput;

  const files = fs
    .readdirSync(inputDir)
    .filter((file): file is string => file.endsWith(".md"));

  if (files.length === 0) {
    console.log("No .md files found in", inputDir);
    process.exit(0);
  }

  console.log(`Found ${files.length} .md files to process...`);

  const metadataArray: Metadata[] = files.map((file) => {
    try {
      const inputPath = path.join(inputDir, file);
      const mdContent = fs.readFileSync(inputPath, "utf8");
      const metadata = extractMetadataFromMd(mdContent, file);
      console.log(`✓ Extracted: ${file}`);
      return metadata;
    } catch (error: any) {
      console.error(`✗ Error processing ${file}:`, error.message || error);
      return {
        id: path.basename(file, ".md"),
        title: path.basename(file, ".md").replace(/[-_]/g, " "),
        description: "",
        tags: [],
      };
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(metadataArray, null, 2));
  console.log(`\n✅ Metadata saved to ${outputFile}`);
};
