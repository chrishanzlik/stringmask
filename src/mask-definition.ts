export type ValidatorFunction = (character: string) => boolean;

export type MaskDefinition = {
  validator: RegExp | ValidatorFunction;
};
