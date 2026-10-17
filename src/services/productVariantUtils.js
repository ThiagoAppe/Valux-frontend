export function getActiveVariants(product) {
  return (product.variants ?? []).filter((variant) => variant.active);
}

export function getVariantOptions(variant) {
  return Object.fromEntries((variant.options ?? []).map((option) => [option.option_type_id, option.value]));
}

export function findVariant(variants, selectedOptions) {
  const selectedEntries = Object.entries(selectedOptions).filter(([, value]) => value);
  if (!selectedEntries.length) return null;
  return variants.find((variant) => {
    const options = getVariantOptions(variant);
    return selectedEntries.length === Object.keys(options).length && selectedEntries.every(([key, value]) => options[key] === value);
  }) ?? null;
}

export function isOptionAvailable(variants, selectedOptions, typeId, value) {
  const nextOptions = { ...selectedOptions, [typeId]: value };
  return variants.some((variant) => {
    const options = getVariantOptions(variant);
    return Object.entries(nextOptions).filter(([, optionValue]) => optionValue).every(([key, optionValue]) => options[key] === optionValue);
  });
}

export function getInitialSelection(product) {
  const variants = getActiveVariants(product);
  const optionTypes = product.option_types ?? [];
  if (variants.length === 1 && optionTypes.length) return getVariantOptions(variants[0]);
  return optionTypes.length ? {} : (variants[0] ? { __variant: variants[0].id } : {});
}
