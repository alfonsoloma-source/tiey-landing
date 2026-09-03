import React from 'react';
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const ideas = [
  ['Talento que mueve el negocio.', 'Las contrataciones importantes empiezan con una búsqueda clara.'],
  ['Menos CVs. Más criterio.', 'Una shortlist útil prioriza relevancia sobre volumen.'],
  ['El mercado no llega solo.', 'El mejor talento muchas veces no está buscando activamente.'],
  ['Contratar rápido empieza antes.', 'Alinear reto, nivel y expectativas reduce semanas de búsqueda.'],
  ['Una vacante también cuesta mientras sigue abierta.', 'Tiempo, proyectos y capacidad del equipo están en juego.'],
  ['Buscar bien es saber dónde no buscar.', 'Criterios claros eliminan ruido y aceleran decisiones.'],
  ['No publicamos y esperamos.', 'Mapeamos, contactamos, evaluamos y acompañamos.'],
  ['Una buena entrevista empieza con contexto.', 'Cada perfil debe llegar con razones claras para avanzar.'],
  ['Headhunting es ampliar el mercado.', 'También incluye a quienes hoy están trabajando y creciendo.'],
  ['La contratación correcta cambia el siguiente trimestre.', 'Cuando el rol importa, la búsqueda también debe importar.'],
  ['Una vacante crítica merece foco.', 'Más volumen no siempre significa mejores candidatos.'],
  ['El proceso correcto reduce incertidumbre.', 'Entender, mapear, evaluar y acompañar.'],
  ['El talento pasivo también escucha.', 'La oportunidad correcta puede abrir conversaciones que una vacante publicada no logra.'],
  ['La precisión ahorra entrevistas.', 'Mejores criterios producen mejores conversaciones.'],
  ['Contratar bien también es descartar bien.', 'No todo perfil interesante es el perfil correcto.'],
  ['Una búsqueda se construye, no se improvisa.', 'Mercado, propuesta y evaluación deben apuntar al mismo objetivo.'],
  ['Cada perfil necesita una razón para avanzar.', 'Experiencia, contexto y ajuste al reto.'],
  ['El cuello de botella puede estar en la búsqueda.', 'Cuando pasan semanas sin perfiles, cambia el enfoque, no solo el volumen.'],
  ['El mercado real importa.', 'Compensación, disponibilidad y competencia cambian la estrategia.'],
  ['Menos ruido. Mejores decisiones.', 'Una shortlist corta puede ser más valiosa que una bandeja llena.'],
  ['La velocidad viene de la claridad.', 'Criterios definidos aceleran cada decisión del proceso.'],
  ['Una contratación empieza con el problema correcto.', 'Primero entendemos qué debe resolver la persona.'],
  ['No todo candidato está aplicando.', 'La búsqueda directa llega a perfiles fuera del radar habitual.'],
  ['Un rol abierto impacta al equipo.', 'También afecta carga, proyectos y ritmo de crecimiento.'],
  ['La búsqueda también comunica la empresa.', 'Cada acercamiento debe hacer sentido para ambas partes.'],
  ['La entrevista no debería empezar desde cero.', 'El contexto previo hace mejores preguntas y mejores decisiones.'],
  ['Contratar es una decisión de negocio.', 'El método importa tanto como el resultado.'],
  ['Cuando contratar importa, el proceso necesita dirección.', 'Tiey acompaña la búsqueda de principio a fin.']
];

const palettes = [
  ['#1D1D1A', '#F2EEE4', '#D6FF46'], ['#F2EEE4', '#1D1D1A', '#C9B49B'],
  ['#1D1D1A', '#F2EEE4', '#C9B49B'], ['#C9B49B', '#1D1D1A', '#D6FF46'],
  ['#F2EEE4', '#1D1D1A', '#D6FF46'], ['#1D1D1A', '#F2EEE4', '#D6FF46'],
  ['#D6FF46', '#1D1D1A', '#F2EEE4'], ['#1D1D1A', '#F2EEE4', '#C9B49B'],
  ['#F2EEE4', '#1D1D1A', '#C9B49B'], ['#C9B49B', '#1D1D1A', '#F2EEE4']
];

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') === 'story' ? 'story' : 'feed';
  const n = Math.max(1, Math.min(28, Number(searchParams.get('i')) || 1));
  const [headline, sub] = ideas[n - 1];
  const [bg, fg, accent] = palettes[(n - 1) % palettes.length];
  const width = 1080;
  const height = format === 'story' ? 1920 : 1350;
  const pad = format === 'story' ? 92 : 78;
  const titleSize = format === 'story' ? 100 : 84;
  const subSize = format === 'story' ? 42 : 34;
  const logo = 'https://drive.google.com/uc?export=download&id=1PWSjiKWNj0tvNEhE7OiXGme1NxYawmHt';
  const circleSize = format === 'story' ? 430 + ((n % 4) * 30) : 360 + ((n % 4) * 24);
  const circleTop = format === 'story' ? 180 + ((n % 5) * 120) : 80 + ((n % 5) * 70);
  const circleRight = -120 - ((n % 3) * 45);
  const align = n % 3 === 0 ? 'flex-end' : 'flex-start';
  const textAlign = n % 3 === 0 ? 'right' : 'left';

  return new ImageResponse(
    React.createElement('div', {
      style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: bg, color: fg, padding: `${pad}px`, fontFamily: 'Arial, sans-serif', position: 'relative', overflow: 'hidden' }
    },
      React.createElement('div', { style: { position: 'absolute', width: circleSize, height: circleSize, borderRadius: 999, background: accent, right: circleRight, top: circleTop, opacity: 0.94 } }),
      React.createElement('div', { style: { position: 'absolute', width: n % 2 === 0 ? 12 : 220, height: n % 2 === 0 ? 500 : 12, background: accent, left: n % 2 === 0 ? 46 : 80, bottom: n % 2 === 0 ? 120 : 80, opacity: 0.95 } }),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 } },
        React.createElement('img', { src: logo, width: format === 'story' ? 210 : 180, style: { objectFit: 'contain' } }),
        React.createElement('div', { style: { fontSize: 25, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700 } }, 'Headhunting · México')
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: align, zIndex: 2 } },
        React.createElement('div', { style: { fontSize: titleSize, lineHeight: 0.96, fontWeight: 800, letterSpacing: -4, maxWidth: format === 'story' ? 860 : 820, textAlign } }, headline),
        React.createElement('div', { style: { marginTop: 44, fontSize: subSize, lineHeight: 1.2, maxWidth: 760, textAlign } }, sub)
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2, fontSize: 28 } },
        React.createElement('div', { style: { fontWeight: 700 } }, 'tiey.cc'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 15 } },
          React.createElement('div', { style: { width: 14, height: 14, borderRadius: 999, background: accent } }),
          React.createElement('span', null, String(n).padStart(2, '0'))
        )
      )
    ),
    { width, height }
  );
}
