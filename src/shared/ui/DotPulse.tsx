interface DotPulseProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const DotPulse = ({ size = 'md', color = '#4F7EFF' }: DotPulseProps) => {
  const sizeConfig = {
    sm: { dot: 'w-2 h-2', gap: 'gap-1' },
    md: { dot: 'w-3 h-3', gap: 'gap-2' },
    lg: { dot: 'w-4 h-4', gap: 'gap-3' }
  };

  const { dot, gap } = sizeConfig[size];

  return (
    <div className={`flex items-center justify-center ${gap}`}>
      <div
        className={`${dot} rounded-full animate-pulse`}
        style={{
          backgroundColor: color,
          animationDelay: '0ms',
          animationDuration: '1.4s'
        }}
      />
      <div
        className={`${dot} rounded-full animate-pulse`}
        style={{
          backgroundColor: color,
          animationDelay: '200ms',
          animationDuration: '1.4s'
        }}
      />
      <div
        className={`${dot} rounded-full animate-pulse`}
        style={{
          backgroundColor: color,
          animationDelay: '400ms',
          animationDuration: '1.4s'
        }}
      />
    </div>
  );
};

export default DotPulse;
