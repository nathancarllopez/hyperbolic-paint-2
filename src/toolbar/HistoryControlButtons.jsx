import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function HistoryControlButtons({
  history,
  setHistory
}) {
  const { snapshots, currIdx } = history;
  const buttonInfo = [
    {
      key: 'undo',
      label: "Undo",
      disabled: currIdx === 0,
      onPress: () => setHistory(prev => {
        const { currIdx } = prev;
        return {
          ...prev,
          currIdx: Math.max(0, currIdx - 1)
        }
      })
    },
    {
      key: 'redo',
      label: "Redo",
      disabled: currIdx === snapshots.length - 1,
      onPress: () => setHistory(prev => {
        const { snapshots, currIdx } = prev;
        return {
          ...prev,
          currIdx: Math.min(snapshots.length - 1, currIdx + 1)
        }
      })
    },
    {
      key: 'clear',
      label: "Clear",
      disabled: snapshots[currIdx].length === 0,
      onPress: () => setHistory(prev => {
        const { snapshots, currIdx } = prev;
        const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
        return {
          snapshots: [ ...snapshotsTillCurrent, [] ],
          currIdx: currIdx + 1
        }
      })
    }
  ];

  return (
    <>
      {
        buttonInfo.map(({ key, label, disabled, onPress }) => (
          <Button
            key={key}
            disabled={disabled}
            onClick={onPress}
            onTouchStart={onPress}
          >
            { label }
          </Button>
        ))
      }
    </>
  );
}