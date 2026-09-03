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
  ['La contratación correcta cambia el siguiente trimestre.', 'Cuando el rol importa, la búsqueda también debe importar.']
];

const palettes = [
  ['#1D1D1A', '#F2EEE4', '#D6FF46'],
  ['#F2EEE4', '#1D1D1A', '#C9B49B'],
  ['#1D1D1A', '#F2EEE4', '#C9B49B'],
  ['#C9B49B', '#1D1D1A', '#D6FF46'],
  ['#F2EEE4', '#1D1D1A', '#D6FF46'],
  ['#1D1D1A', '#F2EEE4', '#D6FF46'],
  ['#D6FF46', '#1D1D1A', '#F2EEE4'],
  ['#1D1D1A', '#F2EEE4', '#C9B49B'],
  ['#F2EEE4', '#1D1D1A', '#C9B49B'],
  ['#C9B49B', '#1D1D1A', '#F2EEE4']
];

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') === 'story' ? 'story' : 'feed';
  const n = Math.max(1, Math.min(10, Number(searchParams.get('i')) || 1));
  const [headline, sub] = ideas[n - 1];
  const [bg, fg, accent] = palettes[n - 1];
  const width = 1080;
  const height = format === 'story' ? 1920 : 1350;
  const pad = format === 'story' ? 92 : 78;
  const titleSize = format === 'story' ? 100 : 84;
  const subSize = format === 'story' ? 42 : 34;
  const logo = 'https://drive.google.com/uc?export=download&id=1PWSjiKWNj0tvNEhE7OiXGme1NxYawmHt';

  return new ImageResponse(
    React.createElement('div', {
      style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: bg, color: fg, padding: `${pad}px`, fontFamily: 'Arial, sans-serif', position: 'relative', overflow: 'hidden' }
    },
      React.createElement('div', { style: { position: 'absolute', width: format === 'story' ? 460 : 390, height: format === 'story' ? 460 : 390, borderRadius: 999, background: accent, right: -150, top: format === 'story' ? 260 : 120, opacity: 0.94 } }),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 } },
        React.createElement('img', { src: logo, width: format === 'story' ? 210 : 180, style: { objectFit: 'contain' } }),
        React.createElement('div', { style: { fontSize: 25, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700 } }, 'Headhunting · México')
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', maxWidth: format === 'story' ? 860 : 820, zIndex: 2 } },
        React.createElement('div', { style: { fontSize: titleSize, lineHeight: 0.96, fontWeight: 800, letterSpacing: -4 } }, headline),
        React.createElement('div', { style: { marginTop: 44, fontSize: subSize, lineHeight: 1.2, maxWidth: 760 } }, sub)
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2, fontSize: 28 } },
        React.createElement('div', { style: { fontWeight: 700 } }, 'tiey.cc'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 15 } },
          React.createElement('div', { style: { width: 14, height: 14, borderRadius: 999, background: accent } }),
          React.createElement('span', null, `0${n}`)
        )
      )
    ),
    { width, height }
  );
}
