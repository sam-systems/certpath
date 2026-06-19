const TOKEN = "certpath-admin-2026";
const amazon = (t) => `https://www.amazon.es/s?k=${encodeURIComponent(t)}`;
const b = (title, author, domain, level, audience, pages, publisher, tags) => ({
  title, author, domain, level, audience, pages, publisher,
  buyUrl: amazon(title), tags,
});

const items = [
  b("The Web Application Hacker's Handbook", "Dafydd Stuttard, Marcus Pinto", "ciberseguridad", "avanzado", "profesional", 912, "Wiley", ["Web", "Pentesting", "OWASP"]),
  b("CompTIA Security+ Study Guide (SY0-701)", "Mike Chapple, David Seidl", "ciberseguridad", "principiante", "estudiante", 640, "Sybex", ["Security+", "Certificación"]),
  b("The Hacker Playbook 3", "Peter Kim", "ciberseguridad", "intermedio", "profesional", 290, "Secure Planet", ["Red Team", "Pentesting"]),
  b("Computer Networking: A Top-Down Approach", "Kurose, Ross", "redes", "principiante", "estudiante", 864, "Pearson", ["Redes", "TCP/IP"]),
  b("The Linux Command Line", "William Shotts", "linux", "principiante", "ambos", 504, "No Starch Press", ["Linux", "Bash", "CLI"]),
  b("The Phoenix Project", "Gene Kim, Kevin Behr, George Spafford", "devops", "intermedio", "profesional", 432, "IT Revolution", ["DevOps", "Cultura"]),
  b("Kubernetes Up & Running", "Hightower, Burns, Beda", "devops", "intermedio", "profesional", 278, "O'Reilly", ["Kubernetes", "Contenedores"]),
  b("Hands-On Machine Learning", "Aurélien Géron", "ia", "intermedio", "ambos", 850, "O'Reilly", ["ML", "Python", "TensorFlow"]),
  b("Clean Code", "Robert C. Martin", "desarrollo", "intermedio", "profesional", 464, "Prentice Hall", ["Código limpio", "Buenas prácticas"]),
  b("AWS Certified Solutions Architect Study Guide", "Ben Piper, David Clinton", "cloud", "intermedio", "ambos", 640, "Sybex", ["AWS", "Certificación"]),
];

const res = await fetch("http://127.0.0.1:4000/api/books/import", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-import-token": TOKEN },
  body: JSON.stringify({ items }),
});
console.log("Libros:", items.length, "->", JSON.stringify(await res.json()));
