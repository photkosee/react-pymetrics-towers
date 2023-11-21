export interface Block {
  id: number;
  color: string;
}

export interface Tower {
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}