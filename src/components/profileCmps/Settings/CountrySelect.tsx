import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

interface Country {
  name: {
    common: string;
  };
}

const CountrySelect = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get<Country[]>(
          "https://restcountries.com/v3.1/all"
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (selectedOption: any) => {
    setSelectedCountry(selectedOption);
    console.log("Selected country:", selectedOption);
  };

  const countryOptions = countries.map((country) => ({
    value: country.name.common,
    label: country.name.common,
  }));

  return (
    <div className="flex-shrink w-full inline-block relative">
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={countryOptions}
        value={selectedCountry}
        onChange={handleCountryChange}
        placeholder="Choose..."
      />
      <div className="pointer-events-none absolute top-0 mt-3 right-0 flex items-center px-2 text-gray-600">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default CountrySelect;
