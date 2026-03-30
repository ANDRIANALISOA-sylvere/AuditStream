import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import google from '@/assets/icons8-google-50.svg';
import logo from '@/assets/Design sans titre.png';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { redirectToGoogle, loginWithEmail } from '@/api/auth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, error: storeError, login } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const message = params.get('message');
    if (error && message) {
      setLoginError(decodeURIComponent(message));
      window.history.replaceState({}, document.title, '/login');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/' : '/client');
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = () => {
    setLoginError(null);
    redirectToGoogle();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    try {
      const result = await loginWithEmail(email, password);
      login(result.accessToken, result.user);
    } catch (err: any) {
      setLoginError(
        err.response?.data?.message || 'Email ou mot de passe incorrect',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="pt-8 pb-6 px-0 flex flex-col items-center">
          <div className="mb-6">
            <img src={logo} alt="AuditStream Logo" className="w-16 h-16 object-contain" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1">AuditStream</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Plateforme de versements bancaires
          </p>

          {(loginError || storeError) && (
            <Alert variant="destructive" className="mb-4 w-80">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError || storeError || 'Accès non autorisé'}
              </AlertDescription>
            </Alert>
          )}

          {/* Formulaire email/password */}
          <form onSubmit={handleEmailLogin} className="w-80 space-y-3 mb-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-sm text-gray-600">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password" className="text-sm text-gray-600">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center w-80 mb-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="mx-3 text-xs text-gray-400">ou</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Bouton Google */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-80 h-11 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-normal border border-gray-200 rounded-lg transition-all"
          >
            <img src={google} width={20} height={20} alt="" className="mr-3" />
            Continuer avec Google
          </Button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center">
              <svg className="w-3 h-3 mr-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Connexion sécurisée
            </p>
          </div>

          <p className="mt-8 text-[10px] text-gray-200">
            © 2026 AuditStream • Versements bancaires
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;