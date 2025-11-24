import { RawQuantity } from "@/api/types";

export function parseQuantity(raw: RawQuantity): number {
  if (typeof raw === "number") return raw;

  const str = raw.trim().replace(",", "."); // support commas like "0,5"

  // simple decimal: "0.5", "2", "-1.25"
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    return parseFloat(str);
  }

  // pure fraction: "1/2", "-3/4"
  if (/^-?\d+\/\d+$/.test(str)) {
    const [numStr, denStr] = str.split("/");
    const num = parseFloat(numStr);
    const den = parseFloat(denStr);
    if (den === 0) return 0;
    return num / den;
  }

  // mixed number: "1 1/2", "-2 3/4"
  if (/^-?\d+\s+\d+\/\d+$/.test(str)) {
    const [wholeStr, fracStr] = str.split(/\s+/); // e.g. ["1", "1/2"]
    const whole = parseFloat(wholeStr);
    const [numStr, denStr] = fracStr.split("/");
    const num = parseFloat(numStr);
    const den = parseFloat(denStr);
    if (den === 0) return whole;
    const sign = whole < 0 ? -1 : 1;
    return whole + sign * (num / den);
  }

  // If nothing matches, fallback (you can also throw or log)
  console.warn("Could not parse quantity:", raw);
  return 0;
}