import FloatingControlPanel from "./FloatingControlPanel";

export default function HistoryControls({
  undoDisabled,
  redoDisabled,
  onUndoClick,
  onRedoClick
}) {
  const buttonInfo = [
    { key: 'undo', label: "Undo", disabled: undoDisabled, onPress: onUndoClick },
    { key: 'redo', label: "Redo", disabled: redoDisabled, onPress: onRedoClick },
  ];

  return (
    <FloatingControlPanel
      buttonInfo={buttonInfo}
      placement="bottom-left"
    />
  );
}