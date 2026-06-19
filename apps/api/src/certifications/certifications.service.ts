import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface CertFilters {
  domain?: string;
  vendor?: string;
  cost?: string;
}

export interface ImportItem {
  name: string;
  vendor: string;
  domain?: string;
  slug?: string;
  code?: string;
  level?: string;
  cost?: string;
  priceEUR?: number;
  url?: string;
  prepHours?: number;
  validityYears?: number | null;
  demand?: string;
  skills?: string[];
  logoUrl?: string;
  description?: string;
  targetRoles?: string[];
  careerOutcomes?: string[];
  prereqs?: string;
}

// Fabricante -> dominio oficial, para derivar el logo automáticamente
const VENDOR_DOMAIN: Record<string, string> = {
  cisco: "cisco.com",
  microsoft: "microsoft.com",
  comptia: "comptia.org",
  isc2: "isc2.org",
  "isaca": "isaca.org",
  fortinet: "fortinet.com",
  "amazon web services": "aws.amazon.com",
  aws: "aws.amazon.com",
  amazon: "aws.amazon.com",
  google: "google.com",
  "google cloud": "cloud.google.com",
  "red hat": "redhat.com",
  oracle: "oracle.com",
  vmware: "vmware.com",
  "palo alto networks": "paloaltonetworks.com",
  "palo alto": "paloaltonetworks.com",
  juniper: "juniper.net",
  "check point": "checkpoint.com",
  "offensive security": "offensive-security.com",
  "ec-council": "eccouncil.org",
  "the linux foundation": "linuxfoundation.org",
  "linux foundation": "linuxfoundation.org",
  lpi: "lpi.org",
  "cloud native computing foundation": "cncf.io",
  cncf: "cncf.io",
  hashicorp: "hashicorp.com",
  docker: "docker.com",
  kubernetes: "kubernetes.io",
  ibm: "ibm.com",
  sap: "sap.com",
  salesforce: "salesforce.com",
  splunk: "splunk.com",
  elastic: "elastic.co",
  gitlab: "gitlab.com",
  github: "github.com",
  atlassian: "atlassian.com",
  "iapp": "iapp.org",
  "pmi": "pmi.org",
  giac: "giac.org",
  sans: "sans.org",
  "ine": "ine.com",
  tryhackme: "tryhackme.com",
  "hack the box": "hackthebox.com",
  hackthebox: "hackthebox.com",
  offsec: "offsec.com",
  pecb: "pecb.com",
  peoplecert: "peoplecert.org",
  databricks: "databricks.com",
  nutanix: "nutanix.com",
  "devops institute": "devopsinstitute.com",
  citrix: "citrix.com",
  crowdstrike: "crowdstrike.com",
  zscaler: "zscaler.com",
  okta: "okta.com",
  cyberark: "cyberark.com",
  snowflake: "snowflake.com",
  mongodb: "mongodb.com",
  "the open group": "opengroup.org",
  axelos: "axelos.com",
  "ccn (cni)": "ccn-cert.cni.es",
  "ec council": "eccouncil.org",
  cwnp: "cwnp.com",
  "aruba": "arubanetworks.com",
  "hewlett packard enterprise": "hpe.com",
  hpe: "hpe.com",
  dell: "dell.com",
  "dell technologies": "dell.com",
  netapp: "netapp.com",
  f5: "f5.com",
};

export function vendorLogo(vendorName: string): string | null {
  const key = vendorName.trim().toLowerCase();
  const domain = VENDOR_DOMAIN[key];
  if (domain) return `https://logo.clearbit.com/${domain}`;
  return null;
}

const DOMAIN_TO_CATEGORY: Record<string, string> = {
  cloud: "Cloud",
  ciberseguridad: "Ciberseguridad",
  redes: "Redes",
  linux: "Linux & Sistemas",
  devops: "DevOps",
  soporte: "Soporte",
  ia: "IA & Datos",
  grc: "GRC",
  desarrollo: "Desarrollo",
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: CertFilters) {
    const where: Record<string, unknown> = {};
    if (filters.domain) where.category = { domain: filters.domain };
    if (filters.vendor) where.vendor = { name: filters.vendor };
    if (filters.cost) where.cost = filters.cost;

    const items = await this.prisma.certification.findMany({
      where,
      include: { vendor: true, category: true },
      orderBy: { name: "asc" },
    });
    return items.map(this.serialize);
  }

  async findOne(slug: string) {
    const cert = await this.prisma.certification.findUnique({
      where: { slug },
      include: { vendor: true, category: true },
    });
    return cert ? this.serialize(cert) : null;
  }

  async remove(slug: string) {
    const existing = await this.prisma.certification.findUnique({
      where: { slug },
    });
    if (!existing) return { ok: false, notFound: true };
    await this.prisma.certification.delete({ where: { slug } });
    return { ok: true };
  }

  async importMany(items: ImportItem[]) {
    let created = 0;
    let updated = 0;
    const errors: string[] = [];
    for (const it of items) {
      try {
        if (!it?.name || !it?.vendor) {
          errors.push("Falta name o vendor en un elemento");
          continue;
        }
        const domain =
          it.domain && DOMAIN_TO_CATEGORY[it.domain]
            ? it.domain
            : "ciberseguridad";
        const categoryName = DOMAIN_TO_CATEGORY[domain];
        const vendor = await this.prisma.vendor.upsert({
          where: { name: it.vendor },
          update: {},
          create: { name: it.vendor },
        });
        const category = await this.prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName, domain },
        });
        const slug = slugify(it.slug || it.name);
        const data = {
          name: it.name,
          code: it.code ?? null,
          level: it.level ?? "fundamentos",
          cost: it.cost ?? "pago",
          priceEUR: it.priceEUR ?? null,
          url: it.url ?? "",
          prepHours: it.prepHours ?? null,
          validityYears: it.validityYears ?? null,
          demand: it.demand ?? "media",
          skills: JSON.stringify(it.skills ?? []),
          logoUrl: it.logoUrl ?? null,
          description: it.description ?? null,
          targetRoles:
            it.targetRoles && it.targetRoles.length
              ? JSON.stringify(it.targetRoles)
              : null,
          careerOutcomes:
            it.careerOutcomes && it.careerOutcomes.length
              ? JSON.stringify(it.careerOutcomes)
              : null,
          prereqs: it.prereqs ?? null,
          vendorId: vendor.id,
          categoryId: category.id,
        };
        const existing = await this.prisma.certification.findUnique({
          where: { slug },
        });
        if (existing) {
          await this.prisma.certification.update({ where: { slug }, data });
          updated++;
        } else {
          await this.prisma.certification.create({ data: { slug, ...data } });
          created++;
        }
      } catch (e) {
        errors.push(`${it?.name ?? "?"}: ${(e as Error).message}`);
      }
    }
    return { created, updated, total: items.length, errors };
  }

  private serialize = (c: {
    skills: string;
    targetRoles?: string | null;
    careerOutcomes?: string | null;
    logoUrl?: string | null;
    vendor?: { name: string };
    [k: string]: unknown;
  }) => ({
    ...c,
    skills: JSON.parse(c.skills || "[]") as string[],
    targetRoles: JSON.parse(c.targetRoles || "[]") as string[],
    careerOutcomes: JSON.parse(c.careerOutcomes || "[]") as string[],
    // Logo manual si existe; si no, se deriva del fabricante
    logoUrl: c.logoUrl || (c.vendor ? vendorLogo(c.vendor.name) : null),
  });
}
