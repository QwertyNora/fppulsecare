import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { healthStatsApi } from '@/lib/api/mockApi';
import { Activity, Heart, Droplets, Scale, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statConfig = {
  blood_pressure: {
    icon: Heart,
    label: 'Blood Pressure',
    normalRange: 'Normal: <120/80 mmHg',
    color: 'text-accent-foreground',
    bgColor: 'bg-accent/20',
  },
  heart_rate: {
    icon: Activity,
    label: 'Heart Rate',
    normalRange: 'Normal: 60-100 bpm',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  glucose: {
    icon: Droplets,
    label: 'Blood Glucose',
    normalRange: 'Normal: 70-100 mg/dL (fasting)',
    color: 'text-secondary-foreground',
    bgColor: 'bg-secondary/30',
  },
  cholesterol: {
    icon: Activity,
    label: 'Cholesterol',
    normalRange: 'Normal: <200 mg/dL',
    color: 'text-health-positive',
    bgColor: 'bg-health-positive/10',
  },
  weight: {
    icon: Scale,
    label: 'Weight',
    normalRange: 'Track your progress',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

const statusStyles = {
  normal: { label: 'Normal', className: 'bg-health-positive/10 text-health-positive' },
  warning: { label: 'Elevated', className: 'bg-health-warning/10 text-health-warning' },
  critical: { label: 'High', className: 'bg-health-critical/10 text-health-critical' },
};

export function HealthStatsPage() {
  const { data: healthStats, isLoading } = useQuery({
    queryKey: ['healthStats'],
    queryFn: healthStatsApi.getAll,
  });

  return (
    <AppLayout>
      <PageHeader 
        title="Health Statistics"
        description="Track your vital signs and health metrics"
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {healthStats?.map((stat, index) => {
              const config = statConfig[stat.type];
              const IconComponent = config?.icon || Activity;
              const statusStyle = statusStyles[stat.status];
              
              return (
                <Card 
                  key={stat.id}
                  className="shadow-card hover:shadow-lg transition-shadow animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('p-3 rounded-xl', config?.bgColor)}>
                        <IconComponent className={cn('h-6 w-6', config?.color)} />
                      </div>
                      <span className={cn('text-xs px-2 py-1 rounded-full font-medium', statusStyle.className)}>
                        {statusStyle.label}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{config?.label}</p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                        <span className="text-lg font-normal text-muted-foreground ml-1">{stat.unit}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last updated: {format(new Date(stat.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Latest Blood Sample Results */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Latest Blood Sample Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthStats?.filter(s => ['glucose', 'cholesterol'].includes(s.type)).map((stat) => {
                  const config = statConfig[stat.type];
                  const statusStyle = statusStyles[stat.status];
                  
                  return (
                    <div key={stat.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg', config?.bgColor)}>
                          {config?.icon && <config.icon className={cn('h-5 w-5', config?.color)} />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{config?.label}</p>
                          <p className="text-xs text-muted-foreground">{config?.normalRange}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">{stat.value} <span className="text-sm font-normal">{stat.unit}</span></p>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', statusStyle.className)}>
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
