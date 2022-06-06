
import { FormGroup, FormControlLabel, Checkbox, Slider } from '@mui/material';
import {Draggable} from 'react-beautiful-dnd';


export function DraggableItemSlider(props) {
    
    return(
        <div>
        <Draggable draggableId={props.id} index={props.index}>
                {provided => (
                    <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                        <FormControlLabel
                            label={props.labelName}
                            {...provided.dragHandleProps}
                            control={
                            <Checkbox 
                                defaultChecked
                                onChange={() => props.callback(props.id)}
                            />
                            }
                        />
                        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                    </div>
                )}
               
        </Draggable>
       
        </div>
    )
}

