import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateClientDto } from '@/types/client.types';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateClientDto) => Promise<void>;
  isLoading?: boolean;
}

export const ClientDialog: React.FC<ClientDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateClientDto>({
    numero_compte: '',
    nom_client: '',
    solde: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ numero_compte: '', nom_client: '', solde: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un client</DialogTitle>
          <DialogDescription>
            Enregistrez un nouveau client avec son compte bancaire.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="numero_compte">Numéro de compte</Label>
              <Input
                id="numero_compte"
                placeholder="FR76 3000 4001 2300 0012 3456 789"
                value={formData.numero_compte}
                onChange={(e) =>
                  setFormData({ ...formData, numero_compte: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nom_client">Nom du client</Label>
              <Input
                id="nom_client"
                placeholder="Jean Dupont"
                value={formData.nom_client}
                onChange={(e) =>
                  setFormData({ ...formData, nom_client: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="solde">Solde initial (€)</Label>
              <Input
                id="solde"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.solde || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    solde: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
