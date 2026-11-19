import { createElement } from 'react';
import * as LucideIcons from 'lucide-react';

type LucideIconName = keyof typeof LucideIcons;

interface IconProps {
  name: LucideIconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 24, className, style }: IconProps) {
  const IconComponent = LucideIcons[name] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }> | undefined;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  
  return createElement(IconComponent, { size, className, style });
}