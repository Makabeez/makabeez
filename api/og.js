import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const h = (type, style, children) => ({ type, props: { style, children } });

export default function handler() {
  return new ImageResponse(
    h('div', { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0D0F16', padding: '72px 80px', color: '#E8ECF4' }, [
      h('div', { display: 'flex', alignItems: 'center', fontSize: 30 }, [
        h('div', { display: 'flex', width: 36, height: 36, border: '3px solid #E8ECF4', borderRadius: 6, marginRight: 16, alignItems: 'flex-end', padding: 5 }, [
          h('div', { display: 'flex', width: 20, height: 4, background: '#FFB020', transform: 'rotate(-35deg)', marginBottom: 8 }, '')
        ]),
        h('span', {}, 'Makabeez'),
        h('span', { marginLeft: 16, fontSize: 20, color: '#9AA3B5' }, 'break-test reviews')
      ]),
      h('div', { display: 'flex', flexDirection: 'column', marginTop: 64, fontSize: 66, lineHeight: 1.08, letterSpacing: -1 }, [
        h('span', {}, 'Your incentive program will get farmed.'),
        h('span', { color: '#FFB020' }, "I'll show you how before launch.")
      ]),
      h('div', { display: 'flex', marginTop: 'auto', fontSize: 24, color: '#C9D1E3' }, [
        h('span', { color: '#FFB020', marginRight: 10 }, '772/772'),
        h('span', { marginRight: 44 }, 'top-25 fills on one loophole'),
        h('span', { color: '#FFB020', marginRight: 10 }, '3 days'),
        h('span', {}, 'to a production fix')
      ])
    ]),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, immutable, no-transform, max-age=31536000' } }
  );
}
