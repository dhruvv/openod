import { Modal, Box, Typography} from '@mui/material';
import LoadingIcons from 'react-loading-icons'

export default function LoadingModal(props) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    return(
        
          <Modal
                open={props.modalOpen}
                onClose={(e, value) => {props.handleModalClose(e, value, false)}}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                         Loading,....
                    </Typography>
                    <LoadingIcons.Bars
                        height="3em"
                        fill="#06bcee"
                        width="10em"
                    />

                </Box>

                
            </Modal>
  
    )
    
}
