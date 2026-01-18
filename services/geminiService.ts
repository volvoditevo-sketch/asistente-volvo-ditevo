export async function getGeminiResponse(prompt: string): Promise<{
  text: string;
  sources: string[];
}> {
  return {
    text:
      "Hola, soy el asistente digital oficial de Volvo Ditevo Barcelona. " +
      "Puedo ayudarte con información sobre nuestros concesionarios, " +
      "horarios, citas de taller y modelos Volvo disponibles. " +
      "¿En qué puedo ayudarte?",
    sources: [],
  };
}
