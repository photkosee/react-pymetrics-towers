import { FC, Dispatch, SetStateAction } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface HowToModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
}

const HowToModal: FC<HowToModalProps> = ({ open, setOpen, reset }) => {
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
            <ModalHeader className="flex flex-col gap-1">
              How to play
            </ModalHeader>
            <ModalBody>
              <p>
                Your goal is to match all the blocks with the one from the
                pattern screen.
              </p>
              <p>
                To do this, simply drag and drop the blocks in the correct
                order. Note that you can only move the top most block on each
                column.
              </p>
              <p>
                Try to do this as fast as you can while minimizing the number of
                steps you move a block. Have fun!
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
                Start
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HowToModal;
