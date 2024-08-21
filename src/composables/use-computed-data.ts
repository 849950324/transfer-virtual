import { computed } from 'vue'
import { usePropsAlias } from './use-props-alias'

import type { TransferDataItem, TransferKey, TransferProps } from '../transfer'

export const useComputedData = (props: TransferProps) => {
  const propsAlias = usePropsAlias(props)

  const dataObj = computed(() =>
    props.data.reduce((o, cur) => (o[cur[propsAlias.value.key]] = cur) && o, {})
  )

  // 创建一个Set用于快速查找
  const modelValueSet = computed(() => new Set(props.modelValue));

  // 过滤函数
  const sourceData = computed(() => {
    if (!Array.isArray(props.data)) return [];

    return props.data.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      const key = propsAlias.value.key;
      if (key === undefined || typeof key !== 'string') return false;

      const value = item[key];
      return !modelValueSet.value.has(value);
    });
  });

  // 过滤函数
  const targetData = computed(() => {
    if (props.targetOrder === 'original') {
      return props.data.filter((item) => {
        const key = propsAlias.value.key;
        const value = item[key];
        return modelValueSet.value.has(value);
      });
    } else {
      return props.modelValue.reduce(
        (arr, cur) => {
          const val = props.dataObj.value[cur];
          if (val) {
            arr.push(val);
          }
          return arr;
        },
        []
      );
    }
  });

  return {
    sourceData,
    targetData,
  }
}
