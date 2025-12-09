export function propiedadesAnidadas(obj, path) {
  return path.split('.').reduce((acc, key) => {
    return acc ? acc[key] : undefined;
  }, obj);
}