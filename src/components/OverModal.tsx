import { FC, Dispatch, SetStateAction } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface OverModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
}

const OverModal: FC<OverModalProps> = ({
  open,
  setOpen,
  reset,
}) => {
  return (
    <>
      <Modal isOpen={open}
        onOpenChange={() => {
          setOpen(false);
          reset();
        }}
        isDismissable={false}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              You lost...
            </ModalHeader>
            <ModalBody>
              <p> 
                You spent longer than a minute. Please try again.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary"
                onPress={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Retry
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

export default OverModal;
