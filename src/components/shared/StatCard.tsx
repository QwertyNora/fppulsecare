import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'normal' | 'warning' | 'critical';
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, status = 'normal', className }: StatCardProps) {
  const statusColors = {
    normal: 'text-health-positive',
    warning: 'text-health-warning',
    critical: 'text-health-critical',
  };

  return (
    <Card className={cn('shadow-card hover:shadow-lg transition-shadow duration-200', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn('text-2xl font-bold mt-1', statusColors[status])}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
