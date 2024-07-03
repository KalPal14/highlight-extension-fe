type TArrayElement<Arr> = Arr extends readonly (infer T)[] ? T : never;
export default TArrayElement;
