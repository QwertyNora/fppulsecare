import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { HealthTipCard } from './HealthTipCard';
import { MedicationsWidget } from '../medications/MedicationsWidget';
import { AppointmentsWidget } from './AppointmentsWidget';
import { NotesWidget } from './NotesWidget';
import { healthStatsApi } from '@/lib/api/mockApi';
import { useAuth } from '@/features/auth/AuthContext';
import { Activity, Heart, Droplets, Scale, Loader2 } from 'lucide-react';

export function PatientDashboard() {
  const { user } = useAuth();
  
  const { data: healthStats, isLoading } = useQuery({
    queryKey: ['healthStats'],
    queryFn: healthStatsApi.getAll,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Heart className="h-5 w-5" />;
      case 'heart_rate': return <Activity className="h-5 w-5" />;
      case 'glucose': return <Droplets className="h-5 w-5" />;
      case 'weight': return <Scale className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatStatTitle = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const mainStats = healthStats?.slice(0, 4) || [];

  return (
    <AppLayout>
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
        description="Here's an overview of your health status"
      />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        {mainStats.map((stat, index) => (
          <div key={stat.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard
              title={formatStatTitle(stat.type)}
              value={`${stat.value} ${stat.unit}`}
              subtitle={`Last updated: ${new Date(stat.date).toLocaleDateString()}`}
              icon={getStatIcon(stat.type)}
              status={stat.status}
            />
          </div>
        ))}
      </div>

      {/* Health Tip */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <HealthTipCard />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <MedicationsWidget />
          <NotesWidget />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <AppointmentsWidget />
        </div>
      </div>
    </AppLayout>
  );
}
