import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Users,
  Activity,
  AlertTriangle,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  ChevronDown,
  User,
  LogOut,
  Mail,
  MoreVertical,
} from 'lucide-react';
import logo from '@/assets/Design sans titre.png';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/userStore';
import { Role } from '@/types/auth.types';
import { UserDialog } from '@/components/common/UserDialog';
import { AvatarWithFallback } from '@/components/common/AvatarWithFallback';
import { useAuditStore } from '@/store/auditStore';
import { format } from 'date-fns';


const AdminSpace: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('audit');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    users,
    isLoading,
    error,
    fetchUsers,
    addUser,
    removeUser,
    updateUserRole,
  } = useUserStore();

  const { audits, fetchAudits, isLoading: auditsLoading } = useAuditStore();


  useEffect(() => {
    fetchAudits();
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'INSERT':
        return <Badge className="bg-green-100 text-green-700 border-green-200">AJOUT</Badge>;
      case 'UPDATE':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">MODIFICATION</Badge>;
      case 'DELETE':
        return <Badge className="bg-red-100 text-red-700 border-red-200">SUPPRESSION</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentUserInitials = () => {
    if (user?.username) {
      return user.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'AD';
  };

  const handleAddUser = async (data: {
    email: string;
    username: string;
    role: Role;
  }) => {
    try {
      await addUser(data);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (
      window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')
    ) {
      try {
        await removeUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleRoleChange = async (id: number, newRole: Role) => {
    try {
      await updateUserRole(id, newRole);
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const getUserRole = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'USER':
        return 'Utilisateur';
      default:
        return 'Utilisateur';
    }
  };

  const auditStats = {
    insertions: audits.filter((a) => a.type_action === 'INSERT').length,
    modifications: audits.filter((a) => a.type_action === 'UPDATE').length,
    suppressions: audits.filter((a) => a.type_action === 'DELETE').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="AuditStream" className="w-8 h-8 mr-3" />
              <span className="font-semibold text-gray-900">AuditStream</span>
              <Badge
                variant="outline"
                className="ml-3 bg-indigo-50 text-indigo-700 border-indigo-200"
              >
                Admin
              </Badge>
              <span className="ml-2 text-xs text-gray-400">
                • Supervision versements
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 ml-4 pl-4 hover:bg-gray-50 rounded-lg py-1 px-2 transition-colors">
                    <AvatarWithFallback
                      src={user?.picture}
                      alt={user?.username || 'Admin'}
                      fallback={getCurrentUserInitials()}
                    />
                    <div className="text-sm text-left">
                      <p className="font-medium text-gray-700">
                        {user?.username || 'Admin Système'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.email || 'superviseur@auditstream.com'}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center space-x-3">
                      <AvatarWithFallback
                        src={user?.picture}
                        alt={user?.username || 'Admin'}
                        fallback={getCurrentUserInitials()}
                      />
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.username || 'Admin Système'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || 'superviseur@auditstream.com'}
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
                  </DropdownMenuGroup>

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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tableau de bord supervision
          </h1>
          <p className="text-sm text-gray-500">
            Surveillance en temps réel des opérations de versement
          </p>
        </div>

        {/* Tabs et filtres */}
        <div className="flex items-center justify-between mb-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="audit" className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Audit trail
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Utilisateurs ({users.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1 h-9 w-64 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchUsers()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Contenu des tabs */}
        {selectedTab === 'clients' && (
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <AvatarWithFallback
                          src={user.picture}
                          alt={user.username}
                          fallback={getUserInitials(user.username)}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">
                              {user.username}
                            </p>
                            <Badge
                              variant={
                                user.role === Role.ADMIN
                                  ? 'default'
                                  : 'secondary'
                              }
                              className={
                                user.role === Role.ADMIN
                                  ? 'bg-purple-100 text-purple-700 border-purple-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }
                            >
                              {getUserRole(user.role)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-xs text-gray-400">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Select
                          value={user.role}
                          onValueChange={(value: Role) =>
                            handleRoleChange(user.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Role.USER}>
                              Utilisateur
                            </SelectItem>
                            <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      Aucun utilisateur trouvé
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedTab === 'audit' && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Journal d'audit des versements
                </CardTitle>
                <Badge variant="outline" className="bg-gray-50">
                  Temps réel
                  <span className="ml-2 relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {auditsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Date/Heure</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">N° Versement</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">N° Compte</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Ancien montant</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Nouveau montant</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Utilisateur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audits.map((log) => (
                        <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{getActionBadge(log.type_action)}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {format(new Date(log.date_operation), 'dd/MM/yyyy HH:mm')}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs">{log.numero_versement_archive ?? '—'}</td>
                          <td className="py-3 px-4 font-mono text-xs">
                            {log.numero_compte ? `${log.numero_compte.slice(0, 10)}...` : '—'}
                          </td>
                          <td className="py-3 px-4">{log.nom_client}</td>
                          <td className="py-3 px-4 text-right text-gray-500">
                            {log.montant_ancien != null
                              ? `${Number(log.montant_ancien).toLocaleString('fr-FR')} Ar`
                              : '—'}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {log.montant_nouveau != null
                              ? `${Number(log.montant_nouveau).toLocaleString('fr-FR')} Ar`
                              : '—'}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {log.user?.username ?? '—'}
                          </td>
                        </tr>
                      ))}
                      {audits.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-gray-400">
                            Aucune entrée d'audit
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-700">AJOUT</Badge>
                    <span className="text-sm text-gray-600">{auditStats.insertions} opérations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-700">MODIFICATION</Badge>
                    <span className="text-sm text-gray-600">{auditStats.modifications} opérations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-100 text-red-700">SUPPRESSION</Badge>
                    <span className="text-sm text-gray-600">{auditStats.suppressions} opérations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Dialogue d'ajout d'utilisateur */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminSpace;
