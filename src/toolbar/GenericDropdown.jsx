import { ButtonGroup, Dropdown } from "react-bootstrap";

export default function GenericDropdown({
  title,
  itemInfo,
  clickTool, setClickTool,
  setActiveToasts,
  openDropdown, setOpenDropdown
}) {
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
    >
      <Dropdown.Toggle>{ title }</Dropdown.Toggle>

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