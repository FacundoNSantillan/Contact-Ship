import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly MODEL = 'gemini-2.5-flash';
  private readonly API_VERSION = 'v1beta';

  async generateLeadInsights(firstName: string, lastName: string) {
    const url = `https://generativelanguage.googleapis.com/${this.API_VERSION}/models/${this.MODEL}:generateContent?key=${this.apiKey}`;

    const data = {
      contents: [
        {
          parts: [
            {
              text: `Genera un JSON para un lead llamado ${firstName} ${lastName}. 
                 Formato estrictamente JSON: {"summary": "frase corta", "nextAction": "accion"}. 
                 Idioma: Español. Sin markdown.`,
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(url, data);

      const candidate = response.data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (!text) throw new Error('Respuesta de IA vacía');
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      this.logger.error(`Fallo en insights (usando fallback): ${errorMsg}`);

      return {
        summary: 'Nuevo lead registrado en el sistema.',
        nextAction: 'Realizar contacto inicial para calificar interés.',
      };
    }
  }
}
