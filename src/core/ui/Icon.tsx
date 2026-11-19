import { createElement } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart2,
  BookOpen,
  Bot,
  Brain,
  Building2,
  Calculator,
  Check,
  CheckCircle,
  ChevronDown,
  Coins,
  Copy,
  Cpu,
  Download,
  Eye,
  FileCheck,
  FileJson,
  FileText,
  Film,
  Flag,
  Gavel,
  GitBranch,
  Heart,
  Leaf,
  Map,
  MousePointer2,
  PieChart,
  Plus,
  Recycle,
  RefreshCw,
  Scale,
  ScrollText,
  Search,
  Shield,
  Target,
  TreePine,
  TrendingUp,
  Unlock,
  UserCog,
  Users,
  Zap,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart2,
  BookOpen,
  Bot,
  Brain,
  Building2,
  Calculator,
  Check,
  CheckCircle,
  ChevronDown,
  Coins,
  Copy,
  Cpu,
  Download,
  Eye,
  FileCheck,
  FileJson,
  FileText,
  Film,
  Flag,
  Gavel,
  GitBranch,
  Heart,
  Leaf,
  Map,
  MousePointer2,
  PieChart,
  Plus,
  Recycle,
  RefreshCw,
  Scale,
  ScrollText,
  Search,
  Shield,
  Target,
  TreePine,
  TrendingUp,
  Unlock,
  UserCog,
  Users,
  Zap,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 24, className, style }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }
  
  return createElement(IconComponent, { size, className, style });
}