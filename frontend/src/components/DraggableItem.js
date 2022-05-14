
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import {Draggable} from 'react-beautiful-dnd';


export function DraggableItem(props) {
    return(
        <Draggable draggableId={props.id} index={props.index}>
            {provided => (
            <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}>
            <FormControlLabel
                label={props.labelName} 
                control={
                <Checkbox 
                    defaultChecked
                    onChange={() => props.callback(props.id)}
                />
            }
            />
            </div>
        )}
        </Draggable>
    )
}

