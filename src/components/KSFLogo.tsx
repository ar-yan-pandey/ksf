import logoPath from '../../logo.png';

export function KSFLogo({ 
  className = '', 
  variant = 'default' 
}: { 
  className?: string, 
  variant?: 'default' | 'white' 
}) {
  return (
    <div className={`relative ${className}`}>
      <img 
        src={logoPath} 
        alt="KSF Logo" 
        className={`
          w-full h-full object-contain
          transition-all duration-300
          ${variant === 'white' ? 'invert brightness-0 invert-[1]' : ''}
        `}
        style={{
          filter: variant === 'white' ? 'grayscale(100%) brightness(0) invert(1)' : 'none'
        }}
      />
    </div>
  );
}