import { slugify, vendorLogo } from "../src/certifications/certifications.service";

describe("slugify", () => {
  it("convierte a kebab-case", () => {
    expect(slugify("AWS Certified Solutions Architect")).toBe(
      "aws-certified-solutions-architect",
    );
  });
  it("colapsa separadores y recorta guiones", () => {
    expect(slugify("  CCNA / 200-301 !! ")).toBe("ccna-200-301");
  });
  it("quita acentos no ascii dejando guiones", () => {
    // 'ó' no es [a-z0-9] -> se vuelve separador
    expect(slugify("Administración de Redes")).toBe("administraci-n-de-redes");
  });
});

describe("vendorLogo", () => {
  it("deriva el logo de fabricantes conocidos (case-insensitive)", () => {
    expect(vendorLogo("Microsoft")).toBe("https://logo.clearbit.com/microsoft.com");
    expect(vendorLogo("  cisco ")).toBe("https://logo.clearbit.com/cisco.com");
    expect(vendorLogo("CompTIA")).toBe("https://logo.clearbit.com/comptia.org");
  });
  it("devuelve null para fabricantes desconocidos", () => {
    expect(vendorLogo("Varios")).toBeNull();
    expect(vendorLogo("Universidad de León (ULE)")).toBeNull();
  });
});
