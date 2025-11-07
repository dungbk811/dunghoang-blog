import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dung Hoang - COO | Tech Blog';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 'bold', marginBottom: 20 }}>
          Dung Hoang
        </div>
        <div style={{ fontSize: 48, opacity: 0.9, marginBottom: 40 }}>
          Chief Operating Officer
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.8,
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Chia sẻ kiến thức IT, công việc COO và định hướng nghề nghiệp
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
