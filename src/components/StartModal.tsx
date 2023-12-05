import { Info } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@nextui-org/react";

const StartModal = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <div role="button" onClick={onOpen} className="absolute top-5 right-5 rounded-full bg-slate-200 p-2">
        <Info />
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">How to play</ModalHeader>
              <ModalBody>
                <p> 
                  Your goal is to match all the blocks at the bottom of the screen with the pattern of the blocks at the top of the screen.
                </p>
                <p> 
                  To do this, simply drag and drop the blocks in the correct order.
                </p>
                <p> 
                  Try to do this as fast as you can while minimizing the number of steps you move a block.
                  Have fun!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Ready
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default StartModal;
