import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import google from '@/assets/icons8-google-50.svg';
import logo from '@/assets/Design sans titre.png';

const LoginForm: React.FC = () => {
  const handleGoogleLogin = () => {
    console.log('Connexion avec Google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="pt-8 pb-6 px-0 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={logo}
              alt="AuditStream Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Nom de l'application */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            AuditStream
          </h1>

          <p className="text-sm text-gray-500 mb-6 text-center">
            Plateforme de versements bancaires
          </p>

          {/* Bouton Google */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-80 h-11 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-normal border border-gray-200 rounded-lg transition-all"
          >
            <img src={google} width={20} height={20} alt="" className="mr-3" />
            Accéder à mon espace
          </Button>

          {/* Message de sécurité */}
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

          {/* Footer simple */}
          <p className="mt-8 text-[10px] text-gray-200">
            © 2026 AuditStream • Versements bancaires
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
