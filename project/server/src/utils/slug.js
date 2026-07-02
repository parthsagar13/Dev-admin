import slugify from 'slugify';

export const generateSlug = (title) => {
  const base = slugify(title, { lower: true, strict: true });
  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
};
