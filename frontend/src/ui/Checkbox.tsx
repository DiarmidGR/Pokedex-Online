import React from "react";
import "./Checkbox.css";

interface CheckboxComponentProps {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({
  isChecked,
  setIsChecked,
}) => {
  // Handler for checkbox change event
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="custom-checkbox"
      />
    </label>
  );
};

export default CheckboxComponent;
