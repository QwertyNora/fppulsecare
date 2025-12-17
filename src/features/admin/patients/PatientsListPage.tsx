import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { patientsApi } from '@/lib/api/mockApi';
import { Users, Search, User, Phone, Mail, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function PatientsListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsApi.getAll,
  });

  const filteredPatients = patients?.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader 
        title="Patients"
        description="View and manage all patient records"
      />

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPatients?.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No patients found</p>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'Patient records will appear here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPatients?.map((patient, index) => (
            <Link
              key={patient.id}
              to={`/admin/patients/${patient.id}`}
              className="block animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card className="shadow-card hover:shadow-lg transition-all hover:border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        <div className="flex items-center gap-2">
                          {patient.conditions.slice(0, 2).map((condition) => (
                            <Badge 
                              key={condition} 
                              variant="secondary"
                              className="bg-accent/20 text-accent-foreground text-xs hidden sm:inline-flex"
                            >
                              {condition}
                            </Badge>
                          ))}
                          {patient.conditions.length > 2 && (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                              +{patient.conditions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {patient.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {patient.phone}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
