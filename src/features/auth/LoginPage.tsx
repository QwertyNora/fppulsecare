import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { PulseLogo } from '@/components/shared/PulseLogo';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const from = (location.state as any)?.from?.pathname || 
      (user.role === 'admin' ? '/admin' : '/dashboard');
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('pulsecare_user') || '{}');
      const redirectPath = storedUser.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = async (role: 'patient' | 'admin') => {
    setError('');
    setIsLoading(true);
    
    const email = role === 'admin' ? 'admin@pulsecare.com' : 'john.patient@email.com';
    const result = await login(email, 'password123');
    
    if (result.success) {
      const redirectPath = role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <PulseLogo size="lg" showText={false} />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">PulseCare</h1>
            <p className="text-sm text-muted-foreground">Your Health, Our Priority</p>
          </div>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your health dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-center text-muted-foreground mb-4">
                Try demo accounts
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin('patient')}
                  disabled={isLoading}
                  className="text-sm"
                >
                  Patient Demo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="text-sm"
                >
                  Admin Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo credentials: Use any email from the demo or password123
        </p>
      </div>
    </div>
  );
}
