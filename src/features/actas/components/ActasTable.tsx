import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, RefreshCw, Camera, AlertTriangle, CheckCircle, FileBarChart } from "lucide-react";

interface Record {
  id: number;
  recordType: 'conforme' | 'noconforme';
  vehiclePlate: string;
  location: string;
  observations: string;
  inspectionDateTime: string;
  createdAt: string;
  updatedAt: string;
  inspector: {
    id: number;
    username: string;
    email: string;
  };
  photosCount: number;
  violationsCount: number;
}

interface Props {
  records: Record[];
  loading: boolean;
  fetchRecordDetail: (id: number, type: 'conforme' | 'noconforme') => void;
  searchTerm?: string;
}

export const ActasTable = ({ records, loading, fetchRecordDetail, searchTerm = '' }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'conforme':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
      case 'noconforme':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'conforme':
        return <CheckCircle className="w-4 h-4" />;
      case 'noconforme':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileBarChart className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-[#812020] dark:text-[#fca5a5]" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando actas...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/50 dark:from-gray-800 dark:to-gray-800">
            <TableRow>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">ID</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">Tipo</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">Placa</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">Inspector</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">Ubicación</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">Fecha Inspección</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">Fotos</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300">Infracciones</TableHead>
              <TableHead className="font-bold text-red-900 dark:text-gray-300 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <FileBarChart className="w-8 h-8 mb-2" />
                    {searchTerm.length >= 2 ? (
                      <div>
                        <p className="font-medium">No se encontraron actas</p>
                        <p className="text-sm">que contengan "{searchTerm}"</p>
                      </div>
                    ) : (
                      <p>No se encontraron actas</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id} className="hover:bg-[#812020]/10 dark:hover:bg-gray-800 transition-colors">
                  <TableCell className="font-mono font-semibold text-[#812020] dark:text-red-400">{record.id}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={`px-3 py-1 rounded-full font-semibold border flex items-center gap-1 w-fit ${getRecordTypeColor(record.recordType)}`}
                    >
                      {getRecordTypeIcon(record.recordType)}
                      {record.recordType === 'conforme' ? 'Conforme' : 'No Conforme'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-gray-300">{record.vehiclePlate}</TableCell>
                  <TableCell className="text-foreground dark:text-gray-300">{record.inspector.username}</TableCell>
                  <TableCell className="text-foreground dark:text-gray-300">{record.location}</TableCell>
                  <TableCell className="text-foreground dark:text-gray-300 text-sm">{formatDate(record.inspectionDateTime)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-blue-700 dark:text-blue-300">
                      <Camera className="w-3 h-3 mr-1" />
                      {record.photosCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.violationsCount > 0 ? (
                      <Badge variant="outline" className="text-red-700 dark:text-red-300">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {record.violationsCount}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        0
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-[#812020]/10 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => fetchRecordDetail(record.id, record.recordType)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-[#812020]/10 dark:hover:bg-gray-700 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};