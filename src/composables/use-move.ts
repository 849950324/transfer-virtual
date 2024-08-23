import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from 'element-plus'
import { usePropsAlias } from './use-props-alias'

import type { SetupContext } from 'vue'
import type {
  TransferCheckedState,
  TransferDataItem,
  TransferDirection,
  TransferEmits,
  TransferKey,
  TransferProps,
} from '../transfer'

export const useMove = (
  props: TransferProps,
  checkedState: TransferCheckedState,
  emit: SetupContext<TransferEmits>['emit']
) => {
  const propsAlias = usePropsAlias(props)

  const _emit = (
    value: TransferKey[],
    direction: TransferDirection,
    movedKeys: TransferKey[]
  ) => {
    emit(UPDATE_MODEL_EVENT, value)
    emit(CHANGE_EVENT, value, direction, movedKeys)
  }

  const addToLeft = () => {
    // 获取当前值的副本以避免修改原始数据
    const currentValue = [...props.modelValue];

    // 创建一个临时数组用于存储要移除的元素
    const itemsToRemove:any = [];

    // 遍历 rightChecked 数组
    checkedState.rightChecked.forEach((item) => {
        const index = currentValue.indexOf(item);
        if (index > -1) {
            // 记录需要移除的元素
            itemsToRemove.push(item);
        }
    });

    // 使用 filter 方法来移除元素，这样更高效
    const filteredArray = currentValue.filter(item => !itemsToRemove.includes(item));

    // 更新值
    _emit(filteredArray, 'left', checkedState.rightChecked);
}

const addToRight = () => {
  let currentValue = props.modelValue.slice()
  // 将数组转换为集合以加快查找速度
  const leftCheckedSet = new Set(checkedState.leftChecked);
  const modelValueSet = new Set(props.modelValue);
    // 筛选和映射需要移动的items
    const itemsToBeMoved = props.data
    .filter((item: TransferDataItem) => {
      // 确保密钥存在于项目中
      const itemKey = item[propsAlias.value.key];
      // 检查item是否已被选中，并且尚未在目标列表中
      return leftCheckedSet.has(itemKey) && !modelValueSet.has(itemKey);
    })
    .map((item: TransferDataItem) => item[propsAlias.value.key]);

  currentValue =
    props.targetOrder === 'unshift'
      ? itemsToBeMoved.concat(currentValue)
      : currentValue.concat(itemsToBeMoved)

  if (props.targetOrder === 'original') {
    const currentValueSet = new Set(currentValue);
    currentValue = props.data
     .filter((item) => currentValueSet.has(item[propsAlias.value.key]))
     .map((item) => item[propsAlias.value.key]);
  }

  _emit(currentValue, 'right', checkedState.leftChecked)
}
// const addToRight = () => {
//   let currentValue = props.modelValue.slice()

//   const itemsToBeMoved = props.data
//     .filter((item: TransferDataItem) => {
//       const itemKey = item[propsAlias.value.key]
//       return (
//         checkedState.leftChecked.includes(itemKey) &&
//         !props.modelValue.includes(itemKey)
//       )
//     })
//     .map((item) => item[propsAlias.value.key])

//   currentValue =
//     props.targetOrder === 'unshift'
//       ? itemsToBeMoved.concat(currentValue)
//       : currentValue.concat(itemsToBeMoved)

//   if (props.targetOrder === 'original') {
//     currentValue = props.data
//       .filter((item) => currentValue.includes(item[propsAlias.value.key]))
//       .map((item) => item[propsAlias.value.key])
//   }

//   _emit(currentValue, 'right', checkedState.leftChecked)
// }

  return {
    addToLeft,
    addToRight,
  }
}
