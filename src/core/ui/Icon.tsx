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

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 24, className, style }: IconProps) {
  let IconComponent: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }> | undefined;
  
  switch (name) {
    case 'AlertCircle': IconComponent = AlertCircle; break;
    case 'AlertTriangle': IconComponent = AlertTriangle; break;
    case 'ArrowRight': IconComponent = ArrowRight; break;
    case 'Award': IconComponent = Award; break;
    case 'BarChart2': IconComponent = BarChart2; break;
    case 'BookOpen': IconComponent = BookOpen; break;
    case 'Bot': IconComponent = Bot; break;
    case 'Brain': IconComponent = Brain; break;
    case 'Building2': IconComponent = Building2; break;
    case 'Calculator': IconComponent = Calculator; break;
    case 'Check': IconComponent = Check; break;
    case 'CheckCircle': IconComponent = CheckCircle; break;
    case 'ChevronDown': IconComponent = ChevronDown; break;
    case 'Coins': IconComponent = Coins; break;
    case 'Copy': IconComponent = Copy; break;
    case 'Cpu': IconComponent = Cpu; break;
    case 'Download': IconComponent = Download; break;
    case 'Eye': IconComponent = Eye; break;
    case 'FileCheck': IconComponent = FileCheck; break;
    case 'FileJson': IconComponent = FileJson; break;
    case 'FileText': IconComponent = FileText; break;
    case 'Film': IconComponent = Film; break;
    case 'Flag': IconComponent = Flag; break;
    case 'Gavel': IconComponent = Gavel; break;
    case 'GitBranch': IconComponent = GitBranch; break;
    case 'Heart': IconComponent = Heart; break;
    case 'Leaf': IconComponent = Leaf; break;
    case 'Map': IconComponent = Map; break;
    case 'MousePointer2': IconComponent = MousePointer2; break;
    case 'PieChart': IconComponent = PieChart; break;
    case 'Plus': IconComponent = Plus; break;
    case 'Recycle': IconComponent = Recycle; break;
    case 'RefreshCw': IconComponent = RefreshCw; break;
    case 'Scale': IconComponent = Scale; break;
    case 'ScrollText': IconComponent = ScrollText; break;
    case 'Search': IconComponent = Search; break;
    case 'Shield': IconComponent = Shield; break;
    case 'Target': IconComponent = Target; break;
    case 'TreePine': IconComponent = TreePine; break;
    case 'TrendingUp': IconComponent = TrendingUp; break;
    case 'Unlock': IconComponent = Unlock; break;
    case 'UserCog': IconComponent = UserCog; break;
    case 'Users': IconComponent = Users; break;
    case 'Zap': IconComponent = Zap; break;
    default: IconComponent = undefined;
  }
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }
  
  return createElement(IconComponent, { size, className, style });
}