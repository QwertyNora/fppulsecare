import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { medicationsApi } from '@/lib/api/mockApi';
import { Pill, Clock, Calendar, Info, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function MedicationsPage() {
  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: medicationsApi.getAll,
  });

  return (
    <AppLayout>
      <PageHeader 
        title="Medications"
        description="Your current prescriptions and medication schedule"
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : medications?.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No medications</p>
            <p className="text-muted-foreground">Your prescriptions will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {medications?.map((med, index) => (
            <Card 
              key={med.id} 
              className="shadow-card hover:shadow-lg transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/20">
                    <Pill className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">{med.name}</h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {med.dosage}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{med.timesPerDay}x daily ({med.frequency})</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Started {format(new Date(med.startDate), 'MMM d, yyyy')}</span>
                      </div>
                      {med.instructions && (
                        <div className="flex items-start gap-2 text-muted-foreground mt-3 pt-3 border-t border-border">
                          <Info className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>{med.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
