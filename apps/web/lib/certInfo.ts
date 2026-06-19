import type { Certification } from "./api";

// Genera información de ficha (para qué sirve / roles / salidas / perfil) por
// dominio + nivel cuando la certificación no la trae explícita de la BD.
// Así las 374 fichas muestran contenido útil sin tener que redactarlas a mano,
// y cualquier ficha curada en el importador tiene prioridad sobre lo derivado.

interface DomainInfo {
  area: string;
  roles: string[];
  outcomes: string[];
}

const DOMAIN_INFO: Record<string, DomainInfo> = {
  cloud: {
    area: "computación en la nube",
    roles: ["Cloud Engineer", "Arquitecto Cloud", "Administrador de la nube", "DevOps / SRE"],
    outcomes: [
      "Ingeniero/a de Cloud",
      "Arquitecto/a de soluciones en la nube",
      "Administrador/a de infraestructura Cloud",
      "Especialista en migración a la nube",
    ],
  },
  ciberseguridad: {
    area: "ciberseguridad",
    roles: ["Analista SOC", "Pentester / Hacker ético", "Ingeniero de seguridad", "Consultor de ciberseguridad"],
    outcomes: [
      "Analista de ciberseguridad (SOC)",
      "Pentester / Red Team",
      "Ingeniero/a de seguridad",
      "Analista de respuesta a incidentes (DFIR)",
      "Consultor/a de seguridad",
    ],
  },
  redes: {
    area: "redes y comunicaciones",
    roles: ["Administrador de redes", "Ingeniero de redes", "Arquitecto de redes", "Especialista en seguridad de red"],
    outcomes: [
      "Administrador/a de redes",
      "Ingeniero/a de redes",
      "Arquitecto/a de redes",
      "Técnico/a de comunicaciones",
    ],
  },
  linux: {
    area: "administración de sistemas Linux",
    roles: ["Administrador de sistemas Linux", "SysAdmin", "Ingeniero de sistemas"],
    outcomes: [
      "Administrador/a de sistemas Linux",
      "Ingeniero/a de sistemas",
      "Operaciones / SRE",
    ],
  },
  devops: {
    area: "DevOps y automatización",
    roles: ["DevOps Engineer", "SRE", "Platform Engineer", "Ingeniero de CI/CD"],
    outcomes: [
      "Ingeniero/a DevOps",
      "Site Reliability Engineer (SRE)",
      "Ingeniero/a de plataformas",
    ],
  },
  soporte: {
    area: "soporte y administración de TI",
    roles: ["Técnico de soporte (Helpdesk)", "Técnico de sistemas", "Administrador IT"],
    outcomes: [
      "Técnico/a de soporte (Helpdesk N1-N2)",
      "Técnico/a de sistemas",
      "Administrador/a de TI",
    ],
  },
  ia: {
    area: "inteligencia artificial y datos",
    roles: ["Data Analyst", "Data Scientist", "ML Engineer", "Ingeniero de IA"],
    outcomes: [
      "Analista de datos",
      "Científico/a de datos",
      "Ingeniero/a de Machine Learning",
      "Ingeniero/a de IA",
    ],
  },
  grc: {
    area: "gobierno, riesgo y cumplimiento (GRC)",
    roles: ["Auditor de seguridad", "Consultor GRC", "Responsable de cumplimiento", "DPO / Privacidad"],
    outcomes: [
      "Auditor/a de seguridad",
      "Consultor/a GRC",
      "Responsable de cumplimiento normativo",
      "Delegado/a de Protección de Datos (DPO)",
    ],
  },
  desarrollo: {
    area: "desarrollo de software",
    roles: ["Desarrollador de software", "Programador", "Ingeniero de software"],
    outcomes: [
      "Desarrollador/a backend o frontend",
      "Ingeniero/a de software",
      "Programador/a de aplicaciones",
    ],
  },
};

const DEFAULT_INFO: DomainInfo = {
  area: "tecnología",
  roles: ["Perfil técnico de TI"],
  outcomes: ["Perfil técnico en tecnologías de la información"],
};

const LEVEL_PHRASE: Record<string, string> = {
  fundamentos: "valida los conocimientos base y la terminología esencial",
  associate: "acredita un nivel intermedio, con capacidad para trabajar de forma autónoma",
  professional: "demuestra dominio profesional para diseñar e implementar soluciones",
  expert: "certifica un nivel experto para liderar arquitecturas y decisiones críticas",
  specialty: "valida un conocimiento especializado en un área concreta",
};

const LEVEL_PROFILE: Record<string, (area: string) => string> = {
  fundamentos: (a) => `Ideal para quien empieza en ${a}: no requiere experiencia previa.`,
  associate: (a) => `Recomendada con 6-12 meses de experiencia en ${a} o tras una certificación de fundamentos.`,
  professional: (a) => `Dirigida a profesionales con experiencia práctica en ${a}.`,
  expert: (a) => `Para perfiles sénior con experiencia consolidada en ${a}; suele requerir certificaciones previas.`,
  specialty: (a) => `Para profesionales que quieren especializarse en un dominio concreto de ${a}.`,
};

export interface CertInfo {
  description: string;
  roles: string[];
  outcomes: string[];
  profile: string;
}

export function deriveCertInfo(cert: Certification): CertInfo {
  const info = DOMAIN_INFO[cert.category?.domain] ?? DEFAULT_INFO;
  const level = cert.level || "fundamentos";
  const levelPhrase = LEVEL_PHRASE[level] ?? LEVEL_PHRASE.fundamentos;
  const profileFn = LEVEL_PROFILE[level] ?? LEVEL_PROFILE.fundamentos;

  // Descripción: usa la de la BD si está; si no, se genera.
  let description = cert.description?.trim() || "";
  if (!description) {
    const skillsPhrase =
      cert.skills && cert.skills.length
        ? ` Cubre competencias como ${cert.skills.slice(0, 4).join(", ")}.`
        : "";
    description = `La certificación ${cert.name} de ${cert.vendor.name} ${levelPhrase} en ${info.area}.${skillsPhrase}`;
  }

  const roles = cert.targetRoles?.length ? cert.targetRoles : info.roles;
  const outcomes = cert.careerOutcomes?.length ? cert.careerOutcomes : info.outcomes;
  const profile = cert.prereqs?.trim() || profileFn(info.area);

  return { description, roles, outcomes, profile };
}
