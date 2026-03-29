import React, { useState, useEffect, useMemo } from 'react';
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
import type { Versement, UpdateVersementDto } from '@/types/versement.types';

interface Client {
  id: number;
  nom_client: string;
  numero_compte: string;
}

interface EditVersementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (numero_versement: string, data: UpdateVersementDto) => Promise<void>;
  versement: Versement | null;
  clients: Client[];
  isLoading?: boolean;
}

export const EditVersementDialog: React.FC<EditVersementDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  versement,
  clients,
  isLoading,
}) => {
  const [formData, setFormData] = useState<UpdateVersementDto>({
    numero_cheque: '',
    montant: 0,
  });

  // Pré-remplir le formulaire quand le versement change
  useEffect(() => {
    if (versement) {
      setFormData({
        numero_cheque: versement.numero_cheque,
        montant: Number(versement.montant),
      });
    }
  }, [versement]);

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.nom_client.localeCompare(b.nom_client)),
    [clients],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!versement) return;

    await onSubmit(String(versement.numero_versement), formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le versement</DialogTitle>
          <DialogDescription>
            Modifiez les informations du versement{' '}
            <span className="font-mono font-medium">
              {versement?.numero_versement}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* Numéro versement — lecture seule */}
            <div className="grid gap-2">
              <Label>Numéro de versement</Label>
              <Input
                value={versement?.numero_versement ?? ''}
                disabled
                className="bg-gray-50 text-gray-400 font-mono"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_numero_cheque">Numéro du chèque</Label>
              <Input
                id="edit_numero_cheque"
                placeholder="CHK-458796"
                value={formData.numero_cheque ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, numero_cheque: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_montant">Montant (Ar)</Label>
              <Input
                id="edit_montant"
                type="number"
                min="0"
                step="0.01"
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

            {/* Client — lecture seule, juste pour affichage */}
            <div className="grid gap-2">
              <Label>Client associé</Label>
              <Select value={versement?.clientId ?? ''} disabled>
                <SelectTrigger className="bg-gray-50 text-gray-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortedClients.map((client) => (
                    <SelectItem
                      key={client.numero_compte}
                      value={String(client.numero_compte)}
                    >
                      {client.nom_client} — {client.numero_compte}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                Le client associé ne peut pas être modifié.
              </p>
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
              disabled={isLoading || !formData.montant || !formData.numero_cheque}
            >
              {isLoading ? 'Modification...' : 'Enregistrer les modifications'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};