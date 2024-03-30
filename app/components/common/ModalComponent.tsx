import React, { PropsWithChildren  } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, } from "@nextui-org/react";
import { ModalProps } from "@/types";

export function ModalComponent( { children, backdrop, isOpen, onClose, modelTitle, handleConfirm, disableConfirm }: PropsWithChildren<ModalProps> ) {

 return (
    <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
        {(onClose) => (
            <>
            <ModalHeader className="flex flex-col gap-1">{ modelTitle }</ModalHeader>
            <ModalBody>
                { children }
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                    Close
                </Button>
                <Button color="primary" onClick={ handleConfirm } isDisabled={ disableConfirm }>
                    Confirm
                </Button>
            </ModalFooter>
            </>
        )}
        </ModalContent>
  </Modal>
  )
};
