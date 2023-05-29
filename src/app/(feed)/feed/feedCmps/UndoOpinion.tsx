import Button from "@/components/ui/Button";
import { OpinionSchema } from "@/types/opinionType";
import React from "react";

interface UndoOpinionProps {
  handleUndo: Function;
  opinion: OpinionSchema;
}

const UndoOpinion: React.FC<UndoOpinionProps> = ({ handleUndo, opinion }) => {
  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex flex-col">
        <p>Opinion hidden</p>
        <p className="text-[10px] text-gray-500">
          {`You'll see fewer posts like this.`}
        </p>
      </div>
      <Button variant="ghost" onClick={() => handleUndo(opinion)}>
        Undo
      </Button>
    </div>
  );
};

export default UndoOpinion;
