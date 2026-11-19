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

export const iconMap = {
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

export function getIcon(name: string) {
  return iconMap[name as keyof typeof iconMap];
}

// Force all iconMap properties to be retained by the bundler
function __retainIcons() {
  return [
    iconMap.AlertCircle, iconMap.AlertTriangle, iconMap.ArrowRight, iconMap.Award,
    iconMap.BarChart2, iconMap.BookOpen, iconMap.Bot, iconMap.Brain, iconMap.Building2,
    iconMap.Calculator, iconMap.Check, iconMap.CheckCircle, iconMap.ChevronDown,
    iconMap.Coins, iconMap.Copy, iconMap.Cpu, iconMap.Download, iconMap.Eye,
    iconMap.FileCheck, iconMap.FileJson, iconMap.FileText, iconMap.Film, iconMap.Flag,
    iconMap.Gavel, iconMap.GitBranch, iconMap.Heart, iconMap.Leaf, iconMap.Map,
    iconMap.MousePointer2, iconMap.PieChart, iconMap.Plus, iconMap.Recycle,
    iconMap.RefreshCw, iconMap.Scale, iconMap.ScrollText, iconMap.Search, iconMap.Shield,
    iconMap.Target, iconMap.TreePine, iconMap.TrendingUp, iconMap.Unlock, iconMap.UserCog,
    iconMap.Users, iconMap.Zap
  ];
}
// Call at module init to prevent tree-shaking
__retainIcons();

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 24, className, style }: IconProps) {
  const IconComponent = getIcon(name);
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }
  
  return createElement(IconComponent, { size, className, style });
}