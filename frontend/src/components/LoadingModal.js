import { Modal } from '@mui/material';
import LoadingIcons from 'react-loading-icons'

export default function LoadingModal(props) {


    return(
        <Modal
        open={props.modalOpen}
        onClose={props.handleModalClose}
        >
        <LoadingIcons.Bars />
        </Modal>
    )
    
}
