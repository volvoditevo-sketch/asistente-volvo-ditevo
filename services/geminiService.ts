// services/geminiService.ts

type GeminiResponse = {
  text: string;
  sources?: string[];
};

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .trim();
}

export async function getGeminiResponse(prompt: string): Promise<GeminiResponse> {
  const p = normalize(prompt);

  // 1) UBICACIONES / HORARIOS
  if (
    p.includes("ubicacion") ||
    p.includes("direccion") ||
    p.includes("donde estais") ||
    p.includes("donde estan") ||
    p.includes("horario") ||
    p.includes("horarios") ||
    p.includes("concesionario") ||
    p.includes("sant cugat") ||
    p.includes("sant just") ||
    p.includes("maquinista") ||
    p.includes("berlin")
  ) {
    return {
      text:
        "Tenemos 4 centros en Barcelona:\n\n" +
        "• **Berlin**\n" +
        "• **La Maquinista**\n" +
        "• **Sant Just**\n" +
        "• **Sant Cugat**\n\n" +
        "Dime cuál te interesa y te paso **dirección y horarios**.",
    };
  }

  // 2) CITA TALLER
  if (
    p.includes("cita taller") ||
    p.includes("taller") ||
    p.includes("revision") ||
    p.includes("mantenimiento") ||
    p.includes("cita") ||
    p.includes("itv") ||
    p.includes("averia")
  ) {
    return {
      text:
        "Perfecto. Para pedir **cita de taller**, dime:\n" +
        "1) ¿En qué centro? (Berlin / Maquinista / Sant Just / Sant Cugat)\n" +
        "2) ¿Qué necesitas? (revisión, mantenimiento, avería, etc.)\n" +
        "3) ¿Qué día y franja horaria te va bien?\n\n" +
        "Con eso te indico el siguiente paso.",
    };
  }

  // 3) EL NUEVO EX30
  if (p.includes("ex30") || p.includes("nuevo ex30")) {
    return {
      text:
        "El **Volvo EX30** es nuestro SUV compacto 100% eléctrico.\n\n" +
        "Si me dices tu uso (ciudad / viajes), presupuesto aproximado y si tienes punto de carga, te recomiendo la versión ideal.",
    };
  }

  // 4) OCASIÓN
  if (
    p.includes("ocasion") ||
    p.includes("segunda mano") ||
    p.includes("seminuevo") ||
    p.includes("km0") ||
    p.includes("km 0") ||
    p.includes("usado")
  ) {
    return {
      text:
        "Sí, tenemos **vehículos de ocasión**.\n\n" +
        "Para ayudarte rápido, dime:\n" +
        "• Modelo que te interesa (XC40, XC60, EX30, etc.)\n" +
        "• Presupuesto máximo\n" +
        "• Gasolina / diésel / híbrido / eléctrico\n\n" +
        "Y te digo opciones y el siguiente paso.",
    };
  }

  // 5) RESPUESTA GENERAL (cuando no encaja en nada)
  return {
    text:
      "Entendido. Puedo ayudarte con:\n" +
      "• Ubicaciones y horarios\n" +
      "• Cita de taller\n" +
      "• Información del Volvo EX30\n" +
      "• Vehículos de ocasión\n\n" +
      "¿Qué necesitas exactamente?",
  };
}
