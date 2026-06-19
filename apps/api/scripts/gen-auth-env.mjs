import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";

let env = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
function setVar(name, val) {
  const line = `${name}=${val}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  if (re.test(env)) env = env.replace(re, line);
  else env += (env.endsWith("\n") || env === "" ? "" : "\n") + line + "\n";
}
setVar("ADMIN_EMAIL", '"admin@certpath.local"');
setVar("ADMIN_PASSWORD_HASH", '"' + bcrypt.hashSync("CertPath2026!", 12) + '"');
setVar("AUTH_SECRET", '"' + crypto.randomBytes(48).toString("hex") + '"');
fs.writeFileSync(".env", env);
console.log("Auth env OK -> admin@certpath.local / CertPath2026!");
