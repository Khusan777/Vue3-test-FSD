import { h, ref, defineComponent, computed } from 'vue';
import { generatorId, getFileTypes, convertBytes, transformToBool } from '../../utils';

import { PaperClipIcon } from '@heroicons/vue/outline/esm';
import { MinusCircleIcon } from '@heroicons/vue/solid/esm';
import { getInputHelpType, setInputBorderClass } from '../../utils/componentsSameFunctions/forms';
import AtInputHelp from '../AtInputHelp/AtInputHelp';
import InputElements from '../../mixins/props/InputElements';

export default defineComponent({
  name: 'AtFileSelect',
  props: {
    ...InputElements.props,
    id: { type: String, default: () => generatorId('at-file-select-') },
    multiple: { type: Boolean, default: false },
    title: { type: String, default: '' },
    titleMore: { type: String, default: '' },
    showSignature: { type: Boolean, default: true },
    formKey: { type: String, default: 'files' },
    accept: { type: [String, Object, Array], default: '.*' },
    size: { type: [Number, String, Infinity], default: Infinity },
  },
  setup(props, { emit }) {
    let filesFormData = ref(new FormData());
    let filesToPreview = ref([]);
    let files = ref([]);

    function onFileSelect(newFiles) {
      if (props.multiple) {
        for (let file of newFiles) {
          const reader = new FileReader();
          files.value.push(file);
          filesFormData.value.append(props.formKey + '[]', file);
          reader.onload = e => {
            filesToPreview.value.push({
              preview: e.target.result,
              name: file.name,
              size: file.size,
            });
          };
          reader.readAsDataURL(file);
        }
      } else {
        const reader = new FileReader();
        reader.onload = e => {
          filesToPreview.value.unshift({
            preview: e.target.result,
            name: newFiles[0].name,
            size: newFiles[0].size,
          });
        };
        reader.readAsDataURL(newFiles[0]);
        filesFormData.value.append(props.formKey, newFiles[0]);
        filesToPreview.value = [];
        files.value = [];
        files.value.push(newFiles[0]);
      }
      emit('onSelect', filesFormData.value);
    }

    const signature = computed(() => {
      let result = getFileTypes(props.accept).text;
      if (Number.isInteger(Number(props.size))) {
        result += ' размером не более ';
        const bytes = convertBytes(Number(props.size));
        let prefix = '';
        switch (bytes.key) {
          case 'bytes':
            prefix = 'байт';
            break;
          case 'kilobyte':
            prefix = 'килобайт';
            break;
          case 'megabyte':
            prefix = 'мегабайт';
            break;
          case 'gigabyte':
            prefix = 'гигабайт';
            break;
          case 'terabyte':
            prefix = 'терабайт';
            break;
        }
        result += bytes[bytes.key] + ' ' + prefix;
      }
      return result;
    });

    function removeFileFromFilesList(event, index) {
      event.preventDefault();
      event.stopPropagation();
      filesToPreview.value = filesToPreview.value.filter((_, fileIndex) => fileIndex !== index);
      files.value = files.value.filter((_, fileIndex) => fileIndex !== index);
      if (props.multiple) {
        filesFormData.value.delete(props.formKey + '[]');
        for (let file of files.value) {
          filesFormData.value.append(props.formKey + '[]', file);
        }
      } else {
        filesFormData.value.delete(props.formKey);
        for (let file of files.value) {
          filesFormData.value.append(props.formKey, file);
        }
      }
      emit('onSelect', filesFormData.value);
    }

    return {
      filesFormData,
      filesToPreview,
      files,
      onFileSelect,
      signature,
      removeFileFromFilesList,
    };
  },
  render() {
    const isDisabled = transformToBool(this.disabled);
    const inputRef = ref(generatorId('inputRef'));

    const renderCell = (file, index) => {
      return h('div', { class: 'flex items-center mt-3' }, [
        h('div', { class: 'flex-shrink-0', ref: index === 0 ? 'leftColRef' : null }, [
          h('img', {
            class: 'h-14 w-14 object-cover rounded-md',
            src: file.preview,
          }),
        ]),
        h(
          'div',
          {
            class: 'text-left w-4/6 flex-1 px-3',
            style: `max-width: ${
              this.$refs.mainBlockRef?.clientWidth -
              (this.$refs.leftColRef?.clientWidth + this.$refs.rightColRef?.clientWidth)
            }px`,
          },
          [
            h('p', { class: 'p-0 mb-1 text-gray-800 break-all truncate text-sm dark:text-white' }, file.name),
            h('p', { class: 'p-0 m-0 text-gray-400 text-xs' }, `(${convertBytes(file.size).megabyte.toFixed(2)} мб.)`),
          ]
        ),
        h('div', { class: 'flex-shrink-0', ref: index === 0 ? 'rightColRef' : null }, [
          h(
            'button',
            {
              onClick: event => {
                this.removeFileFromFilesList(event, index);
              },
            },
            [h(MinusCircleIcon, { class: 'h-6 w-6 text-red-500' })]
          ),
        ]),
      ]);
    };

    return h('div', [
      h('form', null, [
        this.label
          ? h(
              'label',
              {
                for: this.id,
                class: 'block text-sm font-medium text-gray-700 mb-1 dark:text-white',
              },
              this.label
            )
          : null,
        h(
          'button',
          {
            onClick: event => {
              event.preventDefault();
              event.stopPropagation();
              inputRef.value?.click();
            },
            class: [
              'px-6 pt-5 pb-6 border-2 w-full border-gray-300 border-dashed rounded-md rounded-md font-medium focus:outline-none text-primary-600',
              'dark:border-gray-600 dark:text-white',
              setInputBorderClass(this.error, this.success),
              {
                'bg-white hover:text-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 dark:bg-gray-700 dark:hover:text-gray-200 dark:focus:ring-offset-gray-900 dark:focus:ring-primary-600':
                  !isDisabled,
              },
              { 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed': isDisabled },
            ],
          },
          [
            this.multiple
              ? h('div', { class: 'block w-full' }, [
                  h('div', { class: 'flex items-center w-full justify-center' }, [
                    h(PaperClipIcon, { class: 'mr-2 h-5 w-5 block text-gray-400' }),
                    this.filesToPreview.length
                      ? this.titleMore || 'Добавить еще файлы'
                      : this.title || 'Выберите файлы',
                  ]),
                  this.showSignature ? h('p', { class: 'text-xs text-gray-400 mt-3' }, this.signature) : null,

                  this.filesToPreview.length
                    ? h('div', { class: 'mt-4', ref: 'mainBlockRef' }, [
                        this.filesToPreview.map((file, index) => renderCell(file, index)),
                      ])
                    : null,
                ])
              : h('div', { class: 'block w-full' }, [
                  h('div', { class: 'flex items-center w-full justify-center' }, [
                    h(PaperClipIcon, { class: 'mr-2 h-5 w-5 block text-gray-400 dark:text-gray-300' }),
                    this.filesToPreview.length
                      ? this.titleMore || 'Загрузить другой файл'
                      : this.title || 'Выберите файл',
                  ]),
                  this.showSignature ? h('p', { class: 'text-xs text-gray-400 mt-3' }, this.signature) : null,

                  this.filesToPreview.length
                    ? h('div', { class: 'mt-4', ref: 'mainBlockRef' }, [renderCell(this.filesToPreview[0], 0)])
                    : null,
                ]),
          ]
        ),
        h('input', {
          id: this.id,
          type: 'file',
          disabled: isDisabled,
          ref: inputRef,
          multiple: this.multiple,
          accept: getFileTypes(this.accept).mime,
          onChange: event => {
            event.preventDefault();
            event.stopPropagation();
            this.onFileSelect(event.target.files);
          },
          hidden: true,
          class: 'hidden',
        }),
        this.error
          ? h(AtInputHelp, { type: getInputHelpType(this.error, this.success) }, { default: () => this.error })
          : null,
      ]),
    ]);
  },
});
