const { register, httpRequestCounter} = require('../../config/metrics');

// Reinicia los contadores entre pruebas para evitar errores por los counts
beforeEach(() => {
    register.resetMetrics();
});

// Prueba 1 - Estado de register
describe('Estado de register - Prometheus', () => {
 
    it('metrics() resuelve sin errores', async () => {
        await expect(register.metrics()).resolves.toBeDefined();
    });
 
    it('El texto de salida no está vacío', async () => {
        const texto = await register.metrics();
        expect(texto.trim().length).toBeGreaterThan(0);
    });
 
    it('Content-Type correcto para Prometheus', async () => {
        const contentType = register.contentType;
        expect(contentType).toMatch(/text\/plain/);
    });
});

// Prueba 2 - El formato dentro de Metrics
describe ('Formato de metrics - Prometehus', () => {
    
    it('Lineas # HELP en /metrics', async () => {
        const texto = await register.metrics();
        const lineasHelp = texto.split('\n').filter(l => l.startsWith('# HELP'));
        expect(lineasHelp.length).toBeGreaterThan(0);
    });

    it('Los # TYPE declaran un tipo Prometheus válido', async () => {
        const types = ['counter', 'gauge', 'histogram'];
        const texto = await register.metrics();
        const lineasType = texto.split('\n').filter(l => l.startsWith('# TYPE'));

        lineasType.forEach(linea => {
            const tipo = linea.split(' ')[3];
            expect(types).toContain(tipo);
        })
    });

    it('Las lineas si tiene un valor válido', async () => {

        httpRequestCounter.inc({ method: 'GET', route: '/bloques', status: 200 });

        const texto = await register.metrics();
        const valores = texto.split('\n').filter(l => l && !l.startsWith('#'));

        // * El formato oficial de Prometheus permite estos valores especiales como texto
        // ! Hay metricas que no reciben suficientes datos y no inician arranque y usan estos valores
        const especiales = ['Nan', 'NaN', '+Inf', '-Inf'];

        valores.forEach(linea => {
            const parte = linea.trim().split(/\s+/);
            const ultimoToken = parte[parte.length - 1];

            const especial = especiales.includes(ultimoToken);
            const numero = Number.isFinite(Number(ultimoToken));

            expect(especial || numero).toBe(true);
        });
    });
});

// Prueba 3 - Metricas basicas
describe('Metricas basicas - Prometehus', () => {
    
    it('Proceso de revision de CPU', async () => {
        const texto = await register.metrics();
        expect(texto).toContain('process_cpu_seconds_total');
    });

    it('Proceso de revision de memoria de residencia', async () => {
        const texto = await register.metrics();
        expect(texto).toContain('process_resident_memory_bytes');
    });

    it('Proceso de revision de eventloop lag', async () => {
        const texto = await register.metrics();
        expect(texto).toContain('nodejs_eventloop_lag_seconds');
    });
});
