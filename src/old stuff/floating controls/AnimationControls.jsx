import FloatingControlPanel from "./FloatingControlPanel";

export default function AnimationControls({
  isAnimating,
  playPauseDisabled,
  onPlayPauseClick,
}) {
  const buttonInfo = [
    { key: 'playPause', disabled: playPauseDisabled, onPress: onPlayPauseClick, label: isAnimating ? "Pause" : "Play" }
  ];

  return (
    <FloatingControlPanel
      buttonInfo={buttonInfo}
      placement="top-middle"
    />
  )
}