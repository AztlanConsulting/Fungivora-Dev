const controller = require('../../controllers/dashboard.controller');
const Dashboard = require('../../models/dashboard.model');

// Mockear el modelo
jest.mock('../../models/dashboard.model');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Dashboard Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    describe('fetch_dashboard', () => {
        
        it('200 - obtiene y formatea los datos del dashboard correctamente', async () => {
            const mockLotesRevision = [
                { 
                    id_lote: 1, 
                    codigo_fungivora: 'LOT-001', 
                    fecha_lote: '2026-05-20', 
                    fecha_real: '2026-05-20' 
                }
            ];
            const mockLotesActivos = 5;
            const mockBloquesContaminados = 2;
            const mockBloquesNoContaminados = 12;
            const mockInventarioBajo = [
                { id_insumo: 'ins-1', nombre: 'Agar', cantidad: '1.50', unidad: 'kg' }
            ];

            Dashboard.fetch_lotes_revision.mockResolvedValue(mockLotesRevision);
            Dashboard.fetch_lotes_activos.mockResolvedValue(mockLotesActivos);
            Dashboard.fetch_bloques_por_estado.mockImplementation(async (contaminado) => {
                return contaminado ? mockBloquesContaminados : mockBloquesNoContaminados;
            });
            Dashboard.fetch_inventario_bajo.mockResolvedValue(mockInventarioBajo);

            const req = {};
            const res = mockRes();

            await controller.fetch_dashboard(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                cards: {
                    lotesActivos: 5,
                    bloquesContaminados: 2,
                    bloquesNoContaminados: 12
                },
                listas: {
                    lotesRevision: [
                        {
                            id: 1,
                            nombre: 'LOT-001',
                            detalle: new Date('2026-05-20').toLocaleDateString('es-MX'),
                            ruta: '/lotes/detalle/1'
                        }
                    ],
                    inventarioBajo: [
                        {
                            id: 'ins-1',
                            nombre: 'Agar',
                            detalle: '1.5 kg',
                            ruta: null
                        }
                    ]
                },
                lotes: mockLotesRevision
            }));
        });

        it('500 - error cuando falla alguna consulta del modelo', async () => {
            Dashboard.fetch_lotes_revision.mockRejectedValue(new Error('Database timeout'));

            const req = {};
            const res = mockRes();

            await controller.fetch_dashboard(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Error obteniendo dashboard'
            }));
        });
    });
});