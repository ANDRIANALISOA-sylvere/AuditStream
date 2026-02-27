import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import google from '@/assets/icons8-google-50.svg';
import logo from '@/assets/Design sans titre.png';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle } from 'lucide-react';
import { redirectToGoogle } from '@/api/auth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, error: storeError } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);

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
      if (user.role === 'ADMIN') {
        navigate('/');
      } else {
        navigate('/client');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = () => {
    setLoginError(null);
    redirectToGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="pt-8 pb-6 px-0 flex flex-col items-center">
          <div className="mb-6">
            <img
              src={logo}
              alt="AuditStream Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            AuditStream
          </h1>

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

          {loginError?.includes('not been created') && (
            <div className="mb-4 w-80 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="font-medium">Compte non reconnu</p>
              <p className="text-xs mt-1">
                Votre compte Google n'a pas été créé par un administrateur.
                Veuillez contacter votre administrateur pour obtenir l'accès.
              </p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-80 h-11 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-normal border border-gray-200 rounded-lg transition-all"
          >
            <img src={google} width={20} height={20} alt="" className="mr-3" />
            Accéder à mon espace
          </Button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center">
              <svg
                className="w-3 h-3 mr-1 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
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
