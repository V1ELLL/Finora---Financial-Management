import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Award,
  Gift,
  MoreHorizontal,
  Wallet,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Plane,
  Home,
  Coffee,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Award,
  Gift,
  MoreHorizontal,
  Wallet,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Plane,
  Home,
  Coffee,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};
