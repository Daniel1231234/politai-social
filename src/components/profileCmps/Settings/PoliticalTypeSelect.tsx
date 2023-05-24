import { useState } from "react";
import Select from "react-select";

enum PoliticalType {
  LEFT = "Left",
  RIGHT = "Right",
  LIBERTARIAN = "Libertarian",
  CENTRIST = "Centrist",
  CONSERVATIVE = "Conservative",
  PROGRESSIVE = "Progressive",
  SOCIALIST = "Socialist",
  GREEN = "Green",
  NATIONALIST = "Nationalist",
  FASCIST = "Fascist",
  ANARCHIST = "Anarchist",
  SOCIALDEMOCRAT = "Social Democrat",
  COMMUNIST = "Communist",
  MODERATE = "Moderate",
  RADICAL = "Radical",
  POPULIST = "Populist",
  NEOCONSERVATIVE = "Neoconservative",
  NEOPOPULIST = "Neopopulist",
}

const PoliticalTypeSelect = () => {
  const [selectedTypes, setSelectedTypes] = useState(null);

  const handleTypeChange = (selectedOptions: any) => {
    setSelectedTypes(selectedOptions);
    console.log("Selected political types:", selectedOptions);
  };

  const typeOptions = Object.values(PoliticalType).map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <div className="flex-shrink w-full inline-block relative">
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={typeOptions}
        value={selectedTypes}
        onChange={handleTypeChange}
        isMulti
        placeholder="Select political types..."
      />
    </div>
  );
};

export default PoliticalTypeSelect;
