
import { GoogleGenAI, Type } from "@google/genai";
import { Vehicle, Category } from "../types";

const SYSTEM_INSTRUCTION = `
Eres el Asistente Oficial de Volvo Cars Ditevo Barcelona. Tu objetivo es ayudar a clientes y comerciales con información precisa sobre el concesionario.
REGLAS CRÍTICAS:
1. Responde ÚNICAMENTE basándote en la información del sitio web oficial: https://www.volvocarsditevobarcelona.es/
2. Utiliza la herramienta de búsqueda de Google (Google Search) para verificar datos actuales en dicho sitio web antes de responder.
3. Si la información no está disponible en la web, di amablemente que no dispones de ese dato específico.
4. Tu tono debe ser profesional, elegante y cercano.
5. Prioriza información sobre stock, ofertas, taller, horarios y ubicación.
`;

export const getGeminiResponse = async (userPrompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Lo siento, he tenido un problema al procesar tu consulta.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const sources = groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      })) || [];

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Error de conexión.", sources: [] };
  }
};

export const getVehicleCatalog = async (category: Category): Promise<Vehicle[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const section = category === 'VN' ? 'vehículos nuevos / stock disponible' : 'vehículos de ocasión / Volvo Selekt';
  const url = category === 'VN' ? 'https://www.volvocarsditevobarcelona.es/coches-volvo-nuevos-barcelona/' : 'https://www.volvocarsditevobarcelona.es/coches-segunda-mano-barcelona/';

  const prompt = `Extrae los 12 vehículos más destacados de la sección de ${section} de la web https://www.volvocarsditevobarcelona.es/. 
  Busca específicamente en ${url}.
  Para cada vehículo, necesito: título/modelo, precio, imagen (URL absoluta), URL de la ficha detalle, y si es ocasión, año y kilómetros.
  Si no encuentras imágenes reales, usa una URL de placeholder de alta calidad relacionada con Volvo.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              price: { type: Type.STRING },
              year: { type: Type.STRING },
              km: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              detailUrl: { type: Type.STRING },
            },
            required: ["type", "title", "price", "imageUrl", "detailUrl"],
          },
        },
      },
    });

    const jsonStr = response.text;
    return JSON.parse(jsonStr) as Vehicle[];
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return [];
  }
};
