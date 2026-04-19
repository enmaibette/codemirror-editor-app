import { Circle, CheckCircle2, XCircle } from 'lucide-react';
import type { TestCaseStatus } from '@/types';

interface StatusIconProps {
  status: TestCaseStatus;
  className?: string;
}

export function StatusIcon({ status, className }: StatusIconProps) {
  if (status === 'pass') {
    return <CheckCircle2 className={`h-5 w-5 text-(--success) ${className ?? ''}`} />;
  }
  if (status === 'fail') {
    return <XCircle className={`h-5 w-5 text-(--destructive) ${className ?? ''}`} />;
  }
  // pending
  return <Circle className={`h-5 w-5 text-(--muted) ${className ?? ''}`} />;
}
