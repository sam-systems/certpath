import "dotenv/config";

const API = process.env.API_URL || "http://127.0.0.1:4000/api";
const TOKEN = process.env.IMPORT_TOKEN;

const items = [
  { name: "PCEP – Certified Entry-Level Python Programmer", vendor: "Python Institute", domain: "desarrollo", level: "fundamentos", cost: "pago", priceEUR: 59, url: "https://pythoninstitute.org/pcep", skills: ["Python", "Programación básica"] },
  { name: "PCAP – Certified Associate Python Programmer", vendor: "Python Institute", domain: "desarrollo", level: "associate", cost: "pago", priceEUR: 295, url: "https://pythoninstitute.org/pcap", skills: ["Python", "POO", "Módulos"] },
  { name: "PCPP1 – Certified Professional in Python", vendor: "Python Institute", domain: "desarrollo", level: "professional", cost: "pago", priceEUR: 195, url: "https://pythoninstitute.org/pcpp", skills: ["Python avanzado", "GUI", "Redes"] },
  { name: "Oracle Certified Professional: Java SE 17 Developer", vendor: "Oracle", domain: "desarrollo", level: "professional", cost: "pago", priceEUR: 245, url: "https://education.oracle.com/java-se-17-developer/pexam_1Z0-829", skills: ["Java", "POO", "Streams"] },
  { name: "Foundational C# with Microsoft", vendor: "Microsoft", domain: "desarrollo", level: "fundamentos", cost: "gratis", url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", skills: ["C#", ".NET", "Programación"] },
  { name: "Professional Scrum Developer (PSD)", vendor: "Scrum.org", domain: "desarrollo", level: "professional", cost: "pago", priceEUR: 200, url: "https://www.scrum.org/assessments/professional-scrum-developer-certification", skills: ["Scrum", "Desarrollo ágil", "DevOps"] },
  { name: "Meta Front-End Developer", vendor: "Meta", domain: "desarrollo", level: "associate", cost: "pago", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", skills: ["HTML/CSS", "JavaScript", "React"] },
  { name: "Meta Back-End Developer", vendor: "Meta", domain: "desarrollo", level: "associate", cost: "pago", url: "https://www.coursera.org/professional-certificates/meta-back-end-developer", skills: ["Python", "Django", "APIs"] },
  { name: "GitHub Foundations", vendor: "GitHub", domain: "desarrollo", level: "fundamentos", cost: "pago", priceEUR: 99, url: "https://examregistration.github.com/certifications", skills: ["Git", "GitHub", "Colaboración"] },
  { name: "W3Schools Certified JavaScript Developer", vendor: "W3Schools", domain: "desarrollo", level: "associate", cost: "pago", priceEUR: 95, url: "https://www.w3schools.com/cert/cert_javascript.asp", skills: ["JavaScript", "DOM", "ES6"] },
  { name: "Salesforce Platform Developer I", vendor: "Salesforce", domain: "desarrollo", level: "associate", cost: "pago", priceEUR: 200, url: "https://trailhead.salesforce.com/credentials/platformdeveloperi", skills: ["Apex", "Lightning", "Salesforce"] },
  { name: "Unity Certified Programmer", vendor: "Unity", domain: "desarrollo", level: "professional", cost: "pago", url: "https://unity.com/products/unity-certifications", skills: ["C#", "Unity", "Videojuegos"] },
  { name: "Certified Kotlin Developer", vendor: "JetBrains", domain: "desarrollo", level: "associate", cost: "pago", url: "https://www.jetbrains.com/", skills: ["Kotlin", "Android", "JVM"] },
  { name: "Zend Certified PHP Engineer", vendor: "Zend", domain: "desarrollo", level: "professional", cost: "pago", priceEUR: 195, url: "https://www.zend.com/training/php-certification-exam", skills: ["PHP", "Backend", "Web"] },
];

const res = await fetch(`${API}/certifications/import`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-import-token": TOKEN },
  body: JSON.stringify({ items }),
});
console.log(res.status, await res.text());
