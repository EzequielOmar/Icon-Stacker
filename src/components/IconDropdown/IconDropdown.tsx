import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import styles from "./IconDropdown.module.scss";

const iconList: IconDefinition[] = Object.values(solidIcons).filter(
  (icon): icon is IconDefinition =>
    typeof icon !== "string" && typeof icon.iconName === "string"
);

interface IconDropdownProps {
  onSelect: (icon: IconDefinition) => void;
}

const IconDropdown: React.FC<IconDropdownProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const handleIconSelect = (icon: IconDefinition) => {
    onSelect(icon);
    setIsOpen(false);
  };

  const filteredIcons = iconList.filter((icon) =>
    icon.iconName.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className={styles.icon_dropdown}>
      <div
        className={styles.dropdown_header}
        onClick={() => setIsOpen(!isOpen)}
      >
        Select an Icon
      </div>
      {isOpen && (
        <div className={styles.dropdown_content}>
          <input
            type="text"
            placeholder="Search icon..."
            className={styles.icon_search}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <div className={styles.icon_list}>
            {filteredIcons.map((icon, index) => (
              <div
                key={index}
                className={styles.icon_item}
                onClick={() => handleIconSelect(icon)}
              >
                <FontAwesomeIcon icon={icon} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconDropdown;
