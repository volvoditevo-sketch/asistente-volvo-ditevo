// services/geminiService.ts
import { Sender } from "../types";

type GeminiResponse = {
  text: string;
  sources?: string[];
};

// --- Datos oficiales (extraídos de la web oficial en snippets) ---
// Ventas
const HOURS_SALES: Record<string, string> = {
  berlin: "Lunes a Viernes: 09:00–13:30 / 16:00–19:30 · Sábados: 10:00–14:00",
  "sant just": "Lunes a Viernes: 09:00–13:30 / 16:00–19:30 · Sábados: 10:00–14:00",
  "sant cugat": "Lunes a Viernes: 09:30–13:30 / 16:00–19:30 · Sábados: 10:00–14:00",
  maquinista: "Lunes a Viernes: 09:00–13:30 / 16:00–19:30 · Sábados: 10:00–14:00",
};

// Taller (si no está claro para un centro, derivamos a WhatsApp Taller)
const HOURS_TALLER: Record<string, string> = {
  "sant just": "Lunes a Jueves: 08:00–13:30 / 15:00–19:00 · Viernes: 08:00–13:30 / 15:00–18:00",
  "sant cugat": "Lunes a Jueves: 08:00–13:30 / 15:00–18:00 · Viernes: 08:00–13:30 / 15:00–18:00",
  maquinista: "Lunes a Jueves: 08:00–13:30 / 15:00–18:00 · Viernes: 08:00–13:30 / 15:00–18:00",
  // berlin: si no tienes el horario confirmado en la web, lo derivamos a WhatsApp Taller
};

const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

type Center = "berlin" | "sant just" | "sant cugat" | "maquinista";

const detectCenter = (q: string): Center | null => {
  const t = normalize(q);
  if (t.includes("berlin") || t.includes("les corts")) return "berlin";
  if (t.includes("sant just")) return "sant just";
  if (t.includes("sant cugat")) return "sant cugat";
  if (t.includes("maquinista") || t.includes("sant andreu")) return "maquinista";
  return null;
};

const isAboutWorkshop = (t: string) =>
  t.includes("taller") ||
  t.includes("revision") ||
  t.includes("mantenimiento") ||
  t.includes("cita") ||
  t.includes("postventa") ||
  t.includes("recambios");

const isAboutHours = (t: string) =>
  t.includes("horario") ||
  t.includes("abre") ||
  t.includes("cierra") ||
  t.includes("sabado") ||
  t.includes("domingo");

const isAboutCars = (t: string) =>
  t.includes("coche") ||
  t.includes("coches") ||
  t.includes("ocasion") ||
  t.includes("segunda mano") ||
  t.includes("selekt") ||
  t.includes("vn") ||
  t.includes("nuevo") ||
  t.includes("precio") ||
  t.includes("stock") ||
  t.includes("modelo") ||
  t.includes("xc") ||
  t.includes("ex");

const centerLabel = (center: Center) =>
  center === "berlin"
    ? "Barcelona Berlín"
    : center === "sant just"
    ? "Sant Just"
    : center === "sant cugat"
    ? "Sant Cugat"
    : "La Maquinista";

export async function getGeminiResponse(userInput: string): Promise<GeminiResponse> {
  const q = userInput || "";
  const t = normalize(q);
  const center = detectCenter(q);

  // 1) Taller: SIEMPRE a WhatsApp Taller (y si preguntan horario, respondemos si está en tabla)
  if (isAboutWorkshop(t)) {
    if (isAboutHours(t)) {
      if (center && HOURS_TALLER[center]) {
        return {
          text: `El horario de Taller en ${centerLabel(center)} es: ${HOURS_TALLER[center]}. ¿Desea abrir el WhatsApp de Taller ahora?`,
        };
      }
      return {
        text: "Para Taller, le atendemos directamente por WhatsApp. ¿Desea abrir el WhatsApp de Taller ahora?",
      };
    }

    return {
      text: "Para Taller y cita de revisión, le atendemos directamente por WhatsApp. ¿Desea abrir el WhatsApp de Taller ahora?",
    };
  }

  // 2) Preguntas de coches: derivar a WhatsApp Ventas + elegir centro
  if (isAboutCars(t)) {
    if (center) {
      return {
        text: `Perfecto. Para información de vehículos (VN u Ocasión), lo más rápido es atenderle por WhatsApp del centro de ${centerLabel(
          center
        )}. ¿Desea abrir WhatsApp Ventas ahora?`,
      };
    }

    return {
      text: "Perfecto. ¿Con qué centro desea hablar por WhatsApp: Barcelona Berlín, Sant Just, Sant Cugat o La Maquinista?",
    };
  }

  // 3) Horarios de ventas (si no especifica centro, preguntamos centro)
  if (isAboutHours(t)) {
    if (!center) {
      return { text: "¿De qué centro desea el horario: Barcelona Berlín, Sant Just, Sant Cugat o La Maquinista?" };
    }

    const h = HOURS_SALES[center];
    return {
      text: h
        ? `El horario de Ventas en ${centerLabel(center)} es: ${h}.`
        : `¿De qué centro desea el horario: Barcelona Berlín, Sant Just, Sant Cugat o La Maquinista?`,
    };
  }

  // 4) Ubicaciones
  if (t.includes("ubicacion") || t.includes("direccion") || t.includes("donde") || t.includes("centro")) {
    return {
      text: "Tenemos centros en Barcelona Berlín (Les Corts), Sant Just, Sant Cugat y La Maquinista. ¿Qué centro le interesa?",
    };
  }

  // 5) Fallback (no inventa)
  return {
    text: "Para atenderle correctamente, ¿su consulta es de Ventas (VN/Ocasión) o de Taller?",
  };
}
