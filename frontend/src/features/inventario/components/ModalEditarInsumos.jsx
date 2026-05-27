import React, { useState} from "react";
import Text from "../../../shared/components/ui/basics/texto";
import Input from "../../../shared/components/ui/inputs/InputTexto";
import SelectField from "../../../shared/components/ui/inputs/SeleccionarTexto";
import Button from "../../../shared/components/ui/buttons/botones";
import { colores } from "../../../shared/components/ui/basics/colores";

const ModalEditarInsumo = ({ insumo, unidades, onConfirm, onCancel }) => {
    const [nombre, setNombre] = useState("");
    const [unidad, setUnidad] = useState("");
    const [stockRecomendado, setStockRecomendado] = useState("");
    const [error, setError] = useState("");
    const [confirmando, setConfirmando] = useState(false);

    // Valida y avanza al paso de confirmación
    const handleConfirmar = () => {
        if (!nombre.trim()) { setError("El nombre no puede estar vacío"); return; }
        if (!unidad) { setError("Selecciona una unidad"); return; }
        const stock = parseFloat(stockRecomendado);
        if (isNaN(stock) || stock <= 0) { setError("El stock recomendado debe ser mayor a 0"); return; }

        setError("");
        setConfirmando(true);
    };

    // Ejecuta el guardado final
    const handleConfirmarFinal = async () => {
        const exito = await onConfirm(insumo.id_insumo, {
            nombre: nombre.trim(),
            unidad,
            stock_recomendado: parseFloat(stockRecomendado),
        });
        if (!exito) {
            setConfirmando(false);
            setError("No se pudo guardar. Intenta de nuevo.");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-[30px] p-9 w-full max-w-lg shadow-2xl flex flex-col gap-6 border animate-in zoom-in duration-200">

                <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", textAlign: "center", fontSize: "20px" }}>
                    Editar Insumo
                </Text>

                {!confirmando ? (
                    <>
                        {/* Nombre */}
                        <div className="flex flex-col gap-2">
                            <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Nombre</Text>
                            <Input
                                placeholder="Nombre del insumo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        {/* Unidad */}
                        <div className="flex flex-col gap-2">
                            <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Unidad de medida</Text>
                            <SelectField
                                placeholder="Selecciona unidad"
                                size="forms"
                                value={unidad}
                                onChange={(e) => setUnidad(e.target.value)}
                                options={unidades.map(u => ({ value: u.opcion, label: u.opcion }))}
                            />
                        </div>

                        {/* Stock recomendado */}
                        <div className="flex flex-col gap-2">
                            <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock recomendado</Text>
                            <Input
                                placeholder="0.00"
                                value={stockRecomendado}
                                onChange={(e) => {
                                    const val = e.target.value.replace(",", ".");
                                    if (/^\d{0,6}(\.\d{0,2})?$/.test(val)) setStockRecomendado(val);
                                }}
                            />
                        </div>

                        {error && (
                            <Text variante="label" style={{ color: "#E53E3E", fontSize: "13px", textAlign: "center" }}>
                                {error}
                            </Text>
                        )}

                        <div className="flex gap-4">
                            <Button variant="cancelar" isOutline onClick={onCancel} className="flex-1">Cancelar</Button>
                            <Button variant="confirmar" onClick={handleConfirmar} className="flex-1">Guardar</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Text variante="label" style={{ color: colores.black, textAlign: "center" }}>
                            Confirme los siguientes cambios
                        </Text>

                        <div className="flex flex-col gap-3 4">
                            <div className="flex justify-between">
                                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Nombre</Text>
                                <Text variante="label" style={{ color: "#6B7280" }}>{nombre}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Unidad</Text>
                                <Text variante="label" style={{ color: "#6B7280" }}>{unidad}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock recomendado</Text>
                                <Text variante="label" style={{ color: "#6B7280" }}>{stockRecomendado}</Text>
                            </div>
                        </div>

                        {error && (
                            <Text variante="label" style={{ color: "#E53E3E", fontSize: "13px", textAlign: "center" }}>
                                {error}
                            </Text>
                        )}

                        <div className="flex gap-4">
                            <Button variant="cancelar" isOutline onClick={() => setConfirmando(false)} className="flex-1">
                                Regresar
                            </Button>
                            <Button variant="confirmar" onClick={handleConfirmarFinal} className="flex-1">
                                Confirmar
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModalEditarInsumo;