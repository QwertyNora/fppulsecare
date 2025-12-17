import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { medicationsApi } from '@/lib/api/mockApi';
import { Pill, ArrowRight, Clock } from 'lucide-react';

export function MedicationsWidget() {
  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: medicationsApi.getAll,
  });

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Pill className="h-5 w-5 text-primary" />
          Medications
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/medications" className="text-primary hover:text-primary-dark">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse p-3 rounded-lg bg-muted/50">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : medications?.length === 0 ? (
          <div className="text-center py-6">
            <Pill className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No medications</p>
          </div>
        ) : (
          medications?.slice(0, 3).map((med) => (
            <div 
              key={med.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="p-2 rounded-lg bg-accent/20">
                <Pill className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{med.name}</p>
                <p className="text-xs text-muted-foreground">
                  {med.dosage} • {med.timesPerDay}x daily
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{med.frequency}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
