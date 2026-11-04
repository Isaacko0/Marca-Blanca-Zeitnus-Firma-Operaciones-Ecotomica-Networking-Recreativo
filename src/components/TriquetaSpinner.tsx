// Triqueta Spinner Component
// Componente React: triqueta animada 34s loop, 6 variantes de color
// Isomorfo a Soul.MBA triqueta (34s loop, 3 círculos entrelazados)

import React, { useEffect, useRef, useState } from 'react';

export type TriquetaVariant = 'aliento' | 'tinta' | 'lime' | 'avatar' | 'punto-lime' | 'punto-icono';

export interface TriquetaSpinnerProps {
  variant?: TriquetaVariant;
  size?: number; // px, default 44
  speed?: number; // segundos por vuelta, default 34
  paused?: boolean;
  className?: string;
  ariaLabel?: string;
  onComplete?: () => void; // callback cada vuelta completa
}

const VARIANT_STROKE: Record<TriquetaVariant, string> = {
  aliento: '#f7faff',
  tinta: '#101010',
  lime: '#afeb00',
  avatar: '#afeb00',
  'punto-lime': '#afeb00',
  'punto-icono': '#afeb00',
};

const VARIANT_FILL: Record<TriquetaVariant, string> = {
  aliento: 'none',
  tinta: 'none',
  lime: 'none',
  avatar: '#101010',
  'punto-lime': '#afeb00',
  'punto-icono': '#afeb00',
};

const VARIANT_BG: Record<TriquetaVariant, string> = {
  aliento: 'transparent',
  tinta: 'transparent',
  lime: 'transparent',
  avatar: '#101010',
  'punto-lime': '#afeb00',
  'punto-icono': '#101010',
};

const VARIANT_STROKE_WIDTH: Record<TriquetaVariant, number> = {
  aliento: 5.4,
  tinta: 5.4,
  lime: 5.4,
  avatar: 6,
  'punto-lime': 0, // fill only
  'punto-icono': 0, // fill only
};

const VARIANT_VIEWBOX: Record<TriquetaVariant, string> = {
  aliento: '22.53 15.61 54.94 54.94',
  tinta: '22.53 15.61 54.94 54.94',
  lime: '22.53 15.61 54.94 54.94',
  avatar: '6.5 -0.45 87 87',
  'punto-lime': '0 0 100 100',
  'punto-icono': '0 0 100 100',
};

export const TriquetaSpinner: React.FC<TriquetaSpinnerProps> = ({
  variant = 'aliento',
  size = 44,
  speed = 34,
  paused = false,
  className = '',
  ariaLabel = 'Triqueta animada',
  onComplete,
} = {}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastRotationRef = useRef(0);

  const stroke = VARIANT_STROKE[variant];
  const fill = VARIANT_FILL[variant];
  const bg = VARIANT_BG[variant];
  const strokeWidth = VARIANT_STROKE_WIDTH[variant];
  const viewBox = VARIANT_VIEWBOX[variant];

  // Animación loop
  useEffect(() => {
    if (paused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const duration = speed * 1000; // ms
    const startTime = Date.now() - (rotation / 360) * duration;

    const animate = () => {
      if (paused) return;

      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      const newRotation = progress * 360;

      // Detecta vuelta completa
      if (newRotation < lastRotationRef.current && lastRotationRef.current > 270) {
        onComplete?.();
      }
      lastRotationRef.current = newRotation;

      setRotation(newRotation);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paused, speed, onComplete]);

  // Para variant punto-lime y punto-icono: solo círculo
  const isPunto = variant === 'punto-lime' || variant === 'punto-icono';

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={viewBox}
      className={`triqueta-spinner ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
        transition: 'transform 0.1s linear',
      }}
    >
      {isPunto ? (
        // Punto simple (lime o icono)
        <circle
          cx={variant === 'punto-icono' ? 50 : 50}
          cy={variant === 'punto-icono' ? 50 : 50}
          r={variant === 'punto-icono' ? 26.5 : 50}
          fill={fill}
        />
      ) : (
        <>
          {/* Fondo para avatar */}
          {variant === 'avatar' && (
            <rect x="6.5" y="-0.45" width="87" height="87" fill={bg} />
          )}

          {/* Triqueta - 3 círculos entrelazados */}
          <g
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path
              d="M 26.03 63.84 A 24 24 0 0 1 60.98 43.66 A 24 24 0 0 1 26.03 63.84 Z"
            />
            <path
              d="M 50.00 22.32 A 24 24 0 0 1 50.00 62.68 A 24 24 0 0 1 50.00 22.32 Z"
            />
            <path
              d="M 73.97 63.84 A 24 24 0 0 1 39.02 43.66 A 24 24 0 0 1 73.97 63.84 Z"
            />
          </g>

          {/* Para avatar: trazo decorativo */}
          {variant === 'avatar' && (
            <g
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <path
                d="M 26.03 63.84 A 24 24 0 0 1 60.98 43.66 A 24 24 0 0 1 26.03 63.84 Z"
                stroke="#101010"
                strokeWidth={strokeWidth * 1.25}
              />
              <path
                d="M 50.00 22.32 A 24 24 0 0 1 50.00 62.68 A 24 24 0 0 1 50.00 22.32 Z"
                stroke="#101010"
                strokeWidth={strokeWidth * 1.25}
              />
              <path
                d="M 73.97 63.84 A 24 24 0 0 1 39.02 43.66 A 24 24 0 0 1 73.97 63.84 Z"
                stroke="#101010"
                strokeWidth={strokeWidth * 1.25}
              />
            </g>
          )}

          {/* Para avatar: elementos decorativos extra */}
          {variant === 'avatar' && (
            <>
              <ellipse cx="62.4" cy="67.2" rx="12.48" ry="8.64" fill="#FF8FB1" opacity="0.85" />
              <ellipse cx="177.6" cy="177.6" rx="12.48" ry="8.64" fill="#FF8FB1" opacity="0.85" />
              <ellipse cx="85.44" cy="118.08" rx="11.52" ry="12.9024" fill="#0B1660" />
              <circle cx="89.472" cy="113.472" r="4.1472" fill="#fff" />
              <path
                d="M166.656 111.744L145.344 118.08L166.656 124.416"
                fill="none"
                stroke="#0B1660"
                strokeWidth="5.76"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M96.96 143.04Q120 139.2 143.04 143.04Q141.12 177.6 120 177.6Q98.88 177.6 96.96 143.04Z" fill="#0B1660" />
              <path d="M107.52 168Q120 156.48 132.48 168Q120 178.56 107.52 168Z" fill="#FF8FB1" />
              <path d="M129.6 31.68 Q127.68 9.792 132.48 -2.304" fill="none" stroke="#13228B" strokeWidth="6.72" strokeLinecap="round" />
              <path transform="translate(132.48 -2.304) rotate(-10) scale(1 1)" d="M0 0 C 12.096 -6.048 26.208 -4.032 30.24 -18.144 C 16.128 -22.176 4.032 -14.112 0 0Z" fill="#81F541" stroke="#13228B" strokeWidth="3.36" strokeLinejoin="round" />
              <path transform="translate(132.48 -2.304) rotate(10) scale(-1 1)" d="M0 0 C 12.096 -6.048 26.208 -4.032 30.24 -18.144 C 16.128 -22.176 4.032 -14.112 0 0Z" fill="#CCFE2F" stroke="#13228B" strokeWidth="3.36" strokeLinejoin="round" />
            </>
          )}
        </>
      )}
    </svg>
  );
};

export default TriquetaSpinner;