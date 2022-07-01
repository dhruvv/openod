import { Modal, Box} from '@mui/material';
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
        <Box sx={style}>
          <Modal
                open={props.modalOpen}
                onClose={props.handleModalClose}
            >
                <LoadingIcons.Bars />
            </Modal>
        </Box>
    )
    
}
