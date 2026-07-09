import { useState } from 'react';
import { User, Users, Plus } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddPropietarioDialog } from '@/features/vehiculos/propietarios/components/AddPropietarioDialog';
import { ManagePropietariosDialog } from '@/features/vehiculos/propietarios/components/ManagePropietariosDialog';

const PropietariosPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showManagerDialog, setShowManagerDialog] = useState(false);

  const handleOwnersChanged = () => {
    // Los diálogos ya invalidan sus propias queries; este punto queda listo para extensiones futuras.
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-white to-emerald-50/40 dark:from-gray-900 dark:to-emerald-950/20 p-8 rounded-2xl shadow-lg border border-emerald-200/50 dark:border-emerald-800/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent mb-2">
                Gestión de Propietarios
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Administra los propietarios asociados a las mototaxis registradas en el sistema.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowManagerDialog(true)}
                className="rounded-xl border-gray-300 dark:border-gray-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Gestionar Propietarios
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Propietario
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Módulo de Propietarios
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Usa el gestor para buscar, editar o eliminar propietarios y el formulario para registrar nuevos.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Registro rápido</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Crea propietarios con DNI, teléfono y datos opcionales de contacto.</p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
              <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">Edición y control</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Actualiza datos y revisa cuántos vehículos tiene cada propietario.</p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900/40 dark:bg-sky-950/20">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-200">Integración con vehículos</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">El módulo se integra con el flujo de mototaxis y selección de propietarios.</p>
            </div>
          </CardContent>
        </Card>

        <AddPropietarioDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleOwnersChanged}
        />
        <ManagePropietariosDialog
          open={showManagerDialog}
          onOpenChange={setShowManagerDialog}
          onDataChange={handleOwnersChanged}
        />
      </div>
    </AdminLayout>
  );
};

export default PropietariosPage;