import { h, defineComponent, ref } from 'vue';
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/solid';
import AtCheckbox from '../AtCheckbox/AtCheckbox';
import AtInput from '../AtInput/AtInput';
import AtInputAddOn from '../AtInputAddOn/AtInputAddOn';
import AtPhoneSelect from '../AtPhoneSelect/AtPhoneSelect';
import AtButton from '../AtButton/AtButton';
import { hasOwnProperty } from '../../utils';

export default defineComponent({
  name: 'AtLoginPage',
  emits: ['submit'],
  model: {
    prop: ['phone', 'email', 'password', 'rememberMe'],
  },
  props: {
    title: { type: String, default: 'Авторизация' },
    titleLogo: {
      type: Object,
      default: () => {},
      validator: function (obj) {
        return hasOwnProperty(obj, 'name') && hasOwnProperty(obj, 'path');
      },
    },
    phoneLabel: { type: String, default: 'Номер телефона' },
    phoneErrorText: { type: String, default: '' },
    phone: { type: String, default: '' },
    emailLabel: { type: String, default: 'Эл.почта' },
    emailErrorText: { type: String, default: '' },
    email: { type: String, default: '' },
    withEmail: { type: Boolean, default: false },
    password: { type: String, default: '' },
    passwordLabel: { type: String, default: 'Пароль' },
    passwordErrorText: { type: String, default: '' },
    rememberMe: { type: Boolean, default: false },
    rememberMeLabel: { type: String, default: 'Запомнить меня на этом устройстве' },
    submitted: { type: Boolean, default: false },
    submitLabel: { type: String, default: 'Войти' },
    submitLoading: { type: Boolean, default: false },
  },
  setup(_, { emit }) {
    const passwordInputType = ref('password');
    function submitForm(event) {
      event.preventDefault();
      emit('submit');
    }

    return {
      submitForm,
      passwordInputType,
    };
  },
  render() {
    return h(
      'form',
      {
        onSubmit: this.submitForm,
      },
      [
        h('div', { class: 'p-4 max-w-xl min-w-md sm:py-6 sm:px-8 mx-auto relative m-auto' }, [
          h('div', { class: 'text-center w-96' }, [
            this.titleLogo
              ? h('img', { class: 'h-10 mx-auto', src: this?.titleLogo?.path, alt: this?.titleLogo?.name })
              : h('h', { class: 'text-xl mx-auto inline' }, [h('b', this.title)]),
          ]),
          this.withEmail
            ? h('div', { class: 'mb-4 w-96' }, [
                h(AtInput, {
                  label: this.emailLabel,
                  placeholder: 'test-08@mail.com',
                  error: this.submitted && this.emailErrorText.length ? this.emailErrorText : null,
                  modelValue: this.email,
                  type: 'email',
                  ref: 'emailInput',
                  'onUpdate:modelValue': email => this.$emit('update:email', email),
                }),
              ])
            : h('div', { class: 'mb-4 mt-4 w-96' }, [
                h(AtPhoneSelect, {
                  label: this.phoneLabel,
                  error: this.submitted && this.phoneErrorText.length ? this.phoneErrorText : null,
                  modelValue: this.phone,
                  ref: 'phoneInput',
                  'onUpdate:modelValue': phoneNumber => this.$emit('update:phone', phoneNumber),
                }),
              ]),
          h('div', { class: 'mb-4 w-96' }, [
            h(
              AtInput,
              {
                label: this.passwordLabel,
                placeholder: '*********',
                error: this.submitted && this.passwordErrorText.length ? this.passwordErrorText : null,
                modelValue: this.password,
                type: this.passwordInputType,
                'onUpdate:modelValue': password => this.$emit('update:password', password),
              },
              {
                addOnAfter: () =>
                  h(
                    AtInputAddOn,
                    {
                      side: 'right',
                      select: true,
                      class: 'border-r-0 border-t-0 border-b-0 cursor-pointer',
                    },
                    {
                      default: () =>
                        this.passwordInputType === 'text'
                          ? h(EyeIcon, {
                              class: 'h-5 w-5 text-gray-400 dark:text-white',
                              onClick: () => (this.passwordInputType = 'password'),
                            })
                          : h(EyeOffIcon, {
                              class: 'h-5 w-5 text-gray-400 dark:text-white',
                              onClick: () => (this.passwordInputType = 'text'),
                            }),
                    }
                  ),
              }
            ),
          ]),
          h('div', { class: 'w-96 grid grid-cols-5 gap-4' }, [
            h(
              'div',
              { class: 'col-start-1 col-span-5' },
              h(AtCheckbox, {
                modelValue: this.rememberMe,
                label: this.rememberMeLabel,
                'onUpdate:modelValue': checked => this.$emit('update:rememberMe', checked),
              })
            ),
            h(
              'div',
              { class: 'col-span-5 w-96' },
              h(
                AtButton,
                {
                  color: 'primary',
                  class: 'w-full',
                  loading: this.submitLoading,
                },
                { default: () => h('span', { class: `${this.submitLoading ? 'ml-3' : ''}` }, this.submitLabel) }
              )
            ),
          ]),
        ]),
      ]
    );
  },
});
