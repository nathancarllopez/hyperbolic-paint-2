// import React, { useEffect } from 'react';

// const MyApp = ({ handleUndo }: { handleUndo: () => void }) => {
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
//         event.preventDefault(); // Prevent browser undo (if applicable)
//         handleUndo();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [handleUndo]);

//   return (
//     <div>
//       <button onClick={handleUndo}>Undo</button>
//     </div>
//   );
// };

// export default MyApp;
