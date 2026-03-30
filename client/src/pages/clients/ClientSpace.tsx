import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  Search,
  LogOut,
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
import { useVersementStore } from '@/store/versement.store';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ClientDialog } from '@/components/common/ClientDialog';
import { AvatarWithFallback } from '@/components/common/AvatarWithFallback';
import { VersementDialog } from '@/components/common/VersementDialog';
import { EditVersementDialog } from '@/components/common/EditVersementDialog';
import type { UpdateVersementDto, Versement } from '@/types/versement.types';

const ClientSpace: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [versementDialogOpen, setVersementDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchVersement, setSearchVersement] = useState('');
  const [editVersementOpen, setEditVersementOpen] = useState(false);
  const [selectedVersement, setSelectedVersement] = useState<Versement | null>(
    null,
  );

  const { clients, isLoading, error, fetchClients, addClient } =
    useClientStore();

  const {
    versements,
    isLoading: versementsLoading,
    error: versementsError,
    fetchVersements,
    removeVersement,
    addVersement,
    editVersement,
  } = useVersementStore();

  useEffect(() => {
    fetchClients();
    fetchVersements();
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

  const handleAddVersement = async (data: {
    numero_versement: string;
    numero_cheque: string;
    montant: number;
    clientId: string;
  }) => {
    try {
      await addVersement(data);
      await fetchClients();
      setVersementDialogOpen(false);
    } catch (error) {
      console.error('Error adding versement:', error);
    }
  };

  const handleEditVersement = async (
    numero_versement: string,
    data: UpdateVersementDto,
  ) => {
    try {
      await editVersement(numero_versement, data);
      await fetchClients();
      setEditVersementOpen(false);
      setSelectedVersement(null);
    } catch (error) {
      console.error('Error editing versement:', error);
    }
  };

  const handleDeleteVersement = async (numero_versement: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce versement ?')) {
      try {
        await removeVersement(numero_versement);
        await fetchClients();
      } catch (error) {
        console.error('Error deleting versement:', error);
      }
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.numero_compte.includes(searchTerm),
  );

  const filteredVersements = versements.filter(
    (v) =>
      v.numero_versement
        .toLowerCase()
        .includes(searchVersement.toLowerCase()) ||
      v.numero_cheque.toLowerCase().includes(searchVersement.toLowerCase()) ||
      v.client?.nom_client
        ?.toLowerCase()
        .includes(searchVersement.toLowerCase()),
  );


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="AuditStream" className="w-8 h-8 mr-3" />
              <span className="font-semibold text-gray-900">AuditStream</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 ml-4 pl-4 hover:bg-gray-50 rounded-lg py-1 px-2 transition-colors">
                  <AvatarWithFallback
                    src={user?.picture}
                    alt={user?.username || 'Utilisateur'}
                    fallback={getUserInitials()}
                  />
                  <div className="text-sm text-left">
                    <p className="font-medium text-gray-700">
                      {user?.username || 'Client'}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center space-x-3">
                    <AvatarWithFallback
                      src={user?.picture}
                      alt={user?.username || 'Utilisateur'}
                      fallback={getUserInitials()}
                    />
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestion des versements
          </h1>
          <p className="text-sm text-gray-500">
            Gérez vos versements et clients bancaires
          </p>
        </div>

        {/* Onglets — Versements en premier */}
        <Tabs defaultValue="versements">
          <TabsList className="mb-6">
            <TabsTrigger value="versements">
              Versements ({versements.length})
            </TabsTrigger>
            <TabsTrigger value="clients">
              Clients ({clients.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Onglet Versements ── */}
          <TabsContent value="versements">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un versement..."
                  value={searchVersement}
                  onChange={(e) => setSearchVersement(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchVersements()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
                <Button size="sm" onClick={() => setVersementDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau versement
                </Button>
              </div>
            </div>

            {versementsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : versementsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{versementsError}</AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Liste des versements ({filteredVersements.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredVersements.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-400 mb-4">
                        Aucun versement trouvé
                      </p>
                      <Button onClick={() => setVersementDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un versement
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredVersements.map((versement) => (
                        <div
                          key={versement.numero_versement}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 font-mono">
                                {versement.numero_versement}
                              </p>
                              <p className="text-xs text-gray-400">
                                Chèque : {versement.numero_cheque}
                              </p>
                              {versement.client && (
                                <p className="text-xs text-gray-500">
                                  {versement.client.nom_client}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {Number(versement.montant).toLocaleString(
                                  'fr-FR',
                                )}{' '}
                                Ar
                              </p>
                              {versement.createdAt && (
                                <p className="text-xs text-gray-400">
                                  {format(
                                    new Date(versement.createdAt),
                                    'dd/MM/yyyy',
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedVersement(versement);
                                  setEditVersementOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50"
                                onClick={() =>
                                  handleDeleteVersement(
                                    versement.numero_versement,
                                  )
                                }
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
          </TabsContent>

          {/* ── Onglet Clients ── */}
          <TabsContent value="clients">
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
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau client
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {Number(client.solde).toLocaleString('fr-FR')}{' '}
                                Ar
                              </p>
                              {client.createdAt && (
                                <p className="text-xs text-gray-400">
                                  Créé le{' '}
                                  {format(
                                    new Date(client.createdAt),
                                    'dd/MM/yyyy',
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddClient}
        isLoading={isLoading}
      />

      <VersementDialog
        open={versementDialogOpen}
        onOpenChange={setVersementDialogOpen}
        onSubmit={handleAddVersement}
        clients={clients}
        isLoading={versementsLoading}
      />

      <EditVersementDialog
        open={editVersementOpen}
        onOpenChange={setEditVersementOpen}
        onSubmit={handleEditVersement}
        versement={selectedVersement}
        clients={clients}
        isLoading={versementsLoading}
      />
    </div>
  );
};

export default ClientSpace;
