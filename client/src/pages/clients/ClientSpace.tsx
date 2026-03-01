import React, { useState, useEffect } from 'react';
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
  Plus,
  RefreshCw,
  Building,
  Trash2,
  Edit,
  AlertCircle,
} from 'lucide-react';
import logo from '@/assets/Design sans titre.png';
import { useAuth } from '@/hooks/useAuth';
import { useClientStore } from '@/store/clientStore';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ClientDialog } from '@/components/common/ClientDialog';

const ClientSpace: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { clients, isLoading, error, fetchClients, addClient, removeClient } =
    useClientStore();

  useEffect(() => {
    fetchClients();
  }, []);

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

  const handleAddClient = async (data: {
    numero_compte: string;
    nom_client: string;
    solde: number;
  }) => {
    try {
      await addClient(data);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await removeClient(id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  // Filtrer les clients par recherche
  const filteredClients = clients.filter(
    (client) =>
      client.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.numero_compte.includes(searchTerm),
  );

  // Statistiques
  const stats = {
    total: clients.length,
    soldeTotal: clients.reduce((sum, c) => sum + (Number(c.solde) || 0), 0),
    soldeMoyen:
      clients.length > 0
        ? clients.reduce((sum, c) => sum + (Number(c.solde) || 0), 0) /
          clients.length
        : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="AuditStream" className="w-8 h-8 mr-3" />
              <span className="font-semibold text-gray-900">AuditStream</span>
              <span className="ml-2 text-xs text-gray-400">
                • Gestion des clients
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
                        {clients.length} clients
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
                      <Building className="mr-2 h-4 w-4" />
                      <span>Mes clients</span>
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
            Gestion des clients
          </h1>
          <p className="text-sm text-gray-500">
            Gérez vos clients bancaires et leurs comptes
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total clients</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {stats.total > 0 ? 'Actifs' : 'Aucun client'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Solde total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.soldeTotal.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Moyenne: {stats.soldeMoyen.toLocaleString('fr-FR')} €
                  </p>
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
                  <p className="text-sm text-gray-500">Comptes actifs</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    100% des clients
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client (nom ou compte)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchClients()}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </div>
        </div>

        {/* Liste des clients */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Liste des clients ({filteredClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-400 mb-4">Aucun client trouvé</p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter votre premier client
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-700 font-medium">
                              {client.nom_client.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {client.nom_client}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              {client.numero_compte}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {client.solde.toLocaleString('fr-FR')} €
                          </p>
                          {client.createdAt && (
                            <p className="text-xs text-gray-400">
                              Créé le{' '}
                              {format(new Date(client.createdAt), 'dd/MM/yyyy')}
                            </p>
                          )}
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions rapides */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Nouveau client</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Exporter la liste</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Filtrer</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Actualiser</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogue d'ajout de client */}
      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddClient}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClientSpace;
