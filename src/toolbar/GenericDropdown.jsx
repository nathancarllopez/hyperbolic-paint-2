import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

export default function GenericDropdown({
  title,
  itemInfo,
  clickTool, setClickTool,
  setActiveToasts,
  openDropdown, setOpenDropdown,
  toolbarIsVertical
}) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function handleDropdownToggle() {
    setOpenDropdown(prev => {
      if (prev === title) {
        return null;
      }
      return title;
    });
  }

  function handleItemPress(name) {
    setClickTool(name);
    setActiveToasts(prev => [ ...prev, name ]);
  }

  return (
    <Dropdown
      as={ButtonGroup}
      show={openDropdown === title}
      onToggle={handleDropdownToggle}
      onTouchStart={handleDropdownToggle}
      drop={toolbarIsVertical ? "start" : "down"}
    >
      <Dropdown.Toggle size={isTouchDevice ? "sm" : "lg"}>
        { title }
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {
          itemInfo.map(({ name, label }) => (
            <Dropdown.Item
              key={name}
              active={clickTool === name}
              onClick={() => handleItemPress(name)}
              onTouchStart={() => handleItemPress(name)}
            >
              { label }
            </Dropdown.Item>
          ))
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}