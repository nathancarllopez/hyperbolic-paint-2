export default function generateId() {
  return `${Date.now()}-*-${(Math.floor(Math.random() * 1000)).toString().padStart(3, '0')}`
}