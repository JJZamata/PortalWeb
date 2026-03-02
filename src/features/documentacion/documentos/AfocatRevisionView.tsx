import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { useDocumentos } from './hooks/useDocumentos';
import { DocumentosTable } from './components/DocumentosTable';
import { InsuranceDetailDialog } from './components/InsuranceDetailDialog';
import { TechnicalReviewDetailDialog } from './components/TechnicalReviewDetailDialog';
import { EditInsuranceDialog } from './components/EditInsuranceDialog';
import { EditTechnicalReviewDialog } from './components/EditTechnicalReviewDialog';
import { CreateTechnicalReviewDialog } from './components/CreateTechnicalReviewDialog';
import { CreateInsuranceDialog } from './components/CreateInsuranceDialog';
import { PaginationControls } from './components/PaginationControls';
import { useInsuranceDetail } from './hooks/useInsuranceDetail';
import { useTechnicalReviewDetail } from './hooks/useTechnicalReviewDetail';
import { documentosService } from './services/documentosService';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, XCircle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AfocatRevisionMode = 'all' | 'insurance' | 'technicalReview';

interface AfocatRevisionViewProps {
	mode?: AfocatRevisionMode;
}

const AfocatRevisionView = ({ mode = 'all' }: AfocatRevisionViewProps) => {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState('');
	const [tipoFiltro, setTipoFiltro] = useState<AfocatRevisionMode>(mode);
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState('DESC');

	useEffect(() => {
		setTipoFiltro(mode);
	}, [mode]);

	const isInsuranceMode = mode === 'insurance';
	const isTechnicalMode = mode === 'technicalReview';
	const isAllMode = mode === 'all';

	const { documentos, pagination, loading, error, page, handlePageChange } = useDocumentos(
		searchTerm,
		tipoFiltro,
		sortBy,
		sortOrder
	);

	const { toast } = useToast();
	const [showInsuranceDetailDialog, setShowInsuranceDetailDialog] = useState(false);
	const [showTechnicalReviewDetailDialog, setShowTechnicalReviewDetailDialog] = useState(false);
	const [showEditInsuranceDialog, setShowEditInsuranceDialog] = useState(false);
	const [showEditTechnicalReviewDialog, setShowEditTechnicalReviewDialog] = useState(false);
	const [showCreateTechnicalReviewDialog, setShowCreateTechnicalReviewDialog] = useState(false);
	const [showCreateInsuranceDialog, setShowCreateInsuranceDialog] = useState(false);

	const { insuranceDetail, loadingDetail: loadingInsurance, errorDetail: errorInsurance, fetchInsuranceDetail, clearInsuranceDetail } = useInsuranceDetail();
	const { technicalReviewDetail, loadingDetail: loadingTechnical, errorDetail: errorTechnical, fetchTechnicalReviewDetail, clearTechnicalReviewDetail } = useTechnicalReviewDetail();

	const handleRefresh = () => {
		handlePageChange(1);
	};

	const handleUpdateSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ['documentos'] });
	};

	const handleViewInsuranceDetail = async (policyNumber: string) => {
		try {
			await fetchInsuranceDetail(policyNumber);
			setShowInsuranceDetailDialog(true);
		} catch (error: any) {
			toast({
				title: "Error al cargar detalles",
				description: error?.message || "No se pudieron cargar los detalles del seguro.",
				variant: "destructive",
			});
		}
	};

	const handleCloseInsuranceDetail = () => {
		setShowInsuranceDetailDialog(false);
		clearInsuranceDetail();
	};

	const handleViewTechnicalReviewDetail = async (reviewCode: string) => {
		try {
			await fetchTechnicalReviewDetail(reviewCode);
			setShowTechnicalReviewDetailDialog(true);
		} catch (error: any) {
			toast({
				title: "Error al cargar detalles",
				description: error?.message || "No se pudieron cargar los detalles de la revisión técnica.",
				variant: "destructive",
			});
		}
	};

	const handleCloseTechnicalReviewDetail = () => {
		setShowTechnicalReviewDetailDialog(false);
		clearTechnicalReviewDetail();
	};

	const handleDelete = async (documento: any) => {
		try {
			if (documento.tipo === 'AFOCAT') {
				await documentosService.deleteInsurance(documento.numero);
				toast({
					title: "Seguro eliminado",
					description: `El seguro ${documento.tipo} número ${documento.numero} ha sido eliminado exitosamente.`,
				});
			} else if (documento.tipo === 'REVISION') {
				await documentosService.deleteTechnicalReview(documento.numero);
				toast({
					title: "Revisión técnica eliminada",
					description: `La revisión ${documento.tipo} número ${documento.numero} ha sido eliminada exitosamente.`,
				});
			} else {
				await documentosService.deleteDocumento(documento);
				toast({
					title: "Documento eliminado",
					description: `El documento ${documento.tipo} número ${documento.numero} ha sido eliminado exitosamente.`,
				});
			}
			handlePageChange(page);
		} catch (error: any) {
			toast({
				title: "Error al eliminar",
				description: error?.message || error.response?.data?.message || "No se pudo eliminar el documento. Inténtalo nuevamente.",
				variant: "destructive",
			});
		}
	};

	const handleEditInsurance = async (policyNumber: string) => {
		try {
			await fetchInsuranceDetail(policyNumber);
			setShowEditInsuranceDialog(true);
		} catch (error: any) {
			toast({
				title: "Error al cargar datos",
				description: error?.message || "No se pudieron cargar los datos del seguro para edición.",
				variant: "destructive",
			});
		}
	};

	const handleCloseEditInsurance = () => {
		setShowEditInsuranceDialog(false);
		clearInsuranceDetail();
	};

	const handleEditTechnicalReview = async (reviewId: string) => {
		try {
			await fetchTechnicalReviewDetail(reviewId);
			setShowEditTechnicalReviewDialog(true);
		} catch (error: any) {
			toast({
				title: "Error al cargar datos",
				description: error?.message || "No se pudieron cargar los datos de la revisión técnica para edición.",
				variant: "destructive",
			});
		}
	};

	const handleCloseEditTechnicalReview = () => {
		setShowEditTechnicalReviewDialog(false);
		clearTechnicalReviewDetail();
	};

	const getErrorMessage = (error: any) => {
		if (error?.isValidationError) {
			return error.backendMessage || 'Error de validación';
		}
		return error?.message || 'Error desconocido';
	};

	const getErrorDetails = (error: any) => {
		if (error?.isValidationError && error?.validationErrors) {
			return error.validationErrors.map((err: any) =>
				`• ${err.field || err.location}: ${err.message}`
			).join('\n');
		}
		return null;
	};

	if (error) {
		const errorDetails = getErrorDetails(error);
		return (
			<AdminLayout>
				<div className="flex flex-col items-center justify-center h-64 max-w-2xl mx-auto">
					<XCircle className="w-12 h-12 text-red-500 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						Error al cargar documentos
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-2 text-center">
						{getErrorMessage(error)}
					</p>

					{errorDetails && (
						<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 text-left">
							<p className="font-semibold mb-2">Detalles del error:</p>
							<pre className="whitespace-pre-wrap text-xs">{errorDetails}</pre>
						</div>
					)}

					<Button onClick={handleRefresh} variant="outline">
						<RefreshCw className="w-4 h-4 mr-2" />
						Reintentar
					</Button>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="space-y-8">
				<div className="bg-gradient-to-br from-white to-cyan-50/30 dark:from-[#1a1a1a] dark:to-[#1a2340]/40 p-8 rounded-2xl shadow-lg border border-cyan-200/40 dark:border-cyan-900/40">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-800 to-cyan-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-cyan-500 mb-2">
								{isInsuranceMode
									? 'Gestión de Seguros AFOCAT'
									: isTechnicalMode
										? 'Gestión de Revisiones Técnicas'
										: 'Gestión de Documentos'}
							</h1>
							<p className="text-gray-600 dark:text-gray-400 text-lg">
								{isInsuranceMode
									? 'Administra exclusivamente los documentos de seguros AFOCAT'
									: isTechnicalMode
										? 'Administra exclusivamente las revisiones técnicas vehiculares'
										: 'Administra la documentación vehicular, Revisión, AFOCAT y habilitaciones'}
							</p>
						</div>
						<div className="flex items-center gap-6">
							<div className="text-center">
								<p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
									{loading ? '-' : pagination.totalItems}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">Total Documentos</p>
							</div>
						</div>
					</div>
				</div>

				<Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
					<CardHeader className="pb-4">
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
							<div>
								<CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
									Documentos Registrados
									{loading && <RefreshCw className="w-5 h-5 animate-spin text-cyan-600 dark:text-cyan-400" />}
								</CardTitle>
								<CardDescription className="text-gray-600 dark:text-gray-400">
									{isInsuranceMode
										? 'Listado completo de seguros AFOCAT registrados'
										: isTechnicalMode
											? 'Listado completo de revisiones técnicas registradas'
											: 'Listado completo de todos los documentos registrados'}
								</CardDescription>
							</div>
							<div className="flex gap-3 items-center">
								{!isInsuranceMode && (
									<Button
										onClick={() => setShowCreateTechnicalReviewDialog(true)}
										className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
									>
										<Plus className="w-4 h-4 mr-2" />
										Nueva Revisión
									</Button>
								)}
								{!isTechnicalMode && (
									<Button
										onClick={() => setShowCreateInsuranceDialog(true)}
										className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
									>
										<Plus className="w-4 h-4 mr-2" />
										Nuevo Seguro
									</Button>
								)}
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col lg:flex-row gap-4 mb-6">
							<div className="relative flex-1">
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
								<Input
									placeholder={isInsuranceMode
										? 'Buscar por placa o número de póliza...'
										: isTechnicalMode
											? 'Buscar por placa o código de revisión...'
											: 'Buscar por placa, número de documento o tipo...'}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-12 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 bg-white dark:bg-gray-800 dark:text-white text-base"
								/>
							</div>

							<div className="flex gap-2 items-center">
								{isAllMode && (
									<div className="min-w-[180px]">
										<Select value={tipoFiltro} onValueChange={(value) => setTipoFiltro(value as AfocatRevisionMode)}>
											<SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 bg-white dark:bg-gray-800 dark:text-white">
												<SelectValue placeholder="Tipo" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">Todos los tipos</SelectItem>
												<SelectItem value="insurance">Seguros (AFOCAT)</SelectItem>
												<SelectItem value="technicalReview">Revisiones Técnicas</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}

								<div className="min-w-[140px]">
									<Select value={sortBy} onValueChange={setSortBy}>
										<SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 bg-white dark:bg-gray-800 dark:text-white">
											<SelectValue placeholder="Ordenar por" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="createdAt">Fecha creación</SelectItem>
											<SelectItem value="expirationDate">Fecha vencimiento</SelectItem>
											<SelectItem value="vehiclePlate">Placa vehicular</SelectItem>
											<SelectItem value="type">Tipo de documento</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="min-w-[120px]">
									<Select value={sortOrder} onValueChange={setSortOrder}>
										<SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 bg-white dark:bg-gray-800 dark:text-white">
											<SelectValue placeholder="Orden" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="DESC">Descendente</SelectItem>
											<SelectItem value="ASC">Ascendente</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
						<DocumentosTable
							documentos={documentos}
							loading={loading}
							onDelete={handleDelete}
							onViewInsuranceDetail={handleViewInsuranceDetail}
							onViewTechnicalReviewDetail={handleViewTechnicalReviewDetail}
							onEditInsurance={handleEditInsurance}
							onEditTechnicalReview={handleEditTechnicalReview}
						/>
						{pagination && <PaginationControls pagination={pagination} onPageChange={handlePageChange} searchTerm={searchTerm} tipoFiltro={tipoFiltro} />}
					</CardContent>
				</Card>

				<InsuranceDetailDialog
					insurance={insuranceDetail}
					open={showInsuranceDetailDialog}
					onOpenChange={handleCloseInsuranceDetail}
					loading={loadingInsurance}
					error={errorInsurance}
				/>

				<TechnicalReviewDetailDialog
					technicalReview={technicalReviewDetail}
					open={showTechnicalReviewDetailDialog}
					onOpenChange={handleCloseTechnicalReviewDetail}
					loading={loadingTechnical}
					error={errorTechnical}
				/>

				<EditInsuranceDialog
					insurance={insuranceDetail}
					open={showEditInsuranceDialog}
					onOpenChange={handleCloseEditInsurance}
					onSuccess={handleUpdateSuccess}
				/>

				<EditTechnicalReviewDialog
					technicalReview={technicalReviewDetail}
					open={showEditTechnicalReviewDialog}
					onOpenChange={handleCloseEditTechnicalReview}
					onSuccess={handleUpdateSuccess}
				/>

				{!isInsuranceMode && (
					<CreateTechnicalReviewDialog
						open={showCreateTechnicalReviewDialog}
						onOpenChange={setShowCreateTechnicalReviewDialog}
						onSuccess={() => handlePageChange(1)}
					/>
				)}

				{!isTechnicalMode && (
					<CreateInsuranceDialog
						open={showCreateInsuranceDialog}
						onOpenChange={setShowCreateInsuranceDialog}
						onSuccess={() => handlePageChange(1)}
					/>
				)}
			</div>
		</AdminLayout>
	);
};

export default AfocatRevisionView;
