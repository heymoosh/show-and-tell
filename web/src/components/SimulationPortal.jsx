import React, { useState } from 'react';

/**
 * SimulationPortal - A framed "portal" component that displays a simulation preview
 *
 * Supports two modes:
 * 1. Composite mode (preferred): Single pre-composited image with frame + illustration
 * 2. Layered mode: Separate frame and illustration images layered together
 */
const SimulationPortal = ({
  compositeImage,      // Single combined frame+illustration image (preferred)
  frameImage,          // Separate frame image (layered mode)
  illustration,        // Separate illustration image (layered mode)
  title,
  status = 'ready',
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isReady = status === 'ready';
  const useComposite = !!compositeImage;

  const handleClick = () => {
    if (isReady && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative
        ${isReady ? 'cursor-pointer' : 'cursor-default'}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      data-testid={`portal-${title?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}
      role={isReady ? 'button' : 'presentation'}
      tabIndex={isReady ? 0 : -1}
      onKeyDown={(e) => {
        if (isReady && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={isReady ? `Open ${title} simulation` : `${title} - ${status}`}
    >
      {/* Shadow layer - separate div to avoid filter artifacts */}
      <div
        className="absolute inset-0 rounded-lg transition-all duration-300 ease-out"
        style={{
          boxShadow: isHovered
            ? '0 35px 60px -10px rgba(0,0,0,0.5)'
            : '0 20px 40px -10px rgba(0,0,0,0.35)',
          transform: isHovered ? 'scale(0.95)' : 'scale(0.92)',
        }}
        aria-hidden="true"
      />

      {/* Image container with transform */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: isHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
        }}
      >
        {useComposite ? (
          /* Composite Mode - Single pre-composited image */
          <img
            src={compositeImage}
            alt={`${title} - click to explore`}
            className="w-full h-auto select-none"
            draggable={false}
          />
        ) : (
          /* Layered Mode - Separate frame and illustration */
          <div className="relative">
            <img
              src={illustration}
              alt={`${title} illustration`}
              className="absolute object-cover"
              style={{
                top: '12.5%',
                left: '13.5%',
                width: '73%',
                height: '75%',
              }}
              draggable={false}
            />
            <img
              src={frameImage}
              alt=""
              className="relative z-10 w-full h-auto pointer-events-none select-none"
              draggable={false}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Status badge for non-ready simulations */}
      {status !== 'ready' && (
        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm">
          {status}
        </div>
      )}

      {/* Subtle "click to enter" indicator on hover for ready portals */}
      {isReady && isHovered && (
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20
                     px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full
                     text-xs font-medium text-white/90 shadow-lg
                     animate-pulse"
        >
          Click to explore
        </div>
      )}
    </div>
  );
};

export default SimulationPortal;
