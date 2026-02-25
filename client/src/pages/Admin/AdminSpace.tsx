import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Settings,
  Search,
  Download,
  Users,
  CreditCard,
  Activity,
  AlertTriangle,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Shield,
} from 'lucide-react';
import logo from '@/assets/Design sans titre.png';

const AdminSpace: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('audit');

  // Données simulées pour l'audit
  const auditLogs = [
    {
      id: 1,
      type_action: 'INSERT',
      date_operation: '2026-02-26 14:23:15',
      n_versement: 'V2025022601',
      n_compte: 'FR76 3000 4001 2300 0012 3456 789',
      nom_client: 'Jean Dupont',
      montant_ancien: null,
      montant_nouv: 1500.0,
      utilisateur: 'jean.dupont@email.com',
    },
    {
      id: 2,
      type_action: 'UPDATE',
      date_operation: '2026-02-26 11:05:32',
      n_versement: 'V2025022503',
      n_compte: 'FR76 3000 4001 2300 0012 3456 790',
      nom_client: 'Marie Martin',
      montant_ancien: 750.0,
      montant_nouv: 800.0,
      utilisateur: 'marie.martin@email.com',
    },
    {
      id: 3,
      type_action: 'DELETE',
      date_operation: '2026-02-25 09:47:21',
      n_versement: 'V2025022408',
      n_compte: 'FR76 3000 4001 2300 0012 3456 791',
      nom_client: 'Pierre Bernard',
      montant_ancien: 200.0,
      montant_nouv: null,
      utilisateur: 'pierre.bernard@email.com',
    },
    {
      id: 4,
      type_action: 'INSERT',
      date_operation: '2026-02-25 08:12:05',
      n_versement: 'V2025022509',
      n_compte: 'FR76 3000 4001 2300 0012 3456 789',
      nom_client: 'Jean Dupont',
      montant_ancien: null,
      montant_nouv: 320.5,
      utilisateur: 'jean.dupont@email.com',
    },
    {
      id: 5,
      type_action: 'UPDATE',
      date_operation: '2026-02-24 16:38:44',
      n_versement: 'V2025022405',
      n_compte: 'FR76 3000 4001 2300 0012 3456 792',
      nom_client: 'Sophie Dubois',
      montant_ancien: 1200.0,
      montant_nouv: 1350.0,
      utilisateur: 'sophie.dubois@email.com',
    },
  ];

  // Statistiques d'audit
  const auditStats = {
    insertions: auditLogs.filter((log) => log.type_action === 'INSERT').length,
    modifications: auditLogs.filter((log) => log.type_action === 'UPDATE')
      .length,
    suppressions: auditLogs.filter((log) => log.type_action === 'DELETE')
      .length,
  };

  // Données des clients
  const clients = [
    {
      id: 1,
      nom: 'Jean Dupont',
      compte: 'FR76 3000 4001 2300 0012 3456 789',
      solde: 12500.0,
      versements: 8,
    },
    {
      id: 2,
      nom: 'Marie Martin',
      compte: 'FR76 3000 4001 2300 0012 3456 790',
      solde: 3500.0,
      versements: 3,
    },
    {
      id: 3,
      nom: 'Pierre Bernard',
      compte: 'FR76 3000 4001 2300 0012 3456 791',
      solde: 8200.0,
      versements: 5,
    },
    {
      id: 4,
      nom: 'Sophie Dubois',
      compte: 'FR76 3000 4001 2300 0012 3456 792',
      solde: 4300.0,
      versements: 4,
    },
  ];

  // Données des versements
  const versements = [
    {
      id: 1,
      numero: 'V2025022601',
      cheque: 'CHQ123456',
      compte: 'FR76 3000 4001 2300 0012 3456 789',
      montant: 1500.0,
      date: '2026-02-26',
    },
    {
      id: 2,
      numero: 'V2025022602',
      cheque: 'CHQ123457',
      compte: 'FR76 3000 4001 2300 0012 3456 790',
      montant: 750.0,
      date: '2026-02-26',
    },
    {
      id: 3,
      numero: 'V2025022503',
      cheque: 'CHQ123458',
      compte: 'FR76 3000 4001 2300 0012 3456 789',
      montant: 320.5,
      date: '2026-02-25',
    },
  ];

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'INSERT':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            INSERT
          </Badge>
        );
      case 'UPDATE':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            UPDATE
          </Badge>
        );
      case 'DELETE':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            DELETE
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-1 h-9 w-64 text-sm bg-gray-50 border-gray-200"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Admin Système</p>
                  <p className="text-xs text-gray-400">Superviseur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec stats globales */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tableau de bord supervision
          </h1>
          <p className="text-sm text-gray-500">
            Surveillance en temps réel des opérations de versement
          </p>
        </div>

        {/* Statistiques globales avec indicateurs temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Insertions</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {auditStats.insertions}
                  </p>
                  <p className="text-xs text-green-600 mt-1">+2 aujourd'hui</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Modifications</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {auditStats.modifications}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">+1 aujourd'hui</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Suppressions</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {auditStats.suppressions}
                  </p>
                  <p className="text-xs text-red-600 mt-1">+1 aujourd'hui</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Clients actifs</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                  <p className="text-xs text-gray-500 mt-1">4 en ligne</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et actions */}
        <div className="flex items-center justify-between mb-6">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="audit" className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Audit trail
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="versements" className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Versements
              </TabsTrigger>
              <TabsTrigger value="alertes" className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alertes
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-3">
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="custom">Personnalisé</option>
            </select>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Tableau d'audit */}
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Date/Heure
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      N° Versement
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      N° Compte
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Client
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">
                      Ancien montant
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">
                      Nouveau montant
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Utilisateur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {getActionBadge(log.type_action)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {log.date_operation}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {log.n_versement}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {log.n_compte.slice(0, 10)}...
                      </td>
                      <td className="py-3 px-4">{log.nom_client}</td>
                      <td className="py-3 px-4 text-right text-gray-500">
                        {log.montant_ancien ? `${log.montant_ancien} €` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {log.montant_nouv ? `${log.montant_nouv} €` : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {log.utilisateur}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statistiques d'audit en bas du tableau */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-700">INSERT</Badge>
                  <span className="text-sm text-gray-600">
                    {auditStats.insertions} opérations
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-700">UPDATE</Badge>
                  <span className="text-sm text-gray-600">
                    {auditStats.modifications} opérations
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-100 text-red-700">DELETE</Badge>
                  <span className="text-sm text-gray-600">
                    {auditStats.suppressions} opérations
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Clients et Versements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Liste des clients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Clients</CardTitle>
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{client.nom}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        {client.compte.slice(0, 10)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {client.solde} €
                      </p>
                      <p className="text-xs text-gray-400">
                        {client.versements} versements
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liste des versements récents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Versements récents</CardTitle>
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {versements.map((versement) => (
                  <div
                    key={versement.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {versement.numero}
                      </p>
                      <p className="text-xs text-gray-400">
                        Chèque {versement.cheque}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +{versement.montant} €
                      </p>
                      <p className="text-xs text-gray-400">{versement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSpace;
