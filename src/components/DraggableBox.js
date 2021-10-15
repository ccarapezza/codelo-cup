import { Box } from "@mui/system";
import axios from "axios";
import { useContext } from "react";
import { useDrag } from "react-dnd";
import Context from "../context/Context";
export const DraggableBox = function DraggableBox({ name, children, sx, onUpdate }) {
    const context = useContext(Context);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "box",
        item: { name },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                const objectType = item.name.split("-")[0];
                const objectId = item.name.split("-")[1];
                const mesaId = dropResult.name.split("-")[1];
                if(objectType==="participante"){
                    addParticipante(objectId, mesaId)
                }
                if(objectType==="muestra"){
                    addMuestra(objectId, mesaId)
                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }));

    const addParticipante = (idParticipante, idMesa) => {
        axios.post("/api/mesas/add-participante",{
            idParticipante: idParticipante,
            idMesa: idMesa,
        }).then(function (response) {
            if(response.status === 200){
                context.showMessage("Participante agregado correctamente!", "success");
                if(onUpdate){
                    onUpdate();
                }
            }else{
                context.showMessage("Error al agregar el participante.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("Error al agregar el participante.", "error");
            console.error(error);
        })
    }

    const addMuestra = (idMuestra, idMesa) => {
        axios.post("/api/mesas/add-muestra",{
            idMuestra: idMuestra,
            idMesa: idMesa,
        }).then(function (response) {
            if(response.status === 200){
                context.showMessage("Muestra agregada correctamente!.", "success");
                if(onUpdate){
                    onUpdate();
                }
            }else{
                context.showMessage("Error al agregar la Muestra.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("Error al agregar la Muestra.", "error");
            console.error(error);
        })
    }
    const opacity = isDragging ? 0.4 : 1;
    // eslint-disable-next-line jsx-a11y/aria-role
    return (<Box ref={drag} role="Box" sx={{ ...sx, opacity, cursor: "move" }} data-testid={`box-${name}`}>
        {children}
    </Box>);
};