export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

import { CategoryMap } from "../types";

export const categoryMap: CategoryMap = {
  'другое': 'card__category_other', // Для категории "другое" используем класс 'card__category_other'
  'софт-скил': 'card__category_soft', // Для категории "софт-скил" используем класс 'card__category_soft'
  'дополнительное': 'card__category_additional', // Для категории "дополнительное" используем класс 'card__category_additional'
  'кнопка': 'card__category_button', // Для категории "кнопка" используем класс 'card__category_button'
  'хард-скил': 'card__category_hard', // Для категории "хард-скил" используем класс 'card__category_hard'
};
