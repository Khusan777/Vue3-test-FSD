import { reactive, Ref, ref, UnwrapRef, watch } from 'vue';

interface IRulesList {
  required?: (value: string) => boolean;
  minLength?: (value: string, minLength: number) => boolean;
  maxLength?: (value: string, maxLength: number) => boolean;
  email?: (value: string) => boolean;
  numeric?: (value: number) => boolean;
  date?: (value: string) => boolean;
}

// TODO: If you need new rules you can add it yourself or write me on Telegram @alisher_aripov11
type TInputRule = 'required' | 'email' | 'numeric' | 'date' | { type: 'minLength' | 'maxLength'; value: number };
type TModelRule = 'required' | 'email' | 'numeric' | 'date' | 'minLength' | 'maxLength';

const rulesList: IRulesList = {
  // Check if field is required (is not empty)
  required: value => !!value,

  // Check if value is not less than minimal length
  minLength: (value, minLength) => value.length >= minLength,

  // Check if value is not more than max length
  maxLength: (value, maxLength) => value.length <= maxLength,

  // Test value for email by regular expression
  email: value => /^\w+@[a-zA-Z_]+?\.?[a-z]+\.[a-zA-Z]{2,10}$/.test(value),

  // Check if value is a number
  numeric: value => !isNaN(value),

  // Check if value is a Date
  date: value => {
    const valueDate = new Date(value);
    const timeInMilliSecond = valueDate.valueOf();
    const isInvalidDate = isNaN(timeInMilliSecond);
    return !isInvalidDate;
  },
};

// Validate your variable and make it reactive
export function validateRef(model: string | number, rules: TInputRule[]): UnwrapRef<any> {
  // TODO: I can't type it. If you know how to do it please do it 😁
  const localRules: Record<string, any> = {};

  // Get input rules from global rules list and copy them to local rules
  rules.forEach(rule => {
    if (typeof rule === 'string') {
      localRules[rule] = rulesList[rule];
    } else {
      localRules[rule.type] = {
        type: rulesList[rule.type],
        rule: rule.value,
      };
    }
  });

  const value: Ref = ref<typeof model>(model);
  const modelRules: Ref = ref<Record<TModelRule, boolean> | {}>({});
  const isValid: Ref = ref<boolean>(false);

  watch(
    value,
    () => {
      // Loop through local rules array and run validation functions
      for (const rule in localRules) {
        if (typeof localRules[rule] === 'object') {
          modelRules.value[rule] = localRules[rule].type(value.value, localRules[rule].rule);
        } else {
          modelRules.value[rule] = localRules[rule](value.value);
        }
      }
      // Check if all rules are valid
      isValid.value = Object.values(modelRules.value).every(rule => rule);
    },
    { immediate: true }
  );

  return reactive({
    model: value,
    isValid,
    modelRules,
  });
}
