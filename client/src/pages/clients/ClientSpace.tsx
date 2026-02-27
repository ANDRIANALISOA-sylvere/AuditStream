import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Users,
  Bell,
  Settings,
  Search,
  Filter,
  Download,
  ChevronRight,
  User,
  LogOut,
  HelpCircle,
  Shield,
} from 'lucide-react';
import logo from '@/assets/Design sans titre.png';
import { useAuth } from '@/hooks/useAuth';

const ClientSpace: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState(
    'FR76 3000 4001 2300 0012 3456 789',
  );

  const getUserInitials = () => {
    if (user?.username) {
      return user.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'CL';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const accounts = [
    {
      id: 1,
      number: 'FR76 3000 4001 2300 0012 3456 789',
      name: 'Compte Principal',
      balance: 12500.0,
    },
    {
      id: 2,
      number: 'FR76 3000 4001 2300 0012 3456 790',
      name: 'Compte Épargne',
      balance: 3500.0,
    },
  ];

  const recentVersements = [
    {
      id: 1,
      date: '2026-02-26',
      compte: 'FR76 3000 4001 2300 0012 3456 789',
      montant: 1500.0,
      type: 'crédit',
      cheque: 'CHQ123456',
    },
    {
      id: 2,
      date: '2026-02-25',
      compte: 'FR76 3000 4001 2300 0012 3456 789',
      montant: 750.0,
      type: 'débit',
      cheque: 'CHQ123457',
    },
    {
      id: 3,
      date: '2026-02-24',
      compte: 'FR76 3000 4001 2300 0012 3456 790',
      montant: 200.0,
      type: 'crédit',
      cheque: 'CHQ123458',
    },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="AuditStream" className="w-8 h-8 mr-3" />
              <span className="font-semibold text-gray-900">AuditStream</span>
              <span className="ml-2 text-xs text-gray-400">
                • Espace Client
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 ml-4 pl-4 hover:bg-gray-50 rounded-lg py-1 px-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      {user?.picture ? (
                        <AvatarImage src={user.picture} alt={user.username} />
                      ) : (
                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                          {getUserInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="text-sm text-left">
                      <p className="font-medium text-gray-700">
                        {user?.username || 'Client'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Client depuis 2024
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        {user?.picture ? (
                          <AvatarImage src={user.picture} alt={user.username} />
                        ) : (
                          <AvatarFallback className="bg-indigo-100 text-indigo-700">
                            {getUserInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.username || 'Client'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || 'client@example.com'}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Mes comptes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Sécurité</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Aide</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Bonjour, {user?.username?.split(' ')[0] || 'Jean'} 👋
          </h1>
          <p className="text-sm text-gray-500">
            Voici un aperçu de vos versements bancaires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Solde total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalBalance.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-xs text-green-600 mt-1">+2.5% ce mois</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Versements (mois)</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                  <p className="text-xs text-gray-500 mt-1">
                    8 crédits • 4 débits
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Dernier versement</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    1 500 €
                  </p>
                  <p className="text-xs text-gray-500 mt-1">26 févr. 2026</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Mes comptes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedAccount === account.number
                        ? 'bg-indigo-50 border border-indigo-100'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => setSelectedAccount(account.number)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {account.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {account.number}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {account.balance.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2 text-sm">
                  + Ajouter un compte
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Versements récents</CardTitle>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVersements
                  .filter((v) => v.compte === selectedAccount)
                  .map((versement) => (
                    <div
                      key={versement.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            versement.type === 'crédit'
                              ? 'bg-green-100'
                              : 'bg-orange-100'
                          }`}
                        >
                          {versement.type === 'crédit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {versement.type === 'crédit'
                              ? 'Versement reçu'
                              : 'Versement émis'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {versement.date} • Chèque {versement.cheque}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            versement.type === 'crédit'
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }`}
                        >
                          {versement.type === 'crédit' ? '+' : '-'}
                          {versement.montant.toLocaleString('fr-FR')} €
                        </p>
                        <p className="text-xs text-gray-400">
                          {versement.compte.slice(-4)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 text-sm text-gray-500"
              >
                Voir tous les versements
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center space-y-2"
              >
                <ArrowDownLeft className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Effectuer un versement</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center space-y-2"
              >
                <ArrowUpRight className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Transférer</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center space-y-2"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Bénéficiaires</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center space-y-2"
              >
                <Search className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Historique</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClientSpace;
