export function generateTitle (title) {
  const hasKey = this.$te('system.route', {FIELD: title})

  if (hasKey) {
    const translatedTitle = this.$t('system.route', {FIELD: title})

    return translatedTitle
  }
  return title
}
