// Do I need this?
export default function capitalize(str) {
  if (str === '') return str;
  return str[0].toUpperCase() + str.slice(1);
}