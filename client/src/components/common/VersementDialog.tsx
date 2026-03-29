import React, { useState, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateVersementDto } from '@/types/versement.types';

interface Client {
  id: number;
  nom_client: string;
  numero_compte: string;
}

interface VersementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateVersementDto) => Promise<void>;
  clients: Client[];
  isLoading?: boolean;
}

export const VersementDialog: React.FC<VersementDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  clients,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateVersementDto>({
    numero_versement: '',
    numero_cheque: '',
    montant: 0,
    clientId: '',
  });

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.nom_client.localeCompare(b.nom_client)),
    [clients],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      ...formData,
      clientId: formData.clientId,
    });

    setFormData({
      numero_versement: '',
      numero_cheque: '',
      montant: 0,
      clientId: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau versement</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau versement et associez-le à un client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="numero_versement">Numéro de versement</Label>
              <Input
                id="numero_versement"
                placeholder="VRS-2026-001"
                value={formData.numero_versement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numero_versement: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="numero_cheque">Numéro du chèque</Label>
              <Input
                id="numero_cheque"
                placeholder="CHK-458796"
                value={formData.numero_cheque}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numero_cheque: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="montant">Montant (Ar)</Label>
              <Input
                id="montant"
                type="number"
                min="0"
                step="0.01"
                placeholder="150000"
                value={formData.montant || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    montant: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Client associé</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un client" />
                </SelectTrigger>
                <SelectContent>
                  {sortedClients.map((client) => (
                    <SelectItem
                      key={`${client.numero_compte}`}
                      value={String(client.numero_compte)}
                    >
                      {client.nom_client} — {client.numero_compte}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button
              type="submit"
              disabled={
                isLoading || !formData.clientId
              }
            >
              {isLoading ? 'Ajout...' : 'Ajouter le versement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
