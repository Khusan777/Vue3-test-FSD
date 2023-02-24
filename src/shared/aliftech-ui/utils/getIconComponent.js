import { defineAsyncComponent } from 'vue';

/**
 * Returns async Icon component from HeroIcons
 * @param {string|Object} icon
 * @returns {{Icon}}
 */
export const getIconComponent = icon => {
  const iconName =
    typeof icon === 'string'
      ? `${icon.charAt(0).toUpperCase()}${icon.slice(1)}`
      : `${icon.name.charAt(0).toUpperCase()}${icon.name.slice(1)}`;
  let iconType = typeof icon === 'string' ? 'solid' : icon.type;
  let Icon = defineAsyncComponent(() => import(`@heroicons/vue/${iconType}/${iconName}Icon`));
  return { Icon };
};
