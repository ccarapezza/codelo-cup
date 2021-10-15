import { Divider, Paper } from "@mui/material";
import { useDrop } from "react-dnd";
import { yellow } from '@mui/material/colors';

export const DropBox = function DropBox({ name, children, sx }) {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "box",
        drop: () => ({ name: name }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));
    const isActive = canDrop && isOver;
    let backgroundColor = '#fff';
    if (isActive) {
        backgroundColor = yellow[500];
    }
    else if (canDrop) {
        backgroundColor = yellow[100];
    }
    return (<Paper ref={drop} role={name} sx={{ ...sx, backgroundColor, borderColor:"#000" }} variant="outlined">
                <Divider>Mesa 1</Divider>
                {children}
            </Paper>);
};