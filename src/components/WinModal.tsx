import { FC, Dispatch, SetStateAction } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface WinModalProps {
  open: boolean;
  steps: number;
  time: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
}

const WinModal: FC<WinModalProps> = ({ open, steps, time, setOpen, reset }) => {
  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={() => {
          setOpen(false);
          reset();
        }}
        isDismissable={false}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">You won!</ModalHeader>
            <ModalBody>
              <p>
                You spent {time} seconds with {steps} steps.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Restart
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WinModal;
